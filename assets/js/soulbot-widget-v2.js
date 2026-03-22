/**
 * SOULBOT WIDGET V2 (Standalone)
 * Extracted from components.js for use in Dashboards
 */

(function () {
    console.log("SoulBot Widget V2: Initializing...");

    // 1. Avoid Double Injection
    if (document.getElementById('soulbot-widget')) {
        console.warn("SoulBot Widget already exists.");
        return;
    }

    // 2. Hide on SoulBot Page (it has its own full UI)
    if (window.location.pathname.includes('soulbot.html')) return;

    // 3. Create the widget element
    const widget = document.createElement('div');
    widget.id = 'soulbot-widget';

    // 4. Inject HTML & CSS
    widget.innerHTML = `
        <style>
            /* Scoped Styles for SoulBot Widget */
            #soulbot-widget-container {
                position: fixed;
                bottom: 80px; /* Matched with Play Audio button to avoid ticker overlap comfortably */
                right: 30px;
                z-index: 10000; /* High Z-index */
                font-family: 'Plus Jakarta Sans', sans-serif;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                pointer-events: none; /* Let clicks pass through container area */
            }
            
            /* Enable pointer events for children */
            #soulbot-widget-fab, #sb-window {
                pointer-events: auto;
            }

            #soulbot-widget-fab {
                width: 60px;
                height: 60px;
                background: var(--teal-glow, #4ECDC4);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                border: 2px solid rgba(255,255,255,0.2);
            }
            #soulbot-widget-fab:hover {
                transform: scale(1.1) rotate(10deg);
                box-shadow: 0 15px 40px rgba(78, 205, 196, 0.4);
            }
            #soulbot-widget-fab i {
                color: #0f172a;
                font-size: 1.8rem;
                transition: transform 0.3s;
            }
            #soulbot-widget-fab:hover i { transform: scale(1.1); }

            #sb-window {
                width: 350px;
                height: 500px;
                background: #0f172a;
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 24px;
                margin-bottom: 20px;
                display: none; /* Hidden by default */
                flex-direction: column;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0,0,0,0.5);
                backdrop-filter: blur(20px);
                animation: sbSlideUp 0.3s ease-out;
            }
            @keyframes sbSlideUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
            
            .sb-header { background: rgba(30, 41, 59, 0.9); padding: 15px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
            .sb-body { flex: 1; padding: 15px; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; background: rgba(15, 23, 42, 0.95); }
            .sb-footer { padding: 15px; background: rgba(30, 41, 59, 0.9); display: flex; gap: 10px; }
            .sb-input { flex: 1; background: rgba(255,255,255,0.05); border: none; padding: 10px 15px; border-radius: 20px; color: white; outline: none; }
            .sb-send { background: #4ECDC4; color: #0f172a; border: none; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
            
            .sb-msg { max-width: 80%; padding: 8px 12px; border-radius: 12px; font-size: 0.9rem; }
            .sb-msg-bot { background: rgba(255,255,255,0.05); align-self: flex-start; color: #e2e8f0; }
            .sb-msg-user { background: #2dd4bf; align-self: flex-end; color: #0f172a; }

            /* MOBILE TWEAKS (Aligned with components.js) */
            @media (max-width: 1024px) {
                #soulbot-widget-container { display: none !important; visibility: hidden !important; }
                #soulbot-widget-fab { display: none !important; visibility: hidden !important; pointer-events: none !important; }
                #sb-window { display: none !important; }
            }
        </style>
        
        <div id="soulbot-widget-container">
            <div id="sb-window">
                <div class="sb-header">
                    <span style="font-weight:700; color:white;"><i class="fas fa-robot" style="color:#4ECDC4;"></i> SoulBot</span>
                    <i class="fas fa-expand-alt" style="cursor:pointer; color: #94a3b8;" title="Full Screen" onclick="window.location.href='../tools/soulbot.html'"></i>
                </div>
                <div class="sb-body" id="sb-chat-body">
                    <div class="sb-msg sb-msg-bot">Hi there. I'm here if you need to untangle a thought.</div>
                </div>
                <div class="sb-footer">
                    <input type="text" class="sb-input" id="sb-input" placeholder="Type here..." onkeypress="handleWidgetEnter(event)">
                    <button class="sb-send" onclick="sendWidgetMessage()"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
            <div id="soulbot-widget-fab" onclick="toggleWidget()">
                <i class="fas fa-robot"></i>
            </div>
        </div>
    `;
    document.body.appendChild(widget);

    // 5. Global Functions (window scoped)

    window.toggleWidget = function () {
        const win = document.getElementById('sb-window');
        const fab = document.getElementById('soulbot-widget-fab');
        if (win.style.display === 'flex') {
            win.style.display = 'none';
            fab.innerHTML = '<i class="fas fa-robot"></i>';
        } else {
            win.style.display = 'flex';
            fab.innerHTML = '<i class="fas fa-times"></i>';
            document.getElementById('sb-input').focus();
        }
    };

    window.handleWidgetEnter = function (e) {
        if (e.key === 'Enter') sendWidgetMessage();
    };

    window.sendWidgetMessage = function () {
        const input = document.getElementById('sb-input');
        const text = input.value.trim();
        if (!text) return;

        // Add User Msg
        appendWidgetMsg(text, 'user');
        input.value = '';

        // Simulate Bot Response
        setTimeout(() => {
            appendWidgetMsg("I'm listening. This is a secure space.", 'bot');

            // Optional: Upsell full experience periodically
            if (Math.random() > 0.7) {
                setTimeout(() => {
                    appendWidgetMsg("For a deeper conversation, try the full SoulBot page.", 'bot');
                }, 1500);
            }
        }, 800);
    };

    function appendWidgetMsg(text, sender) {
        const body = document.getElementById('sb-chat-body');
        const div = document.createElement('div');
        div.className = `sb-msg sb-msg-${sender}`;
        div.innerText = text;
        body.appendChild(div);
        body.scrollTop = body.scrollHeight;
    }

})();
