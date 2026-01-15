/**
 * SoulBot Handler
 * Manages conversation tracking, storage, and therapist recommendations
 */

import { db, collection, addDoc, doc, getDoc, updateDoc, serverTimestamp, getDocs, query, where, limit } from "./firebase-config.js";

const CONVERSATIONS_COLLECTION = "soulbot_conversations";
const THERAPISTS_COLLECTION = "therapists"; // You may want to create this collection or use existing psychologists collection

/**
 * Create a new conversation session
 */
export async function createConversation(userId = null) {
    try {
        const conversationData = {
            userId: userId, // Keep as null for anonymous users (don't convert to string)
            startTime: serverTimestamp(),
            messages: [],
            duration: 0, // in seconds
            therapistRecommended: false,
            recommendedTherapistId: null,
            conversationTopics: [],
            sentiment: null,
            createdAt: serverTimestamp()
        };
        
        const docRef = await addDoc(collection(db, CONVERSATIONS_COLLECTION), conversationData);
        console.log("Conversation created:", docRef.id, "userId:", userId);
        return docRef.id;
    } catch (error) {
        console.error("Error creating conversation:", error);
        return null;
    }
}

/**
 * Add a message to the conversation
 */
export async function addMessageToConversation(conversationId, role, text, metadata = {}) {
    try {
        const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
        const conversationSnap = await getDoc(conversationRef);
        
        if (!conversationSnap.exists()) {
            console.error("Conversation not found:", conversationId);
            return false;
        }
        
        const conversation = conversationSnap.data();
        const messages = conversation.messages || [];
        
        // Use regular timestamp instead of serverTimestamp() for array elements
        // Firestore doesn't support serverTimestamp() inside arrays
        const newMessage = {
            role: role, // 'user' or 'bot'
            text: text,
            timestamp: new Date(), // Use Date object instead of serverTimestamp() for arrays
            ...metadata
        };
        
        messages.push(newMessage);
        
        // Extract topics/keywords from message (simple keyword extraction)
        const topics = extractTopics(text, conversation.conversationTopics || []);
        
        await updateDoc(conversationRef, {
            messages: messages,
            conversationTopics: topics,
            lastMessageTime: serverTimestamp(), // This is OK, it's not in an array
            updatedAt: serverTimestamp() // This is OK, it's not in an array
        });
        
        return true;
    } catch (error) {
        console.error("Error adding message to conversation:", error);
        return false;
    }
}

/**
 * Extract topics/keywords from message text
 */
function extractTopics(text, existingTopics = []) {
    const keywordMap = {
        'anxiety': 'anxiety',
        'anxious': 'anxiety',
        'worried': 'anxiety',
        'worry': 'anxiety',
        'stress': 'stress',
        'stressed': 'stress',
        'depression': 'depression',
        'depressed': 'depression',
        'sad': 'depression',
        'trauma': 'trauma',
        'relationship': 'relationships',
        'relationship': 'relationships',
        'family': 'relationships',
        'work': 'career',
        'job': 'career',
        'career': 'career',
        'sleep': 'sleep',
        'insomnia': 'sleep',
        'lonely': 'loneliness',
        'loneliness': 'loneliness',
        'anger': 'anger',
        'angry': 'anger',
        'grief': 'grief',
        'loss': 'grief'
    };
    
    const lowerText = text.toLowerCase();
    const topicsSet = new Set(existingTopics);
    
    for (const [keyword, topic] of Object.entries(keywordMap)) {
        if (lowerText.includes(keyword)) {
            topicsSet.add(topic);
        }
    }
    
    return Array.from(topicsSet);
}

/**
 * Update conversation duration
 */
