console.log("Soulamore: Components.js loading...");

// CRITICAL: Inject Styles Immediately
// CRITICAL: Inject Styles Immediately
try {
    const style = document.createElement('style');
    style.id = 'header-styles-v2'; // Changed ID to force refresh/avoid conflicts
    style.innerHTML = `
        /* DESKTOP (Width > 1150px) */
        @media (min-width: 1151px) {
            header {
                z-index: 9999 !important; /* Force Header on Top */
                position: fixed !important;
                width: 100% !important;
                top: 0 !important;
            }
            .mobile-profile-card, 
            .mobile-toggle,
            .mobile-only-help { 
                display: none !important; 
            }
            .nav-links {
                display: flex !important; /* Force Desktop Flex Row */
                flex-direction: row !important;
                position: static !important;
                transform: none !important;
                background: transparent !important;
                height: auto !important;
                padding: 0 !important;
                box-shadow: none !important;
                gap: 30px !important;
                align-items: center !important;
                visibility: visible !important; /* Ensure visibility */
                opacity: 1 !important;
            }
            .auth-box {
                display: flex !important; /* Force Auth Box Visible */
                align-items: center !important;
                gap: 15px !important;
            }
            .main-nav {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                padding: 15px 40px !important;
                max-width: 1400px !important;
                margin: 0 auto !important;
            }
            .nav-logo img {
                height: 40px !important;
                width: auto !important;
            }
            /* Button Consistency */
            .nav-btn {
                background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)) !important;
                border: 1px solid rgba(255,255,255,0.2) !important;
                padding: 10px 24px !important;
                border-radius: 50px !important;
                color: white !important;
                font-weight: 500 !important;
                transition: all 0.3s ease !important;
                text-decoration: none !important;
            }
            .nav-btn:hover {
                background: white !important;
                color: #0f172a !important;
                transform: translateY(-2px);
            }
        }
        /* MOBILE (Width <= 1150px) */
        @media (max-width: 1150px) {
            .auth-box { display: none !important; }
            .mobile-only-help { display: flex !important; margin-top: 15px; background: rgba(255,107,107,0.1); padding: 10px 20px; border-radius: 12px; color: #ff6b6b; align-items: center; gap: 10px; }
            .main-nav {
                 display: flex !important;
                 justify-content: space-between !important;
                 align-items: center !important;
                 padding: 15px 20px !important;
            }
            .nav-logo img { height: 35px !important; }
            header { z-index: 9999 !important; position: fixed !important; width: 100% !important; top: 0 !important; }
        }
        /* GLOBAL FOOTER FIX */
        footer {
            position: relative;
            z-index: 100;
            background: rgba(15, 23, 42, 0.95); /* Ensure visibility */
            color: #e2e8f0;
        }
        
        /* AGGRESSIVE LINK COLOR OVERRIDES */
        /* Targets all header links and footer links */
        header a, footer a {
            color: #e2e8f0 !important;
            text-decoration: none !important;
            transition: color 0.3s ease;
        }
        header a:visited, footer a:visited {
            color: #e2e8f0 !important;
        }
        header a:hover, footer a:hover {
            color: #4ECDC4 !important;
        }
        
        /* SPECIAL EXCEPTION: Mobile Menu & Dropdowns (Dark Theme Restoration) */
        @media (max-width: 1150px) {
            .nav-links.open {
                background: rgba(15, 23, 42, 0.98) !important; /* Dark Mobile Menu */
            }
            .nav-links.open a {
                color: #e2e8f0 !important; /* Light Text */
            }
        }
        /* Dropdowns on Desktop */
        @media (min-width: 1151px) {
            .dropdown-content, .dropdown-submenu {
                background: rgba(15, 23, 42, 0.95) !important; /* Dark Glass Dropdown */
                border: 1px solid rgba(255,255,255,0.1) !important;
                border-left: 3px solid #4ECDC4 !important; /* Restore Teal Edge Highlight */
                backdrop-filter: blur(10px) !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
            }
            .dropdown-content a, .dropdown-submenu a {
                color: #e2e8f0 !important; /* Light Text */
            }
            .dropdown-content a:hover, .dropdown-submenu a:hover {
                background: rgba(255,255,255,0.05) !important;
                color: #4ECDC4 !important;
            }
            /* Prevent Header Scattering */
            .nav-links, .main-nav, .auth-box {
                flex-wrap: nowrap !important;
            }
            .nav-links a {
                white-space: nowrap !important;
            }
        }
    `;
    document.head.appendChild(style);
    console.log("Soulamore: Critical styles v2 injected.");
} catch (e) {
    console.error("Soulamore: Style injection failed", e);
}


