import os
import re
import csv
import sys
import json
import time
import logging
import argparse
import hashlib
import requests
from datetime import datetime, timezone
from dotenv import load_dotenv

# Try loading from various env configs
load_dotenv()
load_dotenv("../.env")
load_dotenv("../backend/.env")

from scraper import SaralScraper
from llm_parser import ServicePDFParser
from storage import SupabaseStorageManager
from supabase import create_client, Client

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler("pipeline.log", encoding="utf-8")
    ]
)
logger = logging.getLogger(__name__)

CHECKPOINT_FILE = "pipeline_checkpoint.json"

def get_supabase_client() -> Client:
    supabase_url = os.environ.get("SUPABASE_URL")
    supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")
    if not supabase_url or not supabase_key:
        raise ValueError("Supabase environment variables (SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY/SUPABASE_KEY) are not set.")
    return create_client(supabase_url, supabase_key)

def check_ollama():
    """
    Checks if local Ollama server is running.
    Exits script with clear message if Ollama is not active.
    """
    try:
        response = requests.get("http://localhost:11434", timeout=5)
        if response.status_code == 200:
            logger.info("Successfully connected to local Ollama server.")
            return True
    except Exception:
        pass
    logger.critical("Ollama not running. Run 'ollama serve'")
    sys.exit("Ollama not running. Run 'ollama serve'")

def load_services():
    """
    JSON Loading: Reads 'pipeline/services.json' file.
    """
    filepath = "services.json"
    if not os.path.exists(filepath):
        filepath = os.path.join("pipeline", "services.json")
    if not os.path.exists(filepath):
        filepath = "../pipeline/services.json"
        
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Could not locate services.json at '{filepath}'")
        
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def slugify(name):
    """
    Generate a clean, unique ID for each service: haryana_<slugified_name>
    """
    text = name.lower()
    text = re.sub(r'[^a-z0-9]+', '_', text)
    text = text.strip('_')
    return f"haryana_{text}"

def get_md5_hash(data_bytes):
    return hashlib.md5(data_bytes).hexdigest()

class CheckpointManager:
    def __init__(self, filepath=CHECKPOINT_FILE):
        self.filepath = filepath
        self.data = {"success": [], "failed": []}
        self.load()

    def load(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, "r") as f:
                    self.data = json.load(f)
                    if "success" not in self.data:
                        self.data["success"] = []
                    if "failed" not in self.data:
                        self.data["failed"] = []
                logger.info(f"Loaded checkpoint file. Success: {len(self.data['success'])}, Failed: {len(self.data['failed'])}")
            except Exception as e:
                logger.error(f"Error reading checkpoint file, resetting: {e}")
        else:
            logger.info("No checkpoint file found. Starting fresh.")

    def save(self):
        try:
            with open(self.filepath, "w") as f:
                json.dump(self.data, f, indent=2)
            logger.info(f"Checkpoint saved: {len(self.data['success'])} success, {len(self.data['failed'])} failed.")
        except Exception as e:
            logger.error(f"Error saving checkpoint: {e}")

    def mark_success(self, service_id):
        if service_id not in self.data["success"]:
            self.data["success"].append(service_id)
        if service_id in self.data["failed"]:
            self.data["failed"].remove(service_id)
        self.save()

    def mark_failed(self, service_id):
        if service_id not in self.data["failed"]:
            self.data["failed"].append(service_id)
        if service_id in self.data["success"]:
            self.data["success"].remove(service_id)
        self.save()

def upsert_to_supabase(supabase_client, payload):
    try:
        supabase_client.table("haryana_services").upsert(payload).execute()
        logger.info(f"Successfully upserted record for service_id '{payload['service_id']}' (status: '{payload['scrape_status']}')")
    except Exception as e:
        logger.error(f"Failed to upsert to Supabase for service_id '{payload['service_id']}': {e}")

