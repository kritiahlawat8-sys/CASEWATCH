import os
import logging
from supabase import create_client, Client

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class SupabaseStorageManager:
    def __init__(self):
        self.supabase_url = os.environ.get("SUPABASE_URL")
        # Use SUPABASE_SERVICE_ROLE_KEY if present, fall back to SUPABASE_KEY if that's what's set
        self.supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY") or os.environ.get("SUPABASE_KEY")
        
        self.client = None
        if self.supabase_url and self.supabase_key:
            self.client: Client = create_client(self.supabase_url, self.supabase_key)
        else:
            logger.warning("Supabase credentials not fully configured in environment. Storage operations will fail.")

    def upload_pdf(self, temp_filepath, service_id, bucket_name="haryana-forms"):
        """
        STEP 8: Upload PDF to Supabase Storage.
        Bucket: haryana-forms
        Path:   forms/<service_id>.pdf
        Options: content-type=application/pdf, upsert=true
        After upload: get_public_url() and return it.
        Always delete local temp file after upload attempt whether upload succeeded or failed.
        """
        if not self.client:
            raise ValueError("Supabase client is not initialized. Check your environment variables.")

        if not os.path.exists(temp_filepath):
            raise FileNotFoundError(f"Local temp file not found for upload: {temp_filepath}")

        public_url = None
        storage_path = f"forms/{service_id}.pdf"
        
        try:
            logger.info(f"Reading file for upload: {temp_filepath}")
            with open(temp_filepath, "rb") as f:
                file_bytes = f.read()

            logger.info(f"Uploading PDF to Supabase storage bucket '{bucket_name}' path '{storage_path}'")
            # Supabase Storage v2 Python client expects path, file as bytes/binary, and options dictionary
            self.client.storage.from_(bucket_name).upload(
                path=storage_path,
                file=file_bytes,
                file_options={"content-type": "application/pdf", "upsert": "true"}
            )
            
            # Retrieve the public URL
            public_url = self.client.storage.from_(bucket_name).get_public_url(storage_path)
            logger.info(f"PDF uploaded successfully. Public URL: {public_url}")
            
        except Exception as e:
            logger.error(f"Failed to upload PDF '{temp_filepath}' to Supabase Storage: {e}")
            raise e
        finally:
            # Always delete the local temporary file after the upload attempt
            try:
                if os.path.exists(temp_filepath):
                    os.remove(temp_filepath)
                    logger.info(f"Successfully deleted local temp file: {temp_filepath}")
            except Exception as cleanup_err:
                logger.error(f"Error cleaning up local temp file '{temp_filepath}': {cleanup_err}")

        return public_url
