// ---- STATE MANAGEMENT ----
let smartStartState = {
    stage: 0,
    user: { name: 'Anonymous', email: '' },
    primary_signal: null,
    secondary_signal: null,
    severity_band: null,
    context_tag: null,
    wants_depth: null
};

// ---- DOM ELEMENTS ----
const chatHistory = document.getElementById('chat-history');
const inputArea = document.getElementById('input-area');
const textInputForm = document.getElementById('text-input-form');
const chatInput = document.getElementById('chat-input');
const choicesArea = document.getElementById('choices-area');
const idModalOverlay = document.getElementById('id-modal-overlay');

// ---- MAPPING TABLE (Pure Logic, No AI) ----
const smartStartMapping = [
    // ANXIETY TRACK
    { primary: 'anxiety', secondary: 'thoughts', severity: 'moderate', matches: ['anxiety_loops', 'anxiety_future', 'anxiety_calm'], weight: 10 },
    { primary: 'anxiety', secondary: 'body', severity: 'any', matches: ['anxiety_somatic', 'anxiety_panic', 'emotional_regulation'], weight: 10 },
    { primary: 'anxiety', secondary: 'relationships', severity: 'any', matches: ['anxiety_social', 'relationship_patterns'], weight: 10 },
    { primary: 'anxiety', secondary: 'any', severity: 'strong', matches: ['anxiety_panic', 'anxiety_somatic', 'psychological_first_aid_initial_response'], weight: 12 },

    // BURNOUT / OVERWHELM TRACK
    { primary: 'overwhelmed', context: 'work', severity: 'any', matches: ['burnout_career', 'academic_deadline', 'mood_exhaustion'], weight: 10 },
    { primary: 'overwhelmed', context: 'studies', severity: 'any', matches: ['academic_exam', 'academic_fatigue', 'academic_imposter'], weight: 10 },

    // MOOD / LOW ENERGY TRACK
    { primary: 'low', secondary: 'body', severity: 'any', matches: ['mood_submerged', 'mood_exhaustion', 'mood_fog'], weight: 10 },
    { primary: 'low', secondary: 'thoughts', severity: 'any', matches: ['mood_critic', 'mood_anhedonia', 'core_mood_depression'], weight: 10 },

    // RELATIONSHIP / LONELINESS TRACK
    { primary: 'isolated', context: 'migration', severity: 'any', matches: ['migration_isolation', 'migration_culture', 'migration_nomad'], weight: 10 },
    { primary: 'relationships', severity: 'strong', matches: ['relationship_patterns', 'emotional_regulation', 'anxiety_social'], weight: 10 },

    // FALLBACKS
    { primary: 'off', context: 'any', severity: 'any', matches: ['emotional_regulation', 'anxiety_calm', 'mood_resilience'], weight: 1 }
];


// ---- KEYWORD DICTIONARIES FOR OPEN TEXT (STAGE 1) ----
const keywords = {
    anxiety: ['anxious', 'stress', 'worried', 'nervous', 'panic', 'edge', 'overthinking', 'racing'],
    low: ['sad', 'depressed', 'down', 'drained', 'empty', 'flat', 'tired', 'exhausted', 'numb'],
    isolated: ['lonely', 'alone', 'disconnected', 'isolated', 'nobody'],
    relationships: ['partner', 'friend', 'fight', 'breakup', 'arguing', 'marriage', 'dating'],
    overwhelmed: ['overwhelmed', 'much', 'drowning', 'burnout', 'pressure', 'busy'],
    off: ['stuck', 'off', 'lost', 'confused', 'weird']
};

const safetyKeywords = ['die', 'kill', 'suicide', 'end it', 'want to sleep forever', 'no point'];

// ---- INITIALIZATION & MODAL HANDLERS ----
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('smart-start-form').addEventListener('submit', (e) => {
        e.preventDefault();
        smartStartState.user.name = document.getElementById('userName').value || 'Anonymous';
        smartStartState.user.email = document.getElementById('userEmail').value || '';
        startGame();
    });

    document.getElementById('btn-skip-id').addEventListener('click', () => {
        startGame();
    });

    textInputForm.addEventListener('submit', handleOpenTextSubmit);
});

function startGame() {
    idModalOverlay.style.opacity = '0';
    setTimeout(() => {
        idModalOverlay.style.display = 'none';
        smartStartState.stage = 1;
        appendBotMessage(`I'm glad you're here, ${smartStartState.user.name !== 'Anonymous' ? smartStartState.user.name : 'friend'}.<br><br>Before we dive in, what's been feeling most present for you lately?`);
        showTextInput();
    }, 400);
}

