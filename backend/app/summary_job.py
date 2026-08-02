"""
summary_job.py — The actual task executed by the RQ worker.

This function is imported by RQ and run in a separate process.
It calls Gemini, then writes the result (or error) back to Redis
so the FastAPI polling endpoint can pick it up.
"""

import os
import json
import time
import logging
from redis import Redis
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv(override=True)

logger = logging.getLogger(__name__)

# Key TTLs
RESULT_TTL   = 60 * 60        # 1 h — how long job result stays in Redis
SUMMARY_TTL  = 7 * 24 * 3600  # 7 d — how long the final summary is cached

# Gemini rate-limit: free tier = 15 RPM → 1 call every ~4 s is safe.
# Paid tier can be higher; adjust GEMINI_MIN_INTERVAL_SECONDS env var.
MIN_SECONDS_BETWEEN_CALLS = int(os.getenv("GEMINI_MIN_INTERVAL_SECONDS", "4"))



def _redis() -> Redis:
    url = os.getenv("REDIS_URL", "redis://localhost:6379")
    return Redis.from_url(url, decode_responses=True)


def _write_result(r: Redis, result_key: str, payload: dict):
    r.setex(result_key, RESULT_TTL, json.dumps(payload))


def generate_summary(cnr: str, case_data: dict) -> dict:
    """
    Called by the RQ worker. Returns the summary dict on success,
    or raises an exception (RQ will mark the job as failed).
    """
    r = _redis()

    # 1. Check the long-lived summary cache first
    summary_key = f"casewatch:summary:v2:{cnr}"
    result_key  = f"casewatch:job_result:{cnr}"

    cached = r.get(summary_key)
    if cached:
        result = json.loads(cached)
        result["source"] = "cache"
        _write_result(r, result_key, {"status": "done", "data": result})
        logger.info("Cache hit for %s — skipped Gemini call", cnr)
        return result

    # 2. Rate-limit guard using a Redis timestamp shared across all workers
    last_call_key = "casewatch:gemini:last_call_ts"
    last_call_ts  = r.get(last_call_key)
    if last_call_ts:
        elapsed = time.time() - float(last_call_ts)
        wait    = MIN_SECONDS_BETWEEN_CALLS - elapsed
        if wait > 0:
            logger.info("Rate-limit wait %.2fs before calling Gemini", wait)
            time.sleep(wait)

    # 3. Call Gemini
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set")

    client = genai.Client(api_key=api_key)

    # Extract Markdown texts
    order_texts = []
    for f in case_data.get("files", []):
        md = f.get("markdownContent")
        if md:
            order_texts.append(md)
            
    logger.info("Extracted %d markdown order texts for %s", len(order_texts), cnr)

    # Build prompt
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
{json.dumps(case_data, ensure_ascii=False)}

STRUCTURE YOUR RESPONSE AS EXACTLY THESE 7 SECTIONS (RETURN AS JSON ONLY):

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
    
    # Append extracted order texts if any
    if order_texts:
        combined_orders = "\n\n--- NEXT COURT ORDER ---\n\n".join(order_texts)
        prompt += f"\n\n--- COURT ORDERS TEXT ---\n{combined_orders}"

    contents = [prompt]

    logger.info("Calling Gemini API for CNR %s", cnr)
    # Record timestamp BEFORE the call so other workers know to wait
    r.set(last_call_key, str(time.time()), ex=60)

    try:
        response = client.models.generate_content(
            model='gemini-3.6-flash',
            contents=contents,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            ),
        )
        r.set(last_call_key, str(time.time()), ex=60)  # update after call too
    except Exception as exc:
        logger.error("Gemini call failed for %s: %s", cnr, exc)
        _write_result(r, result_key, {"status": "error", "detail": str(exc)})
        raise

    # 4. Parse & store
    raw_text = response.text.strip()
    parsed   = json.loads(raw_text)

    result = {
        "storyOfTheCase":           parsed.get("storyOfTheCase", ""),
        "whatEvidenceMeans":        parsed.get("whatEvidenceMeans", ""),
        "currentStatus":            parsed.get("currentStatus", ""),
        "nextHearingBreakdown":     parsed.get("nextHearingBreakdown", ""),
        "whatCourtIsAskingFromYou": parsed.get("whatCourtIsAskingFromYou", ""),
        "requiredDocuments":        parsed.get("requiredDocuments", []),
        "urgencyAlert":             parsed.get("urgencyAlert", ""),
        "ordersAnalyzed":           len(order_texts),
    }

    # Cache long-lived summary
    r.setex(summary_key, SUMMARY_TTL, json.dumps(result))

    # Write job result for polling
    result["source"] = "gemini"
    _write_result(r, result_key, {"status": "done", "data": result})

    logger.info("Summary generated and cached for %s", cnr)
    return result
