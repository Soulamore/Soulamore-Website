
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
    } catch (error) {
        console.error("Error saving journal:", error);
        document.getElementById('journal-status').textContent = "Error saving";
        document.getElementById('journal-status').style.color = "#ef4444";
    }
}
