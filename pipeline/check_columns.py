import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()
load_dotenv("../.env")
load_dotenv("../backend/.env")

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")

supabase = create_client(url, key)

try:
    res = supabase.table("haryana_services").select("*").limit(1).execute()
    if res.data:
        print("Columns in haryana_services table:")
        for key in res.data[0].keys():
            print(f" - {key}")
    else:
        print("No rows found in haryana_services table to inspect columns.")
except Exception as e:
    print("Error querying columns:", e)
