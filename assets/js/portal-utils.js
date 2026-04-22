/**
 * SOULAMORE PORTAL UTILITIES
 * Consolidated logic for User, Peer, and Psych Dashboards.
 */

// 1. Navigation & View Switching
window.switchView = function(viewId, linkElement) {
    console.log("Switching to dashboard view:", viewId);

    // Hide all view sections
    document.querySelectorAll('.view-section').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active');
        el.style.pointerEvents = 'none';
    });

    // Deactivate all sidebar links
    document.querySelectorAll('.side-link').forEach(el => el.classList.remove('active'));

    // Show target view
    const target = document.getElementById('view-' + viewId);
    if (target) {
        target.style.display = 'flex';
        target.classList.add('active');
        target.style.pointerEvents = 'auto';
        
        // Reset scroll position
        const main = document.querySelector('.main-content');
        if (main) main.scrollTop = 0;
    } else {
        console.warn("View not found:", viewId);
    }

    // Activate the clicked link
    if (linkElement) {
        linkElement.classList.add('active');
    }

    // Handle Mobile: Close sidebar after selection
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('active')) {
        window.toggleSidebar();
    }
};

// 2. Sidebar Management (Mobile)
window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('mobileToggleButton');
    const overlay = document.getElementById('sidebar-overlay');
    
    if (sidebar) sidebar.classList.toggle('active');
    if (toggle) toggle.classList.toggle('active');
    if (overlay) overlay.classList.toggle('active');
};

// 3. Tool Modal Hooks
window.openTool = function(url, title) {
    const modal = document.getElementById('toolModal');
    const frame = document.getElementById('toolFrame');
    const titleEl = document.getElementById('modalTitle');

    if (modal && frame && titleEl) {
        frame.src = url;
        titleEl.textContent = title || 'Tool';
        modal.style.display = 'flex';
        modal.classList.add('active');
    } else {
        window.open(url, '_blank');
    }
};

window.closeTool = function() {
    const modal = document.getElementById('toolModal');
    const frame = document.getElementById('toolFrame');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
    if (frame) frame.src = '';
};

// 4. Interface Theme (Dashboard Specific Sync)
window.setPortalTheme = function(mode) {
    if (mode === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
    
    // Sync with global theme switcher icon if present
    if (typeof window.syncThemeIcons === 'function') {
        window.syncThemeIcons();
    }
};

// 5. Profile Image Upload
window.togglePhotoModal = function(show) {
    const modal = document.getElementById('photo-upload-modal');
    if (modal) modal.style.display = show ? 'flex' : 'none';
};

window.handleFileSelect = function(input) {
    if (input.files && input.files[0]) {
        window.updateProfileImage(input.files[0]);
    }
};

window.updateProfileImage = function(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
        const avatars = document.querySelectorAll('.profile-avatar-img');
        avatars.forEach(img => {
            img.src = e.target.result;
            img.style.display = 'block';
        });
        const textAvatars = document.querySelectorAll('.profile-avatar-text');
        textAvatars.forEach(el => el.style.display = 'none');
        window.togglePhotoModal(false);
    };
    reader.readAsDataURL(file);
};

// 6. Tools Menu (Floating Menu)
window.toggleToolsMenu = function() {
    const menu = document.getElementById('tools-menu');
    if (menu) {
        menu.classList.toggle('active');
    }
};

// 7. Initialize Dashboard Features
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Sidebar Toggle
    const toggle = document.getElementById('mobileToggleButton');
    if (toggle) {
        toggle.addEventListener('click', window.toggleSidebar);
    }
    
    // Tools Menu Overlay Click (Close menu if clicking outside)
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('tools-menu');
        const fab = document.getElementById('tools-fab');
        if (menu && menu.style.right === '0px' && !menu.contains(e.target) && !fab.contains(e.target)) {
            window.toggleToolsMenu();
        }
    });
});

// 8. Practitioner Status Dropdown
window.toggleStatusMenu = function(controlId) {
    const control = document.getElementById(controlId);
    if (!control) return;
    const isOpen = control.classList.contains('open');
    // Close all open status controls first
    document.querySelectorAll('.practitioner-status.open').forEach(c => c.classList.remove('open'));
    if (!isOpen) control.classList.add('open');
};

window.setStatus = function(controlId, status, label) {
    const control = document.getElementById(controlId);
    if (!control) return;
    const btn = control.querySelector('.status-dropdown-btn');
    if (btn) {
        btn.setAttribute('data-status', status);
        const labelEl = btn.querySelector('.status-label');
        if (labelEl) labelEl.textContent = label;
    }
    control.classList.remove('open');
};

// Close status dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.practitioner-status')) {
        document.querySelectorAll('.practitioner-status.open').forEach(c => c.classList.remove('open'));
    }
});

// 9. Initial Password Generator
/**
 * Generates a consistent but secure temporary password based on user name and email.
 * Pattern: Name(3) + @ + Random(4) + Email(2)
 * Example: Aditya, aditya@example.com -> ADI@4821ad
 * @param {string} fullName 
 * @param {string} email 
 * @returns {string} The generated password
 */
window.generateInitialPassword = function(fullName, email) {
    if (!fullName || !email) return "Soulamore@2026"; // Fallback
    
    // 1. First 3 letters of name (Uppercase)
    const namePart = (fullName.trim() || 'USER').slice(0, 3).toUpperCase();
    
    // 2. Random 4 digits
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    
    // 3. First 2 letters of email (Lowercase)
    const emailPart = (email.trim().toLowerCase().split('@')[0] || 'sm').slice(0, 2);
    
    // 4. Combine
    const generated = `${namePart}@${randomPart}${emailPart}`;
    console.log("Generated Initial Password:", generated);
    return generated;
};

// ========================================
// 5. GLOBAL LOGOUT FUNCTION
// Standardized logout for all dashboards
// ========================================
window.handleLogout = async function() {
    if (!confirm('Are you sure you want to log out?')) return;

    console.log('🚪 Logging out...');

    try {
        const { logoutUser } = await import('./auth-service.js');
        await logoutUser();
        console.log('✅ Logout successful');
    } catch (err) {
        console.error('❌ Logout error:', err);
        // Emergency Fallback
        localStorage.removeItem('soulamore_session');
        sessionStorage.clear();
        window.location.href = 'logged-out.html';
    }
};

console.log('✅ Portal Utilities Loaded (with global handleLogout)');
