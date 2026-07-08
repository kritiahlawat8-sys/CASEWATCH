# CaseWatch Backend

## Setup

1. **Install requirements**
   ```bash
   cd backend
   python -m venv venv
   # Windows: venv\Scripts\activate
   # Mac/Linux: source venv/bin/activate
   pip install -r requirements.txt
   ```

2. **Configure env**
   Copy the example env file:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and fill in your Supabase URL and the `service_role` secret key.

3. **Database setup**
   - Copy the contents of `supabase_migration.sql` and run it in the Supabase SQL editor.
   - Back in the terminal, run the seed script to populate the courts (only need to run this once!):
     ```bash
     python seed_courts.py
     ```

## Run the server
```bash
uvicorn main:app --reload
```

Open `http://localhost:8000/api/courts/ping-db` to verify the DB is connected.
