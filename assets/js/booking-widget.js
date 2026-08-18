/**
 * Booking Widget V3 (Premium Eager Slot System & Modern Typography)
 * Shared UI for booking peer / psychologist sessions from public profile pages.
 *
 * Expected HTML:
 *   <div id="booking-widget-root"></div>
 */

import { auth } from "./firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
    getAvailableSlots,
    createBookingRequest,
    getUserSessionCredits,
    useSessionCreditForBooking,
    PEER_PLAN_TYPES,
    DEFAULT_PLANS
} from "./peer-booking-handler.js?v=20260818-v12";
import { openRazorpayCheckout } from "./payment-handler.js?v=20260818-v12";

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
    let selectedDate = new Date(); // Default to today
    let selectedSlot = null;
    let currentSlots = [];
    let slotsCacheByDate = {}; // Multi-day 0ms slot cache
    let datePills = [];

    // Helper: Generate next 7 days for quick selector carousel
    function generateNext7Days() {
        const days = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const d = new Date(today);
            d.setDate(today.getDate() + i);

            let labelDay = "";
            if (i === 0) labelDay = "TODAY";
            else if (i === 1) labelDay = "TOMORROW";
            else labelDay = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();

            const labelDate = d.toLocaleDateString("en-US", { day: "numeric", month: "short" });
            const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD

            days.push({
                dateObj: d,
                dateStr: dateStr,
                labelDay: labelDay,
                labelDate: labelDate,
                isToday: i === 0
            });
        }
        return days;
    }

    datePills = generateNext7Days();

    // Render base UI with Scoped Font Overrides & Glassmorphism
    root.innerHTML = `
        <style>
            #${rootId}, #${rootId} * {
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                box-sizing: border-box;
            }
            #${rootId} .bw-title {
                font-family: 'Outfit', 'Plus Jakarta Sans', sans-serif !important;
                font-weight: 600 !important;
            }
            #${rootId} input, #${rootId} select, #${rootId} button {
                font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif !important;
            }
            .bw-container {
                background: rgba(255, 255, 255, 0.95);
                border-radius: 24px;
                padding: 28px;
                border: 1px solid rgba(148, 163, 184, 0.25);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
                transition: all 0.3s ease;
            }
            .bw-date-bar {
                display: flex;
                gap: 8px;
                overflow-x: auto;
                padding: 4px 2px 12px 2px;
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none; /* IE */
            }
            .bw-date-bar::-webkit-scrollbar {
                display: none;
            }
            .bw-date-pill {
                flex: 0 0 74px;
                padding: 10px 6px;
                border-radius: 16px;
                border: 1px solid rgba(148, 163, 184, 0.35);
                background: #ffffff;
                text-align: center;
                cursor: pointer;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                user-select: none;
            }
            .bw-date-pill:hover {
                border-color: #4ECDC4;
                transform: translateY(-2px);
                background: rgba(78, 205, 196, 0.08);
            }
            .bw-date-pill.active {
                background: #4ECDC4 !important;
                color: #0f172a !important;
                border-color: #4ECDC4 !important;
                box-shadow: 0 6px 16px rgba(78, 205, 196, 0.35);
                transform: scale(1.03);
            }
            .bw-time-pill {
                padding: 10px 18px;
                border-radius: 50px;
                border: 1px solid rgba(148, 163, 184, 0.4);
                background: #ffffff;
                color: #0f172a;
                font-size: 0.88rem;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;
                display: inline-flex;
                align-items: center;
                gap: 6px;
            }
            .bw-time-pill:hover {
                border-color: #4ECDC4;
                background: rgba(78, 205, 196, 0.1);
                transform: translateY(-1px);
            }
            .bw-time-pill.selected {
                background: #4ECDC4 !important;
                color: #0f172a !important;
                border-color: #4ECDC4 !important;
                font-weight: 700;
                box-shadow: 0 4px 14px rgba(78, 205, 196, 0.4);
            }
            .bw-time-pill.unavailable {
                opacity: 0.4;
                cursor: not-allowed;
                text-decoration: line-through;
                background: rgba(241, 245, 249, 0.7);
                border-color: rgba(203, 213, 225, 0.6);
            }
            .bw-category-title {
                font-size: 0.82rem;
                text-transform: uppercase;
                letter-spacing: 0.8px;
                color: #64748b;
                font-weight: 600;
                margin: 14px 0 8px 0;
                display: flex;
                align-items: center;
                gap: 6px;
            }
        </style>

        <div class="bw-container" id="book">
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; margin-bottom:6px; gap:8px;">
                <h2 class="bw-title" style="font-size:1.4rem; color:#0f172a; margin:0;">
                    Book a Session
                </h2>
                <div id="${rootId}-tz-badge" style="font-size:0.75rem; font-weight:600; color:#0d9488; background:rgba(78, 205, 196, 0.12); padding:4px 10px; border-radius:50px;">
                    <i class="fas fa-globe"></i> ${Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'}
                </div>
            </div>
            <p style="font-size:0.9rem; color:#64748b; margin-bottom:16px; line-height:1.5;">
                Choose a date and time that works for you. Your session will sync to your dashboard.
            </p>

            <div id="${rootId}-credit-banner" style="display:none; margin-bottom:16px;">
                <div style="padding:12px 16px; border-radius:14px; background:rgba(78, 205, 196, 0.15); border:1px solid #4ECDC4; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
                    <div>
                        <div style="font-size:0.85rem; font-weight:700; color:#0d9488;">🎁 You have <span id="${rootId}-credit-count">0</span> Session Credit(s) available</div>
                        <div style="font-size:0.78rem; color:#475569;">Book this session for ₹0 using 1 session credit.</div>
                    </div>
                    <button type="button" id="${rootId}-credit-pay-btn" style="padding:8px 14px; border-radius:999px; border:none; background:#4ECDC4; color:#0f172a; font-weight:700; font-size:0.8rem; cursor:pointer;">Use Credit</button>
                </div>
            </div>

            <div id="${rootId}-auth-warning" style="margin-bottom:18px; display:none;">
                <div style="
                    padding:14px 18px;
                    border-radius:14px;
                    background: #f8fafc;
                    border: 1px solid rgba(78, 205, 196, 0.35);
                    color: #1e293b;
                    font-size:0.88rem;
                    line-height: 1.5;
                ">
                    <div style="display:flex; align-items:center; gap:8px; margin-bottom:6px; font-weight:700; color:#0d9488;">
                        <i class="fas fa-user-circle"></i> Guest Booking Available
                    </div>
                    <p style="margin:0 0 10px 0; color:#475569; font-size:0.85rem;">
                        Log in to track sessions & receipts, or enter your guest details below.
                    </p>
                    <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
                        <a href="../portal/login.html" style="
                            color:#0f172a;
                            background:#4ECDC4;
                            padding:6px 14px;
                            border-radius:8px;
                            text-decoration:none;
                            font-weight:700;
                            font-size:0.78rem;
                            box-shadow: 0 2px 8px rgba(78, 205, 196, 0.25);
                        ">Log in / Sign up</a>
                        <span style="color:#64748b; font-size:0.78rem;">or continue below as guest</span>
                    </div>
                </div>
            </div>

            <div id="${rootId}-guest-fields" style="margin-bottom:18px; display:block;">
                <div style="display:flex; flex-wrap:wrap; gap:14px;">
                    <div style="flex:1 1 200px;">
                        <label style="display:block; font-size:0.8rem; font-weight:600; color:#475569; margin-bottom:6px;">
                            Your Full Name <span style="color:#e11d48;">*</span>
                        </label>
                        <input type="text"
                               id="${rootId}-guest-name"
                               placeholder="e.g. Jane Doe"
                               style="
                                   width:100%;
                                   padding:11px 14px;
                                   border-radius:12px;
                                   border:1px solid rgba(148, 163, 184, 0.5);
                                   font-size:0.9rem;
                                   color:#0f172a;
                                   background:#ffffff;
                               ">
                    </div>
                    <div style="flex:1 1 200px;">
                        <label style="display:block; font-size:0.8rem; font-weight:600; color:#475569; margin-bottom:6px;">
                            Email Address <span style="color:#e11d48;">*</span>
                        </label>
                        <input type="email"
                               id="${rootId}-guest-email"
                               placeholder="e.g. jane@example.com"
                               style="
                                   width:100%;
                                   padding:11px 14px;
                                   border-radius:12px;
                                   border:1px solid rgba(148, 163, 184, 0.5);
                                   font-size:0.9rem;
                                   color:#0f172a;
                                   background:#ffffff;
                               ">
                    </div>
                </div>
            </div>

            <!-- STEP 1: DATE SELECTION (HORIZONTAL CAROUSEL) -->
            <div style="margin-bottom:18px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <label style="font-size:0.83rem; font-weight:700; color:#334155; text-transform:uppercase; letter-spacing:0.5px;">
                        <i class="far fa-calendar-alt" style="color:#0d9488; margin-right:4px;"></i> Select Date
                    </label>
                    <div style="display:flex; align-items:center; gap:6px;">
                        <span style="font-size:0.75rem; color:#64748b;">More dates:</span>
                        <input type="date"
                               id="${rootId}-custom-date"
                               style="
                                   padding:4px 8px;
                                   border-radius:8px;
                                   border:1px solid rgba(148, 163, 184, 0.4);
                                   font-size:0.8rem;
                                   color:#0f172a;
                                   background:#f8fafc;
                                   cursor:pointer;
                               ">
                    </div>
                </div>

                <div class="bw-date-bar" id="${rootId}-date-bar">
                    <!-- Dynamic Date Pills injected here -->
                </div>
            </div>

            <!-- STEP 2: PLAN SELECTOR -->
            <div style="margin-bottom:18px;">
                <label style="display:block; font-size:0.83rem; font-weight:700; color:#334155; margin-bottom:6px; text-transform:uppercase; letter-spacing:0.5px;">
                    <i class="fas fa-tag" style="color:#0d9488; margin-right:4px;"></i> Select Plan
                </label>
                <select id="${rootId}-plan"
                        style="
                           width:100%;
                           padding:11px 14px;
                           border-radius:12px;
                           border:1px solid rgba(148, 163, 184, 0.5);
                           font-size:0.9rem;
                           color:#0f172a;
                           background:#ffffff;
                           cursor:pointer;
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

            <!-- STEP 3: AVAILABLE TIME SLOTS (CATEGORIZED) -->
            <div>
                <label style="display:block; font-size:0.83rem; font-weight:700; color:#334155; margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">
                    <i class="far fa-clock" style="color:#0d9488; margin-right:4px;"></i> Available Time Slots
                </label>
                <div id="${rootId}-slots"
                     style="
                        min-height:70px;
                        padding:12px 14px;
                        background:#f8fafc;
                        border-radius:16px;
                        border:1px solid rgba(148, 163, 184, 0.25);
                     ">
                    <div style="font-size:0.85rem; color:#64748b; padding:10px 0;">
                        <i class="fas fa-spinner fa-spin"></i> Checking availability...
                    </div>
                </div>
            </div>

            <div id="${rootId}-message" style="margin-top:12px; font-size:0.85rem; font-weight:600; min-height:20px;"></div>

            <button id="${rootId}-submit"
                    style="
                        margin-top:20px;
                        width:100%;
                        padding:14px 20px;
                        border-radius:999px;
                        border:none;
                        cursor:pointer;
                        font-weight:700;
                        font-size:1rem;
                        background:#4ECDC4;
                        color:#0f172a;
                        box-shadow: 0 4px 18px rgba(78, 205, 196, 0.4);
                        transition: all 0.2s ease;
                    ">
                Confirm Booking Request
            </button>
        </div>
    `;

    const dateBar = document.getElementById(`${rootId}-date-bar`);
    const customDateInput = document.getElementById(`${rootId}-custom-date`);
    const planSelect = document.getElementById(`${rootId}-plan`);
    const slotsContainer = document.getElementById(`${rootId}-slots`);
    const submitBtn = document.getElementById(`${rootId}-submit`);
    const msgEl = document.getElementById(`${rootId}-message`);
    const authWarning = document.getElementById(`${rootId}-auth-warning`);

    function setMessage(text, isError = false) {
        if (!msgEl) return;
        msgEl.style.color = isError ? "#ef4444" : "#0d9488";
        msgEl.textContent = text || "";
    }

    // Render Date Bar Pills
    function renderDateBar() {
        if (!dateBar) return;
        dateBar.innerHTML = "";

        datePills.forEach(pill => {
            const isSelected = selectedDate && selectedDate.toDateString() === pill.dateObj.toDateString();
            const btn = document.createElement("div");
            btn.className = `bw-date-pill ${isSelected ? "active" : ""}`;
            btn.innerHTML = `
                <div style="font-size:0.7rem; font-weight:700; opacity:0.75; letter-spacing:0.5px;">${pill.labelDay}</div>
                <div style="font-size:0.88rem; font-weight:700; margin-top:2px;">${pill.labelDate}</div>
            `;
            btn.addEventListener("click", () => {
                selectDate(pill.dateObj);
            });
            dateBar.appendChild(btn);
        });
    }

    // Categorized Time Slots Renderer (Morning 🌅, Afternoon ☀️, Evening 🌙)
    function renderSlots() {
        if (!slotsContainer) return;
        slotsContainer.innerHTML = "";

        if (!currentSlots || currentSlots.length === 0) {
            slotsContainer.innerHTML = `
                <div style="padding:16px 8px; text-align:center;">
                    <p style="font-size:0.88rem; color:#64748b; margin-bottom:10px;">
                        No open slots available on this date.
                    </p>
                    <button type="button" id="${rootId}-jump-next" style="
                        padding:6px 14px;
                        border-radius:20px;
                        border:1px solid #4ECDC4;
                        background:rgba(78, 205, 196, 0.15);
                        color:#0d9488;
                        font-weight:600;
                        font-size:0.8rem;
                        cursor:pointer;
                    ">Jump to Tomorrow</button>
                </div>
            `;
            const jumpBtn = document.getElementById(`${rootId}-jump-next`);
            if (jumpBtn) {
                jumpBtn.addEventListener("click", () => {
                    const tom = new Date();
                    tom.setDate(tom.getDate() + 1);
                    selectDate(tom);
                });
            }
            return;
        }

        const morningSlots = [];
        const afternoonSlots = [];
        const eveningSlots = [];

        currentSlots.forEach(slot => {
            const hour = slot.start.getHours();
            if (hour < 12) morningSlots.push(slot);
            else if (hour < 16) afternoonSlots.push(slot);
            else eveningSlots.push(slot);
        });

        function renderSlotGroup(title, icon, groupSlots) {
            if (groupSlots.length === 0) return "";
            const openCount = groupSlots.filter(s => s.available !== false).length;
            return `
                <div class="bw-category-title">
                    <span>${icon}</span> ${title} 
                    <span style="font-size:0.72rem; font-weight:600; color:#475569; background:rgba(148, 163, 184, 0.2); padding:2px 8px; border-radius:12px; margin-left:4px;">
                        ${openCount} available
                    </span>
                </div>
                <div style="display:flex; flex-wrap:wrap; gap:8px; margin-bottom:12px;">
                    ${groupSlots.map((slot) => {
                        const isSelected = selectedSlot && selectedSlot.start.getTime() === slot.start.getTime();
                        const isAvail = slot.available !== false;
                        const slotClass = !isAvail ? "bw-time-pill unavailable" : (isSelected ? "bw-time-pill selected" : "bw-time-pill");
                        const iconCheck = isSelected ? '<i class="fas fa-check-circle"></i> ' : '';
                        return `<button type="button" class="${slotClass}" data-start="${slot.start.getTime()}" ${!isAvail ? 'disabled' : ''}>${iconCheck}${slot.display}</button>`;
                    }).join("")}
                </div>
            `;
        }

        let html = "";
        const totalOpen = currentSlots.filter(s => s.available !== false).length;
        html += `<div style="font-size:0.8rem; font-weight:700; color:#0d9488; margin-bottom:6px;">Showing all ${currentSlots.length} generated slots (${totalOpen} open for booking)</div>`;
        html += renderSlotGroup("Morning", "🌅", morningSlots);
        html += renderSlotGroup("Afternoon", "☀️", afternoonSlots);
        html += renderSlotGroup("Evening", "🌙", eveningSlots);

        slotsContainer.innerHTML = html;

        // Attach click listeners to time pills
        const pills = slotsContainer.querySelectorAll(".bw-time-pill:not(.unavailable)");
        pills.forEach(pillBtn => {
            pillBtn.addEventListener("click", (e) => {
                const startMs = Number(e.currentTarget.getAttribute("data-start"));
                selectedSlot = currentSlots.find(s => s.start.getTime() === startMs) || null;
                renderSlots();
                setMessage("");
            });
        });
    }

    async function loadSlotsForDate(dateObj) {
        selectedDate = dateObj;
        selectedSlot = null;
        renderDateBar();

        const dateKey = dateObj.toISOString().split("T")[0];

        // 0ms Cache Lookup
        if (slotsCacheByDate[dateKey]) {
            currentSlots = slotsCacheByDate[dateKey];
            renderSlots();
            return;
        }

        try {
            slotsContainer.innerHTML = `<div style="font-size:0.85rem; color:#64748b; padding:12px 0;"><i class="fas fa-spinner fa-spin"></i> Checking open slots...</div>`;
            currentSlots = await getAvailableSlots(peerId, dateObj);
            slotsCacheByDate[dateKey] = currentSlots;
            renderSlots();
        } catch (e) {
            console.error("BookingWidget: failed to load slots", e);
            currentSlots = [];
            renderSlots();
        }
    }

    function selectDate(dateObj) {
        if (customDateInput) {
            customDateInput.value = dateObj.toISOString().split("T")[0];
        }
        loadSlotsForDate(dateObj);
    }

    // Eagerly pre-load slots for all 7 days in background
    async function prefetch7DaysSlots() {
        for (const pill of datePills) {
            const key = pill.dateStr;
            if (!slotsCacheByDate[key]) {
                try {
                    const fetched = await getAvailableSlots(peerId, pill.dateObj);
                    slotsCacheByDate[key] = fetched;
                } catch (e) {
                    console.warn(`Background slot prefetch warning for ${key}:`, e);
                }
            }
        }
    }

    // Custom date picker change
    if (customDateInput) {
        customDateInput.value = selectedDate.toISOString().split("T")[0];
        customDateInput.addEventListener("change", (e) => {
            if (e.target.value) {
                const parts = e.target.value.split("-").map(Number);
                const d = new Date(parts[0], parts[1] - 1, parts[2]);
                selectDate(d);
            }
        });
    }

    // Submit Booking Action
    if (submitBtn) {
        submitBtn.addEventListener("click", async () => {
            let activeUser = currentUser;
            const nameInput = document.getElementById(`${rootId}-guest-name`);
            const emailInput = document.getElementById(`${rootId}-guest-email`);
            
            const guestName = nameInput ? nameInput.value.trim() : (activeUser ? activeUser.displayName : "");
            const guestEmail = emailInput ? emailInput.value.trim() : (activeUser ? activeUser.email : "");

            if (!guestName) {
                setMessage("Please enter your name to confirm your booking.", true);
                if (nameInput) nameInput.focus();
                return;
            }

            if (!guestEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
                setMessage("Please enter a valid email address.", true);
                if (emailInput) emailInput.focus();
                return;
            }

            if (!activeUser) {
                try {
                    submitBtn.disabled = true;
                    submitBtn.textContent = "Setting up guest account...";
                    setMessage("");

                    const { signInAnonymously } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js");
                    const userCredential = await signInAnonymously(auth);
                    activeUser = userCredential.user;

                    sessionStorage.setItem('guest_booking_name', guestName);
                    sessionStorage.setItem('guest_booking_email', guestEmail);
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
                setMessage("Please select a time slot to continue.", true);
                submitBtn.disabled = false;
                submitBtn.textContent = "Confirm & Pay";
                return;
            }

            const planKey = planSelect ? planSelect.value : PEER_PLAN_TYPES.PER_SESSION;
            const plan = DEFAULT_PLANS[planKey] || DEFAULT_PLANS[PEER_PLAN_TYPES.PER_SESSION];
            try {
                submitBtn.disabled = true;
                submitBtn.textContent = "Confirming booking...";
                setMessage("");

                const startTime = selectedSlot.start;
                const endTime = selectedSlot.end;

                const finalName = guestName || (activeUser ? activeUser.displayName : "") || "Friend";
                const finalEmail = guestEmail || (activeUser ? activeUser.email : "") || "";

                const booking = await createBookingRequest(
                    activeUser.uid,
                    peerId,
                    planKey,
                    startTime,
                    endTime,
                    finalName,
                    finalEmail,
                    "user",
                    null,
                    providerName
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

                setMessage("Payment successful! Your session is confirmed.");
                submitBtn.textContent = "Booked";

                setTimeout(() => {
                    if (activeUser.isAnonymous) {
                        window.location.href = "../index.html?booking_success=true";
                    } else {
                        window.location.href = "../portal/user-dashboard-v2.html?view=bookings";
                    }
                }, 2000);
            } catch (err) {
                console.error("BookingWidget: booking/payment failed", err);
                setMessage(err.message || "Payment failed or was cancelled. Please try again.", true);
                submitBtn.disabled = false;
                submitBtn.textContent = "Confirm Booking Request";
            }
        });
    }

    // Watch auth state
    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        if (authWarning) {
            authWarning.style.display = user ? "none" : "block";
        }
        const nameInput = document.getElementById(`${rootId}-guest-name`);
        const emailInput = document.getElementById(`${rootId}-guest-email`);
        if (user) {
            if (nameInput && !nameInput.value) {
                nameInput.value = user.displayName || user.email.split('@')[0] || "";
            }
            if (emailInput && !emailInput.value) {
                emailInput.value = user.email || "";
            }
        }

        if (user && !user.isAnonymous) {
            try {
                const creds = await getUserSessionCredits(user.uid);
                const creditBanner = document.getElementById(`${rootId}-credit-banner`);
                const creditCount = document.getElementById(`${rootId}-credit-count`);
                if (creditBanner && creditCount && creds.credits > 0) {
                    creditCount.textContent = creds.credits;
                    creditBanner.style.display = "block";

                    const creditPayBtn = document.getElementById(`${rootId}-credit-pay-btn`);
                    if (creditPayBtn) {
                        creditPayBtn.onclick = async () => {
                            if (!selectedDate || !selectedSlot) {
                                setMessage("Please select a date and time slot first.", true);
                                return;
                            }
                            try {
                                creditPayBtn.disabled = true;
                                creditPayBtn.textContent = "Booking...";
                                setMessage("");

                                const res = await useSessionCreditForBooking(
                                    user.uid,
                                    peerId,
                                    selectedSlot.start,
                                    selectedSlot.end,
                                    user.displayName || "Member",
                                    user.email || ""
                                );

                                setMessage("🎉 Session booked for ₹0 using 1 Session Credit!");
                                setTimeout(() => {
                                    window.location.href = "../portal/user-dashboard-v2.html?view=bookings";
                                }, 1800);
                            } catch (cErr) {
                                setMessage(cErr.message || "Failed to redeem credit.", true);
                                creditPayBtn.disabled = false;
                                creditPayBtn.textContent = "Use Credit";
                            }
                        };
                    }
                }
            } catch (e) {
                console.warn("Credit check warning:", e);
            }
        }
    });

    // Initial Load: Select Today & Start 7-Day Slot Prefetch
    selectDate(selectedDate);
    setTimeout(prefetch7DaysSlots, 400);
}

// Global and ES Module export
if (typeof window !== "undefined") {
    window.initBookingWidget = initBookingWidget;
}
export { initBookingWidget };
