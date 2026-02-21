
/**
 * Hybrid Layout Engine & Renderer
 * Handles the Spiral distribution and DOM creation for notes.
 */

window.STATE = window.STATE || {}; // Ensure STATE exists

window.HybridLayout = (function () {
    const CONFIG = {
        centerX: 2500, // Matches CSS .wall-hero top/left
        centerY: 2450,
        spiralGap: 45, // Tighter spiral
        noteSize: 280,
        padding: 20
    };

    let placedNotes = [];
    let angle = 0;
    let radius = 380; // Start outside hero zone

    function resetLayout() {
        placedNotes = [];
        angle = 0;
        radius = 380;
    }

    function checkCollision(x, y) {
        // 1. Central Hero Exclusion Zone (350px radius)
        const dxCenter = x - CONFIG.centerX;
        const dyCenter = y - CONFIG.centerY;
        const distFromCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter);

        if (distFromCenter < 380) return true;

        // 2. Note Collision (Simple Circle for speed)
        // Optimization: Notes are squares but circles are faster
        const r2 = (CONFIG.noteSize + CONFIG.padding) * 0.6; // Overlap factor

        // Only check recent notes for collision to optimize? No, check all.
        // Or check reverse?

        for (let i = placedNotes.length - 1; i >= 0; i--) {
            const note = placedNotes[i];
            const dx = x - note.x;
            const dy = y - note.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 320) return true; // Collision range ~320px
        }
        return false;
    }

    function layoutAll() {
        // Only re-layout if notes not positioned?
        // Actually, spiral is deterministic. We can rebuild.
        resetLayout();

        const notes = window.STATE.notesData || [];
        // Sort newest first?
        // notes.sort((a,b) => b.createdAt.seconds - a.createdAt.seconds);

        const container = document.getElementById('notes-container');
        if (!container) return;

        window.logDebug(`HybridLayout: Processing ${notes.length} notes...`);

        notes.forEach(note => {
            // Find Position
            let found = false;
            let attempts = 0;

            while (!found && radius < 2500 && attempts < 1000) {
                const x = CONFIG.centerX + (radius * Math.cos(angle));
                const y = CONFIG.centerY + (radius * Math.sin(angle));

                if (!checkCollision(x, y)) {
                    note.x = x;
                    note.y = y;
                    note.rotation = (Math.random() * 6) - 3;
                    placedNotes.push({ x, y });
                    found = true;
                }

                angle += 0.2; // Radians step (approx 12 deg)
                radius += 0.8; // Outward step
                attempts++;
            }

            if (found) {
                window.createOrUpdateNoteElement(note);
            }
        });
    }

    return {
        init: () => { if (window.logDebug) window.logDebug("HybridLayout Initialized"); },
        layoutAll: layoutAll,
        reset: resetLayout
    };
})();

/**
 * DOM Renderer
 */
window.createOrUpdateNoteElement = function (data) {
    let el = document.querySelector(`.note[data-note-id="${data.id}"]`);
    const container = document.getElementById('notes-container');
    if (!container) return;

    if (!el) {
        el = document.createElement('div');
        el.className = 'note';
        el.dataset.noteId = data.id;

        // Make note visible immediately (no animation dependency)
        el.style.opacity = '1';
        el.style.pointerEvents = 'all';
        container.appendChild(el);
    }

    // Position
    el.style.left = (data.x || 2500) + 'px';
    el.style.top = (data.y || 2450) + 'px';
    el.style.transform = `translate(-50%, -50%) rotate(${data.rotation || 0}deg)`;
    el.style.setProperty('--rot', `${data.rotation || 0}deg`);

    // Content: Date Label
    let timeLabel = 'Just now';
    if (data.createdAt) {
        const createdTime = (data.createdAt.seconds ? data.createdAt.seconds * 1000 : data.createdAt) || Date.now();
        const diffMins = Math.floor((Date.now() - createdTime) / 60000);
        if (diffMins < 1) timeLabel = 'Just now';
        else if (diffMins < 60) timeLabel = `${diffMins}m ago`;
        else if (diffMins < 1440) timeLabel = `${Math.floor(diffMins / 60)}h ago`;
        else timeLabel = `${Math.floor(diffMins / 1440)}d ago`;
    }

    // Meta / Reactions
    const r = {
        heart: data.hearts || 0,
        flower: data.flowers || 0,
        candle: data.candles || 0
    };

    // Check localStorage for reacted state
    const userReactions = JSON.parse(localStorage.getItem('soulamore_user_reactions') || '{}');
    const noteReactions = userReactions[data.id] || [];

    const isHeart = noteReactions.includes('heart') ? 'reacted' : '';
    const isFlower = noteReactions.includes('flower') ? 'reacted' : '';
    const isCandle = noteReactions.includes('candle') ? 'reacted' : '';

    el.innerHTML = `
        <div class="note-meta">${timeLabel}</div>
        <div class="note-content">${data.text}</div>
        <div class="note-actions">
             <button class="action-btn heart-btn ${isHeart}" onclick="window.reactGlobally('${data.id}', 'heart', this)">
                <i class="fas fa-heart"></i> <span class="count">${r.heart}</span>
             </button>
             <button class="action-btn flower-btn ${isFlower}" onclick="window.reactGlobally('${data.id}', 'flower', this)">
                <i class="fas fa-spa"></i> <span class="count">${r.flower}</span>
             </button>
             <button class="action-btn candle-btn ${isCandle}" onclick="window.reactGlobally('${data.id}', 'candle', this)">
                <i class="fas fa-fire-alt"></i> <span class="count">${r.candle}</span>
             </button>
        </div>
    `;

    // Add Glow if "User Post"
    if (data.isUserPost) {
        el.classList.add('new-note-glow');
    }
};

// Global React Function
window.reactGlobally = function (noteId, type, btn) {
    if (btn.classList.contains('reacted')) return; // Prevent double click

    // Optimistic UI
    btn.classList.add('reacted');
    const countEl = btn.querySelector('.count');
    if (countEl) {
        let val = parseInt(countEl.innerText) || 0;
        countEl.innerText = val + 1;
    }

    // Animate Icon
    const icon = btn.querySelector('i');
    if (icon) {
        icon.style.transform = 'scale(1.4)';
        setTimeout(() => icon.style.transform = 'scale(1)', 200);
    }

    // Save Local Storage
    try {
        const userReactions = JSON.parse(localStorage.getItem('soulamore_user_reactions') || '{}');
        if (!userReactions[noteId]) userReactions[noteId] = [];
        if (!userReactions[noteId].includes(type)) {
            userReactions[noteId].push(type);
            localStorage.setItem('soulamore_user_reactions', JSON.stringify(userReactions));
        }
    } catch (e) { console.warn("LS Error", e); }

    // Send to Firebase (via Module connection)
    if (window.firebaseReact) {
        window.firebaseReact(noteId, type);
    } else {
        console.warn("Firebase React function not connected yet.");
    }
};
