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
    summary_key = f"casewatch:summary:{cnr}"
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

    prompt = f"""
You are a legal assistant that explains Indian court cases in simple English for non-lawyers.

STRICT RULES:
- Use ONLY the data provided below. Do not invent, infer, or assume ANY fact not explicitly present.
- If a field is null, empty, or missing, write "Not available in records" for that point.
- Do not guess names, charges, FIR numbers, or case background from context.
- For requiredDocuments: consider the case_type AND stage together.
  Never suggest a document that matches the case_type itself (e.g. if case_type is "BA", do not suggest "Bail Application").
  Only suggest documents needed for upcoming procedural steps at the current stage.
- If status field contains "Decided", "Disposed", "Decree", or "Closed", OR if a decision_date is present in the data,
  clearly state in caseOverview and currentStatus that this case has been DECIDED and is no longer active.
  Do not suggest a next hearing date for decided cases. For requiredDocuments return [] for decided/disposed cases.

--- CASE DATA ---
{json.dumps(case_data, ensure_ascii=False)}

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

    # Record timestamp BEFORE the call so other workers know to wait
    r.set(last_call_key, str(time.time()), ex=60)

    try:
        response = client.models.generate_content(
            model="gemini-3.1-flash-lite",
            contents=prompt,
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
        "caseOverview":         parsed.get("caseOverview", ""),
        "currentStatus":        parsed.get("currentStatus", ""),
        "nextHearing":          parsed.get("nextHearing", ""),
        "whatThisMeans":        parsed.get("whatThisMeans", ""),
        "recommendedNextSteps": parsed.get("recommendedNextSteps", ""),
        "requiredDocuments":    parsed.get("requiredDocuments", []),
    }

    # Cache long-lived summary
    r.setex(summary_key, SUMMARY_TTL, json.dumps(result))

    # Write job result for polling
    result["source"] = "gemini"
    _write_result(r, result_key, {"status": "done", "data": result})

    logger.info("Summary generated and cached for %s", cnr)
    return result
