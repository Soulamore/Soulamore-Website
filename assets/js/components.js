/**
 * Soulamore Component Loader (Dashboard Sidebar Version)
 * Dynamically injects Header/Footer with a premium Mobile Sidebar (Glassmorphism).
 */

document.addEventListener("DOMContentLoaded", () => {
    injectHeader();
    injectFooter();
    setActiveState();
    initializeHeaderLogic();
});

// --- 1. DEFINE COMPONENTS ---

// CRITICAL CSS: Force-hide mobile elements on desktop to bypass cache issues
const style = document.createElement('style');
style.innerHTML = `
    @media (min-width: 1151px) {
        .mobile-profile-card, 
        .mobile-toggle,
        .mobile-bottom-nav, 
        .dropdown-toggle-btn { 
            display: none !important; 
        }
        /* Icons are now ALLOWED on desktop per user request */
    }
`;
document.head.appendChild(style);

const getHeaderHTML = (rootPath) => `
<div class="main-nav">
    <a href="${rootPath}index.html" class="nav-logo"><img src="${rootPath}assets/images/logo.png" alt="Soulamore Logo"></a>

    <div class="nav-group">
        <nav class="nav-links">
            
            <!-- MOBILE PROFILE CARD (Visible < 1150px) -->
            <!-- This appears at top of drawer -->
            <!-- INLINE STYLE: Default to hidden to prevent desktop flash/cache issues -->
            <div class="mobile-profile-card" style="display: none;">
                <div class="mp-avatar"><i class="fas fa-ghost"></i></div>
                <div class="mp-info">
                    <span class="mp-name">Welcome, Friend</span>
                    <span class="mp-status">Guest</span>
                    <a href="${rootPath}login.html" class="mp-btn">Log In</a>
                </div>
            </div>

            <!-- 1. HOME -->
            <a href="${rootPath}index.html" id="nav-home"><i class="fas fa-home"></i>Home</a>

            <!-- 2. SPACES -->
            <div class="dropdown">
                <a href="#" id="nav-spaces"><i class="fas fa-rocket"></i>Spaces<i class="fas fa-chevron-down" style="font-size:0.8em; margin-left:auto;"></i></a>
                <div class="dropdown-content">
                    <a href="${rootPath}soulamore-campus.html" id="nav-campus">Campus</a>
                    <a href="${rootPath}soulamore-away.html" id="nav-away">Away</a>
                    <a href="${rootPath}our-peers/index.html" id="nav-peers">Peers</a>
                </div>
            </div>

            <!-- 3. WELLNESS -->
            <div class="dropdown">
                <a href="#" id="nav-wellness"><i class="fas fa-heart-pulse"></i>Wellness<i class="fas fa-chevron-down" style="font-size:0.8em; margin-left:auto;"></i></a>
                <div class="dropdown-content">
                    <a href="${rootPath}confession-box.html" id="nav-confession">Confession Box</a>
                    <a href="${rootPath}support-groups.html" id="nav-support">Support Groups</a>
                    <a href="${rootPath}vent-box.html" id="nav-vent">The Vent Box</a>
                    <a href="${rootPath}get-help-now.html" id="nav-help">Get Help Now</a>
                </div>
            </div>

            <!-- 4. COMMUNITY -->
            <div class="dropdown">
                <a href="#" id="nav-community"><i class="fas fa-users"></i>Community<i class="fas fa-chevron-down" style="font-size:0.8em; margin-left:auto;"></i></a>
                <div class="dropdown-content">
                    <a href="${rootPath}join-us/index.html" id="nav-join">Join Us</a>
                    <a href="${rootPath}blogs.html" id="nav-blogs">Blogs</a>
                    <a href="${rootPath}forum.html" id="nav-forum">Forum</a>
                    <a href="${rootPath}community-calendar.html" id="nav-calendar">Calendar</a>
                </div>
            </div>

            <!-- 5. COMPANY -->
            <div class="dropdown">
                <a href="#" id="nav-company"><i class="fas fa-building"></i>Company<i class="fas fa-chevron-down" style="font-size:0.8em; margin-left:auto;"></i></a>
                <div class="dropdown-content">
                    <a href="${rootPath}about.html" id="nav-about">About</a>
                    <a href="${rootPath}contact.html" id="nav-contact">Contact</a>
                </div>
            </div>

        </nav>

        <!-- Auth Group (Icon + Button) -->
        <div class="auth-box">
             <a href="#" class="user-icon-btn"><i class="fas fa-ghost"></i></a>
             <a href="${rootPath}login.html" class="nav-btn">Log In / Sign Up</a>
        </div>
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

// --- 2. HELPERS ---

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

// --- 3. INJECTION LOGIC ---

function injectHeader() {
    const headerElement = document.querySelector('header');
    if (headerElement) {
        // Z-INDEX FIX: Move header to body root to escape .container's z-index trap (5)
        // This ensures header (20000) can beat Soulbot (9999) and Audio (99)
        if (headerElement.parentElement !== document.body) {
            document.body.prepend(headerElement);
        }

        headerElement.classList.add('island-nav');

        // --- THEMING LOGIC ---
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
    }
}

function injectFooter() {
    const footerElement = document.querySelector('footer');
    if (footerElement) {
        footerElement.innerHTML = getFooterHTML(getRootPath());
    }
}

// --- 4. ACTIVE STATE LOGIC ---

function setActiveState() {
    const path = window.location.pathname;
    const stateMap = {
        'index.html': ['nav-home', null],
        'soulamore-campus.html': ['nav-spaces', 'nav-campus'],
        'campus': ['nav-spaces', 'nav-campus'],
        'soulamore-away.html': ['nav-spaces', 'nav-away'],
        'away': ['nav-spaces', 'nav-away'],
        'our-peers': ['nav-spaces', 'nav-peers'],
        'confession-box': ['nav-wellness', 'nav-confession'],
        'support-groups': ['nav-wellness', 'nav-support'],
        'vent-box': ['nav-wellness', 'nav-vent'],
        'get-help-now': ['nav-wellness', 'nav-help'],
        'join-us': ['nav-community', 'nav-join'],
        'blogs': ['nav-community', 'nav-blogs'],
        'forum': ['nav-community', 'nav-forum'],
        'calendar': ['nav-community', 'nav-calendar'],
        'about': ['nav-company', 'nav-about'],
        'contact': ['nav-company', 'nav-contact']
    };

    for (const [key, ids] of Object.entries(stateMap)) {
        if (path.includes(key)) {
            if (ids[0]) document.getElementById(ids[0])?.classList.add('active');
            if (ids[1]) document.getElementById(ids[1])?.classList.add('active');
            break;
        }
    }
}

// --- 5. INITIALIZE HEADER LOGIC ---

function initializeHeaderLogic() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const header = document.querySelector('header');

    // A. Mobile Sidebar Toggle
    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            document.body.classList.toggle('no-scroll'); // Lock scroll
            toggleBtn.classList.toggle('active'); // Rotate icon

            // Icon Swap (Bars <-> Times)
            const icon = toggleBtn.querySelector('i');
            if (navLinks.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            // Hide/Show Bottom Nav (optional, if overlapping)
            const bottomNav = document.querySelector('.mobile-bottom-nav');
            if (bottomNav) bottomNav.classList.toggle('hidden');
        });

        // Close on Link Click
        navLinks.querySelectorAll('a').forEach(link => {
            // Don't close if they clicked a dropdown toggle
            if (link.nextElementSibling && link.nextElementSibling.classList.contains('dropdown-content')) return;

            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                document.body.classList.remove('no-scroll');
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    toggleBtn.classList.remove('active');
                }
                const bottomNav = document.querySelector('.mobile-bottom-nav');
                if (bottomNav) bottomNav.classList.remove('hidden');
            });
        });
    }

    // B. Dropdown Toggle (Sidebar Logic)
    // In sidebar mode, clicking the link or arrow should toggle the list.
    // We already have <a>Wrapper</a><div content> ...
    // With global.css changes, .dropdown > a handles the click if we want entire row to toggle?
    // Let's attach listener to the whole row link for Mobile.

    // Logic: If screen < 1150px, clicking 'Spaces' toggles sub-menu instead of going to #
    const dropdownToggles = document.querySelectorAll('.dropdown > a');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            // Only hijacking if in mobile view (or if valid link is #)
            if (window.innerWidth <= 1150 || toggle.getAttribute('href') === '#') {
                e.preventDefault();
                e.stopPropagation(); // Stop bubbling
                const parent = toggle.parentElement;

                // Toggle Logic
                if (parent.classList.contains('active')) {
                    parent.classList.remove('active');
                } else {
                    // Close others if needed (optional)
                    parent.classList.add('active');
                }

                // Icon rotation
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
