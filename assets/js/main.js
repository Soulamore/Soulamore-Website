document.addEventListener('DOMContentLoaded', () => {

    // --- PART 1: BODY ELEMENTS (Safe to keep) ---

    // --- Active Link Highlighting (FALLBACK) ---
    // Kept as a fallback for any links OUTSIDE the header (e.g., Footer links)
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('a'); // Target ALL links, not just .nav-links

    links.forEach(link => {
        const href = link.getAttribute('href');
        if (!href) return;
        // Clean paths for comparison
        const cleanHref = href.replace('./', '').split(/[?#]/)[0];
        const cleanPath = currentPath.split('/').pop().split(/[?#]/)[0];

        if (cleanPath === cleanHref && cleanHref !== '#' && cleanHref !== '') {
            // Optional: Add active class to footer links if desired, 
            // but usually we strictly wanted Header active states which components.js handles.
            // Leaving this empty strictly for safety to not interfere.
        }
    });

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
