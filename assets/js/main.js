document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Menu Toggle ---
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const desktopLoginBtn = document.querySelector('.nav-btn');

    if (toggleBtn && navLinks) {
        // --- Dynamic Mobile Login Button ---
        // Clone the desktop button and put it inside the mobile menu (at the top)
        if (desktopLoginBtn) {
            // Check if already exists to avoid duplicates if script runs twice
            if (!navLinks.querySelector('.mobile-login-btn')) {
                const mobileBtn = desktopLoginBtn.cloneNode(true);
                mobileBtn.classList.add('mobile-login-btn');
                mobileBtn.classList.remove('nav-btn'); // Remove desktop class to avoid conflicts if needed, but keeping styles might be good.
                // Re-add nav-btn styles but override display:none via the new class in CSS if needed, 
                // OR just copy styles. Ideally, keep nav-btn class but make sure CSS allows it inside menu.
                // Let's rely on .mobile-login-btn specific CSS we just added.
                // mobileBtn.style.display = 'block';  <-- REMOVED: Let CSS control this (hidden on desktop, block on mobile)
                // Prepend to top
                navLinks.prepend(mobileBtn);
            }
        }

        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            document.body.classList.toggle('no-scroll'); // Prevent background scroll

            // UX: Hide Bottom Nav when Menu is Open
            const bottomNav = document.querySelector('.mobile-bottom-nav');
            if (bottomNav) {
                bottomNav.classList.toggle('hidden');
            }

            const icon = toggleBtn.querySelector('i');
            if (navLinks.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // --- Active Link Highlighting ---
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.nav-links a');

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;

        // Clean paths for comparison
        const cleanHref = href.replace('./', '').split(/[?#]/)[0];
        const cleanPath = currentPath.split('/').pop().split(/[?#]/)[0];

        if (cleanPath === cleanHref || (cleanPath === '' && cleanHref === 'index.html')) {
            link.classList.add('active');
        }
    });

    // --- Close Menu When Link Clicked ---
    if (navLinks) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                document.body.classList.remove('no-scroll');

                // UX: Show Bottom Nav again
                const bottomNav = document.querySelector('.mobile-bottom-nav');
                if (bottomNav) bottomNav.classList.remove('hidden');

                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- Header Scroll Effect (Optional: Glass morph gets stronger on scroll) ---
    const header = document.querySelector('header');

    // --- Reading Progress Bar Injection ---
    if (!document.getElementById('scroll-progress-container')) {
        const pCont = document.createElement('div');
        pCont.id = 'scroll-progress-container';
        const pBar = document.createElement('div');
        pBar.id = 'scroll-progress-bar';
        pCont.appendChild(pBar);
        document.body.prepend(pCont);
    }
    const progressBar = document.getElementById('scroll-progress-bar');

    window.addEventListener('scroll', () => {
        // Header Effect
        if (header) {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(15, 23, 42, 0.95)';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(15, 23, 42, 0.85)';
                header.style.boxShadow = 'none';
            }
        }

        // Progress Bar Update
        if (progressBar) {
            const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollCurrent = document.documentElement.scrollTop || document.body.scrollTop;
            if (scrollTotal > 0) {
                const scrollPercent = (scrollCurrent / scrollTotal) * 100;
                progressBar.style.width = scrollPercent + '%';
            }
        }
    });

    // --- UX ENHANCEMENT: MOBILE BOTTOM NAV (#1) ---
    // Injecting here to avoid editing 44 files
    if (window.innerWidth <= 900 && !document.querySelector('.mobile-bottom-nav')) {
        const bottomNav = document.createElement('div');
        bottomNav.className = 'mobile-bottom-nav';
        bottomNav.innerHTML = `
            <a href="./index.html" class="mb-item">
                <i class="fas fa-home"></i>
                <span>Home</span>
            </a>
            <div class="mb-item" onclick="if(window.openSoulbot) window.openSoulbot(); else alert('Soulbot loading...');">
                <i class="fas fa-robot" style="color:var(--teaser-blue);"></i>
                <span>Chat</span>
            </div>
            <a href="./get-help-now.html" class="mb-item">
                <i class="fas fa-heart-pulse" style="color:var(--peach-glow);"></i>
                <span>Crisis</span>
            </a>
            <div class="mb-item" onclick="document.querySelector('.mobile-toggle').click()">
                <i class="fas fa-bars"></i>
                <span>Menu</span>
            </div>
        `;
        document.body.appendChild(bottomNav);
    }
});
