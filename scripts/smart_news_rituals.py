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
BASE_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
RITUALS_FILE = os.path.join(BASE_DIR, "assets", "data", "rituals.json")
NEWS_FEED_FILE = os.path.join(BASE_DIR, "assets", "data", "news-feed.json")

class RitualArchitect:
    def __init__(self):
        self.gemini_model = None
        self.use_gemini = False

        if GEMINI_API_KEY:
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
        context_text = "\n".join([f"- {a.get('title', '')} (Source: {a.get('source', {}).get('name', 'Unknown')})" for a in articles[:15]])
        
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
            if self.use_gemini and self.gemini_model:
                res = self.gemini_model.generate_content(prompt)
                clean_text = res.text.replace("```json", "").replace("```", "").strip()
                return json.loads(clean_text)
            else:
                # Fallback default ritual if Gemini is unavailable
                top_article = articles[0] if articles else {}
                return {
                    "name": "Daily Breath & Grounding Circle",
                    "description": "Offering collective warmth and quiet reflection for all carrying heavy thoughts today.",
                    "icon": "🕊️",
                    "news_source": top_article.get("url", "https://soulamore.com")
                }
                
        except Exception as e:
            print(f"AI Ritual generation fallback: {e}")
            top_article = articles[0] if articles else {}
            return {
                "name": "Daily Space of Validation",
                "description": "A quiet moment of empathy for those navigating unseen emotional fatigue.",
                "icon": "🌱",
                "news_source": top_article.get("url", "https://soulamore.com")
            }

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
        resp = requests.get(NEWS_API_URL, params=india_params, timeout=15)
        india_data = resp.json().get("articles", []) if resp.status_code == 200 else []
    except Exception as e:
        print(f"Warning: India news fetch error: {e}")
        india_data = []

    # 2. Global Context (20%)
    try:
        print("Fetching Global mental health context...")
        global_params = {
            "q": "mental health OR psychology",
            "from": last_week, "to": today, "sortBy": "relevancy", "language": "en", "apiKey": NEWS_API_KEY, "pageSize": 10
        }
        resp = requests.get(NEWS_API_URL, params=global_params, timeout=15)
        global_data = resp.json().get("articles", []) if resp.status_code == 200 else []
    except Exception as e:
        print(f"Warning: Global news fetch error: {e}")
        global_data = []

    combined = [a for a in (india_data + global_data) if a.get('title') and "[Removed]" not in a.get('title')]
    
    # Sort by publishedAt descending (Newest first)
    combined.sort(key=lambda x: x.get('publishedAt', ''), reverse=True)
    return combined

def update_site_data(articles):
    if not articles:
        print("No articles fetched, skipping update.")
        return

    os.makedirs(os.path.dirname(NEWS_FEED_FILE), exist_ok=True)

    # 1. Update News Feed JSON (Live Feed)
    with open(NEWS_FEED_FILE, 'w', encoding='utf-8') as f:
        json.dump(articles[:50], f, indent=4)
    print(f"Live feed updated with {len(articles[:50])} articles.")

    # 2. Autonomous Ritual Architect
    architect = RitualArchitect()
    new_ritual_data = architect.generate_ritual(articles)

    if new_ritual_data:
        try:
            rituals = []
            if os.path.exists(RITUALS_FILE):
                with open(RITUALS_FILE, 'r', encoding='utf-8') as f:
                    try:
                        rituals = json.load(f)
                    except:
                        rituals = []
            
            today_str = datetime.now().strftime("%Y-%m-%d")
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
