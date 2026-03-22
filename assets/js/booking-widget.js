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
                        padding:10px 12px;
                        border-radius:10px;
                        background:rgba(248, 250, 252, 0.9);
                        border:1px solid rgba(148, 163, 184, 0.5);
                        font-size:0.85rem;
                    ">
                        <i class="fas fa-lock"></i>
                        <span style="margin-left:6px;">
                            Please log in to book a session.
                            <a href="../portal/login.html" style="text-decoration:underline;">Log in / Sign up</a>
                        </span>
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
            if (!currentUser) {
                window.location.href = "../portal/login.html";
                return;
            }
            if (!selectedDate || !selectedSlot) {
                setMessage("Please choose a date and time slot.", true);
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

                const booking = await createBookingRequest(
                    currentUser.uid,
                    peerId,
                    planKey,
                    startTime,
                    endTime
                );

                await openRazorpayCheckout(
                    booking.bookingId,
                    booking.amount,
                    currentUser.uid,
                    currentUser.displayName || providerName || "Friend",
                    currentUser.email || "",
                    currentUser.phoneNumber || "",
                    { planName: plan.name }
                );

                setMessage("Payment successful. Your session will appear in 'My Sessions' shortly.");
                submitBtn.textContent = "Booked";

                setTimeout(() => {
                    window.location.href = "../portal/user-dashboard.html?view=bookings";
                }, 2000);
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
    });
}

