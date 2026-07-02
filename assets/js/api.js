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
    ],
    comments: {
        1: [
            { author: "Zen_Gardener", time: "1 hour ago", text: "I'm with you. Finals feel like an absolute wall. Take a 15-minute breather." },
            { author: "StudyBuddy_99", time: "30 minutes ago", text: "Same here, brain feels like mush. Let's try active recall instead of passive reading." }
        ],
        2: [
            { author: "Social_Butterfly_In_Training", time: "3 hours ago", text: "Walking out is a win! You tried, and that counts. Next time, try standing outside the door for 2 mins." },
            { author: "Introvert_Power", time: "2 hours ago", text: "Don't beat yourself up. Parties are overstimulating. Coffee shop meetups are much better!" }
        ],
        3: [
            { author: "HomeSick_Too", time: "4 hours ago", text: "I feel this so much. Try calling your mom and asking for a recipe you can cook locally!" }
        ],
        4: [
            { author: "NightOwl", time: "12 hours ago", text: "Definitely at night. There are no distractions, so all thoughts get amplified." },
            { author: "SunsetLover", time: "8 hours ago", text: "I started journaling right before sleep to empty my head, it helps." }
        ],
        6: [
            { author: "GroundedSoul", time: "2 days ago", text: "Those questions are so helpful. Saved them for my roommate." }
        ]
    }
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

    getComments: async (postId) => {
        if (API_MODE === 'MOCK') {
            return new Promise(resolve => {
                setTimeout(() => resolve(MockData.comments[postId] || []), 300);
            });
        }
    },

    addComment: async (postId, comment) => {
        if (API_MODE === 'MOCK') {
            return new Promise(resolve => {
                if (!MockData.comments[postId]) {
                    MockData.comments[postId] = [];
                }
                const newComment = {
                    ...comment,
                    time: "Just now"
                };
                MockData.comments[postId].push(newComment);
                // Also update comment count on the post
                const post = MockData.posts.find(p => p.id === postId);
                if (post) post.comments += 1;
                resolve(newComment);
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
