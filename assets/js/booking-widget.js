/**
 * Booking Widget
 * Shared UI for booking peer / psychologist sessions from public profile pages.
 *
 * Expected HTML:
 *   <div id="booking-widget-root"></div>
 *
 * The widget:
 *   - Requires Firebase auth (redirects to login if not signed in)
   *   - Loads provider availability via getAvailableSlots(peerId, date)
 *   - Creates a booking document via createBookingRequest
 *   - Opens Razorpay checkout using openRazorpayCheckout
 */

import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getAvailableSlots,
    createBookingRequest,
    PEER_PLAN_TYPES,
    DEFAULT_PLANS
} from "./peer-booking-handler.js";
import { openRazorpayCheckout } from "./payment-handler.js";

/**
 * Initialize a booking widget inside a given root element.
 *
 * @param {{ peerId: string, rootId: string, providerName?: string }} config
 */
export function initBookingWidget(config) {
    const { peerId, rootId, providerName } = config || {};
    if (!peerId || !rootId) {
        console.warn("BookingWidget: peerId and rootId are required.");
        return;
    }

    const root = document.getElementById(rootId);
    if (!root) {
        console.warn("BookingWidget: root element not found:", rootId);
        return;
    }

    let currentUser = null;
    let selectedDate = null;
    let selectedSlot = null;
    let currentSlots = [];

    // Render base UI
    root.innerHTML = `
        <div style="margin-top:40px;" id="book">
            <div style="
                background: rgba(15, 23, 42, 0.03);
                border-radius: 20px;
                padding: 24px;
                border: 1px solid rgba(148, 163, 184, 0.35);
            ">
                <h2 style="font-family:'Outfit'; font-size:1.4rem; margin-bottom:10px;">
                    Book a Session
                </h2>
                <p style="font-size:0.9rem; opacity:0.75; margin-bottom:20px;">
                    Choose a date and time that works for you. You’ll see this session in your dashboard after payment.
                </p>

                <div id="${rootId}-auth-warning" style="margin-bottom:16px; display:none;">
                    <div style="
                        padding:12px 16px;
                        border-radius:12px;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(78, 205, 196, 0.2);
                        color: #f8fafc;
                        font-size:0.88rem;
                        line-height: 1.5;
                    ">
                        <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px; font-weight:600; color:var(--teal-glow);">
                            <i class="fas fa-lock"></i> Account Recommended
                        </div>
                        <p style="margin:0 0 10px 0; opacity:0.8;">
                            Logging in lets you track sessions and view receipts in your dashboard.
                        </p>
                        <div style="display:flex; gap:12px; align-items:center;">
                            <a href="../portal/login.html" style="
                                color:#0f172a;
                                background:var(--teal-glow);
                                padding:5px 12px;
                                border-radius:6px;
                                text-decoration:none;
                                font-weight:600;
                                font-size:0.75rem;
                            ">Log in / Sign up</a>
                            <span style="opacity:0.5; font-size:0.75rem;">or book as guest below</span>
                        </div>
                    </div>
                </div>

                <div id="${rootId}-guest-fields" style="margin-bottom:16px; display:none;">
                    <div style="display:flex; flex-wrap:wrap; gap:16px;">
                        <div style="flex:1 1 200px;">
                            <label style="display:block; font-size:0.8rem; opacity:0.7; margin-bottom:6px;">
                                Your Name (Guest)
                            </label>
                            <input type="text"
                                   id="${rootId}-guest-name"
                                   placeholder="e.g. Jane Doe"
                                   style="
                                       width:100%;
                                       padding:10px 12px;
                                       border-radius:10px;
                                       border:1px solid rgba(148, 163, 184, 0.7);
                                       font-size:0.9rem;
                                   ">
                        </div>
                        <div style="flex:1 1 200px;">
                            <label style="display:block; font-size:0.8rem; opacity:0.7; margin-bottom:6px;">
                                Email Address
                            </label>
                            <input type="email"
                                   id="${rootId}-guest-email"
                                   placeholder="e.g. jane@example.com"
                                   style="
                                       width:100%;
                                       padding:10px 12px;
                                       border-radius:10px;
                                       border:1px solid rgba(148, 163, 184, 0.7);
                                       font-size:0.9rem;
                                   ">
                        </div>
                    </div>
                </div>

                <div style="display:flex; flex-wrap:wrap; gap:16px; margin-bottom:16px;">
                    <div style="flex:1 1 200px;">
                        <label style="display:block; font-size:0.8rem; opacity:0.7; margin-bottom:6px;">
                            Date
                        </label>
                        <input type="date"
                               id="${rootId}-date"
                               style="
                                   width:100%;
                                   padding:10px 12px;
                                   border-radius:10px;
                                   border:1px solid rgba(148, 163, 184, 0.7);
                                   font-size:0.9rem;
                               ">
                    </div>
                    <div style="flex:1 1 200px;">
                        <label style="display:block; font-size:0.8rem; opacity:0.7; margin-bottom:6px;">
                            Plan
                        </label>
                        <select id="${rootId}-plan"
                                style="
                                   width:100%;
                                   padding:10px 12px;
                                   border-radius:10px;
                                   border:1px solid rgba(148, 163, 184, 0.7);
                                   font-size:0.9rem;
                                ">
                            <option value="${PEER_PLAN_TYPES.PER_SESSION}">
                                ${DEFAULT_PLANS[PEER_PLAN_TYPES.PER_SESSION].name} – ₹${DEFAULT_PLANS[PEER_PLAN_TYPES.PER_SESSION].price}
                            </option>
                            <option value="${PEER_PLAN_TYPES.MONTHLY}">
                                ${DEFAULT_PLANS[PEER_PLAN_TYPES.MONTHLY].name} – ₹${DEFAULT_PLANS[PEER_PLAN_TYPES.MONTHLY].price}
                            </option>
                            <option value="${PEER_PLAN_TYPES.QUARTERLY}">
                                ${DEFAULT_PLANS[PEER_PLAN_TYPES.QUARTERLY].name} – ₹${DEFAULT_PLANS[PEER_PLAN_TYPES.QUARTERLY].price}
                            </option>
                            <option value="${PEER_PLAN_TYPES.YEARLY}">
                                ${DEFAULT_PLANS[PEER_PLAN_TYPES.YEARLY].name} – ₹${DEFAULT_PLANS[PEER_PLAN_TYPES.YEARLY].price}
                            </option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style="display:block; font-size:0.8rem; opacity:0.7; margin-bottom:6px;">
                        Available time slots
                    </label>
                    <div id="${rootId}-slots"
                         style="
                            min-height:44px;
                            padding:10px 0;
                            display:flex;
                            flex-wrap:wrap;
                            gap:8px;
                         ">
                        <span style="font-size:0.85rem; opacity:0.6;">
                            Pick a date to see available times.
                        </span>
                    </div>
                </div>

                <div id="${rootId}-message" style="margin-top:10px; font-size:0.85rem; min-height:18px; opacity:0.8;"></div>

                <button id="${rootId}-submit"
                        style="
                            margin-top:18px;
                            width:100%;
                            padding:12px 18px;
                            border-radius:999px;
                            border:none;
                            cursor:pointer;
                            font-weight:600;
                            font-size:0.95rem;
                            background:#4ECDC4;
                            color:#0f172a;
                        ">
                    Confirm & Pay
                </button>
            </div>
        </div>
    `;

    const dateInput = document.getElementById(`${rootId}-date`);
    const planSelect = document.getElementById(`${rootId}-plan`);
    const slotsContainer = document.getElementById(`${rootId}-slots`);
    const submitBtn = document.getElementById(`${rootId}-submit`);
    const msgEl = document.getElementById(`${rootId}-message`);
    const authWarning = document.getElementById(`${rootId}-auth-warning`);

    function setMessage(text, isError = false) {
        if (!msgEl) return;
        msgEl.style.color = isError ? "#ef4444" : "#16a34a";
        msgEl.textContent = text || "";
    }

    function renderSlots() {
        if (!slotsContainer) return;
        slotsContainer.innerHTML = "";

        if (!selectedDate) {
            slotsContainer.innerHTML = `<span style="font-size:0.85rem; opacity:0.6;">Pick a date to see available times.</span>`;
            return;
        }

        if (!currentSlots || currentSlots.length === 0) {
            slotsContainer.innerHTML = `<span style="font-size:0.85rem; opacity:0.6;">No available slots for this day. Try another date.</span>`;
            return;
        }

        currentSlots.forEach((slot, index) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = slot.display;
            btn.style.padding = "8px 14px";
            btn.style.borderRadius = "999px";
            btn.style.border = "1px solid rgba(148, 163, 184, 0.9)";
            btn.style.background = selectedSlot === slot ? "#4ECDC4" : "white";
            btn.style.color = selectedSlot === slot ? "#0f172a" : "#0f172a";
            btn.style.cursor = "pointer";
            btn.style.fontSize = "0.85rem";

            btn.addEventListener("click", () => {
                selectedSlot = slot;
                // Re-render to update visual selection
                renderSlots();
                setMessage("");
            });

            slotsContainer.appendChild(btn);
        });
    }

    async function loadSlotsForDate(dateStr) {
        if (!dateStr) {
            selectedDate = null;
            currentSlots = [];
            selectedSlot = null;
            renderSlots();
            return;
        }

        try {
            const dateObj = new Date(dateStr + "T00:00:00");
            selectedDate = dateObj;
            selectedSlot = null;
            setMessage("Loading available slots...", false);
            currentSlots = await getAvailableSlots(peerId, dateObj);
            setMessage("");
            renderSlots();
        } catch (e) {
            console.error("BookingWidget: failed to load slots", e);
            setMessage("Could not load availability. Please try another date.", true);
            currentSlots = [];
            selectedSlot = null;
            renderSlots();
        }
    }

    if (dateInput) {
        dateInput.addEventListener("change", (e) => {
            loadSlotsForDate(e.target.value);
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
            let activeUser = currentUser;
            let guestName = "";
            let guestEmail = "";

            if (!activeUser) {
                const nameInput = document.getElementById(`${rootId}-guest-name`);
                const emailInput = document.getElementById(`${rootId}-guest-email`);
                guestName = nameInput ? nameInput.value.trim() : "";
                guestEmail = emailInput ? emailInput.value.trim() : "";

                if (!guestName || !guestEmail) {
                    setMessage("Please fill in your name and email to book as guest, or log in first.", true);
                    return;
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
                    setMessage("Please enter a valid email address.", true);
                    return;
                }

                try {
                    submitBtn.disabled = true;
                    submitBtn.textContent = "Setting up guest account...";
                    setMessage("");

                    const { signInAnonymously } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
                    const userCredential = await signInAnonymously(auth);
                    activeUser = userCredential.user;

                    sessionStorage.setItem('guest_booking_name', guestName);
                    sessionStorage.setItem('guest_booking_email', guestEmail);
                    console.log("Logged in anonymously as guest:", activeUser.uid);
                } catch (anonErr) {
                    console.warn("Guest login via Firebase failed, falling back to local guest session:", anonErr);
                    activeUser = {
                        uid: "guest_" + Math.random().toString(36).substr(2, 9),
                        isAnonymous: true,
                        displayName: guestName,
                        email: guestEmail
                    };
                    sessionStorage.setItem('guest_booking_name', guestName);
                    sessionStorage.setItem('guest_booking_email', guestEmail);
                }
            }

            if (!selectedDate || !selectedSlot) {
                setMessage("Please choose a date and time slot.", true);
                if (!currentUser) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Confirm & Pay";
                }
                return;
            }

            const planKey = planSelect ? planSelect.value : PEER_PLAN_TYPES.PER_SESSION;
            const plan = DEFAULT_PLANS[planKey] || DEFAULT_PLANS[PEER_PLAN_TYPES.PER_SESSION];

            try {
                submitBtn.disabled = true;
                submitBtn.textContent = "Opening payment...";
                setMessage("");

                const startTime = selectedSlot.start;
                const endTime = selectedSlot.end;

                const finalName = guestName || activeUser.displayName || "Friend";
                const finalEmail = guestEmail || activeUser.email || "";

                const booking = await createBookingRequest(
                    activeUser.uid,
                    peerId,
                    planKey,
                    startTime,
                    endTime,
                    finalName,
                    finalEmail
                );


                await openRazorpayCheckout(
                    booking.bookingId,
                    booking.amount,
                    activeUser.uid,
                    finalName,
                    finalEmail,
                    activeUser.phoneNumber || "",
                    { planName: plan.name }
                );

                setMessage("Payment successful. Your session is confirmed!");
                submitBtn.textContent = "Booked";

                setTimeout(() => {
                    if (activeUser.isAnonymous) {
                        window.location.href = "../index.html?booking_success=true";
                    } else {
                        window.location.href = "../portal/user-dashboard.html?view=bookings";
                    }
                }, 2500);
            } catch (err) {
                console.error("BookingWidget: booking/payment failed", err);
                setMessage(err.message || "Payment failed or was cancelled. Please try again.", true);
                submitBtn.disabled = false;
                submitBtn.textContent = "Confirm & Pay";
            }
        });
    }

    // Watch auth state
    onAuthStateChanged(auth, (user) => {
        currentUser = user;
        if (authWarning) {
            authWarning.style.display = user ? "none" : "block";
        }
        const guestFields = document.getElementById(`${rootId}-guest-fields`);
        if (guestFields) {
            guestFields.style.display = user ? "none" : "block";
        }
    });
}

