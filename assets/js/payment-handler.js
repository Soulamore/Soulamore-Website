/**
 * Secure Razorpay test-payment integration.
 * Orders and signature verification are handled by authenticated Firebase Functions.
 */
import { functionsInstance, httpsCallable } from "./firebase-config.js";

export function loadRazorpayScript() {
    return new Promise((resolve, reject) => {
        if (window.Razorpay) {
            resolve(window.Razorpay);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve(window.Razorpay);
        script.onerror = () => reject(new Error("Failed to load Razorpay Checkout."));
        document.body.appendChild(script);
    });
}

export async function createRazorpayOrder(bookingId) {
    if (!bookingId || typeof bookingId !== "string") {
        throw new Error("A valid booking ID is required.");
    }
    const createOrder = httpsCallable(functionsInstance, "createRazorpayOrder");
    const response = await createOrder({ bookingId });
    return response.data;
}

export async function verifyRazorpayPayment(bookingId, paymentResponse) {
    const verifyPayment = httpsCallable(functionsInstance, "verifyPayment");
    const response = await verifyPayment({
        bookingId,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_signature: paymentResponse.razorpay_signature
    });
    return response.data;
}

export async function openRazorpayCheckout(
    bookingId,
    _amount,
    _userId,
    userName,
    userEmail,
    userPhone,
    metadata = {}
) {
    const [Razorpay, order] = await Promise.all([
        loadRazorpayScript(),
        createRazorpayOrder(bookingId)
    ]);

    return new Promise((resolve, reject) => {
        let paymentSubmitted = false;
        const checkout = new Razorpay({
            key: order.keyId,
            amount: order.amount,
            currency: order.currency,
            order_id: order.orderId,
            name: "Soulamore",
            description: `Booking: ${metadata.planName || "Peer Session"}`,
            image: "/assets/images/logo.webp",
            prefill: {
                name: userName || "",
                email: userEmail || "",
                contact: userPhone || ""
            },
            notes: { bookingId },
            theme: { color: "#4ECDC4" },
            handler: async response => {
                paymentSubmitted = true;
                try {
                    const result = await verifyRazorpayPayment(bookingId, response);
                    resolve(result);
                } catch (error) {
                    console.error("Razorpay payment verification failed:", error);
                    reject(new Error(
                        error?.message || "Payment was received but could not be verified."
                    ));
                }
            },
            modal: {
                ondismiss: () => {
                    if (!paymentSubmitted) {
                        reject(new Error("Payment cancelled by user."));
                    }
                }
            }
        });

        checkout.on("payment.failed", response => {
            const description = response?.error?.description || "Payment failed.";
            reject(new Error(description));
        });
        checkout.open();
    });
}
