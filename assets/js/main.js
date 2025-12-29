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

    // --- Header Scroll Effect (Optional: Glass morph gets stronger on scroll) ---
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.background = 'rgba(15, 23, 42, 0.95)';
                header.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
            } else {
                header.style.background = 'rgba(15, 23, 42, 0.85)';
                header.style.boxShadow = 'none';
            }
        });
    }
});
