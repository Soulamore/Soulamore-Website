/* 
    RITUAL SCHEDULE MANAGER
    Centralized source of truth for both Index and Problem Wall.
*/

const RITUAL_SCHEDULE = [
    {
        "date": "2026-01-15",
        "name": "Army Day",
        "description": "Saluting the brave."
    },
    {
        "date": "2026-01-26",
        "name": "Republic Day",
        "description": "The Constitution of Self."
    },
    {
        "date": "2026-02-01",
        "name": "Board Exam Season",
        "description": "The Long Nights begin.",
        "news_query": "CBSE Board Exam Date Sheet 2026"
    },
    {
        "date": "2026-02-14",
        "name": "The Broken Hearts Club",
        "description": "For love that had nowhere to go."
    },
    {
        "date": "2026-02-20",
        "name": "Social Justice Vigil",
        "description": "For the unseen caste and class divide."
    },
    {
        "date": "2026-03-03",
        "name": "Holi",
        "description": "Colors of Emotion. Release shame."
    },
    {
        "date": "2026-03-08",
        "name": "Women's Day",
        "description": "The weight of her world."
    },
    {
        "date": "2026-03-23",
        "name": "Shaheed Diwas",
        "description": "Revolutionary memory."
    },
    {
        "date": "2026-04-14",
        "name": "Ambedkar Jayanti",
        "description": "Educate. Agitate. Organize."
    },
    {
        "date": "2026-04-20",
        "name": "The Rank is Not You",
        "description": "JEE/NEET Season.",
        "news_query": "JEE Mains Result 2026"
    },
    {
        "date": "2026-05-01",
        "name": "May Day",
        "description": "Honoring invisible labor."
    },
    {
        "date": "2026-05-11",
        "name": "Mother's Day",
        "description": "For complicated cords."
    },
    {
        "date": "2026-05-20",
        "name": "CBSE Results (Expected)",
        "description": "You are more than a marksheet.",
        "news_query": "CBSE Class 10 12 Result 2026 declared"
    },
    {
        "date": "2026-06-01",
        "name": "Pride Month",
        "description": "The Closet Door opens."
    },
    {
        "date": "2026-06-21",
        "name": "Father's Day",
        "description": "For silent fathers."
    },
    {
        "date": "2026-07-26",
        "name": "Kargil Vijay Diwas",
        "description": "Tiger Hill Remembrance."
    },
    {
        "date": "2026-08-15",
        "name": "Independence Day",
        "description": "Freedom from fear."
    },
    {
        "date": "2026-08-28",
        "name": "Raksha Bandhan",
        "description": "The Empty Wrist."
    },
    {
        "date": "2026-09-10",
        "name": "Suicide Prevention Day",
        "description": "One Reason to Stay."
    },
    {
        "date": "2026-10-02",
        "name": "Gandhi Jayanti",
        "description": "Truth to Power."
    },
    {
        "date": "2026-10-08",
        "name": "Air Force Day",
        "description": "Touching the sky with glory."
    },
    {
        "date": "2026-10-10",
        "name": "Mental Health Day",
        "description": "The Global Scream."
    },
    {
        "date": "2026-10-20",
        "name": "Dussehra",
        "description": "Burning the inner Ravana."
    },
    {
        "date": "2026-11-08",
        "name": "Diwali",
        "description": "Light in the darkness."
    },
    {
        "date": "2026-11-19",
        "name": "Men's Day",
        "description": "Boys Don't Cry?"
    },
    {
        "date": "2026-11-26",
        "name": "Mumbai Terror Attack",
        "description": "Remembering 26/11."
    },
    {
        "date": "2026-12-03",
        "name": "Bhopal Gas Tragedy",
        "description": "The air we lost (1984)."
    },
    {
        "date": "2026-12-04",
        "name": "Navy Day",
        "description": "Guardians of the deep."
    },
    {
        "date": "2026-12-16",
        "name": "Vijay Diwas",
        "description": "Victory of 1971."
    },
    {
        "date": "2026-12-31",
        "name": "The Great Purge",
        "description": "Leaving it all directly behind."
    },
    {
        "date": "2027-01-15",
        "name": "Army Day",
        "description": "Saluting the brave."
    },
    {
        "date": "2027-01-26",
        "name": "Republic Day",
        "description": "The Constitution of Self."
    },
    {
        "date": "2027-02-01",
        "name": "Board Exam Season",
        "description": "The Long Nights begin.",
        "news_query": "CBSE Board Exam Date Sheet 2027"
    },
    {
        "date": "2027-02-14",
        "name": "The Broken Hearts Club",
        "description": "For love that had nowhere to go."
    },
    {
        "date": "2027-03-22",
        "name": "Holi",
        "description": "Colors of Emotion."
    },
    {
        "date": "2027-04-14",
        "name": "Ambedkar Jayanti",
        "description": "Educate. Agitate. Organize."
    },
    {
        "date": "2027-04-20",
        "name": "The Rank is Not You",
        "description": "JEE/NEET Season.",
        "news_query": "JEE Mains Result 2027"
    },
    {
        "date": "2027-05-20",
        "name": "CBSE Results (Expected)",
        "description": "You are more than a marksheet.",
        "news_query": "CBSE Class 10 12 Result 2027 declared"
    },
    {
        "date": "2027-07-26",
        "name": "Kargil Vijay Diwas",
        "description": "Tiger Hill Remembrance."
    },
    {
        "date": "2027-08-15",
        "name": "Independence Day",
        "description": "Freedom from fear."
    },
    {
        "date": "2027-09-10",
        "name": "Suicide Prevention Day",
        "description": "One Reason to Stay."
    },
    {
        "date": "2027-10-02",
        "name": "Gandhi Jayanti",
        "description": "Truth to Power."
    },
    {
        "date": "2027-10-29",
        "name": "Diwali",
        "description": "Light in the darkness."
    },
    {
        "date": "2027-11-26",
        "name": "Mumbai Terror Attack",
        "description": "Remembering 26/11."
    },
    {
        "date": "2027-12-04",
        "name": "Navy Day",
        "description": "Guardians of the deep."
    },
    {
        "date": "2027-12-16",
        "name": "Vijay Diwas",
        "description": "Victory of 1971."
    },
    {
        "date": "2028-01-15",
        "name": "Army Day",
        "description": "Saluting the brave."
    },
    {
        "date": "2028-01-26",
        "name": "Republic Day",
        "description": "The Constitution of Self."
    },
    {
        "date": "2028-02-14",
        "name": "The Broken Hearts Club",
        "description": "For love that had nowhere to go."
    },
    {
        "date": "2028-03-11",
        "name": "Holi",
        "description": "Colors of Emotion."
    },
    {
        "date": "2028-04-14",
        "name": "Ambedkar Jayanti",
        "description": "Educate. Agitate. Organize."
    },
    {
        "date": "2028-05-20",
        "name": "CBSE Results (Expected)",
        "description": "You are more than a marksheet.",
        "news_query": "CBSE Class 10 12 Result 2028 declared"
    },
    {
        "date": "2028-07-26",
        "name": "Kargil Vijay Diwas",
        "description": "Tiger Hill Remembrance."
    },
    {
        "date": "2028-08-15",
        "name": "Independence Day",
        "description": "Freedom from fear."
    },
    {
        "date": "2028-10-17",
        "name": "Diwali",
        "description": "Light in the darkness."
    },
    {
        "date": "2028-12-04",
        "name": "Navy Day",
        "description": "Guardians of the deep."
    },
    {
        "date": "2029-01-15",
        "name": "Army Day",
        "description": "Saluting the brave."
    },
    {
        "date": "2029-01-26",
        "name": "Republic Day",
        "description": "The Constitution of Self."
    },
    {
        "date": "2029-02-14",
        "name": "The Broken Hearts Club",
        "description": "For love that had nowhere to go."
    },
    {
        "date": "2029-03-01",
        "name": "Holi",
        "description": "Colors of Emotion."
    },
    {
        "date": "2029-05-20",
        "name": "CBSE Results (Expected)",
        "description": "You are more than a marksheet.",
        "news_query": "CBSE Class 10 12 Result 2029 declared"
    },
    {
        "date": "2029-07-26",
        "name": "Kargil Vijay Diwas",
        "description": "Tiger Hill Remembrance."
    },
    {
        "date": "2029-08-15",
        "name": "Independence Day",
        "description": "Freedom from fear."
    },
    {
        "date": "2029-11-05",
        "name": "Diwali",
        "description": "Light in the darkness."
    },
    {
        "date": "2029-12-04",
        "name": "Navy Day",
        "description": "Guardians of the deep."
    },
    {
        "date": "2030-01-15",
        "name": "Army Day",
        "description": "Saluting the brave."
    },
    {
        "date": "2030-01-26",
        "name": "Republic Day",
        "description": "The Constitution of Self."
    },
    {
        "date": "2030-02-14",
        "name": "The Broken Hearts Club",
        "description": "For love that had nowhere to go."
    },
    {
        "date": "2030-03-19",
        "name": "Holi",
        "description": "Colors of Emotion."
    },
    {
        "date": "2030-05-20",
        "name": "CBSE Results (Expected)",
        "description": "You are more than a marksheet.",
        "news_query": "CBSE Class 10 12 Result 2030 declared"
    },
    {
        "date": "2030-07-26",
        "name": "Kargil Vijay Diwas",
        "description": "Tiger Hill Remembrance."
    },
    {
        "date": "2030-08-15",
        "name": "Independence Day",
        "description": "Freedom from fear."
    },
    {
        "date": "2030-10-26",
        "name": "Diwali",
        "description": "Light in the darkness."
    },
    {
        "date": "2030-12-04",
        "name": "Navy Day",
        "description": "Guardians of the deep."
    }
];

