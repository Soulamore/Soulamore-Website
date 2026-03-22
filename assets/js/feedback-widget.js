/**
 * Feedback Widget
 */
import { db, collection, addDoc } from '../assets/js/firebase-config.js';

export function initFeedbackWidget() {
    const button = document.createElement('button');
    button.id = 'feedback-widget-btn';
    button.innerHTML = '<i class="fas fa-comment-dots"></i> Feedback';
    button.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9998;background:linear-gradient(135deg,#4ECDC4,#F49F75);color:#0f172a;border:none;padding:12px 20px;border-radius:50px;font-weight:600;cursor:pointer;box-shadow:0 4px 15px rgba(78,205,196,0.4);transition:all 0.3s ease;display:flex;align-items:center;gap:8px;font-size:0.95rem;';
    button.onmouseover = function() { this.style.transform = 'translateY(-3px)'; this.style.boxShadow = '0 6px 20px rgba(78,205,196,0.5)'; };
    button.onmouseout = function() { this.style.transform = 'translateY(0)'; this.style.boxShadow = '0 4px 15px rgba(78,205,196,0.4)'; };
    button.onclick = openFeedbackModal;
    document.body.appendChild(button);
    createFeedbackModal();
}

function createFeedbackModal() {
    const modal = document.createElement('div');
    modal.id = 'feedback-modal';
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:9999;background:rgba(0,0,0,0.8);backdrop-filter:blur(5px);display:none;justify-content:center;align-items:center;';
    modal.innerHTML = `<div style="background:linear-gradient(135deg,rgba(30,41,59,0.95),rgba(15,23,42,0.95));border:1px solid rgba(78,205,196,0.3);border-radius:20px;padding:40px;max-width:500px;width:90%;max-height:90vh;overflow-y:auto;box-shadow:0 20px 50px rgba(0,0,0,0.5);"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:25px;"><h2 style="font-family:'Outfit',sans-serif;font-size:1.8rem;margin:0;background:linear-gradient(135deg,#4ECDC4,#F49F75);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">We Value Your Feedback</h2><button onclick="closeFeedbackModal()" style="background:none;border:none;color:#94a3b8;font-size:1.5rem;cursor:pointer;transition:0.3s;" onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'"><i class="fas fa-times"></i></button></div><form id="feedback-form" onsubmit="submitFeedback(event)"><div style="margin-bottom:20px;"><label style="display:block;margin-bottom:8px;color:#f1f5f9;font-weight:500;">How was your experience?</label><div style="display:flex;gap:10px;font-size:2rem;">${[1,2,3,4,5].map(num => `<input type="radio" name="rating" value="${num}" id="rating${num}" style="display:none;"><label for="rating${num}" style="cursor:pointer;transition:0.3s;opacity:0.5;" onmouseover="this.style.opacity='1'" onmouseout="this.style.opacity='0.5'"><i class="fas fa-star" style="color:#fbbf24;"></i></label>`).join('')}</div></div><div style="margin-bottom:20px;"><label style="display:block;margin-bottom:8px;color:#f1f5f9;font-weight:500;">Your Feedback</label><textarea name="feedback" required style="width:100%;min-height:150px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:15px;color:#f1f5f9;font-family:inherit;font-size:1rem;resize:vertical;outline:none;" placeholder="Share your thoughts..."></textarea></div><div style="margin-bottom:20px;"><label style="display:block;margin-bottom:8px;color:#f1f5f9;font-weight:500;">Email (optional)</label><input type="email" name="email" style="width:100%;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:12px;color:#f1f5f9;font-family:inherit;font-size:1rem;outline:none;" placeholder="Your email for follow-up"></div><button type="submit" style="width:100%;background:linear-gradient(135deg,#4ECDC4,#F49F75);color:#0f172a;border:none;padding:14px;border-radius:50px;font-weight:600;font-size:1rem;cursor:pointer;transition:all 0.3s ease;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(78,205,196,0.4)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'"><i class="fas fa-paper-plane"></i> Send Feedback</button></form></div>`;
    document.body.appendChild(modal);
}

window.openFeedbackModal = function() { const modal = document.getElementById('feedback-modal'); if (modal) { modal.style.display = 'flex'; } };
window.closeFeedbackModal = function() { const modal = document.getElementById('feedback-modal'); if (modal) { modal.style.display = 'none'; } };

window.submitFeedback = async function(event) {
    event.preventDefault();
    const form = event.target;
    const rating = form.querySelector('input[name="rating"]:checked')?.value;
    const feedback = form.querySelector('textarea[name="feedback"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    try {
        await addDoc(collection(db, 'feedback'), { rating: rating ? parseInt(rating) : null, feedback: feedback, email: email || null, createdAt: new Date(), userAgent: navigator.userAgent, page: window.location.href });
        if (window.notify) { window.notify('Thank you for your feedback!', 'success'); }
        closeFeedbackModal();
        form.reset();
    } catch (error) {
        console.error('Error submitting feedback:', error);
        if (window.notify) { window.notify('Failed to submit feedback. Please try again.', 'error'); }
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
};

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeFeedbackModal(); } });
if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', initFeedbackWidget); } else { initFeedbackWidget(); }
