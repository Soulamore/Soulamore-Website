/**
 * Payment Handler - Razorpay Integration
 * Handles payment processing for peer bookings
 */

import { confirmBooking, getBooking } from "./peer-booking-handler.js";

// Razorpay configuration (should be loaded from environment/config)
// For production, use environment variables or Firebase Functions to keep keys secure
const RAZORPAY_KEY_ID = "rzp_test_S4uV6QL9r7JLPL"; // Test mode key - Replace with live key for production
const RAZORPAY_KEY_SECRET = "YOUR_RAZORPAY_KEY_SECRET"; // Keep secret - use in backend only (stored in Firebase Functions)

// Firebase Function URL for secure payment verification
// Get this URL after deploying Firebase Functions: firebase deploy --only functions
// Format: https://YOUR_REGION-YOUR_PROJECT_ID.cloudfunctions.net/verifyPayment
const FIREBASE_FUNCTION_URL = "https://us-central1-soulamore-f0a64.cloudfunctions.net/verifyPayment";

/**
 * Initialize Razorpay script dynamically
 */
export function loadRazorpayScript() {
    return new Promise((resolve, reject) => {
        if (window.Razorpay) {
            resolve(window.Razorpay);
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => resolve(window.Razorpay);
        script.onerror = () => reject(new Error('Failed to load Razorpay script'));
        document.body.appendChild(script);
    });
}

/**
 * Create Razorpay order (typically done on backend for security)
 * For now, we'll create it client-side with amount validation
 * In production, use Firebase Functions or backend API
 * @param {string} bookingId - Booking ID
 * @param {number} amount - Amount in INR (paise will be converted)
 * @param {string} userId - User ID
 * @param {object} metadata - Additional metadata
 * @returns {Promise<object>} Order details
 */
export async function createRazorpayOrder(bookingId, amount, userId, metadata = {}) {
    // In production, this should call your backend/Firebase Function
    // For now, we'll simulate with client-side validation
    
    const orderData = {
        amount: Math.round(amount * 100), // Convert to paise
        currency: "INR",
        receipt: `booking_${bookingId}_${Date.now()}`,
        notes: {
            bookingId: bookingId,
            userId: userId,
            ...metadata
        }
    };
    
    // TODO: Replace with actual API call to your backend
    // Example: const response = await fetch('/api/create-razorpay-order', { method: 'POST', body: JSON.stringify(orderData) });
    // For now, return order data structure (actual order creation happens in openRazorpayCheckout)
    
    return orderData;
}

/**
 * Open Razorpay checkout
 * @param {string} bookingId - Booking ID
 * @param {number} amount - Amount in INR
 * @param {string} userId - User ID
 * @param {string} userName - User name
 * @param {string} userEmail - User email
 * @param {string} userPhone - User phone
 * @param {object} metadata - Additional metadata
 * @returns {Promise<object>} Payment result
 */
export async function openRazorpayCheckout(bookingId, amount, userId, userName, userEmail, userPhone, metadata = {}) {
    try {
        // Load Razorpay script
        const Razorpay = await loadRazorpayScript();
        
        // Create order
        const orderData = await createRazorpayOrder(bookingId, amount, userId, metadata);
        
        return new Promise((resolve, reject) => {
            const options = {
                key: RAZORPAY_KEY_ID, // Your Razorpay Key ID
                amount: orderData.amount, // Amount in paise
                currency: orderData.currency,
                name: "Soulamore",
                description: `Booking: ${metadata.planName || 'Peer Session'}`,
                image: "/assets/images/logo.png", // Your logo
                order_id: orderData.id || null, // If order was pre-created on backend
                prefill: {
                    name: userName || "",
                    email: userEmail || "",
                    contact: userPhone || ""
                },
                notes: orderData.notes,
                theme: {
                    color: "#4ECDC4" // Match your brand color
                },
                handler: async function(response) {
                    // Payment success - verify with Firebase Function (secure)
                    console.log("Payment success:", response);
                    
                    try {
                        // Verify payment with Firebase Function (server-side)
                        const verifyResponse = await fetch(FIREBASE_FUNCTION_URL, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_signature: response.razorpay_signature,
                                bookingId: bookingId
                            })
                        });

                        const verifyResult = await verifyResponse.json();

                        if (!verifyResponse.ok || !verifyResult.success) {
                            throw new Error(verifyResult.error || 'Payment verification failed');
                        }

                        // Payment verified and booking confirmed by Firebase Function
                        resolve({
                            success: true,
                            bookingId: bookingId,
                            paymentId: response.razorpay_payment_id,
                            orderId: response.razorpay_order_id,
                            amount: amount
                        });
                    } catch (error) {
                        console.error("Error verifying payment:", error);
                        reject(error);
                    }
                },
                modal: {
                    ondismiss: function() {
                        // User closed the checkout
                        reject(new Error("Payment cancelled by user"));
                    }
                }
            };
            
            // Open Razorpay checkout
            const razorpay = new Razorpay(options);
            razorpay.open();
        });
    } catch (error) {
        console.error("Error opening Razorpay checkout:", error);
        throw error;
    }
}

/**
 * Verify payment signature (should be done on backend for security)
 * For now, we'll assume verification is done server-side
 * @param {object} paymentResponse - Payment response from Razorpay
 * @returns {Promise<boolean>}
 */
export async function verifyPaymentSignature(paymentResponse) {
    // In production, this should call your backend/Firebase Function
    // Payment signature verification requires your secret key, which should never be exposed client-side
    
    // Example: const verified = await fetch('/api/verify-razorpay-payment', {
    //     method: 'POST',
    //     body: JSON.stringify(paymentResponse)
    // });
    
    // For now, return true (assuming verification happens on backend)
    return true;
}

/**
 * Handle payment success callback
 * @param {string} bookingId - Booking ID
 * @param {object} paymentResponse - Payment response from Razorpay
 * @returns {Promise<boolean>}
 */
export async function handlePaymentSuccess(bookingId, paymentResponse) {
    try {
        // Verify payment signature (should be done on backend)
        const verified = await verifyPaymentSignature(paymentResponse);
        
        if (!verified) {
            throw new Error("Payment signature verification failed");
        }
        
        // Confirm booking
        const paymentData = {
            razorpay_payment_id: paymentResponse.razorpay_payment_id,
            razorpay_order_id: paymentResponse.razorpay_order_id,
            razorpay_signature: paymentResponse.razorpay_signature,
            amount: paymentResponse.amount / 100, // Convert paise to INR
            currency: "INR",
            gateway: "razorpay"
        };
        
        const confirmed = await confirmBooking(bookingId, paymentResponse.razorpay_payment_id, paymentData);
        
        return confirmed;
    } catch (error) {
        console.error("Error handling payment success:", error);
        throw error;
    }
}

