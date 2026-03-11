# Profile Generation Architecture & Handoff

## Overview
The goal of this implementation is to connect the onboarding forms (`peer-onboarding.html`, `psychologist-onboarding.html`) to an automated profile-generation system. This system will map user inputs to backend database schemas, allow the user to edit their details via a dashboard, and automatically render beautiful, static-like profiles matching the exact designs of the provided templates (`peer_profile_template.html` and `psychologist_profile_template.html`).

## 1. Data Schema Mapping

**CRITICAL NOTE ON SEPARATION:** 
Soulamore strictly separates **Peers** (lived-experience listeners) and **Psychologists** (clinical professionals). They have separate onboarding forms, separate Dashboards (`peer_dashboard_index` vs `psych_dashboard_index`), separate database schemas, and distinct Listing Pages (`peer_listing` vs `psychologist_listing`). The authentication flow must route them to their respective separated environments.

Based on the structure of the provided template files, the backend database (e.g., Firebase Firestore, PostgreSQL, or MongoDB) should enforce the following separated schemas:

### Psychologist Schema
- **Basic Info:**
  - `full_name` (String)
  - `role_title` (String, e.g., "Counseling Psychologist (Integrative)")
  - `avatar_initial` or `avatar_url` (String)
  - `languages` (Array of Strings)
- **Service Details:**
  - `pricing` (String/Number, e.g., "₹1,000 / Session")
  - `session_format` (String, e.g., "Online (Video/Audio)")
  - `years_of_experience` (String/Number)
  - `accepting_new_clients` (Boolean)
- **Profile Content:**
  - `bio_quote` (String)
  - `bio_paragraphs` (Array of Strings)
  - `approach_tags` (Array of Strings, e.g., ["Trauma-Informed"])
  - `specializations` (Array of Strings, e.g., ["Trauma", "Narcissistic Abuse"])
- **Complex Fields:**
  - `areas_of_focus` (Array of Objects): `[{ icon: "fas fa-heart-broken", title: "Trauma & Abuse Recovery", subtitle: "Narcissistic abuse, domestic violence" }]`
  - `wall_of_love_testimonials` (Array of Objects): `[{ quote: "...", author_label: "Client (3 Sessions)" }]`
- **Media:**
  - `background_audio_url` (String)

### Peer Schema
- **Basic Info:**
  - `full_name` (String)
  - `role_title` (String, e.g., "Peer Counselor")
  - `avatar_initial` or `avatar_url` (String)
  - `is_verified_listener` (Boolean)
- **Profile Content:**
  - `bio_quote` (String)
  - `bio_paragraphs` (Array of Strings)
- **Reviews & Ratings Sub-Collection:**
  - `overall_rating` (Number, e.g., 4.8)
  - `total_reviews` (Number)
  - `reviews` (Array of Objects): `[{ author: "Ankita", rating: 5, content: "..." }]`

---

## 2. Onboarding Form Collection (What to Ask)

The existing forms (`psychologist_onboarding.html` and `peer_onboarding.html`) need to be wired to collect the foundational data for these schemas.

**For Psychologists (During Onboarding):**
1. Full Name & Contact details.
2. Credentials & Base Role Title.
3. Years of Experience.
4. Languages spoken.
5. Primary Modality (Video/Audio/Chat).
6. Base Pricing per session.
7. Verification documents (Certificates/Degrees) - *For internal admin approval, not public profile.*

**For Peers (During Onboarding):**
1. Full Name (or chosen Alias) & Contact details.
2. Lived Experiences / Areas they are comfortable holding space for.
3. Motivation (Short text on why they want to be a peer).
4. *Admin Verification Step* -> Grants the "Verified Listener" badge.

---

## 3. Provider Dashboard (What to Edit)

Once onboarded and approved, providers (Peers/Psychologists) will access a **Provider Dashboard** to manage their auto-generated profile page. 

**Editable Sections in the Dashboard:**
1. **About Me / Bio Management:** Text areas allowing them to edit their `bio_quote` and `bio_paragraphs`.
2. **Specializations & Tags:** A tag-input UI to add/remove focus areas (e.g., Trauma, Relationships, ADHD).
3. **Areas of Focus (Psychologists Only):** A dynamic list builder where they can pair a font-awesome icon class with a Title and Subtitle.
4. **Availability Toggle:** A simple switch to toggle `accepting_new_clients` (On/Off).
5. **Pricing & Format Updates:** Inputs to adjust their session rates and supported formats.
6. **Avatar/Audio Upload:** 
   - Ability to upload a profile picture (replaces the initial letter circle).
   - *Optional:* Upload a custom background audio track (or select from a curated list of calming tracks).

---

## 4. Frontend Profile Generation (Implementation Plan for Claude)

Claude should build a dynamic routing system or a static-site generation (SSG) script depending on the chosen stack (e.g., Next.js dynamic routes `[id].js`, or a vanilla JS fetch implementation).

**If using Vanilla JS (Client-Side Rendering):**
1. Create a single `psychologist-profile.html` and `peer-profile.html`.
2. Read a URL parameter (e.g., `?id=bhagyavathi`).
3. Fetch the data from the backend (Firebase/API).
4. Populate the DOM elements (e.g., `document.querySelector('.profile-name').textContent = data.full_name;`).
5. Iterate through arrays (like `areas_of_focus` or `reviews`) and inject HTML templates using `document.createElement`.

**Key Safety Note:** Ensure all user-generated text inputs (like Reviews and Bios) are properly sanitized before injecting them into the DOM to prevent XSS attacks (avoid `innerHTML` where `textContent` can be used).

---

## 5. Authentication & Listing Flow

To give you the full context, the `claude_handoff_profiles/templates` folder now also contains:
- **Authentication Forms:** `user-login.html`, `peer-psychologist-login.html`, and `join-us-index.html`. These handle the entry points for creating accounts.
- **Dashboards:** `dashboard/peer_dashboard_index.html`, `dashboard/psych_dashboard_index.html`, and `dashboard/admin_dashboard_index.html`. These are the portal interfaces where providers will actually edit the schema fields defined in Section 1.
- **List Pages:** `peer_listing.html` and `psychologist_listing.html`. These pages need to automatically fetch all "published" (or `is_verified: true`) profiles from the database and generate preview cards that link to the dynamic individual profile pages.
- **Core Logic:** `components/components.js` and `firebase/firebase-config.js` show how the site currently handles global state, header injection, and data fetching.

**The Expected Complete Flow:**
1. A user applies via `peer-onboarding.html` or `psychologist-onboarding.html`.
2. Admin approves via `admin_dashboard_index.html` (setting `is_verified: true` in DB).
3. The Provider logs in via `peer-psychologist-login.html` and lands on their respective dashboard (`peer_dashboard_index` or `psych_dashboard_index`).
4. They populate their empty schema fields (Bio, Specializations, Avatar) via the dashboard UI.
5. The `peer_listing.html` or `psychologist_listing.html` dynamically fetches their basic node and generates a portrait card.
6. Clicking that card opens the dynamic `profile.html?id=xxx`, which renders the full profile matching the `peer_profile_template.html` or `psychologist_profile_template.html`.

---

## Next Steps for Claude
1. Review the HTML template structures in this folder.
2. Set up the backend database collections based on the schemas above.
3. Wire the HTML forms in `templates/psychologist_onboarding.html` and `peer_onboarding.html` to POST this data to the database.
4. Integrate the Authentication flow to secure the Dashboards.
5. Build the provider dashboard UI forms to perform CRUD operations on their profile schema.
6. Implement the rendering logic to display the profile cards on the List pages, and the full details on the dynamic Profile pages.
