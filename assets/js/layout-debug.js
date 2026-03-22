/* ============================================
   LAYOUT DEBUG TOOL
   Highlights layout issues:
   - Fixed elements (Red Border)
   - Scroll containers (Green Border)
   - Z-Index on hover (Tooltip)
   - Active View dimensions
   ============================================ */

(function () {
    console.log("🛠️ Layout Debugger Loaded. Press Ctrl+Shift+D to toggle.");

    let debugActive = false;
    let tooltip = null;

    function createTooltip() {
        tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: fixed; 
            background: rgba(0,0,0,0.8); 
            color: #fff; 
            padding: 4px 8px; 
            border-radius: 4px; 
            font-size: 10px; 
            pointer-events: none; 
            z-index: 99999;
            display: none;
            font-family: monospace;
        `;
        document.body.appendChild(tooltip);
    }

    function toggleDebug() {
        debugActive = !debugActive;
        const root = document.documentElement;

        if (debugActive) {
            console.log("Debug Mode: ON");
            root.classList.add('debug-layout');
            document.body.addEventListener('mousemove', handleHover);
            auditLayout();
        } else {
            console.log("Debug Mode: OFF");
            root.classList.remove('debug-layout');
            document.body.removeEventListener('mousemove', handleHover);
            if (tooltip) tooltip.style.display = 'none';
        }
    }

    function handleHover(e) {
        if (!debugActive || !tooltip) return;
        const el = document.elementFromPoint(e.clientX, e.clientY);
        if (!el) return;

        const styles = window.getComputedStyle(el);
        const z = styles.zIndex === 'auto' ? 'auto' : styles.zIndex;
        const name = el.id ? '#' + el.id : el.tagName.toLowerCase() + (el.className ? '.' + el.className.split(' ').join('.') : '');

        tooltip.innerHTML = `<strong>${name}</strong><br>z-index: ${z}<br>pos: ${styles.position}`;
        tooltip.style.left = (e.clientX + 10) + 'px';
        tooltip.style.top = (e.clientY + 10) + 'px';
        tooltip.style.display = 'block';
    }

    function auditLayout() {
        // 1. Detect multiple scroll containers (Bad practice in single shell)
        const allElements = document.querySelectorAll('*');
        let scrollers = [];

        allElements.forEach(el => {
            if (el.id === 'page-stage') return; // The authorized scroller

            const style = window.getComputedStyle(el);
            if ((style.overflowY === 'scroll' || style.overflowY === 'auto') && el.scrollHeight > el.clientHeight) {
                console.warn("⚠️ Unexpected scroll container found:", el);
                el.style.border = "2px solid orange";
            }
        });

        // 2. Log active view height
        const activeView = document.querySelector('.view-section.active');
        if (activeView) {
            console.log(`Active View (${activeView.id}): ${activeView.offsetHeight}px height`);
        }
    }

    // Inject styles dynamically
    const style = document.createElement('style');
    style.innerHTML = `
        .debug-layout * { outline: 1px solid rgba(0, 255, 255, 0.1) !important; }
        .debug-layout #page-stage { border: 2px solid #2DD4BF !important; } /* Expected Scroller */
        .debug-layout #sidebar { border-right: 2px solid #F4A261 !important; }
        .debug-layout .page-header-icon { outline: 2px solid yellow !important; }
        
        /* Highlight fixed/absolute chaos */
        .debug-layout *[style*="position: fixed"], 
        .debug-layout *[style*="position: absolute"] {
            background: rgba(255, 0, 0, 0.05) !important;
        }
    `;
    document.head.appendChild(style);

    // Initialize
    createTooltip();

    // Key Listener
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            toggleDebug();
        }
    });

    // Expose to window
    window.toggleLayoutDebug = toggleDebug;
})();
