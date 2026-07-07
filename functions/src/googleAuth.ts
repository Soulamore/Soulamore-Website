import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

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

        const { google } = require('googleapis');
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

export const exchangeGoogleCode = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in.');
    }
    
    const code = data.code;
    if (!code) {
        throw new functions.https.HttpsError('invalid-argument', 'No authorization code provided.');
    }

    try {
        const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
        const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

        if (!CLIENT_ID || !CLIENT_SECRET) {
            throw new Error("Google Calendar configuration is missing client secrets.");
        }

        const { google } = require('googleapis');
        const oauth2Client = new google.auth.OAuth2(
            CLIENT_ID,
            CLIENT_SECRET,
            REDIRECT_URI
        );

        const { tokens } = await oauth2Client.getToken(code);
        
        // Store tokens in practitioner_metadata (encrypted in a perfect world)
        await admin.firestore().collection('practitioner_metadata').doc(context.auth.uid).set({
            gcalLinked: true,
            gcalTokens: tokens, // Includes access_token and refresh_token
            updatedAt: admin.firestore.FieldValue.serverTimestamp()
        }, { merge: true });

        return { success: true };
    } catch (error: any) {
        console.error("🔥 [exchangeGoogleCode] Error:", error.message);
        throw new functions.https.HttpsError('internal', error.message || 'Google token exchange failed.');
    }
});

/**
 * Securely retrieve busy slots for a given peer to check availability.
 * Avoids exposing patient/user private details to client queries.
 */
export const getPeerBusySlots = functions.https.onCall(async (data, context) => {
    const peerId = data.peerId;
    if (!peerId) {
        throw new functions.https.HttpsError('invalid-argument', 'No peer ID provided.');
    }

    try {
        const bookingsRef = admin.firestore().collection('peer_bookings');
        const snapshot = await bookingsRef
            .where('peerId', '==', peerId)
            .where('status', 'in', ['confirmed', 'pending'])
            .get();

        const busySlots = snapshot.docs.map(doc => {
            const bData = doc.data();
            return {
                startTime: bData.startTime,
                endTime: bData.endTime
            };
        });

        return { busySlots };
    } catch (error: any) {
        console.error("🔥 [getPeerBusySlots] Error:", error.message);
        throw new functions.https.HttpsError('internal', error.message || 'Failed to check busy slots.');
    }
});

