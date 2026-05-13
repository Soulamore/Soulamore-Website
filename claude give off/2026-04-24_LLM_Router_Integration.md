# LLM Router Synchronization Procedure

**Date:** 2026-04-24
**Component:** Core Intelligence / LLM Router Integration

## Problem Context
Hashlilly relies on the centralized LLM Router (`llm-router-870c5.web.app`) to process AI requests. However, the external Hub was returning `401 Unauthorized` due to Google Cloud IAM restrictions, causing Hashlilly to fall back to its local database (`llm_router_keys`) which was empty/inaccessible. We wanted to ensure that the keys stored in the Hub's separate Firebase database were synced and available for all uses natively within Hashlilly.

## Solution Architecture: "The Direct DB Bridge"
Instead of migrating the keys manually, we constructed a direct bridge to the Hub's database. Hashlilly now initializes a dedicated `firebase-admin` instance that authenticates directly with the `llm-router-870c5` database using its Service Account. 

This means:
1. Hashlilly's `src/lib/llm-router/firebase-store.ts` reads directly from the external Hub's `llm_router_keys` collection.
2. Any keys added/removed from the Hub are instantly available to Hashlilly.
3. The Admin Dashboard within Hashlilly now manages the Hub's database.

## Implementation Steps

1. **Service Account Provisioning:**
   The `llm-router-870c5` Service Account JSON (`llm-router-870c5-firebase-adminsdk-fbsvc-99dccd4585.json`) was copied into the `core-intelligence/` directory as `llm-router-service-account.json`.

2. **Admin Initialization Wrapper (`src/lib/firebase-admin.ts`):**
   The initialization script was modified to detect the presence of the Service Account.
   - **Local Dev:** It dynamically loads `core-intelligence/llm-router-service-account.json`.
   - **Production:** It looks for the `LLM_ROUTER_SERVICE_ACCOUNT` environment variable.
   - **Fallback:** It reverts to the default Application Default Credentials (ADC) for the local project if neither is found.

3. **Database Client Switch (`src/lib/llm-router/firebase-store.ts`):**
   The internal key fetching logic was migrated from the client-side Firebase SDK to the newly initialized `adminDb`. This bypasses strict `firestore.rules` and prevents `Permission Denied` errors on the server side.

4. **Emergency Cascading Fallback (`src/app/api/llm/chat/route.ts`):**
   A final layer of resilience was added. If both the Hub and the bridged database fail or are empty, the router automatically injects a mock key mapping using `process.env.GEMINI_API_KEY` or `process.env.HASHLILLY_API_KEY` to directly hit the `https://generativelanguage.googleapis.com/v1beta/openai/` endpoint, guaranteeing 100% uptime.

## Future Maintenance
- Ensure that the Service Account JSON (`llm-router-service-account.json`) remains out of version control (`.gitignore`) to prevent credential leaks.
- When deploying to production (Firebase App Hosting, Vercel, etc.), inject the contents of the JSON file into the environment variable: `LLM_ROUTER_SERVICE_ACCOUNT`.
