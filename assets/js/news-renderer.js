/**
 * SOULAMORE NEWS RENDERER
 * -----------------------
 * Dynamically fetches and renders the live news feed from news-feed.json.
 * Supports: Grid layout, fallback for missing images, and "Live" status indicators.
 */

async function initNewsFeed(containerId, limit = 6) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const cacheKey = `soulamore_news_cache_${containerId}`;
    const expiryKey = `soulamore_news_expiry_${containerId}`;
    const REFRESH_INTERVAL = 30 * 60 * 1000; // 30 minutes
    const rootPath = window.location.pathname.includes('/company/') || window.location.pathname.includes('/community/') ? '../' : '';

    // 1. Check Cache and Expiry
    const cachedData = localStorage.getItem(cacheKey);
    const lastFetch = localStorage.getItem(expiryKey);
    const now = new Date().getTime();

    if (cachedData && lastFetch && (now - parseInt(lastFetch) < REFRESH_INTERVAL)) {
        try {
            const articles = JSON.parse(cachedData);
            if (articles && articles.length > 0) {
                renderSync(container, articles, limit);
                return; // Valid cache
            }
        } catch (e) { console.warn("Cache parse failed", e); }
    }

    // 2. Fetch Fresh Data with Cache Buster
    try {
        const response = await fetch(`${rootPath}assets/data/news-feed.json?t=${now}`);
        if (!response.ok) throw new Error('News feed currently unavailable');

        const articles = await response.json();

        if (articles && articles.length > 0) {
            // Update UI
            renderSync(container, articles, limit);

            // 3. Save to Cache for 30 mins
            localStorage.setItem(cacheKey, JSON.stringify(articles));
            localStorage.setItem(expiryKey, now.toString());
        } else if (!cachedData) {
            container.innerHTML = '<p style="grid-column: 1/-1; text-align: center; opacity: 0.5;">No news rituals active at this moment.</p>';
        }
    } catch (error) {
        console.error("News Load Error:", error);
        if (cachedData) {
            renderSync(container, JSON.parse(cachedData), limit);
        }
    }
}

/**
 * Synchronized Rendering
 * Ensures both the grid and ticker use the exact same slice of data.
 */
function renderSync(container, articles, limit) {
    // Show up to the requested limit in the grid
    renderArticles(container, articles.slice(0, limit));

    // Update Global Ticker if it exists
    const ticker = document.getElementById('news-ticker');
    if (ticker) {
        renderTicker(ticker, articles);
    }
}

function renderTicker(ticker, articles) {
    // Combine all headlines into a single scrolling string
    const tickerContent = articles.map(article =>
        `<a href="${article.url}" target="_blank" style="color: #e2e8f0; text-decoration: none; margin-right: 50px; transition: color 0.3s;">
            <span style="color: #4ECDC4;">•</span> ${article.title}
         </a>`
    ).join('');

    ticker.innerHTML = tickerContent + tickerContent; // Duplicate for seamless looping
}

function renderArticles(container, articles) {
    container.innerHTML = '';

    articles.forEach(article => {
        const date = new Date(article.publishedAt).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });

        const card = document.createElement('div');
        card.className = 'news-card';
        card.style = `
            background: rgba(30, 41, 59, 0.5);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 16px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: 0.3s;
            cursor: pointer;
        `;

        const fallbackImage = 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        const imageUrl = article.urlToImage || fallbackImage;

        card.innerHTML = `
            <div class="news-img" style="height: 200px; overflow: hidden; position: relative;">
                <img src="${imageUrl}" alt="${article.title}" style="width: 100%; height: 100%; object-fit: cover;">
                <span style="position: absolute; top: 15px; right: 15px; background: #ef4444; color: white; padding: 4px 10px; border-radius: 50px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase;">Live</span>
            </div>
            <div class="news-content" style="padding: 24px; flex-grow: 1; display: flex; flex-direction: column;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 12px; font-size: 0.8rem; opacity: 0.6;">
                    <span>${article.source.name}</span>
                    <span>${date}</span>
                </div>
                <h3 style="font-size: 1.1rem; line-height: 1.4; margin-bottom: 15px; color: #F49F75;">${article.title}</h3>
                <p style="font-size: 0.9rem; opacity: 0.7; line-height: 1.6; margin-bottom: 20px;">${article.description ? (article.description.substring(0, 100) + '...') : ''}</p>
                <div style="margin-top: auto;">
                    <a href="${article.url}" target="_blank" style="color: #4ECDC4; text-decoration: none; font-weight: 600; font-size: 0.9rem;">Read Full Insight <i class="fas fa-external-link-alt" style="margin-left: 5px; font-size: 0.8em;"></i></a>
                </div>
            </div>
        `;

        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.borderColor = 'rgba(78, 205, 196, 0.4)';
            card.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.borderColor = 'rgba(255,255,255,0.1)';
            card.style.boxShadow = 'none';
        });

        container.appendChild(card);
    });
}
