/**
 * Toast Notification System
 */
let toastContainer = null;

function initToastContainer() {
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = 'position:fixed;top:20px;right:20px;z-index:9999;display:flex;flex-direction:column;gap:10px;pointer-events:none;';
        document.body.appendChild(toastContainer);
    }
}

export function showToast(message, type = 'info', duration = 4000) {
    initToastContainer();
    const toast = document.createElement('div');
    const colors = { success: 'rgba(16,185,129,0.95)', error: 'rgba(239,68,68,0.95)', warning: 'rgba(251,191,36,0.95)', info: 'rgba(78,205,196,0.95)' };
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    
    toast.style.cssText = `background:${colors[type]};color:white;padding:15px 20px;border-radius:12px;box-shadow:0 8px 20px rgba(0,0,0,0.3);display:flex;align-items:center;gap:12px;min-width:300px;max-width:500px;animation:slideIn 0.3s ease;pointer-events:auto;cursor:pointer;`;
    toast.innerHTML = `<i class="fas ${icons[type]}" style="font-size:1.2rem;"></i><span style="flex:1;font-weight:500;">${message}</span><i class="fas fa-times" onclick="this.parentElement.remove()" style="cursor:pointer;opacity:0.7;"></i>`;
    
    toastContainer.appendChild(toast);
    setTimeout(() => { toast.style.animation = 'slideOut 0.3s ease'; setTimeout(() => toast.remove(), 300); }, duration);
    toast.addEventListener('click', (e) => { if (!e.target.classList.contains('fa-times')) { toast.style.animation = 'slideOut 0.3s ease'; setTimeout(() => toast.remove(), 300); } });
}

window.notify = showToast;
window.notifySuccess = (msg) => showToast(msg, 'success');
window.notifyError = (msg) => showToast(msg, 'error');
window.notifyWarning = (msg) => showToast(msg, 'warning');
window.notifyInfo = (msg) => showToast(msg, 'info');

if (!document.getElementById('toast-animations')) {
    const style = document.createElement('style');
    style.id = 'toast-animations';
    style.textContent = '@keyframes slideIn{from{transform:translateX(400px);opacity:0;}to{transform:translateX(0);opacity:1;}}@keyframes slideOut{from{transform:translateX(0);opacity:1;}to{transform:translateX(400px);opacity:0;}}';
    document.head.appendChild(style);
}

if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initToastContainer); } else { initToastContainer(); }
