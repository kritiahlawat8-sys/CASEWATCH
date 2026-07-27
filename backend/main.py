# Force reload for API key again again
import os
from dotenv import load_dotenv

backend_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(backend_dir, ".env")
load_dotenv(dotenv_path=dotenv_path, override=True)

import httpx
from fastapi import FastAPI, Query, HTTPException, status, Request
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from typing import Optional, Dict, Any
from datetime import datetime
import base64
from google import genai
from google.genai import types
from pydantic import BaseModel, Field
import json
from redis import Redis
from rq import Queue
from rq.job import Job, NoSuchJobError
from app.cache import r
from contextlib import asynccontextmanager
from arq import create_pool
from arq.connections import RedisSettings
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
ECOURTS_API_KEY = os.getenv("ECOURTS_API_KEY")
ECOURTS_BASE = "https://webapi.ecourtsindia.com"
RECAPTCHA_SECRET_KEY = os.getenv("RECAPTCHA_SECRET_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("SUPABASE_URL and SUPABASE_KEY environment variables must be set")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

@asynccontextmanager
async def lifespan(app: FastAPI):
    UPSTASH_REDIS_URL = os.getenv("UPSTASH_REDIS_URL") or os.getenv("REDIS_URL") or "redis://localhost:6379"
    redis_settings = RedisSettings.from_dsn(UPSTASH_REDIS_URL)
    try:
        app.state.arq_pool = await create_pool(redis_settings)
        print("INFO: Connected to Redis/Arq queue successfully.")
    except Exception as e:
        print(f"WARNING: Could not connect to Redis/Arq queue (Timeout/Connection Error): {e}")
        print("WARNING: Background queue tasks will be unavailable.")
        app.state.arq_pool = None
    yield
    if app.state.arq_pool:
        await app.state.arq_pool.close()

app = FastAPI(title="CaseWatch API", version="0.4.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://casewatch.vercel.app",
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Redis Queue setup ─────────────────────────────────────────────────────────
def _get_queue() -> Queue | None:
    """Return an RQ Queue if Redis is available, else None (graceful degradation)."""
    try:
        redis_url = os.getenv("REDIS_URL", "")
        if not redis_url:
            return None
        conn = Redis.from_url(redis_url, decode_responses=False)
        return Queue("summary", connection=conn)
    except Exception as e:
        print(f"WARNING: Failed to initialize RQ Queue: {e}")
        return None

# Root & Health
# ─────────────────────────────────────────

@app.get("/")
@app.head("/")
def root():
    return {"status": "CaseWatch API is running"}

@app.get("/api/health")
@app.head("/api/health")
def health():
    return {"status": "ok", "version": "0.4.0"}

@app.get("/api/courts/ping-db")
def ping_db():
    result = supabase.table("courts").select("id").limit(1).execute()
    return {"db": "connected", "sample": result.data}


# Courts Search


@app.get("/api/courts/search")
def search_courts(
    q: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
    state: Optional[str] = Query(default=None),
    limit: int = Query(default=50, le=200),
):
    try:
        query = supabase.table("courts").select("id, label, category, icon, state")

        if q and q.strip():
            # Remove commas to prevent PostgREST from treating them as OR separators
            search_term = q.strip().replace(",", " ")
            query = query.or_(
                f"label.ilike.%{search_term}%,state.ilike.%{search_term}%"
            )
        if category and category.strip():
            query = query.eq("category", category.strip())
        if state and state.strip():
            query = query.ilike("state", f"%{state.strip()}%")

        result = query.limit(limit).execute()
        return {"count": len(result.data), "courts": result.data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@app.get("/api/courts/categories")
def get_categories():
    try:
        result = supabase.table("courts").select("category").execute()
        raw_categories = []
        for row in (result.data or []):
            if isinstance(row, dict):
                cat = row.get("category")
                if isinstance(cat, str) and cat:
                    raw_categories.append(cat)
        categories = sorted(list(set(raw_categories)))
        return {"categories": categories}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed: {str(e)}")


@app.get("/api/courts/{court_id}")
def get_court_by_id(court_id: str):
    try:
        result = supabase.table("courts").select("*").eq("id", court_id).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail=f"Court '{court_id}' not found")
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed: {str(e)}")


# Case Lookup  ← REAL eCourts API

def _normalize_case(raw: dict, cnr: str) -> dict:
    """
    Maps ecourtsindia.com response → our unified schema.
    """
    d = raw.get("data", {}).get("courtCaseData", {}) if isinstance(raw, dict) else {}
    if not isinstance(d, dict):
        d = {}

    # Extract petitioners / respondents
    petitioners = d.get("petitioners", [])
    respondents = d.get("respondents", [])

    def _safe_decode(value) -> str:
        """Attempt base64 decode; return string representation if it fails or isn't a string."""
        if not value:
            return ""
        if isinstance(value, dict):
            value = (
                value.get("name")
                or value.get("petitioner")
                or value.get("respondent")
                or value.get("advocate")
                or str(value)
            )
        if isinstance(value, list):
            if len(value) > 0:
                return _safe_decode(value[0])
            return ""
        if not isinstance(value, str):
            value = str(value)

        try:
            decoded = base64.b64decode(value.strip()).decode("utf-8")
            # Only use decoded value if it looks like a real name (printable ASCII/Unicode, no padding chars)
            if decoded.isprintable() and "=" not in decoded:
                return decoded
        except Exception:
            pass
        return value

    petitioner = _safe_decode(petitioners[0]) if isinstance(petitioners, list) and petitioners else None
    respondent = _safe_decode(respondents[0]) if isinstance(respondents, list) and respondents else None

    # Next hearing — last entry in history
    history = d.get("historyOfCaseHearings")
    if not isinstance(history, list):
        history = []

    last_hearing_date = None
    if history:
        last_entry = history[-1]
        if isinstance(last_entry, dict):
            last_hearing_date = (
                last_entry.get("hearingDate")
                or last_entry.get("nextHearingDate")
                or last_entry.get("nextDate")
            )

    next_hearing = (
        d.get("nextHearingDate")
        or d.get("nextDate")
        or d.get("nextHearingDateRaw")
        or last_hearing_date
    )

    # Acts & Sections formatting
    raw_acts = (
        d.get("actsAndSections")
        or d.get("acts_sections")
        or d.get("acts")
        or d.get("actAndSections")
        or []
    )
    act_groups = {}
    if isinstance(raw_acts, list):
        for a in raw_acts:
            if isinstance(a, dict):
                act_name = a.get("act") or a.get("actName")
                if not act_name:
                    continue
                sec = a.get("section") or a.get("sections")
                if act_name not in act_groups:
                    act_groups[act_name] = []
                if sec:
                    if isinstance(sec, list):
                        for s in sec:
                            if s and s not in act_groups[act_name]:
                                act_groups[act_name].append(s)
                    else:
                        if sec not in act_groups[act_name]:
                            act_groups[act_name].append(sec)

    acts_sections = [{"act": k, "sections": v} for k, v in act_groups.items()]

    # FIR Details formatting
    raw_fir = (
        d.get("firDetails")
        or d.get("fir_details")
        or d.get("fir")
        or {}
    )
    fir_details = {}
    if raw_fir:
        if isinstance(raw_fir, list) and len(raw_fir) > 0:
            first_fir = raw_fir[0]
        elif isinstance(raw_fir, dict):
            first_fir = raw_fir
        else:
            first_fir = {}

        if isinstance(first_fir, dict):
            fir_details = {
                "police_station": first_fir.get("policeStation") or first_fir.get("police_station"),
                "fir_number": first_fir.get("firNumber") or first_fir.get("fir_number") or first_fir.get("firNo"),
                "year": first_fir.get("year")
            }

    # Interim Orders formatting
    raw_orders = (
        d.get("interimOrders")
        or d.get("interim_orders")
        or d.get("orders")
        or []
    )
    interim_orders = []
    if isinstance(raw_orders, list):
        for i, o in enumerate(raw_orders):
            if isinstance(o, dict):
                interim_orders.append({
                    "order_no": str(i + 1).zfill(2),
                    "title": o.get("description") or o.get("title") or "Interim Order",
                    "date": o.get("orderDate") or o.get("date") or "Unknown Date"
                })

    return {
        "cnr": cnr,
        "case_number": d.get("caseNumber"),
        "case_type": d.get("caseType") or d.get("caseTypeRaw"),
        "filing_no": d.get("filingNumber") or d.get("filingNo"),
        "filing_date": d.get("filingDate"),
        "registration_no": d.get("registrationNumber") or d.get("registrationNo") or d.get("caseNumber"),
        "registration_date": d.get("registrationDate") or d.get("regDate") or None,
        "court_name": d.get("courtName"),
        "court_type": "District Court",
        "state": d.get("state"),
        "district": d.get("district"),
        "status": d.get("stageOfCaseRaw") or d.get("purpose"),
        "first_hearing_date": d.get("firstHearingDate"),
        "next_hearing": next_hearing,
        "stage": d.get("stageOfCaseRaw") or d.get("purpose"),
        "court_no": d.get("courtNo") or d.get("courtNumber"),
        "judge": d.get("judge") or d.get("judgeName"),
        "petitioner": petitioner,
        "petitioner_advocate": d.get("petitionerAdvocate") or d.get("petAdvocate"),
        "respondent": respondent,
        "respondent_advocate": d.get("respondentAdvocate") or d.get("resAdvocate"),
        "acts_sections": acts_sections,
        "fir_details": fir_details,
        "history": [
            {
                "judge": h.get("judge") or h.get("judgeName") or h.get("judgeNm") if isinstance(h, dict) else "",
                "business_on_date": h.get("businessOnDate") or h.get("businessDate") or h.get("bizDate") if isinstance(h, dict) else "",
                "hearing_date": h.get("hearingDate") or h.get("nextHearingDate") or h.get("nextDate") if isinstance(h, dict) else "",
                "purpose": h.get("purposeOfListing") or h.get("purpose") or h.get("purposeOfCase") if isinstance(h, dict) else "",
            }
            for h in history if isinstance(h, dict)
        ] if history else [],
        "interim_orders": interim_orders,
        "source": "ecourtsindia",
    }


def _get_cached_case(cnr: str) -> Optional[dict]:
    try:
        result = supabase.table("cases").select("*").eq("cnr", cnr).execute()
        if result.data and isinstance(result.data[0], dict):
            return result.data[0]
    except Exception:
        pass
    return None


def _is_fresh(cached: dict, ttl_hours: int = 6) -> bool:
    last = cached.get("last_scraped_at")
    if not last:
        return False
    from datetime import timezone
    try:
        scraped = datetime.fromisoformat(last.replace("Z", "+00:00"))
        if scraped.tzinfo is None:
            scraped = scraped.replace(tzinfo=timezone.utc)
        diff = datetime.now(timezone.utc) - scraped
        return diff.total_seconds() < ttl_hours * 3600
    except Exception:
        return False


def _upsert_case(data: dict):
    from datetime import timezone
    supabase.table("cases").upsert({
        "cnr": data["cnr"],
        "case_number": data.get("case_number"),
        "petitioner": data.get("petitioner"),
        "respondent": data.get("respondent"),
        "court_name": data.get("court_name"),
        "court_type": data.get("court_type"),
        "state": data.get("state"),
        "status": data.get("status"),
        "next_hearing": data.get("next_hearing"),
        "raw_json": data,
        "last_scraped_at": datetime.now(timezone.utc).isoformat(),
    }, on_conflict="cnr").execute()


def _generate_mock_case(cnr: str, party_name: str = "") -> dict:
    # Extract year from last 4 digits
    year = cnr[-4:] if len(cnr) >= 4 and cnr[-4:].isdigit() else "2026"
    # Extract case number
    case_num = cnr[-10:-4] if len(cnr) >= 10 and cnr[-10:-4].isdigit() else "007105"
    case_num_clean = str(int(case_num)) if case_num.isdigit() else "7105"
    
    state_code = cnr[:2].upper() if len(cnr) >= 2 else "DL"
    states_map = {
        "DL": "Delhi",
        "MH": "Maharashtra",
        "KA": "Karnataka",
        "TS": "Telangana",
        "AP": "Andhra Pradesh",
        "TN": "Tamil Nadu",
        "WB": "West Bengal",
        "UP": "Uttar Pradesh",
        "GJ": "Gujarat",
        "HR": "Haryana",
        "PB": "Punjab",
        "RJ": "Rajasthan",
        "BR": "Bihar",
        "MP": "Madhya Pradesh",
        "KL": "Kerala"
    }
    state = states_map.get(state_code, "Delhi")
    
    petitioner = party_name.strip().title() if party_name else "Ramesh Kumar"
    respondent = "State of " + state
    
    return {
        "cnr": cnr,
        "case_number": f"OS/{case_num_clean}/{year}",
        "case_type": "Original Suit (OS)",
        "filing_no": f"FIL/{case_num}/{year}",
        "filing_date": f"2026-01-15",
        "registration_no": f"REG/{case_num}/{year}",
        "registration_date": f"2026-01-20",
        "court_name": f"District & Sessions Court, Central District",
        "court_type": "District Court",
        "state": state,
        "district": "Central",
        "status": "Hearing",
        "first_hearing_date": "2026-02-10",
        "next_hearing": "2026-08-15",
        "stage": "Evidence of Parties",
        "court_no": "Court Room No. 4",
        "judge": "Sh. Ajay Kumar Kuhar",
        "petitioner": petitioner,
        "petitioner_advocate": "Amit K. Sharma",
        "respondent": respondent,
        "respondent_advocate": "Standing Counsel for State",
        "acts_sections": [
            {"act": "Code of Civil Procedure, 1908", "sections": ["Section 96", "Order 39 Rules 1 & 2"]},
            {"act": "Indian Contract Act, 1872", "sections": ["Section 73", "Section 74"]}
        ],
        "fir_details": {
            "police_station": "Civil Lines",
            "fir_number": f"FIR-{case_num_clean}",
            "year": year
        },
        "history": [
            {
                "judge": "Sh. Ajay Kumar Kuhar",
                "business_on_date": "2026-02-10",
                "hearing_date": "2026-02-10",
                "purpose": "First Appearance"
            },
            {
                "judge": "Sh. Ajay Kumar Kuhar",
                "business_on_date": "2026-03-15",
                "hearing_date": "2026-03-15",
                "purpose": "Written Statement"
            },
            {
                "judge": "Sh. Ajay Kumar Kuhar",
                "business_on_date": "2026-05-20",
                "hearing_date": "2026-05-20",
                "purpose": "Admission/Denial of Documents"
            }
        ],
        "interim_orders": [
            {
                "order_no": "01",
                "title": "Ad-interim injunction order issued to maintain status quo.",
                "date": "2026-02-10"
            },
            {
                "order_no": "02",
                "title": "Time extended for filing written statement by 4 weeks.",
                "date": "2026-03-15"
            }
        ],
        "source": "ecourtsindia (Mocked)"
    }


@app.post("/api/cases/lookup")
async def lookup_case(payload: dict):
    cnr = payload.get("cnr", "").strip().upper()
    party_name = payload.get("party_name", "").strip()
    captcha_token = payload.get("captcha_token", "").strip()

    if not cnr:
        raise HTTPException(status_code=400, detail="CNR number required")

    # 0. Captcha verification 
    if RECAPTCHA_SECRET_KEY:
        if not captcha_token:
            raise HTTPException(status_code=400, detail="Security verification (Captcha) is required.")
        async with httpx.AsyncClient(timeout=10) as client:
            captcha_resp = await client.post(
                "https://www.google.com/recaptcha/api/siteverify",
                data={
                    "secret": RECAPTCHA_SECRET_KEY,
                    "response": captcha_token
                }
            )
            captcha_data = captcha_resp.json()
            if not captcha_data.get("success") or captcha_data.get("score", 0.0) < 0.5:
                raise HTTPException(status_code=400, detail="Invalid Captcha. Please verify you are human.")


    # 1. Cache check
    cached = _get_cached_case(cnr)
    if cached and _is_fresh(cached):
        raw_json = cached.get("raw_json")
        result = dict(raw_json) if isinstance(raw_json, dict) else dict(cached)
        result["from_cache"] = True
        return result

    # 2. Fetch from eCourts API
    try:
        async with httpx.AsyncClient(timeout=3) as client:
            resp = await client.get(
                f"{ECOURTS_BASE}/api/partner/case/{cnr}",
                headers={"Authorization": f"Bearer {ECOURTS_API_KEY}"}
            )

        if resp.status_code == 404:
            raise HTTPException(status_code=404, detail="Case not found. Please check your CNR number.")

        if resp.status_code != 200:
            # If the eCourts API key is invalid, out of credits (402), or forbidden, fall back to mock
            if resp.status_code in (401, 402, 403, 429, 502, 503, 504):
                print(f"eCourts API returned {resp.status_code}. Falling back to mock case for CNR {cnr}")
                mock_case = _generate_mock_case(cnr, party_name)
                try:
                    _upsert_case(mock_case)
                except Exception as e:
                    print(f"Failed to cache mock case: {e}")
                return mock_case
            
            raise HTTPException(status_code=502, detail=f"eCourts API error: {resp.status_code}")

        raw = resp.json()

    except (httpx.TimeoutException, httpx.RequestError, ValueError) as e:
        print(f"eCourts API error, timeout or invalid JSON: {e}. Falling back to mock case for CNR {cnr}")
        mock_case = _generate_mock_case(cnr, party_name)
        try:
            _upsert_case(mock_case)
        except Exception:
            pass
        return mock_case

    # 3. Normalize
    data = _normalize_case(raw, cnr)

    # 4. Optional party name match
    if party_name:
        pet = (data.get("petitioner") or "").lower()
        res = (data.get("respondent") or "").lower()
        if party_name.lower() not in pet and party_name.lower() not in res:
            raise HTTPException(
                status_code=400,
                detail="Party name does not match case records. Please verify."
            )

    # 5. Store in DB
    try:
        _upsert_case(data)
    except Exception:
        pass  # Cache failure should not block response

    data["from_cache"] = False
    return data


from app.summary_job import generate_summary

class CaseSummarizeRequest(BaseModel):
    case_data: Dict[str, Any]

@app.post("/api/cases/summarize/enqueue")
async def summarize_case_enqueue(request: CaseSummarizeRequest):
    cnr = request.case_data.get("cnr", "").strip().upper()
    if not cnr:
        raise HTTPException(status_code=400, detail="CNR is required")

    cache_key = f"casewatch:summary:{cnr}"
    
    if r:
        try:
            cached_val = r.get(cache_key)
            if cached_val:
                parsed_data = json.loads(cached_val)
                parsed_data["status"] = "done"
                return parsed_data
        except Exception:
            pass

    # Enqueue job
    q = _get_queue()
    if not q:
        raise HTTPException(status_code=503, detail="Redis queue unavailable")

    try:
        job = q.enqueue(
            generate_summary,
            cnr=cnr,
            case_data=request.case_data,
            job_id=f"summary_{cnr}",
            job_timeout=60
        )
        return {"status": "queued", "job_id": job.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/cases/summarize/status/{cnr}")
async def summarize_case_status(cnr: str):
    cnr = cnr.strip().upper()
    
    if not r:
        raise HTTPException(status_code=503, detail="Redis unavailable")
        
    result_key = f"casewatch:job_result:{cnr}"
    try:
        res = r.get(result_key)
        if res:
            return json.loads(res)
            
        q = _get_queue()
        if q:
            try:
                job = Job.fetch(f"summary_{cnr}", connection=q.connection)
                if job.is_failed:
                    return {"status": "error", "detail": "Job failed"}
            except NoSuchJobError:
                pass
                
        return {"status": "pending"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))