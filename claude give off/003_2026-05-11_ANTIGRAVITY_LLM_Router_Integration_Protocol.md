# 003_2026-05-11_ANTIGRAVITY_LLM_Router_Integration_Protocol

## 1. System Overview
This report documents the successful cross-project integration between the **That's Missing** platform and the centralized **LLM Key Router** (`llm-router-870c5`). This architecture allows multiple independent projects to share a unified pool of AI API keys (OpenAI, Gemini, NVIDIA, etc.) while maintaining security and centralized management.

---

## 2. The Integration Blueprint (Step-by-Step)

To link any future project (e.g., Hashlily, Resume Engine) to the LLM Router, follow these three stages:

### Stage A: IAM Permissions (The "Key")
Projects are isolated by default. You must grant the "Caller" project access to the "Router" project's database.
1.  **Identify the Service Account**: In the source project (e.g., `thats-missing`), find the **App Engine Default Service Account**.
    *   Format: `[PROJECT_ID]@appspot.gserviceaccount.com`
2.  **Grant Access**: Go to the Google Cloud IAM Console of the **Target Project** (`llm-router-870c5`).
3.  **Add Principal**: Click "Grant Access" and add the email from Step 1.
4.  **Assign Role**: Assign the **`Cloud Datastore User`** role. 

### Stage B: Backend Initialization (The "Bridge")
The backend needs to initialize two separate Firebase instances: the default local one and the secondary "Router" one.

```javascript
// Example from functions/index.js
import admin from "firebase-admin";

// 1. Local App (Default)
admin.initializeApp();
const db = admin.firestore();

// 2. LLM Router App (Secondary)
const LLM_ROUTER_PROJECT_ID = 'llm-router-870c5';
const llmApp = admin.initializeApp({
  projectId: LLM_ROUTER_PROJECT_ID
}, 'llm-router');

const llmDb = llmApp.firestore();
```

### Stage C: Protocol Alignment (The "Language")
Ensure the database schema in the Router matches what the Caller expects.
1.  **Collection**: `keys`
2.  **Fields**:
    *   `key`: The actual API string.
    *   `provider`: (e.g., "openai_compatible", "gemini").
    *   `model`: The preferred model identifier.
    *   `status`: Must be set to `active` for the router to pick it up.

---

## 3. What We Tried & Fixed

### ✅ The "Bad Gateway" (502) Resolution
*   **Problem**: Sentinel scans failed with 502 errors due to memory limits and timeouts.
*   **Fix**: Scaled resources to **512MB RAM** and **300s Timeout**. Removed local AI fallbacks to enforce Router-only logic.

### ✅ App Check 400 Resolution
*   **Problem**: `400 Bad Request` prevented token exchange.
*   **Fix**: Identified key as standard reCAPTCHA v3. Switched code from `ReCaptchaEnterpriseProvider` to `ReCaptchaV3Provider`.

---

## 4. Scaling the Pattern
This pattern is now verified and ready for **Hashlily** and **Resume Engine**.
*   **Efficiency**: One central database for all AI keys.
*   **Security**: Zero hardcoded keys in source code.
*   **Observability**: Real-time health monitoring of all API keys via the `llm-router` project.

---
*Maintained by ANTIGRAVITY for That's Missing & Core Intelligence.*
