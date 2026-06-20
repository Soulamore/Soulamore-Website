import re

with open('portal/admin-dashboard.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Find all occurrences of dash-card classes and print their nested tags to find stray icons
matches = re.finditer(r'class="[^"]*dash-card[^"]*"', html)
for m in matches:
    start = max(0, m.start() - 100)
    end = min(len(html), m.end() + 1000)
    snippet = html[start:end]
    print(f"--- MATCH AT {m.start()} ---")
    print(snippet[:500])
