document.addEventListener("DOMContentLoaded", () => {
    console.log("FORCE RESTORE: Running...");

    // 1. FORCE 4 PILLARS RESTORATION
    const pillarsGrid = document.querySelector('.features-grid');
    if (pillarsGrid) {
        // Check if it already has the corect content
        if (!pillarsGrid.innerHTML.includes("Heartfelt")) {
            console.log("FORCE RESTORE: Overwriting Pillars...");
            pillarsGrid.innerHTML = `
            <div class="feature-box">
                <div class="f-icon" style="font-size:2rem; margin-bottom:10px;">💙</div>
                <h3>Heartfelt Connections</h3>
                <p style="font-size:0.9rem; opacity:0.7;">Genuine empathy and emotional support.</p>
            </div>
            <div class="feature-box">
                <div class="f-icon" style="font-size:2rem; margin-bottom:10px;">🛡️</div>
                <h3>Sanctuary of Trust</h3>
                <p style="font-size:0.9rem; opacity:0.7;">Confidentiality and safety first.</p>
            </div>
            <div class="feature-box">
                <div class="f-icon" style="font-size:2rem; margin-bottom:10px;">🕯️</div>
                <h3>Guiding Light</h3>
                <p style="font-size:0.9rem; opacity:0.7;">Peers who have triumphed over adversity.</p>
            </div>`;
        }
        // Force Visibility
        pillarsGrid.style.display = "grid";
        pillarsGrid.style.opacity = "1";
        pillarsGrid.style.visibility = "visible";
    }

    // 2. FORCE BREATH GAME TEXT SIZE
    const breathStatus = document.getElementById('breathStatus');
    if (breathStatus) {
        // Ensure the initial text is correct if logic fails
        if (breathStatus.innerText === "Watch the circle...") {
            // Keep it, but ensure style is reset
            breathStatus.style.fontSize = "0.9rem";
            breathStatus.style.color = "rgba(255,255,255,0.7)";
        }
    }

    // 3. FORCE ABOUT PAGE GRID (If on About Page)
    if (window.location.pathname.includes('about.html')) {
        const split = document.querySelector('.founder-split-inner');
        if (split) {
            split.style.gridTemplateColumns = "320px 1fr";
            console.log("FORCE RESTORE: Widen About Profile");
        }
    }

    console.log("FORCE RESTORE: Complete.");
});