document.addEventListener("DOMContentLoaded", () => {
    try {
        console.log("Soulamore: DOM Content Loaded, initializing...");
        injectHeader();
        injectFooter();
        injectSoulBotWidget(); // New Widget
        setActiveState();
        initializeHeaderLogic();
        console.log("Soulamore: Initialization complete.");
    } catch (error) {
        console.error("Soulamore: Critical Error during initialization:", error);
    }
});

// --- 1. DATA CONFIGURATION ---

const NAV_DATA = [
    {
        id: 'nav-home',
        label: 'Home',
        icon: 'fas fa-home',
        href: 'index.html',
        type: 'dropdown',
        children: [
            { id: 'nav-homepage', label: 'Home', href: 'index.html' },
            { id: 'nav-reset', label: '5-Step Reset', href: '5-step-reset.html' },
            { id: 'nav-play', label: 'Mental Playground', href: 'playground.html' },
            { id: 'nav-soulbot', label: 'SoulBot AI', href: 'soulbot.html' }
        ]
    },
    {
        id: 'nav-spaces',
        label: 'Spaces',
        icon: 'fas fa-rocket',
        href: '#',
        type: 'dropdown',
        children: [
            {
                id: 'nav-campus',
                label: 'Soulamore Campus',
                href: 'soulamore-campus.html',
                type: 'submenu',
                children: [
                    { label: 'What is Campus?', href: 'campus/what-is-campus.html' },
                    { label: 'Ambassadors', href: 'campus/campus-ambassadors.html' },
                    { label: 'For Institutions', href: 'campus/institutions.html' },
                    { label: 'Student FAQs', href: 'campus/student-faqs.html' },
                    {
                        label: 'Student Resources',
                        href: '#',
                        style: 'color:var(--teal-glow);',
                        type: 'submenu',
                        children: [
                            { label: 'Anxiety', href: 'campus/anxiety-and-overthinking.html' },
                            { label: 'Exams', href: 'campus/exam-pressure.html' },
                            { label: 'Loneliness', href: 'campus/loneliness.html' },
                            { label: 'Feeling Low', href: 'campus/feeling-low.html' }
                        ]
                    },
                    { label: 'Boundaries', href: 'campus/safety-boundaries.html' }
                ]
            },
            {
                id: 'nav-away',
                label: 'Soulamore Away',
                href: 'soulamore-away.html',
                type: 'submenu',
                children: [
                    { label: 'Overview', href: 'soulamore-away.html' },
                    { label: "Who It's For", href: 'soulamore-away/who-its-for.html' },
                    { label: 'Away Resources', href: 'soulamore-away/resources.html' }
                ]
            },
            { id: 'nav-peers', label: 'Meet Our Peers', href: 'our-peers/index.html' }
        ]
    },
    {
        id: 'nav-wellness',
        label: 'Wellness',
        icon: 'fas fa-heart-pulse',
        href: '#',
        type: 'dropdown',
        children: [
            {
                id: 'nav-confession',
                label: 'Confession Box',
                href: 'confession-box.html',
                type: 'submenu',
                children: [
                    { label: 'Guidelines', href: 'confession-box/guidelines.html' }
                ]
            },
            { id: 'nav-vent', label: 'The Vent Box', href: 'vent-box.html' },
            { id: 'nav-support', label: 'Support Groups', href: 'support-groups.html' },
            { id: 'nav-calendar', label: 'Community Calendar', href: 'community-calendar.html' }
        ]
    },
    {
        id: 'nav-community',
        label: 'Community',
        icon: 'fas fa-users',
        href: '#',
        type: 'dropdown',
        children: [
            {
                id: 'nav-join',
                label: 'Join Us',
                href: 'join-us/index.html',
                type: 'submenu',
                children: [
                    { label: 'Apply as Peer', href: 'join-us/peer.html' },
                    { label: 'Apply as Psychologist', href: 'join-us/psychologist.html' }
                ]
            },
            { id: 'nav-blogs', label: 'Blogs & Stories', href: 'blogs.html' },
            { id: 'nav-forum', label: 'Discussion Forum', href: 'forum.html' }
        ]
    },
    {
        id: 'nav-company',
        label: 'About',
        icon: 'fas fa-building',
        href: '#',
        type: 'dropdown',
        children: [
            { id: 'nav-about', label: 'Our Story', href: 'about.html' },
            { id: 'nav-contact', label: 'Contact Us', href: 'contact.html' },
            { id: 'nav-privacy', label: 'Privacy Policy', href: 'privacy-policy.html' },
            { id: 'nav-legal', label: 'Legal', href: 'legal.html' }
        ]
    }
];

