import os
import json
from typing import Optional, Any, Dict
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

class AISummarySchema(BaseModel):
    caseOverview: str = Field(description="A brief explanation of what the case is about, who is fighting whom, and the basic situation in 2-4 short sentences.")
    currentStatus: str = Field(description="Explain the present stage of the case, what it means practically, and how long it has been going on in 2-4 short sentences.")
    nextHearing: str = Field(description="Explain the upcoming hearing date, why it matters, and what to realistically expect in 2-4 short sentences.")
    whatThisMeans: str = Field(description="Explain the current situation and implications in plain language in 2-4 short sentences.")
    recommendedNextSteps: str = Field(description="Give practical, actionable guidance for the party involved in 2-4 short sentences.")
    requiredDocuments: list[str] = Field(description="A list of standard Indian court document names the party may need to prepare or submit, based on the case stage, acts, and proceeding type. Choose only from commonly known documents such as: Affidavit, Vakalatnama, Written Statement, Rejoinder, Caveat Petition, Stay Application, Execution Petition, Interlocutory Application, Surety Bond, Character Certificate. Return empty list [] if unclear.")

async def generate_case_summary(ctx: dict, cnr: str, case_data: dict) -> dict:
    cnr = cnr.strip().upper()
    cache_key = f"casewatch:summary:{cnr}"
    CACHE_TTL = 604800
    
    redis_client = ctx.get('redis')
    if redis_client:
        try:
            cached_val = await redis_client.get(cache_key)
            if cached_val:
                if isinstance(cached_val, bytes):
                    cached_val = cached_val.decode('utf-8')
                parsed_data = json.loads(cached_val)
                summary = {
                    "caseOverview": parsed_data.get("caseOverview", ""),
                    "currentStatus": parsed_data.get("currentStatus", ""),
                    "nextHearing": parsed_data.get("nextHearing", ""),
                    "whatThisMeans": parsed_data.get("whatThisMeans", ""),
                    "recommendedNextSteps": parsed_data.get("recommendedNextSteps", ""),
                    "requiredDocuments": parsed_data.get("requiredDocuments", []),
                }
                return {
                    "cnr": cnr,
                    "summary": summary,
                    "source": "cache"
                }
        except Exception as e:
            print(f"Redis cache read error in task: {e}")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return {
            "cnr": cnr,
            "error": "Gemini API key is missing."
        }

    prompt = f"""
You are a legal assistant that explains Indian court cases in simple English for non-lawyers.

STRICT RULES:
- Use ONLY the data provided below. Do not invent, infer, or assume ANY fact not explicitly present.
- If a field is null, empty, or missing, write "Not available in records" for that point.
- Do not guess names, charges, FIR numbers, or case background from context.
- For requiredDocuments: consider the case_type AND stage together. 
  Never suggest a document that matches the case_type itself (e.g. if case_type is "BA", do not suggest "Bail Application").
  Only suggest documents needed for upcoming procedural steps at the current stage.
- If status field contains "Decided", "Disposed", "Decree", or "Closed", OR if a decision_date is present in the data, clearly state in caseOverview and currentStatus that this case has been DECIDED and is no longer active. Do not suggest a next hearing date for decided cases. For requiredDocuments return [] for decided/disposed cases.

--- CASE DATA ---
{case_data}

--- OUTPUT FORMAT ---
Return a JSON object with exactly these 6 keys:
1. "caseOverview" - What this case is about, based only on provided fields
2. "currentStatus" - Current stage and recent hearing activity
3. "nextHearing" - Next hearing date and what to expect
4. "whatThisMeans" - Plain English explanation for a non-lawyer
5. "recommendedNextSteps" - Practical steps for the party involved
6. "requiredDocuments" - List of documents needed for current/upcoming stage.
   Choose only from: ["Affidavit", "Vakalatnama", "Written Statement", 
   "Rejoinder", "Caveat Petition", "Stay Application", "Execution Petition", 
   "Interlocutory Application", "Surety Bond", "Character Certificate"]
   Return [] if stage is unclear or no documents are needed.
"""

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AISummarySchema,
            )
        )
        
        raw_text = (response.text or "").strip()
        parsed_data = json.loads(raw_text)
        
        summary = {
            "caseOverview": parsed_data.get("caseOverview", ""),
            "currentStatus": parsed_data.get("currentStatus", ""),
            "nextHearing": parsed_data.get("nextHearing", ""),
            "whatThisMeans": parsed_data.get("whatThisMeans", ""),
            "recommendedNextSteps": parsed_data.get("recommendedNextSteps", ""),
            "requiredDocuments": parsed_data.get("requiredDocuments", [])
        }
        
        if redis_client:
            try:
                # Strip source key if present before storing
                data_to_store = {k: v for k, v in summary.items() if k != "source"}
                await redis_client.setex(cache_key, CACHE_TTL, json.dumps(data_to_store))
            except Exception as e:
                print(f"Redis cache write error in task: {e}")
                
        return {
            "cnr": cnr,
            "summary": summary,
            "source": "generated"
        }
    except Exception as e:
        return {
            "cnr": cnr,
            "error": str(e)
        }
