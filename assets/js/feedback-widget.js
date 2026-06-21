/**
 * Feedback Widget
 * Floating feedback button with modal for user feedback
 */

import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Widget state
let isWidgetInitialized = false;
let isModalOpen = false;

/**
 * Initialize feedback widget
 */
export function initFeedbackWidget() {
    if (isWidgetInitialized) return;
    
    // Create floating button
    const button = document.createElement('button');
    button.id = 'feedback-widget-btn';
    button.innerHTML = '<i class="fas fa-comment-dots"></i><span class="feedback-btn-text">Feedback</span>';
    
    // Inject Stylesheet
    const style = document.createElement('style');
    style.id = 'feedback-widget-styles';
    style.textContent = `
        #feedback-widget-btn {
            position: fixed;
            bottom: 100px;
            left: 30px;
            z-index: 9998;
            background: linear-gradient(135deg, #4ECDC4, #F49F75);
            color: #0f172a;
            border: none;
            padding: 12px 20px;
            border-radius: 50px;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(78, 205, 196, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 0.95rem;
        }
        #feedback-widget-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(78, 205, 196, 0.5);
        }
        @media (max-width: 1024px) {
            #feedback-widget-btn {
                bottom: 120px;
                left: auto !important;
                right: 20px;
                width: 50px;
                height: 50px;
                padding: 0;
                border-radius: 50%;
                justify-content: center;
            }
            #feedback-widget-btn .feedback-btn-text {
                display: none;
            }
            #feedback-widget-btn i {
                font-size: 1.25rem;
                margin: 0;
            }
        }
    `;
    document.head.appendChild(style);

    button.onclick = openFeedbackModal;
    
    document.body.appendChild(button);
    
    // Create modal
    createFeedbackModal();
    
    isWidgetInitialized = true;
}

/**
 * Create feedback modal
 */
