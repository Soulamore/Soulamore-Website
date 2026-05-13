import * as functions from 'firebase-functions/v1';
import * as fs from 'fs';
import * as path from 'path';
import { TransactionalEmailsApi, TransactionalEmailsApiApiKeys } from '@getbrevo/brevo';

/**
 * Soulamore Brevo Service
 * Official API Integration for High-Performance Delivery (v3.0 Brevo)
 */

const apiInstance = new TransactionalEmailsApi();
// Initialize API Key from environment or fallback to the one provided in CORE_INTELLIGENCE
const BREVO_KEY = (process.env.BREVO_API_KEY || (functions as any).config().brevo?.key)?.trim();
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, BREVO_KEY);

const SENDER_EMAIL = "care@soulamore.com"; 
const SENDER_NAME = "Soulamore Care";

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
  | 'password_changed'
  | 'assessment_report'
  | 'broadcast';

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
  'password_changed': 'account/password_changed',
  'assessment_report': 'assessments/assessment_report_clinical',
  'broadcast': 'campaigns/broadcast'
};

/**
 * Helper: Load and Compile Template
 * Robust Fallback: Returns basic text if template is missing.
 */
export function compileTemplate(recipient: EmailRecipient, subject: string, body: string, templateName?: TemplateType): string {
  try {
    const data: Record<string, any> = { name: recipient.name, email: recipient.email, subject };
    const relativePath = templateName ? TEMPLATE_MAP[templateName] : null;
    const templatePath = path.join(__dirname, 'templates', `${relativePath}.html`);
    
    // Soulful Header & Footer (CSS for breathing animation)
    const SOUL_STYLE = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;500;700&family=Lora:italic,wght@0,400;1,400&display=swap');
        .soul-container { font-family: 'Outfit', sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; }
        .soul-header { padding: 40px 0; text-align: center; }
        .soul-body { padding: 0 20px; font-size: 1.05rem; }
        .soul-footer { padding: 60px 20px; text-align: center; border-top: 1px solid #f1f5f9; margin-top: 40px; }
        .breathing-prompt { 
          display: inline-block;
          padding: 20px;
          border-radius: 50%;
          background: rgba(142, 68, 173, 0.05);
          border: 1px solid rgba(142, 68, 173, 0.1);
          margin: 20px 0;
          animation: breath 8s ease-in-out infinite;
        }
        @keyframes breath {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.1); opacity: 1; }
        }
        .quote { font-family: 'Lora', serif; font-style: italic; color: #64748b; margin: 20px 0; }
      </style>
    `;

    const SOUL_FOOTER = `
      <div class="soul-footer">
        <div class="breathing-prompt">
          <div style="font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: #8E44AD;">Breathe</div>
          <div style="font-size: 0.6rem; opacity: 0.6;">Inhale ... Exhale</div>
        </div>
        <p class="quote">"Deep breaths are like little love notes to your soul."</p>
        <p style="font-size: 0.85rem; opacity: 0.5;">Stay Soulful,<br/>The Soulamore Collective</p>
      </div>
    `;

    if (!relativePath || !fs.existsSync(templatePath)) {
      if (templateName && templateName !== 'broadcast') {
          functions.logger.warn(`Template not found at ${templatePath}. Using fallback.`);
      }
      return `
        ${SOUL_STYLE}
        <div class="soul-container">
          <div class="soul-header">
            <h1 style="color: #8E44AD; font-family: 'Outfit'; font-weight: 700;">Soulamore</h1>
          </div>
          <div class="soul-body">
            <p>Hi ${data.name || 'dear soul'},</p>
            ${body}
          </div>
          ${SOUL_FOOTER}
        </div>
      `;
    }

    let html = fs.readFileSync(templatePath, 'utf8');

    // Inject Soulful Elements if not present
    if (!html.includes('soul-container')) {
      html = `${SOUL_STYLE}<div class="soul-container">${html}${SOUL_FOOTER}</div>`;
    }

    Object.keys(data).forEach(key => {
      const value = data[key] !== undefined && data[key] !== null ? String(data[key]) : '';
      const regex = new RegExp(`{{${key.toUpperCase()}}}`, 'g');
      html = html.replace(regex, value);
    });

    html = html.replace(/{{YEAR}}/g, new Date().getFullYear().toString());
    html = html.replace(/{{WEBSITE_URL}}/g, 'https://soulamore.com');
    html = html.replace(/{{ACCENT_COLOR}}/g, '#8E44AD');
    
    // Global Fallback for Name
    html = html.replace(/{{NAME}}/g, data.name || 'dear soul');

    return html;
  } catch (error) {
    functions.logger.error(`Error loading template ${templateName}:`, error);
    return `<p>A soulful message from Soulamore is on its way.</p>`;
  }
}

/**
 * Core Delivery Function
 */
export async function sendEmail(recipient: EmailRecipient, subject: string, htmlContent: string) {
  try {
    const sendSmtpEmail = {
      subject: subject,
      htmlContent: htmlContent,
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: recipient.email, name: recipient.name || "Soul" }],
      replyTo: { email: SENDER_EMAIL, name: SENDER_NAME }
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail as any);
    
    functions.logger.info(`✅ Successfully sent soulful update to ${recipient.email}`);
    return { success: true, messageId: data.body.messageId };
  } catch (error: any) {
    functions.logger.error('💥 Execution error in sendEmail (Brevo):', error.message);
    return { success: false, error: error.message };
  }
}


/**
 * Template Engine
 */
export function generateSoulamoreEmail(type: TemplateType, data: any) {
  let subject = '';
  
  switch (type) {
    case 'newsletter_welcome': subject = "Welcome to the Soulamore Collective"; break;
    case 'lifeline_receipt': subject = "We hear you, and we're here for you"; break;
    case 'application_received': subject = "Your journey towards the Collective begins"; break;
    case 'booking_confirmed': subject = "Your space is held. Session confirmed."; break;
    case 'booking_reminder': subject = "A gentle reminder for your upcoming session"; break;
    case 'password_reset': subject = "Secure your Soulamore account"; break;
    case 'password_changed': subject = "Your account security has been updated"; break;
    case 'assessment_report': subject = "Your Emotional Reflection is ready"; break;
    default: subject = "A soulful update from Soulamore";
  }

  const html = compileTemplate({ email: 'broadcast@soulamore.com' }, subject, '', type);
  return { subject, html };
}

