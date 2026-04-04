/**
 * Dashboard Loading Screen Manager
 * Shows emotional, time-based loading messages with progress
 * 
 * Usage:
 * const loader = new DashboardLoader('admin');
 * loader.show();
 * // ... load data ...
 * loader.complete();
 */

class DashboardLoader {
    constructor(type = 'user') {
        this.type = type;
        this.screen = null;
        this.progress = 0;
        this.interval = null;
        
        this.messages = {
            admin: {
                morning: { title: 'Good Morning', subtitle: 'Starting the day with clarity and purpose' },
                afternoon: { title: 'Good Afternoon', subtitle: 'Midday check-in with your community' },
                evening: { title: 'Good Evening', subtitle: 'Reflecting on today\'s impact' },
                night: { title: 'Good Night', subtitle: 'The community rests, your work matters' }
            },
            user: {
                morning: { title: 'Good Morning', subtitle: 'Today is a fresh start for positive changes' },
                afternoon: { title: 'Afternoon Reminder', subtitle: 'You\'re making a difference' },
                evening: { title: 'Evening Reflection', subtitle: 'Thank you for showing up today' },
                night: { title: 'Night Mode', subtitle: 'Rest is part of the journey' }
            },
            peer: {
                morning: { title: 'Good Morning', subtitle: 'Ready to hold space for others today?' },
                afternoon: { title: 'Midday Check-in', subtitle: 'Your presence matters to the community' },
                evening: { title: 'Evening Reflection', subtitle: 'You made a difference today' },
                night: { title: 'Night Shift', subtitle: 'Thank you for being available' }
            },
            psych: {
                morning: { title: 'Good Morning', subtitle: 'Patterns take time to reveal themselves' },
                afternoon: { title: 'Midday', subtitle: 'Clarity often begins with deep listening' },
                evening: { title: 'Evening', subtitle: 'Every story has layers worth understanding' },
                night: { title: 'Night', subtitle: 'The mind processes in quiet moments' }
            }
        };
        
        this.tips = {
            admin: [
                { icon: '🛡️', text: 'Your secure admin space is being prepared...' },
                { icon: '📊', text: 'Gathering analytics and insights...' },
                { icon: '👥', text: 'Loading user data and content queues...' },
                { icon: '✨', text: 'Almost ready! Preparing your dashboard...' }
            ],
            user: [
                { icon: '🌿', text: 'Your safe space is being prepared...' },
                { icon: '💙', text: 'You are not alone here...' },
                { icon: '🌸', text: 'Take a deep breath... almost ready...' },
                { icon: '✨', text: 'Your dashboard is almost ready...' }
            ],
            peer: [
                { icon: '🍑', text: 'Preparing your supporter tools...' },
                { icon: '🤝', text: 'Loading your impact metrics...' },
                { icon: '💙', text: 'Gathering testimonials...' },
                { icon: '✨', text: 'Almost ready to make a difference...' }
            ],
            psych: [
                { icon: '🌊', text: 'Preparing your practice dashboard...' },
                { icon: '🧠', text: 'Loading client insights...' },
                { icon: '📊', text: 'Gathering practice statistics...' },
                { icon: '✨', text: 'Your professional space is almost ready...' }
            ]
        };
    }
    
    getTimeBasedMessage() {
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }
    
    show() {
        const timeOfDay = this.getTimeBasedMessage();
        const message = this.messages[this.type][timeOfDay];
        const tipList = this.tips[this.type];
        
        // Create loading screen HTML
        const html = `
            <div id="${this.type}-loading-screen" style="
                position: fixed;
                inset: 0;
                background: linear-gradient(135deg, ${this.getBackgroundGradient()});
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                transition: opacity 0.3s ease;
            ">
                ${this.getAnimation()}
                <div style="text-align: center; margin-top: 30px; max-width: 400px; padding: 0 20px;">
                    <h2 id="loading-title" style="
                        font-size: 1.5rem;
                        color: ${this.getTextColor()};
                        margin-bottom: 10px;
                        font-weight: 600;
                    ">${message.title}</h2>
                    <p id="loading-subtitle" style="
                        font-size: 1rem;
                        color: ${this.getTextColorSecondary()};
                        margin-bottom: 20px;
                    ">${message.subtitle}</p>
                    <div style="
                        width: 100%;
                        height: 4px;
                        background: rgba(255,255,255,0.1);
                        border-radius: 2px;
                        overflow: hidden;
                    ">
                        <div id="loading-progress" style="
                            width: 0%;
                            height: 100%;
                            background: linear-gradient(90deg, ${this.getAccentColor()});
                            transition: width 0.2s ease;
                            border-radius: 2px;
                        "></div>
                    </div>
                    <div id="loading-tip" style="
                        margin-top: 20px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 10px;
                        font-size: 0.9rem;
                        color: ${this.getTextColorSecondary()};
                    ">
                        <span id="tip-icon" style="font-size: 1.2rem;">🌟</span>
                        <span id="tip-text">${tipList[0].text}</span>
                    </div>
                </div>
            </div>
        `;
        
        // Add to page
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        this.screen = tempDiv.firstElementChild;
        document.body.appendChild(this.screen);
        
        // Start progress animation
        this.startProgress();
        
        // Rotate tips
        this.rotateTips(tipList);
    }
    
