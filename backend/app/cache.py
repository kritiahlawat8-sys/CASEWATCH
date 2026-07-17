import os
import redis

def get_redis_client():
    redis_url = os.getenv("REDIS_URL")
    if not redis_url or not redis_url.strip():
        return None
    try:
        return redis.from_url(redis_url, decode_responses=True)
    except Exception:
        return None

r = get_redis_client()
