/**
 * Peer Availability Management - IMMEDIATE LOAD
 */

import { db, auth } from "../assets/js/firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { isPeer } from "../assets/js/role-helper.js";

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_LABELS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
let currentAvailabilityPeer = [];

// Inline functions (no dependency on peer-booking-handler)
async function getPeerAvailability(peerId) {
    try {
        const docRef = doc(db, "peer_availability", peerId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) return { id: docSnap.id, ...docSnap.data() };
        return null;
    } catch (error) {
        console.error("Error getting availability:", error);
        return null;
    }
}

async function setPeerAvailability(peerId, availability) {
    try {
        const docRef = doc(db, "peer_availability", peerId);
        await setDoc(docRef, {
            peerId: peerId,
            availability: availability,
            timezone: "Asia/Kolkata",
            updatedAt: new Date().toISOString()
        }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error setting availability:", error);
        return false;
    }
}
let isInitialized = false;

// IMMEDIATELY expose functions to window
window.loadAvailabilityPeer = loadAvailability;
window.renderAvailabilityPeer = renderAvailability;
window.saveAvailabilityPeer = saveAvailability;

console.log('🔧 Peer Availability module loaded (functions exposed)');

// Setup event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔧 DOM ready, setting up event listeners...');
    
    const saveBtn = document.getElementById('save-availability-btn-peer');
    if (saveBtn) saveBtn.addEventListener('click', saveAvailability);
    
    const container = document.getElementById('availability-schedule-list-peer');
    if (container) {
        container.addEventListener('click', handleContainerClick);
        container.addEventListener('change', handleContainerChange);
    }
    
    // Auto-load if view active
    const view = document.getElementById('view-availability');
    if (view && view.classList.contains('active')) {
        setTimeout(() => loadAvailability(), 100);
    }
    
    isInitialized = true;
    console.log('✅ Peer Availability fully initialized');
});

async function loadAvailability() {
    console.log('🔄 Loading availability...');
    const user = auth.currentUser;
    if (!user) {
        console.log('⚠️ No user logged in');
        return;
    }

    try {
        const availability = await getPeerAvailability(user.uid);
        console.log('Firestore response:', availability);
        
        if (availability && availability.availability) {
            currentAvailabilityPeer = availability.availability;
            console.log('✅ Loaded:', currentAvailabilityPeer);
        } else {
            console.log('⚠️ No data, using defaults');
            currentAvailabilityPeer = [
                { day: 'monday', startTime: '18:00', endTime: '21:00' },
                { day: 'tuesday', startTime: '18:00', endTime: '21:00' },
                { day: 'wednesday', startTime: '18:00', endTime: '21:00' },
                { day: 'thursday', startTime: '18:00', endTime: '21:00' },
                { day: 'friday', startTime: '18:00', endTime: '21:00' }
            ];
        }
        renderAvailability();
        console.log('✅ Load complete');
    } catch (error) {
        console.error('❌ Error loading:', error);
        const container = document.getElementById('availability-schedule-list-peer');
        if (container) {
            container.innerHTML = '<div style="color:red; padding:20px; text-align:center;">Error: ' + error.message + '<br/><button onclick="window.loadAvailabilityPeer()" style="margin-top:10px; padding:8px 16px; cursor:pointer; background:var(--accent-theme); border:none; border-radius:6px; color:var(--bg-main);">Retry</button></div>';
        }
    }
}

