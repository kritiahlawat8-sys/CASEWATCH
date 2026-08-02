import os
from dotenv import load_dotenv
from arq.connections import RedisSettings

# Find .env relative to this file
backend_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(backend_dir, ".env")
load_dotenv(dotenv_path=dotenv_path, override=True)
from tasks.gemini_tasks import generate_case_summary

UPSTASH_REDIS_URL = os.getenv("UPSTASH_REDIS_URL") or os.getenv("REDIS_URL") or "redis://localhost:6379"

class WorkerSettings:
    functions = [generate_case_summary]
    redis_settings = RedisSettings.from_dsn(UPSTASH_REDIS_URL)
    max_jobs = 3
    job_timeout = 45
    keep_result = 3600