// --- 2. HTML GENERATOR ---

function generateNavHTML(rootPath) {
    let html = '';

    NAV_DATA.forEach(item => {
        if (item.type === 'link') {
            // Standard Link
            html += `<a href="${rootPath}${item.href}" id="${item.id || ''}"><i class="${item.icon}"></i>${item.label}</a>`;
        } else if (item.type === 'dropdown') {
            // First-level Dropdown
            html += `
            <div class="dropdown">
                <a href="${item.href === '#' ? '#' : rootPath + item.href}" id="${item.id || ''}">
                    <i class="${item.icon}"></i>${item.label}
                    <i class="fas fa-chevron-down" style="font-size:0.8em; margin-left:auto;"></i>
                </a>
                <div class="dropdown-content">
                    ${generateSubmenuHTML(item.children, rootPath)}
                </div>
            </div>`;
        }
    });

    // Mobile-Only Help Link (Appended at the end of nav-links)
    html += `<a href="${rootPath}get-help-now.html" class="mobile-only-help" style="display:none; margin-top:10px;"><i class="fas fa-life-ring"></i> Get Help Now</a>`;

    return html;
}

function generateSubmenuHTML(children, rootPath) {
    let html = '';
    children.forEach(child => {
        if (child.type === 'submenu') {
            // Nested Dropdown (Submenu)
            const style = child.style ? `style="${child.style}"` : '';
            html += `
            <div class="dropdown-submenu">
                <a href="${child.href === '#' ? '#' : rootPath + child.href}" id="${child.id || ''}" ${style}>${child.label}</a>
                <div class="dropdown-content">
                    ${generateSubmenuHTML(child.children, rootPath)}
                </div>
            </div>`;
        } else {
            // Standard Sub-Link
            const style = child.style ? `style="${child.style}"` : '';
            html += `<a href="${rootPath}${child.href}" id="${child.id || ''}" ${style}>${child.label}</a>`;
        }
    });
    return html;
}

const getHeaderHTML = (rootPath) => `
<div class="main-nav">
    <a href="${rootPath}index.html" class="nav-logo"><img src="${rootPath}assets/images/logo.png" alt="Soulamore Logo"></a>

    <nav class="nav-links">
        
        <!-- MOBILE PROFILE CARD (Visible < 1150px) -->
        <div class="mobile-profile-card" style="display: none;">
            <div class="mp-avatar"><i class="fas fa-ghost"></i></div>
            <div class="mp-info">
                <span class="mp-name">Welcome, Friend</span>
                <span class="mp-status">Guest</span>
                <a href="${rootPath}login.html" class="mp-btn">Log In</a>
            </div>
        </div>

        <!-- GENERATED NAVIGATION ITEMS -->
        ${generateNavHTML(rootPath)}

    </nav>

    <!-- Auth Group -->
    <div class="auth-box">
            <a href="${rootPath}get-help-now.html" id="nav-crisis" class="lifeline-btn"><i class="fas fa-life-ring"></i> Get Help</a>
            <a href="#" class="user-icon-btn"><i class="fas fa-ghost"></i></a>
            <a href="${rootPath}login.html" class="nav-btn">Log In / Sign Up</a>
    </div>
    
    <button class="mobile-toggle" aria-label="Toggle Navigation">
        <i class="fas fa-bars"></i>
    </button>
</div>
`;

