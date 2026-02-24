import os
import requests
from bs4 import BeautifulSoup
import urllib.parse

url = "https://www.psychiatry.org/psychiatrists/practice/dsm/educational-resources/assessment-measures"
output_dir = "knowledge source"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

try:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    
    soup = BeautifulSoup(response.content, 'html.parser')
    
    links = soup.find_all('a', href=True)
    pdf_links = []
    
    for link in links:
        href = link['href']
        # APA website might have PDFs linked directly or via some redirect, usually they end in .pdf
        if href.lower().endswith('.pdf') or '/File%20Library/' in href or '/File Library/' in href:
            full_url = urllib.parse.urljoin(url, href)
            if full_url not in [p['url'] for p in pdf_links]:
                name = link.get_text(strip=True)
                if not name:
                    name = href.split('/')[-1]
                
                # Sanitize filename
                safe_name = "".join([c for c in name if c.isalpha() or c.isdigit() or c==' ']).rstrip()
                if not safe_name:
                    safe_name = href.split('/')[-1].replace('%20', '_')
                    
                if not safe_name.lower().endswith('.pdf'):
                    safe_name += '.pdf'
                    
                pdf_links.append({'url': full_url, 'filename': safe_name})

    print(f"Found {len(pdf_links)} PDF links.")
    
    for item in pdf_links:
        print(f"Downloading: {item['filename']}")
        try:
            pdf_response = requests.get(item['url'], headers=headers)
            pdf_response.raise_for_status()
            
            filepath = os.path.join(output_dir, item['filename'])
            with open(filepath, 'wb') as f:
                f.write(pdf_response.content)
            print(f"Saved: {filepath}")
        except Exception as e:
            print(f"Failed to download {item['url']}: {e}")

except Exception as e:
    print(f"Error fetching page: {e}")
