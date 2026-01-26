/**
 * view-manager.js
 * Handles the unified ".page-view" switching system.
 */

export function showView(viewId) {
    // 1. Hide all views
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });

    // 2. Show Target
    const target = document.getElementById(`view-${viewId}`);
    if (target) {
        target.classList.add('active');
        // Ensure display is block in case inline styles interfere, though CSS handles opacity
        if (target.style.display === 'none') {
            target.style.display = 'block';
        }
    } else {
        console.error(`View not found: view-${viewId}`);
    }

    // 3. Update Sidebar Active State
    document.querySelectorAll('.side-link').forEach(link => {
        // Remove active from everywhere first
        link.classList.remove('active');

        // Restore if it matches
        // Check data-view attribute or onclick content
        const linkView = link.getAttribute('data-view');
        const onClick = link.getAttribute('onclick');

        if ((linkView && linkView === viewId) ||
            (onClick && onClick.includes(`'${viewId}'`))) {
            link.classList.add('active');
        }
    });

    // 4. Update URL (Optional, for history)
    // history.pushState({}, '', `?view=${viewId}`);
}

// Attach to window so legacy onclicks work if needed (until we refactor them all)
window.showView = showView;
