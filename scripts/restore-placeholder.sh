#!/bin/bash
# Script to restore placeholder API key before committing to git
# This ensures the API key is never accidentally committed

set -e

echo "Restoring API key placeholder..."

# Restore placeholder in soulbot-chat.html
if [ -f "tools/soulbot-chat.html" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS - match any API key and replace with placeholder
        sed -i '' 's|const API_KEY = "[^"]*";|const API_KEY = "YOUR_GEMINI_API_KEY_HERE";|g' tools/soulbot-chat.html
    else
        # Linux
        sed -i 's|const API_KEY = "[^"]*";|const API_KEY = "YOUR_GEMINI_API_KEY_HERE";|g' tools/soulbot-chat.html
    fi
    echo "✓ Restored placeholder in tools/soulbot-chat.html"
fi

# Restore placeholder in soulbot.html
if [ -f "tools/soulbot.html" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' 's|const API_KEY = "[^"]*";|const API_KEY = "YOUR_GEMINI_API_KEY_HERE";|g' tools/soulbot.html
    else
        # Linux
        sed -i 's|const API_KEY = "[^"]*";|const API_KEY = "YOUR_GEMINI_API_KEY_HERE";|g' tools/soulbot.html
    fi
    echo "✓ Restored placeholder in tools/soulbot.html"
fi

echo "Placeholder restored. Safe to commit!"



