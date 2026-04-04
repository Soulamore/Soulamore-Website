# 🚀 Gemini API Integration Guide

This guide explains how to integrate your Gemini API key into the Soulamore assessment engine and tools.

## 1. Quick Local Setup
If you want to test the AI-generated assessment reflections immediately:

1.  Open [spaces/assessments/results.html](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/spaces/assessments/results.html).
2.  Find line **907**: `const HARDCODED_KEY = "YOUR_GEMINI_API_KEY_HERE";`.
3.  Replace the placeholder with your actual API key from [Google AI Studio](https://aistudio.google.com/apikey).
4.  **⚠️ WARNING**: Do not commit this change to Git. Run `bash scripts/restore-placeholder.sh` before pushing.

## 2. Automated Setup (Recommended)
We have built an injection system that populates the API key safely during deployment or local testing.

### **Step A: Set Environment Variable**
```bash
# Windows (PowerShell)
$env:GEMINI_API_KEY="your_api_key_here"

# Windows (CMD)
set GEMINI_API_KEY=your_api_key_here
```

### **Step B: Run Injection Script**
```bash
bash scripts/inject-api-key.sh
```
This script will automatically replace placeholders in:
- `tools/soulbot.html`
- `tools/soulbot-chat.html`
- `spaces/assessments/results.html`

## 3. Production (GitHub Actions)
For production, simply add a Secret to your GitHub repository named `GEMINI_API_KEY`. The CI/CD pipeline is already configured to run the injection script during the build process.

## 4. Verification
Once set up, navigate to the **Assessment Results** page after completing a test. You should see a "Gemini Interpretation" block (Layer 5) that provides a radical empathy reflection based on your deterministic scores.

---
**Reference**: [README_GEMINI_SETUP.md](file:///c:/Users/adity/Desktop/Projects/Soulamore-Website/admin/README_GEMINI_SETUP.md)
