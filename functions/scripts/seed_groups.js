/**
 * Maintenance Script: Seed Support Groups
 * Populates the 'support_groups' collection from hardcoded data.
 */

const admin = require('firebase-admin');
const serviceAccount = require('D:/Projects/CORE_INTELLIGENCE/Keys/soulamore-f0a64/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const GROUPS = [
    {
        name: "Relationships",
        description: "For love, attachment, conflict, and boundaries.",
        icon: "fa-heart-broken",
        category: "Relationships",
        tag: "HEALING",
        features: ["Healing Circles", "Dating Fatigue", "Breakup Support", "Conscious Communication"],
        link: "relationships.html",
        whatsappLink: "https://chat.whatsapp.com/LRoFCws0rHG2KSwnYIH3kW",
        displayOrder: 1,
        nextSession: null,
        status: "active"
    },
    {
        name: "Neurodivergence",
        description: "Understanding your mind without labeling yourself broken.",
        icon: "fa-brain",
        category: "Neurodivergence",
        tag: "AWARENESS",
        features: ["Adult ADHD Circles", "Autism Spectrum", "Emotional Regulation", "Sensory Overload"],
        link: "neurodivergence.html",
        whatsappLink: "https://chat.whatsapp.com/LL39jGibqf3DFYcfekBuqg",
        displayOrder: 2,
        nextSession: null,
        status: "active"
    },
    {
        name: "Habits & Compulsions",
        description: "Compassion-first recovery, without shame.",
        icon: "fa-sync-alt",
        category: "Habits",
        tag: "RECOVERY",
        features: ["Digital Addiction", "Nicotine Support", "Habit Reset", "Accountability Circles"],
        link: "habits-compulsions.html",
        whatsappLink: "https://chat.whatsapp.com/CmqGzHKzpblHBFGFojAtfB",
        displayOrder: 3,
        nextSession: null,
        status: "active"
    },
    {
        name: "Expats in Germany",
        description: "A shared space for home-sickness and integration.",
        icon: "fa-plane-arrival",
        category: "Life",
        tag: "COMMUNITY",
        features: ["Expat Stress", "Home-sickness", "Integration Circles", "Community Support"],
        link: "expats-germany.html",
        whatsappLink: "https://chat.whatsapp.com/I7fFRL5Z69iDgIwuMXmdGV",
        displayOrder: 4,
        nextSession: null,
        status: "active"
    },
    {
        name: "Women's Circles",
        description: "A sacred space for women to connect and grow.",
        icon: "fa-venus",
        category: "Life",
        tag: "SISTERHOOD",
        features: ["Sisterhood", "Self-Love", "Safe Sharing", "Empowerment"],
        link: "women-circles.html",
        whatsappLink: "https://chat.whatsapp.com/LKTLKt6uRPgBJhOBY7AKoO",
        displayOrder: 5,
        nextSession: null,
        status: "active"
    },
    {
        name: "Students in India",
        description: "Navigating academic stress and career confusion.",
        icon: "fa-graduation-cap",
        category: "Life",
        tag: "GROWTH",
        features: ["Exam Anxiety", "Career Pressure", "Peer Support", "Life Skills"],
        link: "students-india.html",
        whatsappLink: "https://chat.whatsapp.com/Gnd9R7S5RCJ5XjD3E5fmWH",
        displayOrder: 6,
        nextSession: null,
        status: "active"
    }
];

async function seedGroups() {
  console.log('🚀 Clearing and Seeding Support Groups to Firestore...');
  
  try {
    const groupsRef = db.collection('support_groups');
    const existing = await groupsRef.get();
    const deleteBatch = db.batch();
    existing.forEach(doc => deleteBatch.delete(doc.ref));
    await deleteBatch.commit();
    console.log('🧹 Collection cleared.');

    const batch = db.batch();

    for (const group of GROUPS) {
      const docRef = groupsRef.doc(); // Auto-ID
      batch.set(docRef, {
        ...group,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      console.log(`+ ${group.name}`);
    }

    await batch.commit();
    console.log('\n✨ Seeding complete!');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    process.exit();
  }
}

seedGroups();
