import os
import httpx
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Optional
from datetime import datetime

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
ECOURTS_API_KEY = os.getenv("ECOURTS_API_KEY")
ECOURTS_BASE = "https://webapi.ecourtsindia.com"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="CaseWatch API", version="0.4.0")

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

# ─────────────────────────────────────────
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


# ─────────────────────────────────────────
# Courts Search
# ─────────────────────────────────────────

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
        categories = sorted(set(row["category"] for row in result.data if row["category"]))
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


# ─────────────────────────────────────────
# Case Lookup  ← REAL eCourts API
# ─────────────────────────────────────────

def _normalize_case(raw: dict, cnr: str) -> dict:
    """
    Maps ecourtsindia.com response → our unified schema.
    """
    d = raw.get("data", {}).get("courtCaseData", {})

    # Extract petitioners / respondents
    petitioners = d.get("petitioners", [])
    respondents = d.get("respondents", [])

    petitioner = petitioners[0] if petitioners else "N/A"
    respondent = respondents[0] if respondents else "N/A"

    # Next hearing — last entry in history
    history = d.get("historyOfCaseHearings", [])
    next_hearing = None
    if history:
        last = history[-1]
        next_hearing = last.get("hearingDate")

    return {
        "cnr": cnr,
        "case_number": d.get("caseNumber"),
        "petitioner": petitioner,
        "respondent": respondent,
        "court_name": d.get("courtName"),
        "court_type": "District Court",
        "state": d.get("state"),
        "district": d.get("district"),
        "status": d.get("stageOfCaseRaw") or d.get("purpose"),
        "next_hearing": next_hearing,
        "last_hearing": d.get("lastHearingDate"),
        "history": [
            {
                "hearing_date": h.get("hearingDate"),
                "purpose": h.get("purposeOfListing"),
                "judge": h.get("judge"),
                "business_on_date": h.get("businessOnDate"),
            }
            for h in history
        ],
        "source": "ecourtsindia",
    }


def _get_cached_case(cnr: str):
    try:
        result = supabase.table("cases").select("*").eq("cnr", cnr).execute()
        if result.data:
            return result.data[0]
    except Exception:
        pass
    return None


def _is_fresh(cached: dict, ttl_hours: int = 6) -> bool:
    last = cached.get("last_scraped_at")
    if not last:
        return False
    from datetime import timedelta
    scraped = datetime.fromisoformat(last.replace("Z", "+00:00"))
    diff = datetime.now(scraped.tzinfo) - scraped
    return diff.total_seconds() < ttl_hours * 3600


def _upsert_case(data: dict):
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
        "last_scraped_at": datetime.utcnow().isoformat(),
    }, on_conflict="cnr").execute()


@app.post("/api/cases/lookup")
async def lookup_case(payload: dict):
    cnr = payload.get("cnr", "").strip().upper()
    party_name = payload.get("party_name", "").strip()

    if not cnr:
        raise HTTPException(status_code=400, detail="CNR number required")

    # 1. Cache check
    cached = _get_cached_case(cnr)
    if cached and _is_fresh(cached):
        result = cached.get("raw_json") or cached
        result["from_cache"] = True
        return result

    # 2. Fetch from eCourts API
    try:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.get(
                f"{ECOURTS_BASE}/api/partner/case/{cnr}",
                headers={"Authorization": f"Bearer {ECOURTS_API_KEY}"}
            )

        if resp.status_code == 404:
            raise HTTPException(status_code=404, detail="Case not found. Please check your CNR number.")

        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail=f"eCourts API error: {resp.status_code}")

        raw = resp.json()

    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="eCourts API timed out. Please try again.")

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