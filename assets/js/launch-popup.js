(function () {
    // 0. Prevent Recursion (Do not show popup inside the phone mockup iframe)
    if (window.self !== window.top) return;

    // 1. Create the Popup HTML Structure
    const popupHTML = `
    <div class="popup-overlay" id="launchPopup" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 9999; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);">
        <style>
            .popup-card { background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; width: 90%; max-width: 1000px; height: 85vh; max-height: 800px; box-shadow: 0 25px 50px rgba(0,0,0,0.5); display: grid; grid-template-columns: 1.2fr 1fr; overflow: hidden; position: relative; color: white; }
            .badge { background: rgba(78, 205, 196, 0.1); color: #4ECDC4; border: 1px solid #4ECDC4; padding: 6px 16px; border-radius: 50px; font-weight: 700; font-size: 0.8rem; letter-spacing: 1px; width: fit-content; margin-bottom: 20px; font-family: 'Plus Jakarta Sans', sans-serif; }
            .pop-h1 { font-family: 'Outfit', sans-serif; font-size: 3rem; line-height: 1.1; margin-bottom: 20px; color: white; text-shadow: 0 0 25px rgba(255, 255, 255, 0.5); }
            .pop-desc { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 1.05rem; opacity: 1; margin-bottom: 30px; color: #f8fafc; text-shadow: 0 0 10px rgba(255, 255, 255, 0.2); line-height: 1.5; }
            .count-box { text-align: center; background: rgba(0,0,0,0.3); padding: 10px 15px; border-radius: 10px; min-width: 70px; }
            .count-num { display: block; font-size: 1.5rem; font-weight: 700; color: #fbbf24; font-family: 'Outfit', sans-serif; }
            .count-lbl { font-size: 0.7rem; opacity: 0.6; text-transform: uppercase; color: #cbd5e1; font-family: 'Plus Jakarta Sans', sans-serif; }
            .tool-btn { text-decoration: none; color: white; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; border: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.85rem; font-weight: 500; display: flex; align-items: center; gap: 8px; transition: 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; }
            .tool-btn:hover { border-color: #4ECDC4; background: rgba(78, 205, 196, 0.1); }
            .btn-crisis { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; color: #fca5a5; }
            .btn-crisis:hover { background: #ef4444; color: white; border-color: #ef4444; box-shadow: 0 0 15px rgba(239, 68, 68, 0.4); }
            .close-btn { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.1); border: none; color: white; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; z-index: 20; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
            .close-btn:hover { background: #4ECDC4; color: #000; }
            
            /* Responsive */
            @media(max-width: 900px) {
                .popup-card { grid-template-columns: 1fr; height: 95vh; overflow-y: auto; }
                .popup-visual { display: none !important; }
                .popup-content { padding: 40px 30px; }
                .pop-h1 { font-size: 2.2rem; }
            }
            @media(max-width: 480px) {
                .popup-content { padding: 30px 20px; }
                .pop-h1 { font-size: 1.8rem; margin-bottom: 15px; }
                .pop-desc { font-size: 0.95rem; }
                .tool-links { gap: 8px; }
                .tool-btn { width: 100%; justify-content: center; padding: 10px; } /* Full width buttons for touch */
                .count-box { min-width: 60px; padding: 8px 10px; }
            }
        </style>

        <div class="popup-card">
            <button class="close-btn" onclick="document.getElementById('launchPopup').style.display='none'"><i class="fas fa-times"></i></button>

            <div class="popup-content" style="padding: 60px 40px; display: flex; flex-direction: column; justify-content: center; position: relative;">
                <span class="badge">Preview Mode</span>
                <h1 class="pop-h1">We’re building this together.</h1>
                <p class="pop-desc">
                    You’re seeing an early version of Soulamore. Some features are still under construction, and a few profiles are placeholders while we wire up the backend.
                    <br><br>
                    Real-time matching and accounts are being built quietly in the background.
                </p>

                <div class="countdown" id="launchCountdown" style="display: flex; gap: 15px; margin-bottom: 30px;">
                    <div class="count-box"><span class="count-num" id="d-days">00</span><span class="count-lbl">Days</span></div>
                    <div class="count-box"><span class="count-num" id="d-hours">00</span><span class="count-lbl">Hours</span></div>
                    <div class="count-box"><span class="count-num" id="d-mins">00</span><span class="count-lbl">Mins</span></div>
                </div>

                <div style="margin-bottom: 20px; font-size:0.9rem; opacity:0.9; font-weight:600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-family: 'Plus Jakarta Sans', sans-serif;">WHILE YOU WAIT:</div>
                <div class="tool-links" style="display: flex; gap: 10px; margin-bottom: 30px; flex-wrap: wrap;">
                    <a href="/get-help-now.html" class="tool-btn btn-crisis"><i class="fas fa-life-ring"></i> Get Help Now</a>
                    <a href="/playground.html" class="tool-btn"><i class="fas fa-shapes"></i> Playground</a>
                    <a href="/5-step-reset.html" class="tool-btn"><i class="fas fa-wind"></i> 5-Step Reset</a>
                    <a href="/soulbot.html" class="tool-btn"><i class="fas fa-robot"></i> Talk to Soulbot</a>
                    <a href="https://www.instagram.com/soulamore_/" target="_blank" class="tool-btn"><i class="fab fa-instagram"></i> Join us on IG</a>
                </div>

                <div style="margin-top:auto; font-size:0.85rem; opacity:0.7; color: #cbd5e1; font-family: 'Plus Jakarta Sans', sans-serif;">
                    If you’re a peer or psychologist aligned with our mission, reach out. We’d love to hear from you.
                </div>
            </div>

            <div class="popup-visual" style="background: linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(0,0,0,0) 50%); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                <div class="phone-frame" style="width: 280px; height: 580px; border: 10px solid #1e293b; border-radius: 35px; background: #000; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.6); overflow: hidden; transform: translateY(20px);">
                    <div class="notch" style="position: absolute; top:0; left:50%; transform:translateX(-50%); width:100px; height:20px; background:#1e293b; border-bottom-left-radius:12px; border-bottom-right-radius:12px; z-index:10;"></div>
                    <div class="screen-content" style="width: 100%; height: 100%; overflow: hidden; background: #fff;">
                       <iframe src="/index.html" style="width: 100%; height: 200%; border: none; animation: scrollApp 15s infinite ease-in-out;" scrolling="no"></iframe>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <style>@keyframes scrollApp { 0% { transform: translateY(0); } 20% { transform: translateY(-20%); } 50% { transform: translateY(-20%); } 70% { transform: translateY(-5%); } 100% { transform: translateY(0); } }</style>
    `;

    // 2. Inject into Body
    document.body.insertAdjacentHTML('beforeend', popupHTML);

    // 3. Timer Logic (Jan 31, 2026)
    const targetDate = new Date('2026-01-31T00:00:00');
    function updateLaunchTimer() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) return;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const mins = Math.floor((diff / (1000 * 60)) % 60);

        const d = document.getElementById('d-days');
        const h = document.getElementById('d-hours');
        const m = document.getElementById('d-mins');

        if (d) d.innerText = String(days).padStart(2, '0');
        if (h) h.innerText = String(hours).padStart(2, '0');
        if (m) m.innerText = String(mins).padStart(2, '0');
    }
    setInterval(updateLaunchTimer, 1000);
    updateLaunchTimer();

})();