// ---- UI HELPERS ----
function appendBotMessage(htmlString) {
    const row = document.createElement('div');
    row.className = 'message-row bot';

    // Typing indicator
    row.innerHTML = `<div class="bubble bot"><div class="typing"><span></span><span></span><span></span></div></div>`;
    chatHistory.appendChild(row);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    setTimeout(() => {
        row.innerHTML = `<div class="bubble bot">${htmlString}</div>`;
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }, 1200); // Fake bot typing delay
}

function appendUserMessage(text) {
    const row = document.createElement('div');
    row.className = 'message-row user';
    row.innerHTML = `<div class="bubble user">${text}</div>`;
    chatHistory.appendChild(row);
    chatHistory.scrollTop = chatHistory.scrollHeight;
}

function showTextInput() {
    inputArea.style.display = 'block';
    textInputForm.style.display = 'flex';
    choicesArea.style.display = 'none';
    chatInput.value = '';
    chatInput.focus();
}

function showChoices(chipsArray) {
    inputArea.style.display = 'block';
    textInputForm.style.display = 'none';
    choicesArea.style.display = 'flex';
    choicesArea.innerHTML = '';

    chipsArray.forEach(chip => {
        const btn = document.createElement('button');
        btn.className = 'choice-chip';
        btn.innerText = chip.label;
        btn.onclick = () => handleChoiceSelection(chip);
        choicesArea.appendChild(btn);
    });
}

// ---- LOGIC: STAGE 1 (OPEN TEXT) ----
function handleOpenTextSubmit(e) {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    appendUserMessage(text);
    inputArea.style.display = 'none'; // hide until bot replies

    // Safety Guardrail
    const isUnsafe = safetyKeywords.some(kw => text.toLowerCase().includes(kw));
    if (isUnsafe) {
        setTimeout(() => {
            appendBotMessage(`<strong>I hear how much pain you are in right now.</strong><br><br>You are not alone. Please pause this assessment and connect with immediate support. Your safety is the priority.<br><br><a href="../../get-help-now.html" style="color:var(--engine-theme);">Access Crisis Resources Here</a>`);
        }, 1200);
        return; // Halt flow
    }

    // Keyword Extraction
    let detectedPrimary = 'off'; // default fallback
    const lowerText = text.toLowerCase();

    for (const [category, words] of Object.entries(keywords)) {
        if (words.some(w => lowerText.includes(w))) {
            detectedPrimary = category;
            break; // take the first match
        }
    }

    smartStartState.primary_signal = detectedPrimary;
    smartStartState.stage = 2;

    // Proceed to Turn 2: Narrowing based on primary signal
    setTimeout(triggerStage2, 1200);
}

// ---- LOGIC: STAGE 2 (NARROWING) ----
function triggerStage2() {
    let promptText = "";
    let chips = [];

    switch (smartStartState.primary_signal) {
        case 'anxiety':
            promptText = "When you say anxious or stressed, is it mostly physical tension, racing thoughts, or a mix of both in social situations?";
            chips = [
                { label: 'Racing Thoughts', value: 'thoughts', type: 'secondary_signal' },
                { label: 'Physical Tension (Chest, Gut)', value: 'body', type: 'secondary_signal' },
                { label: 'Around People', value: 'relationships', type: 'secondary_signal' },
                { label: 'A bit of everything', value: 'any', type: 'secondary_signal' }
            ];
            break;
        case 'low':
            promptText = "That heavy, drained feeling—do you notice it more as a physical exhaustion, a harsh inner critic, or feeling numb to things you used to enjoy?";
            chips = [
                { label: 'Physical Exhaustion', value: 'body', type: 'secondary_signal' },
                { label: 'Harsh Inner Critic', value: 'thoughts', type: 'secondary_signal' },
                { label: 'Feeling Numb', value: 'thoughts', type: 'secondary_signal' } // maps to anhedonia
            ];
            break;
        case 'relationships':
            promptText = "Are these relationship strains causing more heated arguments, quiet distance, or just a general sense of not belonging?";
            chips = [
                { label: 'Heated Arguments', value: 'conflict', type: 'secondary_signal' },
                { label: 'Quiet Distance', value: 'avoidance', type: 'secondary_signal' },
                { label: 'Not Belonging', value: 'loneliness', type: 'secondary_signal' }
            ];
            break;
        case 'overwhelmed':
            promptText = "Is this overwhelm mostly tied to your career/workplace, academic studies, or personal life changes?";
            chips = [
                { label: 'Work / Career', value: 'work', type: 'context_tag' },
                { label: 'Academic / School', value: 'studies', type: 'context_tag' },
                { label: 'Personal Life', value: 'life', type: 'context_tag' }
            ];
            break;
        default:
            // "off" or "isolated"
            promptText = "It can be hard to pin down. On most days, does it feel manageable, distracting, or completely overwhelming right now?";
            smartStartState.stage = 3; // Skip directly to intensity
            chips = [
                { label: 'Manageable (Comes & Goes)', value: 'mild', type: 'severity_band' },
                { label: 'Distracting (Affects Focus)', value: 'moderate', type: 'severity_band' },
                { label: 'Overwhelming (Stuck)', value: 'strong', type: 'severity_band' }
            ];
            break;
    }

    appendBotMessage(promptText);
    setTimeout(() => { showChoices(chips); }, 1200);
}

