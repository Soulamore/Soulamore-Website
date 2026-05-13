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
        tag: "Relationships",
        features: ["Healing Circles", "Dating Fatigue", "Breakup Support", "Conscious Communication"],
        link: "https://chat.whatsapp.com/LRoFCws0rHG2KSwnYIH3kW",
        displayOrder: 1,
        nextSession: "Every Tuesday, 8:00 PM IST",
        status: "active"
    },
    {
        name: "Neurodivergence",
        description: "Understanding your mind without labeling yourself broken.",
        icon: "fa-brain",
        tag: "Neurodivergence",
        features: ["Adult ADHD Circles", "Autism Spectrum", "Emotional Regulation", "Sensory Overload"],
        link: "https://chat.whatsapp.com/LL39jGibqf3DFYcfekBuqg",
        displayOrder: 2,
        nextSession: "Every Thursday, 7:00 PM IST",
        status: "active"
    },
    {
        name: "Habits & Compulsions",
        description: "Compassion-first recovery, without shame.",
        icon: "fa-sync-alt",
        tag: "Habits",
        features: ["Digital Addiction", "Nicotine Support", "Habit Reset", "Accountability Circles"],
        link: "https://chat.whatsapp.com/CmqGzHKzpblHBFGFojAtfB",
        displayOrder: 3,
        nextSession: "Every Monday, 9:00 PM IST",
        status: "active"
    },
    {
        name: "Expats in Germany",
        description: "A shared space for home-sickness and integration.",
        icon: "fa-plane-arrival",
        tag: "Life",
        features: ["Expat Stress", "Home-sickness", "Integration Circles", "Community Support"],
        link: "https://chat.whatsapp.com/I7fFRL5Z69iDgIwuMXmdGV",
        displayOrder: 4,
        nextSession: "Bi-weekly Saturdays, 6:00 PM CET",
        status: "active"
    },
    {
        name: "Women's Circles",
        description: "A sacred space for women to connect and grow.",
        icon: "fa-venus",
        tag: "Life",
        features: ["Sisterhood", "Self-Love", "Safe Sharing", "Empowerment"],
        link: "https://chat.whatsapp.com/LKTLKt6uRPgBJhOBY7AKoO",
        displayOrder: 5,
        nextSession: "Monthly Full Moon, 8:30 PM IST",
        status: "active"
    },
    {
        name: "Students in India",
        description: "Navigating academic stress and career confusion.",
        icon: "fa-graduation-cap",
        tag: "Life",
        features: ["Exam Anxiety", "Career Pressure", "Peer Support", "Life Skills"],
        link: "https://chat.whatsapp.com/Gnd9R7S5RCJ5XjD3E5fmWH",
        displayOrder: 6,
        nextSession: "Sundays, 11:00 AM IST",
        status: "active"
    }
];

async function seedGroups() {
  console.log('🚀 Seeding Support Groups to Firestore...');
  
  try {
    const batch = db.batch();
    const groupsRef = db.collection('support_groups');

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
