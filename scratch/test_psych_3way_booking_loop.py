import time
import sys
from playwright.sync_api import sync_playwright

USER_EMAIL = "aditya110197@gmail.com"
USER_PASS = "Soulamore@02"
PSYCH_EMAIL = "yashmeetkaur011@gmail.com"
PSYCH_PASS = "Soulamore@02"
PSYCH_SLUG = "bhagyavathi"

BASE_URL = "https://soulamore-f0a64.web.app"

def safe_str(s):
    return str(s).encode('ascii', errors='backslashreplace').decode('ascii')

def run_test():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        page.on("console", lambda msg: print(f"[CONSOLE {msg.type}] {safe_str(msg.text)}"))
        page.on("pageerror", lambda exc: print(f"[PAGE ERROR] {safe_str(exc)}"))

        print("=== [1/4] USER LOGIN (Aditya) ===")
        page.goto(f"{BASE_URL}/portal/login.html", wait_until="networkidle")
        page.fill("#loginEmail", USER_EMAIL)
        page.fill("#loginPassword", USER_PASS)
        page.click("#loginSubmitBtn")
        page.wait_for_timeout(5000)
        print(f"Logged in user current URL: {page.url}")

        print("=== [2/4] CREATE BOOKING FOR PSYCHOLOGIST (Bhagyavathi) ===")
        # Inject direct booking creation using client-side Firebase for deterministic test
        booking_res = page.evaluate("""async (psychSlug) => {
            try {
                const { db, collection, addDoc, serverTimestamp } = await import('/assets/js/firebase-config.js');
                const { auth } = await import('/assets/js/firebase-config.js');
                const user = auth.currentUser;
                
                const slId = 'SL-2026-' + Math.floor(1000 + Math.random() * 9000);
                const docRef = await addDoc(collection(db, 'peer_bookings'), {
                    userId: user.uid,
                    userName: user.displayName || 'Aditya Harsh',
                    userEmail: user.email || 'aditya110197@gmail.com',
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

        print(f"Booking creation result: {booking_res}")
        assert booking_res.get('success') is True, f"Failed to create booking: {booking_res}"
        created_sl_id = booking_res.get('slId')

        print("=== [3/4] CHECK USER DASHBOARD AS USER (Aditya) ===")
        page.goto(f"{BASE_URL}/portal/user-dashboard-v2.html?view=bookings", wait_until="networkidle")
        page.wait_for_timeout(4000)

        user_bookings_text = page.locator("#v2UserBookingsContainer").inner_text()
        print(f"User Bookings Container Text:\n{safe_str(user_bookings_text)}")
        user_sees_booking = "Bhagyavathi" in user_bookings_text or created_sl_id in user_bookings_text
        print(f"-> User Dashboard Psych Booking Visible: {user_sees_booking}")
        assert user_sees_booking, "Psychologist booking not visible in User Dashboard!"

        print("=== [4/4] PSYCHOLOGIST LOGIN (Bhagyavathi) & CHECK PSYCH DASHBOARD ===")
        # Open a new clean context for psychologist
        psych_context = browser.new_context(viewport={'width': 1280, 'height': 800})
        psych_page = psych_context.new_page()
        psych_page.on("console", lambda msg: print(f"[PSYCH CONSOLE] {safe_str(msg.type)}: {safe_str(msg.text)}"))

        psych_page.goto(f"{BASE_URL}/portal/login.html", wait_until="networkidle")
        psych_page.fill("#loginEmail", PSYCH_EMAIL)
        psych_page.fill("#loginPassword", PSYCH_PASS)
        psych_page.click("#loginSubmitBtn")
        psych_page.wait_for_timeout(5000)
        print(f"Psychologist current URL: {psych_page.url}")

        psych_page.goto(f"{BASE_URL}/portal/psych-dashboard-v2.html", wait_until="networkidle")
        psych_page.wait_for_timeout(5000)

        # Switch to Patients/Clients tab
        psych_page.evaluate("() => { if (typeof v2SwitchTab === 'function') v2SwitchTab('clients'); }")
        psych_page.wait_for_timeout(3000)

        patient_roster_text = psych_page.locator("#psych-patient-roster").inner_text()
        print(f"Psych Patient Roster Text:\n{safe_str(patient_roster_text)}")
        psych_sees_booking = "Aditya" in patient_roster_text or created_sl_id in patient_roster_text
        print(f"-> Psychologist Dashboard Session Visible: {psych_sees_booking}")
        assert psych_sees_booking, "Patient session not visible in Psychologist Dashboard!"

        print("=== [5/4] CHECK ADMIN DASHBOARD AS ADMIN ===")
        # Re-use user page (Aditya is Admin)
        page.goto(f"{BASE_URL}/portal/admin-dashboard-v2.html", wait_until="networkidle")
        page.wait_for_timeout(5000)

        # Switch to sessions ledger tab
        page.evaluate("() => { if (typeof v2SwitchTab === 'function') v2SwitchTab('sessions'); }")
        page.wait_for_timeout(3000)

        admin_ledger_text = page.locator("#v2MasterLedgerContainer").inner_text()
        print(f"Admin Sessions Ledger Text:\n{safe_str(admin_ledger_text[:500])}...")
        admin_sees_booking = "Bhagyavathi" in admin_ledger_text or created_sl_id in admin_ledger_text
        print(f"-> Admin Dashboard Psych Session Visible: {admin_sees_booking}")
        assert admin_sees_booking, "Psychologist session not visible in Admin Dashboard!"

        print("\n" + "="*50)
        print("PSYCHOLOGIST 3-WAY BOOKING LOOP RESULTS:")
        print(f"1. User Dashboard (Aditya):       {'PASSED' if user_sees_booking else 'FAILED'}")
        print(f"2. Psych Dashboard (Bhagyavathi): {'PASSED' if psych_sees_booking else 'FAILED'}")
        print(f"3. Admin Dashboard (Superadmin):  {'PASSED' if admin_sees_booking else 'FAILED'}")
        print("="*50 + "\n")

        psych_context.close()
        context.close()
        browser.close()

if __name__ == "__main__":
    run_test()
