// scripts/checkGovLinks.js
import fs from 'fs';
import path from 'path';
import https from 'https';

// Node doesn't automatically run ES modules easily without setup, 
// so we'll read the config file as text to extract URLs for a simple check.
// A more robust CI script would compile or use tsx/esbuild.

const configPath = path.join(process.cwd(), 'src/config/govPortalsLinks.js');

try {
  const fileContent = fs.readFileSync(configPath, 'utf8');
  
  // Regex to extract URLs
  const urlRegex = /url:\s*['"]([^'"]+)['"]/g;
  let match;
  const urls = [];
  
  while ((match = urlRegex.exec(fileContent)) !== null) {
    urls.push(match[1]);
  }
  
  console.log(`Found ${urls.length} government portal links to check.\n`);
  
  let checked = 0;
  let hasErrors = false;

  urls.forEach(url => {
    https.get(url, (res) => {
      const status = res.statusCode;
      if (status >= 200 && status < 400) {
        console.log(`✅ [${status}] OK: ${url}`);
      } else {
        console.error(`❌ [${status}] ERROR: ${url}`);
        hasErrors = true;
      }
      checkDone();
    }).on('error', (e) => {
      console.error(`❌ [ERROR] ${url}: ${e.message}`);
      hasErrors = true;
      checkDone();
    });
  });

  function checkDone() {
    checked++;
    if (checked === urls.length) {
      console.log('\nHealth check complete.');
      if (hasErrors) {
        process.exit(1);
      } else {
        process.exit(0);
      }
    }
  }
  
} catch (error) {
  console.error("Failed to read govPortalsLinks.js:", error);
  process.exit(1);
}