export async function updateConversationDuration(conversationId, durationSeconds) {
    try {
        const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
        await updateDoc(conversationRef, {
            duration: durationSeconds,
            updatedAt: serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error updating conversation duration:", error);
        return false;
    }
}

/**
 * Get recommended therapist based on conversation
 */
export async function recommendTherapist(conversationId) {
    try {
        const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
        const conversationSnap = await getDoc(conversationRef);
        
        if (!conversationSnap.exists()) {
            console.error("Conversation not found:", conversationId);
            return null;
        }
        
        const conversation = conversationSnap.data();
        const topics = conversation.conversationTopics || [];
        const messages = conversation.messages || [];
        
        // Combine all user messages for analysis
        const userMessages = messages
            .filter(m => m.role === 'user')
            .map(m => m.text)
            .join(' ')
            .toLowerCase();
        
        // Get therapists from Firestore (or use static data)
        const therapists = await getTherapists();
        
        // Match therapist based on topics and conversation content
        const recommended = matchTherapist(topics, userMessages, therapists);
        
        if (recommended) {
            // Mark conversation as having recommended therapist
            await updateDoc(conversationRef, {
                therapistRecommended: true,
                recommendedTherapistId: recommended.id,
                recommendedAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });
            
            return recommended;
        }
        
        return null;
    } catch (error) {
        console.error("Error recommending therapist:", error);
        return null;
    }
}

/**
 * Get therapists from Firestore or use static data
 */
async function getTherapists() {
    try {
        // Try to get from Firestore first (if you create a therapists collection)
        const therapistsRef = collection(db, THERAPISTS_COLLECTION);
        const q = query(therapistsRef, where('verified', '==', true), limit(20));
        const snapshot = await getDocs(q);
        
        if (!snapshot.empty) {
            return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }
    } catch (error) {
        console.log("Therapists collection not found, using static data. This is okay - using fallback.", error);
    }
    
    // Fallback to static therapist data (from psychologists.html)
    return [
        {
            id: 1,
            name: "Palak Shori",
            role: "Clinical Psychologist (Master's)",
            category: "Mental Wellness",
            tags: ["anxiety", "depression", "youth counseling", "english", "hindi"],
            rating: 4.9,
            reviews: 120,
            price: 1800,
            experience: 8,
            languages: ["English", "Hindi"],
            online: true,
            verified: true,
            specialties: ["anxiety", "depression", "stress"]
        },
        {
            id: 2,
            name: "Dr. Ananya Gupta",
            role: "Senior Therapist (PhD)",
            category: "Relationship Counseling",
            tags: ["trauma", "relationships", "stress", "english"],
            rating: 4.8,
            reviews: 95,
            price: 2500,
            experience: 15,
            languages: ["English"],
            online: false,
            verified: true,
            specialties: ["trauma", "relationships", "stress"]
        },
        {
            id: 3,
            name: "Rahul Sharma",
            role: "Counseling Psychologist",
            category: "Career Guidance",
            tags: ["career", "stress", "motivation", "english", "hindi"],
            rating: 4.7,
            reviews: 80,
            price: 1500,
            experience: 6,
            languages: ["English", "Hindi"],
            online: true,
            verified: false,
            specialties: ["career", "stress"]
        },
        {
            id: 4,
            name: "Priya Singh",
            role: "Child Psychologist",
            category: "Child & Adolescent Therapy",
            tags: ["child", "adolescent", "parenting", "english"],
            rating: 5.0,
            reviews: 150,
            price: 2000,
            experience: 10,
            languages: ["English"],
            online: true,
            verified: true,
            specialties: ["child", "adolescent"]
        }
    ];
}

/**
 * Match therapist based on conversation topics and content
 */
function matchTherapist(topics, userMessages, therapists) {
    if (!therapists || therapists.length === 0) return null;
    
    // Score each therapist based on topic matches
    const scoredTherapists = therapists.map(therapist => {
        let score = 0;
        const therapistTags = (therapist.tags || []).map(t => t.toLowerCase());
        const therapistSpecialties = (therapist.specialties || []).map(s => s.toLowerCase());
        const allTherapistKeywords = [...therapistTags, ...therapistSpecialties];
        
        // Match topics
        topics.forEach(topic => {
            if (allTherapistKeywords.includes(topic.toLowerCase())) {
                score += 10;
            }
        });
        
        // Match keywords in messages
        allTherapistKeywords.forEach(keyword => {
            if (userMessages.includes(keyword)) {
                score += 5;
            }
        });
        
        // Prefer verified and online therapists
        if (therapist.verified) score += 5;
        if (therapist.online) score += 3;
        
        // Prefer higher rated therapists
        if (therapist.rating) score += therapist.rating;
        
        return { therapist, score };
    });
    
    // Sort by score and return top match
    scoredTherapists.sort((a, b) => b.score - a.score);
    const topMatch = scoredTherapists[0];
    
    // Only recommend if there's a reasonable match (score > 0)
    if (topMatch && topMatch.score > 0) {
        return topMatch.therapist;
    }
    
    // Default: return first verified therapist
    const verifiedTherapist = therapists.find(t => t.verified);
    return verifiedTherapist || therapists[0];
}

/**
 * Get conversation by ID
 */
export async function getConversation(conversationId) {
    try {
        const conversationRef = doc(db, CONVERSATIONS_COLLECTION, conversationId);
        const conversationSnap = await getDoc(conversationRef);
        
        if (conversationSnap.exists()) {
            return { id: conversationSnap.id, ...conversationSnap.data() };
        }
        return null;
    } catch (error) {
        console.error("Error getting conversation:", error);
        return null;
    }
}