def main():
    # Before starting, check if Ollama is running
    check_ollama()

    parser = argparse.ArgumentParser(description="Haryana Government Document Scraper & Extractor Pipeline")
    parser.add_argument("--limit", type=int, default=None, help="Limit execution to first N services only")
    parser.add_argument("--force", action="store_true", help="Reprocess everything (ignore checkpoints and skip PDF hash checks)")
    parser.add_argument("--retry-failed", action="store_true", help="Only process services currently marked as failed in checkpoints")
    args = parser.parse_args()

    # Load the CSV lookup if it exists
    csv_filename = os.environ.get("CSV_PATH") or "SCHEME(s) SERVICE(s) LIST.csv"
    csv_lookup = {}
    if os.path.exists(csv_filename):
        try:
            with open(csv_filename, mode='r', encoding='utf-8-sig') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    name = row.get("Service Name", "").strip()
                    if name:
                        csv_lookup[name] = row
            logger.info(f"Loaded ground-truth CSV metadata for {len(csv_lookup)} services.")
        except Exception as e:
            logger.error(f"Failed to read CSV metadata: {e}")

    # Load services dictionary from services.json
    try:
        services_dict = load_services()
        logger.info(f"Successfully loaded {len(services_dict)} services from services.json.")
    except Exception as e:
        logger.critical(f"Failed to load services.json: {e}")
        return

    # Initialize managers
    supabase_client = get_supabase_client()
    scraper = SaralScraper()
    pdf_parser = ServicePDFParser()
    storage_manager = SupabaseStorageManager()
    checkpoint = CheckpointManager()

    # Pre-fetch portal page to initialize dynamic state and extract dropdown maps
    try:
        scraper.get_initial_page()
    except Exception as e:
        logger.critical(f"Failed to fetch initial portal page to initialize state: {e}")
        return

    # Create a reversed department map for name lookups
    reversed_dept_map = {code: dept_name for dept_name, code in scraper.dept_map.items()}

    # Filter services based on checkpoint state and CLI flags
    services_to_process = []
    for service_name, service_value in services_dict.items():
        service_id = slugify(service_name)

        if args.force:
            services_to_process.append((service_name, service_value))
        elif args.retry_failed:
            if service_id in checkpoint.data["failed"]:
                services_to_process.append((service_name, service_value))
        else:
            # Checkpoint Integration: if marked as 'success', skip it unless it lacks the new parsed structure in Supabase
            if service_id in checkpoint.data["success"]:
                try:
                    res = supabase_client.table("haryana_services").select("llm_notes").eq("service_id", service_id).execute()
                    if res.data and res.data[0].get("llm_notes") and "application_steps" in res.data[0].get("llm_notes"):
                        continue
                    else:
                        logger.info(f"Service {service_name} marked as success in checkpoint but lacks the new parsed structure in Supabase. Processing to update.")
                except Exception as e:
                    logger.error(f"Error checking Supabase for migration update of {service_id}: {e}")
                    continue
            services_to_process.append((service_name, service_value))

    if args.limit is not None:
        services_to_process = services_to_process[:args.limit]

    logger.info(f"Scheduled {len(services_to_process)} services for execution.")
    if not services_to_process:
        logger.info("All services successfully completed. Exiting.")
        return

    success_count = 0
    failure_count = 0

    for idx, (service_name, service_code_raw) in enumerate(services_to_process):
        service_id = slugify(service_name)
        logger.info(f"\n--- Processing [{idx+1}/{len(services_to_process)}]: {service_name} ({service_id}) ---")

        # Wrap everything in a try-except block so failing service doesn't crash the loop
        try:
            # Split dropdown value to extract code details
            code_parts = service_code_raw.split(',')
            service_code = code_parts[0] if len(code_parts) > 0 else ""
            dept_code = code_parts[1] if len(code_parts) > 1 else ""

            # Retrieve ground truths (prioritizing CSV entries, falling back to scraped/derived values)
            csv_row = csv_lookup.get(service_name, {})
            department = csv_row.get("Department", "").strip() or reversed_dept_map.get(dept_code, "Unknown Department")
            
            rts_days_raw = csv_row.get("RTS Days", "0").strip()
            try:
                rts_timeline_days = int(rts_days_raw)
            except ValueError:
                rts_timeline_days = 0

            # Build initial Supabase record payload
            upsert_payload = {
                "service_id": service_id,
                "service_name": service_name,
                "department": department,
                "rts_timeline_days": rts_timeline_days,
                "is_verified": False,
                "last_scraped_at": datetime.now(timezone.utc).isoformat()
            }

            # Perform fuzzy matching to align targets
            matched_dept_name, matched_dept_code = scraper.fuzzy_match(department, scraper.dept_map, name_type="department")
            matched_service_name, matched_service_code = scraper.fuzzy_match(service_name, scraper.service_map, name_type="service")

            # Scraping and download loop with retries
            view_doc_url = None
            temp_filepath = None
            pdf_bytes = None
            
            retries = 3
            backoffs = [10, 20, 30]
            
            for attempt in range(retries):
                try:
                    if attempt > 0:
                        sleep_time = backoffs[attempt - 1]
                        logger.info(f"Retrying scraping attempt {attempt + 1} after {sleep_time}s backoff...")
                        time.sleep(sleep_time)
                    else:
                        time.sleep(3.0)

                    # Search service page to get ViewDoc url
                    view_doc_url = scraper.search_service(matched_service_name, matched_dept_code, matched_service_code)
                    if not view_doc_url:
                        raise ValueError("Service document ViewDoc URL not found in search response.")

                    # Download PDF
                    temp_filepath, pdf_bytes = scraper.download_pdf(view_doc_url, service_id)
                    break
                except Exception as e:
                    logger.warning(f"Attempt {attempt + 1} failed for scraping/downloading {service_id}: {e}")
                    if attempt == retries - 1:
                        raise e
                        
            if not pdf_bytes:
                raise ValueError("PDF content could not be retrieved.")

            # Change Detection check via MD5 Hash
            pdf_hash = get_md5_hash(pdf_bytes)
            skip_gemini = False
            stored_pdf_url = None
            
            if not args.force:
                try:
                    res = supabase_client.table("haryana_services").select("scrape_status, raw_html_hash, application_form_stored_url, llm_notes").eq("service_id", service_id).execute()
                    if res.data:
                        existing = res.data[0]
                        if existing.get("raw_html_hash") == pdf_hash and existing.get("scrape_status") == "success" and existing.get("llm_notes") and "application_steps" in existing.get("llm_notes"):
                            skip_gemini = True
                            stored_pdf_url = existing.get("application_form_stored_url")
                except Exception as e:
                    logger.error(f"Error querying existing record for hash checking: {e}")

            # Update basic payload with source and hash
            upsert_payload.update({
                "source_url": view_doc_url,
                "raw_html_hash": pdf_hash
            })

            if skip_gemini:
                logger.info("NO CHANGE — skipping LLM call")
                upsert_payload.update({
                    "scrape_status": "success",
                    "application_form_stored_url": stored_pdf_url,
                    "last_scraped_at": datetime.now(timezone.utc).isoformat()
                })
                upsert_to_supabase(supabase_client, upsert_payload)
                checkpoint.mark_success(service_id)
                success_count += 1
                
                if temp_filepath and os.path.exists(temp_filepath):
                    try:
                        os.remove(temp_filepath)
                    except Exception as ex:
                        logger.error(f"Error removing temp file {temp_filepath}: {ex}")
                
                # Strict pacing sleep
                logger.info("Applying pacing delay of 15 seconds...")
                time.sleep(15)
                continue

            # Extract text and parse using LLM
            time.sleep(4.5)
            
            gemini_data = None
            status = "success"
            notes = None
            
            # Extract PDF text
            pdf_text = pdf_parser.extract_text_from_pdf(temp_filepath)
            if not pdf_text or not pdf_text.strip():
                raise ValueError("Extracted PDF text is empty.")
            
            # Invoke LLM (Ollama local Qwen2.5)
            gemini_data = pdf_parser.parse_document_text(pdf_text)
            
            # Safety fallback for None / failed local response
            if gemini_data is None:
                gemini_data = {}
                status = "partial"
                notes = "Ollama API returned None/empty response"
            else:
                notes = gemini_data.get("llm_notes")

            # Upload to Supabase Storage
            uploaded_url = None
            try:
                uploaded_url = storage_manager.upload_pdf(temp_filepath, service_id)
            except Exception as e:
                logger.error(f"Supabase storage upload failed for {service_id}: {e}")

            # Map new LLM fields to existing database columns
            application_steps = gemini_data.get("application_steps") or []
            is_online = gemini_data.get("is_online", False)
            is_offline = gemini_data.get("is_offline", False)
            
            online_steps = []
            offline_steps = []
            
            for i, step in enumerate(application_steps):
                step_obj = {
                    "step_number": i + 1,
                    "title": step.split(":")[0] if ":" in step else f"Step {i+1}",
                    "description": step
                }
                if is_online:
                    step_obj["url"] = None
                    online_steps.append(step_obj)
                else:
                    step_obj["note"] = None
                    offline_steps.append(step_obj)

            # Serialize new parsed schema fields in llm_notes
            metadata_notes = {
                "application_steps": application_steps,
                "is_online": is_online,
                "is_offline": is_offline,
                "confidence": gemini_data.get("llm_confidence", 0.0),
                "original_notes": gemini_data.get("llm_notes")
            }
            notes_str = json.dumps(metadata_notes)

            # Final Database Upsert
            upsert_payload.update({
                "category": gemini_data.get("category"),
                "fee": gemini_data.get("fee"),
                "eligibility": gemini_data.get("eligibility"),
                "benefits": gemini_data.get("benefits"),
                "required_documents": gemini_data.get("required_documents"),
                "online_steps": online_steps if online_steps else gemini_data.get("online_steps"),
                "offline_steps": offline_steps if offline_steps else gemini_data.get("offline_steps"),
                "office_info": gemini_data.get("office_info"),
                "application_form_stored_url": uploaded_url or stored_pdf_url,
                "scrape_status": status,
                "llm_confidence": gemini_data.get("llm_confidence", 0.0),
                "llm_notes": notes_str
            })

            upsert_to_supabase(supabase_client, upsert_payload)
            
            if status == "success":
                checkpoint.mark_success(service_id)
                success_count += 1
                # Strict pacing delay between every successful service processing loop iteration
                logger.info("Applying pacing delay of 15 seconds...")
                time.sleep(15)
            else:
                checkpoint.mark_failed(service_id)
                failure_count += 1

        except Exception as err:
            err_msg = f"Service processing failed: {err}"
            logger.error(err_msg)
            
            # Try to log failure state to Supabase
            try:
                upsert_payload = {
                    "service_id": service_id,
                    "service_name": service_name,
                    "scrape_status": "failed",
                    "llm_notes": err_msg,
                    "last_scraped_at": datetime.now(timezone.utc).isoformat()
                }
                upsert_to_supabase(supabase_client, upsert_payload)
            except Exception as dberr:
                logger.error(f"Database logging of failure state failed: {dberr}")
                
            checkpoint.mark_failed(service_id)
            failure_count += 1
            
            # Clean up local temp file on error
            if 'temp_filepath' in locals() and temp_filepath and os.path.exists(temp_filepath):
                try:
                    os.remove(temp_filepath)
                except Exception as ex:
                    logger.error(f"Error removing temp file {temp_filepath}: {ex}")

    logger.info(f"\n=== Pipeline Completed: {success_count} success, {failure_count} failures ===")

if __name__ == "__main__":
    main()
