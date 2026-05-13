# Brevo Integration Guide: Core Intelligence

This guide outlines the standardized process for integrating Brevo (formerly Sendinblue) into project backends, based on the successful implementation for SAGA.

## 📦 1. Installation
Install the official Brevo SDK and dotenv for secret management:

```bash
npm install @getbrevo/brevo dotenv
```

## 🔐 2. Secret Management
Add the API Key to your environment variables (`.env` or Cloud Secrets):

```env
BREVO_API_KEY=xkeysib-xxxx-xxxx
SENDER_EMAIL=contact.adityaharsh@gmail.com
SENDER_NAME=SAGA Germany
```

## 🛠️ 3. Core Implementation (Node.js/TypeScript)

Initialize the client and export a reusable `sendEmail` function:

```typescript
import * as sib from '@getbrevo/brevo';

const apiInstance = new sib.TransactionalEmailsApi();
apiInstance.setApiKey(sib.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY!);

export const sendEmail = async (to: string, subject: string, htmlContent: string) => {
  const sendSmtpEmail = new sib.SendSmtpEmail();
  
  sendSmtpEmail.subject = subject;
  sendSmtpEmail.htmlContent = htmlContent;
  sendSmtpEmail.sender = { name: process.env.SENDER_NAME, email: process.env.SENDER_EMAIL };
  sendSmtpEmail.to = [{ email: to }];
  sendSmtpEmail.replyTo = { email: process.env.SENDER_EMAIL, name: process.env.SENDER_NAME };

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    return { success: true, messageId: data.body.messageId };
  } catch (error) {
    console.error('Brevo Error:', error);
    throw error;
  }
};
```

## ⚠️ 4. Critical Pitfalls & Solutions

### A. IP Blocking (Firebase/Serverless)
**Problem**: Brevo's "Authorized IPs" security blocks requests from serverless functions (Firebase/AWS) because their IPs rotate constantly.
**Solution**: 
1. Log in to Brevo Console.
2. Go to **Security > Authorized IPs**.
3. Ensure no IPs are restricted, OR use a Dedicated IP if required for high volume.

### B. Promotions Tab vs. Primary Inbox
**Problem**: Marketing templates (buttons, large images) often land in the Promotions tab.
**Solution**:
*   Use a personal-style sender (`@gmail.com` if domain auth is not perfect).
*   Minimize heavy HTML/CSS.
*   Include a prominent "Reply-To" notice in the footer to encourage user interaction (which tells Gmail it's a primary conversation).

### C. Domain Authentication (SPF/DKIM)
For professional domains (e.g., `saga-deu.de`), ensure the Brevo DNS records are added to your hosting provider. Without this, emails may be flagged as spam.

## 📊 5. Marketing Campaigns
To manage mass broadcasts, use the `EmailCampaignsApi` to create and schedule campaigns dynamically from the backend.

## 🎨 6. Universal Email Admin Manager (Frontend)
A portable React component is available in `CORE_INTELLIGENCE/UniversalEmailAdminManager.tsx`. This component allows you to manage broadcasts across any project with adaptive theming.

### Usage:
```tsx
import { UniversalEmailAdminManager } from './UniversalEmailAdminManager';
import { functions } from './firebase'; // Your project's firebase config

const theme = {
  primary: '#7C3AED', // Soulamore Purple
  surface: '#F9FAFB',
  background: '#FFFFFF',
  border: '#E5E7EB',
  text: '#111827',
  fontSerif: 'Georgia, serif'
};

<UniversalEmailAdminManager 
  brandName="Soulamore"
  functions={functions}
  theme={theme}
  defaultTemplates={[
    { id: 'welcome', label: 'Welcome Email', subject: 'Welcome to Soulamore', body: 'Hello {{NAME}}...' }
  ]}
/>
```

---
*Documentation provided by Antigravity - Core Intelligence Knowledge Base.*
