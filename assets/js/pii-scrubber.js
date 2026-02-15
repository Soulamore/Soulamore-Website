/**
 * Soulamore Privacy Layer (PII Scrubber)
 * ensuring anonymous content remains anonymous.
 * 
 * Usage: PIIScrubber.scrub(text);
 */

const PIIScrubber = {
    // Regex Patterns for PII
    patterns: {
        email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
        phone: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g,
        // Heuristic: capitalized words that look like names (skip start of sentences)
        // This is aggressive and might catch "London" or "Tuesday", which is acceptable for "Void" context.
        names: /\b[A-Z][a-z]+\b/g
    },

    scrub: function (text) {
        if (!text) return "";

        let cleanText = text;

        // 1. Redact Emails
        cleanText = cleanText.replace(this.patterns.email, '[EMAIL_REDACTED]');

        // 2. Redact Phone Numbers
        cleanText = cleanText.replace(this.patterns.phone, '[PHONE_REDACTED]');

        // 3. Redact Likely Names (Aggressive mode for Void/Shred)
        // We only run this if specifically requested for high-anonymity modes
        // cleanText = cleanText.replace(this.patterns.names, '[NAME?]'); 

        return cleanText;
    },

    // Strict Mode for "Burn/Shred" features where NO identity should exist
    scrubStrict: function (text) {
        if (!text) return "";
        let cleanText = this.scrub(text);

        // Remove ANY Capitalized word in the middle of a sentence to be safe about names
        // Note: This makes text look generic, which is the goal.
        cleanText = cleanText.replace(/(?<!^|[.!?]\s)\b[A-Z][a-z]+\b/g, '[ANON]');

        return cleanText;
    }
};

window.PIIScrubber = PIIScrubber;
