import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = FastAPI(title="CaseWatch API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "CaseWatch API is running"}

@app.get("/api/health")
def health():
    return {"status": "ok", "version": "0.2.0"}

@app.get("/api/courts/ping-db")
def ping_db():
    # Simple check that DB connection works
    result = supabase.table("courts").select("id").limit(1).execute()
    return {"db": "connected", "sample": result.data}
