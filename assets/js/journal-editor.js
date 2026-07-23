
import { auth, db } from "./firebase-config.js";
import { doc, setDoc, getDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let quill;
let saveTimeout;
let isLoaded = false;

// Initialize Editor when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // Wait for auth to confirm user before loading data
    setTimeout(initEditor, 1000);
});

// Hook into the global switchView to load data when Journal is opened
const originalSwitchView = window.switchView;
window.switchView = function (viewName, clickedLink) {
    if (originalSwitchView) originalSwitchView(viewName, clickedLink);

    if (viewName === 'journal') {
        // Ensure editor is ready size-wise
        setTimeout(() => {
            if (!isLoaded) loadJournal();
        }, 100);
    }
};

function initEditor() {
    const container = document.getElementById('journal-editor');
    if (!container) return; // Not on a page with an editor

    // Initialize Quill
    quill = new Quill('#journal-editor', {
        theme: 'bubble',
        placeholder: 'Start writing...',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'header': 1 }, { 'header': 2 }],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['clean']
            ]
        }
    });

    // Listen for changes for autosave
    quill.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') {
            document.getElementById('journal-status').textContent = "Saving...";
            document.getElementById('journal-status').style.opacity = "1";

            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(saveContent, 2000); // Autosave after 2s of inactivity
        }
    });
}

async function loadJournal() {
    const user = auth.currentUser;
    if (!user) return;

    const docRef = doc(db, "journals", user.uid);

    try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            // Load content into Quill
            quill.setContents(data.content);
        }
        isLoaded = true;
    } catch (error) {
        console.error("Error loading journal:", error);
    }
}

function showCrisisModalTier1() {
    if (document.getElementById('crisis-modal-tier1')) return;

    const modalHtml = `
        <div id="crisis-modal-tier1" style="position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.98); backdrop-filter: blur(20px); z-index: 999999; display: flex; align-items: center; justify-content: center; padding: 20px;">
            <div style="background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 24px; max-width: 500px; padding: 40px; box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5); text-align: center; color: #f1f5f9; font-family: 'Plus Jakarta Sans', sans-serif;">
                <div style="font-size: 3.5rem; color: #ef4444; margin-bottom: 20px;">
                    <i class="fas fa-exclamation-triangle"></i>
                </div>
                <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.8rem; margin-bottom: 15px; color: #ef4444;">We noticed something in what you wrote</h2>
                <p style="font-size: 1rem; opacity: 0.85; line-height: 1.6; margin-bottom: 20px; text-align: left;">
                    What you're feeling matters, and you don't have to face it alone.
                </p>
                <p style="font-size: 0.95rem; opacity: 0.85; line-height: 1.6; margin-bottom: 25px; text-align: left;">
                    If you're having thoughts of suicide or self-harm, please reach out to a crisis helpline right now — they're available 24/7 and are there to listen.
                </p>
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 25px;">
                    <a href="tel:9152987821" style="background: #ef4444; color: white; padding: 12px; border-radius: 50px; text-decoration: none; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <i class="fas fa-phone-alt"></i> iCall — 9152987821
                    </a>
                    <a href="tel:18602662345" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 12px; border-radius: 50px; text-decoration: none; font-weight: bold; display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <i class="fas fa-phone-alt"></i> Vandrevala Foundation — 1860-2662-345
                    </a>
                </div>
                <div style="display: flex; gap: 15px; justify-content: center; align-items: center;">
                    <button id="btn-crisis-dismiss" style="border: none; padding: 12px 24px; border-radius: 50px; font-weight: 700; font-size: 0.95rem; cursor: pointer; background: #10b981; color: white; transition: 0.3s;">I'm safe — continue to app</button>
                    <a href="/get-help-now.html" target="_blank" style="font-size: 0.9rem; color: #4ECDC4; text-decoration: underline;">View more resources</a>
                </div>
            </div>
        </div>
    `;

    const div = document.createElement('div');
    div.innerHTML = modalHtml;
    document.body.appendChild(div.firstElementChild);

    document.getElementById('btn-crisis-dismiss').addEventListener('click', () => {
        const modal = document.getElementById('crisis-modal-tier1');
        if (modal) modal.remove();
    });
}

function showCrisisBannerTier2() {
    if (document.getElementById('crisis-banner-tier2')) return;

    const bannerHtml = `
        <div id="crisis-banner-tier2" style="position: fixed; top: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 600px; background: rgba(30, 41, 59, 0.95); border: 1px solid #f59e0b; border-radius: 16px; padding: 15px 20px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5); backdrop-filter: blur(10px); z-index: 99999; display: flex; align-items: center; justify-content: space-between; gap: 15px; color: #f1f5f9; font-family: 'Plus Jakarta Sans', sans-serif; animation: slideDown 0.5s ease-out;">
            <div style="display: flex; align-items: center; gap: 12px; text-align: left;">
                <i class="fas fa-info-circle" style="color: #f59e0b; font-size: 1.5rem; flex-shrink: 0;"></i>
                <div style="font-size: 0.9rem; line-height: 1.5;">
                    It sounds like things have been difficult. You deserve support — here are some resources if you need them.
                </div>
            </div>
            <div style="display: flex; gap: 10px; flex-shrink: 0;">
                <a href="/company/compliance.html" target="_blank" style="background: #f59e0b; color: #0f172a; padding: 8px 16px; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 0.8rem; display: inline-block;">View Resources</a>
                <button id="btn-banner-dismiss" style="background: none; border: none; color: #f1f5f9; opacity: 0.7; cursor: pointer; font-size: 1.1rem; padding: 5px;"><i class="fas fa-times"></i></button>
            </div>
        </div>
    `;

    if (!document.getElementById('crisis-banner-style')) {
        const style = document.createElement('style');
        style.id = 'crisis-banner-style';
        style.innerHTML = `@keyframes slideDown { from { top: -100px; opacity: 0; } to { top: 20px; opacity: 1; } }`;
        document.head.appendChild(style);
    }

    const div = document.createElement('div');
    div.innerHTML = bannerHtml;
    document.body.appendChild(div.firstElementChild);

    document.getElementById('btn-banner-dismiss').addEventListener('click', () => {
        const banner = document.getElementById('crisis-banner-tier2');
        if (banner) banner.remove();
    });
}

async function saveContent() {
    const user = auth.currentUser;
    if (!user) return;

    const content = quill.getContents();
    const plainText = quill.getText(); // For preview/search later

    try {
        await setDoc(doc(db, "journals", user.uid), {
            userId: user.uid,
            content: content,
            updatedAt: serverTimestamp(),
            snippet: plainText.substring(0, 100) // Store snippet for lists
        }, { merge: true });

        document.getElementById('journal-status').textContent = "Autosaved";
        setTimeout(() => {
            document.getElementById('journal-status').style.opacity = "0.5";
        }, 1000);

        // Perform compliance crisis scan
        try {
            const { validateSubmission } = await import('./safety-filter.js');
            const safetyCheck = validateSubmission(plainText);
            
            if (safetyCheck.isCrisis) {
                if (safetyCheck.isTier1) {
                    showCrisisModalTier1();
                } else if (safetyCheck.isTier2) {
                    showCrisisBannerTier2();
                }
            }
        } catch (safetyErr) {
            console.warn("Safety validation failed in editor:", safetyErr);
        }

    } catch (error) {
        console.error("Error saving journal:", error);
        document.getElementById('journal-status').textContent = "Error saving";
        document.getElementById('journal-status').style.color = "#ef4444";
    }
}
