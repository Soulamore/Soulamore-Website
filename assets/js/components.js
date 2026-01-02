console.log("Soulamore: Components.js loading...");

// CRITICAL: Inject Styles Immediately
try {
    const style = document.createElement('style');
    style.id = 'header-critical-style';
    style.innerHTML = `
        /* DESKTOP (Width > 1024px) */
        @media (min-width: 1025px) {
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
            }
            .auth-box {
                display: flex !important; /* Force Auth Box Visible */
            }
        }
        /* MOBILE (Width <= 1024px) */
        @media (max-width: 1024px) {
            .auth-box { display: none !important; }
            .mobile-only-help { display: flex !important; margin-top: 15px; background: rgba(255,107,107,0.1); padding: 10px 20px; border-radius: 12px; color: #ff6b6b; align-items: center; gap: 10px; }
        }
    `;
    document.head.appendChild(style);
    console.log("Soulamore: Critical styles injected (Breakpoint: 1024px).");
} catch (e) {
    console.error("Soulamore: Style injection failed", e);
}

document.addEventListener("DOMContentLoaded", () => {
    try {
        console.log("Soulamore: DOM Content Loaded, initializing...");
        injectHeader();
        injectFooter();
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
        type: 'link'
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
<div class="footer-content">
    <div class="footer-logo">
        <img src="${rootPath}assets/images/logo.png" alt="Soulamore Logo" style="height: 50px; margin-bottom: 15px;">
    </div>
    <p style="font-size:0.9rem; opacity:0.7; margin-top:10px;">Your Partner in Mental Wellness.</p>
    
    <p style="font-size:0.85rem; opacity:0.6; margin-top:20px; max-width: 800px; margin-left: auto; margin-right: auto;">
        Disclaimer: Online therapy is not advisable if you are in acute distress.
        Please contact your nearest hospital if you are feeling suicidal or at risk of self-harm.
    </p>

    <div class="footer-links">
        <a href="${rootPath}about.html">About</a>
        <a href="${rootPath}contact.html">Contact</a>
        <a href="${rootPath}legal.html">Legal</a>
    </div>
    
    <div class="footer-socials">
        <a href="https://www.instagram.com/soulamore_/" target="_blank"><i class="fab fa-instagram"></i></a>
        <a href="https://www.linkedin.com/company/soulamore/" target="_blank"><i class="fab fa-linkedin"></i></a>
        <a href="https://www.facebook.com/share/1LihokP4wQ/?mibextid=wwXIfr" target="_blank"><i class="fab fa-facebook"></i></a>
    </div>
    <p style="font-size:0.8rem; opacity:0.5; margin-top:20px;">© 2025 by Hashlilly! All rights reserved.</p>
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
