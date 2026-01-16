# Billing Limits Setup for SoulBot

This guide helps you set up billing limits and quotas to prevent unexpected charges from Gemini API usage.

## 🔔 Part 1: Google Cloud Console - Budget Alerts

### Step 1: Create a Budget Alert

1. Go to: https://console.cloud.google.com/billing/budgets?project=soulamore-f0a64
2. Click **"Create Budget"**
3. Configure:
   - **Budget name**: "SoulBot Gemini API Budget"
   - **Budget scope**: Select your project "soulamore-f0a64"
   - **Budget amount**: 
     - Start with **$50/month** (adjust based on your needs)
     - Or set a **daily limit** of **$2/day**
   - **Budget period**: Monthly
4. **Set alerts**:
   - Alert at **50%** of budget ($25 if budget is $50)
   - Alert at **90%** of budget ($45 if budget is $50)
   - Alert at **100%** of budget ($50)
5. **Action** (Optional but recommended):
   - Enable "Disable billing" when budget is exceeded
   - Or just send email alerts
6. Click **"Create"**

### Step 2: Set API Quotas (if available)

1. Go to: https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas?project=soulamore-f0a64
2. Look for quota limits you can adjust:
   - **Requests per minute (RPM)**
   - **Tokens per minute (TPM)**
   - **Requests per day (RPD)**
3. If you see adjustable quotas, set conservative limits:
   - **RPM**: 60 requests/minute (1 per second)
   - **RPD**: 10,000 requests/day
   - **TPM**: Based on your model (check Gemini pricing)

### Step 3: Monitor Usage

1. Go to: https://console.cloud.google.com/billing?project=soulamore-f0a64
2. Check "Cost breakdown" to see current spending
3. Set up daily email reports

## 🛡️ Part 2: Application-Level Rate Limiting

We'll add rate limiting in the SoulBot code to prevent abuse.

### Recommended Limits:
- **Per user**: 10 requests/minute
- **Per user**: 100 requests/day
- **Global**: Monitor total usage
- **Max message length**: 2000 characters

## 📊 Pricing Reference (Gemini 2.5 Flash)

- **Input**: ~$0.075 per 1M tokens
- **Output**: ~$0.30 per 1M tokens
- **Average conversation**: ~500-1000 tokens per message

**Estimated costs:**
- 1000 conversations/day × 5 messages each = 5000 messages/day
- ~500 tokens/message = 2.5M tokens/day
- Cost: ~$0.50-1.00/day = ~$15-30/month

**Recommended budget**: Start with **$50/month** and adjust based on usage.

