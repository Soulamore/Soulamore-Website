import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';
import { handleLlmRequest } from '../llmRouter';
import { sendEmail } from '../emailService';

const db = admin.firestore();

async function moderateTextContent(text: string, docId: string, contentType: string, docPath: string) {
  if (!text || text.trim() === '') return null;

  const systemPrompt = `You are the Soulamore AI Safety Moderator. Your job is to classify user-input text for safety.
Analyze the text for:
1. Direct self-harm or suicide statements.
2. Severe hate speech, targeted harassment, or severe abuse.
3. Personal contact details (e.g. phone numbers, email addresses) unless specifically permitted.
If the text contains any of these, classify it as flagged.
You MUST reply strictly in JSON format matching this schema:
{
  "flagged": boolean,
  "reason": "short explanation of why it was flagged, or empty if safe"
}`;

  try {
    const result = await handleLlmRequest({
      appId: 'soulamore',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: text }
      ],
      model: 'gemini-2.5-flash',
      temperature: 0.1
    }, null);

    if (result && result.choices && result.choices[0] && result.choices[0].message) {
      const content = result.choices[0].message.content;
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.replace(/^```json\s*/, '').replace(/```$/, '').trim();
      }
      const parsed = JSON.parse(cleanContent);

      if (parsed.flagged) {
        console.log(`⚠️ Content flagged [${contentType}] Doc: ${docId}. Reason: ${parsed.reason}`);
        
        // Write to safety reports collection
        await db.collection('safety_reports').add({
          contentId: docId,
          contentType: contentType,
          originalContent: text,
          flaggedReason: parsed.reason || 'AI Flagged',
          timestamp: admin.firestore.FieldValue.serverTimestamp(),
          status: 'pending_review',
          docPath: docPath
        });

        // Hide/Flag original document
        if (contentType === 'confession') {
          await db.doc(docPath).update({ status: 'flagged', isHidden: true });
        } else if (contentType === 'postcard') {
          await db.doc(docPath).update({ status: 'flagged', isHidden: true });
        } else if (contentType === 'problem-wall-note') {
          await db.doc(docPath).update({ status: 'flagged', isHidden: true });
        } else if (contentType === 'chat-message') {
          await db.doc(docPath).update({ status: 'flagged', isHidden: true });
        }

        // Send real-time email alert to administrator
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">⚠️ SAFETY ALERT: Flagged Content (${contentType})</h2>
            <p>User-submitted content has been flagged by AI Moderation.</p>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold; width: 150px;">Content Type</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${contentType}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Document ID</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${docId}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Document Path</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;"><code>${docPath}</code></td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Flagged Reason</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; color: #ef4444; font-weight: bold;">${parsed.reason || 'AI Flagged'}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-weight: bold;">Raw Text Content</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb; font-style: italic;">"${text}"</td>
              </tr>
            </table>
            <p style="margin-top: 25px;">Please review this document immediately in the Soulamore Admin Panel.</p>
          </div>
        `;

        await sendEmail(
          { email: 'contact.soullamore@gmail.com', name: 'Soulamore Admin' },
          `⚠️ SAFETY ALERT: Flagged Content (${contentType})`,
          emailHtml
        );
      }
    }
  } catch (err: any) {
    console.error(`Error moderating content: ${err.message}`);
  }
  return null;
}

export const onConfessionCreated = functions.firestore
  .document('confessions/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data || !data.content) return null;
    return await moderateTextContent(data.content, context.params.docId, 'confession', `confessions/${context.params.docId}`);
  });

export const onPostcardCreated = functions.firestore
  .document('postcards/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data || !data.message) return null;
    return await moderateTextContent(data.message, context.params.docId, 'postcard', `postcards/${context.params.docId}`);
  });

export const onProblemWallNoteCreated = functions.firestore
  .document('problem-wall-notes/{docId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data || !data.text) return null;
    return await moderateTextContent(data.text, context.params.docId, 'problem-wall-note', `problem-wall-notes/${context.params.docId}`);
  });

export const onBookingMessageCreated = functions.firestore
  .document('peer_bookings/{bookingId}/messages/{messageId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data || !data.text) return null;
    const path = `peer_bookings/${context.params.bookingId}/messages/${context.params.messageId}`;
    return await moderateTextContent(data.text, context.params.messageId, 'chat-message', path);
  });

export const onGlobalMessageCreated = functions.firestore
  .document('messages/{messageId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data || !data.text) return null;
    return await moderateTextContent(data.text, context.params.messageId, 'chat-message', `messages/${context.params.messageId}`);
  });
