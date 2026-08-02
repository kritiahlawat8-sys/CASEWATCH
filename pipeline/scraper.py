import os
import logging
import urllib.parse
import difflib
import requests
from bs4 import BeautifulSoup

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

BASE_URL = "https://kms.saralharyana.nic.in/"

class SaralScraper:
    def __init__(self, session=None):
        self.session = session or requests.Session()
        # Set a standard user agent to avoid basic blocks
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
        })
        self.viewstate = ""
        self.eventvalidation = ""
        self.lastfocus = ""
        self.eventtarget = ""
        self.eventargument = ""
        self.dept_map = {}
        self.service_map = {}
        self.maps_printed = False

    def get_initial_page(self):
        """
        STEP 1 & 2: GET the portal home page, extract ASP.NET hidden fields,
        and build department/service dropdown maps.
        """
        logger.info(f"Fetching initial page: {BASE_URL}")
        response = self.session.get(BASE_URL, timeout=30)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract hidden ASP.NET fields
        self.viewstate = self._extract_hidden_field(soup, "__VIEWSTATE")
        self.eventvalidation = self._extract_hidden_field(soup, "__EVENTVALIDATION")
        self.lastfocus = self._extract_hidden_field(soup, "__LASTFOCUS")
        self.eventtarget = self._extract_hidden_field(soup, "__EVENTTARGET")
        self.eventargument = self._extract_hidden_field(soup, "__EVENTARGUMENT")

        # Extract dropdown options
        self.dept_map = self._extract_dropdown(soup, "depart")
        self.service_map = self._extract_dropdown(soup, "servicelist")

        # Print maps on the first run for verification
        if not self.maps_printed:
            print("\n--- DEPT MAP ---")
            for k, v in self.dept_map.items():
                print(f"'{k}': '{v}'")
            print("--- END DEPT MAP ---\n")

            print("\n--- SERVICE MAP ---")
            for k, v in self.service_map.items():
                print(f"'{k}': '{v}'")
            print("--- END SERVICE MAP ---\n")
            self.maps_printed = True

    def _extract_hidden_field(self, soup, name):
        field = soup.find('input', {'name': name}) or soup.find('input', {'id': name})
        return field.get('value', '') if field else ''

    def _extract_dropdown(self, soup, select_id):
        select_elem = soup.find('select', {'id': select_id})
        options_map = {}
        if select_elem:
            for opt in select_elem.find_all('option'):
                val = opt.get('value', '').strip()
                text = opt.get_text().strip()
                # Skip placeholder or default instructions options
                if val and val != "0" and "select" not in text.lower():
                    options_map[text] = val
        return options_map

    def fuzzy_match(self, name, choices_dict, name_type="service"):
        """
        STEP 3: Match CSV service/dept name to dropdown codes using fuzzy matching.
        Logs warning if match confidence is below 0.8.
        """
        if not choices_dict:
            raise ValueError(f"Dropdown options for {name_type} are empty. Ensure page was fetched successfully.")

        possibilities = list(choices_dict.keys())
        matches = difflib.get_close_matches(name, possibilities, n=1, cutoff=0.0)
        
        if not matches:
            raise ValueError(f"No fuzzy match found for {name_type} '{name}'")
        
        best_match = matches[0]
        confidence = difflib.SequenceMatcher(None, name, best_match).ratio()
        
        if confidence < 0.8:
            logger.warning(
                f"LOW CONFIDENCE MATCH: CSV {name_type} '{name}' matches dropdown option "
                f"'{best_match}' with confidence {confidence:.2f} (below 0.8)"
            )
        else:
            logger.info(f"Fuzzy matched {name_type}: '{name}' -> '{best_match}' (confidence: {confidence:.2f})")
            
        return best_match, choices_dict[best_match]

    def search_service(self, keyword, dept_code, service_code):
        """
        STEP 4: POST to the portal with all necessary form fields and extract
        the ViewDoc?Id= URL.
        """
        payload = {
            "txtsrch": keyword,
            "depart": dept_code,
            "servicelist": service_code,
            "txtsearch": "Search",
            "__VIEWSTATE": self.viewstate,
            "__EVENTVALIDATION": self.eventvalidation,
            "__EVENTTARGET": self.eventtarget,
            "__EVENTARGUMENT": self.eventargument,
            "__LASTFOCUS": self.lastfocus
        }

        logger.info(f"POSTing search for service code '{service_code}' under department '{dept_code}'")
        response = self.session.post(BASE_URL, data=payload, timeout=30)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Update viewstate and eventvalidation for subsequent calls
        new_vs = self._extract_hidden_field(soup, "__VIEWSTATE")
        new_ev = self._extract_hidden_field(soup, "__EVENTVALIDATION")
        if new_vs:
            self.viewstate = new_vs
        if new_ev:
            self.eventvalidation = new_ev

        # Find all anchor tags containing ViewDoc?Id=
        anchors = soup.find_all('a', href=True)
        view_doc_url = None
        for anchor in anchors:
            href = anchor['href']
            if "ViewDoc" in href and "Id=" in href:
                view_doc_url = urllib.parse.urljoin(BASE_URL, href)
                break

        if not view_doc_url:
            logger.warning("No ViewDoc?Id= link found in the search results response.")
            return None

        logger.info(f"Found ViewDoc URL: {view_doc_url}")
        return view_doc_url

    def download_pdf(self, view_doc_url, service_id, temp_dir="tmp"):
        """
        STEP 5: GET the ViewDoc URL, download binary PDF, and validate it.
        Saves PDF to pipeline/tmp/casewatch_<service_id>.pdf
        """
        logger.info(f"Downloading document from: {view_doc_url}")
        response = self.session.get(view_doc_url, timeout=45)
        response.raise_for_status()

        # Handle case where PDF is embedded as base64 in HTML
        content_type = response.headers.get("Content-Type", "").lower()
        content_bytes = None
        
        if "text/html" in content_type:
            logger.info("Response is HTML. Parsing to extract embedded base64 PDF...")
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 1. Try finding in object, embed, iframe, or anchor tags
            for tag in soup.find_all(['object', 'embed', 'iframe', 'a']):
                for attr in ['data', 'src', 'href']:
                    val = tag.get(attr, '')
                    if val.startswith("data:application/pdf;base64,"):
                        base64_str = val.split("base64,")[1].strip()
                        import base64
                        content_bytes = base64.b64decode(base64_str)
                        logger.info("Successfully extracted PDF from HTML tag attributes.")
                        break
                if content_bytes:
                    break
            
            # 2. Fallback to regex search on entire HTML content
            if not content_bytes:
                import re
                match = re.search(r'data:application/pdf;base64,([A-Za-z0-9+/=\s\n\r]+)', response.text)
                if match:
                    base64_str = re.sub(r'\s+', '', match.group(1))
                    import base64
                    content_bytes = base64.b64decode(base64_str)
                    logger.info("Successfully extracted PDF via regex search on HTML body.")
            
            if not content_bytes:
                raise ValueError("Download rejected: Response content-type is text/html but no embedded base64 PDF found (possible login wall or error page)")
        else:
            content_bytes = response.content

        # Validate file size (must be <= 20MB)
        actual_size_mb = len(content_bytes) / (1024 * 1024)
        if actual_size_mb > 20:
            raise ValueError(f"Download rejected: PDF file size {actual_size_mb:.2f}MB exceeds 20MB limit")

        # Save to temp directory within the pipeline folder
        os.makedirs(temp_dir, exist_ok=True)
        temp_filepath = os.path.join(temp_dir, f"casewatch_{service_id}.pdf")
        
        with open(temp_filepath, "wb") as f:
            f.write(content_bytes)

        logger.info(f"PDF downloaded successfully to {temp_filepath} (Size: {actual_size_mb:.2f}MB)")
        return temp_filepath, content_bytes