// ---- LOGIC: STAGE 3 (INTENSITY OR CONTEXT) ----
function handleChoiceSelection(chip) {
    appendUserMessage(chip.label);
    inputArea.style.display = 'none';

    // Update state
    smartStartState[chip.type] = chip.value;

    setTimeout(() => {
        if (smartStartState.stage === 2) {
            smartStartState.stage = 3;
            // Ask Intensity if not already asked
            if (!smartStartState.severity_band) {
                appendBotMessage("Got it. On most days, does this feel manageable (it comes and goes), distracting, or heavy enough that you feel completely stuck?");
                showChoices([
                    { label: 'Manageable', value: 'mild', type: 'severity_band' },
                    { label: 'Distracting', value: 'moderate', type: 'severity_band' },
                    { label: 'Heavy / Stuck', value: 'strong', type: 'severity_band' }
                ]);
            } else {
                triggerStage4(); // Jump to next
            }
        } else if (smartStartState.stage === 3) {
            triggerStage4();
        } else if (smartStartState.stage === 4) {
            triggerStage5();
        }
    }, 1200);
}

// ---- LOGIC: STAGE 4 (DEPTH CHECK) ----
function triggerStage4() {
    smartStartState.stage = 4;
    appendBotMessage("Thank you for sharing that. Do you prefer something light to start, or are you ready for a deeper dive?");
    showChoices([
        { label: 'Quick Reflection', value: 'light', type: 'wants_depth' },
        { label: 'Deeper Exploration', value: 'deep', type: 'wants_depth' }
    ]);
}

// ---- LOGIC: STAGE 5 (SCORING & RESULTS) ----
function triggerStage5() {
    smartStartState.stage = 5;

    // Save to Firebase (Simulation for now, assuming window.db if initialized)
    console.log("Saving Smart Start State:", smartStartState);
    if (window.db) {
        try {
            import("https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js").then((firestore) => {
                firestore.addDoc(firestore.collection(window.db, "smart_start_sessions"), {
                    ...smartStartState,
                    timestamp: firestore.serverTimestamp()
                });
            });
        } catch (e) { console.error("Firebase save blocked/failed", e); }
    }

    // Match Logic
    let bestMatch = null;
    let highestWeight = -1;

    for (const rule of smartStartMapping) {
        if (rule.primary === smartStartState.primary_signal) {
            let matchScore = 0;
            // Secondary match boosts score heavily
            if (rule.secondary && (rule.secondary === smartStartState.secondary_signal || rule.secondary === 'any')) {
                matchScore += 5;
            }
            // Context match
            if (rule.context && (rule.context === smartStartState.context_tag || rule.context === 'any')) {
                matchScore += 4;
            }
            // Severity match
            if (rule.severity && (rule.severity === smartStartState.severity_band || rule.severity === 'any')) {
                matchScore += 3;
            }

            const totalWeight = rule.weight + matchScore;
            if (totalWeight > highestWeight) {
                highestWeight = totalWeight;
                bestMatch = rule;
            }
        }
    }

    // Fallback if somehow no match
    if (!bestMatch) bestMatch = smartStartMapping[smartStartMapping.length - 1];

    let recIds = bestMatch.matches;
    // Limit to 3 (User rule: 3-5 max, choice overload kills action)
    recIds = recIds.slice(0, 3);

    let html = `From what you've shared, starting with a short reflection might help untangle things. There's no right order.<br><br>✨ <strong>Here's where you might begin:</strong><br><div class="recs-container">`;

    recIds.forEach(id => {
        // Find test data in SoulamoreAssessments
        const testData = window.SoulamoreAssessments[id];
        if (testData) {
            html += `
                <a href="engine.html?id=${id}" class="rec-card">
                    <h4>${testData.title}</h4>
                    <p>${testData.description}</p>
                </a>
            `;
        }
    });

    html += `</div>`;

    appendBotMessage(html);
}
