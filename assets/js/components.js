/**
 * SOULAMORE CORE COMPONENTS - v2.2
 * Last Updated: Jan 2026 (Psychologist Update)
 * --------------------------------
 * This file handles the global injection of the website's core UI shell.
 * It ensures visual consistency across all static HTML pages without duplication.
 * 
 * CORE RESPONSIBILITIES:
 * 1. Style Injection: Injects critical CSS for fixed headers and mobile menus to prevent FOUC.
 * 2. Header Injection: Generates the desktop/mobile navigation bar dynamically.
 * 3. Footer Injection: Generates the global footer with standard links.
 * 4. Active State: Highlights current page in navigation.
 * 5. Mobile Logic: Handles hamburger menu toggling and accordion dropdowns.
 * 
 * NOTE: Backup for this file exists as `components.backup.js`.
 */
// console.log("Soulamore: Components.js loading...");

// CRITICAL: Inject Styles Immediately
// CRITICAL: Inject Styles Immediately
try {
    const style = document.createElement('style');
    style.id = 'header-styles-v2'; // Changed ID to force refresh/avoid conflicts
    style.innerHTML = `
        /* DESKTOP (Width > 1150px) */
        @media (min-width: 1151px) {
            header {
                /* Let global.css island-nav handle positioning if present */
                z-index: 9999 !important;
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
                gap: 15px !important; /* Tightened from 25px for fit */
                align-items: center !important;
                visibility: visible !important; /* Ensure visibility */
                opacity: 1 !important;
            }
            .auth-box {
                display: flex !important; /* Force Auth Box Visible */
                align-items: center !important;
                gap: 12px !important; /* Slightly reduced gap */
            }
            .main-nav {
                display: flex !important;
                justify-content: space-between !important;
                align-items: center !important;
                padding: 0 !important; /* Let header handle padding */
                width: 100% !important;
                max-width: none !important; /* Remove inner max-width constraint */
                margin: 0 !important;
            }
            .nav-links i {
                color: #F49F75 !important; /* Force Peach Glow for Icons */
            }
            .nav-logo {
                flex-shrink: 0 !important; /* Critical: Prevent logo container shrinking */
                display: flex;
                align-items: center;
                margin-right: 10px !important; /* Add small breathing room */
            }
            .nav-logo img {
                height: 40px !important;
                width: auto !important;
                flex-shrink: 0 !important; /* Critical: Prevent logo img shrinking */
                object-fit: contain;
            }
            /* Button Consistency */
            .nav-btn, .lifeline-btn {
                background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05)) !important;
                border: 1px solid rgba(255,255,255,0.2) !important;
                padding: 10px 24px !important;
                border-radius: 50px !important;
                color: white !important;
                font-weight: 500 !important;
                transition: all 0.3s ease !important;
                text-decoration: none !important;
                white-space: nowrap !important; /* Prevent text wrapping */
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                height: 42px !important; /* Enforce explicit height */
                box-sizing: border-box !important;
                font-size: 0.95rem !important;
            }
            .nav-btn:hover, .lifeline-btn:hover {
                background: white !important;
                color: #0f172a !important;
                transform: translateY(-2px);
            }
            /* Specific override for Get Help to distinguish slightly if needed, or keep uniform */
            .lifeline-btn {
                border-color: rgba(239, 68, 68, 0.5) !important; /* Red tint border */
                background: rgba(239, 68, 68, 0.1) !important;
            }
            .lifeline-btn:hover {
                background: #ef4444 !important;
                color: white !important;
                border-color: #ef4444 !important;
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
            border-top: 1px solid rgba(255,255,255,0.1); /* Full Width Separator */
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
            /* Level 1: Outer Dropdown (Lightest Border) */
            .dropdown {
                position: relative !important; /* CRITICAL: Fix absolute positioning context */
            }

            .dropdown-content {
                display: none !important; /* HIDE BY DEFAULT */
                position: absolute !important; /* FIXED LAYOUT EXPLOSION */
                top: 100% !important;
                left: 0 !important;
                z-index: 1000 !important;
                background: rgba(15, 23, 42, 0.95) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                border-left: 4px solid rgba(78, 205, 196, 0.3) !important; /* Level 1: Lightest */
                backdrop-filter: blur(10px) !important;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
                min-width: 200px !important; /* Reduced width */
                width: max-content !important; /* Allow expansion */
                border-radius: 12px !important;
                padding: 8px 0 !important;
            }

            /* HOVER BRIDGE: PREVENT GAP CLOSING */
            .dropdown-content::before {
                content: "" !important;
                position: absolute !important;
                top: -10px !important; /* Bridge the gap upwards */
                left: 0 !important;
                width: 100% !important;
                height: 10px !important;
                background: transparent !important;
            }

            /* SHOW ON HOVER (Direct Child Only) */
            .dropdown:hover > .dropdown-content {
                display: block !important;
            }
            .dropdown-submenu:hover > .dropdown-content {
                 display: block !important;
            }
            
            /* Level 2: Nested Submenu (Flyout) */
            .dropdown-submenu {
                position: relative !important; /* Anchor for flyout */
            }

            .dropdown-content .dropdown-content {
                position: absolute !important;
                top: 0 !important;
                left: 100% !important;
                margin-top: -10px !important; /* Align with top */
                margin-left: 10px !important; /* THE GAP */
                box-shadow: 0 10px 30px rgba(0,0,0,0.5) !important;
                border: 1px solid rgba(255,255,255,0.1) !important;
                border-left: 1px solid rgba(255,255,255,0.1) !important; /* Reset border */
                background: rgba(15, 23, 42, 0.98) !important; /* Solid bg */
                padding-left: 0 !important; /* Reset padding */
                min-width: 200px !important;
            }

            /* HOVER BRIDGE FOR SIDE FLYOUT */
            .dropdown-content .dropdown-content::before {
                top: 0 !important;
                left: -15px !important; /* Bridge back to parent */
                width: 15px !important;
                height: 100% !important;
            }

            /* Level 3: Deep Nested */
            .dropdown-content .dropdown-content .dropdown-content {
                left: 100% !important;
                top: 0 !important;
                margin-top: -5px !important;
            }

            .dropdown-content a, .dropdown-submenu a {
                color: #e2e8f0 !important;
                display: block !important;
                margin: 2px 4px !important; /* Reduced margins */
                border-radius: 6px !important;
                padding: 6px 10px !important; /* Reduced padding */
                width: auto !important; 
                box-sizing: border-box !important;
                font-size: 0.9rem !important; /* Smaller text */
            }
            .dropdown-content a:hover, .dropdown-submenu a:hover {
                background: rgba(255,255,255,0.1) !important;
                color: #4ECDC4 !important;
            }
            
            /* Prevent Header Scattering - Only for Auth Box & Main Nav Container */
            .main-nav, .auth-box {
                flex-wrap: nowrap !important;
            }
             /* FORCE SINGLE LINE HEADER */
            .nav-links {
               flex-wrap: nowrap !important; 
               white-space: nowrap !important;
               justify-content: center !important;
            }
        }
        
        /* MOBILE GLOBAL FIXES */
        @media (max-width: 768px) {
            body { padding-bottom: 80px !important; } /* Space for FAB/Nav */
            .container { padding-left: 20px !important; padding-right: 20px !important; }
        }
    `;
    document.head.appendChild(style);
    // console.log("Soulamore: Critical styles v2 injected.");
} catch (e) {
    console.error("Soulamore: Style injection failed", e);
}


