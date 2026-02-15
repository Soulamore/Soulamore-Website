/**
 * SOULAMORE API SERVICE
 * ---------------------
 * This file handles all data fetching and interactions.
 * Currently in MOCK mode. Will swap to FIREBASE mode.
 */

const API_MODE = 'MOCK'; // 'MOCK' | 'FIREBASE'

const MockData = {
    posts: [
        {
            id: 1,
            author: "Anonymous_Bear",
            time: "2 hours ago",
            tag: "Academic Stress",
            title: "Feeling overwhelmed by finals",
            content: "I've been studying for 12 hours straight and I feel like nothing is sticking. Is anyone else feeling this way? I'm terrified I'm going to fail everything despite trying so hard.",
            source: "native",
            upvotes: 24,
            comments: 5
        },
        {
            id: 2,
            author: "Lost_Star",
            time: "4 hours ago",
            tag: "Social Anxiety",
            title: "Went to a party and left in 10 minutes",
            content: "I tried to put myself out there today. I walked into the room, felt my chest tighten, and walked right back out. I feel like a failure, but at least I tried?",
            source: "native",
            upvotes: 45,
            comments: 12
        },
        {
            id: 3,
            author: "Global_Citizen",
            time: "5 hours ago",
            tag: "International",
            title: "Missing home food",
            content: "It’s been 3 months since I had a proper home-cooked meal. The food here is okay, but I just crave the smell of my mom's kitchen. It’s a small thing but it hurts today.",
            source: "native",
            upvotes: 18,
            comments: 8
        },
        {
            id: 4,
            author: "Soulamore_Community",
            time: "1 day ago",
            tag: "Reflection",
            title: "Prompt: When do your thoughts get louder?",
            content: "We posted this question: 'Ask your loved ones when their thoughts get louder at night.' It sparked so much deep conversation on Instagram, we wanted to bring it here. Do you struggle more at night? 🌙",
            source: "instagram",
            instagram_post_url: "https://instagram.com/p/mock-post-1",
            upvotes: 156,
            comments: 42
        },
        {
            id: 5,
            author: "Anonymous Confession",
            time: "2 days ago",
            tag: "Confession",
            title: "I finally told my parents",
            content: "This confession was curated from our anonymous box. 'I finally told my parents I changed my major. It was terrifying, but I feel free.'",
            source: "confession",
            instagram_reel_url: "https://instagram.com/reels/mock-reel",
            is_instagram_published: true,
            upvotes: 312,
            comments: 0
        },
        {
            id: 6,
            author: "Soulamore_Community",
            time: "3 days ago",
            tag: "Burnout",
            title: "Resources: 5 Gentle Questions for Burnout",
            content: "If you have a friend who is struggling but won't talk about it, try asking these 5 gentle questions. Check the full list on our Instagram.",
            source: "instagram",
            instagram_post_url: "https://instagram.com/p/mock-post-2",
            upvotes: 89,
            comments: 15
        }
    ]
};

const api = {
    // --- POSTS ---
    getFeed: async () => {
        if (API_MODE === 'MOCK') {
            return new Promise(resolve => {
                setTimeout(() => resolve(MockData.posts), 500); // Simulate network latency
            });
        }
    },

    createPost: async (postData) => {
        if (API_MODE === 'MOCK') {
            return new Promise(resolve => {
                const newPost = {
                    id: Date.now(),
                    ...postData,
                    source: 'native',
                    time: 'Just now',
                    upvotes: 0,
                    comments: 0
                };
                MockData.posts.unshift(newPost);
                resolve(newPost);
            });
        }
    },

    // --- AUTH (Placeholder) ---
    login: async () => {
        console.log("Logging in...");
        return new Promise(resolve => setTimeout(() => resolve({ uid: "user_123", name: "Guest User" }), 800));
    }
};

window.soulamoreApi = api;
console.log("Soulamore API (Beta) Initialized");
