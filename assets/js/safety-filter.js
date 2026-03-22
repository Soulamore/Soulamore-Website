/**
 * Soulamore Safety & Keyword Moderation Filter
 * 
 * Protects the platform legally by intercepting high-risk
 * content (suicide, self-harm, illegal acts, severe hate speech)
 * BEFORE it reaches the database.
 */

const SAFETY_DICTIONARY = {
    crisis: [
        "suicide", "kill myself", "want to die", "end it all", "end my life",
        "better off dead", "cutting myself", "overdose", "slit my wrists",
        "drink bleach", "jump off", "kms", "k.m.s", "shoot myself"
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
 * @returns {object} { isValid: boolean, isCrisis: boolean, triggerWord: string, category: string }
 */
export function validateSubmission(text) {
    if (!text || typeof text !== 'string') {
        return { isValid: false, isCrisis: false, triggerWord: null, category: "invalid" };
    }

    const normalizedText = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ");

    // Check Crisis (Highest Priority - Triggers Lifeline Modal)
    for (let word of SAFETY_DICTIONARY.crisis) {
        if (normalizedText.includes(word)) {
            return { isValid: false, isCrisis: true, triggerWord: word, category: "crisis" };
        }
    }

    // Check Abuse/Illegal (Blocks silently or shows generic error)
    for (let word of SAFETY_DICTIONARY.abuse) {
        if (normalizedText.includes(word)) {
            return { isValid: false, isCrisis: false, triggerWord: word, category: "abuse" };
        }
    }

    // Check Hate Speech (Blocks silently)
    for (let word of SAFETY_DICTIONARY.hate_speech) {
        if (normalizedText.includes(word)) {
            return { isValid: false, isCrisis: false, triggerWord: word, category: "hate_speech" };
        }
    }

    // Check Spam (Blocks silently)
    for (let word of SAFETY_DICTIONARY.spam) {
        if (normalizedText.includes(word)) {
            return { isValid: false, isCrisis: false, triggerWord: word, category: "spam" };
        }
    }

    return { isValid: true, isCrisis: false, triggerWord: null, category: "safe" };
}

/**
 * Checks if text contains mild profanity (does not block, just flags)
 */
export function containsProfanity(text) {
    if (!text) return false;
    const normalizedText = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, " ");
    return PROFANITY_DICTIONARY.some(word => normalizedText.includes(word));
}
