/**
 * Authentication Handler
 * Manages user authentication state and UI updates
 */

import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { createOrUpdateUserProfile } from "./profile-handler.js";

// Initialize auth state
let currentUser = null;

// Listen for auth state changes
onAuthStateChanged(auth, async (user) => {
    currentUser = user;
    updateAuthUI(user);
    
    // Store user info in sessionStorage and create/update profile
    if (user) {
        // Create or update user profile in Firestore
        await createOrUpdateUserProfile(user);
        
        sessionStorage.setItem('user', JSON.stringify({
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL
        }));
    } else {
        sessionStorage.removeItem('user');
    }
});

// Update UI based on auth state
function updateAuthUI(user) {
    // Wait a bit for header to be rendered
    setTimeout(() => {
        // Update login/signup button
        const loginBtn = document.querySelector('.nav-btn, a[href*="login.html"]');
        const userIconBtn = document.querySelector('.user-icon-btn');
        
        if (user) {
            // User is logged in
            if (loginBtn) {
                loginBtn.textContent = user.displayName || 'Account';
                loginBtn.href = '#';
                loginBtn.onclick = (e) => {
                    e.preventDefault();
                    showUserMenu(user);
                };
            }
            
            // Update user icon
            if (userIconBtn) {
                if (user.photoURL) {
                    userIconBtn.innerHTML = `<img src="${user.photoURL}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover;" alt="User">`;
                } else {
                    userIconBtn.innerHTML = '<i class="fas fa-user-circle"></i>';
                }
                // Make icon clickable to go to profile
                userIconBtn.href = 'profile.html';
                userIconBtn.onclick = null;
            }
        } else {
            // User is not logged in
            if (loginBtn) {
                loginBtn.textContent = 'Log In / Sign Up';
                // Fix path based on current location
                const isAuthPage = window.location.pathname.includes('/auth/');
                loginBtn.href = isAuthPage ? 'login.html' : 'auth/login.html';
                loginBtn.onclick = null;
            }
            
            if (userIconBtn) {
                userIconBtn.innerHTML = '<i class="fas fa-ghost"></i>';
            }
        }
    }, 100);
}

// Show user menu dropdown
function showUserMenu(user) {
    // Remove existing menu if any
    const existingMenu = document.getElementById('userMenu');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    // Create menu
    const menu = document.createElement('div');
    menu.id = 'userMenu';
    menu.style.cssText = `
        position: absolute;
        top: 60px;
        right: 20px;
        background: rgba(30, 41, 59, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        padding: 15px;
        min-width: 200px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 1000;
        backdrop-filter: blur(10px);
    `;
    
        menu.innerHTML = `
        <div style="padding: 10px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 10px;">
            <div style="font-weight: 600; color: white;">${user.displayName || 'User'}</div>
            <div style="font-size: 0.85rem; opacity: 0.7; color: #e2e8f0;">${user.email}</div>
        </div>
        <a href="profile.html" style="
            display: block;
            width: 100%;
            padding: 10px;
            background: rgba(78, 205, 196, 0.1);
            border: 1px solid rgba(78, 205, 196, 0.3);
            border-radius: 8px;
            color: #4ECDC4;
            text-decoration: none;
            text-align: center;
            font-weight: 500;
            margin-bottom: 10px;
            transition: 0.2s;
        ">View Profile</a>
        <button id="logoutBtn" style="
            width: 100%;
            padding: 10px;
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            color: #fca5a5;
            cursor: pointer;
            font-weight: 500;
            transition: 0.2s;
        ">Sign Out</button>
    `;
    
    document.body.appendChild(menu);
    
    // Handle logout
    document.getElementById('logoutBtn').addEventListener('click', async () => {
        try {
            await signOut(auth);
            menu.remove();
            window.location.reload();
        } catch (error) {
            console.error('Error signing out:', error);
            alert('Failed to sign out: ' + error.message);
        }
    });
    
    // Close menu when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!menu.contains(e.target) && !e.target.closest('.nav-btn')) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 100);
}

// Export functions
export { currentUser, updateAuthUI };

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Check sessionStorage for user info
        const storedUser = sessionStorage.getItem('user');
        if (storedUser && !currentUser) {
            try {
                const userData = JSON.parse(storedUser);
                updateAuthUI(userData);
            } catch (e) {
                console.error('Error parsing stored user:', e);
            }
        }
    });
} else {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser && !currentUser) {
        try {
            const userData = JSON.parse(storedUser);
            updateAuthUI(userData);
        } catch (e) {
            console.error('Error parsing stored user:', e);
        }
    }
}