const getFooterHTML = (rootPath) => `
<div class="footer-content" style="max-width: 1200px; margin: 0 auto; padding: 40px 20px; color: #e2e8f0; font-family: 'Plus Jakarta Sans', sans-serif;">
    <div style="display: flex; flex-wrap: wrap; justify-content: space-between; gap: 40px;">
        
        <!-- Brand Column -->
        <div style="flex: 1; min-width: 250px;">
             <div class="footer-logo" style="margin-bottom: 20px;">
                <img src="${rootPath}assets/images/logo.png" alt="Soulamore Logo" style="height: 50px;">
            </div>
            <p style="font-size:1rem; opacity:0.8; line-height: 1.6; margin-bottom: 20px;">Your Partner in Mental Wellness.</p>
            <div class="footer-socials" style="display: flex; gap: 15px;">
                <a href="https://www.instagram.com/soulamore_/" target="_blank" style="font-size: 1.2rem; color: #e2e8f0 !important;"><i class="fab fa-instagram"></i></a>
                <a href="https://www.linkedin.com/company/soulamore/" target="_blank" style="font-size: 1.2rem; color: #e2e8f0 !important;"><i class="fab fa-linkedin"></i></a>
                <a href="https://www.facebook.com/share/1LihokP4wQ/?mibextid=wwXIfr" target="_blank" style="font-size: 1.2rem; color: #e2e8f0 !important;"><i class="fab fa-facebook"></i></a>
            </div>
        </div>

        <!-- Links Column 1 -->
        <div style="min-width: 150px;">
            <h4 style="color:white; margin-bottom: 20px; font-family:'Outfit', sans-serif;">Explore</h4>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <a href="${rootPath}index.html" style="color: #e2e8f0 !important; text-decoration: none;">Home</a>
                <a href="${rootPath}about.html" style="color: #e2e8f0 !important; text-decoration: none;">About Us</a>
                <a href="${rootPath}soulbot.html" style="color: #e2e8f0 !important; text-decoration: none;">SoulBot AI</a>
                <a href="${rootPath}playground.html" style="color: #e2e8f0 !important; text-decoration: none;">Mental Playground</a>
            </div>
        </div>

        <!-- Links Column 2 -->
        <div style="min-width: 150px;">
             <h4 style="color:white; margin-bottom: 20px; font-family:'Outfit', sans-serif;">Support</h4>
            <div style="display: flex; flex-direction: column; gap: 10px;">
                <a href="${rootPath}contact.html" style="color: #e2e8f0 !important; text-decoration: none;">Contact</a>
                <a href="${rootPath}privacy.html" style="color: #e2e8f0 !important; text-decoration: none;">Privacy Policy</a>
                <a href="${rootPath}terms.html" style="color: #e2e8f0 !important; text-decoration: none;">Terms of Service</a>
                <a href="${rootPath}get-help-now.html" style="color: #e2e8f0 !important; text-decoration: none;">Get Help</a>
            </div>
        </div>
    </div>

    <div style="border-top: 1px solid rgba(255,255,255,0.1); margin-top: 40px; padding-top: 20px; text-align: center; font-size: 0.85rem; opacity: 0.6;">
        <p style="margin-bottom: 10px;">Disclaimer: Online therapy is not advisable if you are in acute distress. Please contact your nearest hospital if you are feeling suicidal or at risk of self-harm.</p>
        <p>&copy; 2026 by Hashlilly! All rights reserved.</p>
    </div>
</div>
`;

// --- 3. HELPERS ---

function getRootPath() {
    if (location.pathname.includes('/campus/') ||
        location.pathname.includes('/join-us/') ||
        location.pathname.includes('/our-peers/') ||
        location.pathname.includes('/soulamore-away/') ||
        location.pathname.includes('/confession-box/')) {
        return "../";
    }
    return "";
}

// --- 4. INJECTION LOGIC ---

