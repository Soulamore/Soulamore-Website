import os
import json
import requests
from datetime import datetime, timedelta

API_KEY = "e6ffb12e8abc4005bcedf37ed19e8161"
NEWS_API_URL = "https://newsapi.org/v2/everything"

# Paths
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
BASE_DIR = SCRIPT_DIR
KNOWLEDGE_DIR = os.path.join(BASE_DIR, "knowledge source", "news sourced")
RITUALS_FILE = os.path.join(BASE_DIR, "assets", "data", "rituals.json")
NEWS_FEED_FILE = os.path.join(BASE_DIR, "assets", "data", "news-feed.json")

os.makedirs(KNOWLEDGE_DIR, exist_ok=True)

# Queries that fit Soulamore's vibe
QUERIES = [
    "mental health crisis",
    "student stress exam",
    "loneliness epidemic",
    "burnout work",
    "therapy innovation"
]

def fetch_news():
    today = datetime.now()
    last_week = today - timedelta(days=7)
    
    all_articles = []
    
    for query in QUERIES:
        params = {
            "q": query,
            "from": last_week.strftime("%Y-%m-%d"),
            "to": today.strftime("%Y-%m-%d"),
            "sortBy": "relevancy",
            "language": "en",
            "apiKey": API_KEY,
            "pageSize": 5
        }
        try:
            print(f"Fetching news for: {query}...")
            response = requests.get(NEWS_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            if data.get("status") == "ok":
                all_articles.extend(data.get("articles", []))
        except Exception as e:
            print(f"Error fetching '{query}': {e}")
            
    return all_articles

def save_to_knowledge_source(articles):
    if not articles:
        return
        
    date_str = datetime.now().strftime("%Y-%m-%d")
    filename = f"news_archive_{date_str}.json"
    filepath = os.path.join(KNOWLEDGE_DIR, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(articles, f, indent=4)
    print(f"Archived {len(articles)} articles to {filepath}")
    
    # Also update the LIVE feed for the website
    os.makedirs(os.path.dirname(NEWS_FEED_FILE), exist_ok=True)
    with open(NEWS_FEED_FILE, 'w', encoding='utf-8') as f:
        # Filter for quality and limit to 20 articles
        quality_articles = [a for a in articles if a.get('title') and "[Removed]" not in a.get('title')]
        json.dump(quality_articles[:20], f, indent=4)
    print(f"Updated live news feed at {NEWS_FEED_FILE}")

def update_rituals(articles):
    if not articles:
        return
        
    # Load existing rituals
    try:
        with open(RITUALS_FILE, 'r', encoding='utf-8') as f:
            rituals = json.load(f)
    except FileNotFoundError:
        rituals = []

    # Find the most relevant/popular article to turn into a temporary "News Ritual"
    # Filter out removed articles
    valid_articles = [a for a in articles if a.get('title') and "[Removed]" not in a.get('title')]
    
    if valid_articles:
        top_article = valid_articles[0]
        today_str = datetime.now().strftime("%Y-%m-%d")
        
        # Check if we already added a news ritual today
        already_exists = any(r.get("date") == today_str and "News Alert" in r.get("name", "") for r in rituals)
        
        if not already_exists:
            new_ritual = {
                "date": today_str,
                "name": f"News Alert: {top_article['title'][:30]}...",
                "description": top_article['description'] if top_article['description'] else "Connecting over today's headlines.",
                "news_source": top_article.get("url"),
                "isAutomated": True
            }
            rituals.append(new_ritual)
            
            # Sort rituals by date
            rituals.sort(key=lambda x: x.get("date", "2099-01-01"))
            
            with open(RITUALS_FILE, 'w', encoding='utf-8') as f:
                json.dump(rituals, f, indent=4)
            print(f"Added new automated ritual: {new_ritual['name']}")
        else:
            print("Today's news ritual already exists.")

if __name__ == "__main__":
    articles = fetch_news()
    save_to_knowledge_source(articles)
    update_rituals(articles)
    print("Smart News Sync Complete!")
