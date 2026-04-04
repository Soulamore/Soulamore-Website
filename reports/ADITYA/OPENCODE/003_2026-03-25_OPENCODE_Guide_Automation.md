# Soulamore News Automation Guide

To keep your **Live News Feed** and **Press Kit** updated automatically, you need to run `smart_news_rituals.py` on a schedule.

## Option 1: Windows Task Scheduler (Recommended)

1.  **Create a Batch Script**: I have created `sync_news.bat` in your root directory. This script handles the execution logic.
2.  **Open Task Scheduler**: Press `Win + R`, type `taskschd.msc`, and hit Enter.
3.  **Create Basic Task**:
    *   **Name**: `Soulamore News Sync`
    *   **Trigger**: Daily (Set your preferred time, e.g., 9:00 AM).
    *   **Action**: Start a Program.
    *   **Program/script**: Browse to `C:\Users\adity\Desktop\Projects\Soulamore-Website\sync_news.bat`.
    *   **Start in**: `C:\Users\adity\Desktop\Projects\Soulamore-Website`
4.  **Finish**: Your news will now sync every day automatically.

---

## Option 2: Linux / WSL / Mac (Cron)

If you move the site to a Linux server or use WSL, use a `cron` job:

1.  Open your crontab:
    ```bash
    crontab -e
    ```
2.  Add this line to run it every 6 hours:
    ```bash
    0 */6 * * * cd /path/to/Soulamore-Website && python3 smart_news_rituals.py
    ```

---

## Manual Verification
You can run the sync manually at any time by simply double-clicking the `sync_news.bat` file or running:
```powershell
python smart_news_rituals.py
```

> [!TIP]
> Each run updates `assets/data/news-feed.json`. The website will reflect these changes immediately on the next page load.
