# Local Development Guide

This guide explains how to run the Soulamore website locally on your machine.

## Prerequisites

- Node.js installed (you already have this via nvm)
- Firebase CLI installed (you already have this)
- Firebase project configured (already done)

## Option 1: Firebase Emulator Suite (Recommended)

This is the **best option** because it runs:
- ✅ Firebase Hosting (serves your HTML/CSS/JS files)
- ✅ Firestore (database)
- ✅ Firebase Auth (authentication)
- ✅ Firebase Functions (backend API)

### Steps:

1. **Navigate to the project directory:**
   ```bash
   cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website
   ```

2. **Start the Firebase Emulators:**
   ```bash
   firebase emulators:start
   ```

   This will start:
   - **Hosting:** http://localhost:5000 (your website)
   - **Firestore:** http://localhost:8080
   - **Auth:** http://localhost:9099
   - **Functions:** http://localhost:5001
   - **Emulator UI:** http://localhost:4000 (dashboard to view/manage data)

3. **Open your browser:**
   - Main site: http://localhost:5000
   - Emulator UI: http://localhost:4000

4. **Update Firebase Config for Local Development:**
   
   The Firebase config needs to point to local emulators. Check `assets/js/firebase-config.js` - it should automatically detect localhost and use emulators.

### Using Emulator UI

The Emulator UI (http://localhost:4000) lets you:
- View/manage Firestore data
- Create test users for Auth
- View function logs
- Import/export data

### Stop the Emulators

Press `Ctrl+C` in the terminal to stop all emulators.

---

## Option 2: Simple HTTP Server (Quick Testing)

**Note:** This only serves static files. Firebase features (Auth, Firestore, Functions) **won't work** with this method.

### Using Python (if installed):

```bash
cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website
python3 -m http.server 8000
```

Then open: http://localhost:8000

### Using Node.js http-server:

1. Install globally:
   ```bash
   npm install -g http-server
   ```

2. Run:
   ```bash
   cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website
   http-server -p 8000
   ```

Then open: http://localhost:8000

---

## Option 3: Firebase Hosting Emulator Only

If you only want to test the static site (no database/auth):

```bash
firebase emulators:start --only hosting
```

Then open: http://localhost:5000

---

## Troubleshooting

### Port Already in Use

If a port is already in use, you can:
1. Stop the process using that port
2. Or change the port in `firebase.json` under `emulators`

### Firebase Config Not Connecting

Make sure `assets/js/firebase-config.js` has logic to detect localhost and use emulators. It should look like:

```javascript
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  // Use emulator settings
}
```

### Authentication Not Working Locally

- Make sure you're using the emulator suite (Option 1)
- Check that Auth emulator is running (port 9099)
- Verify Firebase config points to emulators when on localhost

---

## Quick Start Command

For the easiest setup, just run:

```bash
cd /Users/abhisheksingla/Documents/soulamore/Soulamore-Website && firebase emulators:start
```

Then open http://localhost:5000 in your browser!