function createFeedbackModal() {
    const modal = document.createElement('div');
    modal.id = 'feedback-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        background: rgba(0, 0, 0, 0.8);
        backdrop-filter: blur(5px);
        display: none;
        justify-content: center;
        align-items: center;
    `;
    
    modal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95));
            border: 1px solid rgba(78, 205, 196, 0.3);
            border-radius: 20px;
            padding: 40px;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        ">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="
                    font-family: 'Outfit', sans-serif;
                    font-size: 1.8rem;
                    margin: 0;
                    background: linear-gradient(135deg, #4ECDC4, #F49F75);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                ">We Value Your Feedback</h2>
                <button onclick="closeFeedbackModal()" style="
                    background: none;
                    border: none;
                    color: #94a3b8;
                    font-size: 1.5rem;
                    cursor: pointer;
                    transition: 0.3s;
                " onmouseover="this.style.color='white'" onmouseout="this.style.color='#94a3b8'">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <form id="feedback-form" onsubmit="submitFeedback(event)">
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #f1f5f9; font-weight: 500;">
                        How was your experience?
                    </label>
                    <div id="star-rating-container" style="display: flex; gap: 10px; font-size: 2rem;">
                        ${[1, 2, 3, 4, 5].map(num => `
                            <input type="radio" name="rating" value="${num}" id="rating${num}" style="display: none;">
                            <label for="rating${num}" class="feedback-star" data-value="${num}" style="
                                cursor: pointer;
                                transition: 0.3s;
                                opacity: 0.3;
                                color: #fbbf24;
                            ">
                                <i class="fas fa-star"></i>
                            </label>
                        `).join('')}
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #f1f5f9; font-weight: 500;">
                        Your Feedback
                    </label>
                    <textarea name="feedback" required style="
                        width: 100%;
                        min-height: 150px;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 12px;
                        padding: 15px;
                        color: #f1f5f9;
                        font-family: 'Plus Jakarta Sans', sans-serif;
                        font-size: 1rem;
                        resize: vertical;
                        outline: none;
                    " placeholder="Share your thoughts, suggestions, or concerns..."></textarea>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #f1f5f9; font-weight: 500;">
                        Email (optional)
                    </label>
                    <input type="email" name="email" style="
                        width: 100%;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 12px;
                        padding: 12px;
                        color: #f1f5f9;
                        font-family: 'Plus Jakarta Sans', sans-serif;
                        font-size: 1rem;
                        outline: none;
                    " placeholder="Your email for follow-up">
                </div>
                
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 8px; color: #f1f5f9; font-weight: 500;">
                        Attach a photo if you want (optional)
                    </label>
                    <input type="file" id="feedback-photo" accept="image/*" style="
                        width: 100%;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 12px;
                        padding: 12px;
                        color: #f1f5f9;
                        font-family: 'Plus Jakarta Sans', sans-serif;
                        font-size: 0.9rem;
                        outline: none;
                        cursor: pointer;
                    ">
                </div>
                
                <button type="submit" style="
                    width: 100%;
                    background: linear-gradient(135deg, #4ECDC4, #F49F75);
                    color: #0f172a;
                    border: none;
                    padding: 14px;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(78, 205, 196, 0.4)'" 
                   onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <i class="fas fa-paper-plane"></i> Send Feedback
                </button>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);

    // Add star interactivity
    const stars = modal.querySelectorAll('.feedback-star');
    const ratingInputs = modal.querySelectorAll('input[name="rating"]');

    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const val = parseInt(this.getAttribute('data-value'));
            stars.forEach(s => {
                const sVal = parseInt(s.getAttribute('data-value'));
                s.style.opacity = sVal <= val ? '1' : '0.3';
            });
        });

        star.addEventListener('mouseout', function() {
            const checked = modal.querySelector('input[name="rating"]:checked');
            const val = checked ? parseInt(checked.value) : 0;
            stars.forEach(s => {
                const sVal = parseInt(s.getAttribute('data-value'));
                s.style.opacity = sVal <= val ? '1' : '0.3';
            });
        });
    });

    ratingInputs.forEach(input => {
        input.addEventListener('change', function() {
            const val = parseInt(this.value);
            stars.forEach(s => {
                const sVal = parseInt(s.getAttribute('data-value'));
                s.style.opacity = sVal <= val ? '1' : '0.3';
            });
        });
    });
}

/**
 * Open feedback modal
 */
window.openFeedbackModal = function() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
        modal.style.display = 'flex';
        isModalOpen = true;
    }
};

/**
 * Close feedback modal
 */
window.closeFeedbackModal = function() {
    const modal = document.getElementById('feedback-modal');
    if (modal) {
        modal.style.display = 'none';
        isModalOpen = false;
    }
};

/**
 * Compress and resize uploaded image helper
 */
function compressImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height);
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                const dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.onerror = (err) => reject(err);
        };
        reader.onerror = (err) => reject(err);
    });
}

/**
 * Submit feedback
 */
window.submitFeedback = async function(event) {
    event.preventDefault();
    
    const form = event.target;
    const rating = form.querySelector('input[name="rating"]:checked')?.value;
    const feedback = form.querySelector('textarea[name="feedback"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const photoFile = form.querySelector('#feedback-photo')?.files[0];
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    let photoBase64 = null;
    if (photoFile) {
        try {
            photoBase64 = await compressImage(photoFile, 800, 800, 0.7);
        } catch (err) {
            console.warn("Failed to compress image, skipping:", err);
        }
    }
    
    try {
        await addDoc(collection(db, 'feedback'), {
            rating: rating ? parseInt(rating) : null,
            feedback: feedback,
            email: email || null,
            photo: photoBase64,
            createdAt: new Date(),
            userAgent: navigator.userAgent,
            page: window.location.href
        });
        
        if (window.notify) {
            window.notify('Thank you for your feedback!', 'success');
        } else {
            alert('Thank you for your feedback!');
        }
        
        closeFeedbackModal();
        form.reset();
    } catch (error) {
        console.error('Error submitting feedback:', error);
        if (window.notify) {
            window.notify('Failed to submit feedback. Please try again.', 'error');
        } else {
            alert('Failed to submit feedback. Please try again.');
        }
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
};

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isModalOpen) {
        closeFeedbackModal();
    }
});

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFeedbackWidget);
} else {
    initFeedbackWidget();
}
