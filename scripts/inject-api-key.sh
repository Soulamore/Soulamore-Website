#!/bin/bash
# Script to inject Gemini API key from environment variable into HTML files
# This script replaces the placeholder with the actual API key during CI/CD build

set -e

GEMINI_API_KEY="${GEMINI_API_KEY:-}"

if [ -z "$GEMINI_API_KEY" ]; then
    echo "Warning: GEMINI_API_KEY environment variable is not set. Using placeholder."
    exit 0
fi

echo "Injecting Gemini API key into HTML files..."

# Replace placeholder in soulbot-chat.html (macOS and Linux compatible)
if [ -f "tools/soulbot-chat.html" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|const API_KEY = \"YOUR_GEMINI_API_KEY_HERE\";|const API_KEY = \"$GEMINI_API_KEY\";|g" tools/soulbot-chat.html
    else
        # Linux
        sed -i "s|const API_KEY = \"YOUR_GEMINI_API_KEY_HERE\";|const API_KEY = \"$GEMINI_API_KEY\";|g" tools/soulbot-chat.html
    fi
    echo "✓ Updated tools/soulbot-chat.html"
fi

# Replace placeholder in soulbot.html (macOS and Linux compatible)
if [ -f "tools/soulbot.html" ]; then
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s|const API_KEY = \"YOUR_GEMINI_API_KEY_HERE\";|const API_KEY = \"$GEMINI_API_KEY\";|g" tools/soulbot.html
    else
        # Linux
        sed -i "s|const API_KEY = \"YOUR_GEMINI_API_KEY_HERE\";|const API_KEY = \"$GEMINI_API_KEY\";|g" tools/soulbot.html
    fi
    echo "✓ Updated tools/soulbot.html"
fi

echo "API key injection complete!"

