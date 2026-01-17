/**
 * Peer Booking Handler
 * Manages peer availability, scheduling, booking, and payment integration
 */

import { db, collection, addDoc, doc, getDoc, setDoc, updateDoc, getDocs, query, where, serverTimestamp, Timestamp } from "./firebase-config.js";

const PEER_BOOKINGS_COLLECTION = "peer_bookings";
const PEER_AVAILABILITY_COLLECTION = "peer_availability";
const PEER_PLANS_COLLECTION = "peer_plans";
const PAYMENTS_COLLECTION = "payments";

/**
 * Peer Pricing Plans Configuration
 */
export const PEER_PLAN_TYPES = {
    PER_SESSION: "per_session",
    MONTHLY: "monthly",
    QUARTERLY: "quarterly",
    YEARLY: "yearly"
};

/**
 * Default pricing structure (can be customized per peer)
 */
export const DEFAULT_PLANS = {
    [PEER_PLAN_TYPES.PER_SESSION]: {
        name: "Per Session",
        duration: 1, // 1 session
        sessions: 1,
        price: 500, // ₹500 per session
        description: "Pay per session - book individual sessions as needed"
    },
    [PEER_PLAN_TYPES.MONTHLY]: {
        name: "Monthly Plan",
        duration: 30, // days
        sessions: 4, // 4 sessions per month
        price: 1500, // ₹1500/month (saves ₹500)
        description: "4 sessions per month - save 25% compared to per session"
    },
    [PEER_PLAN_TYPES.QUARTERLY]: {
        name: "Quarterly Plan",
        duration: 90, // days
        sessions: 12, // 12 sessions over 3 months
        price: 4500, // ₹4500/quarter (saves ₹1500)
        description: "12 sessions over 3 months - save 25% with quarterly commitment"
    },
    [PEER_PLAN_TYPES.YEARLY]: {
        name: "Yearly Plan",
        duration: 365, // days
        sessions: 48, // 48 sessions per year
        price: 15000, // ₹15000/year (saves ₹9000)
        description: "48 sessions per year - save 37% with annual commitment"
    }
};

/**
 * Create or update peer availability schedule
 * @param {string} peerId - Peer's user ID
 * @param {Array} availability - Array of availability slots { day: 'monday', startTime: '09:00', endTime: '17:00', timezone: 'Asia/Kolkata' }
 * @returns {Promise<boolean>}
 */
export async function setPeerAvailability(peerId, availability) {
    try {
        const availabilityRef = doc(db, PEER_AVAILABILITY_COLLECTION, peerId);
        await setDoc(availabilityRef, {
            peerId: peerId,
            availability: availability,
            timezone: "Asia/Kolkata", // Default timezone
            updatedAt: serverTimestamp()
        }, { merge: true });
        
        console.log("Peer availability set:", peerId);
        return true;
    } catch (error) {
        console.error("Error setting peer availability:", error);
        return false;
    }
}

/**
 * Get peer availability schedule
 * @param {string} peerId - Peer's user ID
 * @returns {Promise<object|null>}
 */
export async function getPeerAvailability(peerId) {
    try {
        const availabilityRef = doc(db, PEER_AVAILABILITY_COLLECTION, peerId);
        const docSnap = await getDoc(availabilityRef);
        
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting peer availability:", error);
        return null;
    }
}

/**
 * Check if a time slot is available for booking
 * @param {string} peerId - Peer's user ID
 * @param {Date} startTime - Booking start time
 * @param {Date} endTime - Booking end time
 * @returns {Promise<boolean>}
 */
export async function checkSlotAvailability(peerId, startTime, endTime) {
    try {
        // Get existing bookings for this peer in the time range
        const bookingsRef = collection(db, PEER_BOOKINGS_COLLECTION);
        const q = query(
            bookingsRef,
            where("peerId", "==", peerId),
            where("status", "in", ["confirmed", "pending"])
        );
        
        const snapshot = await getDocs(q);
        const existingBookings = snapshot.docs.map(doc => doc.data());
        
        // Check for conflicts
        const bookingStart = new Date(startTime).getTime();
        const bookingEnd = new Date(endTime).getTime();
        
        for (const booking of existingBookings) {
            const existingStart = booking.startTime?.toDate?.()?.getTime() || new Date(booking.startTime).getTime();
            const existingEnd = booking.endTime?.toDate?.()?.getTime() || new Date(booking.endTime).getTime();
            
            // Check for overlap
            if ((bookingStart < existingEnd && bookingEnd > existingStart)) {
                return false; // Slot is booked
            }
        }
        
        return true; // Slot is available
    } catch (error) {
        console.error("Error checking slot availability:", error);
        return false;
    }
}

/**
 * Get available time slots for a peer on a specific date
 * @param {string} peerId - Peer's user ID
 * @param {Date} date - Date to check availability
 * @returns {Promise<Array>} Array of available time slots
 */
