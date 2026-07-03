# CaseWatch Backend

## Local setup

cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # fill in your credentials
uvicorn main:app --reload

## Test it works

Open http://localhost:8000/api/health
You should see: {"status": "ok", "version": "0.1.0"}