function renderAvailability() {
    const container = document.getElementById('availability-schedule-list-peer');
    if (!container) {
        console.log('⚠️ Container not found');
        return;
    }

    container.innerHTML = DAYS.map((day, i) => {
        const slots = currentAvailabilityPeer.filter(s => s.day.toLowerCase() === day);
        if (slots.length === 0) {
            return `<div style="display:flex; border-bottom:1px solid var(--border-subtle); padding:15px 0; align-items:center;">
                <div style="width:100px; font-weight:600;">${DAY_LABELS[i]}</div>
                <div style="flex:1; opacity:0.5;">Unavailable</div>
                <button data-action="add" data-day="${day}" style="background:none; border:none; color:var(--accent-theme); cursor:pointer;"><i class="fas fa-plus"></i></button>
            </div>`;
        }
        return `<div style="display:flex; border-bottom:1px solid var(--border-subtle); padding:15px 0; align-items:flex-start;">
            <div style="width:100px; font-weight:600; padding-top:8px;">${DAY_LABELS[i]}</div>
            <div style="flex:1;">
                ${slots.map((slot, idx) => `<div style="display:flex; align-items:center; gap:10px; margin-bottom:5px;">
                    <input type="time" value="${slot.startTime}" data-day="${day}" data-slot="${idx}" data-field="startTime" style="background:var(--bg-subtle); border:1px solid var(--border-subtle); color:var(--text-main); padding:8px; border-radius:6px;">
                    <span>-</span>
                    <input type="time" value="${slot.endTime}" data-day="${day}" data-slot="${idx}" data-field="endTime" style="background:var(--bg-subtle); border:1px solid var(--border-subtle); color:var(--text-main); padding:8px; border-radius:6px;">
                    <button data-action="remove" data-day="${day}" data-index="${idx}" style="background:none; border:none; color:#ef4444; cursor:pointer;"><i class="fas fa-trash"></i></button>
                </div>`).join('')}
            </div>
            <button data-action="add" data-day="${day}" style="background:none; border:none; color:var(--accent-theme); cursor:pointer;"><i class="fas fa-plus"></i></button>
        </div>`;
    }).join('');
    console.log('✅ Rendered');
}

async function saveAvailability() {
    console.log('💾 Saving...');
    const user = auth.currentUser;
    if (!user) { alert('Please log in'); return; }

    const btn = document.getElementById('save-availability-btn-peer');
    const spinner = document.getElementById('save-availability-spinner-peer');
    const text = document.getElementById('save-availability-text-peer');

    try {
        btn.disabled = true;
        if (spinner) spinner.style.display = 'inline-block';
        if (text) text.textContent = 'Saving...';

        const success = await setPeerAvailability(user.uid, currentAvailabilityPeer);
        console.log('Save result:', success);
        
        if (success) {
            alert('✅ Availability saved successfully!');
        } else {
            throw new Error('Failed to save');
        }
    } catch (error) {
        console.error('❌ Save error:', error);
        alert('Error: ' + error.message);
    } finally {
        btn.disabled = false;
        if (spinner) spinner.style.display = 'none';
        if (text) text.textContent = 'Save Schedule';
    }
}

function handleContainerClick(e) {
    const addBtn = e.target.closest('button[data-action="add"]');
    const removeBtn = e.target.closest('button[data-action="remove"]');
    if (addBtn) {
        console.log('➕ Add slot for', addBtn.dataset.day);
        addSlot(addBtn.dataset.day);
    }
    if (removeBtn) {
        console.log('🗑️ Remove slot', removeBtn.dataset.day, removeBtn.dataset.index);
        removeSlot(removeBtn.dataset.day, parseInt(removeBtn.dataset.index));
    }
}

function handleContainerChange(e) {
    const input = e.target.closest('input[type="time"]');
    if (input) {
        console.log('✏️ Update', input.dataset.day, input.dataset.field, input.value);
        updateSlot(input.dataset.day, parseInt(input.dataset.slot), input.dataset.field, input.value);
    }
}

function addSlot(day) {
    currentAvailabilityPeer.push({ day: day.toLowerCase(), startTime: '18:00', endTime: '21:00' });
    renderAvailability();
}

function removeSlot(day, index) {
    const slots = currentAvailabilityPeer.filter(s => s.day.toLowerCase() === day);
    if (index >= 0 && index < slots.length) {
        const i = currentAvailabilityPeer.indexOf(slots[index]);
        if (i !== -1) { currentAvailabilityPeer.splice(i, 1); renderAvailability(); }
    }
}

function updateSlot(day, index, field, value) {
    const slots = currentAvailabilityPeer.filter(s => s.day.toLowerCase() === day);
    if (index >= 0 && index < slots.length) slots[index][field] = value;
}
