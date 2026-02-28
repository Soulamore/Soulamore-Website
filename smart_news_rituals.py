import os
import json
import requests
import sys
from datetime import datetime, timedelta

# API Keys
NEWS_API_KEY = "e6ffb12e8abc4005bcedf37ed19e8161"
NEWS_API_URL = "https://newsapi.org/v2/everything"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = SCRIPT_DIR
RITUALS_FILE = os.path.join(BASE_DIR, "assets", "data", "rituals.json")
NEWS_FEED_FILE = os.path.join(BASE_DIR, "assets", "data", "news-feed.json")
SOULBOT_DIR = os.path.join(BASE_DIR, "soulbot")

# Add soulbot to path for local LLM access
sys.path.append(SOULBOT_DIR)

class RitualArchitect:
    def __init__(self):
        self.local_model = None
        self.tokenizer = None
        self.use_gemini = False
        
        # 1. Try to initialize Local SoulBot
        try:
            import torch
            from inference import load_soulbot
            if torch.cuda.is_available():
                print("GPU Detected. Attempting to wake up Soulamore AI (Local)...")
                self.local_model, self.tokenizer = load_soulbot()
            else:
                print("No GPU found. Local SoulBot skipped.")
        except Exception as e:
            print(f"Local SoulBot unavailable: {e}")

        # 2. Check Gemini as Fallback
        if not self.local_model and GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=GEMINI_API_KEY)
                self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')
                self.use_gemini = True
                print("Cloud AI Active: Gemini Flash is ready.")
            except Exception as e:
                print(f"Gemini initialization failed: {e}")

    def generate_ritual(self, articles):
        """AI analyzes news and drafts a collective ritual."""
        if not articles:
            return None

        # Prepare context (80% India, 20% Global Headlines)
        context_text = "\n".join([f"- {a['title']} (Source: {a['source']['name']})" for a in articles[:15]])
        
        prompt = f"""
        You are the Soulamore Ritual Architect. 
        Your task is to analyze the following mental health and social news headlines and select ONE that requires collective emotional solidarity or awareness today.
        
        PRIORITY: 80% focus on Indian context, 20% on global impact.
        
        HEADLINES:
        {context_text}
        
        GOAL:
        Select a topic and generate a JSON object for a 'Collective Ritual'.
        The tone must be empathetic, supportive, and non-preachy.
        
        OUTPUT FORMAT (JSON ONLY):
        {{
            "name": "Short Emotional Title",
            "description": "One sentence focused on solidarity and shared intention.",
            "icon": "A single relevant emoji (e.g. 🕯️, 🌊, 🌳)",
            "news_source": "The URL of the selected article"
        }}
        """

        try:
            if self.local_model:
                # Local Mistral Inference
                instruction = "You are the SoulBot Ritual Architect. Return only valid JSON."
                full_prompt = f"### Instruction:\n{instruction}\n\n### Input:\n{prompt}\n\n### Response:\n"
                
                inputs = self.tokenizer(full_prompt, return_tensors="pt").to("cuda")
                import torch
                with torch.no_grad():
                    outputs = self.local_model.generate(**inputs, max_new_tokens=300, temperature=0.5)
                
                response = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
                if "### Response:" in response:
                    response = response.split("### Response:")[-1].strip()
                return json.loads(response)

            elif self.use_gemini:
                # Cloud Gemini Inference
                res = self.gemini_model.generate_content(prompt)
                clean_text = res.text.replace("```json", "").replace("```", "").strip()
                return json.loads(clean_text)
                
        except Exception as e:
            print(f"AI Ritual generation failed: {e}")
            return None

def fetch_news():
    """Fetches news with 80/20 India/Global split."""
    today = datetime.now().strftime("%Y-%m-%d")
    last_week = (datetime.now() - timedelta(days=7)).strftime("%Y-%m-%d")
    
    # 1. India Context (80%)
    try:
        print("Fetching Indian mental health context...")
        india_params = {
            "q": "(mental health OR psychology OR \"emotional well-being\") AND India",
            "from": last_week, "to": today, "sortBy": "relevancy", "language": "en", "apiKey": NEWS_API_KEY, "pageSize": 40
        }
        india_data = requests.get(NEWS_API_URL, params=india_params).json().get("articles", [])
    except: india_data = []

    # 2. Global Context (20%)
    try:
        print("Fetching Global mental health context...")
        global_params = {
            "q": "mental health OR psychology",
            "from": last_week, "to": today, "sortBy": "relevancy", "language": "en", "apiKey": NEWS_API_KEY, "pageSize": 10
        }
        global_data = requests.get(NEWS_API_URL, params=global_params).json().get("articles", [])
    except: global_data = []

    combined = [a for a in (india_data + global_data) if a.get('title') and "[Removed]" not in a.get('title')]
    
    # Sort by publishedAt descending (Newest first)
    combined.sort(key=lambda x: x.get('publishedAt', ''), reverse=True)
    return combined

def update_site_data(articles):
    if not articles: return

    # 1. Update News Feed JSON (Live Feed)
    with open(NEWS_FEED_FILE, 'w', encoding='utf-8') as f:
        json.dump(articles[:50], f, indent=4)
    print(f"Live feed updated with {len(articles[:50])} articles.")

    # 2. Autonomous Ritual Architect
    architect = RitualArchitect()
    new_ritual_data = architect.generate_ritual(articles)

    if new_ritual_data:
        try:
            with open(RITUALS_FILE, 'r', encoding='utf-8') as f:
                rituals = json.load(f)
            
            today_str = datetime.now().strftime("%Y-%m-%d")
            # Remove any existing automated rituals for today to keep it fresh
            rituals = [r for r in rituals if not (r.get("date") == today_str and r.get("isAutomated"))]

            new_ritual = {
                "date": today_str,
                "name": new_ritual_data["name"],
                "description": new_ritual_data["description"],
                "news_source": new_ritual_data.get("news_source"),
                "icon": new_ritual_data.get("icon", "✨"),
                "isAutomated": True
            }
            rituals.append(new_ritual)
            rituals.sort(key=lambda x: x.get("date", "2099-01-01"))

            with open(RITUALS_FILE, 'w', encoding='utf-8') as f:
                json.dump(rituals, f, indent=4)
            print(f"AI Success: New Collective Ritual established - {new_ritual['name']}")
        except Exception as e:
            print(f"Error updating rituals: {e}")

if __name__ == "__main__":
    print(f"--- SOULAMORE SMART SYNC ({datetime.now().strftime('%Y-%m-%d %H:%M')}) ---")
    articles = fetch_news()
    update_site_data(articles)
    print("Sync Complete.")
