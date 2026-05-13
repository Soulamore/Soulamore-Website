const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp({
        projectId: 'soulamore-f0a64'
    });
}

const db = admin.firestore();

const groups = [
    {
        title: "Relationships",
        description: "For love, attachment, conflict, and boundaries.",
        icon: "fa-heart-broken",
        category: "Relationships",
        features: ["Healing Circles", "Dating Fatigue", "Breakup Support", "Conscious Communication"],
        link: "https://chat.whatsapp.com/EXAMPLE_RELATIONSHIPS",
        displayOrder: 1,
        isListed: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        title: "Neurodivergence",
        description: "Understanding your mind without labeling yourself broken.",
        icon: "fa-brain",
        category: "Neurodivergence",
        features: ["Adult ADHD Circles", "Autism Spectrum", "Emotional Regulation", "Sensory Overload"],
        link: "https://chat.whatsapp.com/EXAMPLE_NEURO",
        displayOrder: 2,
        isListed: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        title: "Habits & Compulsions",
        description: "Compassion-first recovery, without shame.",
        icon: "fa-sync-alt",
        category: "Habits",
        features: ["Digital Addiction", "Nicotine Support", "Habit Reset", "Accountability Circles"],
        link: "https://chat.whatsapp.com/EXAMPLE_HABITS",
        displayOrder: 3,
        isListed: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        title: "Emotional Health",
        description: "For the emotions we were never taught to carry.",
        icon: "fa-cloud-rain",
        category: "Health",
        features: ["Anxiety Groups", "Depression Support", "Trauma Healing", "Grief & Loss"],
        link: "https://chat.whatsapp.com/EXAMPLE_EMOTIONAL",
        displayOrder: 4,
        isListed: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        title: "Life Transitions",
        description: "For moments when life feels unclear or heavy.",
        icon: "fa-compass",
        category: "Life",
        features: ["Career Confusion", "Relocation / \"Away\"", "Arranged Marriage", "Decision Making"],
        link: "https://chat.whatsapp.com/EXAMPLE_TRANSITIONS",
        displayOrder: 5,
        isListed: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    },
    {
        title: "Reflective Workshops",
        description: "Guided growth and emotional skill-building.",
        icon: "fa-pen-nib",
        category: "Workshops",
        features: ["Guided Journaling", "Intentional Living", "Self-Compassion", "Emotional Literacy"],
        link: "https://chat.whatsapp.com/EXAMPLE_WORKSHOPS",
        displayOrder: 6,
        isListed: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
    }
];

async function backfill() {
    console.log("Starting backfill for support_groups...");
    const batch = db.batch();
    
    for (const group of groups) {
        const docRef = db.collection('support_groups').doc();
        batch.set(docRef, group);
        console.log(`- Queuing: ${group.title}`);
    }
    
    await batch.commit();
    console.log("✅ Backfill complete!");
}

backfill().catch(console.error);
