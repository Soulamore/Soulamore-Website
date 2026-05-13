
const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'soulamore-f0a64'
    });
}

const db = admin.firestore();

async function updateGroups() {
    const groupsRef = db.collection('support_groups');
    const snapshot = await groupsRef.get();

    const realLinks = {
        "Expats in Germany": "https://chat.whatsapp.com/I7fFRL5Z69iDgIwuMXmdGV",
        "Women's Circles": "https://chat.whatsapp.com/LKTLKt6uRPgBJhOBY7AKoO",
        "Students in India": "https://chat.whatsapp.com/Gnd9R7S5RCJ5XjD3E5fmWH",
        "Habits & Compulsions": "https://chat.whatsapp.com/CmqGzHKzpblHBFGFojAtfB",
        "Relationships": "https://chat.whatsapp.com/LRoFCws0rHG2KSwnYIH3kW",
        "Neurodivergence": "https://chat.whatsapp.com/LL39jGibqf3DFYcfekBuqg",
        "Emotional Health": "https://chat.whatsapp.com/EXAMPLE_EMOTIONAL", // Still need this one if it exists
        "Life Transitions": "https://chat.whatsapp.com/EXAMPLE_TRANSITIONS",
        "Reflective Workshops": "https://chat.whatsapp.com/EXAMPLE_WORKSHOPS"
    };

    console.log("Updating group links in Firestore...");

    const updates = [];
    snapshot.forEach(doc => {
        const data = doc.data();
        const title = data.title;
        if (realLinks[title]) {
            console.log(`Matching ${title} -> ${realLinks[title]}`);
            updates.push(groupsRef.doc(doc.id).update({ link: realLinks[title] }));
        } else {
            console.log(`No match for ${title}`);
        }
    });

    await Promise.all(updates);
    console.log("Done updating links.");
}

updateGroups().catch(console.error);
