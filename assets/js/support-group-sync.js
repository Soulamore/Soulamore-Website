import { db, collection, query, where, getDocs, limit } from "./firebase-config.js";

/**
 * Syncs the support group details (date, time, meet link) from Firestore
 * @param {string} tag - The group identifier (e.g. 'NEURODIVERGENCE')
 * @param {string} elementId - The ID of the element to update
 */
export async function syncSupportGroupDetails(tag, elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;

    try {
        const q = query(collection(db, "support_groups"), where("tag", "==", tag), limit(1));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
            const data = snap.docs[0].data();
            if (data.nextSession) {
                const date = data.nextSession.toDate();
                const options = { day: 'numeric', month: 'long' };
                const dateStr = date.toLocaleDateString('en-GB', options);
                const timeStr = date.toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                }).toLowerCase();
                
                el.innerText = `${dateStr} | ${timeStr} | Online meeting`;
                
                // Optional: Update Meet Link visibility if needed
                // if(data.meetLink) { ... }
            } else {
                el.innerText = "Next session date coming soon";
            }
        } else {
            // Fallback for groups not in DB yet
            console.warn(`No support group found with tag: ${tag}`);
        }
    } catch (err) {
        console.error(`Error syncing group ${tag}:`, err);
        el.innerText = "Schedule currently unavailable";
    }
}