    complete() {
        if (!this.screen) return;
        
        // Set progress to 100%
        const progressBar = document.getElementById('loading-progress');
        if (progressBar) progressBar.style.width = '100%';
        
        // Fade out
        setTimeout(() => {
            this.screen.style.opacity = '0';
            setTimeout(() => {
                this.screen.remove();
                this.screen = null;
            }, 300);
        }, 500);
        
        // Stop animations
        if (this.interval) clearInterval(this.interval);
    }
    
    startProgress() {
        this.progress = 0;
        this.interval = setInterval(() => {
            this.progress += Math.random() * 15;
            if (this.progress > 90) this.progress = 90;
            
            const progressBar = document.getElementById('loading-progress');
            if (progressBar) progressBar.style.width = `${this.progress}%`;
        }, 300);
    }
    
    rotateTips(tipList) {
        let tipIndex = 0;
        setInterval(() => {
            tipIndex = (tipIndex + 1) % tipList.length;
            const iconEl = document.getElementById('tip-icon');
            const textEl = document.getElementById('tip-text');
            
            if (iconEl && textEl) {
                textEl.style.opacity = '0';
                setTimeout(() => {
                    textEl.textContent = tipList[tipIndex].text;
                    iconEl.textContent = tipList[tipIndex].icon;
                    textEl.style.opacity = '1';
                }, 300);
            }
        }, 4000);
    }
    
    getBackgroundGradient() {
        const gradients = {
            admin: '#0f172a, #1e293b',
            user: '#f5f0eb, #e8e4dc',
            peer: '#fdf6f2, #f9ebe5',
            psych: '#f0f7f6, #e8f4f2'
        };
        return gradients[this.type] || gradients.user;
    }
    
    getTextColor() {
        const colors = {
            admin: '#f1f5f9',
            user: '#4a5568',
            peer: '#4a5568',
            psych: '#4a5568'
        };
        return colors[this.type] || '#4a5568';
    }
    
    getTextColorSecondary() {
        const colors = {
            admin: '#94a3b8',
            user: '#718096',
            peer: '#718096',
            psych: '#718096'
        };
        return colors[this.type] || '#718096';
    }
    
    getAccentColor() {
        const colors = {
            admin: '#6366f1, #4f46e5',
            user: '#8b9888, #5d6d5a',
            peer: '#f49f75, #ea580c',
            psych: '#4ecdc4, #14b8a6'
        };
        return colors[this.type] || colors.user;
    }
    
    getAnimation() {
        const animations = {
            admin: `
                <div style="
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 12px;
                    margin-bottom: 20px;
                ">
                    ${[1,2,3,4,5,6].map(i => `
                        <div style="
                            width: 60px;
                            height: 60px;
                            background: rgba(255,255,255,0.05);
                            border-radius: 12px;
                            animation: shimmer 1.5s infinite;
                            animation-delay: ${i * 0.1}s;
                        "></div>
                    `).join('')}
                </div>
                <style>@keyframes shimmer {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.8; }
                }</style>
            `,
            user: `
                <div style="
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: rgba(139, 152, 136, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    animation: breathe 8s infinite ease-in-out;
                    margin-bottom: 20px;
                ">🌿</div>
                <style>@keyframes breathe {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }</style>
            `,
            peer: `
                <div style="
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: rgba(244, 159, 117, 0.2);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                    animation: pulse 2s infinite;
                    margin-bottom: 20px;
                ">🍑</div>
                <style>@keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.8; }
                    50% { transform: scale(1.05); opacity: 1; }
                }</style>
            `,
            psych: `
                <div style="
                    width: 100px;
                    height: 60px;
                    background: rgba(78, 205, 196, 0.2);
                    border-radius: 30px;
                    animation: wave 3s infinite ease-in-out;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 2rem;
                ">🌊</div>
                <style>@keyframes wave {
                    0%, 100% { transform: scaleX(1); }
                    50% { transform: scaleX(1.2); }
                }</style>
            `
        };
        return animations[this.type] || animations.user;
    }
}

// Export for use in dashboards
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DashboardLoader;
} else {
    window.DashboardLoader = DashboardLoader;
}

console.log('✅ Dashboard Loader loaded');
