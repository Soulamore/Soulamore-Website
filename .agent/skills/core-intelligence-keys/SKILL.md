# Core Intelligence Keys (Skill)

This skill manages the centralized repository of API keys, Service Account JSONs, and third-party credentials used across the Core Intelligence ecosystem.

## 📁 Centralized Path
All keys are stored at: `D:\Projects\CORE_INTELLIGENCE\Keys\`

## 📂 Structure
The repository is organized by Project ID:

- `soulamore-f0a64/`
    - `serviceAccountKey.json`: Firebase Admin SDK credentials.
    - `brevo_keys.txt`: SMTP and API keys for email campaigns.
    - `Razorpay/`: Payment gateway credentials.
- `llm-router-870c5/`
    - `serviceAccountKey.json`: Cross-project bridge credentials.
- `global/`
    - Reserved for shared infrastructure keys.

## 🔐 Access Protocol
1. **Never copy** these keys into application codebases.
2. **Reference only**: Use absolute paths to these files in backend scripts or environment configurations.
3. **IAM Priority**: Ensure the service account has the necessary roles (e.g., Cloud Datastore User) in the target project.

## 🛠️ Usage Examples
### Initialize Firebase Admin (Node.js)
```javascript
const admin = require('firebase-admin');
const serviceAccount = require('D:/Projects/CORE_INTELLIGENCE/Keys/soulamore-f0a64/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
```

## ⚠️ Security Warning
Do NOT commit these keys to version control. They are stored in a centralized, ignored path to prevent accidental exposure while maintaining accessibility for authorized agents.