export async function getAvailableSlots(peerId, date) {
    try {
        const availability = await getPeerAvailability(peerId);
        if (!availability || !availability.availability) {
            return [];
        }
        
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const daySchedule = availability.availability.find(slot => slot.day.toLowerCase() === dayName);
        
        if (!daySchedule) {
            return []; // Peer not available on this day
        }
        
        // Generate time slots (every hour or based on session duration)
        const slots = [];
        const [startHour, startMin] = daySchedule.startTime.split(':').map(Number);
        const [endHour, endMin] = daySchedule.endTime.split(':').map(Number);
        
        const startTime = new Date(date);
        startTime.setHours(startHour, startMin, 0, 0);
        
        const endTime = new Date(date);
        endTime.setHours(endHour, endMin, 0, 0);
        
        // Generate slots (1 hour sessions by default)
        let currentTime = new Date(startTime);
        while (currentTime < endTime) {
            const slotEnd = new Date(currentTime);
            slotEnd.setHours(currentTime.getHours() + 1);
            
            // Check if this slot is available (not booked)
            const isAvailable = await checkSlotAvailability(peerId, currentTime, slotEnd);
            
            if (isAvailable) {
                slots.push({
                    start: new Date(currentTime),
                    end: new Date(slotEnd),
                    display: currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                });
            }
            
            currentTime.setHours(currentTime.getHours() + 1);
        }
        
        return slots;
    } catch (error) {
        console.error("Error getting available slots:", error);
        return [];
    }
}

/**
 * Create a booking (before payment)
 * @param {string} userId - User making the booking
 * @param {string} peerId - Peer being booked
 * @param {string} planType - Type of plan (per_session, monthly, etc.)
 * @param {Date} startTime - Booking start time
 * @param {Date} endTime - Booking end time
 * @returns {Promise<{bookingId: string, amount: number}|null>}
 */
export async function createBookingRequest(userId, peerId, planType, startTime, endTime) {
    try {
        // Get plan details
        const plan = DEFAULT_PLANS[planType] || DEFAULT_PLANS[PEER_PLAN_TYPES.PER_SESSION];
        
        // Check availability
        const isAvailable = await checkSlotAvailability(peerId, startTime, endTime);
        if (!isAvailable) {
            throw new Error("Time slot is no longer available");
        }
        
        // Create booking document
        const bookingRef = await addDoc(collection(db, PEER_BOOKINGS_COLLECTION), {
            userId: userId,
            peerId: peerId,
            planType: planType,
            startTime: Timestamp.fromDate(new Date(startTime)),
            endTime: Timestamp.fromDate(new Date(endTime)),
            amount: plan.price,
            sessions: plan.sessions,
            status: "pending_payment", // pending_payment -> confirmed -> completed -> cancelled
            paymentId: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        
        console.log("Booking request created:", bookingRef.id);
        
        return {
            bookingId: bookingRef.id,
            amount: plan.price,
            plan: plan
        };
    } catch (error) {
        console.error("Error creating booking request:", error);
        throw error;
    }
}

/**
 * Confirm booking after payment success
 * @param {string} bookingId - Booking ID
 * @param {string} paymentId - Payment transaction ID
 * @param {object} paymentData - Payment details from gateway
 * @returns {Promise<boolean>}
 */
export async function confirmBooking(bookingId, paymentId, paymentData) {
    try {
        const bookingRef = doc(db, PEER_BOOKINGS_COLLECTION, bookingId);
        
        await updateDoc(bookingRef, {
            status: "confirmed",
            paymentId: paymentId,
            paymentData: paymentData,
            confirmedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        
        // Also create payment record
        await addDoc(collection(db, PAYMENTS_COLLECTION), {
            bookingId: bookingId,
            paymentId: paymentId,
            amount: paymentData.amount,
            currency: paymentData.currency || "INR",
            gateway: paymentData.gateway || "razorpay",
            status: "success",
            metadata: paymentData,
            createdAt: serverTimestamp()
        });
        
        console.log("Booking confirmed:", bookingId);
        return true;
    } catch (error) {
        console.error("Error confirming booking:", error);
        return false;
    }
}

/**
 * Get user's bookings
 * @param {string} userId - User ID
 * @returns {Promise<Array>}
 */
export async function getUserBookings(userId) {
    try {
        const bookingsRef = collection(db, PEER_BOOKINGS_COLLECTION);
        const q = query(bookingsRef, where("userId", "==", userId));
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            startTime: doc.data().startTime?.toDate?.() || doc.data().startTime,
            endTime: doc.data().endTime?.toDate?.() || doc.data().endTime
        }));
    } catch (error) {
        console.error("Error getting user bookings:", error);
        return [];
    }
}

/**
 * Get peer's bookings
 * @param {string} peerId - Peer ID
 * @returns {Promise<Array>}
 */
export async function getPeerBookings(peerId) {
    try {
        const bookingsRef = collection(db, PEER_BOOKINGS_COLLECTION);
        const q = query(bookingsRef, where("peerId", "==", peerId));
        
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            startTime: doc.data().startTime?.toDate?.() || doc.data().startTime,
            endTime: doc.data().endTime?.toDate?.() || doc.data().endTime
        }));
    } catch (error) {
        console.error("Error getting peer bookings:", error);
        return [];
    }
}

