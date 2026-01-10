#!/bin/bash
# Script to set up local development with API key
# Usage: ./scripts/setup-local-dev.sh

set -e

GEMINI_API_KEY="${1:-}"

if [ -z "$GEMINI_API_KEY" ]; then
    echo "Usage: ./scripts/setup-local-dev.sh YOUR_API_KEY"
    echo "Example: ./scripts/setup-local-dev.sh AIzaSyA2NG0zPSM-X7E5AGIJ508QmMs_mojphas"
    exit 1
fi

export GEMINI_API_KEY
./scripts/inject-api-key.sh

echo ""
echo "✓ Local development setup complete!"
echo "You can now test SoulBot locally by opening tools/soulbot-chat.html in your browser"