function injectHeader() {
    let headerElement = document.querySelector('header');

    // 1. Auto-Create Header if Missing (Robustness)
    if (!headerElement) {
        console.log("Soulamore: No <header> found, creating one...");
        headerElement = document.createElement('header');
        document.body.prepend(headerElement);
    } else {
        // Ensure it's the first element if it exists but is misplaced
        if (headerElement.parentElement !== document.body) {
            document.body.prepend(headerElement);
        }
    }

    if (headerElement) {
        headerElement.classList.add('island-nav');

        // THEMING
        const scriptTag = document.querySelector('script[src*="components.js"]');
        if (scriptTag) {
            const customColor = scriptTag.getAttribute('data-header-color');
            if (customColor) {
                headerElement.style.setProperty('background', customColor, 'important');
                headerElement.style.setProperty('backdrop-filter', 'none', 'important');
                headerElement.style.setProperty('box-shadow', 'none', 'important');
                headerElement.style.setProperty('border', 'none', 'important');
            }
        }
        headerElement.innerHTML = getHeaderHTML(getRootPath());

        // --- CRITICAL CSS INJECTION ---
        // We inject this style to ensure consistency without relying on complex external CSS media queries alone
        if (!document.getElementById('header-responsive-style')) {
            const style = document.createElement('style');
            style.id = 'header-responsive-style';
            style.innerHTML = `
                @media (min-width: 1151px) {
                    .mobile-profile-card, 
                    .mobile-toggle,
                    .mobile-only-help { 
                        display: none !important; 
                    }
                }
                @media (max-width: 1150px) {
                    .auth-box { display: none !important; }
                    .mobile-only-help { display: flex !important; margin-top: 15px; background: rgba(255,107,107,0.1); padding: 10px 20px; border-radius: 12px; color: #ff6b6b; align-items: center; gap: 10px; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

function injectFooter() {
    const footerElement = document.querySelector('footer');
    if (footerElement) {
        footerElement.innerHTML = getFooterHTML(getRootPath());
    }
}

// --- 5. ACTIVE STATE LOGIC ---

function setActiveState() {
    const path = window.location.pathname;

    // Auto-detect active state from NAV_DATA
    // This is a simple check. For improved accuracy, we can map IDs manually if needed, 
    // but checking href includes path is usually robust enough for static sites.

    // Helper to find match
    const findMatch = (items) => {
        for (const item of items) {
            // Check direct link
            if (item.href && item.href !== '#' && path.includes(item.href)) {
                document.getElementById(item.id)?.classList.add('active');
                return true;
            }
            // Check children
            if (item.children) {
                if (findMatch(item.children)) {
                    // If child active, activate parent too
                    document.getElementById(item.id)?.classList.add('active');
                    return true;
                }
            }
        }
        return false;
    };

    findMatch(NAV_DATA);
}

// --- 6. INTERACTION LOGIC ---

function initializeHeaderLogic() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');

    // A. Mobile Sidebar Toggle
    if (toggleBtn && navLinks) {
        // Remove old listeners to prevent duplicates if re-initialized
        const newBtn = toggleBtn.cloneNode(true);
        toggleBtn.parentNode.replaceChild(newBtn, toggleBtn);

        newBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent immediate bubbling
            const isOpen = navLinks.classList.contains('open');

            if (isOpen) {
                // CLOSE
                navLinks.classList.remove('open');
                document.body.classList.remove('no-scroll');
                newBtn.classList.remove('active');
                const icon = newBtn.querySelector('i');
                if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
            } else {
                // OPEN
                navLinks.classList.add('open');
                document.body.classList.add('no-scroll');
                newBtn.classList.add('active');
                const icon = newBtn.querySelector('i');
                if (icon) { icon.classList.remove('fa-bars'); icon.classList.add('fa-times'); }
            }
        });

        // Close on Link Click (except dropdowns)
        navLinks.querySelectorAll('a').forEach(link => {
            // If it has a next sibling that is a dropdown-content, it's a toggle, not a direct link
            if (link.nextElementSibling && link.nextElementSibling.classList.contains('dropdown-content')) return;

            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                document.body.classList.remove('no-scroll');
                // Reset Icon
                const icon = newBtn.querySelector('i');
                if (icon) { icon.classList.remove('fa-times'); icon.classList.add('fa-bars'); }
                newBtn.classList.remove('active');
            });
        });
    }

    // B. Mobile Accordion Logic (Dropdowns)
    const dropdownToggles = document.querySelectorAll('.dropdown > a, .dropdown-submenu > a');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Only hijacking if in mobile view OR if it's a null link (#)
            if (window.innerWidth <= 1150 || toggle.getAttribute('href') === '#' || toggle.getAttribute('href').endsWith('#')) {
                // Prevent default navigation
                if (toggle.getAttribute('href') === '#' || window.innerWidth <= 1150) {
                    e.preventDefault();
                    e.stopPropagation();
                }

                const parent = toggle.parentElement;

                // Toggle expansion
                if (parent.classList.contains('active')) {
                    parent.classList.remove('active');
                } else {
                    // Optional: Close siblings? No, let them stack.
                    parent.classList.add('active');
                }

                // Icon rotation (if exists)
                const icon = toggle.querySelector('.fa-chevron-down');
                if (icon) {
                    icon.style.transform = parent.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
                }
            }
        });
    });

    // C. Scroll Glass Effect
    if (header) {
        window.addEventListener('scroll', () => {
            // Check if custom color override exists
            const scriptTag = document.querySelector('script[src*="components.js"]');
            const customColor = scriptTag ? scriptTag.getAttribute('data-header-color') : null;

            if (!customColor) {
                if (window.scrollY > 50) {
                    header.style.background = 'rgba(15, 23, 42, 0.95)';
                    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                } else {
                    header.style.background = 'rgba(15, 23, 42, 0.85)';
                    header.style.boxShadow = 'none';
                }
            }
        });
    }
}

// --- 4. SOULBOT WIDGET ---
function injectSoulBotWidget() {
    // 1. Avoid Double Injection
    if (document.getElementById('soulbot-widget')) return;

    // 2. Hide on SoulBot Page (it has its own full UI)
    if (window.location.pathname.includes('soulbot.html')) return;

    const widget = document.createElement('div');
    widget.id = 'soulbot-widget';
    widget.innerHTML = `
        <style>
            #soulbot-widget-container {
                position: fixed;
                bottom: 100px; /* Moved up to avoid Audio Control overlap */
                right: 30px;
                z-index: 9999;
                font-family: 'Plus Jakarta Sans', sans-serif;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }
            #sb-bubble {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #4ECDC4, #2dd4bf);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 10px 30px rgba(78, 205, 196, 0.4);
                transition: transform 0.3s;
                color: #0f172a;
                font-size: 1.5rem;
            }
            #sb-bubble:hover { transform: scale(1.1); }
            #sb-window {
                width: 350px;
                height: 500px;
                background: #0f172a;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 20px;
                margin-bottom: 20px;
                display: none; /* Hidden by default */
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 20px 50px rgba(0,0,0,0.5);
                animation: slideUp 0.3s ease-out;
            }
            @keyframes slideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
            
            .sb-header { background: rgba(30, 41, 59, 0.9); padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
            .sb-body { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: rgba(15, 23, 42, 0.95); }
            .sb-footer { padding: 15px; background: rgba(30, 41, 59, 0.9); display: flex; gap: 10px; }
            .sb-input { flex: 1; background: rgba(255,255,255,0.05); border: none; padding: 10px 15px; border-radius: 20px; color: white; outline: none; }
            .sb-send { background: #4ECDC4; color: #0f172a; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            
            .sb-msg { max-width: 80%; padding: 8px 12px; border-radius: 12px; font-size: 0.9rem; }
            .sb-msg-bot { background: rgba(255,255,255,0.05); align-self: flex-start; color: #e2e8f0; }
            .sb-msg-user { background: #2dd4bf; align-self: flex-end; color: #0f172a; }
        </style>
        
        <div id="soulbot-widget-container">
            <div id="sb-window">
                <div class="sb-header">
                    <span style="font-weight:700; color:white;"><i class="fas fa-robot" style="color:#4ECDC4;"></i> SoulBot</span>
                    <i class="fas fa-expand-alt" style="cursor:pointer; color: #94a3b8;" title="Full Screen" onclick="window.location.href='soulbot.html'"></i>
                </div>
                <div class="sb-body" id="sb-chat-body">
                    <div class="sb-msg sb-msg-bot">Hi there. I'm here if you need to untangle a thought.</div>
                </div>
                <div class="sb-footer">
                    <input type="text" class="sb-input" id="sb-input" placeholder="Type here..." onkeypress="handleWidgetEnter(event)">
                    <button class="sb-send" onclick="sendWidgetMessage()"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <div id="sb-bubble" onclick="toggleWidget()">
                <i class="fas fa-robot"></i>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // Widget Logic using window scope to avoid redeclaration issues if re-run
    window.toggleWidget = function () {
        const win = document.getElementById('sb-window');
        const bubble = document.getElementById('sb-bubble');
        if (win.style.display === 'flex') {
            win.style.display = 'none';
            bubble.innerHTML = '<i class="fas fa-robot"></i>';
        } else {
            win.style.display = 'flex';
            bubble.innerHTML = '<i class="fas fa-times"></i>';
            document.getElementById('sb-input').focus();
        }
    };

    window.handleWidgetEnter = function (e) {
        if (e.key === 'Enter') sendWidgetMessage();
    };

    window.sendWidgetMessage = function () {
        const input = document.getElementById('sb-input');
        const text = input.value.trim();
        if (!text) return;

        // Add User Msg
        appendWidgetMsg(text, 'user');
        input.value = '';

        // Simulate Bot Response (Simple Echo for now, full logic is on main page)
        // In a real app, we would hit the API here too. 
        // For now, redirect users to full experience for deep chat.
        setTimeout(() => {
            appendWidgetMsg("I'm listening. For a deeper conversation, let's go to my full quiet space.", 'bot');
            setTimeout(() => {
                if (confirm("Would you like to move to the full SoulBot experience?")) {
                    window.location.href = 'soulbot.html';
                }
            }, 1000);
        }, 800);
    };

    function appendWidgetMsg(text, sender) {
        const body = document.getElementById('sb-chat-body');
        const div = document.createElement('div');
        div.className = `sb-msg sb-msg-${sender}`;
        div.innerText = text;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }
}


