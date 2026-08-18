import asyncio
import os
import sys
from playwright.async_api import async_playwright

BASE_URL = "https://soulamore-f0a64.web.app"
USER_EMAIL = "aditya110197@gmail.com"
USER_PASS = "Soulamore@02"
PEER_EMAIL = "sonikas1625@gmail.com"
PEER_PASS = "Soulamore@02"

SCREENSHOT_DIR = os.path.join(os.path.dirname(__file__), "test_screenshots")
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
        # 1. USER SESSION: LOGIN & BOOK SONIKA
        # ==========================================
        user_context = await browser.new_context(viewport={"width": 1280, "height": 900})
        user_page = await user_context.new_page()
        user_page.on("console", lambda m: safe_log("USER", m))

        print("\n=== [1/4] USER LOGIN (Aditya) ===", flush=True)
        await user_page.goto(f"{BASE_URL}/portal/login.html", wait_until="domcontentloaded")
        await user_page.wait_for_timeout(3000)

        # Ensure Remember Me is checked
        remember_box = user_page.locator("#rememberMe")
        if await remember_box.count() > 0:
            await remember_box.first.check()

        await user_page.locator("#emailInput").fill(USER_EMAIL)
        await user_page.locator("#passInput").fill(USER_PASS)
        await user_page.locator("button[type='submit'].submit-btn").click()
        await user_page.wait_for_timeout(6000)
        print(f"User current URL after login: {user_page.url}", flush=True)
        await user_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "01_user_logged_in.png"))

        print("\n=== [2/4] BOOKING SESSION WITH SONIKA ===", flush=True)
        await user_page.goto(f"{BASE_URL}/our-peers/profile.html?id=20", wait_until="domcontentloaded")
        await user_page.locator("#profileContent").wait_for(state="visible", timeout=15000)
        await user_page.locator("#booking-widget-root").wait_for(state="visible", timeout=15000)
        await user_page.locator("#booking-widget-root").scroll_into_view_if_needed()
        await user_page.wait_for_timeout(2000)

        # Pick date
        date_pills = user_page.locator(".bw-date-pill")
        if await date_pills.count() > 1:
            await date_pills.nth(1).click()
            await user_page.wait_for_timeout(2000)
        elif await date_pills.count() > 0:
            await date_pills.first.click()
            await user_page.wait_for_timeout(2000)

        # Pick time slot
        time_pills = user_page.locator(".bw-time-pill:not(.unavailable):not([disabled])")
        if await time_pills.count() > 0:
            await time_pills.first.click()
            await user_page.wait_for_timeout(1000)
        else:
            if await date_pills.count() > 2:
                await date_pills.nth(2).click()
                await user_page.wait_for_timeout(2000)
                time_pills = user_page.locator(".bw-time-pill:not(.unavailable):not([disabled])")
                if await time_pills.count() > 0:
                    await time_pills.first.click()
                    await user_page.wait_for_timeout(1000)

        # Ensure name is Aditya
        name_input = user_page.locator("input[id*='guest-name']")
        if await name_input.count() > 0:
            val = await name_input.first.input_value()
            if not val:
                await name_input.first.fill("Aditya")

        email_input = user_page.locator("input[id*='guest-email']")
        if await email_input.count() > 0:
            val = await email_input.first.input_value()
            if not val:
                await email_input.first.fill(USER_EMAIL)

        await user_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "02_booking_form_filled.png"))

        # Click Confirm Booking Request
        submit_btn = user_page.locator("#booking-widget-root-submit, button:has-text('Confirm Booking Request')")
        await submit_btn.first.wait_for(state="visible", timeout=15000)
        print("Submitting booking request...", flush=True)
        await submit_btn.first.click()
        await user_page.wait_for_timeout(9000)
        await user_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "03_booking_submitted.png"))

        # ==========================================
        # 2. CHECK USER DASHBOARD (Bookings Tab)
        # ==========================================
        print("\n=== [3/4] CHECK USER DASHBOARD (Bookings Tab) ===", flush=True)
        await user_page.goto(f"{BASE_URL}/portal/user-dashboard-v2.html", wait_until="domcontentloaded")
        await user_page.wait_for_timeout(6000)

        # Click My Sessions Tab
        sessions_tab = user_page.locator(".v2-nav-item:has-text('My Sessions')")
        if await sessions_tab.count() > 0:
            await sessions_tab.first.click()
            await user_page.wait_for_timeout(4000)
        await user_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "04_user_dashboard_sessions.png"))

        user_content = await user_page.locator("#v2UserBookingsContainer").inner_text()
        print(f"User Bookings Container Text:\n{user_content}", flush=True)
        user_has_booking = "Sonika" in user_content or "SL-2026" in user_content or "Pending" in user_content or "Confirmed" in user_content or "500" in user_content
        print(f"-> User Dashboard Session Visible: {user_has_booking}", flush=True)

        # ==========================================
        # 3. PEER SESSION: LOGIN AS SONIKA & CHECK
        # ==========================================
        print("\n=== [4/4] PEER LOGIN (Sonika) & CHECK PEER DASHBOARD ===", flush=True)
        peer_context = await browser.new_context(viewport={"width": 1280, "height": 900})
        peer_page = await peer_context.new_page()
        peer_page.on("console", lambda m: safe_log("PEER", m))

        await peer_page.goto(f"{BASE_URL}/portal/login.html", wait_until="domcontentloaded")
        await peer_page.wait_for_timeout(3000)

        # Select Peer Role Pill
        peer_role_pill = peer_page.locator(".role-pill:has-text('Peer')")
        if await peer_role_pill.count() > 0:
            await peer_role_pill.first.click()
            await peer_page.wait_for_timeout(500)

        p_remember = peer_page.locator("#rememberMe")
        if await p_remember.count() > 0:
            await p_remember.first.check()

        await peer_page.locator("#emailInput").fill(PEER_EMAIL)
        await peer_page.locator("#passInput").fill(PEER_PASS)
        await peer_page.locator("button[type='submit'].submit-btn").click()
        await peer_page.wait_for_timeout(6000)
        print(f"Peer current URL after login: {peer_page.url}", flush=True)

        await peer_page.goto(f"{BASE_URL}/portal/peer-dashboard-v2.html", wait_until="domcontentloaded")
        await peer_page.wait_for_timeout(6000)

        # Click Sessions Tab
        peer_sessions_tab = peer_page.locator(".v2-nav-item:has-text('Sessions')")
        if await peer_sessions_tab.count() > 0:
            await peer_sessions_tab.first.click()
            await peer_page.wait_for_timeout(4000)
        await peer_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "05_peer_dashboard_sessions.png"))

        peer_content = await peer_page.locator("#peer-upcoming-sessions").inner_text()
        print(f"Peer Upcoming Sessions Container Text:\n{peer_content}", flush=True)
        peer_has_booking = "Aditya" in peer_content or "aditya110197" in peer_content or "SL-2026" in peer_content or "Session" in peer_content or "Confirmed" in peer_content or "Pending" in peer_content
        print(f"-> Peer Dashboard Session Visible: {peer_has_booking}", flush=True)

        # ==========================================
        # 4. ADMIN DASHBOARD: CHECK ADMIN AS ADITYA
        # ==========================================
        print("\n=== [5/4] CHECK ADMIN DASHBOARD AS ADMIN ===", flush=True)
        admin_context = await browser.new_context(viewport={"width": 1280, "height": 900})
        admin_page = await admin_context.new_page()
        admin_page.on("console", lambda m: safe_log("ADMIN", m))

        await admin_page.goto(f"{BASE_URL}/portal/login.html", wait_until="domcontentloaded")
        await admin_page.wait_for_timeout(3000)

        # Ensure Remember Me is checked
        adm_rem = admin_page.locator("#rememberMe")
        if await adm_rem.count() > 0:
            await adm_rem.first.check()

        await admin_page.locator("#emailInput").fill(USER_EMAIL)
        await admin_page.locator("#passInput").fill(USER_PASS)
        await admin_page.locator("button[type='submit'].submit-btn").click()
        await admin_page.wait_for_timeout(6000)

        await admin_page.goto(f"{BASE_URL}/portal/admin-dashboard-v2.html", wait_until="domcontentloaded")
        await admin_page.wait_for_timeout(6000)

        # Switch to Sessions (Platform Bookings Ledger) Tab
        admin_sessions_tab = admin_page.locator(".v2-nav-item:has-text('Sessions'), .v2-nav-item[onclick*='sessions']")
        if await admin_sessions_tab.count() > 0:
            await admin_sessions_tab.first.click()
            await admin_page.wait_for_timeout(4000)
        await admin_page.screenshot(path=os.path.join(SCREENSHOT_DIR, "06_admin_dashboard_sessions.png"))

        admin_content = await admin_page.locator("#v2MasterLedgerContainer, #v2SessionsContainer").first.inner_text()
        safe_admin_content = admin_content.encode('ascii', errors='backslashreplace').decode('ascii')
        print(f"Admin Sessions Container Text:\n{safe_admin_content}", flush=True)
        admin_has_booking = "Sonika" in admin_content or "Aditya" in admin_content or "SL-2026" in admin_content or "500" in admin_content
        print(f"-> Admin Dashboard Session Visible: {admin_has_booking}", flush=True)

        await browser.close()

        print("\n" + "="*50, flush=True)
        print("3-WAY BOOKING LOOP RESULTS:", flush=True)
        print(f"1. User Dashboard (Aditya):  {'PASSED' if user_has_booking else 'FAILED'}", flush=True)
        print(f"2. Peer Dashboard (Sonika):  {'PASSED' if peer_has_booking else 'FAILED'}", flush=True)
        print(f"3. Admin Dashboard (Admin):  {'PASSED' if admin_has_booking else 'FAILED'}", flush=True)
        print("="*50, flush=True)

if __name__ == "__main__":
    asyncio.run(run_test())
