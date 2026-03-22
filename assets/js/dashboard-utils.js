// DASHBOARD NAVIGATION & TOOLS

// GLOBAL UTILITY - NO EXPORTS
// This ensures it runs via standard <script> tag without module complexities.

function switchView(viewId, linkElement) {
    console.log("Switching to:", viewId);

    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('active');
        el.style.pointerEvents = 'none'; // CSS Fix: Prevent click interception
    });

    // Deactivate all links
    document.querySelectorAll('.side-link').forEach(el => el.classList.remove('active'));

    // Show Target View
    const target = document.getElementById('view-' + viewId);
    if (target) {
        target.style.display = 'flex';
        target.classList.add('active'); // Important for flex layout
        target.style.pointerEvents = 'auto'; // CSS Fix: Enable interaction

        // OPTIONAL SAFETY PATCH
        const main = document.querySelector('.main-content');
        if (main) main.scrollTop = 0;
    } else {
        console.error("View not found:", viewId);
    }

    // Activate Link
    if (linkElement) {
        linkElement.classList.add('active');
    }
};

function initDashboard() {
    // 1. Expose switchView to window explicitly
    window.switchView = switchView;

    // 2. Tool Modal Logic
    window.openTool = function (url, title) {
        const modal = document.getElementById('toolModal');
        const frame = document.getElementById('toolFrame');
        const titleEl = document.getElementById('modalTitle');

        if (modal && frame && titleEl) {
            frame.src = url;
            titleEl.textContent = title || 'Tool';
            modal.style.display = 'flex'; // Force flex
            modal.classList.add('active');
        } else {
            window.open(url, '_blank');
        }
    };

    window.closeTool = function () {
        const modal = document.getElementById('toolModal');
        const frame = document.getElementById('toolFrame');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.remove('active');
        }
        if (frame) frame.src = '';
    };

    // 3. Mobile Toggle
    window.toggleSidebar = function () {
        document.getElementById('sidebar').classList.toggle('open');
    }
}

// execute
initDashboard();
