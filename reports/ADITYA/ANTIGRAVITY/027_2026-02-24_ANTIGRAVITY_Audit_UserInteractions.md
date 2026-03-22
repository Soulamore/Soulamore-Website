# User Interaction & Feedback Loop Audit

This report analyzes all data-entry points and tools across the Soulamore frontend to identify where users are missing "closed-loop" feedback (such as confirmation emails, receipts, or notification alerts). 

Currently, the Firebase backend stores the data, but no automated emails are triggered. Implementing these via a transactional email provider (like Resend or SendGrid) and the Firebase "Trigger Email" extension is highly recommended.

---

## 1. High-Priority Transactional (Must-Have)
*These strictly require email follow-ups to establish trust and confirm receipt of sensitive requests.*

### 🩺 Peer Bookings (`peer-booking-handler.js`)
- **Trigger:** A user requests a session with a Peer Listener and completes payment.
- **Missing Interaction:** 
  1. An email receipt/confirmation to the User with the date, time, and link for the session.
  2. A notification email to the Peer Listener alerting them of a new booking.
  3. *(Optional but recommended)* A calendar invite (.ics file) attached to the email.
- **Why it's needed:** Without this, users will panic wondering if their payment went through and how to access their session.

### 🆘 Lifeline Requests (`index.html`)
- **Trigger:** A user submits the "Need Human Connection" form.
- **Missing Interaction:** 
  - An immediate, warm confirmation email: *"We hear you. Your request is safe with us, and our care team will reach out within 24 hours."*
- **Why it's needed:** Users in distress need immediate validation that their outward reach did not fail.

### 📝 Applications (`join-us/peer.html`, `join-us/psychologist.html`)
- **Trigger:** A user applies to join the platform as a professional or peer.
- **Missing Interaction:** 
  - A professional confirmation email outlining the review timeline and required next steps (e.g., "Thanks for applying. We will review your credentials in 3-5 business days.").

### 📞 Contact Us (`company/contact.html`)
- **Trigger:** User fills out the general support contact form.
- **Missing Interaction:** Standard "Support ticket received" auto-reply.

---

## 2. Onboarding & Growth (Highly Recommended)
*These form the foundation of your user retention and platform welcome experience.*

### 🌱 Newsletter Subscriptions (`index.html`, `newsletter.html`)
- **Trigger:** User submits their email to the newsletter.
- **Missing Interaction:** 
  - A visually rich **Welcome Email**. It should introduce the Soulamore philosophy, link to the core tools (Problem Wall, Confession Box), and set expectations for future emails.

### 🔐 Account Creation (`portal/signup.html`)
- **Trigger:** User registers a new account.
- **Missing Interaction:** 
  - Email Verification Link (to prevent spam/fake accounts).
  - "Welcome to Soulamore" onboarding email explaining how to navigate their new dashboard.

### ⚙️ Security Alerts (`portal/peer-setup.html`, `password-reset.html`)
- **Trigger:** Password is changed or reset.
- **Missing Interaction:** 
  - Automated security email: *"Your password was recently changed. If this wasn't you, contact support immediately."*

---

## 3. Platform Tools & Artistic Features (Optional / Enhancements)
*Most tools on Soulamore (Vents, Echoes, Problem Wall) are designed to be anonymous space releases, so emails are counter-productive. However, a few specific tools could benefit from optional interactions.*

### 🎭 Confession Box (`tools/confession-box/index.html`)
- **Current State:** Fully anonymous.
- **Potential Interaction:** Add an *optional* checkbox: "Notify me when someone lights a candle for my confession." If they provide an email, they get a gentle email a few days later: *"Someone saw your confession and lit a candle for you."* (This creates incredibly high emotional retention).

### 📮 Soulamore Away / Postcards (`assets/js/data-handler.js`)
- **Trigger:** User writes a digital postcard.
- **Potential Interaction:** Allow users to input a friend's email address. The system then emails a stylized, clickable digital postcard to their friend, driving viral traffic back to the site.

---

## Implementation Requirements
To build any of these closed-loop emails, you do **not** need to build a custom backend server. Because you are on Firebase, the stack is unified:

1. **Email Service Provider (ESP):** Create an account with **Resend** (developer-friendly, great design) or **SendGrid**.
2. **Firebase Extension:** Install the official **"Trigger Email from Firestore"** extension in your Firebase Console.
3. **Template Design:** Design the HTML/CSS for the Welcome, Booking, and Lifeline emails (preferably using a framework like React Email or MJML so it looks good on mobile).
4. **Code Wiring:** Update `data-handler.js` so that when a form is submitted, it simultaneously writes a document to a new `/mail` Firestore collection, which the extension automatically detects and sends.
