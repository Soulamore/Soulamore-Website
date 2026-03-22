
import { auth, db } from "./firebase-config.js";
import { doc, setDoc, addDoc, getDoc, collection, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getUserRole } from "./role-helper.js";

let quill;
let currentBlogId = null;
let saveTimeout;

// Initialize Editor when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    // Wait for auth to confirm user before loading data
    setTimeout(initBlogEditor, 1000);
});

window.openBlogEditor = function (blogId = null) {
    currentBlogId = blogId; // If null, new post

    // Switch to view
    window.switchView('blogs-editor', document.getElementById('nav-link-blogs'));

    // Reset or Load
    if (currentBlogId) {
        loadBlog(currentBlogId);
    } else {
        resetEditor();
    }
}

function initBlogEditor() {
    const container = document.getElementById('blog-editor-container');
    if (!container) return;

    // Initialize Quill (Standard Theme for Blogs - more tools)
    quill = new Quill('#blog-editor-content', {
        theme: 'snow',
        placeholder: 'Tell your story...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                ['blockquote', 'code-block'],
                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                ['link', 'image'],
                ['clean']
            ]
        }
    });
}

function resetEditor() {
    document.getElementById('blog-title').value = "";
    document.getElementById('blog-category').value = "General";
    quill.setText("");
    currentBlogId = null;
}

async function loadBlog(id) {
    // TODO: Implement loading existing blog
    console.log("Loading blog...", id);
}

window.saveBlog = async function (status = 'draft') {
    const user = auth.currentUser;
    if (!user) return alert("You must be logged in.");

    const title = document.getElementById('blog-title').value;
    const category = document.getElementById('blog-category').value;
    const content = quill.getContents();
    const plainText = quill.getText();
    const role = await getUserRole(user.uid);

    if (!title) return alert("Please add a title.");

    const blogData = {
        authorId: user.uid,
        authorName: user.displayName || "Anonymous",
        authorRole: role, // 'peer' or 'psychologist'
        title: title,
        category: category,
        content: content,
        snippet: plainText.substring(0, 150) + "...",
        status: status, // 'draft' or 'published'
        updatedAt: serverTimestamp()
    };

    try {
        if (currentBlogId) {
            // Update
            await setDoc(doc(db, "blogs", currentBlogId), blogData, { merge: true });
        } else {
            // Create New
            const docRef = await addDoc(collection(db, "blogs"), {
                ...blogData,
                createdAt: serverTimestamp()
            });
            currentBlogId = docRef.id;
        }

        alert(status === 'published' ? "Blog Published!" : "Draft Saved.");
        if (status === 'published') {
            window.switchView('blogs', document.getElementById('nav-link-blogs'));
        }
    } catch (error) {
        console.error("Error saving blog:", error);
        alert("Error saving blog. Check console.");
    }
}
