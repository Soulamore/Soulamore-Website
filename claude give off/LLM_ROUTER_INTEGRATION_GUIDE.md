# LLM Router Integration Guide

## 1. System Overview
This guide documents the standardized cross-project integration protocol between the **Core Intelligence** ecosystem and the centralized **LLM Key Router** (`llm-router-870c5`). This was first successfully implemented and battle-tested on the **That's Missing** platform.

---

## 2. Standard Integration Protocol

### Step 1: IAM Authorization
The "Caller" project (e.g., Hashlily) must be authorized to read from the "Router" project (llm-router-870c5).
*   **Source Principal**: `[PROJECT_ID]@appspot.gserviceaccount.com` (App Engine Default).
*   **Target Project**: `llm-router-870c5`
*   **Required Role**: `Cloud Datastore User`

### Step 2: Multi-Project Firebase Initialization
Initialize a secondary Firebase instance in the backend code to bridge the projects.

```javascript
import admin from "firebase-admin";

// Local Context
admin.initializeApp();

// Centralized Context
const llmApp = admin.initializeApp({
  projectId: 'llm-router-870c5'
}, 'llm-router');

const llmDb = llmApp.firestore();
```

### Step 3: Schema Synchronization
The Router expects the following document structure in the `keys` collection:
| Field | Type | Description |
| :--- | :--- | :--- |
| **key** | string | The API secret. |
| **provider** | string | e.g., "openai_compatible", "gemini", "mistral". |
| **model** | string | The specific model ID (e.g., "gpt-4o"). |
| **status** | string | Must be "active" for the caller to utilize. |
| **baseURL** | string | Optional. Overrides the provider's default URL. |

---

## 3. Battle-Tested Fixes (Lessons from That's Missing)

### 🚨 Cloud Function Scaling (502 Bad Gateway)
**Mistake**: Using default 256MB memory for heavy AI analysis tasks (Sentinel scans).
**Lesson**: Intensive LLM analysis can trigger memory pressure or timeouts, resulting in 502/504 errors.
**Standard**: Set all AI intelligence functions to **512MB RAM** and a **300s Timeout** as a production baseline.

### 🚨 App Check Provider Mismatch (400 Bad Request)
**Mistake**: Using `ReCaptchaEnterpriseProvider` for a standard reCAPTCHA v3 site key.
**Lesson**: If the reCAPTCHA key was created in the "Classic" Admin console (6L... keys), using the Enterprise provider in the Firebase SDK will trigger a `400 Bad Request`.
**Standard**: Confirm key type. For standard v3 keys, use `ReCaptchaV3Provider`. Ensure `localhost` is whitelisted or `FIREBASE_APPCHECK_DEBUG_TOKEN` is enabled for local dev.

### 🚨 Avoid "Zombie" Fallbacks
**Mistake**: Keeping local Gemini or OpenAI keys in `.env` as fallbacks.
**Lesson**: This leads to silent failures when the local key fails while the app thinks it's still healthy.
**Standard**: Remove all local AI keys. Strictly rely on the Router. If the Router returns an error, the application should throw a clean "AI Service Unavailable".

---

## 4. Current Integrations
*   ✅ **That's Missing**: Fully Live (Sentinel & Policy Scanners).
*   ⏳ **Hashlily**: Integration Ready.
*   ⏳ **Resume Engine**: Integration Ready.

---
*Maintained by CORE INTELLIGENCE Standards Division.*
