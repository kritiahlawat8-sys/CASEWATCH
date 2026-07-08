import os
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Optional

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="CaseWatch API", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
# Root & Health
# ─────────────────────────────────────────

@app.get("/")
def root():
    return {"status": "CaseWatch API is running"}

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "0.3.0"}

@app.get("/api/courts/ping-db")
def ping_db():
    result = supabase.table("courts").select("id").limit(1).execute()
    return {"db": "connected", "sample": result.data}


# ─────────────────────────────────────────
# Courts Search  ←  THIS IS THE NEW PART
# ─────────────────────────────────────────

@app.get("/api/courts/search")
def search_courts(
    q: Optional[str] = Query(default=None, description="Search by court name, district, or state"),
    category: Optional[str] = Query(default=None, description="Filter by category e.g. High Court, District Court"),
    state: Optional[str] = Query(default=None, description="Filter by state"),
    limit: int = Query(default=50, le=200),
):
    """
    Search courts from Supabase.
    Replaces the client-side JS filter in indianCourts.ts.

    Examples:
      /api/courts/search?q=delhi
      /api/courts/search?q=delhi&category=District Court
      /api/courts/search?category=High Court&state=Maharashtra
    """
    try:
        query = supabase.table("courts").select("id, label, category, icon, state")

        # Text search — match against label OR state
        # Supabase ilike = case-insensitive LIKE
        if q and q.strip():
            # Remove commas to prevent PostgREST from treating them as OR separators
            search_term = q.strip().replace(",", " ")
            query = query.or_(
                f"label.ilike.%{search_term}%,state.ilike.%{search_term}%"
            )

        # Category filter — exact match
        if category and category.strip():
            query = query.eq("category", category.strip())

        # State filter — exact match
        if state and state.strip():
            query = query.ilike("state", f"%{state.strip()}%")

        result = query.limit(limit).execute()

        return {
            "count": len(result.data),
            "courts": result.data
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@app.get("/api/courts/categories")
def get_categories():
    """
    Returns all unique court categories.
    Frontend uses this to populate the filter pills
    (Supreme Court, High Court, District Court etc.)
    """
    try:
        result = supabase.table("courts").select("category").execute()
        categories = sorted(set(row["category"] for row in result.data if row["category"]))
        return {"categories": categories}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch categories: {str(e)}")


@app.get("/api/courts/{court_id}")
def get_court_by_id(court_id: str):
    """
    Get a single court by its ID.
    Called when user selects a court and moves to Step 2 (Enter CRN).
    """
    try:
        result = supabase.table("courts").select("*").eq("id", court_id).execute()

        if not result.data:
            raise HTTPException(status_code=404, detail=f"Court '{court_id}' not found")

        return result.data[0]

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch court: {str(e)}")