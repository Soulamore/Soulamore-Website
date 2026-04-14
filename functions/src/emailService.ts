import * as functions from 'firebase-functions/v1';
import * as fs from 'fs';
import * as path from 'path';
const { SendMailClient } = require("zeptomail");

/**
 * Soulamore ZeptoMail Service
 * Official API Integration for High-Performance Delivery (v2.2 Superior)
 */

const ZEPTOMAIL_URL = "https://api.zeptomail.eu/";
const SENDER_EMAIL = "hello@soulamore.com"; // Branded Soulamore Sender Address

export interface EmailRecipient {
  email: string;
  name?: string;
}

export type TemplateType =
  | 'newsletter_welcome'
  | 'signup_welcome'
  | 'lifeline_receipt'
  | 'application_received'
  | 'booking_confirmed'
  | 'booking_reminder'
  | 'password_reset'
  | 'password_changed';

/**
 * Template Path Mapping
 */
const TEMPLATE_MAP: Record<TemplateType, string> = {
  'newsletter_welcome': 'onboarding/newsletter_welcome',
  'signup_welcome': 'onboarding/signup_welcome',
  'lifeline_receipt': 'support/lifeline_receipt',
  'application_received': 'onboarding/application_received',
  'booking_confirmed': 'bookings/booking_confirmed',
  'booking_reminder': 'bookings/booking_reminder',
  'password_reset': 'account/password_reset',
  'password_changed': 'account/password_changed'
};

/**
 * Helper: Load and Compile Template
 * Robust Fallback: Returns basic text if template is missing.
 */
function compileTemplate(templateName: TemplateType, data: Record<string, any>): string {
  try {
    const relativePath = TEMPLATE_MAP[templateName] || templateName;
    const templatePath = path.join(__dirname, 'templates', `${relativePath}.html`);
    
    if (!fs.existsSync(templatePath)) {
      functions.logger.warn(`Template not found at ${templatePath}. Using fallback.`);
      return `
        <div style="font-family: 'Lora', serif; padding: 20px; color: #0f172a;">
          <h2 style="color: #8E44AD;">Soulamore</h2>
          <p>Hello ${data.name || 'Friend'},</p>
          <p>This is an automated update regarding your Soulamore experience (${templateName}).</p>
          <hr/>
          <p>Stay Soulful,<br/>The Soulamore Team</p>
        </div>
      `;
    }

    let html = fs.readFileSync(templatePath, 'utf8');

    Object.keys(data).forEach(key => {
      const value = data[key] !== undefined && data[key] !== null ? String(data[key]) : '';
      const regex = new RegExp(`{{${key.toUpperCase()}}}`, 'g');
      html = html.replace(regex, value);
    });

    html = html.replace(/{{YEAR}}/g, new Date().getFullYear().toString());
    html = html.replace(/{{WEBSITE_URL}}/g, 'https://soulamore.com');
    html = html.replace(/{{ACCENT_COLOR}}/g, '#8E44AD');
    
    // Global Fallback for Name if not already replaced
    html = html.replace(/{{NAME}}/g, data.name || 'Friend');

    return html;
  } catch (error) {
    functions.logger.error(`Error loading template ${templateName}:`, error);
    return `<p>Soulamore Message: ${templateName} processed.</p>`;
  }
}

/**
 * Core Delivery Function
 */
export async function sendEmail(recipient: EmailRecipient, subject: string, html: string) {
  try {
    // Standard V2.2 Secrets Check
    const rawToken = (process.env.ZEPTOMAIL_SEND_TOKEN || (functions as any).config().zeptomail?.token)?.trim();
    
    if (!rawToken) {
      functions.logger.error('CRITICAL: ZEPTOMAIL_SEND_TOKEN is missing from environment/config.');
      return { success: false, error: 'Missing Token' };
    }

    const authHeaderToken = rawToken.startsWith('Zoho-enczapikey') ? rawToken : `Zoho-enczapikey ${rawToken}`;

    const client = new SendMailClient({
      url: ZEPTOMAIL_URL,
      token: authHeaderToken
    });

    const payload = {
      from: {
        address: SENDER_EMAIL,
        name: "Soulamore"
      },
      to: [
        {
          email_address: {
            address: recipient.email,
            name: recipient.name || "Friend"
          }
        }
      ],
      subject: subject,
      htmlbody: html
    };

    const response = await client.sendMail(payload);

    if (response && (response.message === 'OK' || response.message === 'success')) {
      functions.logger.info(`✅ Successfully sent "${subject}" to ${recipient.email}`);
      return { success: true, data: response };
    } else {
      functions.logger.error('❌ ZeptoMail delivery failure:', JSON.stringify(response));
      return { success: false, error: 'Delivery Failed', details: response };
    }
  } catch (error: any) {
    functions.logger.error('💥 Execution error in sendEmail:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Template Engine
 */
export function generateSoulamoreEmail(type: TemplateType, data: any) {
  let subject = '';
  
  switch (type) {
    case 'newsletter_welcome': subject = "Welcome to the Soulamore Universe"; break;
    case 'lifeline_receipt': subject = "We Hear You - Soulamore Lifeline"; break;
    case 'application_received': subject = "Application Received: Join the Soulamore Collective"; break;
    case 'booking_confirmed': subject = "Your Soulamore Session is Confirmed"; break;
    case 'booking_reminder': subject = "Reminder: Your Soul Session Starts Soon"; break;
    case 'password_reset': subject = "Reset Your Soulamore Password"; break;
    case 'password_changed': subject = "Your Soulamore Password was Changed"; break;
    default: subject = "Message from Soulamore";
  }

  const html = compileTemplate(type, data);
  return { subject, html };
}
