
import { auth, db } from "./firebase-config.js";
import { doc, setDoc, getDoc, collection, addDoc, onSnapshot, serverTimestamp, increment, runTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// --- STRIPE MOCK INTEGRATION ---
// In a real app, this would call a Cloud Function which calls Stripe API.
// Here, we simulate the "Success" webhook client-side for demonstration.

export async function initWalletListener(userId, callback) {
    if (!userId) return;
    const walletRef = doc(db, "wallets", userId);

    // Listen for realtime updates
    return onSnapshot(walletRef, (docSnap) => {
        if (docSnap.exists()) {
            callback(docSnap.data());
        } else {
            // Create empty wallet if none exists
            setDoc(walletRef, {
                balance: 0,
                currency: 'USD',
                updatedAt: serverTimestamp()
            });
            callback({ balance: 0, currency: 'USD' });
        }
    });
}

export async function addFundsMock(amount) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    // 1. Simulate Stripe Checkout Redirect
    console.log(`Redirecting to Stripe for $${amount}...`);
    await new Promise(r => setTimeout(r, 1500)); // Simulate network delay

    // 2. Simulate Webhook / Success (In real app, this happens server-side)
    const walletRef = doc(db, "wallets", user.uid);
    const transRef = collection(db, "transactions");

    try {
        await runTransaction(db, async (transaction) => {
            const walletDoc = await transaction.get(walletRef);
            if (!walletDoc.exists()) {
                transaction.set(walletRef, { balance: amount, currency: 'USD' });
            } else {
                transaction.update(walletRef, { balance: increment(amount) });
            }

            // Record Transaction
            const newTransRef = doc(transRef);
            transaction.set(newTransRef, {
                userId: user.uid,
                amount: amount,
                type: 'deposit',
                status: 'completed',
                description: 'Added funds via Stripe',
                timestamp: serverTimestamp()
            });
        });
        return { success: true, message: `Successfully added $${amount}` };
    } catch (e) {
        console.error("Transaction failed: ", e);
        return { success: false, message: e.message };
    }
}

export async function paySession(psychId, amount, sessionDate) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const clientWalletRef = doc(db, "wallets", user.uid);
    const psychWalletRef = doc(db, "wallets", psychId);
    const transRef = collection(db, "transactions");

    try {
        await runTransaction(db, async (transaction) => {
            const clientDoc = await transaction.get(clientWalletRef);
            if (!clientDoc.exists() || clientDoc.data().balance < amount) {
                throw new Error("Insufficient funds");
            }

            // Deduct from Client
            transaction.update(clientWalletRef, { balance: increment(-amount) });

            // Add to Psych (Platform takes 0% cut in this demo, typically would be less)
            transaction.update(psychWalletRef, { balance: increment(amount) });

            // Record Client Expense
            const clientTrans = doc(transRef);
            transaction.set(clientTrans, {
                userId: user.uid,
                amount: -amount,
                type: 'payment',
                counterparty: psychId,
                description: `Session Payment: ${sessionDate}`,
                status: 'completed',
                timestamp: serverTimestamp()
            });

            // Record Psych Income
            const psychTrans = doc(transRef);
            transaction.set(psychTrans, {
                userId: psychId,
                amount: amount,
                type: 'income',
                counterparty: user.uid,
                description: `Session Income`,
                status: 'completed',
                timestamp: serverTimestamp()
            });
        });
        return { success: true };
    } catch (e) {
        return { success: false, message: e.message };
    }
}

export async function getTransactionHistory(userId) {
    // Basic fetch - in real app would use query() and where()
    // For now returning mock or implemented later if needed
    // This is optional for the UI demo as we focus on Balance
}
