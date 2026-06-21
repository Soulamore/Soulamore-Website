/**
 * Soulamore Safety & Keyword Moderation Filter
 * 
 * Protects the platform legally by intercepting high-risk
 * content (suicide, self-harm, illegal acts, severe hate speech)
 * BEFORE it reaches the database.
 */

const SAFETY_DICTIONARY = {
    crisis_tier1: [
        "suicide", "kill myself", "want to die", "end it all", "end my life",
        "better off dead", "cutting myself", "overdose", "slit my wrists",
        "drink bleach", "jump off", "kms", "k.m.s", "shoot myself",
        "suicidal", "don't want to be here anymore", "can't go on",
        "no reason to live", "goodbye forever"
    ],
    crisis_tier2: [
        "feel worthless", "no one cares", "everyone would be better off",
        "can't take it anymore", "extremely depressed", "self-harm", "hurting myself"
    ],
    abuse: [
        "rape", "molest", "pedophile", "cp", "child porn", "incest",
        "beat my wife", "hit my kid"
    ],
    hate_speech: [
        "nigger", "faggot", "dyke", "tranny", "chink", "spic", "kike",
        "wetback", "raghead", "towelhead", "kill all", "burn in oven"
    ],
    spam: [
        "http://", "https://", "www.", ".com", "buy cheap", "crypto",
        "bitcoin", "click here", "subscribe to my", "onlyfans"
    ]
};

// Mild profanity is allowed (people vent), but we check it for analytics
const PROFANITY_DICTIONARY = [
    "fuck", "shit", "bitch", "asshole", "cunt", "motherfucker", "dick", "cock"
];

/**
 * Validates text against the safety dictionary.
 * @param {string} text - The raw text input from the user.
 * @returns {object} { isValid: boolean, isCrisis: boolean, isTier1: boolean, isTier2: boolean, triggerWord: string, category: string }
 */
export function validateSubmission(text) {
    if (!text || typeof text !== 'string') {
        return { isValid: false, isCrisis: false, isTier1: false, isTier2: false, triggerWord: null, category: "invalid" };
    }

    const normalizedText = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ");

    // Check Crisis Tier 1 (Highest Priority - Triggers Lifeline Modal and blocks if needed)
    for (let word of SAFETY_DICTIONARY.crisis_tier1) {
        if (normalizedText.includes(word)) {
            return { isValid: false, isCrisis: true, isTier1: true, isTier2: false, triggerWord: word, category: "crisis_tier1" };
        }
    }

    // Check Crisis Tier 2 (Concern - Non-blocking nudge/banner)
    for (let word of SAFETY_DICTIONARY.crisis_tier2) {
        if (normalizedText.includes(word)) {
            return { isValid: true, isCrisis: true, isTier1: false, isTier2: true, triggerWord: word, category: "crisis_tier2" };
        }
    }

    // Check Abuse/Illegal (Blocks silently or shows generic error)
    for (let word of SAFETY_DICTIONARY.abuse) {
        if (normalizedText.includes(word)) {
            return { isValid: false, isCrisis: false, isTier1: false, isTier2: false, triggerWord: word, category: "abuse" };
        }
    }

    // Check Hate Speech (Blocks silently)
    for (let word of SAFETY_DICTIONARY.hate_speech) {
        if (normalizedText.includes(word)) {
            return { isValid: false, isCrisis: false, isTier1: false, isTier2: false, triggerWord: word, category: "hate_speech" };
        }
    }

    // Check Spam (Blocks silently)
    for (let word of SAFETY_DICTIONARY.spam) {
        if (normalizedText.includes(word)) {
            return { isValid: false, isCrisis: false, isTier1: false, isTier2: false, triggerWord: word, category: "spam" };
        }
    }

    return { isValid: true, isCrisis: false, isTier1: false, isTier2: false, triggerWord: null, category: "safe" };
}

/**
 * Checks if text contains mild profanity (does not block, just flags)
 */
export function containsProfanity(text) {
    if (!text) return false;
    const normalizedText = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ");
    return PROFANITY_DICTIONARY.some(word => normalizedText.includes(word));
}
