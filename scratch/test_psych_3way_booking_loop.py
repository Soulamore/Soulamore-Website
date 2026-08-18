import asyncio
import os
import sys
from playwright.async_api import async_playwright

BASE_URL = "https://soulamore-f0a64.web.app"
USER_EMAIL = "aditya110197@gmail.com"
USER_PASS = "Soulamore@02"
PSYCH_EMAIL = "yashmeetkaur011@gmail.com"
PSYCH_PASS = "Soulamore@02"
PSYCH_SLUG = "bhagyavathi"

SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), "test_screenshots_psych")
os.makedirs(SCREENSHOT_DIR, exist_ok=True)

async def run_test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        
        def safe_log(prefix, msg):
            try:
                text = msg.text.encode('ascii', errors='backslashreplace').decode('ascii')
                print(f"[{prefix} CONSOLE] {msg.type}: {text}", flush=True)
            except Exception:
                pass

        # ==========================================
        # 1. USER SESSION: LOGIN & BOOK BHAGYAVATHI
        # ==========================================
        user_context = await browser.new_context(viewport={"width": 1280, "height": 900})
        user_page = await user_context.new_page()
        user_page.on("console", lambda m: safe_log("USER", m))

        print("\n=== [1/4] USER LOGIN (Aditya) ===", flush=True)
        await user_page.goto(f"{BASE_URL}/portal/login.html", wait_until="domcontentloaded")
        await user_page.wait_for_timeout(3000)

        remember_box = user_page.locator("#rememberMe")
        if await remember_box.count() > 0:
            await remember_box.first.check()

        await user_page.locator("#emailInput").fill(USER_EMAIL)
        await user_page.locator("#passInput").fill(USER_PASS)
        await user_page.locator("button[type='submit'].submit-btn").click()
        await user_page.wait_for_timeout(6000)
        print(f"User current URL after login: {user_page.url}", flush=True)
        await user_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "01_user_logged_in.png"))

        print("\n=== [2/4] CREATING BOOKING FOR PSYCHOLOGIST (Bhagyavathi) ===", flush=True)
        booking_res = await user_page.evaluate("""async (psychSlug) => {
            try {
                const { db, collection, addDoc, serverTimestamp } = await import('/assets/js/firebase-config.js');
                const { auth } = await import('/assets/js/firebase-config.js');
                const user = auth.currentUser;
                
                const slId = 'SL-2026-' + Math.floor(1000 + Math.random() * 9000);
                const docRef = await addDoc(collection(db, 'peer_bookings'), {
                    userId: user ? user.uid : 'aditya_uid',
                    userName: user ? (user.displayName || 'Aditya Harsh') : 'Aditya Harsh',
                    userEmail: user ? user.email : 'aditya110197@gmail.com',
                    peerId: psychSlug,
                    peerName: 'Bhagyavathi',
                    psychId: psychSlug,
                    psychName: 'Bhagyavathi',
                    providerRole: 'psychologist',
                    planType: 'per_session',
                    amount: 1000,
                    sessionFee: 1000,
                    slId: slId,
                    status: 'confirmed',
                    startTime: new Date(Date.now() + 86400000).toISOString(),
                    endTime: new Date(Date.now() + 90000000).toISOString(),
                    date: new Date(Date.now() + 86400000).toISOString(),
                    time: '11:00 AM',
                    meetingUrl: 'https://soulamore-f0a64.web.app/portal/video-conference.html?roomId=' + slId,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                });
                return { success: true, bookingId: docRef.id, slId: slId };
            } catch (err) {
                return { success: false, error: err.message };
            }
        }""", PSYCH_SLUG)

        print(f"Booking creation result: {booking_res}", flush=True)
        assert booking_res.get('success') is True, f"Failed to create booking: {booking_res}"
        created_sl_id = booking_res.get('slId')

        # ==========================================
        # 2. CHECK USER DASHBOARD
        # ==========================================
        print("\n=== [3/4] CHECK USER DASHBOARD (Aditya) ===", flush=True)
        await user_page.goto(f"{BASE_URL}/portal/user-dashboard-v2.html", wait_until="domcontentloaded")
        await user_page.wait_for_timeout(4000)

        # Switch to bookings view
        await user_page.evaluate("() => { if (typeof v2SwitchTab === 'function') v2SwitchTab('bookings'); }")
        await user_page.wait_for_timeout(3000)

        bookings_container = user_page.locator("#v2UserBookingsContainer")
        await bookings_container.wait_for(state="visible", timeout=15000)
        user_container_text = await bookings_container.inner_text()
        safe_user_text = user_container_text.encode('ascii', errors='backslashreplace').decode('ascii')
        print(f"User Bookings Container Text:\n{safe_user_text[:600]}", flush=True)
        await user_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "02_user_dashboard_bookings.png"))

        user_sees_booking = "Bhagyavathi" in user_container_text or created_sl_id in user_container_text
        print(f"-> User Dashboard Psych Booking Visible: {user_sees_booking}", flush=True)

        # ==========================================
        # 3. PSYCHOLOGIST SESSION: LOGIN & CHECK PSYCH DASHBOARD
        # ==========================================
        print("\n=== [4/4] PSYCHOLOGIST LOGIN (Bhagyavathi) & CHECK PSYCH DASHBOARD ===", flush=True)
        psych_context = await browser.new_context(viewport={"width": 1280, "height": 900})
        psych_page = await psych_context.new_page()
        psych_page.on("console", lambda m: safe_log("PSYCH", m))

        await psych_page.goto(f"{BASE_URL}/portal/login.html", wait_until="domcontentloaded")
        await psych_page.wait_for_timeout(3000)

        remember_box_p = psych_page.locator("#rememberMe")
        if await remember_box_p.count() > 0:
            await remember_box_p.first.check()

        await psych_page.locator("#emailInput").fill(PSYCH_EMAIL)
        await psych_page.locator("#passInput").fill(PSYCH_PASS)
        await psych_page.locator("button[type='submit'].submit-btn").click()
        await psych_page.wait_for_timeout(6000)
        print(f"Psychologist current URL after login: {psych_page.url}", flush=True)

        await psych_page.goto(f"{BASE_URL}/portal/psych-dashboard-v2.html", wait_until="domcontentloaded")
        await psych_page.wait_for_timeout(5000)

        # Switch to Patients roster tab
        await psych_page.evaluate("() => { if (typeof v2SwitchTab === 'function') v2SwitchTab('clients'); }")
        await psych_page.wait_for_timeout(3000)

        patient_roster = psych_page.locator("#psych-patient-roster")
        await patient_roster.wait_for(state="visible", timeout=15000)
        psych_container_text = await patient_roster.inner_text()
        safe_psych_text = psych_container_text.encode('ascii', errors='backslashreplace').decode('ascii')
        print(f"Psych Patient Roster Text:\n{safe_psych_text}", flush=True)
        await psych_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "03_psych_dashboard_roster.png"))

        psych_sees_booking = "Aditya" in psych_container_text or created_sl_id in psych_container_text
        print(f"-> Psych Dashboard Session Visible: {psych_sees_booking}", flush=True)

        # ==========================================
        # 4. ADMIN DASHBOARD CHECK
        # ==========================================
        print("\n=== [5/4] CHECK ADMIN DASHBOARD AS ADMIN ===", flush=True)
        await user_page.goto(f"{BASE_URL}/portal/admin-dashboard-v2.html", wait_until="domcontentloaded")
        await user_page.wait_for_timeout(5000)

        await user_page.evaluate("() => { if (typeof v2SwitchTab === 'function') v2SwitchTab('sessions'); }")
        await user_page.wait_for_timeout(3000)

        admin_container = user_page.locator("#v2MasterLedgerContainer")
        await admin_container.wait_for(state="visible", timeout=15000)
        admin_container_text = await admin_container.inner_text()
        safe_admin_text = admin_container_text.encode('ascii', errors='backslashreplace').decode('ascii')
        print(f"Admin Sessions Container Text:\n{safe_admin_text[:600]}", flush=True)
        await user_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "04_admin_dashboard_sessions.png"))

        admin_sees_booking = "Bhagyavathi" in admin_container_text or created_sl_id in admin_container_text
        print(f"-> Admin Dashboard Session Visible: {admin_sees_booking}", flush=True)

        # ==========================================
        # 5. SUMMARY
        # ==========================================
        print("\n" + "="*50, flush=True)
        print("PSYCHOLOGIST 3-WAY BOOKING LOOP RESULTS:", flush=True)
        print(f"1. User Dashboard (Aditya):       {'PASSED' if user_sees_booking else 'FAILED'}", flush=True)
        print(f"2. Psych Dashboard (Bhagyavathi): {'PASSED' if psych_sees_booking else 'FAILED'}", flush=True)
        print(f"3. Admin Dashboard (Admin):       {'PASSED' if admin_sees_booking else 'FAILED'}", flush=True)
        print("="*50 + "\n", flush=True)

        await psych_context.close()
        await user_context.close()
        await browser.close()

if __name__ == "__main__":
    asyncio.run(run_test())
