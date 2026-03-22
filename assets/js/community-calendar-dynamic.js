/**
 * Community Calendar - Dynamic Firebase Integration
 * Loads events from Firestore and displays them dynamically
 */

import { db, collection, getDocs, query, orderBy } from '../assets/js/firebase-config.js';

// Event categories with icons and colors
const EVENT_CATEGORIES = {
    'support-group': { icon: 'fa-users', color: 'var(--teal-glow)' },
    'workshop': { icon: 'fa-pen-nib', color: 'var(--peach-glow)' },
    'social': { icon: 'fa-coffee', color: 'var(--gold-glow)' },
    'other': { icon: 'fa-calendar', color: 'var(--starlight)' }
};

/**
 * Load all upcoming events from Firestore
 */
export async function loadCommunityEvents() {
    try {
        const eventsRef = collection(db, 'community_events');
        const q = query(eventsRef, orderBy('date', 'asc'));
        const snapshot = await getDocs(q);
        
        const events = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            events.push({
                id: doc.id,
                ...data,
                date: data.date?.toDate ? data.date.toDate() : new Date(data.date),
                category: data.category || 'other'
            });
        });
        
        return events.filter(event => {
            // Only show future events or events happening today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return event.date >= today;
        });
    } catch (error) {
        console.error('Error loading events:', error);
        return [];
    }
}

/**
 * Render events to the calendar page
 */
export async function renderCalendarEvents() {
    const eventsContainer = document.getElementById('eventsContainer');
    if (!eventsContainer) return;
    
    eventsContainer.innerHTML = '<div style="text-align:center; padding:40px;"><i class="fas fa-spinner fa-spin" style="font-size:2rem; color:var(--teal-glow);"></i><p>Loading events...</p></div>';
    
    const events = await loadCommunityEvents();
    
    if (events.length === 0) {
        eventsContainer.innerHTML = `
            <div style="text-align:center; padding:40px; color:var(--starlight); opacity:0.8;">
                <i class="fas fa-calendar-times" style="font-size:3rem; margin-bottom:20px; color:var(--teal-glow);"></i>
                <h3 style="margin-bottom:15px;">No Upcoming Events</h3>
                <p>Check back soon for new events and support groups!</p>
            </div>
        `;
        return;
    }
    
    // Group events by type
    const supportGroups = events.filter(e => e.type === 'support-group');
    const workshops = events.filter(e => e.type === 'workshop');
    const socialEvents = events.filter(e => e.type === 'social');
    const otherEvents = events.filter(e => e.type === 'other' || !e.type);
    
    let html = '';
    
    // Render Support Groups
    if (supportGroups.length > 0) {
        html += '<h2 style="margin:40px 0 20px; color:var(--teal-glow);"><i class="fas fa-users"></i> Support Groups</h2>';
        supportGroups.forEach(event => {
            html += renderEventCard(event);
        });
    }
    
    // Render Workshops
    if (workshops.length > 0) {
        html += '<h2 style="margin:40px 0 20px; color:var(--peach-glow);"><i class="fas fa-pen-nib"></i> Workshops</h2>';
        workshops.forEach(event => {
            html += renderEventCard(event);
        });
    }
    
    // Render Social Events
    if (socialEvents.length > 0) {
        html += '<h2 style="margin:40px 0 20px; color:var(--gold-glow);"><i class="fas fa-coffee"></i> Social Events</h2>';
        socialEvents.forEach(event => {
            html += renderEventCard(event);
        });
    }
    
    // Render Other Events
    if (otherEvents.length > 0) {
        html += '<h2 style="margin:40px 0 20px;"><i class="fas fa-calendar"></i> Other Events</h2>';
        otherEvents.forEach(event => {
            html += renderEventCard(event);
        });
    }
    
    eventsContainer.innerHTML = html;
}

/**
 * Render a single event card
 */
function renderEventCard(event) {
    const category = EVENT_CATEGORIES[event.category] || EVENT_CATEGORIES['other'];
    const dateStr = event.date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
    const timeStr = event.time || 'Time TBD';
    
    return `
        <div class="event-card fade-in" style="margin-bottom:20px;">
            <div class="event-icon-box" style="color:${category.color};">
                <i class="fas ${category.icon}"></i>
            </div>
            <div>
                <div class="event-title">${event.title}</div>
                <div class="event-meta">
                    <span><i class="far fa-calendar"></i> ${dateStr}</span>
                    <span><i class="far fa-clock"></i> ${timeStr}</span>
                </div>
                <div class="event-desc">${event.description || ''}</div>
                ${event.feel ? `<div class="event-feel">${event.feel}</div>` : ''}
                ${event.link ? `
                    <button class="remind-btn" onclick="window.open('${event.link}', '_blank')">
                        <i class="fas fa-external-link-alt"></i> Join Event
                    </button>
                ` : `
                    <button class="remind-btn" onclick="toggleRemind(this)">
                        <i class="far fa-bell"></i> Remind me gently
                    </button>
                `}
            </div>
        </div>
    `;
}

/**
 * Toggle reminder for event (placeholder - can be enhanced with actual reminders)
 */
window.toggleRemind = function(btn) {
    const icon = btn.querySelector('i');
    if (icon.classList.contains('far')) {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.innerHTML = '<i class="fas fa-bell-slash"></i> Reminder set';
        btn.style.background = 'rgba(78, 205, 196, 0.2)';
        
        // Show notification
        if (window.notify) {
            window.notify('Reminder set! We\'ll remind you gently.', 'success');
        } else {
            alert('Reminder set! (This is a demo - full reminder system coming soon)');
        }
    } else {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.innerHTML = '<i class="far fa-bell"></i> Remind me gently';
        btn.style.background = '';
    }
};

// Auto-load events when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderCalendarEvents);
} else {
    renderCalendarEvents();
}
