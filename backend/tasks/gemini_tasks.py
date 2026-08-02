import os
import json
from typing import Optional, Any, Dict
from google import genai
from google.genai import types
from pydantic import BaseModel, Field

class AISummarySchema(BaseModel):
    storyOfTheCase: str = Field(description="Tell the complete story of what has happened in this case from day one until today. Cover when the case was filed, who filed it and against whom, what the charges are about, what happened at each hearing, what stage it reached and why, and what the court has done so far.")
    whatEvidenceMeans: str = Field(description="Explain what the Prosecution Evidence stage means in plain English, what the prosecution will actually DO in court, what cross-examination means, and what could happen if this stage goes well or badly.")
    currentStatus: str = Field(description="State exactly where the case stands today. What was decided or observed at the last hearing. What is pending.")
    nextHearingBreakdown: str = Field(description="Explain what will happen step by step in the courtroom on the upcoming date, what the judge will be looking at, what the lawyer must be prepared to do, and possible outcomes.")
    whatCourtIsAskingFromYou: str = Field(description="In very direct, simple language: what the court or the legal process currently REQUIRES from the accused or their family.")
    requiredDocuments: list[str] = Field(description="List only documents relevant to the current stage and case type. Choose only from: [Affidavit, Vakalatnama, Written Statement, Rejoinder, Caveat Petition, Stay Application, Execution Petition, Interlocutory Application, Surety Bond, Character Certificate].")
    urgencyAlert: str = Field(description="If the next hearing is close, if the accused is missing representation, or if any critical deadline is approaching, flag it clearly. Otherwise write 'No immediate alerts.'")

async def generate_case_summary(ctx: dict, cnr: str, case_data: dict) -> dict:
    cnr = cnr.strip().upper()
    cache_key = f"casewatch:summary:v2:{cnr}"
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
                    "storyOfTheCase": parsed_data.get("storyOfTheCase", ""),
                    "whatEvidenceMeans": parsed_data.get("whatEvidenceMeans", ""),
                    "currentStatus": parsed_data.get("currentStatus", ""),
                    "nextHearingBreakdown": parsed_data.get("nextHearingBreakdown", ""),
                    "whatCourtIsAskingFromYou": parsed_data.get("whatCourtIsAskingFromYou", ""),
                    "requiredDocuments": parsed_data.get("requiredDocuments", []),
                    "urgencyAlert": parsed_data.get("urgencyAlert", "")
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
You are a senior Indian legal advisor explaining a court case to the accused or their family member who has no legal background whatsoever.

Your job is NOT to produce a dry summary. You must tell the FULL STORY of what has happened in this case from start to finish, as if narrating it to someone sitting in front of you.

STRICT RULES:
- Do not invent any fact not present in the data or order documents.
- If something is not in the records, say "Not mentioned in available records."
- Never use legal jargon without immediately explaining it in brackets.
- Write in a warm, clear, direct tone — like a knowledgeable friend, not a lawyer filing a report.
- CRITICAL OVERRIDE: The system has verified the live court database. The absolute current stage is '{case_data.get('stage') or case_data.get('status', 'Unknown')}' and the absolute next hearing date is '{case_data.get('next_hearing', 'Unknown')}'. You MUST use EXACTLY these values for your Current Status and Next Hearing sections.
- Do NOT use the dates from the older PDFs for the current status.
- Base the background story on the PDFs, but the timeline must culminate in the exact stage and next hearing date provided above.
- Never start any section with "Based on the provided data..."
- Never use phrases like "it is noted that" or "as per records."
- Every legal term used MUST have a plain English explanation in the same sentence.
- Make the person feel informed and prepared, not confused or scared.

--- CASE DATA ---
{case_data}

STRUCTURE YOUR RESPONSE AS EXACTLY THESE 7 SECTIONS:

1. "storyOfTheCase"
   Tell the complete story of what has happened in this case from day one until today.
   Cover: when the case was filed, who filed it and against whom, what the charges are about (explain what each charge actually means in real-world terms), what happened at each hearing, what stage it reached and why, and what the court has done so far.
   This should feel like reading a case diary — the user should know EVERYTHING that has happened.

2. "whatEvidenceMeans"
   The case is in evidence stage. Explain clearly:
   - What "Prosecution Evidence" stage means in plain English
   - What the prosecution will actually DO in court on the next date (call witnesses, show documents, etc.)
   - What "cross-examination" means and why it matters for the accused
   - What could happen if this stage goes well or badly for the accused
   Avoid vague phrases. Be specific and human.

3. "currentStatus"
   State exactly where the case stands today. What was decided or observed at the last hearing. What is pending.

4. "nextHearingBreakdown"
   For the upcoming date, explain:
   - What will happen step by step in the courtroom
   - What the judge will be looking at
   - What the accused's lawyer must be prepared to do
   - What outcome is possible after this hearing

5. "whatCourtIsAskingFromYou"
   In very direct, simple language: what the court or the legal process currently REQUIRES from the accused or their family. What they must do, bring, prepare, or avoid doing. Treat this like a personal instruction list.

6. "requiredDocuments"
   List only documents relevant to the current stage and case type.
   For each document, explain in one line WHY it is needed right now.
   Choose only from: ["Affidavit", "Vakalatnama", "Written Statement", "Rejoinder",
   "Caveat Petition", "Stay Application", "Execution Petition",
   "Interlocutory Application", "Surety Bond", "Character Certificate"]
   Return [] if truly none are needed.

7. "urgencyAlert"
   If the next hearing is close, if the accused is missing representation, or if any critical deadline is approaching — flag it clearly here with a sense of urgency. Otherwise write "No immediate alerts."
"""

    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=AISummarySchema,
            )
        )
        
        raw_text = (response.text or "").strip()
        parsed_data = json.loads(raw_text)
        
        summary = {
            "storyOfTheCase": parsed_data.get("storyOfTheCase", ""),
            "whatEvidenceMeans": parsed_data.get("whatEvidenceMeans", ""),
            "currentStatus": parsed_data.get("currentStatus", ""),
            "nextHearingBreakdown": parsed_data.get("nextHearingBreakdown", ""),
            "whatCourtIsAskingFromYou": parsed_data.get("whatCourtIsAskingFromYou", ""),
            "requiredDocuments": parsed_data.get("requiredDocuments", []),
            "urgencyAlert": parsed_data.get("urgencyAlert", "")
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
