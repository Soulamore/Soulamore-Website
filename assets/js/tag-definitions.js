/**
 * tag-definitions.js
 * Centralized source of truth for all categorization in Soulamore.
 */

export const PEER_CATEGORIES = {
    "Life Transitions & Events": [
        "Abusive marriage", "Abusive relationship", "Affair/Infidelity", "Adoption", "Grief", 
        "Loss of parent", "Lost a close friend", "Lost a family member", "Lost a loved one", 
        "Lost a sibling", "Lost parent early", "Miscarriage", "Moved countries", 
        "Raised by single parent", "Single parent", "Divorce/separation", "Marital issues"
    ],
    "Mental Health": [
        "ADHD", "Anxiety", "Autism", "Bipolar disorder", "Borderline Personality Disorder", 
        "Depression", "Insomnia", "OCD", "Overthinking", "Panic attack", "PTSD", 
        "Schizophrenia", "Self harm", "Suicidal thoughts", "Social Anxiety", 
        "Emotional resilience", "Mental Health", "Mental illness in family"
    ],
    "Career & Education": [
        "Academic/exam failure", "Burnout", "Career failure", "Career fulfilment", 
        "Career gaps/Break", "Career path confusion", "Career stress", "Career Transitions", 
        "Fired/Laid off", "Imposter syndrome", "Motivation issues", "Quitting a job", 
        "Studied/Studying abroad", "Switching careers", "Toxic workplace", "Off-beat careers"
    ],
    "Health & Wellbeing": [
        "Alopecia", "Arthritis", "Autoimmune disease/ inflammation", "Cancer", 
        "Disability", "Epilepsy", "Fibromyalgia", "Hair issues", "Kidney disease", 
        "Medical issues", "PCOD/PCOS", "Rare condition", "Skin issues", "Neurological issues"
    ],
    "Personal & Social": [
        "Balance work & kids", "Body image", "Bullying", "Caregiver stress", 
        "Caregiver to parent", "Caregiver to sibling", "Caregiving", "Changed career path", 
        "Childfree", "Childhood issues", "Childhood trauma", "Emotional abuse", 
        "Family health issue", "Family issues", "Financial stress", "Introversion", 
        "Issues in friendship", "Issues with in-laws", "Loneliness", "Long distance relationship", 
        "Low self-esteem", "Negativity", "Parenting", "Relationship", "Relationship issues", 
        "Relationships", "Self-doubt", "Self-growth", "Sexual abuse", "Spirituality", 
        "Toxicity/manipulation"
    ]
};

export const PSYCH_CLINICAL_TAGS = [
    "Anxiety Disorders", "Depression", "Obsessive-Compulsive Disorder (OCD)", 
    "Post-Traumatic Stress Disorder (PTSD)", "Bipolar Disorder", "Schizophrenia Spectrum", 
    "Personality Disorders", "Eating Disorders", "Substance Use Disorders", 
    "Neurodevelopmental Disorders (ADHD, Autism)", "Psychosomatic Disorders", 
    "Grief and Bereavement", "Relational and Marital Issues", "Child and Adolescent Mental Health", 
    "Geriatric Mental Health", "Sleep Disorders", "Sexual Dysfunctions", "Trauma and Abuse Recovery"
];

export const PSYCH_APPROACH_TAGS = [
    "Cognitive Behavioral Therapy (CBT)", "Dialectical Behavior Therapy (DBT)", 
    "Acceptance and Commitment Therapy (ACT)", "Eye Movement Desensitization and Reprocessing (EMDR)", 
    "Psychodynamic Therapy", "Humanistic/Existential Therapy", "Family/Systemic Therapy", 
    "Mindfulness-Based Cognitive Therapy (MBCT)", "Solution-Focused Brief Therapy (SFBT)", 
    "Gestalt Therapy", "Schema Therapy", "Integrative/Eclectic Approach"
];

export const PEER_CATEGORIES_FOR_PSYCH = {
    "Life Transitions & Events": PEER_CATEGORIES["Life Transitions & Events"],
    "Common Challenges": [
        "Academic/exam failure", "Burnout", "Career stress", "Financial stress", 
        "Loneliness", "Low self-esteem", "Parenting", "Self-doubt", "Self-growth", 
        "Spirituality", "Toxicity/manipulation"
    ]
};
