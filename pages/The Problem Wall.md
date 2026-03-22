# Product Specification: The Problem Wall

## 1. Product Vision
A digital "Wailing Wall" where users can anonymously release their burdens. The goal is **catharsis through expression**, not solution-finding. Users should feel "seen" but not "judged" or "fixed".

## 2. Core User Experience
-   **Vibe**: Somber, safe, calm, and endless.
-   **Privacy**: 100% Anonymous. No user profiles or names attached to notes on the UI.
-   **Interaction Model**: Read -> Resonate -> Release.

## 3. Feature List & Logic

### A. Posting (The Release)
*   **Input**: Text-only note (max 280 chars). No images, no links.
*   **Submission**:
    *   **Optimistic UI**: Note appears *instantly* on the user's screen without waiting for the server.
    *   **Placement**: Automatically placed near the center (organic spiral algorithm) but never covering the "Title" or other notes.
    *   **Sound**: A subtle "pop" or "paper" sound confirms the action.
*   **Immutability**: Once posted, the text cannot be edited or deleted by the user. (This prevents changing a harmless note into something toxic later).

### B. The "Empty Club" Prevention (Seeding Logic)
*   **Problem**: An empty wall scares away users.
*   **Solution**: The **Strict 20-Seed Baseline**.
    *   The system ensures **at least 20 placeholder notes** are always present.
    *   These notes are permanent and distinct from user posts.
    *   User posts start adding *on top* of these 20. Removing a user post does not affect the seeds.

### C. Interactions (Silent Support)
*   **Reactions**: Users cannot comment (to prevent toxicity). They can only react:
    *   ❤️ **Heart**: "I feel you."
    *   🌸 **Flower**: "Sending gentle support."
    *   🕯️ **Candle**: "Holding space for you."
*   **Counters**:
    *   **Note Level**: Shows how many people resonated with *that specific problem*.
    *   **Global Level**: A "Impact Dashboard" on the right shows total hearts/flowers/candles given across *all time* (even for hidden notes), reinforcing the magnitude of community support.

### D. Visual System (The "Infinite" Canvas)
*   **Hybrid Layout Engine**:
    *   **Center Protection**: STRICT "No-Fly Zone" for the "Problem Wall" title. Notes must never obscure the heading.
    *   **Organic Overlap**: Notes are allowed to overlap by **maximum 5%** to create a natural, "piled paper" aesthetic, but must never fully obscure another note.
    *   **Spiral Sorting**: Newest notes appear near the center/top; older notes drift outward organically.
*   **Navigation**:
    *   **Pan & Zoom**: Users can drag the background (`mousedown` + drag) to explore the vastness.
    *   **Reset View**: A floating button to instantly re-center the camera on the main title (The "Home" position).
    *   **Auto-Zoom**: When posting a note, the camera smoothly pans and zooms to the new note to confirm placement.
    *   **Post Button**: Must be accessible and functional at all times.

### E. Moderation & Safety
*   **Keyword Filtering**: (Backlog) Block obvious slurs.
*   **Admin Hide**: Admins can "hide" a note. Hidden notes:
    *   Disappear from the visual wall.
    *   Are NOT deleted from the database (for legal/record keeping).
    *   Are excluded from the seeding count logic.

## 4. Technical Constraints (For Devs)
*   **Database**: Firestore.
*   **Coordinates**: Calculated Client-Side (deterministic based on Note ID). Not stored in DB.
*   **Auth**: Anonymous Auth (for rate limiting/security) handled silently.

## 5. Current Known Issues (To Be Fixed)
*   **Real-time Reaction Sync**: Likes/Flowers/Candles are not updating in real-time for other users. Using a second device shows that the count doesn't increment on the observer's screen immediately.
*   **Empty Wall Context**: Previously resolved, but monitoring needed to ensure `isSeeded` logic holds up under load.
*   **Mobile Gestures**: Pinch-to-zoom and pan are implemented but need fine-tuning for sensitivity on different devices.
