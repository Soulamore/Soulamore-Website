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
                border-radius: 50px !important;
                color: white !important;
                font-weight: 500 !important;
                transition: all 0.3s ease !important;
                text-decoration: none !important;
                white-space: nowrap !important; /* Prevent text wrapping */
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                box-sizing: border-box !important;
            }
            .nav-btn {
                 padding: 0 20px !important; /* Generous padding for Log In */
                 height: 42px !important;
                 font-size: 0.95rem !important;
                 flex-shrink: 0 !important; /* NEVER SHRINK */
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
                padding: 0 8px !important; /* SUPER COMPACT PADDING */
                height: 42px !important; /* UNIFIED HEIGHT (Matches Log In) */
                font-size: 0.8rem !important; /* COMPACT FONT */
                justify-content: center !important;
                flex-shrink: 0 !important;
                width: fit-content !important; /* FORCE COMPACT WIDTH */
                min-width: 0 !important; /* PREVENT MIN-WIDTH DEFAULTS */
                flex-grow: 0 !important; /* PREVENT GROWING */
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

// --- FAVICON MANAGER (Peach Branding) ---
function setupFavicon(rootPath) {
    let link = document.querySelector("link[rel~='icon']");
    if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
    }

    const PEACH = '%23F49F75'; // #F49F75 encoded
    const path = window.location.pathname;

    // Default Logo (Use Symbol to avoid squeezing)
    let iconHref = rootPath + 'assets/images/favicon_symbol.png';

    // Special Pages (SVG Data URIs)
    if (path.includes('vent-box')) {
        // Fire Icon
        iconHref = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='${PEACH}' d='M200.3 66.8c12.3-15.8 35.1-15.9 47.6-.2l13.9 17.5c18.5 23.3 54 26.3 76.2 6.5l8.7-7.8c16.3-14.5 41.8-10.7 53.6 7.9 23.3 36.6 63 94.7 44.8 169.3-18.4 75.3-69.8 126.8-132.8 135-66.2 8.6-130.6-32.9-158.7-98.3-25.1-58.4-14.8-119.3 12.3-162.7 10.3-16.5 23-32.1 35.3-48.4zm-14.9 378.6c59.9 8.6 117.9-20.9 146-69.5 26.6-45.9 22.9-106.3-8.8-149.7-8.1-11.1-12.7-22.3-13.6-33.1-6.1 4.5-12.6 8.5-19.4 11.7-29.3 13.7-65 4.9-88.7-19.8-5-5.2-9.6-10.8-13.8-16.9-15.6 27.6-26.6 57.1-32.3 87.7-6.1 33.1.6 66.9 17.5 95.8 19.3 33 55.4 69.4 113.1 93.8z'/></svg>`;
    } else if (path.includes('confession-box')) {
        // Ghost Icon
        iconHref = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='${PEACH}' d='M256 96c31.1 0 61.2 6.7 88.5 19.1 27.3 12.4 51.6 29.8 70.8 50.8 19.2 21 33.5 45.4 42.1 72.1 8.6 26.7 10.6 55 6.1 82.8-5.3 32.8-21.6 62.7-45.1 85.5-23.5 22.7-53.9 36.3-86.3 38.3-1.6.1-3.2.1-4.8.1-18.4 0-36.2-3.8-52.6-10.7-16.3 6.9-34.1 10.7-52.6 10.7-1.6 0-3.3 0-4.9-.1-32.4-1.9-62.8-15.6-86.3-38.3-23.5-22.7-39.8-52.7-45.1-85.5-4.5-27.8-2.5-56.1 6.1-82.8 8.6-26.7 22.9-51.1 42.1-72.1 19.2-21 43.5-38.4 70.8-50.8C194.8 102.7 224.9 96 256 96zm0-32C114.6 64 0 178.6 0 320c0 36.6 7.7 71.3 21.7 103.3C38.4 461.3 75.2 489 119.5 491.5c1.6.1 3.3.1 4.9.1 14.9 0 29.2-2.5 42.8-7.2 4.1-1.4 8.1-3 12-4.8 1.9-2.8 4-5.5 6.3-8.1 18.2-20.7 41.6-35.9 67-43.8 1.1-.3 2.3-.6 3.4-1 25.4 7.9 48.9 23.1 67 43.8 2.3 2.6 4.4 5.3 6.3 8.1 4 1.8 8 3.4 12 4.8 13.6 4.7 27.9 7.2 42.8 7.2 1.6 0 3.3-.1 4.9-.1 44.3-2.5 81-30.2 97.8-68.2C407.5 401.7 416 391.3 416 320 416 178.6 301.4 64 160 64c-32.5 0-63.5 6.1-92.4 17.1-19.1 7.2-36.1 17.6-50.4 30.7z'/></svg>`;
    } else if (path.includes('renu-dogra')) {
        // Lotus/Om
        iconHref = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='${PEACH}' d='M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm-17.7-93.5C227.8 77.4 212 96 198.8 113.8c-28.9 39.1-38.3 42.8-49 53.5-32 32-58.3 12.8-58.3 12.8-21.5-13.6-54.8 10-63.2 24.3-9.5 16.2.7 34.6 2.3 37.4 39.4 66.8 95.7 66.8 95.7 66.8 15.6 0 34.4 3.7 34.4 19.3v.1c0 15.6-18.8 19.3-34.4 19.3 0 0-56.3 0-95.7-66.8-1.7-2.8-11.8-21.2-2.3-37.4 8.5-14.3 41.7-37.9 63.2-24.3 0 0 26.3 19.2 58.3-12.8 10.7-10.7 20.1-14.4 49-53.5 13.2-17.8 29-36.4 39.5-47.3 3.9-4.1 10.6-4.1 14.5 0 10.5 10.9 26.3 29.5 39.5 47.3 28.9 39.1 38.3 42.8 49 53.5 32 32 58.3 12.8 58.3 12.8 21.5-13.6 54.8 10 63.2 24.3 9.5 16.2-.7 34.6-2.3 37.4-39.4-66.8-95.7-66.8-95.7-66.8-15.6 0-34.4-3.7-34.4-19.3v-.1c0-15.6 18.8-19.3 34.4-19.3 0 0 56.3 0 95.7 66.8 1.7 2.8 11.8 21.2 2.3 37.4-8.5 14.3-41.7 37.9-63.2 24.3 0 0-26.3 19.2-58.3 12.8-10.7 10.7-20.1 14.4-49 53.5-13.2 17.8-29 36.4-39.5 47.3-3.9 4.1-10.6 4.1-14.5 0z'/></svg>`;
    } else if (path.includes('5-step-reset')) {
        // Leaf Icon
        iconHref = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path fill='${PEACH}' d='M440.5 88.5C397.9 45.3 340.5 24 286 24c-92.6 0-176.4 56.5-212 141.5-17.8 42.5-19.3 90.7-4.1 134.4 15.2 43.7 45.4 79.9 85.3 102.4C195.1 425 242.9 432 288 432c6.2 0 12.5-.2 18.7-.5 47.8-2.6 88-29.4 116.6-66.4 28.6-37 43.1-83.3 40.8-132.8l-.2-3.8c7.8-20.1 13.9-40.8 18.3-62.2 4.4-21.4 6.7 43.2-6.7 43.2 13.4 0 26.8-5.2 37-15.6l9.6 9.6c20.5 20.5 53.6 20.5 74.1 0s20.5-53.6 0-74.1l-68-68c-20.5-20.5-53.6-20.5-74.1 0z'/></svg>`;
    }

    link.href = iconHref;
}

