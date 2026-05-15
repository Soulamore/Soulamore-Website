import * as functions from 'firebase-functions/v1';
import { google } from 'googleapis';

/**
 * Google Auth Handler
 * Provides URLs for OAuth2 flow (Calendar/Meet Integration)
 */

const REDIRECT_URI = 'https://soulamore.com/portal/auth-callback.html';

export const getGoogleAuthUrl = functions.https.onCall(async (data, context) => {
    // 1. Auth Guard
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }

    try {
        // Initialize OAuth2 client
        // These secrets should be in Secret Manager in production
        const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

        if (!CLIENT_ID || !CLIENT_SECRET) {
            console.warn("⚠️ Google Auth secrets not configured. Returning fallback error.");
            throw new Error("Google Calendar integration is currently being configured. Please try again later.");
        }

        const oauth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
        );

        const scopes = [
            'https://www.googleapis.com/auth/calendar.events',
            'https://www.googleapis.com/auth/userinfo.email'
        ];

        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            prompt: 'consent',
            state: context.auth.uid // Pass UID to associate on callback
        });

        return { url };
    } catch (error: any) {
        console.error("🔥 [getGoogleAuthUrl] Error:", error.message);
        throw new functions.https.HttpsError('internal', error.message || 'Failed to generate auth URL');
    }
});
