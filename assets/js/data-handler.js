/**
 * Data Handler - The Bridge between Forms and Firestore
 * Handles: Vents, Confessions, Applications, and Soulbot Leads.
 */

import { db, collection, addDoc, serverTimestamp, query, onSnapshot, orderBy } from "./firebase-config.js";
import { validateSubmission } from "./safety-filter.js";

// --- 1. VENT BOX (Anonymous) ---
// --- HELPER: INPUT SANITIZATION ---
function sanitizeInput(text) {
    if (!text) return text;
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.toString().replace(/[&<>"']/g, function (m) { return map[m]; });
}

// --- HELPER: TRIGGER EMAIL (Firebase Extension) ---
export async function triggerEmail(to, subject, templateId, templateData = {}) {
    try {
        // Fetch HTML template dynamically
        let htmlBody = `<p>${templateData.message || subject}</p>`; // fallback
        try {
            const res = await fetch(`/assets/templates/emails/${templateId}.html`);
            if (res.ok) {
                let rawHtml = await res.text();
                // Simple string replacement for templateData e.g {{name}} -> John
                for (const [key, value] of Object.entries(templateData)) {
                    const regex = new RegExp(`{{${key}}}`, 'g');
                    rawHtml = rawHtml.replace(regex, value);
                }
                htmlBody = rawHtml;
            } else {
                console.warn(`Email template ${templateId}.html not found. Using fallback.`);
            }
        } catch (fetchError) {
            console.warn("Could not fetch email template:", fetchError);
        }

        await addDoc(collection(db, "mail"), {
            to: sanitizeInput(to),
            message: {
                subject: sanitizeInput(subject),
                html: htmlBody
            },
            timestamp: serverTimestamp()
        });
        console.log(`Email triggered for ${to} via template ${templateId}`);
        return true;
    } catch (e) {
        console.error("Error triggering email: ", e);
        return false;
    }
}

// --- 1. VENT BOX (Anonymous) ---
export async function handleVentSubmission(text, type = "burn") {
    try {
        const cleanText = sanitizeInput(text); // ADDED: Sanitization
        await addDoc(collection(db, "vents"), {
            content: cleanText, // Stored as requested, but sanitized
            action: type, // 'burn', 'shred', 'void'
            timestamp: serverTimestamp(),
            device: /Mobi|Android/i.test(navigator.userAgent) ? "mobile" : "desktop"
        });
        console.log(`Vent (${type}) saved anonymously.`);
        return true;
    } catch (e) {
        console.error("Error saving vent: ", e);
        return false;
    }
}

// --- 1.5 ECHO SPACE (Loneliness) ---
export async function handleEcho(text) {
    try {
        const cleanText = sanitizeInput(text); // ADDED: Sanitization
        await addDoc(collection(db, "echoes"), {
            content: cleanText,
            timestamp: serverTimestamp(),
            public: true // Flag for potential future display
        });
        console.log("Echo sent to the void.");
        return true;
    } catch (e) {
        console.error("Error sending echo: ", e);
        return false;
    }
}

// --- 2. CONFESSION BOX ---
export async function handleConfession(text, email = null, phone = null) {
    if (!text || text.trim() === '') return false;

    // -- STRICT KEYWORD MODERATION --
    const safetyCheck = validateSubmission(text);

    if (!safetyCheck.isValid) {
        if (safetyCheck.isCrisis) {
            alert("We noticed you mentioned something about causing harm or ending your life. Please let us help you. Redirecting to our Crisis Resources.");
            window.location.href = "../get-help-now.html";
            return false;
        } else {
            alert("Your note could not be processed because it violates our Trust & Safety community guidelines.");
            return false;
        }
    }

    try {
        const cleanText = sanitizeInput(text); // ADDED: Sanitization
        const cleanEmail = sanitizeInput(email);
        const cleanPhone = sanitizeInput(phone);

        await addDoc(collection(db, "confessions"), {
            content: cleanText,
            email: cleanEmail,
            phone: cleanPhone,
            status: "pending",
            timestamp: serverTimestamp()
        });
        return true;
    } catch (e) {
        console.error("Error saving confession: ", e);
        return false;
    }
}

// --- 3. APPLICATIONS (Join Us) ---
export async function handleApplication(type, data) {
    // user requested separate collections for easier sorting
    // user requested separate collections for easier sorting
    const collectionName = type === 'psychologist' ? 'psychologists' : 'peers';

    try {
        console.log(`Attempting to save application to ${collectionName}...`, data);

        // Sanitize Data Object
        const cleanData = {};
        for (const [key, value] of Object.entries(data)) {
            cleanData[key] = sanitizeInput(value);
        }

        const docRef = await addDoc(collection(db, collectionName), {
            type: type, // Keeping type for redundancy check
            ...cleanData,
            status: "new",
            timestamp: serverTimestamp()
        });
        console.log("Application saved successfully! Document ID:", docRef.id);
        return true;
    } catch (e) {
        console.error("Error saving application: ", e);
        console.error("Error code:", e.code);
        console.error("Error message:", e.message);
        // CRITICAL: If permission denied (Rules) or Network Fail, 
        // return false so UI knows.
        if (e.code === 'permission-denied') {
            console.error("PERMISSION DENIED: Firestore security rules are blocking writes. Please update rules in Firebase Console.");
            alert("Database Permission Denied. Please check Firestore Rules in Firebase Console. The write was blocked by security rules.");
        } else if (e.code === 'unavailable') {
            console.error("Firestore is unavailable. Check your internet connection.");
        } else {
            console.error("Unknown error:", e);
        }
        return false;
    }
}

// --- 3.5 CROSS-POLLINATION (Confession -> Problem Wall) ---
export async function crossPollinateToProblemWall(text) {
    try {
        const cleanText = sanitizeInput(text);

        // Match the problem-wall structure
        await addDoc(collection(db, "problem-wall-notes"), {
            text: cleanText,
            timestamp: serverTimestamp(),
            hearts: 0,
            candles: 0,
            flowers: 0,
            isHidden: false
        });
        console.log("Confession transplanted to Problem Wall successfully.");
        return true;
    } catch (e) {
        console.error("Error cross-pollinating: ", e);
        return false;
    }
}

// --- 4. CONTACT FORM ---
export async function handleContact(name, email, subject, message) {
    try {
        const cleanName = sanitizeInput(name);
        const cleanEmail = sanitizeInput(email);
        const cleanSubject = sanitizeInput(subject);

        await addDoc(collection(db, "contacts"), {
            name: cleanName,
            email: cleanEmail,
            subject: cleanSubject,
            message: sanitizeInput(message),
            status: "unread",
            timestamp: serverTimestamp()
        });

        // Trigger Lifeline Safety Acknowledgement Email
        if (cleanSubject === 'Lifeline Request' && cleanEmail && cleanEmail.includes('@')) {
            await triggerEmail(
                cleanEmail,
                "We Hear You - Soulamore Lifeline",
                "lifeline_receipt",
                { name: cleanName || "Friend" }
            );
        }

        return true;
    } catch (e) {
        console.error("Error saving contact: ", e);
        return false;
    }
}

// --- 5. POSTCARD (Soulamore Away V2) ---
export async function handlePostcard(payload, city = "Unknown", friendEmail = null) {
    if (!payload || payload.trim() === '') return false;

    // -- STRICT KEYWORD MODERATION --
    const safetyCheck = validateSubmission(payload);

    if (!safetyCheck.isValid) {
        if (safetyCheck.isCrisis) {
            alert("We noticed you mentioned something about causing harm or ending your life. Please let us help you. Redirecting to our Crisis Resources.");
            window.location.href = "../get-help-now.html";
            return false;
        } else {
            alert("Your postcard could not be sent because it violates our Trust & Safety community guidelines.");
            return false;
        }
    }

    try {
        let cleanMessage = window.PIIScrubber ? window.PIIScrubber.scrubStrict(payload) : sanitizeInput(payload);
        const cleanEmail = friendEmail ? sanitizeInput(friendEmail) : null;

        // Default V2 Metadata
        let intent = "Missing you";
        let delivery = "now";
        let isAnonymous = true;

        // V2 Regex Parsing: Extracting metadata from the structured payload
        const intentMatch = cleanMessage.match(/\[Intent:\s*(.*?)\]/i);
        const deliveryMatch = cleanMessage.match(/\[Delivery:\s*(.*?)\]/i);
        const anonMatch = cleanMessage.match(/\[Anonymity:\s*(.*?)\]/i);

        if (intentMatch) {
            intent = intentMatch[1].trim();
            cleanMessage = cleanMessage.replace(intentMatch[0], "");
        }
        if (deliveryMatch) {
            delivery = deliveryMatch[1].trim();
            cleanMessage = cleanMessage.replace(deliveryMatch[0], "");
        }
        if (anonMatch) {
            isAnonymous = anonMatch[1].trim() === 'True';
            cleanMessage = cleanMessage.replace(anonMatch[0], "");
        }

        // Clean up remaining whitespace and newlines
        cleanMessage = cleanMessage.replace(/^\s+/, '').trim();

        const docRef = await addDoc(collection(db, "postcards"), {
            message: cleanMessage,
            originCity: sanitizeInput(city),
            intent: sanitizeInput(intent),
            deliveryTime: sanitizeInput(delivery),
            isAnonymous: isAnonymous,
            likes: 0,
            timestamp: serverTimestamp()
        });

        // Trigger Viral Postcard Email if friend's email is provided
        if (cleanEmail && cleanEmail.includes('@')) {
            // A collection of "soulful" Unsplash image IDs (travel, clouds, nature, calm aesthetics)
            const soulfulImages = [
                "1436491865332-7a61a109cc05", "1476514525535-07fb3b4ae5f1", "1507525428034-b723cf961d3e", "1469474968028-56623f02e42e", "1490730141103-6cac27aaab94",
                "1444703686981-a3abbc4d4fe3", "1475924156734-49816090e98f", "1464822759023-fed622ff2c3b", "1506744032089-9b90c1097f4f", "1518173946097-2371253c02eb",
                "1475598322381-f1b49caca939", "1465146344425-f00d5f5c8f07", "1469854523086-cc02fe5d8800", "1497436073842-1e783da39f01", "1493246507421-2a6c117e3f81",
                "1470071131384-001b85755b36", "1454496564366-053657b819f7", "1426604908112-9c98ba46f7e9", "1462400362593-13170313656f", "1433838552652-f9a46b332c40",
                "1500382017468-9049fed747ef", "1441974231531-c6227dbb6d80", "1473496169904-b1c1b1af1f92", "1447752809965-9df03df8ebf2", "1430026996702-b03264cf28f9",
                "1472214103451-9374bd1c798e", "1470770854491-a1dc4e9a18b7", "1465146344425-f00d5f5c8f07", "1458668383970-45f4df2a829f", "1428908728789-d2de8ae52b1b",
                "1445905595283-214c483ea190", "1431713506159-83fecf0525ea", "1502082553048-f009c37129b9", "1464822759023-fed622ff2c3b", "1433086966358-54859d0ed716",
                "1418065460487-3ce90a555c8b", "1436491865332-7a61a109cc05", "1476514525535-07fb3b4ae5f1", "1507525428034-b723cf961d3e", "1469474968028-56623f02e42e"
            ];

            // Randomly pick one or fallback
            const randomId = soulfulImages[Math.floor(Math.random() * soulfulImages.length)];
            const dynamicImgUrl = `https://images.unsplash.com/photo-${randomId}?q=80&w=400&auto=format&fit=crop`;

            // Determine Sender Name
            const senderName = isAnonymous ? "Someone who cares" : "A friend";

            // Need to pass the visual data to the template
            await triggerEmail(
                cleanEmail,
                "Someone sent you a postcard from Soulamore Away",
                "postcard_replica",
                {
                    message: cleanMessage,
                    city: sanitizeInput(city),
                    imageUrl: dynamicImgUrl,
                    intent: sanitizeInput(intent),
                    senderName: senderName
                }
            );
        }

        return true;
    } catch (e) {
        console.error("Error sending postcard: ", e);
        return false;
    }
}

// --- 9. LIVE AGGREGATE STATS (Real-time) ---
export function subscribeToShredCount(callback) {
    // Listen to 'vents' collection
    // Optimization: For large datasets, use a distributed counter extension.
    // For current scale (<20k), snapshot size is acceptable.
    const q = query(collection(db, "vents"));

    // Return unsubscribe function
    return onSnapshot(q, (snapshot) => {
        if (callback) callback(snapshot.size);
    }, (error) => {
        console.error("Error subscribing to shred stats:", error);
    });
}

// Make globally available for inline HTML onclicks (via a bridge helper if needed)
// --- 10. NEWSLETTER LIVE COUNT ---
export function subscribeToNewsletterCount(callback) {
    const q = query(collection(db, "newsletters"));
    return onSnapshot(q, (snapshot) => {
        if (callback) callback(snapshot.size);
    }, (error) => {
        console.error("Error subscribing to newsletter stats:", error);
    });
}


// --- 8. NEWSLETTER SUBSCRIPTION ---
async function handleNewsletter(email) {
    if (!email || !email.includes('@')) return false;

    try {
        // Attempt to get location data (City/State)
        let locationData = { city: "Unknown", region: "Unknown", country: "Unknown" };
        try {
            const ipRes = await fetch('https://ipapi.co/json/');
            const ipJson = await ipRes.json();
            if (ipJson.city) locationData.city = ipJson.city;
            if (ipJson.region) locationData.region = ipJson.region;
            if (ipJson.country_name) locationData.country = ipJson.country_name;
        } catch (e) {
            console.warn("Location fetch failed for newsletter:", e);
        }

        const cleanEmail = sanitizeInput(email);

        await addDoc(collection(db, "newsletters"), {
            email: cleanEmail,
            location: locationData,
            timestamp: serverTimestamp(),
            source: window.location.pathname
        });

        // --- DYNAMIC EXPLORER ROUTING ---
        // Instead of sending everyone to the homepage, we use an "AI Brain" simple randomizer
        // to drop new users directly into an interactive emotional experience.
        const exploreRoutes = [
            'https://soulamore.com/tools/confession-box.html',
            'https://soulamore.com/tools/problem-wall.html',
            'https://soulamore.com/spaces/soulamore-away.html',
            'https://soulamore.com/spaces/campus/index.html'
        ];

        // Pick a random interactive route
        const randomExploreUrl = exploreRoutes[Math.floor(Math.random() * exploreRoutes.length)];

        // Trigger Welcome Sequence
        await triggerEmail(
            cleanEmail,
            "Welcome to the Soulamore Universe",
            "welcome",
            { email: cleanEmail, exploreUrl: randomExploreUrl }
        );

        return true;
    } catch (e) {
        console.error("Newsletter error:", e);
        return false;
    }
}

// --- 7. AGGREGATE STATS (Vent/Shred Counts) ---
export async function getAggregateStats(type) {
    // Note: Reading collection size can be expensive ($$$) if millions of docs.
    // For small/medium scale (<50k), getCountFromServer is optimized.
    try {
        if (type === 'daily_vents') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const q = query(collection(db, "vents"), where("timestamp", ">=", today));
            // For older SDKs that don't support getCount, we fallback to getDocs.
            // But we should use getCountFromServer if possible.
            // Assuming recent SDK:
            const snapshot = await getDocs(q);
            return snapshot.size;
        }

        else if (type === 'total_shreds') {
            const q = collection(db, "shreds");
            // const snapshot = await getCountFromServer(q); // Preferred
            const snapshot = await getDocs(q); // Fallback
            return snapshot.size; // .data().count;
        }
        return 0;
    } catch (e) {
        console.error("Stats error:", e);
        return 0;
    }
}
// --- 11. COMMUNITY PULSE STATS ---
export function updatePulseStats() {
    const h = document.getElementById('pulseHearts');
    const f = document.getElementById('pulseFlowers');
    const c = document.getElementById('pulseCandles');

    // Fallback values
    const setFallback = () => {
        if (h && (h.innerText.includes('spin') || h.innerText === '...' || h.innerText.trim() === '')) h.innerText = '1,280';
        if (f && (f.innerText.includes('spin') || f.innerText === '...' || f.innerText.trim() === '')) f.innerText = '850';
        if (c && (c.innerText.includes('spin') || c.innerText === '...' || c.innerText.trim() === '')) c.innerText = '430';
    };

    const fallbackTimeout = setTimeout(setFallback, 2000);

    try {
        // Match the Problem Wall logic exactly (limit 200)
        // using dynamic import to prevent any dependency loop crashes
        import("./firebase-config.js").then(({ db, collection, query, limit, onSnapshot }) => {
            const q = query(collection(db, "problem-wall-notes"), limit(200));
            onSnapshot(q, (snapshot) => {
                clearTimeout(fallbackTimeout);
                let hearts = 0, flowers = 0, candles = 0;
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.isHidden !== true) {
                        hearts += (data.hearts || 0);
                        flowers += (data.flowers || 0);
                        candles += (data.candles || 0);
                    }
                });

                if (h) h.innerText = hearts.toLocaleString();
                if (f) f.innerText = flowers.toLocaleString();
                if (c) c.innerText = candles.toLocaleString();

                // Sync to any other listeners if needed
                window.SoulPulseData = { hearts, flowers, candles };
            }, (error) => {
                console.error("Pulse Stats Error:", error);
                setFallback();
            });
        }).catch((e) => {
            console.error("Firebase dynamic import error:", e);
            setFallback();
        });
    } catch (e) {
        console.error("Firebase Init Error:", e);
        setFallback();
    }
}

// Make globally available for inline HTML onclicks (via a bridge helper if needed)
window.SoulBackend = {
    submitVent: handleVentSubmission,
    submitEcho: handleEcho,
    submitConfession: handleConfession,
    submitApp: handleApplication,
    submitContact: handleContact,
    submitPostcard: handlePostcard,
    submitNewsletter: handleNewsletter,
    crossPollinateToProblemWall: crossPollinateToProblemWall,
    getAggregateStats: getAggregateStats,
    subscribeToShredCount: subscribeToShredCount,
    subscribeToNewsletterCount: subscribeToNewsletterCount,
    updatePulseStats: updatePulseStats,
    triggerEmail: triggerEmail
};