// Sort chronologically just in case
RITUAL_SCHEDULE.sort((a, b) => new Date(a.date) - new Date(b.date));

// Helper: Get Next Ritual
function getNextRitual() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Local midnight

    for (const ritual of RITUAL_SCHEDULE) {
        // Appending T00:00:00 forces local time construction in most environments
        const rDate = new Date(ritual.date + "T00:00:00");

        if (rDate >= today) {
            // Calculate days left
            const diffTime = rDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return {
                ...ritual,
                daysLeft: diffDays
            };
        }
    }

    // Fallback if schedule runs out
    return { name: "Next Cycle", daysLeft: 7, date: "TBD", description: "Stay tuned for upcoming collective moments." };
}

// Helper: Render Widget
window.renderRitualWidget = function (containerId, isDarkTheme = false) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`[Ritual] Container #${containerId} not found.`);
        return;
    }

    const nextRitual = getNextRitual();
    const dayText = nextRitual.daysLeft === 0 ? "Today" :
        nextRitual.daysLeft === 1 ? "Tomorrow" :
            `in ${nextRitual.daysLeft} days`;

    // Styling logic
    const bgColor = isDarkTheme ? "rgba(30, 41, 59, 0.6)" : "rgba(255, 255, 255, 0.08)";
    const borderColor = "rgba(255, 255, 255, 0.15)";

    // Icon logic based on name
    let icon = "🌙";
    const nameLower = nextRitual.name.toLowerCase();
    if (nameLower.includes("holi") || nameLower.includes("color")) icon = "🎨";
    else if (nameLower.includes("diwali") || nameLower.includes("light")) icon = "🪔";
    else if (nameLower.includes("republic") || nameLower.includes("independence") || nameLower.includes("day") || nameLower.includes("diwas")) icon = "🇮🇳";
    else if (nameLower.includes("exam") || nameLower.includes("result") || nameLower.includes("rank")) icon = "📚";
    else if (nameLower.includes("heart")) icon = "💔";
    else if (nameLower.includes("women") || nameLower.includes("mother")) icon = "🌺";
    else if (nameLower.includes("shivaratri")) icon = "🔱";
    else if (nameLower.includes("new year") || nameLower.includes("purge")) icon = "✨";
    else if (nameLower.includes("brother") || nameLower.includes("raksha")) icon = "🧶";
    else if (nameLower.includes("health") || nameLower.includes("prevention")) icon = "💚";
    else if (nameLower.includes("justice") || nameLower.includes("gandhi")) icon = "⚖️";

    const descriptionHtml = nextRitual.description
        ? `<div style="font-size: 0.85rem; color: rgba(255, 255, 255, 0.7); margin-top: 4px; margin-left: 32px;">${nextRitual.description}</div>`
        : '';

    container.innerHTML = `
        <div class="ritual-pill fade-in" style="
            display: inline-flex;
            flex-direction: column;
            align-items: flex-start;
            background: ${bgColor};
            border: 1px solid ${borderColor};
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 0.95rem;
            color: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            transition: transform 0.3s;
            cursor: pointer;
        " onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'">
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.1rem;">${icon}</span>
                <span>Next Collective Ritual: <strong style="color: #F49F75;">${nextRitual.name}</strong> ${dayText}</span>
            </div>
            ${descriptionHtml}
        </div>
    `;
};

// Auto-init if container exists immediately
document.addEventListener('DOMContentLoaded', () => {
    // Check known containers
    if (document.getElementById('ritual-container')) renderRitualWidget('ritual-container', true);
    if (document.getElementById('ritual-display-index')) renderRitualWidget('ritual-display-index', true);
});