// execute setup
// setupFavicon(rootPath); // This needs to run after rootPath is defined or just use logical path
// Moving execution to end of file


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
            { id: 'nav-problemwall', label: 'The Problem Wall', href: 'pages/problem-wall.html', style: 'color:var(--ink-black); font-weight:600;' },
            { id: 'nav-vent', label: 'The Vent Box', href: 'tools/vent-box.html', style: 'color:var(--ember-orange);' },
            { id: 'nav-dropit', label: 'Drop It (Game)', href: 'tools/drop-it.html', style: 'color:#4ECDC4;' },
            { id: 'nav-soulrider', label: 'Soul Rider (Beta)', href: 'tools/soul-rider.html', style: 'color:#F49F75;' },
            { id: 'nav-reset', label: '5-Step Reset', href: 'tools/5-step-reset.html' },
            { id: 'nav-play', label: 'Mental Playground', href: 'tools/playground.html' },
            { id: 'nav-soulbot', label: 'SoulBot AI', href: 'tools/soulbot.html' },
            { id: 'nav-confession', label: 'Confession Box', href: 'tools/confession-box/index.html' }
        ]
    },
    {
        id: 'nav-spaces',
        label: 'Spaces',
        icon: 'fas fa-layer-group',
        href: '#',
        type: 'dropdown',
        children: [
            {
                id: 'nav-campus',
                label: 'Soulamore Campus',
                // HREF FIXED: Pointing to the correct index file
                href: 'spaces/campus/index.html',
                type: 'submenu',
                children: [
                    { id: 'nav-schools', label: 'Schools', href: 'spaces/campus/schools.html' },
                    { id: 'nav-institutions', label: 'Institutions', href: 'spaces/campus/institutions.html' },
                    { id: 'nav-campus-ambassadors', label: 'Campus Ambassadors', href: 'spaces/campus/campus-ambassadors.html' },
                    { label: 'Student Resources', href: 'spaces/campus/student-resources.html' }
                ]
            },
            {
                id: 'nav-workplace',
                label: 'Soulamore Workplace',
                href: 'spaces/soulamore-workplace/index.html',
                type: 'submenu',
                icon: 'fas fa-briefcase',
                children: [
                    { label: 'Plans & Pricing', href: 'spaces/soulamore-workplace/index.html#plans' },
                    { label: 'Guidelines', href: 'spaces/soulamore-workplace/index.html#guidelines' }
                ]
            },
            {
                id: 'nav-away',
                label: 'Soulamore Away',
                href: 'spaces/soulamore-away/index.html',
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
    html += `<a href="${rootPath}get-help-now.html" id="mobile-destruct-trigger" class="mobile-only-help" style="display:none; margin-top:10px;"><i class="fas fa-life-ring"></i> Get Help Now</a>`;

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
            <a href="${rootPath}auth/login.html" class="nav-btn">Log In / Sign Up</a>
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
                <li><a href="${rootPath}spaces/campus/campus-ambassadors.html">Campus Ambassadors</a></li>
                <li><a href="${rootPath}our-peers/index.html">Meet Peers</a></li>
                <li><a href="${rootPath}community/forum.html">Discussion Forum</a></li>
                <li><a href="${rootPath}join-us/index.html">Join the Team</a></li>
            </ul>
        </div>

        <!-- COMPANY COLUMN -->
        <div class="footer-col">
            <h4 style="font-size:1rem; font-weight:700; color:white; margin-bottom:20px;">Company</h4>
            <ul style="opacity:0.8; font-size:0.9rem; display:flex; flex-direction:column; gap:10px;">
                <li><a href="${rootPath}tools/index.html">Tools</a></li>
                <li><a href="${rootPath}newsletter.html">Newsletter</a></li>
                <li><a href="${rootPath}company/contact.html">Contact</a></li>
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
        location.pathname.includes('/auth/') ||
        location.pathname.includes('/pages/')) {
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
        // WORKPLACE (Briefcase) - PEACH
        iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23F49F75" d="M128 480h256V80c0-26.5-21.5-48-48-48H176c-26.5 0-48 21.5-48 48v400zm64-400h128v32H192V80z"/><path fill="%23F49F75" d="M32 128h448v352H32z"/></svg>`;
    } else if (path.includes('soulamore-campus')) {
        // CAMPUS (Grad Cap) - PEACH
        iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="%23F49F75" d="M320 32l-320 160h640L320 32z"/><path fill="%23F49F75" d="M112 256v128c0 70.7 93.1 128 208 128s208-57.3 208-128V256c-34.9 20.3-88.7 32-144 32s-109.1-11.7-144-32z"/></svg>`;
    } else if (path.includes('physical-wellness') || path.includes('renu-dogra')) {
        // PHYSICAL/RENU (Lotus/Flower) - Saffron/Orange
        iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23f59e0b" d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0 0 114.6 0 256s114.6 256 256 256zm0-48c-114.9 0-208-93.1-208-208S141.1 48 256 48s208 93.1 208 208-93.1 208-208 208z"/><circle cx="256" cy="256" r="64" fill="white"/></svg>`;
    } else if (path.includes('soulamore-away')) {
        // SOULAMORE AWAY (Earth/Globe) - Peach
        iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23F49F75" d="M512 256C512 397.4 397.4 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256zM208.4 208H16C23.51 113.8 97.23 37.98 191.6 29.35C199.1 63.86 205.1 82.25 208.4 208zM240 208H467.6C458.7 131.6 405.2 68.34 329.8 41.59C341.3 76.84 374.3 125.1 240 208zM492.6 304H272C384.8 322.2 411.3 400.9 414.9 418.5C460.7 391.2 491.5 344.8 496 291.9C495.2 296 493.9 300.1 492.6 304zM240 256H16.37C17.06 268 18.67 279.7 21 291.1C65.57 326.6 96.09 377.9 123.4 468.9C189.9 439.4 235.6 381.1 240 256z"/></svg>`;
    }

    // Only override if we have a specific SVG for this section. 
    // Otherwise, we respect the static <link> tag already present in the HTML.
    if (iconSVG) {
        link.href = `data:image/svg+xml,${iconSVG}`;
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

