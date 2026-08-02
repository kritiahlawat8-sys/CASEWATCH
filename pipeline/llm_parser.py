import os
import json
import logging
import requests
import fitz  # PyMuPDF
from dotenv import load_dotenv

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

JSON_SCHEMA = """
{
  "service_name": "string",
  "category": "Identity|Land|Social Welfare|Education|Business|Agriculture|Health|Revenue|Other",
  "department": "string",
  "fee": {
    "govt_charges": "string",
    "kendra_charges": "string",
    "csc_charges": "string"
  },
  "eligibility": ["string"],
  "benefits": ["string"],
  "required_documents": [
    {"name": "string", "format": "string", "note": "string"}
  ],
  "application_steps": ["string"],
  "is_online": true,
  "is_offline": false,
  "office_info": {
    "authority": "string",
    "submission_point": "string"
  },
  "rts_timeline_days": 0,
  "llm_confidence": 0.0,
  "llm_notes": "string"
}
"""

class ServicePDFParser:
    def __init__(self):
        load_dotenv()
        self.ollama_url = "http://localhost:11434/api/generate"
        self.model_name = "qwen2.5:3b"

    def extract_text_from_pdf(self, pdf_path):
        """STEP 6: Extract text from PDF using PyMuPDF."""
        logger.info(f"Extracting text from PDF: {pdf_path}")
        text = ""
        try:
            with fitz.open(pdf_path) as doc:
                for page in doc:
                    text += page.get_text() + "\n"
        except Exception as e:
            logger.error(f"Error reading PDF with PyMuPDF: {e}")
            raise e
        return text

    def parse_document_text(self, raw_text):
        """STEP 7: Send raw document text to Ollama (Qwen2.5:3b) with Advanced Chain-of-Thought."""
        logger.info(f"Initializing Ollama call using model: {self.model_name}...")
        
        prompt = f"""
        You are an expert AI document intelligence assistant. Your task is to analyze the extracted text of a government service document from kms.saralharyana.nic.in and parse it into the exact JSON schema provided below.
        
        JSON SCHEMA:
        {JSON_SCHEMA}
        
        RAW DOCUMENT TEXT:
        {raw_text}
        
        Advanced Chain-of-Thought Reasoning Instructions:
        1. Read the raw text carefully.
        2. Identify the application process. Determine if it is performed online, offline, or both, and set the "is_online" and "is_offline" flags accordingly.
        3. Extract the step-by-step application procedure. Convert it into a clean, numbered sequence of strings for the "application_steps" array. For example: ["Step 1: Go to the portal...", "Step 2: Fill out the details..."]
        4. Adhere strictly to the JSON schema structure.
        
        Rules:
        - Return the data strictly matching this JSON schema, and nothing else.
        - The output must be valid JSON only. Do not wrap in markdown ```json blocks.
        """

        payload = {
            "model": self.model_name,
            "prompt": prompt,
            "format": "json",
            "stream": False,
            "options": {
                "temperature": 0.1
            }
        }

        try:
            response = requests.post(self.ollama_url, json=payload, timeout=300)
            if response.status_code != 200:
                logger.error(f"Ollama returned non-200 status code: {response.status_code}")
                return None
                
            response_json = response.json()
            generation_text = response_json.get("response", "").strip()
            
            parsed_json = json.loads(generation_text)
            logger.info("Ollama output successfully received and parsed.")
            return parsed_json
            
        except Exception as e:
            logger.error(f"Ollama Extraction/Parsing Failed: {e}")
            return None