// Duplicate listener removed. Please refer to footer execution.

// --- 1. DATA CONFIGURATION ---

const NAV_DATA = [
    {
        id: 'nav-home',
        label: 'Home',
        icon: 'fas fa-home',
        href: 'index.html',
        type: 'link',
    },
    {
        id: 'nav-tools',
        label: 'Tools',
        icon: 'fas fa-toolbox',
        href: '#',
        type: 'dropdown',
        children: [
            { id: 'nav-vent', label: 'The Vent Box', href: 'tools/vent-box.html', style: 'color:var(--ember-orange);' },
            { id: 'nav-reset', label: '5-Step Reset', href: 'tools/5-step-reset.html' },
            { id: 'nav-play', label: 'Mental Playground', href: 'tools/playground.html' },
            { id: 'nav-soulbot', label: 'SoulBot AI', href: 'tools/soulbot.html' },
            { id: 'nav-confession', label: 'Confession Box', href: 'tools/confession-box/index.html' }
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
                href: 'spaces/soulamore-campus.html',
                type: 'submenu',
                children: [
                    { label: 'What is Campus?', href: 'spaces/campus/what-is-campus.html' },
                    { label: 'Ambassadors', href: 'spaces/campus/campus-ambassadors.html' },
                    { label: 'For Institutions', href: 'spaces/campus/institutions.html' },
                    { label: 'Student Resources', href: 'spaces/campus/student-resources.html' }
                ]
            },
            {
                id: 'nav-workplace',
                label: 'Soulamore Workplace',
                href: 'spaces/soulamore-workplace/index.html',
                type: 'submenu',
                children: [
                    { label: 'Plans & Pricing', href: 'spaces/soulamore-workplace/index.html#plans' },
                    { label: 'Guidelines', href: 'spaces/soulamore-workplace/index.html#guidelines' }
                ]
            },
            {
                id: 'nav-away',
                label: 'Soulamore Away',
                href: 'spaces/soulamore-away.html',
                type: 'submenu',
                children: [
                    { label: 'Away Resources', href: 'spaces/soulamore-away/resources.html' }
                ]
            }
        ]
    },
    {
        id: 'nav-community',
        label: 'Community',
        icon: 'fas fa-users',
        href: '#',
        type: 'dropdown',
        children: [
            { id: 'nav-peers', label: 'Meet Our Peers', href: 'our-peers/index.html' },
            { id: 'nav-psych', label: 'Our Psychologists', href: 'our-psychologists/psychologists.html' },
            { id: 'nav-support', label: 'Support Groups', href: 'community/support-groups.html' },
            { id: 'nav-forum', label: 'Discussion Forum', href: 'community/forum.html' },
            { id: 'nav-blogs', label: 'Blogs & Stories', href: 'community/blogs.html' },
            { id: 'nav-calendar', label: 'Community Calendar', href: 'community/community-calendar.html' }
        ]
    },
    {
        id: 'nav-join',
        label: 'Join Us',
        icon: 'fas fa-hand-holding-heart',
        href: '#',
        type: 'dropdown',
        children: [
            { id: 'nav-join-peer', label: 'Apply as Peer', href: 'join-us/peer.html' },
            { id: 'nav-join-psych', label: 'Apply as Psychologist', href: 'join-us/psychologist.html' }
        ]
    },
    {
        id: 'nav-company',
        label: 'About',
        icon: 'fas fa-building',
        href: '#',
        type: 'dropdown',
        children: [
            { id: 'nav-about', label: 'Our Story', href: 'company/about.html' },
            { id: 'nav-contact', label: 'Contact Us', href: 'company/contact.html' },
            { id: 'nav-legal', label: 'Legal & Privacy', href: 'company/legal.html' }
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
                <a href="${child.href === '#' ? '#' : rootPath + child.href}" id="${child.id || ''}" ${style}>
                    ${child.label}
                    <i class="fas fa-chevron-right" style="float: right; font-size: 0.8em; margin-top: 3px; opacity: 0.7;"></i>
                </a>
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
    <a href="${rootPath}index.html" class="nav-logo" aria-label="Soulamore Home">
        <img src="${rootPath}assets/images/logo.png" alt="Soulamore Logo" style="height: 50px; width: auto; max-width: 100%;">
    </a>

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
<div class="footer-content" style="max-width: 1200px; margin: 0 auto; padding: 60px 20px; font-family: 'Plus Jakarta Sans', sans-serif; color: #e2e8f0;">
    
    <div class="footer-grid" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:40px; text-align:left;">
        
        <!-- BRAND COLUMN -->
        <div class="footer-brand">
            <img src="${rootPath}assets/images/logo.png" alt="Soulamore Logo" style="height: 50px; margin-bottom: 20px;">
            <p style="font-size:0.9rem; opacity:0.6; line-height:1.6;">
                Your sanctuary for mental wellness. <br>
                Tech meets empathy.
            </p>
            <div class="footer-socials" style="display: flex; gap: 15px; margin-top: 20px;">
                <a href="https://www.instagram.com/soulamore_/" target="_blank" style="font-size: 1.2rem; opacity:0.8;"><i class="fab fa-instagram"></i></a>
                <a href="https://www.linkedin.com/company/soulamore/" target="_blank" style="font-size: 1.2rem; opacity:0.8;"><i class="fab fa-linkedin"></i></a>
                <a href="https://www.facebook.com/share/1LihokP4wQ/?mibextid=wwXIfr" target="_blank" style="font-size: 1.2rem; opacity:0.8;"><i class="fab fa-facebook"></i></a>
            </div>
        </div>

        <!-- TOOLS COLUMN -->
        <div class="footer-col">
            <h4 style="font-size:1rem; font-weight:700; color:white; margin-bottom:20px;">Relief Tools</h4>
            <ul style="opacity:0.8; font-size:0.9rem; display:flex; flex-direction:column; gap:10px;">
                <li><a href="${rootPath}tools/vent-box.html">The Vent Box</a></li>
                <li><a href="${rootPath}tools/5-step-reset.html">5-Step Reset</a></li>
                <li><a href="${rootPath}tools/playground.html">Mental Playground</a></li>
                <li><a href="${rootPath}tools/soulbot.html">SoulBot AI</a></li>
                <li><a href="${rootPath}tools/confession-box/index.html">Confession Box</a></li>
            </ul>
        </div>

        <!-- SPACES COLUMN -->
        <div class="footer-col">
            <h4 style="font-size:1rem; font-weight:700; color:white; margin-bottom:20px;">Community</h4>
            <ul style="opacity:0.8; font-size:0.9rem; display:flex; flex-direction:column; gap:10px;">
                <li><a href="${rootPath}spaces/soulamore-campus.html">Campus Ambassadors</a></li>
                <li><a href="${rootPath}our-peers/index.html">Meet Peers</a></li>
                <li><a href="${rootPath}community/forum.html">Discussion Forum</a></li>
                <li><a href="${rootPath}join-us/index.html">Join the Team</a></li>
            </ul>
        </div>

        <!-- COMPANY COLUMN -->
        <div class="footer-col">
            <h4 style="font-size:1rem; font-weight:700; color:white; margin-bottom:20px;">Company</h4>
            <ul style="opacity:0.8; font-size:0.9rem; display:flex; flex-direction:column; gap:10px;">
                <li><a href="${rootPath}company/about.html">Our Story</a></li>
                <li><a href="${rootPath}company/contact.html">Contact Us</a></li>
                <li><a href="${rootPath}company/legal.html">Privacy & Legal</a></li>
                <li><a href="${rootPath}get-help-now.html" style="color:var(--ember-red); font-weight:600;">Crisis Resources</a></li>
            </ul>
        </div>

    </div>

    <div class="footer-bottom" style="margin-top:50px; padding-top:20px; border-top:1px solid rgba(255,255,255,0.1); text-align:center; font-size:0.8rem; opacity:0.4;">
        © 2025 by Hashlilly! All rights reserved. <br>
        <span style="font-size:0.7rem;">Disclaimer: We are not a replacement for professional medical help.</span>
    </div>
</div>
`;


// --- 3. HELPERS ---

function getRootPath() {
    // 2-Levels Deep Check
    if (location.pathname.includes('/spaces/campus/') ||
        location.pathname.includes('/spaces/soulamore-away/') ||
        location.pathname.includes('/spaces/soulamore-workplace/') || /* ADDED LINE */
        location.pathname.includes('/our-peers/physical-wellness/') ||
        location.pathname.includes('/our-peers/academic-wellness/') ||
        location.pathname.includes('/our-peers/mental-wellness/') ||
        location.pathname.includes('/our-peers/financial-wellness/') ||
        location.pathname.includes('/tools/confession-box/')) {
        return "../../";
    }

    // 1-Level Deep Check
    if (location.pathname.includes('/spaces/') ||
        location.pathname.includes('/join-us/') ||
        location.pathname.includes('/our-peers/') ||
        location.pathname.includes('/our-psychologists/') ||
        location.pathname.includes('/tools/') ||
        location.pathname.includes('/community/') ||
        location.pathname.includes('/company/') ||
        location.pathname.includes('/auth/')) {
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

// --- FAVICON INJECTION ---
function injectFavicon() {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }

    const path = window.location.pathname;
    let iconSVG = '';

    // TEAL: #4ECDC4, PEACH: #F49F75, GOLD: #fbbf24

    if (path.includes('soulamore-workplace')) {
        // WORKPLACE (Briefcase) - Teal/Blue theme
        iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%234ECDC4" d="M128 480h256V80c0-26.5-21.5-48-48-48H176c-26.5 0-48 21.5-48 48v400zm64-400h128v32H192V80z"/><path fill="%234ECDC4" d="M32 128h448v352H32z"/></svg>`;
    } else if (path.includes('soulamore-campus')) {
        // CAMPUS (Grad Cap) - Blue/White
        iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="%234ECDC4" d="M320 32l-320 160h640L320 32z"/><path fill="%23F49F75" d="M112 256v128c0 70.7 93.1 128 208 128s208-57.3 208-128V256c-34.9 20.3-88.7 32-144 32s-109.1-11.7-144-32z"/></svg>`;
    } else if (path.includes('physical-wellness') || path.includes('renu-dogra')) {
        // PHYSICAL/RENU (Lotus/Flower) - Saffron/Orange
        iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23f59e0b" d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0 0 114.6 0 256s114.6 256 256 256zm0-48c-114.9 0-208-93.1-208-208S141.1 48 256 48s208 93.1 208 208-93.1 208-208 208z"/><circle cx="256" cy="256" r="64" fill="white"/></svg>`;
    } else {
        // DEFAULT (Simple Globe/Logo) - Teal
        iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><circle cx="256" cy="256" r="256" fill="%234ECDC4"/><path fill="%230f172a" d="M365 318c-23-14-55-19-61-12-5 5-2 37 13 58 12 18 10 32-1 32-23 0-51-38-51-38-46-63-98-35-98-35-36 12-57 32-73 52 35 34 83 55 136 55 106 0 192-86 192-192 0-35-9-68-26-96-8 30-14 62-31 76z"/></svg>`;
    }

    link.href = `data:image/svg+xml,${iconSVG}`;
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
        const handleScroll = () => {
            // Check if custom color override exists
            const scriptTag = document.querySelector('script[src*="components.js"]');
            const customColor = scriptTag ? scriptTag.getAttribute('data-header-color') : null;

            if (customColor) {
                // FORCE Custom Color
                header.style.setProperty('background', customColor, 'important');
                header.style.setProperty('box-shadow', 'none', 'important');
                header.style.setProperty('backdrop-filter', 'none', 'important');
            } else {
                // Standard Behavior
                if (window.scrollY > 50) {
                    header.style.background = 'rgba(15, 23, 42, 0.95)';
                    header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                } else {
                    header.style.background = 'rgba(15, 23, 42, 0.85)';
                    header.style.boxShadow = 'none';
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();
    }
}

// --- 4. SOULBOT WIDGET ---
function injectSoulBotWidget() {
    // 1. Avoid Double Injection
    if (document.getElementById('soulbot-widget')) return;

    // 2. Hide on SoulBot Page (it has its own full UI)
    if (window.location.pathname.includes('soulbot.html')) return;

    // Fix: Create the widget element
    const widget = document.createElement('div');
    widget.id = 'soulbot-widget';

    widget.innerHTML = `
        <style>
            #soulbot-widget-container {
                position: fixed;
                bottom: 100px;
                right: 30px;
                z-index: 9999;
                font-family: 'Plus Jakarta Sans', sans-serif;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
            }
            #soulbot-widget-fab {
                width: 60px;
                height: 60px;
                background: var(--teal-glow, #4ECDC4);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                z-index: 9999;
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 2px solid rgba(255,255,255,0.2);
            }
            #soulbot-widget-fab:hover {
                transform: scale(1.1) rotate(10deg);
                box-shadow: 0 15px 40px rgba(78, 205, 196, 0.4);
            }
            #soulbot-widget-fab i {
                color: #0f172a;
                font-size: 1.8rem;
                transition: transform 0.3s;
            }
            #soulbot-widget-fab:hover i { transform: scale(1.1); }

            #sb-window {
                width: 350px;
                height: 500px;
                background: #0f172a;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 24px;
                margin-bottom: 20px;
                display: none;
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                backdrop-filter: blur(20px);
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

            /* MOBILE TWEAKS */
            @media (max-width: 768px) {
                #soulbot-widget-container { bottom: 130px !important; right: 20px; }
                #sb-window { width: 90vw; right: 5vw; bottom: 90px; height: 60vh; }
            }
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
            <div id="soulbot-widget-fab" onclick="toggleWidget()">
                <i class="fas fa-robot"></i>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // Widget Logic using window scope to avoid redeclaration issues if re-run
    window.toggleWidget = function () {
        const win = document.getElementById('sb-window');
        const fab = document.getElementById('soulbot-widget-fab');
        if (win.style.display === 'flex') {
            win.style.display = 'none';
            fab.innerHTML = '<i class="fas fa-robot"></i>';
        } else {
            win.style.display = 'flex';
            fab.innerHTML = '<i class="fas fa-times"></i>';
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

// --- 7. INITIALIZATION (CRITICAL: MUST RUN) ---
document.addEventListener('DOMContentLoaded', () => {
    // console.log("Soulamore: Initializing...");

    // 1. Inject Components
    try { injectHeader(); } catch (e) { console.error("Header Injection Failed:", e); }
    try { injectFooter(); } catch (e) { console.error("Footer Injection Failed:", e); }
    try { injectSoulBotWidget(); } catch (e) { console.error("SoulBot Widget Failed:", e); }
    try { injectFavicon(); } catch (e) { console.error("Favicon Injection Failed:", e); }

    // 2. Set Active State
    try { setActiveState(); } catch (e) { console.warn("Active State Error:", e); }

    // 3. Initialize Interactions
    try { initializeHeaderLogic(); } catch (e) { console.warn("Header Logic Error:", e); }

    console.log("Soulamore: Initialization Complete.");
});

