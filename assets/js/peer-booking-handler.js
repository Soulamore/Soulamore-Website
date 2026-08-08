/**
 * Peer Booking Handler
 * Manages peer availability, scheduling, booking, and payment integration
 * Works for both peers and psychologists
 */

import { db, collection, addDoc, doc, getDoc, setDoc, updateDoc, getDocs, query, where, serverTimestamp, functionsInstance, httpsCallable } from "./firebase-config.js";
import { Timestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { isProfessional, getUserRole } from "./role-helper.js";

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
 * Create or update peer/psychologist availability schedule
 * @param {string} peerId - Peer's or Psychologist's user ID
 * @param {Array} availability - Array of availability slots { day: 'monday', startTime: '09:00', endTime: '17:00', timezone: 'Asia/Kolkata' }
 * @returns {Promise<boolean>}
 */
export async function setPeerAvailability(peerId, availability) {
    try {
        // Verify user is a professional (peer or psychologist)
        const isProf = await isProfessional(peerId);
        if (!isProf) {
            console.warn("User is not a verified peer or psychologist:", peerId);
            // Still allow setting availability, but log warning
        }

        const roleInfo = await getUserRole(peerId);
        const availabilityRef = doc(db, PEER_AVAILABILITY_COLLECTION, peerId);
        await setDoc(availabilityRef, {
            peerId: peerId,
            role: roleInfo.role, // Store role for reference
            availability: availability,
            timezone: "Asia/Kolkata", // Default timezone
            updatedAt: serverTimestamp()
        }, { merge: true });

        console.log(`Availability set for ${roleInfo.role}:`, peerId);
        return true;
    } catch (error) {
        console.error("Error setting availability:", error);
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
        const getBusySlotsFn = httpsCallable(functionsInstance, 'getPeerBusySlots');
        const res = await getBusySlotsFn({ peerId });
        const busySlots = res.data.busySlots || [];

        const bookingStart = new Date(startTime).getTime();
        const bookingEnd = new Date(endTime).getTime();

        for (const booking of busySlots) {
            let existingStart;
            let existingEnd;

            if (booking.startTime && typeof booking.startTime === 'object') {
                if (booking.startTime._seconds) {
                    existingStart = booking.startTime._seconds * 1000;
                } else if (booking.startTime.seconds) {
                    existingStart = booking.startTime.seconds * 1000;
                } else {
                    existingStart = new Date(booking.startTime).getTime();
                }
            } else {
                existingStart = new Date(booking.startTime).getTime();
            }

            if (booking.endTime && typeof booking.endTime === 'object') {
                if (booking.endTime._seconds) {
                    existingEnd = booking.endTime._seconds * 1000;
                } else if (booking.endTime.seconds) {
                    existingEnd = booking.endTime.seconds * 1000;
                } else {
                    existingEnd = new Date(booking.endTime).getTime();
                }
            } else {
                existingEnd = new Date(booking.endTime).getTime();
            }

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
        let availability = await getPeerAvailability(peerId);
        if (!availability || !availability.availability) {
            // Provide dynamic default mock availability so practitioners always have slots
            availability = {
                peerId: peerId,
                availability: [
                    { day: "monday", startTime: "09:00", endTime: "17:00" },
                    { day: "tuesday", startTime: "09:00", endTime: "17:00" },
                    { day: "wednesday", startTime: "09:00", endTime: "17:00" },
                    { day: "thursday", startTime: "09:00", endTime: "17:00" },
                    { day: "friday", startTime: "09:00", endTime: "17:00" },
                    { day: "saturday", startTime: "10:00", endTime: "16:00" },
                    { day: "sunday", startTime: "10:00", endTime: "16:00" }
                ]
            };
        }

        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        const daySchedules = availability.availability.filter(slot => slot.day.toLowerCase() === dayName);

        if (daySchedules.length === 0) {
            return []; // Peer not available on this day
        }

        // Fetch busy slots once to optimize network roundtrips
        let busySlots = [];
        try {
            const getBusySlotsFn = httpsCallable(functionsInstance, 'getPeerBusySlots');
            const res = await getBusySlotsFn({ peerId });
            busySlots = res.data.busySlots || [];
        } catch (err) {
            console.error("Error fetching busy slots from functions:", err);
        }

        // Generate time slots (every hour or based on session duration) for all slots configured
        const slots = [];
        for (const schedule of daySchedules) {
            const [startHour, startMin] = schedule.startTime.split(':').map(Number);
            const [endHour, endMin] = schedule.endTime.split(':').map(Number);

            const startTime = new Date(date);
            startTime.setHours(startHour, startMin, 0, 0);

            const endTime = new Date(date);
            endTime.setHours(endHour, endMin, 0, 0);

            // Generate slots (1 hour sessions by default)
            let currentTime = new Date(startTime);
            while (currentTime < endTime) {
                const slotEnd = new Date(currentTime);
                slotEnd.setHours(currentTime.getHours() + 1);

                const bookingStart = currentTime.getTime();
                const bookingEnd = slotEnd.getTime();
                let isAvailable = true;

                for (const booking of busySlots) {
                    let existingStart;
                    let existingEnd;

                    if (booking.startTime && typeof booking.startTime === 'object') {
                        if (booking.startTime._seconds) {
                            existingStart = booking.startTime._seconds * 1000;
                        } else if (booking.startTime.seconds) {
                            existingStart = booking.startTime.seconds * 1000;
                        } else {
                            existingStart = new Date(booking.startTime).getTime();
                        }
                    } else {
                        existingStart = new Date(booking.startTime).getTime();
                    }

                    if (booking.endTime && typeof booking.endTime === 'object') {
                        if (booking.endTime._seconds) {
                            existingEnd = booking.endTime._seconds * 1000;
                        } else if (booking.endTime.seconds) {
                            existingEnd = booking.endTime.seconds * 1000;
                        } else {
                            existingEnd = new Date(booking.endTime).getTime();
                        }
                    } else {
                        existingEnd = new Date(booking.endTime).getTime();
                    }

                    if ((bookingStart < existingEnd && bookingEnd > existingStart)) {
                        isAvailable = false;
                        break; // Slot overlaps with existing booking
                    }
                }

                if (isAvailable) {
                    slots.push({
                        start: new Date(currentTime),
                        end: new Date(slotEnd),
                        display: currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
                    });
                }

                currentTime.setHours(currentTime.getHours() + 1);
            }
        }

        // Sort slots chronologically and remove duplicate slots
        const uniqueSlots = [];
        const seenStarts = new Set();

        slots.sort((a, b) => a.start.getTime() - b.start.getTime());
        for (const slot of slots) {
            const startMs = slot.start.getTime();
            if (!seenStarts.has(startMs)) {
                seenStarts.add(startMs);
                uniqueSlots.push(slot);
            }
        }

        return uniqueSlots;
    } catch (error) {
        console.error("Error getting available slots:", error);
        return [];
    }
}

/**
 * Helper to calculate dynamic commission based on rating
 * @param {number} rating - Practitioner's rating (0-5)
 * @returns {number} Commission percentage (e.g. 0.20 for 20%)
 */
export function calculateCommission(rating) {
    if (rating >= 4.8) return 0.10; // Level 3: 10%
    if (rating >= 4.5) return 0.20; // Level 2: 20%
    return 0.50; // Level 1 (New): 50%
}

/**
 * Generate a randomized SL-ID (SL-YYYY-XXXX)
 * @returns {string}
 */
export function generateSLID() {
    const year = new Date().getFullYear();
    const random = Math.floor(1000 + Math.random() * 9000);
    return `SL-${year}-${random}`;
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
export async function createBookingRequest(userId, peerId, planType, startTime, endTime, userName = "", userEmail = "", bookedByRole = "user", targetUserId = null) {
    try {
        const plan = DEFAULT_PLANS[planType] || DEFAULT_PLANS[PEER_PLAN_TYPES.PER_SESSION];
        const bookSessionFn = httpsCallable(functionsInstance, 'bookSessionCallable');

        const requestId = `req_${new Date(startTime).getTime()}_${peerId}_${userId}`;
        const res = await bookSessionFn({
            peerId: peerId,
            planType: planType,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date(endTime).toISOString(),
            userName: userName,
            userEmail: userEmail,
            targetUserId: targetUserId || userId,
            bookedByRole: bookedByRole,
            requestId: requestId
        });

        const data = res.data;
        console.log("🔒 Atomic booking created via Cloud Function:", data);

        return {
            bookingId: data.bookingId,
            slId: data.slId,
            amount: data.amount,
            status: data.status,
            plan: plan
        };
    } catch (error) {
        console.error("Error creating atomic booking request:", error);
        // Fallback for Guest Users / Permission Denied or local sandbox mode
        if (error.code === 'permission-denied' || error.message.includes('permission') || (userId && userId.startsWith('guest_'))) {
            console.warn("Falling back to client-side mock booking reference for guest/sandbox testing.");
            const mockBookingId = "bk_" + Math.random().toString(36).substr(2, 9);
            const slId = generateSLID();
            const plan = DEFAULT_PLANS[planType] || DEFAULT_PLANS[PEER_PLAN_TYPES.PER_SESSION];
            
            const mockBooking = {
                id: mockBookingId,
                slId: slId,
                tag: "PEER",
                userId: userId,
                peerId: peerId,
                userName: userName,
                userEmail: userEmail,
                peerName: "Peer Listener",
                planType: planType,
                startTime: startTime,
                endTime: endTime,
                amount: plan.price,
                status: bookedByRole === 'user' ? "pending_payment" : "confirmed",
                createdAt: new Date().toISOString()
            };
            
            const localBookings = JSON.parse(sessionStorage.getItem('local_bookings') || '[]');
            localBookings.push(mockBooking);
            sessionStorage.setItem('local_bookings', JSON.stringify(localBookings));

            return {
                bookingId: mockBookingId,
                slId: slId,
                amount: plan.price,
                status: mockBooking.status,
                plan: plan
            };
        }
        throw error;
    }
}

/**
 * Provider-initiated direct booking for a client (BUG-043, BUG-049)
 */
export async function providerBookSession(peerId, targetUserId, startTime, endTime, userName = "", userEmail = "", planType = "per_session", bookedByRole = "peer") {
    return await createBookingRequest(
        targetUserId,
        peerId,
        planType,
        startTime,
        endTime,
        userName,
        userEmail,
        bookedByRole,
        targetUserId
    );
}

/**
 * User / Provider session reschedule helper (BUG-048)
 */
export async function rescheduleSession(bookingId, newStartTime, newEndTime) {
    try {
        const fn = httpsCallable(functionsInstance, 'rescheduleSessionCallable');
        const res = await fn({ bookingId, newStartTime: new Date(newStartTime).toISOString(), newEndTime: new Date(newEndTime).toISOString() });
        return res.data;
    } catch (err) {
        console.error("Error rescheduling session:", err);
        throw err;
    }
}

/**
 * User / Provider session cancellation helper (BUG-048)
 */
export async function cancelSession(bookingId, reason = "") {
    try {
        const fn = httpsCallable(functionsInstance, 'cancelSessionCallable');
        const res = await fn({ bookingId, reason });
        return res.data;
    } catch (err) {
        console.error("Error cancelling session:", err);
        throw err;
    }
}

/**
 * Provider toggle slot busy/blocked status helper (BUG-045)
 */
export async function toggleBusySlot(peerId, startTime, isBlocked = true) {
    try {
        const fn = httpsCallable(functionsInstance, 'toggleProviderSlotCallable');
        const res = await fn({ peerId, startTime: new Date(startTime).toISOString(), isBlocked });
        return res.data;
    } catch (err) {
        console.error("Error toggling busy slot:", err);
        throw err;
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
        if (bookingId.startsWith("bk_")) {
            console.log("Confirming mock booking:", bookingId);
            const localBookings = JSON.parse(sessionStorage.getItem('local_bookings') || '[]');
            const booking = localBookings.find(b => b.id === bookingId);
            if (booking) {
                booking.status = "confirmed";
                booking.paymentId = paymentId;
                booking.confirmedAt = new Date().toISOString();
                sessionStorage.setItem('local_bookings', JSON.stringify(localBookings));
                console.log("Mock booking confirmed in sessionStorage:", booking);
            }
            return true;
        }

        const bookingRef = doc(db, PEER_BOOKINGS_COLLECTION, bookingId);
        const bookingSnap = await getDoc(bookingRef);

        await updateDoc(bookingRef, {
            status: "confirmed",
            paymentId: paymentId,
            paymentData: paymentData,
            confirmedAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });

        // CREATE IN-APP NOTIFICATION FOR PROVIDER
        const bData = bookingSnap.data();
        if (bData.peerId) {
            try {
                await addDoc(collection(db, 'notifications'), {
                    userId: bData.peerId,
                    type: 'booking_confirmed',
                    title: 'New Session Booked',
                    message: `A new session has been confirmed for ${bData.startTime?.toDate?.()?.toLocaleString() || 'your next slot'}.`,
                    bookingId: bookingId,
                    status: 'unread',
                    createdAt: serverTimestamp()
                });
                console.log("In-app notification created for peer:", bData.peerId);
            } catch (notifErr) {
                console.warn("Failed to create in-app notification:", notifErr);
            }
        }

        // Also create payment record with explicit ownership for security rules
        await addDoc(collection(db, PAYMENTS_COLLECTION), {
            bookingId: bookingId,
            paymentId: paymentId,
            userId: bData.userId || null,
            peerId: bData.peerId || null,
            amount: paymentData.amount,
            currency: paymentData.currency || "INR",
            gateway: paymentData.gateway || "razorpay",
            status: "success",
            metadata: paymentData,
            createdAt: serverTimestamp()
        });

        console.log("Booking confirmed:", bookingId);

        // TRIGGER EMAIL RECEIPT
        try {
            if (bookingSnap.exists() && window.SoulBackend && window.SoulBackend.triggerEmail) {
                const bData = bookingSnap.data();
                if (bData.userId) {
                    // Fetch user email
                    const userDoc = await getDoc(doc(db, "users", bData.userId));
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        const userEmail = userData.email;
                        const userName = userData.displayName || "Friend";

                        // Get peer name
                        let peerName = "Your Peer Companion";
                        if (bData.peerId) {
                            const peerDoc = await getDoc(doc(db, "users", bData.peerId));
                            if (peerDoc.exists() && peerDoc.data().displayName) {
                                peerName = peerDoc.data().displayName;
                            }
                        }

                        // Provide dummy calendar/meet links for now
                        const meetingLink = "https://meet.soulamore.com/" + bookingId;
                        const calendarLink = "https://calendar.google.com/calendar/r/eventedit?text=Soulamore+Session";

                        await window.SoulBackend.triggerEmail(
                            userEmail,
                            "Your Soulamore Session is Confirmed",
                            "booking_confirmed",
                            {
                                name: userName,
                                email: userEmail,
                                peerName: peerName,
                                date: bData.startTime ? bData.startTime.toDate().toLocaleString() : "TBD",
                                meetingLink: meetingLink,
                                calendarLink: calendarLink,
                                bookingId: bData.slId || bookingId
                            }
                        );
                        console.log("Booking success email triggered for:", userEmail);
                    }
                }
            }
        } catch (emailErr) {
            console.error("Failed to trigger booking confirmation email:", emailErr);
        }

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



