(function () {
    // 0. Prevent Recursion (Do not show popup inside the phone mockup iframe)
    if (window.self !== window.top) return;

    // 0.1 Session Check: Show only once per session
    // Check if user has already seen the popup (session based)
    const hasSeenPopup = sessionStorage.getItem('soulamore_launch_popup_seen');

    // FORCE TEST: Check for URL param
    const urlParams = new URLSearchParams(window.location.search);
    const forceTest = urlParams.get('test-popup');

    // If popup has been seen and not forced, exit early
    if (hasSeenPopup && forceTest !== 'true') {
        console.log('Launch preview already seen this session.');
        return;
    }

    // Mark as seen immediately (this will prevent it from showing again in the same session,
    // unless 'test-popup=true' is present in the URL)
    sessionStorage.setItem('soulamore_launch_popup_seen', 'true');

    // 0.2 Performance: Only load iframe on Desktop
    const isDesktop = window.innerWidth > 900;
    // RESTORED IFRAME for "Live Site" preview
    // Added pointer-events: none so users can't click inside the preview
    const iframeHTML = isDesktop
        ? `<iframe src="./index.html" class="site-iframe" style="pointer-events: none;" title="App Preview"></iframe>`
        : `<!-- Phone View Hidden on Mobile -->`;

    // 1. Create the Popup HTML Structure
    const popupHTML = `
    <div class="popup-overlay" id="launchPopup" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; z-index: 999999; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);">
        <style>
            /* Base Card - COMPACT & NO SCROLLBAR */
            .popup-card { 
                background: #0f172a; 
                border: 1px solid rgba(255, 255, 255, 0.1); 
                border-radius: 24px; 
                width: 90%; 
                max-width: 950px; 
                height: auto; 
                max-height: 85vh; /* Fit within screen */
                box-shadow: 0 25px 50px rgba(0,0,0,0.5); 
                display: grid; 
                grid-template-columns: 1.2fr 1fr; 
                position: relative; 
                color: white;
                overflow: hidden; /* No scrollbars on desktop card */
            }

            .popup-content {
                padding: 40px 35px; /* Compact padding */
                display: flex; 
                flex-direction: column; 
                justify-content: center; /* Center vertically */
                position: relative;
                height: 100%;
            }

            .badge { background: rgba(78, 205, 196, 0.1); color: #4ECDC4; border: 1px solid #4ECDC4; padding: 4px 12px; border-radius: 50px; font-weight: 700; font-size: 0.75rem; letter-spacing: 1px; width: fit-content; margin-bottom: 15px; font-family: 'Plus Jakarta Sans', sans-serif; }
            .pop-h1 { font-family: 'Outfit', sans-serif; font-size: 2.5rem; line-height: 1.1; margin-bottom: 12px; color: white; text-shadow: 0 0 25px rgba(255, 255, 255, 0.5); }
            .pop-desc { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.95rem; opacity: 0.9; margin-bottom: 20px; color: #f8fafc; line-height: 1.5; }
            
            .count-box { text-align: center; background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 8px; min-width: 60px; }
            .count-num { display: block; font-size: 1.3rem; font-weight: 700; color: #fbbf24; font-family: 'Outfit', sans-serif; }
            .count-lbl { font-size: 0.65rem; opacity: 0.6; text-transform: uppercase; color: #cbd5e1; }
            
            .tool-btn { text-decoration: none; color: white; background: rgba(255,255,255,0.05); padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(255, 255, 255, 0.1); font-size: 0.8rem; font-weight: 500; display: flex; align-items: center; gap: 6px; transition: 0.2s; font-family: 'Plus Jakarta Sans', sans-serif; }
            .tool-btn:hover { border-color: #4ECDC4; background: rgba(78, 205, 196, 0.1); }
            .btn-crisis { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; color: #fca5a5; }
            .btn-crisis:hover { background: #ef4444; color: white; border-color: #ef4444; }
            
            .close-btn { position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.1); border: none; color: white; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; z-index: 20; display: flex; align-items: center; justify-content: center; transition: 0.2s; }
            .close-btn:hover { background: #4ECDC4; color: #000; }
            
            /* Phone Mockup */
            .notch { position: absolute; top:0; left:50%; transform:translateX(-50%); width:90px; height:18px; background:#1e293b; border-bottom-left-radius:10px; border-bottom-right-radius:10px; z-index:10; }
            .screen-content { width: 100%; height: 100%; overflow: hidden; background: #0f172a; }
            .site-iframe { width: 100%; height: 100%; border: none; opacity: 0; transition: opacity 0.5s ease; animation: none; } /* No scroll animation for live site */

            .newsletter-box {
                background: rgba(255,255,255,0.03); 
                padding: 12px; 
                border-radius: 10px; 
                margin-bottom: 12px; 
                border: 1px solid rgba(255,255,255,0.05);
                flex-shrink: 0; 
            }

            /* Responsive */
            @media(max-width: 900px) {
                .popup-card { 
                    grid-template-columns: 1fr; 
                    height: auto; 
                    max-height: 85vh; 
                    overflow-y: auto; /* Scroll allowed on mobile */
                    display: block; 
                }
                .popup-visual { display: none !important; }
                .popup-content { padding: 25px 20px; }
                .pop-h1 { font-size: 1.8rem; }
            }
            @media(max-width: 480px) {
                .popup-content { padding: 25px 20px 40px 20px; /* Extra bottom padding for scroll space */ }
                .pop-h1 { font-size: 1.6rem; margin-bottom: 15px; }
                .pop-desc { font-size: 0.9rem; }
                .tool-links { gap: 8px; }
                .tool-btn { width: 100%; justify-content: center; padding: 12px; } 
                .count-box { min-width: 50px; padding: 5px 10px; }
                .badge { margin-bottom: 15px; }
                
                /* Stack Newsletter on Mobile */
                .newsletter-input-group { flex-direction: column; }
                #popupEmail, #btnPopupEmail { width: 100%; padding: 12px !important; }
            }
        </style>

        <div class="popup-card">
            <button class="close-btn" onclick="document.getElementById('launchPopup').style.display='none'"><i class="fas fa-times"></i></button>

            <!-- LEFT CONTENT -->
            <div class="popup-content">
                <div>
                    <span class="badge">Preview Mode</span>
                    <h1 class="pop-h1">We’re building this together.</h1>
                    <p class="pop-desc">
                        You’re seeing an early version of Soulamore.
                        <br>
                        Real-time matching and accounts are being built quietly in the background.
                    </p>

                    <div class="countdown" id="launchCountdown" style="display: flex; gap: 10px; margin-bottom: 20px;">
                        <div class="count-box"><span class="count-num" id="d-days">00</span><span class="count-lbl">Days</span></div>
                        <div class="count-box"><span class="count-num" id="d-hours">00</span><span class="count-lbl">Hours</span></div>
                        <div class="count-box"><span class="count-num" id="d-mins">00</span><span class="count-lbl">Mins</span></div>
                    </div>

                    <div style="margin-bottom: 15px; font-size:0.75rem; opacity:0.8; font-weight:600; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-family: 'Plus Jakarta Sans', sans-serif;">WHILE YOU WAIT:</div>
                    <div class="tool-links" style="display: flex; gap: 8px; margin-bottom: 25px; flex-wrap: wrap;">
                        <a href="/get-help-now.html" class="tool-btn btn-crisis"><i class="fas fa-life-ring"></i> Get Help</a>
                        <a href="/playground.html" class="tool-btn"><i class="fas fa-shapes"></i> Playground</a>
                        <a href="/5-step-reset.html" class="tool-btn"><i class="fas fa-wind"></i> 5-Step Reset</a>
                        <a href="/soulbot.html" class="tool-btn"><i class="fas fa-robot"></i> Soulbot</a>
                        <a href="https://www.instagram.com/soulamore_/" target="_blank" class="tool-btn"><i class="fab fa-instagram"></i> Instagram</a>
                    </div>
                </div>

                <!-- BOTTOM SECTION -->
                <div>
                    <div class="newsletter-box">
                        <div style="font-size: 0.8rem; margin-bottom: 8px; font-weight: 600; color: #e2e8f0;">Get updates when we launch:</div>
                        <div class="newsletter-input-group" style="display: flex; gap: 8px;">
                            <input type="email" id="popupEmail" placeholder="your@email.com" style="flex: 1; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); padding: 8px 12px; border-radius: 8px; color: white; font-family: 'Plus Jakarta Sans', sans-serif; font-size: 0.85rem;">
                            <button onclick="submitPopupEmail()" id="btnPopupEmail" style="background: var(--teal-glow, #4ECDC4); color: #0f172a; border: none; padding: 0 15px; border-radius: 8px; font-weight: 700; cursor: pointer; transition:0.2s; font-size:0.85rem;">Join</button>
                        </div>
                    </div>

                    <div style="font-size:0.75rem; opacity:0.6; color: #cbd5e1; font-family: 'Plus Jakarta Sans', sans-serif;">
                        If you’re a peer or psychologist, reach out at <a href="mailto:contact.soulamore@gmail.com" style="color:#4ECDC4; text-decoration:underline;">contact.soulamore@gmail.com</a>.
                    </div>
                </div>
            </div>

            <!-- RIGHT VISUAL -->
            <div class="popup-visual" style="background: linear-gradient(135deg, rgba(78, 205, 196, 0.1), rgba(0,0,0,0) 50%); display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden;">
                <div class="phone-frame" style="width: 260px; height: 520px; border: 8px solid #1e293b; border-radius: 30px; background: #000; position: relative; box-shadow: 0 20px 40px rgba(0,0,0,0.6); overflow: hidden; transform: translateY(10px);">
                    <div class="notch" style="position: absolute; top:0; left:50%; transform:translateX(-50%); width:90px; height:18px; background:#1e293b; border-bottom-left-radius:10px; border-bottom-right-radius:10px; z-index:10;"></div>
                    <div class="screen-content" style="width: 100%; height: 100%; overflow: hidden; background: #0f172a;">
                       ${iframeHTML}
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

    // 4. Expose Popup Email Submit to Global Scope (since button uses onclick="submitPopupEmail()")
    window.submitPopupEmail = function () {
        const emailEl = document.getElementById('popupEmail');
        const btn = document.getElementById('btnPopupEmail');
        const email = emailEl.value.trim();

        if (!email) return;

        btn.innerText = '...';
        btn.disabled = true;

        // Robust check for the backend function
        const submitFn = (window.SoulBackend && window.SoulBackend.submitNewsletter)
            ? window.SoulBackend.submitNewsletter
            : (window.handleNewsletter ? window.handleNewsletter : null);

        if (submitFn) {
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

            submitFn(email).then(success => {
                if (success) {
                    // Success UI
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    btn.style.background = "#48bb78";
                    emailEl.value = "";

                    // Show success message inside the input placeholder temporarily
                    const originalPlaceholder = emailEl.placeholder;
                    emailEl.placeholder = "Welcome to the family!";

                    setTimeout(() => {
                        document.getElementById('launchPopup').style.display = 'none';
                        // Reset button
                        btn.innerHTML = 'Join';
                        btn.style.background = "var(--teal-glow, #4ECDC4)";
                        btn.disabled = false;
                        emailEl.placeholder = originalPlaceholder;
                    }, 2000);
                } else {
                    btn.innerHTML = 'Err';
                    btn.disabled = false;
                }
            }).catch(e => {
                console.error(e);
                btn.innerHTML = 'Err';
                btn.disabled = false;
            });
        } else {
            // Fallback if backend not ready
            console.warn("Backend not ready");
            btn.innerHTML = 'Err';
            btn.disabled = false;
        }
    };

    // 5. Timer Loop
    setInterval(updateLaunchTimer, 1000);
    updateLaunchTimer();

})(); // END IIFE
