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
    "mental health",
    "emotional wellness",
    "psychology",
    "therapy innovation",
    "self care rituals"
]

def fetch_news():
    today = datetime.now()
    last_week = today - timedelta(days=7)
    
    indian_articles = []
    global_articles = []
    
    # 1. Fetch Trending Indian News (Core Focus)
    try:
        print("Fetching mental health news from India...")
        india_params = {
            "q": "(mental health OR psychology OR \"emotional well-being\") AND India",
            "from": last_week.strftime("%Y-%m-%d"),
            "to": today.strftime("%Y-%m-%d"),
            "sortBy": "relevancy",
            "language": "en",
            "apiKey": API_KEY,
            "pageSize": 50
        }
        res = requests.get(NEWS_API_URL, params=india_params)
        res.raise_for_status()
        data = res.json()
        if data.get("status") == "ok":
            indian_articles = data.get("articles", [])
            print(f"Found {len(indian_articles)} Indian headlines.")
    except Exception as e:
        print(f"Error fetching Indian news: {e}")

    # 2. Fetch Global Mental Health News (Expertise)
    for query in QUERIES:
        params = {
            "q": query,
            "from": last_week.strftime("%Y-%m-%d"),
            "to": today.strftime("%Y-%m-%d"),
            "sortBy": "relevancy",
            "language": "en",
            "apiKey": API_KEY,
            "pageSize": 10
        }
        try:
            print(f"Fetching global news for: {query}...")
            response = requests.get(NEWS_API_URL, params=params)
            response.raise_for_status()
            data = response.json()
            if data.get("status") == "ok":
                global_articles.extend(data.get("articles", []))
        except Exception as e:
            print(f"Error fetching global '{query}': {e}")
            
    # Combine with 80/20 target
    # We want ~40 Indian and ~10 Global for a top 50 feed
    target_total = 50
    target_india = int(target_total * 0.8)
    target_global = target_total - target_india
    
    final_articles = indian_articles[:target_india] + global_articles[:target_global]
    
    # If we don't have enough Indian news, fill with global
    if len(final_articles) < target_total:
        remaining = target_total - len(final_articles)
        final_articles.extend(global_articles[target_global : target_global + remaining])
        
    return final_articles

def save_to_knowledge_source(articles):
    if not articles:
        return
        
    now = datetime.now()
    year = now.strftime("%Y")
    month = now.strftime("%m")
    date_str = now.strftime("%Y-%m-%d")
    
    # Structured Archive: Year / Month / news_archive_date.json
    archive_dir = os.path.join(KNOWLEDGE_DIR, year, month)
    os.makedirs(archive_dir, exist_ok=True)
    
    filename = f"news_archive_{date_str}.json"
    filepath = os.path.join(archive_dir, filename)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(articles, f, indent=4, default=str)
    print(f"Archived {len(articles)} articles to {filepath}")
    
    # Also update the LIVE feed for the website
    os.makedirs(os.path.dirname(NEWS_FEED_FILE), exist_ok=True)
    with open(NEWS_FEED_FILE, 'w', encoding='utf-8') as f:
        # Filter for quality
        quality_articles = [a for a in articles if a.get('title') and "[Removed]" not in a.get('title')]
        json.dump(quality_articles, f, indent=4, default=str)
    print(f"Updated live news feed at {NEWS_FEED_FILE} with {len(quality_articles)} articles.")

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
