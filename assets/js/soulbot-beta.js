// Soulbot Beta Integration Script
// Injects the Soulbot AI popup into any page (Index, etc.)

document.addEventListener('DOMContentLoaded', () => {
    // 0. CHECK FOR DUPLICATES
    if (document.getElementById('soulbot-trigger-btn')) {
        console.log("SoulBot already injected.");
        return;
    }

    // 0. Determine Path to Soulbot.html based on current location
    // Heuristic: If we are in a subfolder (campus, join-us, etc), go up one level.
    const pathDepth = window.location.pathname.split('/').length - 1;
    const isSubPage = window.location.pathname.includes('/campus/') ||
        window.location.pathname.includes('/join-us/') ||
        window.location.pathname.includes('/soulamore-away/') ||
        window.location.pathname.includes('/our-peers/') ||
        window.location.pathname.includes('/confession-box/') ||
        window.location.pathname.includes('/Login Pages/');

    const basePath = isSubPage ? '../' : '';
    const soulbotUrl = basePath + 'Soulbot.html?embed=true';

    // 1. Create the floating trigger button
    const triggerBtn = document.createElement('div');
    triggerBtn.id = 'soulbot-trigger-btn'; // ID for duplicate check
    triggerBtn.className = 'soulbot-beta-trigger';
    triggerBtn.innerHTML = '<i class="fas fa-robot"></i>';
    triggerBtn.title = "Chat with SoulBot (Beta)";
    triggerBtn.style.cssText = `
        position: fixed;
        bottom: 110px; 
        right: 30px;
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #0f172a, #1e293b);
        border: 1px solid #4ECDC4;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 10px 30px rgba(78, 205, 196, 0.3);
        transition: transform 0.3s;
        color: #4ECDC4;
        font-size: 1.5rem;
    `;

    // Hover Effect
    triggerBtn.onmouseenter = () => triggerBtn.style.transform = 'scale(1.1)';
    triggerBtn.onmouseleave = () => triggerBtn.style.transform = 'scale(1)';

    // 2. Create the Iframe Container (Hidden by default)
    const chatFrame = document.createElement('iframe');
    chatFrame.id = 'soulbot-chat-frame';
    chatFrame.src = soulbotUrl;
    chatFrame.style.cssText = `
        position: fixed;
        bottom: 180px;
        right: 30px;
        width: 380px;
        height: 600px;
        max-height: 70vh;
        border: none;
        border-radius: 24px;
        z-index: 9999;
        box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        opacity: 0;
        pointer-events: none;
        transform: translateY(20px);
        transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    `;

    // 3. Toggle Logic
    let isOpen = false;

    // GLOBAL FUNCTION to open from other buttons
    window.openSoulbot = function () {
        if (isOpen) return; // Already open
        toggleState();
    }

    function toggleState() {
        isOpen = !isOpen;
        if (isOpen) {
            chatFrame.style.opacity = '1';
            chatFrame.style.pointerEvents = 'all';
            chatFrame.style.transform = 'translateY(0)';
            triggerBtn.innerHTML = '<i class="fas fa-times"></i>';
        } else {
            chatFrame.style.opacity = '0';
            chatFrame.style.pointerEvents = 'none';
            chatFrame.style.transform = 'translateY(20px)';
            triggerBtn.innerHTML = '<i class="fas fa-robot"></i>';
        }
    }

    triggerBtn.onclick = toggleState;

    // 4. Inject into Body
    document.body.appendChild(triggerBtn);
    document.body.appendChild(chatFrame);

    // 5. Responsive Logic (Handle Resize)
    function handleResize() {
        if (window.innerWidth < 500) {
            chatFrame.style.width = '100%';
            chatFrame.style.height = '100%';
            chatFrame.style.bottom = '0';
            chatFrame.style.right = '0';
            chatFrame.style.borderRadius = '0';
            chatFrame.style.maxHeight = '100vh';
        } else {
            chatFrame.style.width = '380px';
            chatFrame.style.height = '600px';
            chatFrame.style.bottom = '180px';
            chatFrame.style.right = '30px';
            chatFrame.style.borderRadius = '24px';
            chatFrame.style.maxHeight = '70vh';
        }
    }

    // Run on load and resize
    handleResize();
    window.addEventListener('resize', handleResize);
});
