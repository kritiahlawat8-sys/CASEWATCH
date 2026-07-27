"""
worker.py — Redis Queue worker for AI summary generation.

Run this separately from uvicorn:
    python -m app.worker

It processes jobs from the "summary" queue one at a time,
which naturally caps the Gemini call rate to 1 per job execution.
For higher throughput, run multiple workers but keep concurrency
below your Gemini RPM quota.
"""

import os
import sys
import logging
from redis import Redis
from rq import Queue, Connection

if sys.platform == "win32":
    from rq import SimpleWorker
    class DummyDeathPenalty:
        def __init__(self, timeout, exception, **kwargs):
            pass
        def __enter__(self):
            pass
        def __exit__(self, type, value, traceback):
            pass
    class WindowsWorker(SimpleWorker):
        death_penalty_class = DummyDeathPenalty
    Worker = WindowsWorker
else:
    from rq import Worker

from dotenv import load_dotenv

load_dotenv(override=True)

logging.basicConfig(level=logging.INFO, format="%(asctime)s [WORKER] %(message)s")
logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")


def get_redis():
    return Redis.from_url(REDIS_URL, decode_responses=False)


def run_worker():
    conn = get_redis()
    with Connection(conn):
        worker = Worker(
            queues=["summary"],
            connection=conn,
        )
        logger.info("Worker started. Listening on queue: summary")
        worker.work(with_scheduler=True)


if __name__ == "__main__":
    run_worker()
