window.SoulamoreAssessments = {};
window.SoulamoreCitations = {};

window.SoulamoreAssessments["anxiety_overthinking"] = {
    "id": "anxiety_overthinking",
    "title": "Anxiety & Anticipatory Stress",
    "version": "1.0",
    "description": "Map out the architecture of your overthinking. Separate structural anxiety from situational worry.",
    "primary_domain": "Anxiety Spectrum",
    "context_tags": ["Academic", "Workplace", "Digital"],
    "target_audience": ["Students", "Workplaces"],
    "tags": ["Anxiety", "Academic Stress", "Career Anxiety"],
    "theme_color": "#4ECDC4",
    "questions": [{ "id": "ax_q1", "text": "When facing an upcoming event or deadline, my baseline state is usually...", "domain": "anxiety_overthinking", "subdomain": "anticipatory", "risk_flag": false, "options": [{ "text": "Focused on preparation; mostly calm.", "severity_weight": 0 }, { "text": "A manageable level of nervous energy.", "severity_weight": 1 }, { "text": "Preoccupied with worst-case scenarios.", "severity_weight": 2 }, { "text": "Paralyzed by dread, making it hard to start.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "fact", "title": "Anticipatory Protection", "text": "Overthinking isn't a character flaw; it's often an evolutionary defense mechanism. Clinical frameworks like the GAD-7 recognize that anticipating the future is simply your mind's exhausting attempt to keep you safe from uncertainty.", "source_name": "Level 1 Cross-Cutting Symptom Measures" } }, { "id": "ax_q2", "text": "Physically, my anxiety tends to manifest as...", "domain": "anxiety_overthinking", "subdomain": "somatic", "risk_flag": false, "options": [{ "text": "Occasional tension that passes quickly.", "severity_weight": 0 }, { "text": "A tight stomach, restlessness, or light sweating.", "severity_weight": 1 }, { "text": "A racing heart, shortness of breath, or dizziness.", "severity_weight": 2 }, { "text": "Full panic symptoms that feel physically overwhelming.", "severity_weight": 3, "risk_weight": 1, "functional_impairment": true }] }, { "id": "ax_q3", "text": "When invited to social gatherings or required to perform, I tend to...", "domain": "anxiety_overthinking", "subdomain": "social_avoidance", "risk_flag": false, "options": [{ "text": "Look forward to it.", "severity_weight": 0 }, { "text": "Feel nervous but go anyway.", "severity_weight": 1 }, { "text": "Overthink my behavior and analyze every interaction.", "severity_weight": 2 }, { "text": "Frequently cancel or avoid them entirely due to fear.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "ax_q4", "text": "At night, when trying to sleep, my mind...", "domain": "anxiety_overthinking", "subdomain": "cognitive", "risk_flag": false, "options": [{ "text": "Usually powers down smoothly.", "severity_weight": 0 }, { "text": "Occasionally replays the day's events.", "severity_weight": 1 }, { "text": "Races through checklists and 'what-ifs'.", "severity_weight": 2 }, { "text": "Loops obsessively on mistakes or fears, preventing sleep.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "clinical", "title": "Catastrophizing", "text": "When uncertainty hits, many of us jump to the worst-case scenario. This is a recognized cognitive distortion known as 'catastrophizing'. You are not alone in this\u2014it's a very human reflex when we feel fundamentally unsafe.", "source_name": "Cognitive Behavioral Therapy (CBT) Frameworks" } }, { "id": "ax_q5", "text": "When anxiety peaks, do you experience thoughts of losing control or feeling like nothing is real?", "domain": "anxiety_overthinking", "subdomain": "cognitive_risk", "risk_flag": true, "options": [{ "text": "Never.", "severity_weight": 0 }, { "text": "Rarely, usually in highly stressful moments.", "severity_weight": 1 }, { "text": "Sometimes, I feel detached from reality.", "severity_weight": 2, "risk_weight": 1 }, { "text": "Often, I feel terrified that I am losing my mind.", "severity_weight": 3, "risk_weight": 3, "functional_impairment": true }] }], "scoring": { "max_possible": 15, "bands": [{ "range": [0, 3], "label": "minimal", "risk_category": "low", "escalation_required": false }, { "range": [4, 7], "label": "mild", "risk_category": "low", "escalation_required": false }, { "range": [8, 11], "label": "moderate", "risk_category": "medium", "escalation_required": false }, { "range": [12, 15], "label": "severe", "risk_category": "high", "escalation_required": true }], "risk_threshold": 3 }
};

window.SoulamoreAssessments["burnout_career"] = {
    "id": "burnout_career",
    "title": "Burnout & Functional Depletion",
    "version": "1.0",
    "description": "Assess emotional exhaustion, structural fatigue, and signs of prolonged professional stress.",
    "primary_domain": "Burnout & Functional Exhaustion",
    "context_tags": ["Workplace", "Leadership", "Performance"],
    "target_audience": ["Workplaces", "Students"],
    "tags": ["Burnout", "Career Anxiety", "Academic Stress"],
    "theme_color": "#fbbf24",
    "questions": [{ "id": "br_q1", "text": "When I think about my daily responsibilities or projects, I mostly feel...", "domain": "burnout_career", "subdomain": "emotional_exhaustion", "risk_flag": false, "options": [{ "text": "Motivated, even if tired.", "severity_weight": 0 }, { "text": "Like my energy is dragging.", "severity_weight": 1 }, { "text": "A sense of heavy dread.", "severity_weight": 2 }, { "text": "Entirely numb; I cannot care anymore.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "fact", "title": "More Than Just Tired", "text": "Burnout differs from standard fatigue. Occupational frameworks emphasize that burnout involves 'depersonalization'\u2014a protective numbness that sets in when you endure prolonged, systemic stress without adequate relief.", "source_name": "Occupational Psychology Measures" } }, { "id": "br_q2", "text": "Regarding my cognitive focus over the last month, I notice...", "domain": "burnout_career", "subdomain": "cognitive", "risk_flag": false, "options": [{ "text": "I can focus well on complex tasks.", "severity_weight": 0 }, { "text": "My attention wanders more than usual.", "severity_weight": 1 }, { "text": "I frequently blank out or forget simple things.", "severity_weight": 2 }, { "text": "Brain fog is so severe I cannot complete basic work.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "br_q3", "text": "Toward the people I interact with daily (clients, peers, family), my attitude has become...", "domain": "burnout_career", "subdomain": "depersonalization", "risk_flag": false, "options": [{ "text": "Empathetic and engaged.", "severity_weight": 0 }, { "text": "Quick to irritate over small mistakes.", "severity_weight": 1 }, { "text": "Cynical, feeling like their problems aren't real.", "severity_weight": 2 }, { "text": "Hostile or deeply disconnected; I view everyone as a burden.", "severity_weight": 3, "risk_weight": 1 }], "clinical_context": "Aligned with WHODAS 2.0 assessing functional impairment in daily responsibilities." }, { "id": "br_q4", "text": "Physiologically, when I finish my day, my body feels...", "domain": "burnout_career", "subdomain": "somatic", "risk_flag": false, "options": [{ "text": "Naturally tired, ready for rest.", "severity_weight": 0 }, { "text": "Achy but manageable.", "severity_weight": 1 }, { "text": "Wired but physically depleted (tired but can't sleep).", "severity_weight": 2 }, { "text": "Constantly sick, experiencing migraines, or severe fatigue.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "guideline", "title": "Your Right to Rest", "text": "Under the Mental Healthcare Act (2017), your psychological well-being is a protected right. Experiencing profound exhaustion means your system requires structural rest, and prioritizing that recovery is a critical health necessity, not a luxury.", "source_name": "Mental Healthcare Act 2017 (India)" } }, { "id": "br_q5", "text": "Have you significantly neglected your basic needs (food, hydration, hygiene) to cope with the stress?", "domain": "burnout_career", "subdomain": "behavioral_risk", "risk_flag": true, "options": [{ "text": "No, I maintain my routines.", "severity_weight": 0 }, { "text": "Only occasionally when swamped.", "severity_weight": 1 }, { "text": "Yes, I often skip meals or sleep to keep up.", "severity_weight": 2, "risk_weight": 1 }, { "text": "Yes, I have abandoned self-care completely.", "severity_weight": 3, "risk_weight": 3, "functional_impairment": true }] }], "scoring": { "max_possible": 15, "bands": [{ "range": [0, 3], "label": "minimal", "risk_category": "low", "escalation_required": false }, { "range": [4, 7], "label": "mild", "risk_category": "low", "escalation_required": false }, { "range": [8, 11], "label": "moderate", "risk_category": "medium", "escalation_required": false }, { "range": [12, 15], "label": "severe", "risk_category": "high", "escalation_required": true }], "risk_threshold": 3 }
};

window.SoulamoreCitations = {
    "emotional_regulation": {
        "title": "Emotional Regulation & Intensity",
        "citations": [
            { "name": "DERS-18 (Difficulties in Emotion Regulation Scale)", "category": "Clinical Assessment", "description": "Measures awareness, clarity, and access to emotion regulation strategies based on the Gratz & Roemer framework." },
            { "name": "DBT Skills Training Manual (Linehan, 2014)", "category": "Therapeutic Framework", "description": "Core protocols for distress tolerance, emotional regulation, and interpersonal effectiveness." }
        ],
        "disclaimer": "Grounding insights in validated DERS and DBT frameworks to help you track emotional baseline shifts."
    },
    "anxiety_overthinking": {
        "title": "Anxiety & Anticipatory Stress",
        "citations": [
            { "name": "GAD-7 (Generalized Anxiety Disorder-7)", "category": "Clinical Gold Standard", "description": "The primary clinical tool for assessing worry frequency and perceived lack of control over thoughts." },
            { "name": "Penn State Worry Questionnaire (PSWQ)", "category": "Research Protocol", "description": "Validated measure of trait worry and chronic overthinking patterns." }
        ],
        "disclaimer": "Mapped to GAD-7 and PSWQ benchmarks for clinical accuracy in self-reflection."
    },
    "burnout_career": {
        "title": "Burnout & Functional Depletion",
        "citations": [
            { "name": "Maslach Burnout Inventory (MBI)", "category": "Occupational Standard", "description": "The leading research tool for measuring emotional exhaustion, depersonalization, and professional efficacy." },
            { "name": "WHODAS 2.0 (WHO Disability Schedule)", "category": "Functional Impairment", "description": "Global clinical standard for measuring impact on daily functioning and professional responsibilities." }
        ],
        "disclaimer": "Utilizes MBI and WHODAS parameters to identify structural depletion. Not a diagnostic tool."
    },
    "relationship_patterns": {
        "title": "Relationship & Attachment Patterns",
        "citations": [
            { "name": "ECR-R (Experiences in Close Relationships-Revised)", "category": "Attachment Theory", "description": "Standardized measure for assessing anxiety and avoidance in adult attachment dynamics." },
            { "name": "Adult Attachment Inventory (AAI) Frameworks", "category": "Clinical Formulation", "description": "Foundational research protocols for identifying relational response patterns under stress." }
        ],
        "disclaimer": "Grounding relational insights in validated ECR-R attachment benchmarks."
    },
    "core_mood_depression": {
        "title": "Core Mood & Heaviness",
        "citations": [
            { "name": "PHQ-9 (Patient Health Questionnaire-9)", "category": "Clinical Standard", "description": "The most widely used clinical scale for identifying symptoms of mood collapse and lethargy." },
            { "name": "Columbia-Suicide Severity Rating Scale (C-SSRS)", "category": "Safety Protocol", "description": "Clinical guidelines for risk assessment and safety planning in mood-related journeys." }
        ],
        "disclaimer": "Mapped to PHQ-9 benchmarks. If you are in immediate distress, please use our crisis resources."
    },
    "anxiety_loops": {
        "title": "The Overthinking Filter",
        "citations": [
            { "name": "Metacognitive Questionnaire (MCQ-30)", "category": "Metacognitive Research", "description": "Identifies individual differences in beliefs about thinking, including positive/negative beliefs about worry." },
            { "name": "Rumination-Reflection Questionnaire (RRQ)", "category": "Cognitive Protocol", "description": "Measures the tendency to look back with distress vs. constructive self-reflection." }
        ],
        "disclaimer": "Grounding overthinking patterns in MCQ-30 and RRQ cognitive models."
    },
    "anxiety_somatic": {
        "title": "Somatic Echoes: Physical Anxiety",
        "citations": [
            { "name": "PHQ-15 (Patient Health Questionnaire-15)", "category": "Somatic Clinical Tool", "description": "The global standard for measuring the severity of physical manifestations of psychological distress." },
            { "name": "The Somatic Symptom Scale-8 (SSS-8)", "category": "Research Metric", "description": "A brief, validated measure for identifying somatic symptom burden in high-stress environments." }
        ],
        "disclaimer": "Utilizing PHQ-15 and SSS-8 parameters to translate physical tension into actionable insight."
    },
    "anxiety_future": {
        "title": "The Anticipation Clock",
        "citations": [
            { "name": "IUS-12 (Intolerance of Uncertainty Scale)", "category": "Core Anxiety Research", "description": "Validated clinical tool for measuring the degree to which uncertainty is perceived as threatening or intolerable." },
            { "name": "Expectancy & Value Theory (EVT)", "category": "Psychological Framework", "description": "Examines how anticipation of future reward or threat drives current emotional intensity." }
        ],
        "disclaimer": "Mapped to IUS-12 benchmarks to identify the mechanics of future-oriented worry."
    },
    "anxiety_calm": {
        "title": "The Quietude Baseline",
        "citations": [
            { "name": "DERS-18 (Difficulties in Emotion Regulation)", "category": "Regulation Standard", "description": "Measures awareness and access to strategies for de-activating the nervous system after stress." },
            { "name": "Polyvagal Theory (Porges, 2011)", "category": "Neurobiology Framework", "description": "Scientific framework for understanding the 'safety-threat' detection system and vagal tone resilience." }
        ],
        "disclaimer": "Rooting stillness capacity in Polyvagal Theory and DERS regulation protocols."
    },
    "anxiety_social": {
        "title": "Social Performance & Intimacy",
        "citations": [
            { "name": "LSAS (Liebowitz Social Anxiety Scale)", "category": "Social Gold Standard", "description": "The primary clinical measure for assessing both fear and avoidance in diverse social situations." },
            { "name": "SPIN (Social Phobia Inventory)", "category": "Screening Metric", "description": "A validated tool for identifying performance-based anxiety and sensory social overwhelm." }
        ],
        "disclaimer": "Grounding social friction points in LSAS and SPIN clinical benchmarks."
    },
    "anxiety_nighttime": {
        "title": "Nighttime Echoes",
        "citations": [
            { "name": "PSQI (Pittsburgh Sleep Quality Index)", "category": "Sleep Research Standard", "description": "Global metric for assessing sleep quality and the impact of psychological distress on sleep architecture." },
            { "name": "The Pre-Sleep Arousal Scale (PSAS)", "category": "Anxiety Research", "description": "Specifically monitors the cognitive and somatic 'buzz' that prevents the nervous system from powering down." }
        ],
        "disclaimer": "Mapping nighttime vigilance to PSQI and PSAS clinical protocols."
    },
    "anxiety_perfectionism": {
        "title": "The Perfectionist's Mirror",
        "citations": [
            { "name": "MPS (Multidimensional Perfectionism Scale)", "category": "Cognitive Gold Standard", "description": "The primary scale for distinguishing between high standards and maladaptive perfectionism." },
            { "name": "The Frost Perfectionism Scale", "category": "Research Framework", "description": "Identifies the core fears of making mistakes and perceived parental/social pressure." }
        ],
        "disclaimer": "Grounding performance anxiety in MPS and Frost perfectionism models."
    },
    "anxiety_decisions": {
        "title": "The Decision Vortex",
        "citations": [
            { "name": "The Indecisiveness Scale (Frost & Shows)", "category": "Executive Function Metric", "description": "Measures the chronic inability to finalize choices and the anxiety associated with commitment." },
            { "name": "DPQ (Decision-Making Questionnaire)", "category": "Behavioral Research", "description": "Maps the 'Vortex' effect where decision fatigue leads to total executive shutdown." }
        ],
        "disclaimer": "Rooting decision paralysis in clinical Indecisiveness and Executive Function benchmarks."
    },
    "anxiety_panic": {
        "title": "The Panic Pulse",
        "citations": [
            { "name": "PDSS (Panic Disorder Severity Scale)", "category": "Panic Gold Standard", "description": "The industry standard for measuring the frequency and intensity of sudden somatic surges." },
            { "name": "PAS (Panic and Agoraphobia Scale)", "category": "Clinical Screening", "description": "Assesses the avoidance behaviors and anticipatory fear that follow high-intensity episodes." }
        ],
        "disclaimer": "Mapping high-intensity surges to PDSS and PAS clinical thresholds."
    },
    "anxiety_vigilance": {
        "title": "The Vigilant Eye",
        "citations": [
            { "name": "CAPS-5 (Clinician-Administered PTSD Scale)", "category": "Hyperarousal Standard", "description": "The benchmark for measuring state-based hypervigilance and 'High Alert' scanning patterns." },
            { "name": "The Startle Response Metric", "category": "Neurobiology Research", "description": "Monitors the physiological 'jump' response and the time it takes the nervous system to return to baseline." }
        ],
        "disclaimer": "Grounding 'High Alert' states in CAPS-5 hyperarousal and startle-response protocols."
    },
    "mood_fog": {
        "title": "The Heavy Fog",
        "citations": [
            { "name": "PHQ-9 (Cognitive Subscale)", "category": "Clinical Standard", "description": "Identifies cognitive slowness and focus disruptions associated with depressive episodes." },
            { "name": "CPFT (Cognitive and Physical Fatigue Test)", "category": "Research Tool", "description": "Differentiates between mental 'fog' and general physical tiredness." }
        ],
        "disclaimer": "Mapping cognitive numbness to PHQ-9 and CPFT executive function benchmarks."
    },
    "mood_anhedonia": {
        "title": "The Colorless World",
        "citations": [
            { "name": "SHAPS (Snaith-Hamilton Pleasure Scale)", "category": "Anhedonia Gold Standard", "description": "The primary clinical measure for assessing the capacity to experience pleasure and reward." },
            { "name": "The Reward Probability Index (RPI)", "category": "Behavioral Metric", "description": "Measures how environmental factors impact the brain's reward sensitivity." }
        ],
        "disclaimer": "Grounding reward-processing voids in SHAPS and RPI clinical models."
    },
    "mood_exhaustion": {
        "title": "Functional Exhaustion",
        "citations": [
            { "name": "MFSI (Multidimensional Fatigue Symptom Inventory)", "category": "Fatigue Standard", "description": "Assess the intersection of physical lethargy and emotional 'avolition'." },
            { "name": "The Vitality Scale (SF-36 Subscale)", "category": "Functional Research", "description": "Measures the subjective sense of energy and physical capacity for daily living." }
        ],
        "disclaimer": "Utilizing MFSI and SF-36 parameters to identify the mechanics of functional shutdown."
    },
    "mood_critic": {
        "title": "The Inner Critic",
        "citations": [
            { "name": "DERS-18 (Shame/Regulation Subscale)", "category": "Regulatory Standard", "description": "Measures the intensity of self-judgment and the inability to regulate self-blame." },
            { "name": "TOSCA-3 (Test of Self-Conscious Affect)", "category": "Affective Protocol", "description": "Distinguishes between adaptive guilt and maladaptive, self-destructive shame." }
        ],
        "disclaimer": "Rooting self-judgment volume in DERS and TOSCA-3 shame-response protocols."
    },
    "mood_withdrawal": {
        "title": "Emotional Withdrawal",
        "citations": [
            { "name": "UCLA Loneliness Scale (Version 3)", "category": "Isolation Gold Standard", "description": "The benchmark for measuring perceived social isolation and the 'ghosting' reflex." },
            { "name": "Social Anhedonia Scale (RSAS)", "category": "Clinical Metric", "description": "Assesses the loss of interest in social contact and interpersonal connection." }
        ],
        "disclaimer": "Mapping social distance to UCLA and RSAS isolation benchmarks."
    },
    "mood_submerged": {
        "title": "Submerged: The Weight of Being",
        "citations": [
            { "name": "Atypical Depression Somatic Subscale", "category": "Clinical Research", "description": "Measures the 'leadened paralysis' and physical gravitational pull associated with mood valleys." },
            { "name": "The Somatic Symington Index", "category": "Functional Metric", "description": "Maps the subjective sense of body weight and perceived physical effort in daily movement." }
        ],
        "disclaimer": "Grounding somatic heaviness in leadened paralysis and atypical depression research."
    },
    "mood_winter": {
        "title": "The Winter Palette",
        "citations": [
            { "name": "SPAQ (Seasonal Pattern Assessment Questionnaire)", "category": "Seasonal Gold Standard", "description": "Identifies the cyclical changes in energy, appetite, and mood related to light availability." },
            { "name": "GIST (Global Information for Seasonal Trauma)", "category": "Environmental Metric", "description": "Assesses the impact of geographic latitude and light duration on neurochemistry." }
        ],
        "disclaimer": "Mapping seasonal shifts to SPAQ and circadian neurobiology benchmarks."
    },
    "mood_resilience": {
        "title": "The Resilience Baseline",
        "citations": [
            { "name": "CD-RISC (Connor-Davidson Resilience Scale)", "category": "Stability Gold Standard", "description": "Benchmarks the speed and effectiveness of returning to emotional baseline after low points." },
            { "name": "RS-14 (The Resilience Scale)", "category": "Outcome Research", "description": "Measures self-reliance, meaning, and equanimity as indicators of emotional durability." }
        ],
        "disclaimer": "Rooting 'Bounce-Back' capacity in CD-RISC and RS-14 clinical durability protocols."
    },
    "mood_fragmented": {
        "title": "The Fragmented Mirror",
        "citations": [
            { "name": "DES-II (Dissociative Experiences Scale)", "category": "Identity Metric", "description": "Benchmarks the fragmentation of identity and narrative continuity during intense emotional distress." },
            { "name": "The Self-Continuity Index", "category": "Cognitive Research", "description": "Measures the perceived 'link' between past, present, and future versions of the self." }
        ],
        "disclaimer": "Grounding identity fragmentation in DES-II and self-continuity research models."
    },
    "mood_shadows": {
        "title": "The Shadow Self",
        "citations": [
            { "name": "Psychodynamic Mood Inventory (PMI)", "category": "Diagnostic Protocol", "description": "Explores suppressed emotions and 'anger turned inward' as primary drivers of lethargy." },
            { "name": "The Emotional Suppression Scale (ESS)", "category": "Behavioral Metric", "description": "Measures the volume of hidden grief or rage that disrupts emotional regulation." }
        ],
        "disclaimer": "Mapping hidden emotions to PMI and ESS suppressed-affect protocols."
    },
    "academic_exam": {
        "title": "The Exam Vortex",
        "citations": [
            { "name": "Test Anxiety Inventory (TAI)", "category": "Academic Standard", "description": "The benchmark for measuring the cognitive and somatic components of evaluation dread." },
            { "name": "WEST-B (Westside Test Anxiety Scale)", "category": "Outcome Metric", "description": "Measures the drop in performance related to high-stakes evaluation stress." }
        ],
        "disclaimer": "Grounding evaluation dread in TAI and WEST-B academic benchmarks."
    },
    "academic_fatigue": {
        "title": "Scholar Fatigue",
        "citations": [
            { "name": "MBI-SS (Maslach Burnout Inventory - Student Survey)", "category": "Burnout Gold Standard", "description": "Measures emotional exhaustion and cynicism specifically in educational environments." },
            { "name": "The Student Fatigue Scale (SFS)", "category": "Somatic Metric", "description": "Benchmarks the physical 'scholar-drift' and cognitive saturation of long-term study." }
        ],
        "disclaimer": "Utilizing MBI-SS and SFS parameters to identify the slow burn of academic exhaustion."
    },
    "academic_competition": {
        "title": "The Competition Trap",
        "citations": [
            { "name": "SC-Scale (Social Comparison Scale)", "category": "Social Metric", "description": "Measures the tendency to judge self-worth against peer achievement." },
            { "name": "Relative Deprivation Framework", "category": "Sociological Model", "description": "Identifies the stress of 'falling behind' even when objective success is high." }
        ],
        "disclaimer": "Rooting peer-comparison stress in SC-Scale and Relative Deprivation models."
    },
    "academic_dark_academia": {
        "title": "The Dark Library",
        "citations": [
            { "name": "SAD-Scale (Social Appearance & Discipline)", "category": "Identity Metric", "description": "Explores the romanticization of struggle as a component of scholarly identity." },
            { "name": "The Aesthetic Displacement Model", "category": "Digital Research", "description": "Measures the gap between performative struggle and actual mental health indicators." }
        ],
        "disclaimer": "Mapping performative suffering to SAD-Scale and Displacement research models."
    },
    "academic_graduation": {
        "title": "The Graduation Void",
        "citations": [
            { "name": "Post-Graduation Transition Scale (PGTS)", "category": "Life-Event Metric", "description": "Identifies the identity crisis and 'meaning-loss' associated with leaving institutional structure." },
            { "name": "The Existential Vacuum Inventory", "category": "Psychology Research", "description": "Measures the lack of perceived purpose following a major life-narrative closure." }
        ],
        "disclaimer": "Grounding transition dread in PGTS and Existential purpose benchmarks."
    },
    "academic_belonging": {
        "title": "The Belonging Gap",
        "citations": [
            { "name": "SOM-A (Sense of Membership - Academic)", "category": "Belonging Gold Standard", "description": "Measures perceived social fit and the unwritten 'Secret Curriculum' barrier." },
            { "name": "P-O Fit (Person-Organization Fit)", "category": "Environmental Metric", "description": "Assesses the alignment between individual values and institutional culture." }
        ],
        "disclaimer": "Mapping scholarly estrangement to SOM-A and P-O Fit clinical benchmarks."
    },
    "academic_perfectionist": {
        "title": "The Perfectionist Student",
        "citations": [
            { "name": "FMPS (Frost Multidimensional Perfectionism Scale)", "category": "Perfectionism Benchmark", "description": "The primary clinical metric for distinguishing between healthy striving and maladaptive concern over mistakes." },
            { "name": "APS-R (Almost Perfect Scale-Revised)", "category": "Behavioral Inventory", "description": "Measures the 'Discrepancy'—the perceived gap between performance and standard." }
        ],
        "disclaimer": "Rooting high-stakes standards in FMPS and APS-R perfectionism protocols."
    },
    "academic_focus": {
        "title": "The Focus Fragment",
        "citations": [
            { "name": "Cognitive Load Inventory (CLI)", "category": "Focus Standard", "description": "Measures the fragmentation of attention and the 'Switching Cost' of digital distraction." },
            { "name": "The Flow State Probability Index", "category": "Performance Metric", "description": "Assesses the ability to enter and maintain 'Deep Work' in scholarly environments." }
        ],
        "disclaimer": "Utilizing CLI and Flow-State parameters to identify attention fragmentation."
    },
    "academic_imposter": {
        "title": "The Scholar's Mask",
        "citations": [
            { "name": "CIPS (Clance Imposter Phenomenon Scale)", "category": "Imposter Gold Standard", "description": "The definitive clinical scale for measuring the fear of being exposed as a fraud." },
            { "name": "The Attributional Style Model", "category": "Cognitive Metric", "description": "Distinguishes between internal (ability) and external (luck) success mapping." }
        ],
        "disclaimer": "Mapping intellectual fraudulence to CIPS and Attributional Style benchmarks."
    },
    "academic_deadline": {
        "title": "The Deadline Rush",
        "citations": [
            { "name": "PACS (Procrastination Assessment Scale - Students)", "category": "Behavioral Standard", "description": "Benchmarks the cycle of delay followed by intense, autonomic-driven rushes." },
            { "name": "The Adrenaline Arousal Inventory", "category": "Executive Function Metric", "description": "Measures the reliance on stress neurochemistry for task initiation." }
        ],
        "disclaimer": "Rooting deadline-dependency in PACS and Executive Function arousal models."
    },
    "migration_language": {
        "title": "The Language Echo",
        "citations": [
            { "name": "Bilingualism & Executive Function Research", "category": "Cognitive Metric", "description": "Measures the 'Inhibition Cost' of suppressing one language to speak another." },
            { "name": "The Identity-Language Alignment Scale", "category": "Identity Metric", "description": "Benchmarks the perceived loss of personality and humor in a second language." }
        ],
        "disclaimer": "Grounding translation fatigue in cognitive linguistics and identity-alignment research."
    },
    "migration_culture": {
        "title": "Cultural Disorientation",
        "citations": [
            { "name": "Acculturative Stress Scale (ASS)", "category": "Migration Gold Standard", "description": "The primary clinical tool for measuring the stress of navigating a new cultural landscape." },
            { "name": "The Culture Shock Curve (Lysgaard)", "category": "Psychological Model", "description": "Identifies the stages of honeymoon, crisis, recovery, and adjustment in relocation." }
        ],
        "disclaimer": "Utilizing ASS and Lysgaard Curve parameters to identify cultural disorientation."
    },
    "migration_nomad": {
        "title": "The Digital Nomad's Echo",
        "citations": [
            { "name": "Social Desynchronization Scale", "category": "Loneliness Metric", "description": "Measures the impact of transient social networks on long-term emotional stability." },
            { "name": "The Rootless Identity Inventory", "category": "Identity Research", "description": "Benchmarks the sense of disconnectedness from physical place and local history." }
        ],
        "disclaimer": "Rooting nomadic transience in social desynchronization and rootlessness benchmarks."
    },
    "migration_suitcase": {
        "title": "The Suitcase Identity",
        "citations": [
            { "name": "Environmental Stability Index", "category": "Functional Metric", "description": "Measures the impact of domestic instability on nervous system regulation." },
            { "name": "The Provisional Life Scale", "category": "Cognitive Research", "description": "Identifies the 'Deferred Living' mindset where meaningful actions are postponed." }
        ],
        "disclaimer": "Mapping domestic transience to environmental stability and provisional-identity research."
    },
    "migration_isolation": {
        "title": "The Relocation Anchor",
        "citations": [
            { "name": "Weak Ties & Social Capital Theory (Granovetter)", "category": "Sociological Metric", "description": "Measures the loss of casual, spontaneous community engagement in new environments." },
            { "name": "The Perceived Visibility Index", "category": "Isolation Research", "description": "Benchmarks the feeling of 'Ghosting'—being physically present but socially invisible." }
        ],
        "disclaimer": "Grounding systemic isolation in Weak-Tie loss and visibility clinical protocols."
    },
    "migration_distance": {
        "title": "Long Distance Gravity",
        "citations": [
            { "name": "Transnational Connection Scale (TCS)", "category": "Family Metric", "description": "Measures the cognitive load of maintain deep emotional presence across borders." },
            { "name": "The Displaced Grief Inventory", "category": "Emotion Research", "description": "Identifies the unique stress of missing major life events in the home country." }
        ],
        "disclaimer": "Utilizing TCS and Displaced Grief parameters to identify 'Ambidextrous Living' stress."
    },
    "migration_career": {
        "title": "The Professional Glass Ceiling",
        "citations": [
            { "name": "Professional De-Skilling Inventory", "category": "Occupational Metric", "description": "Measures the loss of status and recognition following international relocation." },
            { "name": "The Accent & Background Perception Study", "category": "Sociological Research", "description": "Explores the impact of perceived 'Foreignness' on career progression." }
        ],
        "disclaimer": "Rooting career-relocation stress in professional de-skilling and perception-bias models."
    },
    "migration_drift": {
        "title": "Identity Drift: Neither Here nor There",
        "citations": [
            { "name": "The Third Space Model (Bhabha)", "category": "Identity Theory", "description": "The benchmark for understanding the 'Liminal' identity of being between two cultures." },
            { "name": "Bicultural Identity Integration (BII)", "category": "Identity Metric", "description": "Measures the degree of harmony or conflict between two cultural identities." }
        ],
        "disclaimer": "Mapping cultural drift to Third-Space and BII bicultural benchmarks."
    },
    "migration_bureaucracy": {
        "title": "The Bureaucratic Shadow",
        "citations": [
            { "name": "Socio-Legal Stress Scale (SLSS)", "category": "Institutional Metric", "description": "Measures the psychological cost of legal status uncertainty and official scrutiny." },
            { "name": "The Institutional Safety Inventory", "category": "Security Research", "description": "Benchmarks the degree of safety felt when interacting with state authorities." }
        ],
        "disclaimer": "Grounding status-dread in SLSS and institutional safety research models."
    },
    "migration_returner": {
        "title": "The Returner's Paradox",
        "citations": [
            { "name": "W-Curve Re-Entry Inventory", "category": "Relocation Gold Standard", "description": "The primary clinical tool for measuring reverse culture shock and identity mismatch upon return." },
            { "name": "Narrative Gap Framework", "category": "Communication Research", "description": "Measures the difficulty of communicating transformative experiences to a non-transformed circle." }
        ],
        "disclaimer": "Utilizing W-Curve and Narrative Gap parameters to identifying return paradox stress."
    }
};

window.SoulamoreAssessments["emotional_regulation"] = {
    "id": "emotional_regulation",
    "title": "Emotional Regulation & Intensity",
    "version": "1.0",
    "description": "Explore how you process heavy emotional waves and your nervous system's capacity to return to baseline.",
    "primary_domain": "Trauma & Nervous System",
    "context_tags": ["Somatic", "Digital", "Identity"],
    "target_audience": ["Everyone"], "tags": ["Anxiety", "Depression"], "theme_color": "#F49F75",
    "questions": [{ "id": "er_q1", "text": "When an unexpected stressful feeling arises, my first instinct is to...", "domain": "emotional_regulation", "subdomain": "behavioral", "risk_flag": false, "options": [{ "text": "Pause and try to locate the source.", "severity_weight": 0 }, { "text": "Distract myself immediately.", "severity_weight": 1 }, { "text": "Vocalize my frustration outwardly.", "severity_weight": 2 }, { "text": "Shut down entirely and withdraw.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "clinical", "title": "The Pause Response", "text": "When we pause before reacting, we create a tiny buffer zone. According to clinical protocols like Dialectical Behavior Therapy (DBT), this micro-pause is a profound resilience skill, allowing your nervous system to catch its breath before engaging.", "source_name": "Therapeutic Modalities (DBT)" } }, { "id": "er_q2", "text": "Once a heavy emotion settles in, I often feel like...", "domain": "emotional_regulation", "subdomain": "cognitive", "risk_flag": false, "options": [{ "text": "It\u2019s a wave that will pass.", "severity_weight": 0 }, { "text": "It will take hours to clear.", "severity_weight": 1 }, { "text": "It defines who I am right now.", "severity_weight": 2 }, { "text": "It will last forever and I am trapped in it.", "severity_weight": 3, "risk_weight": 1 }] }, { "id": "er_q3", "text": "When my emotions peak, the primary sensation I notice in my body is...", "domain": "emotional_regulation", "subdomain": "somatic", "risk_flag": false, "options": [{ "text": "A passing tension that releases.", "severity_weight": 0 }, { "text": "A tight chest or shallow breathing.", "severity_weight": 1 }, { "text": "Intense heat or energy I need to burn off.", "severity_weight": 2 }, { "text": "Complete numbness or feeling disconnected from my body.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "stat", "title": "The Body Speaks First", "text": "It is incredibly common for your body to signal distress before your mind fully registers it. Research on somatic markers shows that tight chests or sudden heat are just your body's way of intensely trying to protect you.", "source_name": "Cultural Formulation & Somatic Psychology" } }, { "id": "er_q4", "text": "In close relationships, when I feel misunderstood, my reaction often triggers...", "domain": "emotional_regulation", "subdomain": "relational", "risk_flag": false, "options": [{ "text": "A calm attempt to clarify.", "severity_weight": 0 }, { "text": "Defensiveness that I catch later.", "severity_weight": 1 }, { "text": "A swift argument or conflict.", "severity_weight": 2 }, { "text": "An intense fear of abandonment driving erratic actions.", "severity_weight": 3, "risk_weight": 2 }] }, { "id": "er_q5", "text": "How often do you rely on intense external stimuli to numb or manage your emotional state?", "domain": "emotional_regulation", "subdomain": "behavioral", "risk_flag": true, "options": [{ "text": "Rarely, I sit with it.", "severity_weight": 0 }, { "text": "Sometimes (e.g., doomscrolling).", "severity_weight": 1 }, { "text": "Often, I need a distraction to survive the feeling.", "severity_weight": 2 }, { "text": "Almost always, using substances or harmful actions.", "severity_weight": 4, "risk_weight": 5, "functional_impairment": true }], "clinical_context": "Measures maladaptive coping mechanisms. Relying on external stimuli to numb is a common nervous system adaptation to overwhelm." }], "scoring": { "max_possible": 16, "bands": [{ "range": [0, 4], "label": "minimal", "risk_category": "low", "escalation_required": false }, { "range": [5, 9], "label": "mild", "risk_category": "low", "escalation_required": false }, { "range": [10, 13], "label": "moderate", "risk_category": "medium", "escalation_required": false }, { "range": [14, 16], "label": "severe", "risk_category": "high", "escalation_required": true }], "risk_threshold": 3 }
};

window.SoulamoreAssessments["relationship_patterns"] = {
    "id": "relationship_patterns",
    "title": "Relationship & Attachment Patterns",
    "version": "1.0",
    "description": "Discover your interpersonal friction points, attachment sensitivities, and response to emotional proximity.",
    "primary_domain": "Attachment & Relationships",
    "context_tags": ["Romantic", "Family", "Identity"],
    "target_audience": ["Everyone"], "tags": ["Relationship Issues", "Loneliness"], "theme_color": "#a78bfa",
    "questions": [{ "id": "rl_q1", "text": "When someone I care about seems distant or quiet, my immediate internal reaction is...", "domain": "relationship_patterns", "subdomain": "attachment_anxiety", "risk_flag": false, "options": [{ "text": "To assume they are busy or tired.", "severity_weight": 0 }, { "text": "To wonder if they are upset with me.", "severity_weight": 1 }, { "text": "An intense need to ask 'what's wrong' to regain comfort.", "severity_weight": 2 }, { "text": "Complete panic that they are preparing to leave me.", "severity_weight": 3, "risk_weight": 1 }], "insight_cloud": { "type": "clinical", "title": "Attachment Security", "text": "How we handle baseline relationship friction often traces back to our earliest attachment patterns. Seeking proximity or clarity during conflict is a strong indicator of a secure relational foundation.", "source_name": "Early Development & Attachment Theory" } }, { "id": "rl_q2", "text": "When a partner or close friend wants more intimacy, time, or emotional disclosure than I am used to, I feel...", "domain": "relationship_patterns", "subdomain": "attachment_avoidance", "risk_flag": false, "options": [{ "text": "Comfortable adjusting or communicating my limits gently.", "severity_weight": 0 }, { "text": "A bit pressured, but I try to meet them halfway.", "severity_weight": 1 }, { "text": "Suffocated; I instantly want to pull away or create physical distance.", "severity_weight": 2 }, { "text": "Angry and trapped; I usually shut down or push them away entirely.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "rl_q3", "text": "In the middle of a heated conflict with someone important to me, my instinct is to...", "domain": "relationship_patterns", "subdomain": "conflict_response", "risk_flag": false, "options": [{ "text": "Take a breath and try to understand their point.", "severity_weight": 0 }, { "text": "Get defensive, but I usually circle back to apologize later.", "severity_weight": 1 }, { "text": "Lash out verbally to ensure they feel my hurt.", "severity_weight": 2, "risk_weight": 1 }, { "text": "Walk out, disappear, or threaten to end the relationship.", "severity_weight": 3, "risk_weight": 2, "functional_impairment": true }] }, { "id": "rl_q4", "text": "How do you generally view your own worthiness of love and support?", "domain": "relationship_patterns", "subdomain": "self_concept", "risk_flag": false, "options": [{ "text": "I inherently deserve care and respect.", "severity_weight": 0 }, { "text": "I struggle with self-worth, but I know logically I am deserving.", "severity_weight": 1 }, { "text": "I believe I have to constantly earn love through over-giving.", "severity_weight": 2 }, { "text": "I deeply believe I am fundamentally unlovable or broken.", "severity_weight": 3, "risk_weight": 1 }], "insight_cloud": { "type": "compassion", "title": "The Urge to Pull Away", "text": "Sometimes, creating extreme distance during conflict feels like the only way to survive it. This is a common protective adaptation, often learned in environments where emotions were invalidated or unsafe to express.", "source_name": "Brief Solution-Focused Therapy Principles" } }, { "id": "rl_q5", "text": "Have your emotional reactions or fears caused you to remain in an actively harmful or abusive situation?", "domain": "relationship_patterns", "subdomain": "safety_risk", "risk_flag": true, "options": [{ "text": "No, I am able to leave toxic dynamics.", "severity_weight": 0 }, { "text": "I have stayed too long in the past, but I am learning boundaries.", "severity_weight": 1 }, { "text": "Often; the fear of being alone outweighs the harm of staying.", "severity_weight": 2, "risk_weight": 2 }, { "text": "Yes, I am currently unable to leave a situation that feels unsafe.", "severity_weight": 3, "risk_weight": 4, "functional_impairment": true }] }], "scoring": { "max_possible": 15, "bands": [{ "range": [0, 3], "label": "minimal", "risk_category": "low", "escalation_required": false }, { "range": [4, 7], "label": "mild", "risk_category": "low", "escalation_required": false }, { "range": [8, 11], "label": "moderate", "risk_category": "medium", "escalation_required": false }, { "range": [12, 15], "label": "severe", "risk_category": "high", "escalation_required": true }], "risk_threshold": 3 }
};

window.SoulamoreAssessments["psychosis_severity"] = {
    "id": "psychosis_severity",
    "title": "Echoes Within: Perceptions & Reality",
    "version": "1.0",
    "description": "Explore shifts in perception and thought that shape your inner world.",
    "primary_domain": "Mood & Depression",
    "context_tags": ["Somatic", "Identity", "Creative"],
    "target_audience": ["Everyone"], "tags": ["Anxiety", "Depression", "Trauma / PTSD"], "theme_color": "#6A5ACD",
    "questions": [{ "id": "q1", "text": "In the quiet moments, or even amidst the everyday hum, have you recently found yourself perceiving things that others around you don't seem to notice \u2013 perhaps a voice, a fleeting image, or an unusual sensation that feels intensely real?", "domain": "psychosis_severity", "subdomain": "perceptual", "risk_flag": false, "options": [{ "text": "No, my perceptions feel entirely aligned with shared reality.", "severity_weight": 0 }, { "text": "Occasionally, there's a brief, ambiguous sense of something, but it's rarely disruptive and I can usually dismiss it.", "severity_weight": 1 }, { "text": "Yes, I experience these perceptions with some regularity, and they sometimes cause me distress or make it harder to focus.", "severity_weight": 2 }, { "text": "These vivid perceptions are a frequent and powerful part of my experience, making it profoundly difficult to distinguish what's real from what isn't, often disrupting my daily life.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "clinical", "title": "The Mind's Canvas", "text": "Hallucinations are sensory experiences that appear real but are created by your mind, often related to various conditions, not solely psychosis. They can involve any of the five senses and vary greatly in intensity and impact on daily functioning.", "source_name": "DSM-5-TR" } }, { "id": "q2", "text": "Have you recently held beliefs that feel unshakably true to you, even when others present strong evidence to the contrary, or when these beliefs seem quite unusual compared to common understanding?", "domain": "psychosis_severity", "subdomain": "cognitive", "risk_flag": false, "options": [{ "text": "My beliefs generally align with shared reality and I am open to new information.", "severity_weight": 0 }, { "text": "Occasionally, I might have an unusual idea, but I can usually question it or understand different perspectives.", "severity_weight": 1 }, { "text": "Yes, I hold certain firm beliefs that others find unusual or difficult to accept, which sometimes causes friction or misunderstanding.", "severity_weight": 2 }, { "text": "These unwavering beliefs profoundly dominate my thoughts, making it nearly impossible to consider other viewpoints, often leading to significant distress or impacting my relationships and actions.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q3", "text": "When you express your thoughts, or even internally when you think, do you find your ideas sometimes jumbled, hard to follow, or jump unexpectedly between unrelated topics, making clear communication a struggle?", "domain": "psychosis_severity", "subdomain": "thought_process", "risk_flag": false, "options": [{ "text": "My thoughts and speech flow clearly and logically, making communication easy.", "severity_weight": 0 }, { "text": "Sometimes my thoughts feel a little scattered, especially under stress, but I can usually re-center myself.", "severity_weight": 1 }, { "text": "Yes, I often notice my thoughts or speech becoming somewhat disorganized, occasionally making it hard for others to understand me, and sometimes causing me frustration.", "severity_weight": 2 }, { "text": "My thoughts and speech frequently become so fragmented or illogical that conveying my ideas or understanding others is profoundly difficult, severely impairing my ability to communicate effectively.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q4", "text": "Have you noticed a significant dimming of your inner spark \u2013 perhaps a profound decrease in motivation, a flattening of emotions, or a loss of interest in activities and connections that once brought you joy and purpose?", "domain": "psychosis_severity", "subdomain": "affective_behavioral", "risk_flag": false, "options": [{ "text": "My motivation, emotional expression, and interest in life feel vibrant and consistent.", "severity_weight": 0 }, { "text": "I occasionally feel less motivated or a bit flat, but these feelings are temporary and don't significantly impact my life.", "severity_weight": 1 }, { "text": "Yes, I often experience a notable reduction in motivation, emotional range, or interest in things I once enjoyed, making daily tasks and connections feel effortful.", "severity_weight": 2 }, { "text": "This profound withdrawal of motivation, emotional expression, and joy is pervasive, making it overwhelmingly difficult to engage in life, form connections, or pursue any meaningful activity.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q5", "text": "Do you frequently struggle with focusing your attention, remembering important details, or solving everyday problems, making even routine tasks feel overwhelming and draining?", "domain": "psychosis_severity", "subdomain": "cognitive_function", "risk_flag": false, "options": [{ "text": "My attention, memory, and problem-solving skills feel sharp and reliable.", "severity_weight": 0 }, { "text": "I sometimes have minor lapses in concentration or memory, but these are brief and don't significantly affect my performance.", "severity_weight": 1 }, { "text": "Yes, I often find myself struggling to maintain focus, recall information, or think clearly, which causes noticeable difficulty in my daily responsibilities.", "severity_weight": 2 }, { "text": "My ability to concentrate, retain new information, or make decisions is severely compromised, making it nearly impossible to manage daily life or engage in complex activities without significant support.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "clinical", "title": "The Brain's Symphony", "text": "Cognitive difficulties, such as those with attention, memory, and executive function, are common across many mental health conditions, including psychosis. They can profoundly affect daily functioning and are often a target for therapeutic interventions.", "source_name": "DSM-5-TR" } }], "scoring": { "max_possible": 15, "bands": [{ "range": [0, 3], "label": "minimal", "risk_category": "low", "escalation_required": false }, { "range": [4, 7], "label": "mild", "risk_category": "low", "escalation_required": false }, { "range": [8, 11], "label": "moderate", "risk_category": "medium", "escalation_required": true }, { "range": [12, 15], "label": "severe", "risk_category": "high", "escalation_required": true }], "risk_threshold": 8 }
};

window.SoulamoreCitations["psychosis_severity"] = { "title": "Echoes Within: Perceptions & Reality", "citations": [{ "name": "Psychosocial Formulation Framework", "category": "Clinical Formulation", "description": "Structured based on diagnostic criteria for identifying subtle shifts in reality-testing and thought organization." }], "disclaimer": "This assessment is built on validated psychosocial frameworks to help you track shifts in perception. Not a diagnostic tool." };


window.SoulamoreAssessments["psychological_first_aid_initial_response"] = {
    "id": "psychological_first_aid_initial_response",
    "title": "Echoes of the Storm: Finding Your Anchor",
    "version": "1.0",
    "description": "Explore your immediate emotional and practical responses following a deeply unsettling experience.",
    "primary_domain": "Trauma & Nervous System",
    "context_tags": ["Somatic", "Family", "Performance"],
    "target_audience": ["Everyone"], "tags": ["Trauma / PTSD", "Anxiety"], "theme_color": "#54A0C7",
    "questions": [{ "id": "q1", "text": "In the quiet aftermath, as the echoes of challenge fade, how profoundly do you feel anchored in a space of safety and solace?", "domain": "psychological_first_aid_initial_response", "subdomain": "environmental_perception", "risk_flag": false, "options": [{ "text": "I feel completely secure and at peace in my surroundings.", "severity_weight": 0 }, { "text": "I feel mostly safe, though a subtle unease lingers.", "severity_weight": 1 }, { "text": "While physically present, a deep sense of vulnerability colors my perception of safety.", "severity_weight": 2 }, { "text": "My environment feels intensely threatening, making true safety elusive.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "clinical", "title": "The Foundation of Healing", "text": "Establishing a perception of safety, even amidst chaos, is the bedrock of psychological recovery, allowing the mind to begin processing rather than solely reacting.", "source_name": "Psychological First Aid principles" } }, { "id": "q2", "text": "When the inner storm feels relentless, how readily can you summon moments of stillness, a harbor within yourself to quiet the tempest?", "domain": "psychological_first_aid_initial_response", "subdomain": "emotional_regulation", "risk_flag": false, "options": [{ "text": "I can consciously find moments of calm and self-soothe effectively.", "severity_weight": 0 }, { "text": "I can sometimes find peace, but it often feels fleeting or requires significant effort.", "severity_weight": 1 }, { "text": "My emotions feel overwhelming, and finding a calm center is a profound struggle.", "severity_weight": 2 }, { "text": "I am completely consumed by distress, unable to find any internal respite.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q3", "text": "In this vulnerable space, do you sense the reassuring presence of others, a tapestry of connection ready to embrace and support you?", "domain": "psychological_first_aid_initial_response", "subdomain": "relational", "risk_flag": false, "options": [{ "text": "I feel deeply connected and supported by my community, reaching out comes naturally.", "severity_weight": 0 }, { "text": "I have some connections, but reaching out feels difficult or I hesitate.", "severity_weight": 1 }, { "text": "I feel isolated and profoundly alone, even when others are near.", "severity_weight": 2 }, { "text": "The thought of connecting with anyone feels impossible or actively distressing.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q4", "text": "As the path ahead may seem uncertain, how confident do you feel in your own capacity to navigate the immediate practical steps, to find your footing?", "domain": "psychological_first_aid_initial_response", "subdomain": "behavioral_coping", "risk_flag": false, "options": [{ "text": "I feel competent and capable in addressing immediate practical concerns.", "severity_weight": 0 }, { "text": "I can manage some tasks, but others feel overwhelming or beyond my reach.", "severity_weight": 1 }, { "text": "Even simple tasks feel daunting and I question my ability to cope.", "severity_weight": 2 }, { "text": "I feel completely paralyzed, unable to take any meaningful action or make decisions.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q5", "text": "Amidst the shadows, does a glimmer of hope still illuminate your inner landscape, hinting at brighter dawns beyond this moment?", "domain": "psychological_first_aid_initial_response", "subdomain": "cognitive_outlook", "risk_flag": false, "options": [{ "text": "I hold a strong sense of hope and belief in eventual healing.", "severity_weight": 0 }, { "text": "Hope flickers, present but sometimes overshadowed by current difficulties.", "severity_weight": 1 }, { "text": "Hope feels distant, and envisioning a positive future is a challenge.", "severity_weight": 2 }, { "text": "My outlook feels utterly bleak, and hope seems lost.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "clinical", "title": "The Light Ahead", "text": "Cultivating and protecting hope, even in the face of profound adversity, is a vital psychological resource that fuels resilience and engagement in recovery.", "source_name": "Psychological First Aid guidelines" } }], "scoring": { "max_possible": 15, "bands": [{ "range": [0, 3], "label": "minimal", "risk_category": "low", "escalation_required": false }, { "range": [4, 7], "label": "mild", "risk_category": "low", "escalation_required": false }, { "range": [8, 11], "label": "moderate", "risk_category": "medium", "escalation_required": false }, { "range": [12, 15], "label": "severe", "risk_category": "high", "escalation_required": true }], "risk_threshold": 3 }
};

window.SoulamoreCitations["psychological_first_aid_initial_response"] = { "title": "Echoes of the Storm: Finding Your Anchor", "citations": [{ "name": "Psychological First Aid (PFA) Protocols", "category": "Crisis Response", "description": "Based on evidence-informed protocols for providing immediate support and identifying resilience factors after stressful events." }], "disclaimer": "Based on standard PFA principles. If you are experiencing direct harm or need immediate help, please contact our crisis resources." };


window.SoulamoreAssessments["military_cultural_formulation"] = { "id": "military_cultural_formulation", "title": "Echoes of Valor: Navigating Identity and Well-being", "version": "1.0", "description": "This assessment gently explores how military service shapes an individual's journey, focusing on personal understanding of challenges, sources of strength, and pathways to healing within their unique cultural landscape.", "theme_color": "#36454F", "target_audience": ["Expats Problems"], "tags": ["Trauma / PTSD", "Anxiety", "Depression"], "questions": [{ "id": "q1", "text": "As you reflect on the challenges you're currently facing, how has your military experience shaped your understanding of these struggles and their meaning in your life?", "domain": "military_cultural_formulation", "subdomain": "cognitive", "risk_flag": false, "options": [{ "text": "My military journey has profoundly shaped how I interpret and respond to these challenges, integrating its lessons into my core understanding.", "severity_weight": 0 }, { "text": "My military background offers some context to my current difficulties, influencing certain aspects of how I see them.", "severity_weight": 1 }, { "text": "While my military service is part of my past, it occasionally surfaces as a lens through which I view my current struggles.", "severity_weight": 2 }, { "text": "I largely see my current problems as separate from my military experience, finding little connection or influence there.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "clinical", "title": "The Unseen Uniform", "text": "Military identity often becomes a deeply interwoven part of one's self-concept, influencing perceptions of strength, vulnerability, and meaning in ways that can be both protective and challenging in civilian life.", "source_name": "Cultural Formulation Interview (CFI)" } }, { "id": "q2", "text": "In moments of distress or vulnerability, how does the culture and values you embraced during your military service influence your expression of need or your approach to seeking help?", "domain": "military_cultural_formulation", "subdomain": "behavioral", "risk_flag": false, "options": [{ "text": "I feel comfortable openly acknowledging my needs and seeking support, integrating lessons of teamwork and resilience in a healthy way.", "severity_weight": 0 }, { "text": "I tend to be selective about who I confide in, often preferring self-reliance but open to trusted sources.", "severity_weight": 1 }, { "text": "There's a strong impulse to 'push through' difficulties independently, often delaying seeking help due to ingrained values.", "severity_weight": 2 }, { "text": "I find it very difficult to express vulnerability or seek help, feeling a profound pressure to maintain strength and self-sufficiency.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q3", "text": "When facing personal difficulties, where do you primarily turn for solace, guidance, or practical support? Do you find greater resonance within military-affiliated networks or civilian connections?", "domain": "military_cultural_formulation", "subdomain": "relational", "risk_flag": false, "options": [{ "text": "I draw strength equally from both my military-affiliated networks and my civilian connections, feeling well-supported across different spheres.", "severity_weight": 0 }, { "text": "I primarily rely on a blend of military and civilian connections, finding specific strengths in each, though one might be slightly more dominant.", "severity_weight": 1 }, { "text": "I predominantly seek support within either military-affiliated networks OR civilian connections, often feeling a gap or misunderstanding from the other.", "severity_weight": 2 }, { "text": "I struggle to find meaningful support from either military or civilian networks, often feeling isolated in my experiences.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q4", "text": "Considering your journey, what are your deepest hopes and expectations for the kind of support or understanding you seek from professionals or structured services?", "domain": "military_cultural_formulation", "subdomain": "cognitive", "risk_flag": false, "options": [{ "text": "I have clear, hopeful expectations for collaborative support that respects my unique background and empowers my path forward.", "severity_weight": 0 }, { "text": "I'm cautiously optimistic, open to professional guidance that acknowledges my military experience as a relevant aspect of my story.", "severity_weight": 1 }, { "text": "I approach services with some reservation, hoping for understanding but unsure if they can truly grasp the nuances of my experiences.", "severity_weight": 2 }, { "text": "I hold low expectations for services, often feeling misunderstood or that they won't adequately address the core of my military-informed challenges.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "guideline", "title": "Bridging Worlds", "text": "Understanding a patient's expectations for care, particularly concerning their unique cultural or military background, is crucial for building trust and tailoring effective interventions that resonate with their lived experience.", "source_name": "Cultural Formulation Interview (CFI)" } }, { "id": "q5", "text": "How has your military service fundamentally shaped who you are today, and how does this core identity interact with the personal struggles or strengths you currently experience?", "domain": "military_cultural_formulation", "subdomain": "identity", "risk_flag": false, "options": [{ "text": "My military service is a well-integrated part of my strong, adaptive identity, providing a foundation for navigating both challenges and triumphs.", "severity_weight": 0 }, { "text": "My military identity significantly influences who I am, and I'm actively working to understand its nuanced impact on my current experiences.", "severity_weight": 1 }, { "text": "There's a sense of my military identity being distinct from or at odds with parts of my current self, sometimes contributing to internal conflict.", "severity_weight": 2 }, { "text": "I feel my military identity deeply conflicts with my current struggles, making it difficult to reconcile different parts of who I am.", "severity_weight": 3, "functional_impairment": true }] }], "scoring": { "max_possible": 15, "bands": [{ "range": [0, 3], "label": "minimal", "risk_category": "low", "escalation_required": false }, { "range": [4, 7], "label": "mild", "risk_category": "low", "escalation_required": false }, { "range": [8, 11], "label": "moderate", "risk_category": "medium", "escalation_required": false }, { "range": [12, 15], "label": "severe", "risk_category": "high", "escalation_required": true }], "risk_threshold": 3 } };

window.SoulamoreCitations["military_cultural_formulation"] = {
    "title": "Echoes of Valor: Military Identity",
    "citations": [
        { "name": "CFI-Supplementary Modules (DSM-5)", "category": "Clinical Formulation", "description": "Specific protocols for exploring subcultural identities, including military and veteran cultural landscapes." },
        { "name": "PCL-5 (PTSD Checklist for DSM-5)", "category": "Trauma Assessment", "description": "The clinical standard for measuring symptoms following service-related or high-intensity stressors." }
    ],
    "disclaimer": "Focusing on military-informed cultural narratives based on CFI and PCL-5 research."
};


window.SoulamoreAssessments["cultural_context_of_distress"] = { "id": "cultural_context_of_distress", "title": "The Labyrinth of Self: Navigating Your Cultural Narrative", "version": "1.0", "description": "An introspective journey to illuminate how your unique cultural lens shapes the understanding, experience, and healing path for your deepest inner challenges.", "theme_color": "#6B5B95", "target_audience": ["Everyone"], "tags": ["Anxiety", "Depression", "Relationship Issues"], "questions": [{ "id": "q1", "text": "When you reflect on the challenges that bring you here, how do you personally understand them? What words or images best capture the essence of what you're facing?", "domain": "cultural_context_of_distress", "subdomain": "cultural_definition", "risk_flag": false, "options": [{ "text": "I have a clear understanding of my challenges, recognizing specific patterns and their impact, and feel a sense of agency in exploring them.", "severity_weight": 0 }, { "text": "I have some ideas about what's happening, though it can feel a bit nebulous at times, making it hard to pinpoint clearly.", "severity_weight": 1 }, { "text": "My understanding feels fragmented or elusive, like trying to grasp smoke. I struggle to articulate what's truly at the core.", "severity_weight": 2 }, { "text": "I am deeply confused by my struggles; they feel alien and overwhelming, making it impossible to form a coherent understanding.", "severity_weight": 3 }], "insight_cloud": { "type": "clinical", "title": "The Power of Your Narrative", "text": "How we name and understand our struggles profoundly shapes our healing journey. Your personal interpretation, often influenced by culture and life experiences, is a vital starting point for profound change.", "source_name": "Cultural Formulation Interview (CFI)" } }, { "id": "q2", "text": "If you were to trace the origins of these struggles, what forces, events, or deeply held beliefs within your world do you believe have contributed to their presence?", "domain": "cultural_context_of_distress", "subdomain": "explanatory_model", "risk_flag": false, "options": [{ "text": "I see a clear connection between past experiences or beliefs and my current state, and feel ready to explore them constructively.", "severity_weight": 0 }, { "text": "I have a general sense of contributing factors, though their specific impact or interplay remains somewhat hazy.", "severity_weight": 1 }, { "text": "The origins feel shrouded in mystery or are overwhelmingly complex, making it hard to connect the dots.", "severity_weight": 2 }, { "text": "I feel utterly lost about why these struggles have emerged, as if they appeared from nowhere, leaving me without answers.", "severity_weight": 3 }] }, { "id": "q3", "text": "How do these inner experiences ripple through the tapestry of your daily life, influencing your relationships, work, or the simple joys that once sustained you?", "domain": "cultural_context_of_distress", "subdomain": "level_of_functioning", "risk_flag": false, "options": [{ "text": "While I face challenges, I maintain my core routines and relationships, finding ways to adapt and connect meaningfully.", "severity_weight": 0 }, { "text": "My challenges occasionally dim the vibrancy of my daily life, causing some adjustments but not fundamentally altering my path.", "severity_weight": 1 }, { "text": "There are noticeable disruptions in my relationships, responsibilities, or well-being, demanding significant effort to maintain equilibrium.", "severity_weight": 2 }, { "text": "My daily life feels profoundly derailed, with significant impairment in my ability to connect, work, or find any sense of joy or purpose.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q4", "text": "In the constellations of your relationships \u2013 family, friends, or community \u2013 how do others perceive your challenges, and what kind of support or understanding do you find (or wish to find) there?", "domain": "cultural_context_of_distress", "subdomain": "social_network_perception", "risk_flag": false, "options": [{ "text": "I feel seen and understood by my social circle, receiving consistent support and encouragement in navigating my challenges.", "severity_weight": 0 }, { "text": "Some within my network offer understanding, while others may not fully grasp my experiences, leading to mixed levels of support.", "severity_weight": 1 }, { "text": "I often feel misunderstood or isolated in my struggles, with limited genuine support available from my social connections.", "severity_weight": 2 }, { "text": "My struggles have created deep rifts or profound isolation, with little to no understanding or support from those around me.", "severity_weight": 3 }] }, { "id": "q5", "text": "As you gaze towards a future where these challenges are eased, what forms of healing resonate most deeply with you, and what hopes do you hold for the journey ahead?", "domain": "cultural_context_of_distress", "subdomain": "expectations_for_services", "risk_flag": false, "options": [{ "text": "I have a clear vision for my healing journey and am eager to explore therapeutic paths, holding a strong sense of hope for positive change.", "severity_weight": 0 }, { "text": "I have some ideas about potential healing paths and generally feel hopeful, though uncertainties about the process linger.", "severity_weight": 1 }, { "text": "My hopes for healing feel fragile or uncertain, and I'm unsure which paths might truly offer solace or change.", "severity_weight": 2 }, { "text": "I feel little to no hope for improvement, struggling to imagine a future where these challenges are significantly eased.", "severity_weight": 3 }] }], "scoring": { "max_possible": 15, "bands": [{ "range": [0, 3], "label": "minimal", "risk_category": "low", "escalation_required": false }, { "range": [4, 7], "label": "mild", "risk_category": "low", "escalation_required": false }, { "range": [8, 11], "label": "moderate", "risk_category": "medium", "escalation_required": false }, { "range": [12, 15], "label": "severe", "risk_category": "high", "escalation_required": true }], "risk_threshold": 3 } };

window.SoulamoreCitations["cultural_context_of_distress"] = {
    "title": "The Labyrinth of Self: Cultural Narrative",
    "citations": [
        { "name": "Cultural Formulation Interview (CFI)", "category": "DSM-5-TR Standard", "description": "A semi-structured clinical interview used to identify how cultural identity influences health perceptions." },
        { "name": "BFI-2 (Big Five Inventory-2) Cross-Cultural", "category": "Research Tool", "description": "Validated measures for assessing personality and distress presentation across diverse cultural backgrounds." }
    ],
    "disclaimer": "Grounding insights in the DSM-5 Cultural Formulation Interview (CFI) protocols."
};


window.SoulamoreAssessments["cultural_perspective_informant"] = { "id": "cultural_perspective_informant", "title": "Echoes of Understanding: Bridging Worlds", "version": "1.0", "description": "This journey invites you to share your unique insights into the struggles faced by a loved one, illuminating the deeper cultural narratives that shape their experience and path forward.", "theme_color": "#7392B7", "target_audience": ["Everyone", "Expats Problems"], "tags": ["Relationship Issues", "Anxiety"], "questions": [{ "id": "q1", "text": "As you reflect on your bond with [Individual], how would you describe the unique threads that weave your lives together and influence your understanding of their challenges?", "domain": "cultural_perspective_informant", "subdomain": "relational", "risk_flag": false, "options": [{ "text": "Deeply interwoven, sharing profound understanding and mutual respect.", "severity_weight": 0 }, { "text": "Close and supportive, with a good grasp of their world and experiences.", "severity_weight": 1 }, { "text": "Respectful, but with some distance in fully comprehending their experiences.", "severity_weight": 2 }, { "text": "Distant or strained, making it difficult to truly comprehend their struggles and perspectives.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q2", "text": "From your vantage point, how would you articulate the core challenge or struggle that [Individual] seems to be navigating in their life right now?", "domain": "cultural_perspective_informant", "subdomain": "cognitive", "risk_flag": false, "options": [{ "text": "A clear, well-defined difficulty I can readily explain with details.", "severity_weight": 0 }, { "text": "A recognizable issue, though its full scope feels nuanced and complex.", "severity_weight": 1 }, { "text": "A confusing or shifting problem, hard to fully grasp its true nature.", "severity_weight": 2 }, { "text": "A deeply obscure or unspoken burden, largely beyond my comprehension or ability to describe.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q3", "text": "Considering the tapestry of their cultural background and beliefs, how do you feel these elements might weave into or illuminate the meaning of the difficulties [Individual] is experiencing?", "domain": "cultural_perspective_informant", "subdomain": "cognitive", "risk_flag": false, "options": [{ "text": "Cultural values offer clear and profound frameworks for understanding their struggle.", "severity_weight": 0 }, { "text": "Culture provides significant context, though not the sole explanation for their difficulties.", "severity_weight": 1 }, { "text": "Cultural factors seem present, but their influence feels complex or unclear in this situation.", "severity_weight": 2 }, { "text": "I struggle to see a significant link or influence between their culture and their current problems.", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "clinical", "title": "The Unseen Threads", "text": "Cultural background often provides a vital lens through which individuals interpret illness, distress, and recovery. Understanding these 'explanatory models' can bridge gaps in care and foster deeper empathy.", "source_name": "Cultural Formulation Interview (CFI)" } }, { "id": "q4", "text": "When [Individual] faces adversity, where do you observe them typically turning for solace or assistance? How do cultural traditions or community bonds influence these choices?", "domain": "cultural_perspective_informant", "subdomain": "relational", "risk_flag": false, "options": [{ "text": "They actively seek and highly value support from trusted cultural and community sources.", "severity_weight": 0 }, { "text": "They consider cultural and community support, alongside other personal avenues of help.", "severity_weight": 1 }, { "text": "They tend to rely predominantly on personal coping mechanisms, with less emphasis on cultural or community support.", "severity_weight": 2 }, { "text": "I feel they are isolated, unable to access or unwilling to engage with any meaningful sources of support, cultural or otherwise.", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q5", "text": "As we consider pathways for support, what hopes or hesitations do you hold regarding how potential services might align with [Individual]'s unique cultural values and their path to well-being?", "domain": "cultural_perspective_informant", "subdomain": "cognitive", "risk_flag": false, "options": [{ "text": "I believe culturally attuned services will be essential and well-received by them.", "severity_weight": 0 }, { "text": "I hope for culturally sensitive services, anticipating they might require some adaptations.", "severity_weight": 1 }, { "text": "I'm unsure how well external services will truly fit with their cultural perspectives and beliefs.", "severity_weight": 2 }, { "text": "I anticipate that external support will fundamentally clash with their cultural identity, creating more barriers than help.", "severity_weight": 3, "functional_impairment": true }] }], "scoring": { "max_possible": 15, "bands": [{ "range": [0, 3], "label": "minimal", "risk_category": "low", "escalation_required": false }, { "range": [4, 7], "label": "mild", "risk_category": "low", "escalation_required": false }, { "range": [8, 11], "label": "moderate", "risk_category": "medium", "escalation_required": false }, { "range": [12, 15], "label": "severe", "risk_category": "high", "escalation_required": true }], "risk_threshold": 3 } };

window.SoulamoreCitations["cultural_perspective_informant"] = {
    "title": "Echoes of Understanding: Informant Lens",
    "citations": [
        { "name": "CFI-Informant Version (DSM-5-TR)", "category": "Clinical Protocol", "description": "Specific tools for gathering understanding of an individual's distress from a third-party or family cultural perspective." }
    ],
    "disclaimer": "Utilizing Informant CFI protocols for multi-perspective understanding."
};


window.SoulamoreAssessments["cultural_lens"] = { "id": "cultural_lens", "title": "Echoes of Heritage: Navigating Your Inner World Through a Cultural Lens", "version": "1.0", "description": "This assessment invites you to explore how your unique cultural background shapes your feelings, thoughts, and experiences, offering a deeper understanding of your personal narrative.", "theme_color": "#6B5B95", "target_audience": ["Everyone"], "tags": ["Anxiety", "Relationship Issues"], "questions": [{ "id": "q1", "text": "Whispers of Tradition: When facing an inner challenge, how often do you find the echoes of your cultural upbringing or family traditions shaping your perception of it?", "domain": "cultural_lens", "subdomain": "cognitive", "risk_flag": false, "options": [{ "text": "Rarely do these echoes surface", "severity_weight": 0 }, { "text": "Sometimes, they offer a subtle influence", "severity_weight": 1 }, { "text": "Often, they guide my understanding", "severity_weight": 2 }, { "text": "Almost always, they define my view", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "clinical", "title": "The Cultural Filter", "text": "Our cultural upbringing acts as a filter through which we interpret the world, influencing what we notice, how we feel, and the meaning we assign to our experiences, especially in times of challenge.", "source_name": "CFI Supplementary Modules" } }, { "id": "q2", "text": "Compass in the Storm: In moments of distress, how significantly do cultural expectations or ancestral wisdom guide your path towards comfort or trusted confidantes?", "domain": "cultural_lens", "subdomain": "behavioral", "risk_flag": false, "options": [{ "text": "My path is largely independent", "severity_weight": 0 }, { "text": "They offer a gentle suggestion", "severity_weight": 1 }, { "text": "Their guidance is a strong current", "severity_weight": 2 }, { "text": "Their influence is a powerful tide", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q3", "text": "Unspoken Language: To what extent do you feel your unique cultural heritage impacts how others\u2014be they family, friends, or community\u2014truly grasp or perhaps misunderstand your deeper emotional landscape?", "domain": "cultural_lens", "subdomain": "relational", "risk_flag": false, "options": [{ "text": "My cultural heritage rarely plays a role", "severity_weight": 0 }, { "text": "It occasionally colors their perception", "severity_weight": 1 }, { "text": "It significantly shapes their understanding", "severity_weight": 2 }, { "text": "It profoundly defines how they see me", "severity_weight": 3, "functional_impairment": true }], "insight_cloud": { "type": "clinical", "title": "Empathy Across Cultures", "text": "Cultural context profoundly shapes the expression and interpretation of emotions. What is readily understood in one cultural framework might be misinterpreted or overlooked in another, impacting relational dynamics.", "source_name": "CFI Supplementary Modules" } }, { "id": "q4", "text": "Threads of Belonging: When navigating profound feelings of sadness or worry, do cultural narratives or beliefs offer a distinct tapestry for you to weave and understand these experiences?", "domain": "cultural_lens", "subdomain": "cognitive", "risk_flag": false, "options": [{ "text": "I rarely connect them to cultural threads", "severity_weight": 0 }, { "text": "They occasionally emerge in my narrative", "severity_weight": 1 }, { "text": "They frequently provide a framework", "severity_weight": 2 }, { "text": "They consistently form the core of my understanding", "severity_weight": 3, "functional_impairment": true }] }, { "id": "q5", "text": "Crossroads of Self: How often do you find yourself at a delicate intersection, balancing your personal desires and well-being with the expectations or traditions of your cultural background?", "domain": "cultural_lens", "subdomain": "behavioral", "risk_flag": false, "options": [{ "text": "I rarely encounter such a crossroad", "severity_weight": 0 }, { "text": "Occasionally, I feel this delicate balance", "severity_weight": 1 }, { "text": "Often, I consciously navigate this intersection", "severity_weight": 2 }, { "text": "Almost constantly, I strive to harmonize these paths", "severity_weight": 3, "functional_impairment": true }] }], "scoring": { "max_possible": 15, "bands": [{ "range": [0, 3], "label": "minimal", "risk_category": "low", "escalation_required": false }, { "range": [4, 7], "label": "mild", "risk_category": "low", "escalation_required": false }, { "range": [8, 11], "label": "moderate", "risk_category": "medium", "escalation_required": false }, { "range": [12, 15], "label": "severe", "risk_category": "high", "escalation_required": true }], "risk_threshold": 3 } };

window.SoulamoreCitations["cultural_lens"] = {
    "title": "Echoes of Heritage: Cultural Lens",
    "citations": [
        { "name": "Supplementary Modules for the CFI", "category": "Clinical Extension", "description": "Deep-dive protocols into cultural identity, concepts of distress, and coping patterns." }
    ],
    "disclaimer": "Mapped to supplementary CFI modules for deep cultural exploration."
};
window.SoulamoreAssessments["anxiety_loops"] = {
    "id": "anxiety_loops",
    "title": "The Overthinking Filter",
    "version": "1.0",
    "description": "Decode the mechanics of your mental loops. Identify if your overthinking is a protective shield or a cognitive trap.",
    "primary_domain": "Anxiety Spectrum",
    "context_tags": ["Digital", "Creative", "Academic"],
    "theme_color": "#4ECDC4",
    "questions": [
        {
            "id": "al_q1", "text": "When a minor decision arises (like choosing a meal or an email subject), my mind typically...", "domain": "anxiety_loops", "subdomain": "cognitive", "options": [
                { "text": "Decides quickly and moves on.", "severity_weight": 0 },
                { "text": "Weighs options for a few minutes.", "severity_weight": 1 },
                { "text": "Simulates multiple outcomes, fearing the 'wrong' choice.", "severity_weight": 2 },
                { "text": "Becomes paralyzed, unable to choose for fear of imperfection.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "al_q2", "text": "Once a conversation ends, I find myself 'replaying' the tape...", "domain": "anxiety_loops", "subdomain": "ruminative", "options": [
                { "text": "Rarely; I stay in the present.", "severity_weight": 0 },
                { "text": "Occasionally, if it was important.", "severity_weight": 1 },
                { "text": "Frequently, looking for subtle mistakes I made.", "severity_weight": 2 },
                { "text": "Obsessively, convinced I've offended someone or failed.", "severity_weight": 3 }
            ]
        },
        {
            "id": "al_q3", "text": "When I try to stop a loop of thoughts, the experience is like...", "domain": "anxiety_loops", "subdomain": "regulation", "options": [
                { "text": "Closing a book easily.", "severity_weight": 0 },
                { "text": "Lowering the volume slightly.", "severity_weight": 1 },
                { "text": "Fighting against a loud, persistent noise.", "severity_weight": 2 },
                { "text": "Being trapped in a room with a megaphone I can't touch.", "severity_weight": 3, "functional_impairment": true }
            ], "insight_cloud": { "type": "clinical", "title": "Metacognition", "text": "Overthinking isn't just about 'what' you think, but how you relate to your thoughts. Clinical research into metacognitive therapy shows that believing thoughts are uncontrollable is what makes the loop feel dangerous.", "source_name": "Metacognitive Therapy Principles" }
        },
        {
            "id": "al_q4", "text": "My overthinking usually feels...", "domain": "anxiety_loops", "subdomain": "phenomenology", "options": [
                { "text": "Purposeful and productive.", "severity_weight": 0 },
                { "text": "Tiring but sometimes helpful for planning.", "severity_weight": 1 },
                { "text": "Exhausting and largely circular.", "severity_weight": 2 },
                { "text": "A source of profound mental burnout and 'brain fry'.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "al_q5", "text": "Have you ever felt a physical 'buzz' or pressure in your head from too many thoughts?", "domain": "anxiety_loops", "subdomain": "somatic", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely, during high stress.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Constantly; it feels like physical inflammation.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "minimal", "risk_category": "low" },
            { "range": [4, 7], "label": "mild", "risk_category": "low" },
            { "range": [8, 11], "label": "moderate", "risk_category": "medium" },
            { "range": [12, 15], "label": "severe", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["anxiety_somatic"] = {
    "id": "anxiety_somatic",
    "title": "Somatic Echoes",
    "version": "1.0",
    "description": "Learn to translate your body's alarm signals. Map out chest tension, digestive shifts, and restlessness.",
    "primary_domain": "Anxiety Spectrum",
    "context_tags": ["Somatic", "Performance", "Workplace"],
    "theme_color": "#FF6B6B",
    "questions": [
        {
            "id": "as_q1", "text": "When I feel 'anxious', the first place I feel it in my body is...", "domain": "anxiety_somatic", "subdomain": "localization", "options": [
                { "text": "Nowhere specific; it's mostly mental.", "severity_weight": 0 },
                { "text": "Light tension in shoulders or neck.", "severity_weight": 1 },
                { "text": "Tightness in chest or a 'knot' in the stomach.", "severity_weight": 2 },
                { "text": "A full-body activation (shaking, heat, or coldness).", "severity_weight": 3 }
            ]
        },
        {
            "id": "as_q2", "text": "Regarding my breath when I am stressed, I notice...", "domain": "anxiety_somatic", "subdomain": "respiratory", "options": [
                { "text": "It stays deep and rhythmic.", "severity_weight": 0 },
                { "text": "It becomes slightly shallow.", "severity_weight": 1 },
                { "text": "I feel like I can't take a full, deep breath.", "severity_weight": 2 },
                { "text": "Air hunger; I gasp or feel like I am choking.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "as_q3", "text": "My digestive system react to my emotional state by...", "domain": "anxiety_somatic", "subdomain": "visceral", "options": [
                { "text": "Staying stable.", "severity_weight": 0 },
                { "text": "Occasional butterflies.", "severity_weight": 1 },
                { "text": "Frequent nausea or 'nervous stomach'.", "severity_weight": 2 },
                { "text": "Severe cramping or disruption of eating patterns.", "severity_weight": 3, "functional_impairment": true }
            ], "insight_cloud": { "type": "fact", "title": "The Gut-Brain Axis", "text": "Your gut has its own nervous system (the enteric nervous system). This is why anxiety often feels like a physical 'blow' to the stomach before it's even a thought.", "source_name": "Neuro-Gastroenterology Research" }
        },
        {
            "id": "as_q4", "text": "When trying to stay still, my limbs feel...", "domain": "anxiety_somatic", "subdomain": "motor", "options": [
                { "text": "Relaxed and heavy.", "severity_weight": 0 },
                { "text": "Slightly fidgety.", "severity_weight": 1 },
                { "text": "Driven by a motor; I need to pace or move.", "severity_weight": 2 },
                { "text": "Involuntarily tensed or trembling.", "severity_weight": 3 }
            ]
        },
        {
            "id": "as_q5", "text": "How often do you mistake these physical symptoms for a medical emergency?", "domain": "anxiety_somatic", "subdomain": "cognitive_appraisal", "risk_flag": true, "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Sometimes; it causes a secondary panic.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Frequently; I often feel I am physically dying.", "severity_weight": 3, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "minimal", "risk_category": "low" },
            { "range": [4, 7], "label": "mild", "risk_category": "low" },
            { "range": [8, 11], "label": "moderate", "risk_category": "medium" },
            { "range": [12, 15], "label": "severe", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["anxiety_future"] = {
    "id": "anxiety_future",
    "title": "The Anticipation Clock",
    "version": "1.0",
    "description": "Examine your relationship with 'What-Ifs'. Map the dread of upcoming events and the weight of uncertainty.",
    "primary_domain": "Anxiety Spectrum",
    "context_tags": ["Leadership", "Career", "Performance"],
    "theme_color": "#45B7D1",
    "questions": [
        {
            "id": "af_q1", "text": "When thinking about next week, my primary emotional tone is...", "domain": "anxiety_future", "subdomain": "affective", "options": [
                { "text": "Neutral or excited.", "severity_weight": 0 },
                { "text": "Responsible but slightly wary.", "severity_weight": 1 },
                { "text": "Apprehensive, waiting for the other shoe to drop.", "severity_weight": 2 },
                { "text": "Profound dread; I don't want next week to come.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "af_q2", "text": "If a plan is slightly uncertain (e.g., 'we'll meet around 6'), I feel...", "domain": "anxiety_future", "subdomain": "uncertainty", "options": [
                { "text": "Flexible and fine with it.", "severity_weight": 0 },
                { "text": "A little annoyed but adaptable.", "severity_weight": 1 },
                { "text": "Anxious; I need exact details to feel safe.", "severity_weight": 2 },
                { "text": "Hostile or panicked by the lack of structure.", "severity_weight": 3 }
            ]
        },
        {
            "id": "af_q3", "text": "I spend time 'practicing' future conversations or scenarios...", "domain": "anxiety_future", "subdomain": "behavioral", "options": [
                { "text": "Only for big presentations.", "severity_weight": 0 },
                { "text": "Occasionally for social events.", "severity_weight": 1 },
                { "text": "Frequently, even for minor interactions.", "severity_weight": 2 },
                { "text": "Constantly; it's the only way I can function.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Safety Seeking", "text": "Rehearsing the future is a 'safety seeking' behavior. While it feels productive, clinically it often maintains anxiety by reinforcing the idea that you can't handle spontaneity.", "source_name": "CBT Protocols for GAD" }
        },
        {
            "id": "af_q4", "text": "Uncertainty feels to me like...", "domain": "anxiety_future", "subdomain": "threat_appraisal", "options": [
                { "text": "A natural part of life.", "severity_weight": 0 },
                { "text": "A challenge to be managed.", "severity_weight": 1 },
                { "text": "A threat that must be eliminated.", "severity_weight": 2 },
                { "text": "Intolerable agony.", "severity_weight": 3 }
            ]
        },
        {
            "id": "af_q5", "text": "Have you ever avoided a positive opportunity because the uncertainty of it was too scary?", "domain": "anxiety_future", "subdomain": "avoidance_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Once or twice.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "My entire life is defined by this avoidance.", "severity_weight": 3, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "minimal", "risk_category": "low" },
            { "range": [4, 7], "label": "mild", "risk_category": "low" },
            { "range": [8, 11], "label": "moderate", "risk_category": "medium" },
            { "range": [12, 15], "label": "severe", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["anxiety_calm"] = {
    "id": "anxiety_calm",
    "title": "The Quietude Baseline",
    "version": "1.0",
    "description": "Assess your capacity for stillness. Measure your nervous system's ability to deactivate after a surge of stress.",
    "primary_domain": "Anxiety Spectrum",
    "context_tags": ["Somatic", "Creative", "Digital"],
    "theme_color": "#9EE09E",
    "questions": [
        {
            "id": "ac_q1", "text": "After a stressful event ends (e.g., a meeting), my body takes...", "domain": "anxiety_calm", "subdomain": "recovery_rate", "options": [
                { "text": "Minutes to feel normal again.", "severity_weight": 0 },
                { "text": "About an hour to settle.", "severity_weight": 1 },
                { "text": "The rest of the day to stop 'buzzing'.", "severity_weight": 2 },
                { "text": "I never feel like I fully return to baseline.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "ac_q2", "text": "In a truly quiet room with no phone or distraction, I feel...", "domain": "anxiety_calm", "subdomain": "tolerance_for_stillness", "options": [
                { "text": "Peaceful and restored.", "severity_weight": 0 },
                { "text": "A little bored but okay.", "severity_weight": 1 },
                { "text": "Agitated, like I should be doing something.", "severity_weight": 2 },
                { "text": "Intensely anxious; the silence is deafening.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ac_q3", "text": "My 'internal engine' usually feels like it's running at...", "domain": "anxiety_calm", "subdomain": "arousal_baseline", "options": [
                { "text": "A low, steady idle.", "severity_weight": 0 },
                { "text": "A busy, active speed.", "severity_weight": 1 },
                { "text": "Redlining; I'm always near a breaking point.", "severity_weight": 2 },
                { "text": "Shattered; I'm exhausted but the engine won't stop.", "severity_weight": 3, "functional_impairment": true }
            ], "insight_cloud": { "type": "clinical", "title": "Window of Tolerance", "text": "We all have a 'window of tolerance' where emotions are manageable. Anxiety narrows this window. Expanding it isn't about getting rid of stress, but building the capacity to hold it.", "source_name": "Polyvagal Theory Concepts" }
        },
        {
            "id": "ac_q4", "text": "Deep breathing or mindfulness exercises feel...", "domain": "anxiety_calm", "subdomain": "resilience_mechanics", "options": [
                { "text": "Genuinely helpful.", "severity_weight": 0 },
                { "text": "Difficult to start but useful.", "severity_weight": 1 },
                { "text": "Ineffective or frustrating.", "severity_weight": 2 },
                { "text": "Threatening (I feel safer staying 'alert').", "severity_weight": 3 }
            ]
        },
        {
            "id": "ac_q5", "text": "Have you lost the ability to feel genuinely 'safe' in your own home?", "domain": "anxiety_calm", "subdomain": "safety_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "I haven't felt safe in years.", "severity_weight": 5, "risk_weight": 5 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 17, "bands": [
            { "range": [0, 4], "label": "vibrant", "risk_category": "low" },
            { "range": [5, 10], "label": "strained", "risk_category": "low" },
            { "range": [11, 14], "label": "depleted", "risk_category": "medium" },
            { "range": [15, 17], "label": "crisis", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["anxiety_social"] = {
    "id": "anxiety_social",
    "title": "Social Performance & Intimacy",
    "version": "1.0",
    "description": "Map the friction of being seen. Discover if your social fatigue is driven by judgment fear or sensory overwhelm.",
    "primary_domain": "Anxiety Spectrum",
    "context_tags": ["Family", "Workplace", "Romantic"],
    "theme_color": "#A3BCB6",
    "questions": [
        {
            "id": "ao_q1", "text": "Before a social event, the dominant thought is...", "domain": "anxiety_social", "subdomain": "anticipatory", "options": [
                { "text": "I wonder who will be there.", "severity_weight": 0 },
                { "text": "I hope I don't look awkward.", "severity_weight": 1 },
                { "text": "I need to plan 'safe' topics to talk about.", "severity_weight": 2 },
                { "text": "How can I get out of this without people hating me?", "severity_weight": 3 }
            ]
        },
        {
            "id": "ao_q2", "text": "During a group conversation, I am usually...", "domain": "anxiety_social", "subdomain": "self_consciousness", "options": [
                { "text": "Listening and contributing easily.", "severity_weight": 0 },
                { "text": "Conscious of my posture or tone, but engaged.", "severity_weight": 1 },
                { "text": "Monitoring every word I say for potential 'mistakes'.", "severity_weight": 2 },
                { "text": "Mentally absent; I am too panicked to follow the thread.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "ao_q3", "text": "When I make a small social mistake (e.g., mispronouncing a word), I feel...", "domain": "anxiety_social", "subdomain": "shame_response", "options": [
                { "text": "A bit embarrassed, then I laugh it off.", "severity_weight": 0 },
                { "text": "Annoyed at myself.", "severity_weight": 1 },
                { "text": "Convinced everyone is now judging me.", "severity_weight": 2 },
                { "text": "A wave of heat/shame so intense I need to leave.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "fact", "title": "Spotlight Effect", "text": "We tend to believe others are noticing our flaws way more than they actually are. This is the 'Spotlight Effect'. In reality, most people are too busy worrying about their own spotlight to see yours.", "source_name": "Social Psychology Research" }
        },
        {
            "id": "ao_q4", "text": "After social interaction, I feel...", "domain": "anxiety_social", "subdomain": "recovery", "options": [
                { "text": "Energized or normally tired.", "severity_weight": 0 },
                { "text": "Exhausted and needing alone time.", "severity_weight": 1 },
                { "text": "Regretful, replaying my 'cringe' moments.", "severity_weight": 2 },
                { "text": "Profoundly depleted and 'socially hungover' for days.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "ao_q5", "text": "Have you ever experienced physical avoidance symptoms (nausea, dizziness) just at the thought of a social interaction?", "domain": "anxiety_social", "subdomain": "somatic_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Once or twice.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am effectively housebound due to this.", "severity_weight": 4, "risk_weight": 4 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 16, "bands": [
            { "range": [0, 4], "label": "socially fluid", "risk_category": "low" },
            { "range": [5, 9], "label": "self-conscious", "risk_category": "low" },
            { "range": [10, 13], "label": "socially strained", "risk_category": "medium" },
            { "range": [14, 16], "label": "isolated", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};
window.SoulamoreAssessments["anxiety_nighttime"] = {
    "id": "anxiety_nighttime",
    "title": "Nighttime Echoes",
    "version": "1.0",
    "description": "Explore the bridge between your day and night. Map the thoughts that keep you vigilant when the world goes quiet.",
    "primary_domain": "Anxiety Spectrum",
    "context_tags": ["Somatic", "Creative", "Digital"],
    "theme_color": "#6366f1",
    "questions": [
        {
            "id": "an_q1", "text": "As I prepare for sleep, my mind's volume usually...", "domain": "anxiety_nighttime", "subdomain": "pre_sleep_arousal", "options": [
                { "text": "Turns down naturally.", "severity_weight": 0 },
                { "text": "Becomes a low background hum.", "severity_weight": 1 },
                { "text": "Becomes louder and more insistent.", "severity_weight": 2 },
                { "text": "Shouts over any attempt to relax.", "severity_weight": 3 }
            ]
        },
        {
            "id": "an_q2", "text": "Regarding the events of the day, my nighttime mind tends to...", "domain": "anxiety_nighttime", "subdomain": "rumination", "options": [
                { "text": "File them away calmly.", "severity_weight": 0 },
                { "text": "Briefly review them.", "severity_weight": 1 },
                { "text": "Analyze every conversation for potential cringe.", "severity_weight": 2 },
                { "text": "Loop obsessively on mistakes or worries.", "severity_weight": 3 }
            ]
        },
        {
            "id": "an_q3", "text": "If I wake up during the night, my immediate internal state is...", "domain": "anxiety_nighttime", "subdomain": "nocturnal_arousal", "options": [
                { "text": "Sleepy and ready to drift back.", "severity_weight": 0 },
                { "text": "Slightly alert but can relax.", "severity_weight": 1 },
                { "text": "Fully awake, with thoughts immediately racing.", "severity_weight": 2 },
                { "text": "In a state of panic or high alert.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "fact", "title": "The Hour of Vigilance", "text": "Waking up at 3 AM and feeling 'wired' is often due to a cortisol spike as your body misinterprets quiet as 'danger'. It's a primal survival reflex, not a character flaw.", "source_name": "Circadian Rhythm & Stress Research" }
        },
        {
            "id": "an_q4", "text": "Physically, when trying to sleep, I notice...", "domain": "anxiety_nighttime", "subdomain": "somatic", "options": [
                { "text": "My muscles feel heavy and relaxed.", "severity_weight": 0 },
                { "text": "Some restlessness in my legs or jaw.", "severity_weight": 1 },
                { "text": "My heart beating noticeably in my chest.", "severity_weight": 2 },
                { "text": "I feel too 'electric' or jittery to stay still.", "severity_weight": 3 }
            ]
        },
        {
            "id": "an_q5", "text": "Do you feel a sense of dread as the sun starts to set?", "domain": "anxiety_nighttime", "subdomain": "anticipatory", "risk_flag": true, "options": [
                { "text": "No, I look forward to night.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often; I fear the quiet hours.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Always; I avoid the bedroom as long as possible.", "severity_weight": 3, "risk_weight": 3, "functional_impairment": true }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "restful", "risk_category": "low" },
            { "range": [4, 7], "label": "vigilant", "risk_category": "low" },
            { "range": [8, 11], "label": "exhausted", "risk_category": "medium" },
            { "range": [12, 15], "label": "depleted", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["anxiety_perfectionism"] = {
    "id": "anxiety_perfectionism",
    "title": "The Perfectionist's Mirror",
    "version": "1.0",
    "description": "Examine the standards you hold for yourself. Distinguish between healthy striving and the anxiety of 'Not Enough'.",
    "primary_domain": "Anxiety Spectrum",
    "context_tags": ["Academic", "Workplace", "Performance", "Creative"],
    "theme_color": "#fbbf24",
    "questions": [
        {
            "id": "ap_q1", "text": "When I finish a project, my first thought is usually...", "domain": "anxiety_perfectionism", "subdomain": "self_criticism", "options": [
                { "text": "A sense of accomplishment.", "severity_weight": 0 },
                { "text": "Relief that it's over.", "severity_weight": 1 },
                { "text": "Scanning for the one thing I could have done better.", "severity_weight": 2 },
                { "text": "Convinced it's fraudulent or fundamentally flawed.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ap_q2", "text": "If I make a small mistake in public, I feel...", "domain": "anxiety_perfectionism", "subdomain": "social_standards", "options": [
                { "text": "Mildly annoyed but it passes.", "severity_weight": 0 },
                { "text": "A bit embarrassed.", "severity_weight": 1 },
                { "text": "Like my credibility has been permanently damaged.", "severity_weight": 2 },
                { "text": "Deep, physical shame that lasts for days.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ap_q3", "text": "My standard for success is...", "domain": "anxiety_perfectionism", "subdomain": "expected_outcomes", "options": [
                { "text": "Flexible and based on effort.", "severity_weight": 0 },
                { "text": "High but usually reachable.", "severity_weight": 1 },
                { "text": "Uncompromising; anything less than perfect is failure.", "severity_weight": 2 },
                { "text": "So high I often can't even start.", "severity_weight": 3, "functional_impairment": true }
            ], "insight_cloud": { "type": "clinical", "title": "The Perfectionism Paradox", "text": "Perfectionism is rarely about being perfect; it's usually a shield against the pain of being judged. Clinically, 'Maladaptive Perfectionism' is a major driver of chronic anxiety and burnout.", "source_name": "MPS Framework Research" }
        },
        {
            "id": "ap_q4", "text": "Regarding others' expectations, I feel...", "domain": "anxiety_perfectionism", "subdomain": "socially_prescribed", "options": [
                { "text": "I can set healthy boundaries.", "severity_weight": 0 },
                { "text": "I try my best to please them.", "severity_weight": 1 },
                { "text": "I must be perfect to be worthy of their love.", "severity_weight": 2 },
                { "text": "Terrified of disappointing anyone.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ap_q5", "text": "Have you ever abandoned a goal because you couldn't do it perfectly on the first try?", "domain": "anxiety_perfectionism", "subdomain": "avoidance", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "This is my primary way of existing.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "resilient", "risk_category": "low" },
            { "range": [4, 7], "label": "striving", "risk_category": "low" },
            { "range": [8, 11], "label": "pressured", "risk_category": "medium" },
            { "range": [12, 15], "label": "exhausted", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["anxiety_decisions"] = {
    "id": "anxiety_decisions",
    "title": "The Decision Vortex",
    "version": "1.0",
    "description": "Decode your choice-making process. Identify the anxiety behind decision paralysis and executive hesitation.",
    "primary_domain": "Anxiety Spectrum",
    "context_tags": ["Leadership", "Workplace", "Family", "Creative"],
    "theme_color": "#fb7185",
    "questions": [
        {
            "id": "ad_q1", "text": "When faced with a list of equal options, my first response is...", "domain": "anxiety_decisions", "subdomain": "initial_response", "options": [
                { "text": "To pick one and move forward.", "severity_weight": 0 },
                { "text": "To narrow them down logically.", "severity_weight": 1 },
                { "text": "To feel a surge of internal static.", "severity_weight": 2 },
                { "text": "Total mental shutdown.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "ad_q2", "text": "I worry about making the 'wrong' choice because...", "domain": "anxiety_decisions", "subdomain": "fear_of_consequences", "options": [
                { "text": "I don't; mistakes happen.", "severity_weight": 0 },
                { "text": "It might cause minor inconvenience.", "severity_weight": 1 },
                { "text": "It feels like a permanent reflection of my character.", "severity_weight": 2 },
                { "text": "I am convinced it will lead to disaster.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ad_q3", "text": "After making a decision, I usually...", "domain": "anxiety_decisions", "subdomain": "post_decision_rumination", "options": [
                { "text": "Trust it and move on.", "severity_weight": 0 },
                { "text": "Occasionally look back.", "severity_weight": 1 },
                { "text": "Dwell on what I might have missed.", "severity_weight": 2 },
                { "text": "Feel instant regret and try to undo it.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Decision Fatigue", "text": "Decision paralysis isn't about being 'slow'. It's often a sign of 'Executive Dysfunction' driven by high anxiety. Your brain is trying to protect you from failure by refusing to commit to any path.", "source_name": "Executive Functioning Research" }
        },
        {
            "id": "ad_q4", "text": "Regarding others making decisions for me, I feel...", "domain": "anxiety_decisions", "subdomain": "dependence", "options": [
                { "text": "I prefer to have agency.", "severity_weight": 0 },
                { "text": "Open to their input.", "severity_weight": 1 },
                { "text": "Deep relief that I don't have to choose.", "severity_weight": 2 },
                { "text": "I actively avoid all responsibility for choices.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ad_q5", "text": "Have you ever missed a major life opportunity because you couldn't decide in time?", "domain": "anxiety_decisions", "subdomain": "behavioral_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "Yes, many times.", "severity_weight": 3, "risk_weight": 4, "functional_impairment": true }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "decisive", "risk_category": "low" },
            { "range": [4, 7], "label": "analytical", "risk_category": "low" },
            { "range": [8, 11], "label": "paralyzed", "risk_category": "medium" },
            { "range": [12, 15], "label": "shackled", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["anxiety_panic"] = {
    "id": "anxiety_panic",
    "title": "The Panic Pulse",
    "version": "1.0",
    "description": "Decode the high-intensity surges of your nervous system. Distinguish between fear, anxiety, and the somatic rush of panic.",
    "primary_domain": "Anxiety Spectrum",
    "context_tags": ["Somatic", "Trauma & Nervous System"],
    "theme_color": "#e11d48",
    "questions": [
        {
            "id": "ap_q1", "text": "When a surge of panic hits, it feels like...", "domain": "anxiety_panic", "subdomain": "phenomenology", "options": [
                { "text": "It doesn't; I don't experience surges.", "severity_weight": 0 },
                { "text": "A brief wave of intense nerves.", "severity_weight": 1 },
                { "text": "An earthquake in my body.", "severity_weight": 2 },
                { "text": "A life-threatening medical emergency.", "severity_weight": 3, "risk_weight": 2 }
            ]
        },
        {
            "id": "ap_q2", "text": "During an episode, my breathing usually...", "domain": "anxiety_panic", "subdomain": "respiratory_somatic", "options": [
                { "text": "Stays under my control.", "severity_weight": 0 },
                { "text": "Speeds up slightly.", "severity_weight": 1 },
                { "text": "Becomes shallow and uncontrollable.", "severity_weight": 2 },
                { "text": "Feels like I'm suffocating or choking.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ap_q3", "text": "In the aftermath of an intense surge, I feel...", "domain": "anxiety_panic", "subdomain": "recovery_exhaustion", "options": [
                { "text": "Back to normal quickly.", "severity_weight": 0 },
                { "text": "A bit shaken.", "severity_weight": 1 },
                { "text": "Drained for the rest of the day.", "severity_weight": 2 },
                { "text": "Utterly traumatized and fearful of it happening again.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The False Alarm", "text": "A panic attack is your body's 'Fight or Flight' system firing without an external enemy. While it feels like a heart attack, it is a survival reflex designed to move you toward safety.", "source_name": "PDSS Framework Guidelines" }
        },
        {
            "id": "ap_q4", "text": "I have adjusted my life (avoiding certain places or situations) to prevent these surges...", "domain": "anxiety_panic", "subdomain": "avoidance", "options": [
                { "text": "Not at all.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2, "functional_impairment": true },
                { "text": "Entirely; my life is restricted.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "ap_q5", "text": "How often do you feel a persistent fear of the panic itself?", "domain": "anxiety_panic", "subdomain": "anticipatory_panic", "risk_flag": true, "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "Almost constantly.", "severity_weight": 3, "risk_weight": 4 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "stable", "risk_category": "low" },
            { "range": [4, 7], "label": "reactive", "risk_category": "low" },
            { "range": [8, 11], "label": "surging", "risk_category": "medium" },
            { "range": [12, 15], "label": "overwhelmed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["anxiety_vigilance"] = {
    "id": "anxiety_vigilance",
    "title": "The Vigilant Eye",
    "version": "1.0",
    "description": "Assess your state of 'High Alert'. Discover if your nervous system is stuck in a scanning pattern for potential threats.",
    "primary_domain": "Anxiety Spectrum",
    "context_tags": ["Trauma & Nervous System", "Somatic", "Digital"],
    "theme_color": "#0ea5e9",
    "questions": [
        {
            "id": "av_q1", "text": "In public spaces, I find my attention...", "domain": "anxiety_vigilance", "subdomain": "environmental_scanning", "options": [
                { "text": "Relaxed and present.", "severity_weight": 0 },
                { "text": "Generally aware.", "severity_weight": 1 },
                { "text": "Always scanning for exits or potential issues.", "severity_weight": 2 },
                { "text": "Intensely focused on everyone's movements for signs of threat.", "severity_weight": 3 }
            ]
        },
        {
            "id": "av_q2", "text": "If I hear a sudden loud noise, my body...", "domain": "anxiety_vigilance", "subdomain": "startle_response", "options": [
                { "text": "Barely notices it.", "severity_weight": 0 },
                { "text": "Startles briefly then settles.", "severity_weight": 1 },
                { "text": "Instantly jumps into high alert.", "severity_weight": 2 },
                { "text": "Freezes or triggers a full stress response.", "severity_weight": 3 }
            ]
        },
        {
            "id": "av_q3", "text": "When meeting someone new, my mind is first looking for...", "domain": "anxiety_vigilance", "subdomain": "interpersonal_trust", "options": [
                { "text": "Connection and commonality.", "severity_weight": 0 },
                { "text": "Politeness.", "severity_weight": 1 },
                { "text": "Subtle signs of judgment or exclusion.", "severity_weight": 2 },
                { "text": "Potential deception or hidden agendas.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Hyperarousal", "text": "Hypervigilance is a state of 'Hyperarousal' where the amygdala (the brain's smoke detector) stays on. It's often a learned response from past environments where you had to be careful to be safe.", "source_name": "Nervous System Regulation Studies" }
        },
        {
            "id": "av_q4", "text": "I feel I 'need' to stay alert to keep myself or others safe...", "domain": "anxiety_vigilance", "subdomain": "protective_belief", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Constantly; relaxing feels dangerous.", "severity_weight": 3 }
            ]
        },
        {
            "id": "av_q5", "text": "Has this constant alertness led to chronic physical pain (headaches, back pain)?", "domain": "anxiety_vigilance", "subdomain": "somatic_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Constantly.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "relaxed", "risk_category": "low" },
            { "range": [4, 7], "label": "aware", "risk_category": "low" },
            { "range": [8, 11], "label": "vigilant", "risk_category": "medium" },
            { "range": [12, 15], "label": "hyperaroused", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};
window.SoulamoreAssessments["mood_fog"] = {
    "id": "mood_fog",
    "title": "The Heavy Fog",
    "version": "1.0",
    "description": "Decode the cognitive 'numbness' of your day. Map the distance between you and your focus, grounded in PHQ-9 benchmarks.",
    "primary_domain": "Mood & Depression",
    "context_tags": ["Workplace", "Academic", "Digital"],
    "theme_color": "#64748b",
    "questions": [
        {
            "id": "mf_q1", "text": "Today, starting a simple task felt like...", "domain": "mood_fog", "subdomain": "executive_initiation", "options": [
                { "text": "Normal and effortless.", "severity_weight": 0 },
                { "text": "Requiring a bit more coffee or willpower than usual.", "severity_weight": 1 },
                { "text": "Wading through waist-deep water.", "severity_weight": 2 },
                { "text": "Moving through thick, cold cement.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "mf_q2", "text": "When I try to focus on a book or a screen, my mind...", "domain": "mood_fog", "subdomain": "concentration_depth", "options": [
                { "text": "Stays sharp and present.", "severity_weight": 0 },
                { "text": "Drifts occasionally.", "severity_weight": 1 },
                { "text": "Feels 'fuzzy' or slow to process information.", "severity_weight": 2 },
                { "text": "Is completely blank; I can't retain what I just read.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mf_q3", "text": "My emotional world currently feels...", "domain": "mood_fog", "subdomain": "affective_numbness", "options": [
                { "text": "Vibrant and responsive.", "severity_weight": 0 },
                { "text": "A bit muted.", "severity_weight": 1 },
                { "text": "Mostly grey; I can't really feel joy or sadness deeply.", "severity_weight": 2 },
                { "text": "Completely 'checked out' or hollow.", "severity_weight": 3, "functional_impairment": true }
            ], "insight_cloud": { "type": "clinical", "title": "Psychomotor Retardation", "text": "In clinical mood journeys, 'Fog' isn't just a metaphor. It can manifest as real physical slowness in thinking and moving, called psychomotor retardation.", "source_name": "Diagnostic Manual Frameworks" }
        },
        {
            "id": "mf_q4", "text": "Making a small decision (like what to eat) feels...", "domain": "mood_fog", "subdomain": "decision_paralysis", "options": [
                { "text": "Quick and easy.", "severity_weight": 0 },
                { "text": "A bit tedious.", "severity_weight": 1 },
                { "text": "Overwhelming; I'd rather someone else choose.", "severity_weight": 2 },
                { "text": "Impossible; I end up doing nothing.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mf_q5", "text": "Have you noticed any physical slowness in your speech or movements lately?", "domain": "mood_fog", "subdomain": "somatic_retardation", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Noticeably.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, it's very pronounced.", "severity_weight": 3, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "clear", "risk_category": "low" },
            { "range": [4, 7], "label": "hazy", "risk_category": "low" },
            { "range": [8, 11], "label": "foggy", "risk_category": "medium" },
            { "range": [12, 15], "label": "submerged", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["mood_anhedonia"] = {
    "id": "mood_anhedonia",
    "title": "The Colorless World",
    "version": "1.0",
    "description": "Assess your capacity for joy and reward. Distinguish between 'Feeling Sad' and 'The Absence of Feeling', grounded in SHAPS benchmarks.",
    "primary_domain": "Mood & Depression",
    "context_tags": ["Romantic", "Creative", "Family"],
    "theme_color": "#94a3b8",
    "questions": [
        {
            "id": "ma_q1", "text": "The things that used to make me light up (hobbies, music) now feel...", "domain": "mood_anhedonia", "subdomain": "consummatory_joy", "options": [
                { "text": "Just as good as always.", "severity_weight": 0 },
                { "text": "A little less exciting.", "severity_weight": 1 },
                { "text": "Like a chore or a habit.", "severity_weight": 2 },
                { "text": "Like looking at a picture of food when you're not hungry.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "ma_q2", "text": "Regarding the future, I feel...", "domain": "mood_anhedonia", "subdomain": "anticipatory_pleasure", "options": [
                { "text": "Hopeful and curious.", "severity_weight": 0 },
                { "text": "Fine, but not excited.", "severity_weight": 1 },
                { "text": "Indifferent; there's nothing to look forward to.", "severity_weight": 2 },
                { "text": "Dread; or worse, total emptiness.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ma_q3", "text": "A genuine compliment from someone I care about feels...", "domain": "mood_anhedonia", "subdomain": "social_reward", "options": [
                { "text": "Warm and validating.", "severity_weight": 0 },
                { "text": "Nice, but brief.", "severity_weight": 1 },
                { "text": "Like words that don't quite reach me.", "severity_weight": 2 },
                { "text": "Irrelevant or annoying.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "fact", "title": "Anhedonia vs. Sadness", "text": "Anhedonia is the clinical term for the inability to feel pleasure. While sadness is an active emotion, anhedonia is the presence of an emotional 'void'. It's often linked to the brain's reward system status.", "source_name": "SHAPS Reward Processing Research" }
        },
        {
            "id": "ma_q4", "text": "My sense of humor lately has been...", "domain": "mood_anhedonia", "subdomain": "reactive_affect", "options": [
                { "text": "Active and spontaneous.", "severity_weight": 0 },
                { "text": "Slightly less reactive.", "severity_weight": 1 },
                { "text": "Forced; I smile to make others comfortable.", "severity_weight": 2 },
                { "text": "Completely gone.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ma_q5", "text": "Do you feel like your 'battery' for joy has been physically removed?", "domain": "mood_anhedonia", "subdomain": "subjective_capacity", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am in a state of 'locked-out' joy.", "severity_weight": 4, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 16, "bands": [
            { "range": [0, 4], "label": "vibrant", "risk_category": "low" },
            { "range": [5, 8], "label": "muted", "risk_category": "low" },
            { "range": [9, 12], "label": "colorless", "risk_category": "medium" },
            { "range": [13, 16], "label": "frozen", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["mood_exhaustion"] = {
    "id": "mood_exhaustion",
    "title": "Functional Exhaustion",
    "version": "1.0",
    "description": "Distinguish between 'Busy Boredom' and 'Clinical Fatigue'. Map your internal drive against your physical capacity.",
    "primary_domain": "Mood & Depression",
    "context_tags": ["Workplace", "Performance", "Somatic"],
    "theme_color": "#475569",
    "questions": [
        {
            "id": "me_q1", "text": "My energy level after a full night's sleep is...", "domain": "mood_exhaustion", "subdomain": "restorative_capacity", "options": [
                { "text": "Refreshed and ready.", "severity_weight": 0 },
                { "text": "Okay, but it fades fast.", "severity_weight": 1 },
                { "text": "Like I haven't slept at all.", "severity_weight": 2 },
                { "text": "Deeply, marrow-level tired.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "me_q2", "text": "The thought of social plans or 'fun' activities feels...", "domain": "mood_exhaustion", "subdomain": "social_energy_cost", "options": [
                { "text": "Invigorating.", "severity_weight": 0 },
                { "text": "A bit demanding.", "severity_weight": 1 },
                { "text": "Like a heavy mountain I have to climb.", "severity_weight": 2 },
                { "text": "Physically impossible to even consider.", "severity_weight": 3 }
            ]
        },
        {
            "id": "me_q3", "text": "I feel most productive when...", "domain": "mood_exhaustion", "subdomain": "diurnal_pattern", "options": [
                { "text": "I have a healthy daily rhythm.", "severity_weight": 0 },
                { "text": "I push myself with caffeine/willpower.", "severity_weight": 1 },
                { "text": "I barely scrape by.", "severity_weight": 2 },
                { "text": "I'm never productive; I'm just surviving.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Avolition", "text": "Avolition is the clinical loss of 'will' or 'drive'. It's not laziness; it's a shutdown of the brain's goal-seeking mechanism often seen in deep mood valleys.", "source_name": "Functional Fatigue Research" }
        },
        {
            "id": "me_q4", "text": "My interest in self-care (showering, dressing well) is...", "domain": "mood_exhaustion", "subdomain": "daily_functioning", "options": [
                { "text": "High and consistent.", "severity_weight": 0 },
                { "text": "Slipping a bit.", "severity_weight": 1 },
                { "text": "A struggle to maintain.", "severity_weight": 2 },
                { "text": "Non-existent; I've stopped caring.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "me_q5", "text": "Do you feel like even your thoughts are 'heavy' to think?", "domain": "mood_exhaustion", "subdomain": "cognitive_burden", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Almost constantly.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "resilient", "risk_category": "low" },
            { "range": [4, 7], "label": "tired", "risk_category": "low" },
            { "range": [8, 11], "label": "depleted", "risk_category": "medium" },
            { "range": [12, 15], "label": "shut down", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["mood_critic"] = {
    "id": "mood_critic",
    "title": "The Inner Critic",
    "version": "1.0",
    "description": "Map the volume of your self-judgment. Identify the difference between a conscience and a 'bully' within.",
    "primary_domain": "Mood & Depression",
    "context_tags": ["Identity & Self-Concept", "Workplace", "Romantic"],
    "theme_color": "#4b5563",
    "questions": [
        {
            "id": "mc_q1", "text": "When I look in the mirror, my first thought is...", "domain": "mood_critic", "subdomain": "visual_self_concept", "options": [
                { "text": "Acceptance or warmth.", "severity_weight": 0 },
                { "text": "Neutral observation.", "severity_weight": 1 },
                { "text": "Scanning for a specific flaw.", "severity_weight": 2 },
                { "text": "Immediate disgust or harsh judgment.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mc_q2", "text": "If I make a mistake at work/school, my internal dialogue is...", "domain": "mood_critic", "subdomain": "performance_guilt", "options": [
                { "text": "Let's fix this and learn.", "severity_weight": 0 },
                { "text": "That was annoying, be better next time.", "severity_weight": 1 },
                { "text": "I'm such an idiot, I always do this.", "severity_weight": 2 },
                { "text": "I'm a failure; I don't belong here.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mc_q3", "text": "I feel like I am fundamentally 'lesser' than the people around me...", "domain": "mood_critic", "subdomain": "social_comparison", "options": [
                { "text": "No, we are all just human.", "severity_weight": 0 },
                { "text": "Occasionally, when I'm tired.", "severity_weight": 1 },
                { "text": "Often; I feel like a fraud.", "severity_weight": 2 },
                { "text": "I am convinced I am a mistake.", "severity_weight": 3, "risk_weight": 2 }
            ], "insight_cloud": { "type": "clinical", "title": "The Super-Ego Attack", "text": "In psychoanalytic terms, a harsh 'critic' isn't you; it's an internalized collection of past judgments. Externalizing this voice is the first step toward reclaiming your sense of self.", "source_name": "Cognitive Shame Research" }
        },
        {
            "id": "mc_q4", "text": "My sense of guilt lately feels...", "domain": "mood_critic", "subdomain": "generalized_guilt", "options": [
                { "text": "Appropriate to my actions.", "severity_weight": 0 },
                { "text": "A bit higher than usual.", "severity_weight": 1 },
                { "text": "Heavy; I feel guilty for just existing.", "severity_weight": 2 },
                { "text": "Paralyzing; I am a 'bad' person.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mc_q5", "text": "Have you ever felt that the world would be 'lighter' without you?", "domain": "mood_critic", "subdomain": "perceived_burden", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Very rarely.", "severity_weight": 1 },
                { "text": "Sometimes.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "Frequently.", "severity_weight": 5, "risk_weight": 5 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 17, "bands": [
            { "range": [0, 4], "label": "self-accepting", "risk_category": "low" },
            { "range": [5, 8], "label": "self-critical", "risk_category": "low" },
            { "range": [9, 12], "label": "harshly judged", "risk_category": "medium" },
            { "range": [13, 17], "label": "shame-bound", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["mood_withdrawal"] = {
    "id": "mood_withdrawal",
    "title": "Emotional Withdrawal",
    "version": "1.0",
    "description": "Map the distance between you and your world. Discover if you are 'Self-Sufficient' or 'Socially Withdrawn'.",
    "primary_domain": "Mood & Depression",
    "context_tags": ["Family", "Romantic", "Expat", "Loneliness & Social Isolation"],
    "theme_color": "#334155",
    "questions": [
        {
            "id": "mw_q1", "text": "When my phone rings or I get a text, I feel...", "domain": "mood_withdrawal", "subdomain": "digital_reachability", "options": [
                { "text": "Curious and responsive.", "severity_weight": 0 },
                { "text": "A bit tired but I reply.", "severity_weight": 1 },
                { "text": "Dread; I leave it on silent for hours.", "severity_weight": 2 },
                { "text": "Like I want to throw the phone away and disappear.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mw_q2", "text": "In a social setting, I feel like...", "domain": "mood_withdrawal", "subdomain": "social_presence", "options": [
                { "text": "Connected to the room.", "severity_weight": 0 },
                { "text": "Part of things but quiet.", "severity_weight": 1 },
                { "text": "Behind a thick pane of glass.", "severity_weight": 2 },
                { "text": "Invisible or like a ghost.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mw_q3", "text": "I avoid making plans because...", "domain": "mood_withdrawal", "subdomain": "avoidance_logic", "options": [
                { "text": "I'm just genuinely busy.", "severity_weight": 0 },
                { "text": "I need some 'me' time.", "severity_weight": 1 },
                { "text": "I don't have the energy to 'perform'.", "severity_weight": 2 },
                { "text": "People are better off without me / I can't handle them.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Social Anhedonia", "text": "Social withdrawal is often a survival tactic for an overtaxed brain. By 'checking out', the brain tries to lower the amount of data it has to process. But long-term, this isolation feeds the fog.", "source_name": "UCLA Loneliness Metrics" }
        },
        {
            "id": "mw_q4", "text": "My physical contact with others (hugs, handshakes) feels...", "domain": "mood_withdrawal", "subdomain": "somatic_connection", "options": [
                { "text": "Comfortable and needed.", "severity_weight": 0 },
                { "text": "Okay.", "severity_weight": 1 },
                { "text": "Unnatural or distant.", "severity_weight": 2 },
                { "text": "I avoid all physical touch entirely.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mw_q5", "text": "Do you feel 'lonely' even when you are with other people?", "domain": "mood_withdrawal", "subdomain": "perceived_isolation", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "Yes, I am marooned in the middle of others.", "severity_weight": 3, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "connected", "risk_category": "low" },
            { "range": [4, 7], "label": "introverted", "risk_category": "low" },
            { "range": [8, 11], "label": "withdrawn", "risk_category": "medium" },
            { "range": [12, 15], "label": "isolated", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["mood_submerged"] = {
    "id": "mood_submerged",
    "title": "Submerged: The Weight of Being",
    "version": "1.0",
    "description": "Map the physical and mental sensation of being 'weighted down'. Discover the somatic drag behind your emotional lows.",
    "primary_domain": "Mood & Depression",
    "context_tags": ["Somatic", "Workplace", "Digital"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "ms_q1", "text": "Lately, my body feels like it's...", "domain": "mood_submerged", "subdomain": "somatic_gravity", "options": [
                { "text": "Light and energized.", "severity_weight": 0 },
                { "text": "Carrying a small backpack of bricks.", "severity_weight": 1 },
                { "text": "Moving through water up to my chest.", "severity_weight": 2 },
                { "text": "Pinned to the ground by an invisible weight.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "ms_q2", "text": "When the world gets loud or busy, I feel...", "domain": "mood_submerged", "subdomain": "sensory_overload", "options": [
                { "text": "Fully able to engage.", "severity_weight": 0 },
                { "text": "I need to tune out occasionally.", "severity_weight": 1 },
                { "text": "Muffled; like I'm hearing life through glass.", "severity_weight": 2 },
                { "text": "Completely disconnected; I am too deep inside to hear anything.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ms_q3", "text": "My ability to 'climb out' of a bad day is currently...", "domain": "mood_submerged", "subdomain": "affective_resilience", "options": [
                { "text": "Strong and reliable.", "severity_weight": 0 },
                { "text": "A bit slow but I get there.", "severity_weight": 1 },
                { "text": "Non-existent; I just have to wait for it to end.", "severity_weight": 2 },
                { "text": "I haven't been 'out' of it in weeks.", "severity_weight": 3, "functional_impairment": true }
            ], "insight_cloud": { "type": "clinical", "title": "Leadened Paralysis", "text": "In atypical depression journeys, 'Submerged' feelings are known as leadened paralysis. It's a physiological state where limbs feel heavy and moving takes immense cognitive effort.", "source_name": "Somatic Affect Research" }
        },
        {
            "id": "ms_q4", "text": "The simplest movements (brushing teeth, walking) feel...", "domain": "mood_submerged", "subdomain": "physical_effort", "options": [
                { "text": "Automatic and easy.", "severity_weight": 0 },
                { "text": "A little tedious.", "severity_weight": 1 },
                { "text": "Like a deliberate choice I have to force.", "severity_weight": 2 },
                { "text": "An exhausting uphill battle.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ms_q5", "text": "Do you feel like you are 'drowning' even when everything on the surface looks fine?", "domain": "mood_submerged", "subdomain": "subjective_distress", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am staying afloat with zero margin for error.", "severity_weight": 4, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 16, "bands": [
            { "range": [0, 4], "label": "buoyant", "risk_category": "low" },
            { "range": [5, 8], "label": "weighted", "risk_category": "low" },
            { "range": [9, 12], "label": "submerged", "risk_category": "medium" },
            { "range": [13, 16], "label": "marooned", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["mood_winter"] = {
    "id": "mood_winter",
    "title": "The Winter Palette",
    "version": "1.0",
    "description": "Map the influence of light and season on your mood. Identify the patterns of Seasonal Affect, grounded in SPAQ benchmarks.",
    "primary_domain": "Mood & Depression",
    "context_tags": ["Somatic", "Migration & Cultural Transition", "Expat"],
    "theme_color": "#cbd5e1",
    "questions": [
        {
            "id": "mw_q1", "text": "When the days get shorter or the sky stays grey, I feel...", "domain": "mood_winter", "subdomain": "light_sensitivity", "options": [
                { "text": "No change; I like the cozy weather.", "severity_weight": 0 },
                { "text": "A little more sleepy.", "severity_weight": 1 },
                { "text": "A noticeable drop in energy and mood.", "severity_weight": 2 },
                { "text": "Like my 'internal pilot light' has gone out.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mw_q2", "text": "My appetite during darker months usually...", "domain": "mood_winter", "subdomain": "appetite_swing", "options": [
                { "text": "Stays the same.", "severity_weight": 0 },
                { "text": "Changes slightly.", "severity_weight": 1 },
                { "text": "Increases significantly (craving carb-heavy foods).", "severity_weight": 2 },
                { "text": "Becomes uncontrollable or non-existent.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mw_q3", "text": "In the winter/grey months, my social life...", "domain": "mood_winter", "subdomain": "seasonal_withdrawal", "options": [
                { "text": "Remains active.", "severity_weight": 0 },
                { "text": "Slows down naturally.", "severity_weight": 1 },
                { "text": "Stops completely; I hibernate.", "severity_weight": 2 },
                { "text": "Feels like an impossible burden to maintain.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "fact", "title": "The Circadian Drift", "text": "Seasonal mood shifts aren't just 'the blues'. They are driven by Serotonin and Melatonin drifts as your brain tries to sync with decreasing sunlight. It is a biological adaptation gone into overdrive.", "source_name": "SPAQ Environmental Research" }
        },
        {
            "id": "mw_q4", "text": "My physical need for sleep in darker months is...", "domain": "mood_winter", "subdomain": "hypersomnia", "options": [
                { "text": "Normal (7-8 hours).", "severity_weight": 0 },
                { "text": "Slightly higher.", "severity_weight": 1 },
                { "text": "I need 10+ hours and still feel tired.", "severity_weight": 2 },
                { "text": "I can't seem to stay awake no matter how much I sleep.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mw_q5", "text": "Do you feel like you are 'waiting for spring' just to feel human again?", "domain": "mood_winter", "subdomain": "hope_horizon", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am just existing until the light returns.", "severity_weight": 3, "risk_weight": 2, "functional_impairment": true }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "steady", "risk_category": "low" },
            { "range": [4, 7], "label": "seasonal", "risk_category": "low" },
            { "range": [8, 11], "label": "hypersomnic", "risk_category": "medium" },
            { "range": [12, 15], "label": "hibernating", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["mood_resilience"] = {
    "id": "mood_resilience",
    "title": "The Resilience Baseline",
    "version": "1.0",
    "description": "Measure your 'Bounce-Back' speed. Discover the difference between mood stability and a brittle emotional baseline.",
    "primary_domain": "Mood & Depression",
    "context_tags": ["Workplace", "Performance", "Romantic", "Resilience"],
    "theme_color": "#0ea5e9",
    "questions": [
        {
            "id": "rb_q1", "text": "After a minor setback (e.g., a cold email rejection), I return to 'normal' in...", "domain": "mood_resilience", "subdomain": "recovery_latency", "options": [
                { "text": "A few minutes.", "severity_weight": 0 },
                { "text": "An hour or two.", "severity_weight": 1 },
                { "text": "The rest of the day is ruined.", "severity_weight": 2 },
                { "text": "Several days of low mood follow.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rb_q2", "text": "Regarding my inner strength, I feel...", "domain": "mood_resilience", "subdomain": "self_efficacy", "options": [
                { "text": "I can handle whatever comes.", "severity_weight": 0 },
                { "text": "I'm capable, but it's hard.", "severity_weight": 1 },
                { "text": "Like I'm walking on thin ice.", "severity_weight": 2 },
                { "text": "Brittle; one more thing will break me.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rb_q3", "text": "When I look back at past hardships, I feel...", "domain": "mood_resilience", "subdomain": "narrative_continuity", "options": [
                { "text": "They made me stronger.", "severity_weight": 0 },
                { "text": "Glad they're over.", "severity_weight": 1 },
                { "text": "Stunted or damaged by them.", "severity_weight": 2 },
                { "text": "They have fundamentally broken who I am.", "severity_weight": 3, "risk_weight": 2 }
            ], "insight_cloud": { "type": "clinical", "title": "Affective Durability", "text": "Resilience isn't about not feeling pain; it's about 'Affective Durability'—how quickly your nervous system can regulate back to its baseline after a surge.", "source_name": "Resilience Scale Metrics" }
        },
        {
            "id": "rb_q4", "text": "My supportive relationships feel like...", "domain": "mood_resilience", "subdomain": "social_scaffolding", "options": [
                { "text": "A strong safety net.", "severity_weight": 0 },
                { "text": "Occasionally helpful.", "severity_weight": 1 },
                { "text": "Too far away to reach.", "severity_weight": 2 },
                { "text": "I have no one to catch me.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rb_q5", "text": "Are you currently in a state where even a 'small win' doesn't help you feel better?", "domain": "mood_resilience", "subdomain": "reward_blindness", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am brittle and blind to reward.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "durable", "risk_category": "low" },
            { "range": [4, 7], "label": "strained", "risk_category": "low" },
            { "range": [8, 11], "label": "brittle", "risk_category": "medium" },
            { "range": [12, 15], "label": "fractured", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["mood_fragmented"] = {
    "id": "mood_fragmented",
    "title": "The Fragmented Mirror",
    "version": "1.0",
    "description": "Examine the continuity of your identity. Discover if your 'self' feels whole or fragmented during mood collapse.",
    "primary_domain": "Mood & Depression",
    "context_tags": ["Identity & Self-Concept", "Trauma & Nervous System"],
    "theme_color": "#6366f1",
    "questions": [
        {
            "id": "fm_q1", "text": "When I am in a deep low, the person I am when I'm 'okay' feels like...", "domain": "mood_fragmented", "subdomain": "identity_continuity", "options": [
                { "text": "Me, just having a hard time.", "severity_weight": 0 },
                { "text": "A cousin or a distant friend.", "severity_weight": 1 },
                { "text": "A total stranger / a fake version of me.", "severity_weight": 2 },
                { "text": "I honestly can't remember that person exists.", "severity_weight": 3 }
            ]
        },
        {
            "id": "fm_q2", "text": "My memories of the last few weeks feel...", "domain": "mood_fragmented", "subdomain": "narrative_fragmentation", "options": [
                { "text": "Clear and continuous.", "severity_weight": 0 },
                { "text": "A bit hazy.", "severity_weight": 1 },
                { "text": "Like a movie I watched but wasn't in.", "severity_weight": 2 },
                { "text": "Fragmented; there are gaps in my sense of time.", "severity_weight": 3 }
            ]
        },
        {
            "id": "fm_q3", "text": "I feel like I am several different 'people' inside me fighting for control...", "domain": "mood_fragmented", "subdomain": "internal_plurality", "options": [
                { "text": "No, just normal mood swings.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Often, and it's exhausting.", "severity_weight": 2 },
                { "text": "Yes, I am a collection of broken pieces.", "severity_weight": 3, "risk_weight": 2 }
            ], "insight_cloud": { "type": "clinical", "title": "Dissociative Depression", "text": "Depression can create a 'wall' in the mind. When we are low, our brain might disconnect from our 'High' self as a way to save energy. This is called Narrative Fragmentation.", "source_name": "Identity & Trauma Research" }
        },
        {
            "id": "fm_q4", "text": "When I speak to others, I feel like...", "domain": "mood_fragmented", "subdomain": "social_masking", "options": [
                { "text": "Authentic and real.", "severity_weight": 0 },
                { "text": "Polite but a bit tired.", "severity_weight": 1 },
                { "text": "Executing a script; I'm not really there.", "severity_weight": 2 },
                { "text": "Watching myself from a corner of the room.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "fm_q5", "text": "Do you feel like your 'center' has gone missing?", "domain": "mood_fragmented", "subdomain": "core_identity_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "Yes, there is no one 'home' at the center.", "severity_weight": 3, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "coherent", "risk_category": "low" },
            { "range": [4, 7], "label": "shifting", "risk_category": "low" },
            { "range": [8, 11], "label": "fragmented", "risk_category": "medium" },
            { "range": [12, 15], "label": "fractured", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["mood_shadows"] = {
    "id": "mood_shadows",
    "title": "The Shadow Self",
    "version": "1.0",
    "description": "Explore the suppressed emotions behind your lethargy. Discover if your 'Mood' is actually a shield for anger or grief.",
    "primary_domain": "Mood & Depression",
    "context_tags": ["Identity & Self-Concept", "Romantic", "Family"],
    "theme_color": "#111827",
    "questions": [
        {
            "id": "ms_q1", "text": "When I think about people who have hurt me, I feel...", "domain": "mood_shadows", "subdomain": "anger_displacement", "options": [
                { "text": "Appropriate anger or resolution.", "severity_weight": 0 },
                { "text": "Mild resentment.", "severity_weight": 1 },
                { "text": "Nothing; I'm just too tired to care.", "severity_weight": 2 },
                { "text": "Intense guilt; it was somehow my fault.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ms_q2", "text": "My 'sadness' often feels more like...", "domain": "mood_shadows", "subdomain": "affective_flavor", "options": [
                { "text": "Grief or sorrow.", "severity_weight": 0 },
                { "text": "Melancholy.", "severity_weight": 1 },
                { "text": "A 'cold' anger directed at myself.", "severity_weight": 2 },
                { "text": "A thick blanket with no emotion underneath.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ms_q3", "text": "I avoid expressing strong opinions because...", "domain": "mood_shadows", "subdomain": "suppression_logic", "options": [
                { "text": "I'm just a balanced person.", "severity_weight": 0 },
                { "text": "I don't want to start drama.", "severity_weight": 1 },
                { "text": "I'm afraid of what will happen if I start feeling correctly.", "severity_weight": 2 },
                { "text": "I feel I don't have the right to an opinion.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Anger Inward", "text": "Clinically, some forms of low mood are seen as 'Anger Inhaled'. Instead of the emotion going out toward the world, it turns inward and manifests as self-criticism and physical fatigue.", "source_name": "Psychodynamic Mood Frameworks" }
        },
        {
            "id": "ms_q4", "text": "Lately, my 'Shadow' (the parts of me I hide) feels...", "domain": "mood_shadows", "subdomain": "shadow_volume", "options": [
                { "text": "Integrated and small.", "severity_weight": 0 },
                { "text": "A bit restless.", "severity_weight": 1 },
                { "text": "Larger than my 'day' self.", "severity_weight": 2 },
                { "text": "Threatening to take over.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ms_q5", "text": "Do you feel like you are 'protecting' the world from your true feelings?", "domain": "mood_shadows", "subdomain": "protective_masking", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, all the time.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "integrated", "risk_category": "low" },
            { "range": [4, 7], "label": "guarded", "risk_category": "low" },
            { "range": [8, 11], "label": "shadowed", "risk_category": "medium" },
            { "range": [12, 15], "label": "eclipsed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["migration_language"] = {
    "id": "migration_language",
    "title": "The Language Echo",
    "version": "1.0",
    "description": "Assess the cognitive strain of living in a second or third language. Discover how translation fatigue impacts your identity.",
    "primary_domain": "Expats & Migration",
    "context_tags": ["Migration", "Identity", "Workplace"],
    "theme_color": "#0369a1",
    "questions": [
        {
            "id": "ml_q1", "text": "When speaking in my host country's language, I feel like...", "domain": "migration_language", "subdomain": "identity_translation", "options": [
                { "text": "My authentic self.", "severity_weight": 0 },
                { "text": "A slightly simpler version of myself.", "severity_weight": 1 },
                { "text": "An actor playing a role; I lose my humor and nuance.", "severity_weight": 2 },
                { "text": "A hollow shell; I cannot express anything real.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ml_q2", "text": "After a day of interacting in a non-native language, my brain feels...", "domain": "migration_language", "subdomain": "cognitive_fatigue", "options": [
                { "text": "Satisfied and growing.", "severity_weight": 0 },
                { "text": "A bit tired.", "severity_weight": 1 },
                { "text": "Sore; I have 'translation headaches'.", "severity_weight": 2 },
                { "text": "Completely shut down; I can't process even my mother tongue.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ml_q3", "text": "I avoid complex social situations (like parties or debates) because of the language effort...", "domain": "migration_language", "subdomain": "social_withdrawal", "options": [
                { "text": "Never; I love the challenge.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often; it's just too exhausting to keep up.", "severity_weight": 2 },
                { "text": "Always; I've become socially isolated because of it.", "severity_weight": 3, "functional_impairment": true }
            ], "insight_cloud": { "type": "clinical", "title": "Translation Fatigue", "text": "Your brain uses significantly more 'Executive Function' when speaking a non-native language. This isn't just a language skill issue; it's a metabolic drain that can lead to irritability and lower stress tolerance.", "source_name": "Linguistic Psychology Research" }
        },
        {
            "id": "ml_q4", "text": "When I make a mistake in the host language, I feel...", "domain": "migration_language", "subdomain": "performance_anxiety", "options": [
                { "text": "Fine; it's part of learning.", "severity_weight": 0 },
                { "text": "A bit embarrassed.", "severity_weight": 1 },
                { "text": "Incompetent or 'child-like'.", "severity_weight": 2 },
                { "text": "A deep sense of shame; I want to disappear.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ml_q5", "text": "Do you feel like you are 'losing' your vocabulary in your native language as well?", "domain": "migration_language", "subdomain": "linguistic_drift_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Yes, I feel 'homeless' between languages.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "I feel like I'm becoming mute in both worlds.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "fluent-self", "risk_category": "low" },
            { "range": [4, 7], "label": "translating", "risk_category": "low" },
            { "range": [8, 11], "label": "fatigued", "risk_category": "medium" },
            { "range": [12, 15], "label": "silenced", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["migration_culture"] = {
    "id": "migration_culture",
    "title": "Cultural Disorientation",
    "version": "1.0",
    "description": "Assess the 'Culture Shock' of your current environment. Discover if you are adjusted or just drifting.",
    "primary_domain": "Expats & Migration",
    "context_tags": ["Migration", "Identity", "Social"],
    "theme_color": "#b45309",
    "questions": [
        {
            "id": "mc_q1", "text": "Walking down the street in my host city, I feel...", "domain": "migration_culture", "subdomain": "environmental_alignment", "options": [
                { "text": "At home and comfortable.", "severity_weight": 0 },
                { "text": "Like a resident.", "severity_weight": 1 },
                { "text": "Like a tourist who hasn't left yet.", "severity_weight": 2 },
                { "text": "Like a ghost; I don't belong in this landscape.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mc_q2", "text": "The unwritten social rules of this country (manners, humor, pace) feel...", "domain": "migration_culture", "subdomain": "normative_friction", "options": [
                { "text": "Easy to follow.", "severity_weight": 0 },
                { "text": "A bit confusing, but I'm learning.", "severity_weight": 1 },
                { "text": "Exhausting; I'm always on guard for a faux pas.", "severity_weight": 2 },
                { "text": "Hostile; I feel like I'm constantly breaking invisible laws.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mc_q3", "text": "I find myself romanticizing my home country and ignoring its flaws...", "domain": "migration_culture", "subdomain": "rose_colored_memory", "options": [
                { "text": "No, I have a balanced view.", "severity_weight": 0 },
                { "text": "Occasionally, when I'm sad.", "severity_weight": 1 },
                { "text": "Often; everything was better there.", "severity_weight": 2 },
                { "text": "Constantly; my host country is a prison compared to 'Home'.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Cultural Mourning", "text": "Moving to a new culture involves 'unresolved grief'. You are mourning the loss of a thousand micro-stabilities (the smell of the air, the way people stand in line). It's a real psychological loss.", "source_name": "Acculturative Stress Frameworks" }
        },
        {
            "id": "mc_q4", "text": "My interaction with locals is...", "domain": "migration_culture", "subdomain": "social_integration", "options": [
                { "text": "Satisfying and real.", "severity_weight": 0 },
                { "text": "Functional.", "severity_weight": 1 },
                { "text": "Superficial; I have no real local friends.", "severity_weight": 2 },
                { "text": "Distant; I only talk to other expats/immigrants.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mc_q5", "text": "Do you feel like your 'values' are coming into direct conflict with your new society?", "domain": "migration_culture", "subdomain": "moral_drift_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often, and it hurts my integrity.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I feel like I'm losing my moral compass.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "integrated", "risk_category": "low" },
            { "range": [4, 7], "label": "adjusting", "risk_category": "low" },
            { "range": [8, 11], "label": "disoriented", "risk_category": "medium" },
            { "range": [12, 15], "label": "alienated", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["migration_nomad"] = {
    "id": "migration_nomad",
    "title": "The Digital Nomad's Echo",
    "version": "1.0",
    "description": "Assess the hidden cost of high mobility. Discover if your 'freedom' is becoming a source of clinical rootlessness.",
    "primary_domain": "Expats & Migration",
    "context_tags": ["Migration", "Digital", "Identity"],
    "theme_color": "#0ea5e9",
    "questions": [
        {
            "id": "mn_q1", "text": "The idea of staying in one city for more than a year feels...", "domain": "migration_nomad", "subdomain": "permanence_aversion", "options": [
                { "text": "Grounding and peaceful.", "severity_weight": 0 },
                { "text": "A bit boring.", "severity_weight": 1 },
                { "text": "Suffocating.", "severity_weight": 2 },
                { "text": "Terrifying; I feel the need to run.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mn_q2", "text": "My relationships (friends/romantic) usually last as long as...", "domain": "migration_nomad", "subdomain": "relationship_transience", "options": [
                { "text": "Indefinitely; distance doesn't stop me.", "severity_weight": 0 },
                { "text": "Longer than my lease.", "severity_weight": 1 },
                { "text": "As long as I'm in the same timezone.", "severity_weight": 2 },
                { "text": "I avoid deep bonds because I know I'll leave.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "mn_q3", "text": "When someone asks 'Where is home?', my first internal reaction is...", "domain": "migration_nomad", "subdomain": "identity_anchor", "options": [
                { "text": "A clear, single location.", "severity_weight": 0 },
                { "text": "A list of places.", "severity_weight": 1 },
                { "text": "Confusion; I don't have an answer.", "severity_weight": 2 },
                { "text": "Sadness; I have no place to go 'back' to.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Nomadic Loneliness", "text": "High mobility can lead to 'Social Desynchronization'. Even if you meet a lot of people, the lack of shared history and future with them can lead to a specific form of chronic loneliness that feels like 'Freedom' but acts like 'Depression'.", "source_name": "Modern Loneliness Studies" }
        },
        {
            "id": "mn_q4", "text": "My physical environment (apartment, desk) currently feels...", "domain": "migration_nomad", "subdomain": "somatic_rooting", "options": [
                { "text": "Personal and permanent.", "severity_weight": 0 },
                { "text": "Comfortable but transient.", "severity_weight": 1 },
                { "text": "Functional but totally sterile.", "severity_weight": 2 },
                { "text": "Like a prison I'm just passing through.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mn_q5", "text": "Do you feel like you are chasing 'the next place' to avoid processing internal pain?", "domain": "migration_nomad", "subdomain": "escape_ideation_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "I am in constant motion to stay ahead of a collapse.", "severity_weight": 3, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "explorer", "risk_category": "low" },
            { "range": [4, 7], "label": "transient", "risk_category": "low" },
            { "range": [8, 11], "label": "rootless", "risk_category": "medium" },
            { "range": [12, 15], "label": "unmoored", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["migration_suitcase"] = {
    "id": "migration_suitcase",
    "title": "The Suitcase Identity",
    "version": "1.0",
    "description": "Examine the psychological weight of instability. Discover if living out of a bag is thinning your sense of self.",
    "primary_domain": "Expats & Migration",
    "context_tags": ["Migration", "Somatic", "Identity"],
    "theme_color": "#71717a",
    "questions": [
        {
            "id": "ms_q1", "text": "When I see my packed bags or a moving box, I feel...", "domain": "migration_suitcase", "subdomain": "attachment_stress", "options": [
                { "text": "Excitement.", "severity_weight": 0 },
                { "text": "Pragmatic.", "severity_weight": 1 },
                { "text": "A heavy sense of exhaustion.", "severity_weight": 2 },
                { "text": "A physical nausea; I can't do this again.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ms_q2", "text": "I have items in my life that have stayed in boxes for over a year...", "domain": "migration_suitcase", "subdomain": "deferred_living", "options": [
                { "text": "No, I'm fully unpacked.", "severity_weight": 0 },
                { "text": "Just some seasonal stuff.", "severity_weight": 1 },
                { "text": "Significant parts of my life are still boxed.", "severity_weight": 2 },
                { "text": "Everything I own is ready to move in 10 minutes.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ms_q3", "text": "I feel like a 'temporary version' of myself until I find a permanent home...", "domain": "migration_suitcase", "subdomain": "provisional_identity", "options": [
                { "text": "No, I am me anywhere.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Significantly; I'm waiting for 'real life' to start.", "severity_weight": 2 },
                { "text": "Completely; I'm a placeholder person.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Provisional Life", "text": "The 'Suitcase Identity' leads to 'Deferred Living'—the belief that you don't need to take care of your health, relationships, or space because you are 'just passing through'. Your brain needs a 'Base' to regulate emotion.", "source_name": "Environmental Psychology Research" }
        },
        {
            "id": "ms_q4", "text": "My sense of safety depends on having an 'exit strategy' at all times...", "domain": "migration_suitcase", "subdomain": "security_logic", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "It's smart to be prepared.", "severity_weight": 1 },
                { "text": "I can't feel safe without a path out.", "severity_weight": 2 },
                { "text": "I'm always halfway out the door.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ms_q5", "text": "Do you feel like you are 'erasing' yourself to make moving easier?", "domain": "migration_suitcase", "subdomain": "minimization_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am down to almost nothing, including my personality.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "mobile", "risk_category": "low" },
            { "range": [4, 7], "label": "packed", "risk_category": "low" },
            { "range": [8, 11], "label": "placeholder", "risk_category": "medium" },
            { "range": [12, 15], "label": "vanishing", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["migration_isolation"] = {
    "id": "migration_isolation",
    "title": "The Relocation Anchor",
    "version": "1.0",
    "description": "Assess the 'Presence Gap' in your new life. Differentiate between 'Being Alone' and 'Systemic Isolation'.",
    "primary_domain": "Expats & Migration",
    "context_tags": ["Migration", "Social", "Identity"],
    "theme_color": "#1e40af",
    "questions": [
        {
            "id": "mi_q1", "text": "In my host country, there is someone who would know if I didn't come home tonight...", "domain": "migration_isolation", "subdomain": "safety_network", "options": [
                { "text": "Yes, several people.", "severity_weight": 0 },
                { "text": "Yes, maybe one person.", "severity_weight": 1 },
                { "text": "Probably not.", "severity_weight": 2 },
                { "text": "Absolutely no one.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mi_q2", "text": "When I succeed at something here, my first instinct is to...", "domain": "migration_isolation", "subdomain": "social_calibration", "options": [
                { "text": "Tell friends here in the city.", "severity_weight": 0 },
                { "text": "Call someone back home.", "severity_weight": 1 },
                { "text": "Keep it to myself; it doesn't feel 'real' here.", "severity_weight": 2 },
                { "text": "I don't have anyone to tell in either world.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mi_q3", "text": "I feel like I am a 'background character' in everyone else's lives here...", "domain": "migration_isolation", "subdomain": "perceived_visibility", "options": [
                { "text": "No, I'm a lead character.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Constantly; I am invisible to this city.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Social Atrophy", "text": "In a new country, we lose 'Spontaneous Interaction'—the casual 'Hello' from someone who knows you. This loss of 'Weak Ties' can be just as damaging as the loss of close family.", "source_name": "Sociology of Isolation" }
        },
        {
            "id": "mi_q4", "text": "Whenever I feel lonely, I go to digital spaces (social media/chats) as my primary cure...", "domain": "migration_isolation", "subdomain": "digital_dependency", "options": [
                { "text": "Occasionally.", "severity_weight": 0 },
                { "text": "Daily.", "severity_weight": 1 },
                { "text": "Compulsively; I live on my phone.", "severity_weight": 2 },
                { "text": "It's my only connection to reality.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mi_q5", "text": "Do you feel like you are physically here but your soul is permanently 'Offline'?", "domain": "migration_isolation", "subdomain": "dissociative_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a hollow body walking these streets.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "present", "risk_category": "low" },
            { "range": [4, 7], "label": "solitary", "risk_category": "low" },
            { "range": [8, 11], "label": "isolated", "risk_category": "medium" },
            { "range": [12, 15], "label": "ghosting", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["migration_distance"] = {
    "id": "migration_distance",
    "title": "Long Distance Gravity",
    "version": "1.0",
    "description": "Assess the strain of maintain life across borders. Discover if the 'Weight of Home' is pulling you apart.",
    "primary_domain": "Expats & Migration",
    "context_tags": ["Migration", "Family", "Romantic"],
    "theme_color": "#16a34a",
    "questions": [
        {
            "id": "md_q1", "text": "When I hang up a video call with people back home, I feel...", "domain": "migration_distance", "subdomain": "post_call_affect", "options": [
                { "text": "Connected and happy.", "severity_weight": 0 },
                { "text": "A bit wistful.", "severity_weight": 1 },
                { "text": "Deeply sad and lonely.", "severity_weight": 2 },
                { "text": "Shattered; I can't function for the rest of the day.", "severity_weight": 3 }
            ]
        },
        {
            "id": "md_q2", "text": "I feel like I'm 'living' in two timezones at once, and it's exhausting...", "domain": "migration_distance", "subdomain": "circadian_dissonance", "options": [
                { "text": "No, I'm synchronized here.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2 },
                { "text": "Completely; my body is here, but my clock is 'home'.", "severity_weight": 3 }
            ]
        },
        {
            "id": "md_q3", "text": "I prioritize calls/messages from home over local social opportunities...", "domain": "migration_distance", "subdomain": "social_displacement", "options": [
                { "text": "Never; I have a healthy balance.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Always; my local life doesn't exist.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Ambidextrous Living", "text": "Maintaining deep emotional ties across thousands of miles creates 'Cognitive Load'. Your brain is constantly 'simulating' a life you aren't physically in. This can lead to 'Displaced Grief'—mourning events you weren't there for.", "source_name": "Transnational Psychology" }
        },
        {
            "id": "md_q4", "text": "My family/friends back home rely on me for support, and it feels...", "domain": "migration_distance", "subdomain": "remote_responsibility", "options": [
                { "text": "Like a privilege.", "severity_weight": 0 },
                { "text": "Normal.", "severity_weight": 1 },
                { "text": "Heavy and stressful.", "severity_weight": 2 },
                { "text": "Suffocating; I am failing them from a distance.", "severity_weight": 3 }
            ]
        },
        {
            "id": "md_q5", "text": "Do you find yourself 'hiding' your struggles here so you don't worry them back home?", "domain": "migration_distance", "subdomain": "deceptive_shielding_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a different, fake person on every call.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "connected", "risk_category": "low" },
            { "range": [4, 7], "label": "wistful", "risk_category": "low" },
            { "range": [8, 11], "label": "pulled", "risk_category": "medium" },
            { "range": [12, 15], "label": "fractured", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["migration_career"] = {
    "id": "migration_career",
    "title": "The Professional Glass Ceiling",
    "version": "1.0",
    "description": "Assess the impact of relocation on your professional identity. Discover if your 'New Start' is a climb or a standstill.",
    "primary_domain": "Expats & Migration",
    "context_tags": ["Migration", "Workplace", "Identity"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "mc_q1", "text": "My current job title compared to my one back home feels like...", "domain": "migration_career", "subdomain": "status_displacement", "options": [
                { "text": "A step up or forward.", "severity_weight": 0 },
                { "text": "A lateral move.", "severity_weight": 1 },
                { "text": "A significant step down.", "severity_weight": 2 },
                { "text": "Humiliating; I feel overqualified and invisible.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mc_q2", "text": "At work, I feel that my 'accent' or 'background' is...", "domain": "migration_career", "subdomain": "perceived_bias", "options": [
                { "text": "An asset.", "severity_weight": 0 },
                { "text": "A non-factor.", "severity_weight": 1 },
                { "text": "A barrier to progression.", "severity_weight": 2 },
                { "text": "A reason I am being actively sidelined.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mc_q3", "text": "I feel I have to work 2x harder than locals to receive the same recognition...", "domain": "migration_career", "subdomain": "effort_dissonance", "options": [
                { "text": "No, it's fair here.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Constantly; the expectations are crushing.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Career Re-Entry Stress", "text": "Relocating often leads to 'Professional De-Skilling'—the loss of social capital and networks. This can trigger a 'Second Adolescence' where you have to prove yourself all over again, leading to intense frustration and imposter syndrome.", "source_name": "Occupational Migration Research" }
        },
        {
            "id": "mc_q4", "text": "My professional future in this country feels...", "domain": "migration_career", "subdomain": "future_security", "options": [
                { "text": "Bright and stable.", "severity_weight": 0 },
                { "text": "Uncertain but hopeful.", "severity_weight": 1 },
                { "text": "Bleak; I'm just surviving.", "severity_weight": 2 },
                { "text": "Non-existent; I am just a cog.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mc_q5", "text": "Do you find yourself regretting your move because of the career 'hit' you took?", "domain": "migration_career", "subdomain": "regret_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Daily; it's all I think about.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "pioneer", "risk_category": "low" },
            { "range": [4, 7], "label": "striving", "risk_category": "low" },
            { "range": [8, 11], "label": "blocked", "risk_category": "medium" },
            { "range": [12, 15], "label": "stagnant", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["migration_drift"] = {
    "id": "migration_drift",
    "title": "Identity Drift: Neither Here nor There",
    "version": "1.0",
    "description": "Assess the 'Grey Zone' of migration. Discover if you are losing your old identity without gaining a new one.",
    "primary_domain": "Expats & Migration",
    "context_tags": ["Migration", "Identity", "Family"],
    "theme_color": "#475569",
    "questions": [
        {
            "id": "md_q1", "text": "When I visit my home country, I feel...", "domain": "migration_drift", "subdomain": "return_affect", "options": [
                { "text": "Like I never left.", "severity_weight": 0 },
                { "text": "A bit different, but fine.", "severity_weight": 1 },
                { "text": "Like a foreigner in my own hometown.", "severity_weight": 2 },
                { "text": "Total alienation; I don't fit there either.", "severity_weight": 3 }
            ]
        },
        {
            "id": "md_q2", "text": "My 'True Identity' currently feels...", "domain": "migration_drift", "subdomain": "self_perception", "options": [
                { "text": "Solid and integrated.", "severity_weight": 0 },
                { "text": "Shifting.", "severity_weight": 1 },
                { "text": "Fragmented into 'Home Me' and 'Host Me'.", "severity_weight": 2 },
                { "text": "Gone; I am a ghost in both places.", "severity_weight": 3 }
            ]
        },
        {
            "id": "md_q3", "text": "I feel like I'm 'performing' my culture for the locals here...", "domain": "migration_drift", "subdomain": "performative_identity", "options": [
                { "text": "No, I just live.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often; I've become a stereotype of my home.", "severity_weight": 2 },
                { "text": "Always; I have to act 'Ethnic' to be understood.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Bicultural Fatigue", "text": "Migrants often inhabit a 'Third Space'—a psychological zone where they are neither the person they were nor the person they are 'supposed' to be in the host country. This drift is a natural part of growth, not a failure of loyalty.", "source_name": "Post-Colonial Identity Theory" }
        },
        {
            "id": "md_q4", "text": "The phrase 'I want to go home' for me means...", "domain": "migration_drift", "subdomain": "home_concept", "options": [
                { "text": "A specific house/city.", "severity_weight": 0 },
                { "text": "A person or feeling.", "severity_weight": 1 },
                { "text": "Nowhere; I don't know where that is.", "severity_weight": 2 },
                { "text": "A past that doesn't exist anymore.", "severity_weight": 3 }
            ]
        },
        {
            "id": "md_q5", "text": "Do you feel like you are 'erasing' your past to fit in, and it's making you hollow?", "domain": "migration_drift", "subdomain": "assimilation_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Yes, I'm losing my roots.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a blank slate with no history.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "integrated", "risk_category": "low" },
            { "range": [4, 7], "label": "shifting", "risk_category": "low" },
            { "range": [8, 11], "label": "drifting", "risk_category": "medium" },
            { "range": [12, 15], "label": "liminal", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["migration_bureaucracy"] = {
    "id": "migration_bureaucracy",
    "title": "The Bureaucratic Shadow",
    "version": "1.0",
    "description": "Assess the mental cost of legal status. Discover if paperwork and 'The System' are eroding your mental health.",
    "primary_domain": "Expats & Migration",
    "context_tags": ["Migration", "Identity", "Workplace"],
    "theme_color": "#52525b",
    "questions": [
        {
            "id": "mb_q1", "text": "Receiving an official envelope or email from the host government feels like...", "domain": "migration_bureaucracy", "subdomain": "official_anxiety", "options": [
                { "text": "Standard admin.", "severity_weight": 0 },
                { "text": "A minor annoyance.", "severity_weight": 1 },
                { "text": "A heart-stopping moment of fear.", "severity_weight": 2 },
                { "text": "A trigger for a full panic attack.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mb_q2", "text": "My sense of 'belonging' is tied to the validity date of my visa/permit...", "domain": "migration_bureaucracy", "subdomain": "status_identity", "options": [
                { "text": "No, I am permanent.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Significantly; I am a 'date on a paper'.", "severity_weight": 2 },
                { "text": "Completely; I don't feel like a person, just a file.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mb_q3", "text": "I avoid long-term plans (investment, pets, relationships) because of status uncertainty...", "domain": "migration_bureaucracy", "subdomain": "future_paralysis", "options": [
                { "text": "No, I live fully.", "severity_weight": 0 },
                { "text": "I'm a bit cautious.", "severity_weight": 1 },
                { "text": "Often; I'm in 'Wait Mode' indefinitely.", "severity_weight": 2 },
                { "text": "Always; I haven't started my 'real' life because of paperwork.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Paperwork Trauma", "text": "Constant bureaucratic scrutiny creates 'Chronic Low-Grade Dread'. Even if your status is legal, the 'Need to Prove' your right to exist can lead to hyper-vigilance and a lack of 'Environmental Safety'.", "source_name": "Socio-Legal Psychology" }
        },
        {
            "id": "mb_q4", "text": "Interacting with immigration/legal officials feels like...", "domain": "migration_bureaucracy", "subdomain": "authority_relatability", "options": [
                { "text": "A professional interaction.", "severity_weight": 0 },
                { "text": "Intimidating.", "severity_weight": 1 },
                { "text": "Like I am an intruder being tolerated.", "severity_weight": 2 },
                { "text": "Like I am a criminal being interrogated.", "severity_weight": 3 }
            ]
        },
        {
            "id": "mb_q5", "text": "Do you feel like 'The System' is intentionally trying to break your spirit?", "domain": "migration_bureaucracy", "subdomain": "systemic_adversity_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often, it feels hostile.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am being ground down by design.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "settled", "risk_category": "low" },
            { "range": [4, 7], "label": "status-aware", "risk_category": "low" },
            { "range": [8, 11], "label": "limbo-bound", "risk_category": "medium" },
            { "range": [12, 15], "label": "oppressed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["migration_returner"] = {
    "id": "migration_returner",
    "title": "The Returner's Paradox",
    "version": "1.0",
    "description": "Assess the 'Reverse Culture Shock' of going back. Discover if your 'Home' has become a strange land.",
    "primary_domain": "Expats & Migration",
    "context_tags": ["Migration", "Identity", "Family"],
    "theme_color": "#991b1b",
    "questions": [
        {
            "id": "rp_q1", "text": "When people at home ask me 'How was it?', I feel...", "domain": "migration_returner", "subdomain": "narrative_dissonance", "options": [
                { "text": "Happy to share my stories.", "severity_weight": 0 },
                { "text": "Like they don't really want the long answer.", "severity_weight": 1 },
                { "text": "Like I'm speaking a language they don't know.", "severity_weight": 2 },
                { "text": "Mute; there is no way to bridge the gap.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rp_q2", "text": "The daily habits of my home country now feel...", "domain": "migration_returner", "subdomain": "normative_rejection", "options": [
                { "text": "Comforting and familiar.", "severity_weight": 0 },
                { "text": "A little odd.", "severity_weight": 1 },
                { "text": "Annoying and inefficient.", "severity_weight": 2 },
                { "text": "Alien and repulsive; I can't live like this again.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rp_q3", "text": "I find myself looking for flights 'back' to my host country even though I'm 'home'...", "domain": "migration_returner", "subdomain": "displaced_longing", "options": [
                { "text": "No, I'm glad to be back.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Daily.", "severity_weight": 2 },
                { "text": "I feel like a prisoner here; I have to leave.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Reverse Culture Shock", "text": "Coming home is often harder than leaving. When you move away, you expect change. When you return, you expect 'The Same', but both you and the place have changed. The collision of these expectations causes the paradox.", "source_name": "Re-Entry Research" }
        },
        {
            "id": "rp_q4", "text": "My friends at home feel...", "domain": "migration_returner", "subdomain": "social_calibration", "options": [
                { "text": "Like they've always been.", "severity_weight": 0 },
                { "text": "A bit 'behind' in life.", "severity_weight": 1 },
                { "text": "Boring or narrow-minded.", "severity_weight": 2 },
                { "text": "Like strangers I used to know.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rp_q5", "text": "Do you feel like you are 'trapped' in a past version of yourself when you're home?", "domain": "migration_returner", "subdomain": "identity_regression_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am being suffocated by my own history.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "returned", "risk_category": "low" },
            { "range": [4, 7], "label": "re-adjusting", "risk_category": "low" },
            { "range": [8, 11], "label": "mismatched", "risk_category": "medium" },
            { "range": [12, 15], "label": "trapped", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["relationship_attachment"] = {
    "id": "relationship_attachment",
    "title": "The Attachment Anchor",
    "version": "1.0",
    "description": "Assess your deep-seated attachment style. Discover how your 'Internal Working Model' shapes your reaction to intimacy.",
    "primary_domain": "Relationship & Intimacy",
    "context_tags": ["Relationship", "Identity", "Family"],
    "theme_color": "#db2777",
    "questions": [
        {
            "id": "ra_q1", "text": "When a partner or close friend is emotionally available and supportive, I feel...", "domain": "relationship_attachment", "subdomain": "security_baseline", "options": [
                { "text": "Safe and deserving of it.", "severity_weight": 0 },
                { "text": "Happy, but waiting for it to end.", "severity_weight": 1 },
                { "text": "Uncomfortable; I don't know how to handle it.", "severity_weight": 2 },
                { "text": "Suspicious; I feel they want something from me.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ra_q2", "text": "In conflict, my primary fear is...", "domain": "relationship_attachment", "subdomain": "attachment_fear", "options": [
                { "text": "That we won't solve the specific problem.", "severity_weight": 0 },
                { "text": "That they are mad at me.", "severity_weight": 1 },
                { "text": "That they will leave me if I speak up.", "severity_weight": 2 },
                { "text": "That I will be trapped or controlled.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ra_q3", "text": "I find that I 'test' people's loyalty by pulling away or acting out...", "domain": "relationship_attachment", "subdomain": "distancing_logic", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often; I need to see if they'll chase me.", "severity_weight": 2 },
                { "text": "Constantly; it's the only way I feel safe.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Attachment Styles", "text": "Attachment isn't just about 'clinging' or 'running'. It's your brain's learned strategy for survival. Shifting from Anxious or Avoidant to 'Earned Secure' is possible through consistent, safe interactions.", "source_name": "Bowlby & Ainsworth Frameworks" }
        },
        {
            "id": "ra_q4", "text": "When I am single or alone, my sense of 'self' feels...", "domain": "relationship_attachment", "subdomain": "autonomy_balance", "options": [
                { "text": "Whole and capable.", "severity_weight": 0 },
                { "text": "A bit lonely but okay.", "severity_weight": 1 },
                { "text": "Fragile; I need someone to mirror me.", "severity_weight": 2 },
                { "text": "Non-existent; I am only 'real' in a relationship.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ra_q5", "text": "Do you feel like you are repeating the exact same 'relationship plot' with different people?", "domain": "relationship_attachment", "subdomain": "repetition_compulsion_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Yes, I'm stuck in a loop.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, and it's destroying my life.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "secure", "risk_category": "low" },
            { "range": [4, 7], "label": "preoccupied", "risk_category": "low" },
            { "range": [8, 11], "label": "avoidant", "risk_category": "medium" },
            { "range": [12, 15], "label": "disorganized", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["relationship_gap"] = {
    "id": "relationship_gap",
    "title": "The Connection Gap",
    "version": "1.0",
    "description": "Assess the 'Silent Distance' in your primary relationship. Discover if you are 'Alone Together'.",
    "primary_domain": "Relationship & Intimacy",
    "context_tags": ["Relationship", "Social", "Somatic"],
    "theme_color": "#9f1239",
    "questions": [
        {
            "id": "rg_q1", "text": "When we are in the same room but not talking, the silence feels...", "domain": "relationship_gap", "subdomain": "silence_affect", "options": [
                { "text": "Comfortable and safe.", "severity_weight": 0 },
                { "text": "A bit heavy.", "severity_weight": 1 },
                { "text": "Awkward or strained.", "severity_weight": 2 },
                { "text": "Hostile or ice-cold.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rg_q2", "text": "I feel that my partner/friend knows the 'Real Me' currently...", "domain": "relationship_gap", "subdomain": "perceived_intimacy", "options": [
                { "text": "Completely.", "severity_weight": 0 },
                { "text": "Mostly.", "severity_weight": 1 },
                { "text": "They only know a version of me.", "severity_weight": 2 },
                { "text": "They haven't seen the real me in months/years.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rg_q3", "text": "I hide my true feelings or stress to avoid disappointment or conflict...", "domain": "relationship_gap", "subdomain": "safety_masking", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often; it's easier to be quiet.", "severity_weight": 2 },
                { "text": "Always; I'm a ghost in my own relationship.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Emotional Ghosting", "text": "You can be physically present but emotionally 'ghosted'. This gap is often caused by 'Conflict Avoidance'—the idea that keeping the peace is more important than being known. True intimacy requires the friction of truth.", "source_name": "Gottman Core Principles" }
        },
        {
            "id": "rg_q4", "text": "Our sexual or physical intimacy feels...", "domain": "relationship_gap", "subdomain": "somatic_connection", "options": [
                { "text": "Connected and fulfilling.", "severity_weight": 0 },
                { "text": "Functional.", "severity_weight": 1 },
                { "text": "Distant or performative.", "severity_weight": 2 },
                { "text": "Non-existent or painful.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rg_q5", "text": "Do you feel more 'lonely' when you are with them than when you are actually alone?", "domain": "relationship_gap", "subdomain": "isolation_paradox_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Constantly.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "connected", "risk_category": "low" },
            { "range": [4, 7], "label": "drifting", "risk_category": "low" },
            { "range": [8, 11], "label": "gapping", "risk_category": "medium" },
            { "range": [12, 15], "label": "estranged", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["relationship_friction"] = {
    "id": "relationship_friction",
    "title": "The Friction Point",
    "version": "1.0",
    "description": "Assess the 'Heat' of your conflicts. Discover if your arguments are a forge or a fire.",
    "primary_domain": "Relationship & Intimacy",
    "context_tags": ["Relationship", "Identity", "Social"],
    "theme_color": "#dc2626",
    "questions": [
        {
            "id": "rf_q1", "text": "During an argument, my primary goal becomes...", "domain": "relationship_friction", "subdomain": "conflict_objective", "options": [
                { "text": "Finding a solution.", "severity_weight": 0 },
                { "text": "Explaining my side.", "severity_weight": 1 },
                { "text": "Being 'Right'.", "severity_weight": 2 },
                { "text": "Making them feel as hurt as I am.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rf_q2", "text": "Our conflicts usually resolve by...", "domain": "relationship_friction", "subdomain": "resolution_style", "options": [
                { "text": "Compromise and repair.", "severity_weight": 0 },
                { "text": "One person giving in.", "severity_weight": 1 },
                { "text": "The 'Silent Treatment' until it blows over.", "severity_weight": 2 },
                { "text": "They never resolve; they just pile up.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "rf_q3", "text": "I find myself bringing up mistakes from years ago during a simple argument...", "domain": "relationship_friction", "subdomain": "historical_weaponization", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often; it's the only leverage I have.", "severity_weight": 2 },
                { "text": "Always; our relationship is a court case.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Kitchen Sinking", "text": "Bringing up everything including the 'Kitchen Sink' during an argument prevents resolution. It's a sign that 'Emotional Storage' is full. Focus on 'One Issue at a Time' to keep the friction productive.", "source_name": "Conflict Resolution Protocols" }
        },
        {
            "id": "rf_q4", "text": "The feeling after an argument is usually...", "domain": "relationship_friction", "subdomain": "post_conflict_affect", "options": [
                { "text": "Relief and closeness.", "severity_weight": 0 },
                { "text": "Tiredness.", "severity_weight": 1 },
                { "text": "Resentment and coldness.", "severity_weight": 2 },
                { "text": "Fear and instability.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rf_q5", "text": "Do you feel like you are 'walking on eggshells' every single day?", "domain": "relationship_friction", "subdomain": "safety_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Yes, I am terrified of a blow-up.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "Yes, I live in constant fear of my partner.", "severity_weight": 3, "risk_weight": 4 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "constructive", "risk_category": "low" },
            { "range": [4, 7], "label": "heated", "risk_category": "low" },
            { "range": [8, 11], "label": "abrasive", "risk_category": "medium" },
            { "range": [12, 15], "label": "volatile", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["relationship_loyalty"] = {
    "id": "relationship_loyalty",
    "title": "The Loyalty Ledger",
    "version": "1.0",
    "description": "Assess the 'Trade-Offs' of your commitment. Discover if you are staying out of love or out of debt.",
    "primary_domain": "Relationship & Intimacy",
    "context_tags": ["Relationship", "Identity", "Family"],
    "theme_color": "#4d7c0f",
    "questions": [
        {
            "id": "rl_q1", "text": "I stay in my relationship primarily because...", "domain": "relationship_loyalty", "subdomain": "commitment_driver", "options": [
                { "text": "I love being with them.", "severity_weight": 0 },
                { "text": "We have history.", "severity_weight": 1 },
                { "text": "I owe it to them/the kids/family.", "severity_weight": 2 },
                { "text": "I can't survive financially/socially without it.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rl_q2", "text": "The idea of leaving feels like...", "domain": "relationship_loyalty", "subdomain": "exit_concept", "options": [
                { "text": "A sad possibility.", "severity_weight": 0 },
                { "text": "A complicated logistics puzzle.", "severity_weight": 1 },
                { "text": "A betrayal of my character.", "severity_weight": 2 },
                { "text": "An unthinkable sin I'd never forgive myself for.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rl_q3", "text": "I find myself 'keeping score' of all the things I've sacrificed for them...", "domain": "relationship_loyalty", "subdomain": "transactional_logic", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often; the debt is high.", "severity_weight": 2 },
                { "text": "Always; I am a martyr in this relationship.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Commitment vs. Debt", "text": "Healthy loyalty is a 'Gift'. Unhealthy loyalty is a 'Debt'. If you are staying solely because you 'Owe' someone, you are inhabitng a 'Contract', not a 'Connection'. Real repair starts with releasing the score-card.", "source_name": "Systemic Family Therapy" }
        },
        {
            "id": "rl_q4", "text": "My partner's growth or change feels...", "domain": "relationship_loyalty", "subdomain": "adaptability", "options": [
                { "text": "Exciting.", "severity_weight": 0 },
                { "text": "A bit destabilizing.", "severity_weight": 1 },
                { "text": "Like a threat to our 'deal'.", "severity_weight": 2 },
                { "text": "Like they are abandoning the person I bought into.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rl_q5", "text": "Do you feel like you are 'paying' for a mistake you made years ago with your current silence?", "domain": "relationship_loyalty", "subdomain": "guilt_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Yes, I am in emotional jail.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I gave up my soul as payment.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "devoted", "risk_category": "low" },
            { "range": [4, 7], "label": "committed", "risk_category": "low" },
            { "range": [8, 11], "label": "indebted", "risk_category": "medium" },
            { "range": [12, 15], "label": "trapped", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["relationship_trust"] = {
    "id": "relationship_trust",
    "title": "The Trust Architecture",
    "version": "1.0",
    "description": "Audit the 'Safety' of your bond. Discover if your trust is a solid floor or a thin wire.",
    "primary_domain": "Relationship & Intimacy",
    "context_tags": ["Relationship", "Identity", "Digital"],
    "theme_color": "#0ea5e9",
    "questions": [
        {
            "id": "rt_q1", "text": "When my partner/friend says they'll do something, I feel...", "domain": "relationship_trust", "subdomain": "predictability", "options": [
                { "text": "Certain they will do it.", "severity_weight": 0 },
                { "text": "Hopeful.", "severity_weight": 1 },
                { "text": "Like I have to remind them 5 times.", "severity_weight": 2 },
                { "text": "Certain they will let me down again.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rt_q2", "text": "I feel the need to check their phone or location to 'feel safe'...", "domain": "relationship_trust", "subdomain": "surveillance_logic", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely, during high stress.", "severity_weight": 1 },
                { "text": "Often; it's the only way I know the truth.", "severity_weight": 2 },
                { "text": "I'm always monitoring them; I am a private investigator.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "rt_q3", "text": "I hide 'small' things because I'm afraid of their overreaction...", "domain": "relationship_trust", "subdomain": "deceptive_shielding", "options": [
                { "text": "No, we are transparent.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently; it's self-preservation.", "severity_weight": 2 },
                { "text": "Always; I live a double life.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Trust Battery", "text": "Trust isn't a single 'Yes/No' switch. It's a battery that is charged by 'Micro-Agreements'. Every time you do what you said you'd do, the battery charges. Lying about 'small' things drains it faster than a single 'big' betrayal.", "source_name": "Trust Recovery Frameworks" }
        },
        {
            "id": "rt_q4", "text": "When I am in a crisis, I turn to them...", "domain": "relationship_trust", "subdomain": "reliability", "options": [
                { "text": "First and immediately.", "severity_weight": 0 },
                { "text": "Eventually.", "severity_weight": 1 },
                { "text": "Only if I have no other choice.", "severity_weight": 2 },
                { "text": "Never; it would only make it worse.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rt_q5", "text": "Has there been a major betrayal that has never been truly healed?", "domain": "relationship_trust", "subdomain": "trauma_echo_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "It's a work in progress.", "severity_weight": 1 },
                { "text": "Yes, we just ignore it now.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "Yes, and I am poisoned by it daily.", "severity_weight": 3, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "trusted", "risk_category": "low" },
            { "range": [4, 7], "label": "shaky", "risk_category": "low" },
            { "range": [8, 11], "label": "eroded", "risk_category": "medium" },
            { "range": [12, 15], "label": "broken", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["relationship_pleaser"] = {
    "id": "relationship_pleaser",
    "title": "The People Pleaser Audit",
    "version": "1.0",
    "description": "Assess the cost of your 'Niceness'. Discover if your kindness is a choice or a survival tactic.",
    "primary_domain": "Relationship & Intimacy",
    "context_tags": ["Relationship", "Identity", "Social"],
    "theme_color": "#10b981",
    "questions": [
        {
            "id": "pp_q1", "text": "When someone asks for a favor I don't want to do, my first reply is...", "domain": "relationship_pleaser", "subdomain": "boundary_initial_response", "options": [
                { "text": "A polite 'No'.", "severity_weight": 0 },
                { "text": "A hesitant 'Maybe'.", "severity_weight": 1 },
                { "text": "A quick 'Yes' followed by immense regret.", "severity_weight": 2 },
                { "text": "A desperate 'Yes' because their disappointment feels fatal.", "severity_weight": 3 }
            ]
        },
        {
            "id": "pp_q2", "text": "I feel that if I stop being 'Useful', people will...", "domain": "relationship_pleaser", "subdomain": "worth_attachment", "options": [
                { "text": "Still love me for who I am.", "severity_weight": 0 },
                { "text": "Be a bit surprised.", "severity_weight": 1 },
                { "text": "Slowly disappear.", "severity_weight": 2 },
                { "text": "Instantly abandon me.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "pp_q3", "text": "I apologize even for things that aren't my fault to 'calm the room'...", "domain": "relationship_pleaser", "subdomain": "appeasement_logic", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently; it's a reflex.", "severity_weight": 2 },
                { "text": "Constantly; my first word is always 'Sorry'.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Fawning Response", "text": "People-pleasing is often a 'Fawn' response—a survival strategy for people who grew up in unpredictable environments. You aren't 'Too Nice'; you are 'Too Scared'. Reclaiming your 'No' is reclaiming your safety.", "source_name": "Nervous System Regulation Frameworks" }
        },
        {
            "id": "pp_q4", "text": "My 'True Opinion' on most things is...", "domain": "relationship_pleaser", "subdomain": "authenticity_gap", "options": [
                { "text": "Expressed clearly.", "severity_weight": 0 },
                { "text": "Softened to match the listener.", "severity_weight": 1 },
                { "text": "Hidden entirely.", "severity_weight": 2 },
                { "text": "I honestly don't know what I think anymore.", "severity_weight": 3 }
            ]
        },
        {
            "id": "pp_q5", "text": "Do you feel like you are a 'supporting character' even in your own life STORY?", "domain": "relationship_pleaser", "subdomain": "identity_vanishing_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Yes, I am a placeholder for others' needs.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I have no self remaining.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "authentic", "risk_category": "low" },
            { "range": [4, 7], "label": "harmonizer", "risk_category": "low" },
            { "range": [8, 11], "label": "pleaser", "risk_category": "medium" },
            { "range": [12, 15], "label": "vanishing", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["relationship_echoes"] = {
    "id": "relationship_echoes",
    "title": "Past Echoes: Relationship Ghosts",
    "version": "1.0",
    "description": "Assess the 'Trauma Echoes' from past dynamcs. Discover if your exes are still writing the script for your current relationships.",
    "primary_domain": "Relationship & Intimacy",
    "context_tags": ["Relationship", "Identity", "Trauma"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "re_q1", "text": "When my current partner/friend makes a mistake, I react as if...", "domain": "relationship_echoes", "subdomain": "transference_affect", "options": [
                { "text": "It's an isolated event.", "severity_weight": 0 },
                { "text": "It's annoying.", "severity_weight": 1 },
                { "text": "It's the start of a pattern I've seen before.", "severity_weight": 2 },
                { "text": "It's a lethal betrayal from my past and I explode/shut down.", "severity_weight": 3 }
            ]
        },
        {
            "id": "re_q2", "text": "I feel the need to 'protect' myself from my current person because of what my 'old' person did...", "domain": "relationship_echoes", "subdomain": "protective_generalization", "options": [
                { "text": "No, I've healed.", "severity_weight": 0 },
                { "text": "A little bit of caution is good.", "severity_weight": 1 },
                { "text": "Significantly; I am always waiting for the 'old' pain to return.", "severity_weight": 2 },
                { "text": "Completely; I treat my current person like my old enemy.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "re_q3", "text": "I find myself looking for 'clues' that history is repeating itself...", "domain": "relationship_echoes", "subdomain": "hypervigilance_echo", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often; it's self-preservation.", "severity_weight": 2 },
                { "text": "I scan every word and look for betrayal.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Relationship PTSD", "text": "The brain doesn't know dates. If a past person hurt you, your nervous system might treat your current safe person as a threat. This is called 'Transference'. Healing requires teaching your body that 'This is Now' and 'That was Then'.", "source_name": "Integrative Trauma Research" }
        },
        {
            "id": "re_q4", "text": "The idea of fully trusting someone again feels...", "domain": "relationship_echoes", "subdomain": "trust_capacity", "options": [
                { "text": "Fulfilling.", "severity_weight": 0 },
                { "text": "Dangerous.", "severity_weight": 1 },
                { "text": "Impossible.", "severity_weight": 2 },
                { "text": "Naïve and stupid.", "severity_weight": 3 }
            ]
        },
        {
            "id": "re_q5", "text": "Are you sabotaging your current happiness because it feels too 'different' from your painful past?", "domain": "relationship_echoes", "subdomain": "sabotage_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Maybe subconsciously.", "severity_weight": 1 },
                { "text": "Yes, I ruin good things to feel 'safe' in familiar pain.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "Yes, I am a professional destroyer of my own peace.", "severity_weight": 3, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "present", "risk_category": "low" },
            { "range": [4, 7], "label": "haunted", "risk_category": "low" },
            { "range": [8, 11], "label": "recurrent", "risk_category": "medium" },
            { "range": [12, 15], "label": "eclipsed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["relationship_breakup"] = {
    "id": "relationship_breakup",
    "title": "The Breakup Fallout",
    "version": "1.0",
    "description": "Assess the impact of recent loss. Differentiate between 'Healthy Grief' and 'Clinical Breakdown'.",
    "primary_domain": "Relationship & Intimacy",
    "context_tags": ["Relationship", "Grief & Loss", "Identity"],
    "theme_color": "#111827",
    "questions": [
        {
            "id": "rb_q1", "text": "Thinking about the person I lost feels like...", "domain": "relationship_breakup", "subdomain": "grief_intensity", "options": [
                { "text": "A sad, distant memory.", "severity_weight": 0 },
                { "text": "A sharp, frequent pang.", "severity_weight": 1 },
                { "text": "An open wound that never closes.", "severity_weight": 2 },
                { "text": "A total eclipse of my entire reality.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rb_q2", "text": "I have been checking their social media or asking about them...", "domain": "relationship_breakup", "subdomain": "surveillance_loop", "options": [
                { "text": "Not at all.", "severity_weight": 0 },
                { "text": "Once or twice a week.", "severity_weight": 1 },
                { "text": "Multiple times a day.", "severity_weight": 2 },
                { "text": "Compulsively; I cannot stop.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "rb_q3", "text": "My sense of 'future' without them looks like...", "domain": "relationship_breakup", "subdomain": "identity_future_collapse", "options": [
                { "text": "A new journey.", "severity_weight": 0 },
                { "text": "A bit blurry.", "severity_weight": 1 },
                { "text": "A grey, featureless hallway.", "severity_weight": 2 },
                { "text": "A black hole; my life is over.", "severity_weight": 3, "risk_weight": 2 }
            ], "insight_cloud": { "type": "clinical", "title": "Heartbreak & The Brain", "text": "Heartbreak triggers the same part of the brain as physical pain and 'Withdrawal' from substances. You aren't 'Weak'; you are literally in a state of neurological shock. Time is the medicine, but strategy is the bandage.", "source_name": "Neurobiology of Loss" }
        },
        {
            "id": "rb_q4", "text": "My ability to perform basic life tasks (work, eating, cleaning) since the loss is...", "domain": "relationship_breakup", "subdomain": "functional_impairment", "options": [
                { "text": "Good.", "severity_weight": 0 },
                { "text": "Struggling but I'm doing it.", "severity_weight": 1 },
                { "text": "Very poor.", "severity_weight": 2, "functional_impairment": true },
                { "text": "Total shutdown; I'm in bed for days.", "severity_weight": 3, "functional_impairment": true }
            ]
        },
        {
            "id": "rb_q5", "text": "Do you feel like your 'center' was ripped out and there's nothing left?", "domain": "relationship_breakup", "subdomain": "existential_void_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a hollow shell.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "healing", "risk_category": "low" },
            { "range": [4, 7], "label": "grieving", "risk_category": "low" },
            { "range": [8, 11], "label": "collapsed", "risk_category": "medium" },
            { "range": [12, 15], "label": "shattered", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["relationship_intimacy"] = {
    "id": "relationship_intimacy",
    "title": "The Intimacy Wall",
    "version": "1.0",
    "description": "Examine your 'Threshold for Closeness'. Discover if you are letting people in or just letting them look.",
    "primary_domain": "Relationship & Intimacy",
    "context_tags": ["Relationship", "Identity", "Somatic"],
    "theme_color": "#be123c",
    "questions": [
        {
            "id": "ri_q1", "text": "Being fully 'Seen' by someone (flaws and all) feels...", "domain": "relationship_intimacy", "subdomain": "visibility_affect", "options": [
                { "text": "Fulfilling and grounding.", "severity_weight": 0 },
                { "text": "A bit vulnerable.", "severity_weight": 1 },
                { "text": "Terrifying; I want to hide.", "severity_weight": 2 },
                { "text": "Like a physical threat to my safety.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ri_q2", "text": "I use 'Humor' or 'Intellectualizing' to avoid deep emotional conversations...", "domain": "relationship_intimacy", "subdomain": "defensive_strategy", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently; it's my armor.", "severity_weight": 2 },
                { "text": "Always; I am a professional at being 'Surface-Level'.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ri_q3", "text": "I feel most 'Safe' in a relationship when...", "domain": "relationship_intimacy", "subdomain": "security_anchor", "options": [
                { "text": "We are close and sharing everything.", "severity_weight": 0 },
                { "text": "We are doing an activity together.", "severity_weight": 1 },
                { "text": "I have my own space and secrets.", "severity_weight": 2 },
                { "text": "The other person is slightly more invested than me.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Safety Wall", "text": "Intimacy isn't 'All or Nothing'. It's a set of layers. If you were hurt when you were 'exposed' in the past, your brain built a wall. Healing is about adding 'Windows' to the wall, not tearing it down overnight.", "source_name": "Relational Psychotherapy" }
        },
        {
            "id": "ri_q4", "text": "When someone gets too close emotionally, I tend to...", "domain": "relationship_intimacy", "subdomain": "proximal_reflex", "options": [
                { "text": "Lean in.", "severity_weight": 0 },
                { "text": "Stay steady.", "severity_weight": 1 },
                { "text": "Find a reason to pick a fight.", "severity_weight": 2 },
                { "text": "Ghost or vanish entirely.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "ri_q5", "text": "Do you feel like you are 'faking' intimacy to keep people around?", "domain": "relationship_intimacy", "subdomain": "performative_closeness_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Often; it's a social script.", "severity_weight": 2 },
                { "text": "Yes, I am a hollow actor in my own bedroom.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "open", "risk_category": "low" },
            { "range": [4, 7], "label": "guarded", "risk_category": "low" },
            { "range": [8, 11], "label": "walled", "risk_category": "medium" },
            { "range": [12, 15], "label": "impenetrable", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["relationship_silence"] = {
    "id": "relationship_silence",
    "title": "The Silence Factor",
    "version": "1.0",
    "description": "Assess the 'Unspoken' parts of your life. Discover if your silence is a shield or a weapon.",
    "primary_domain": "Relationship & Intimacy",
    "context_tags": ["Relationship", "Identity", "Social"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "rs_q1", "text": "I use the 'Silent Treatment' during conflict because...", "domain": "relationship_silence", "subdomain": "silence_objective", "options": [
                { "text": "I don't; I prefer to talk.", "severity_weight": 0 },
                { "text": "I need to cool down.", "severity_weight": 1 },
                { "text": "I want them to realize they hurt me.", "severity_weight": 2 },
                { "text": "I want to punish them into complying with my needs.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "rs_q2", "text": "Large parts of my inner world (dreams, fears) are kept totally silent because...", "domain": "relationship_silence", "subdomain": "internal_silence_logic", "options": [
                { "text": "They are private but sharable.", "severity_weight": 0 },
                { "text": "I haven't found the words.", "severity_weight": 1 },
                { "text": "I don't trust anyone with them.", "severity_weight": 2 },
                { "text": "They wouldn't understand or they'd mock me.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rs_q3", "text": "I feel that if I broke my silence, my entire life would collapse...", "domain": "relationship_silence", "subdomain": "structural_silence_risk", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A tiny bit of fear.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2 },
                { "text": "Absolutely; my silence is the only thing holding it together.", "severity_weight": 3, "risk_weight": 2 }
            ], "insight_cloud": { "type": "clinical", "title": "The Cold Wall", "text": "Silence can be a 'Passive-Aggressive' weapon or a 'Protective' shield. One drains the relationship's energy, while the other prevents the energy from being used at all. Learning to 'Speak from the Heart' is the clinical cure for chronic silence.", "source_name": "Communication Theory" }
        },
        {
            "id": "rs_q4", "text": "When others lead the conversation, I feel...", "domain": "relationship_silence", "subdomain": "social_reception", "options": [
                { "text": "Engaged and present.", "severity_weight": 0 },
                { "text": "A bit bored.", "severity_weight": 1 },
                { "text": "Like I have to swallow my own thoughts.", "severity_weight": 2 },
                { "text": "Resentful and invisible.", "severity_weight": 3 }
            ]
        },
        {
            "id": "rs_q5", "text": "Do you feel like you are 'screaming internally' while appearing perfectly calm?", "domain": "relationship_silence", "subdomain": "internal_distress_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Every single day.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "vocal", "risk_category": "low" },
            { "range": [4, 7], "label": "reserved", "risk_category": "low" },
            { "range": [8, 11], "label": "silenced", "risk_category": "medium" },
            { "range": [12, 15], "label": "muted", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["career_politics"] = {
    "id": "career_politics",
    "title": "The Politics of the Office",
    "version": "1.0",
    "description": "Assess your navigation of 'Hidden Power'. Discover if you are a player or a pawn in the office game.",
    "primary_domain": "Career & Performance",
    "context_tags": ["Workplace", "Social", "Identity"],
    "theme_color": "#4338ca",
    "questions": [
        {
            "id": "cp_q1", "text": "When I hear office gossip about a major change, my first instinct is...", "domain": "career_politics", "subdomain": "information_reception", "options": [
                { "text": "Wait for the official announcement.", "severity_weight": 0 },
                { "text": "Verify with a trusted peer.", "severity_weight": 1 },
                { "text": "Plan my move to stay safe.", "severity_weight": 2 },
                { "text": "Feel a wave of panic and paranoia.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cp_q2", "text": "Meeting 'Higher-Ups' or leaders in my company feels...", "domain": "career_politics", "subdomain": "hierarchical_affect", "options": [
                { "text": "Like a normal professional interaction.", "severity_weight": 0 },
                { "text": "Intimidating but okay.", "severity_weight": 1 },
                { "text": "Like I'm on trial.", "severity_weight": 2 },
                { "text": "Like I'm invisible or a target.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cp_q3", "text": "I feel I have to 'perform' a certain personality to fit the office culture...", "domain": "career_politics", "subdomain": "cultural_masking", "options": [
                { "text": "Never; I'm myself.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently; it's exhausting.", "severity_weight": 2 },
                { "text": "Always; they don't know the real me at all.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Organizational Politics", "text": "Office politics isn't always 'bad'. It's the 'Navigational Intelligence' of the group. However, if the politics require you to betray your 'Moral Compass' daily, it becomes 'Moral Injury', leading to deep burnout.", "source_name": "Organizational Psychology" }
        },
        {
            "id": "cp_q4", "text": "The trust level among my immediate team is...", "domain": "career_politics", "subdomain": "team_safety", "options": [
                { "text": "High and reliable.", "severity_weight": 0 },
                { "text": "Variable.", "severity_weight": 1 },
                { "text": "Low; everyone is for themselves.", "severity_weight": 2 },
                { "text": "Underground warfare; people are sabotaging each other.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "cp_q5", "text": "Do you feel like your 'career luck' is controlled by people who don't even know your name?", "domain": "career_politics", "subdomain": "locus_of_control_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a powerless ghost in the machine.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "integrated", "risk_category": "low" },
            { "range": [4, 7], "label": "navigating", "risk_category": "low" },
            { "range": [8, 11], "label": "marginalized", "risk_category": "medium" },
            { "range": [12, 15], "label": "persecuted", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["career_burnout_battery"] = {
    "id": "career_burnout_battery",
    "title": "The Burnout Battery",
    "version": "1.0",
    "description": "Measure your 'Internal Charge'. Discover if you are low on energy or if your battery is physically damaged.",
    "primary_domain": "Career & Performance",
    "context_tags": ["Workplace", "Somatic", "Performance"],
    "theme_color": "#b91c1c",
    "questions": [
        {
            "id": "cbb_q1", "text": "After a full night's sleep, I wake up feeling...", "domain": "career_burnout_battery", "subdomain": "rest_efficacy", "options": [
                { "text": "Refreshed and ready.", "severity_weight": 0 },
                { "text": "A bit slow.", "severity_weight": 1 },
                { "text": "Tired immediately.", "severity_weight": 2 },
                { "text": "Worse than when I went to sleep; I'm drained to the bone.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cbb_q2", "text": "I feel a sense of 'Cynicism' or 'Bitterness' toward my work or clients...", "domain": "career_burnout_battery", "subdomain": "depersonalization_affect", "options": [
                { "text": "Never; I care about them.", "severity_weight": 0 },
                { "text": "Occasionally, when stressed.", "severity_weight": 1 },
                { "text": "Frequently; they are just 'tasks' now.", "severity_weight": 2 },
                { "text": "Constantly; I have become cold and unfeeling.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cbb_q3", "text": "My ability to concentrate on a single task for 30 minutes is...", "domain": "career_burnout_battery", "subdomain": "cognitive_exhaustion", "options": [
                { "text": "Excellent.", "severity_weight": 0 },
                { "text": "Slipping.", "severity_weight": 1 },
                { "text": "Fragmented; I jump from thing to thing.", "severity_weight": 2 },
                { "text": "Gone; my brain is 'fog' all day.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Three Pillars of Burnout", "text": "Burnout isn't just 'Stress'. It has three pillars: 1. Exhaustion, 2. Cynicism (Depersonalization), and 3. Reduced Efficacy (Feeling like you're failing). If you have all three, it's a 'Clinical Burnout' requiring immediate intervention.", "source_name": "Maslach Burnout Inventory (MBI)" }
        },
        {
            "id": "cbb_q4", "text": "Physical symptoms like headaches or stomach issues since starting this job are...", "domain": "career_burnout_battery", "subdomain": "somatic_load", "options": [
                { "text": "Non-existent.", "severity_weight": 0 },
                { "text": "Rare.", "severity_weight": 1 },
                { "text": "Weekly.", "severity_weight": 2 },
                { "text": "Daily; my body is screaming 'No'.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "cbb_q5", "text": "Do you feel like you are 'running on empty' and one more minor task will make you collapse emotionally?", "domain": "career_burnout_battery", "subdomain": "total_collapse_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "I am already collapsed.", "severity_weight": 3, "risk_weight": 4 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "charged", "risk_category": "low" },
            { "range": [4, 7], "label": "dimming", "risk_category": "low" },
            { "range": [8, 11], "label": "depleted", "risk_category": "medium" },
            { "range": [12, 15], "label": "burned_out", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["career_leadership"] = {
    "id": "career_leadership",
    "title": "The Weight of the Crown",
    "version": "1.0",
    "description": "Assess the 'Burden of Responsibility'. Discover if leading others is growing you or crushing you.",
    "primary_domain": "Career & Performance",
    "context_tags": ["Workplace", "Identity", "Leadership"],
    "theme_color": "#ca8a04",
    "questions": [
        {
            "id": "cl_q1", "text": "When my team fails at a task, my first internal thought is...", "domain": "career_leadership", "subdomain": "responsibility_attribution", "options": [
                { "text": "How do we fix this together?", "severity_weight": 0 },
                { "text": "I need to find out who messed up.", "severity_weight": 1 },
                { "text": "It's entirely my fault for being a bad leader.", "severity_weight": 2 },
                { "text": "I can't believe I'm stuck with these people.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cl_q2", "text": "Making 'The Final Decision' on a high-stakes project feels...", "domain": "career_leadership", "subdomain": "decision_paralysis", "options": [
                { "text": "Invigorating and clear.", "severity_weight": 0 },
                { "text": "Nerve-wracking but necessary.", "severity_weight": 1 },
                { "text": "Paralyzing; I procrastinate until it's too late.", "severity_weight": 2 },
                { "text": "Terrifying; I feel I'm going to ruin everyone's lives.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cl_q3", "text": "I feel I have to be 'Perfect' to maintain authority and respect...", "domain": "career_leadership", "subdomain": "perfectionism_mask", "options": [
                { "text": "No, I'm okay with showing vulnerability.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2 },
                { "text": "Absolutely; if they see a crack, I'm finished.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Leadership Isolation", "text": "The higher you go, the fewer peers you have to talk to. This 'Leadership Isolation' can lead to 'Compensatory Narcissism' or 'Severe Anxiety'. Leaders need 'Safe Containers' outside of work where they don't have to have any answers.", "source_name": "Executive Coaching Psychology" }
        },
        {
            "id": "cl_q4", "text": "The boundary between 'Work Problems' and 'My Worth' is...", "domain": "career_leadership", "subdomain": "worth_attachment", "options": [
                { "text": "Very clear.", "severity_weight": 0 },
                { "text": "Sometimes blurry.", "severity_weight": 1 },
                { "text": "Very thin.", "severity_weight": 2 },
                { "text": "Non-existent; I am my job results.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cl_q5", "text": "Do you feel like you are 'faking it' and everyone is about to find out you aren't a 'Real' leader?", "domain": "career_leadership", "subdomain": "imposter_syndrome_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Yes, I feel like a fraud every day.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a decorative mask with no substance.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "empowering", "risk_category": "low" },
            { "range": [4, 7], "label": "striving", "risk_category": "low" },
            { "range": [8, 11], "label": "overburdened", "risk_category": "medium" },
            { "range": [12, 15], "label": "crushing", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["career_productivity"] = {
    "id": "career_productivity",
    "title": "The Productivity Trap",
    "version": "1.0",
    "description": "Assess your 'Value' system. Discover if you are a human being or a human 'doing'.",
    "primary_domain": "Career & Performance",
    "context_tags": ["Workplace", "Identity", "Performance"],
    "theme_color": "#15803d",
    "questions": [
        {
            "id": "cpr_q1", "text": "An 'Unproductive' day (where I didn't finish many tasks) makes me feel...", "domain": "career_productivity", "subdomain": "productivity_guilt", "options": [
                { "text": "Fine; I'll catch up tomorrow.", "severity_weight": 0 },
                { "text": "A bit annoyed with myself.", "severity_weight": 1 },
                { "text": "Guilty and anxious.", "severity_weight": 2 },
                { "text": "Utterly worthless and like a failure as a human.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cpr_q2", "text": "Even during my 'Off' time (evenings/weekends), my mind is...", "domain": "career_productivity", "subdomain": "mental_detachment", "options": [
                { "text": "Relaxed and elsewhere.", "severity_weight": 0 },
                { "text": "Slowly winding down.", "severity_weight": 1 },
                { "text": "Still mentally sorting through my 'To-Do' list.", "severity_weight": 2 },
                { "text": "Obsessed with work; I can't enjoy anything else.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cpr_q3", "text": "I prioritize the 'Speed' of my work over the 'Quality' or my 'Health'...", "domain": "career_productivity", "subdomain": "velocity_fixation", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often; the backlog is scary.", "severity_weight": 2 },
                { "text": "Always; I am a machine processing tickets.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Performative Productivity", "text": "When your self-worth is tied exclusively to your output, you enter the 'Productivity Trap'. This leads to 'Toxic Productivity' where even rest feels like a chore that needs to be optimized for better work. It's the highway to a long-term breakdown.", "source_name": "Performance Psychology Foundations" }
        },
        {
            "id": "cpr_q4", "text": "I feel that my coworkers only value me for...", "domain": "career_productivity", "subdomain": "perceived_utility", "options": [
                { "text": "My personality and insights.", "severity_weight": 0 },
                { "text": "My technical skills.", "severity_weight": 1 },
                { "text": "How fast I can clear their problems.", "severity_weight": 2 },
                { "text": "What I can provide for them commercially.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cpr_q5", "text": "Do you feel like you are 'disappearing' behind your resume or LinkedIn profile?", "domain": "career_productivity", "subdomain": "identity_erosion_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I don't know who I am without a deadline.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "balanced", "risk_category": "low" },
            { "range": [4, 7], "label": "efficient", "risk_category": "low" },
            { "range": [8, 11], "label": "obsessed", "risk_category": "medium" },
            { "range": [12, 15], "label": "mechanical", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["career_slack_anxiety"] = {
    "id": "career_slack_anxiety",
    "title": "The Digital Leash: Ping Anxiety",
    "version": "1.0",
    "description": "Assess your reaction to 'Instant Connectivity'. Discover if notifications are ruling your nervous system.",
    "primary_domain": "Career & Performance",
    "context_tags": ["Workplace", "Digital", "Somatic"],
    "theme_color": "#4f46e5",
    "questions": [
        {
            "id": "sa_q1", "text": "The sound of a work notification (Slack, Teams, Email) during leisure hours makes my heart...", "domain": "career_slack_anxiety", "subdomain": "auditory_startle", "options": [
                { "text": "Stay steady; I'll check it Monday.", "severity_weight": 0 },
                { "text": "Skip a beat.", "severity_weight": 1 },
                { "text": "Race; I feel compelled to check it immediately.", "severity_weight": 2 },
                { "text": "Pound; I feel a wave of sheer terror.", "severity_weight": 3 }
            ]
        },
        {
            "id": "sa_q2", "text": "I feel the need to keep 'Multiple Tabs' of work chat open even when I'm focused on a deep project...", "domain": "career_slack_anxiety", "subdomain": "communication_hypervigilance", "options": [
                { "text": "No, I snooze them.", "severity_weight": 0 },
                { "text": "A few.", "severity_weight": 1 },
                { "text": "All of them; I can't miss a single word.", "severity_weight": 2 },
                { "text": "I check them every 2 minutes even if there's no notification.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "sa_q3", "text": "I find myself 'Checking My Phone' for work messages right before bed or immediately upon waking...", "domain": "career_slack_anxiety", "subdomain": "boundary_blur", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Daily.", "severity_weight": 2 },
                { "text": "It's the first and last thing I do every day.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Notification Fatigue", "text": "Constant connectivity creates 'Intermittent Reinforcement'—your brain starts treating every ping like a survival alert. This keeps your 'Cortisol' levels pathologically high, leading to chronic anxiety and poor executive function.", "source_name": "Cyber-Psychology Research" }
        },
        {
            "id": "sa_q4", "text": "The feeling of 'being out of the loop' for 4 hours is...", "domain": "career_slack_anxiety", "subdomain": "fomo_load", "options": [
                { "text": "Relaxing.", "severity_weight": 0 },
                { "text": "Manageable.", "severity_weight": 1 },
                { "text": "Distressing.", "severity_weight": 2 },
                { "text": "A full-blown existential crisis.", "severity_weight": 3 }
            ]
        },
        {
            "id": "sa_q5", "text": "Do you feel like your 'life' is just a series of responses to other people's pings?", "domain": "career_slack_anxiety", "subdomain": "agency_loss_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a remote-controlled human.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "disconnected", "risk_category": "low" },
            { "range": [4, 7], "label": "pinged", "risk_category": "low" },
            { "range": [8, 11], "label": "tethered", "risk_category": "medium" },
            { "range": [12, 15], "label": "enslaved", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["career_commuter"] = {
    "id": "career_commuter",
    "title": "The Commuter Cloud",
    "version": "1.0",
    "description": "Assess the impact of your 'Transit Time'. Discover if your commute is a buffer or a barrier.",
    "primary_domain": "Career & Performance",
    "context_tags": ["Workplace", "Somatic", "Identity"],
    "theme_color": "#475569",
    "questions": [
        {
            "id": "cc_q1", "text": "My commute (to office or home) primarily feels like...", "domain": "career_commuter", "subdomain": "transit_affect", "options": [
                { "text": "Needed decompression time.", "severity_weight": 0 },
                { "text": "Lost time.", "severity_weight": 1 },
                { "text": "A source of rising anger.", "severity_weight": 2 },
                { "text": "A soul-draining void I hate every second of.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cc_q2", "text": "By the time I arrive at my destination, my energy level is...", "domain": "career_commuter", "subdomain": "energy_drain", "options": [
                { "text": "High.", "severity_weight": 0 },
                { "text": "Focused but tired.", "severity_weight": 1 },
                { "text": "Low.", "severity_weight": 2 },
                { "text": "Completely spent; I need an hour just to 'arrive'.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cc_q3", "text": "I find myself 'Angry' at strangers on the train/road over tiny things...", "domain": "career_commuter", "subdomain": "displaced_aggression", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often; they are the obstacle to my life.", "severity_weight": 2 },
                { "text": "Always; I am in a state of urban combat.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Liminal Strain", "text": "A long, stressful commute is 'Liminal Time'—you are neither home nor at work. If this transit is stressful (traffic, delays), your 'Locus of Control' is externalized, which is a major driver of chronic depression and helplessness.", "source_name": "Environmental Psychology" }
        },
        {
            "id": "cc_q4", "text": "The idea of doing this commute for the next 5 years is...", "domain": "career_commuter", "subdomain": "future_tolerance", "options": [
                { "text": "Fine.", "severity_weight": 0 },
                { "text": "Tough but doable.", "severity_weight": 1 },
                { "text": "Exhausting to think about.", "severity_weight": 2 },
                { "text": "A reason to quit today.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cc_q5", "text": "Do you feel like a 'passenger' in your own life because so much time is spent in transit?", "domain": "career_commuter", "subdomain": "autonomy_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a piece of cargo.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "buffered", "risk_category": "low" },
            { "range": [4, 7], "label": "mobile", "risk_category": "low" },
            { "range": [8, 11], "label": "drifting", "risk_category": "medium" },
            { "range": [12, 15], "label": "exhausted", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["career_transition"] = {
    "id": "career_transition",
    "title": "The Career Pivot",
    "version": "1.0",
    "description": "Assess the gravity of your 'Big Move'. Discover if you are jumping or falling.",
    "primary_domain": "Career & Performance",
    "context_tags": ["Workplace", "Identity", "Future"],
    "theme_color": "#8b5cf6",
    "questions": [
        {
            "id": "ctx_q1", "text": "The idea of changing my path entirely (new industry, new role) feels...", "domain": "career_transition", "subdomain": "pivot_affect", "options": [
                { "text": "Necessary and exciting.", "severity_weight": 0 },
                { "text": "Complicated but potentially good.", "severity_weight": 1 },
                { "text": "Terrifying and overwhelming.", "severity_weight": 2 },
                { "text": "Like I'm committing professional suicide.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ctx_q2", "text": "I am staying in my current role primarily because of...", "domain": "career_transition", "subdomain": "retention_logic", "options": [
                { "text": "Love for the work.", "severity_weight": 0 },
                { "text": "Financial incentives.", "severity_weight": 1 },
                { "text": "Fear of the 'Unknown' outside this bubble.", "severity_weight": 2 },
                { "text": "Sunken-Cost Fallacy; I've put too many years in to leave.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ctx_q3", "text": "I feel I 'Should' be further along in my path than I am, and it burns...", "domain": "career_transition", "subdomain": "milestone_anxiety", "options": [
                { "text": "No, I'm on my own timeline.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Regularly.", "severity_weight": 2 },
                { "text": "It's a constant, agonizing internal scream.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Quarter-Life/Mid-Life Crisis", "text": "These aren't 'clichés'; they are 'Identity Re-Evaluations'. When the external 'Map' given to you by society doesn't match your internal 'Compass', you feel a profound sense of 'Pivot-Pain'. It's an invitation to authenticity.", "source_name": "Developmental Psychology" }
        },
        {
            "id": "ctx_q4", "text": "My support system for a major change is...", "domain": "career_transition", "subdomain": "social_safety", "options": [
                { "text": "Solid and encouraging.", "severity_weight": 0 },
                { "text": "Skeptical but okay.", "severity_weight": 1 },
                { "text": "Non-existent.", "severity_weight": 2 },
                { "text": "Active barriers; they want me to stay safe and bored.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ctx_q5", "text": "Do you feel like you are 'settling' for a life 50% smaller than the one you dreamed of?", "domain": "career_transition", "subdomain": "shrinkage_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Yes, I am living a 'Lite' version of my potential.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, and it's killing my spirit.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "pivoting", "risk_category": "low" },
            { "range": [4, 7], "label": "uncertain", "risk_category": "low" },
            { "range": [8, 11], "label": "stagnant", "risk_category": "medium" },
            { "range": [12, 15], "label": "paralyzed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["career_mask"] = {
    "id": "career_mask",
    "title": "The Meeting Mask: Professional Performace",
    "version": "1.0",
    "description": "Assess the gap between your 'Office Self' and 'True Self'. Discover if the performance is costing you your sanity.",
    "primary_domain": "Career & Performance",
    "context_tags": ["Workplace", "Identity", "Social"],
    "theme_color": "#475569",
    "questions": [
        {
            "id": "cmk_q1", "text": "When I am in a work meeting, I feel like I am...", "domain": "career_mask", "subdomain": "performative_depth", "options": [
                { "text": "Being myself.", "severity_weight": 0 },
                { "text": "Being a professional version of myself.", "severity_weight": 1 },
                { "text": "Playing a character I don't recognize.", "severity_weight": 2 },
                { "text": "Observing a puppet I control through a screen.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cmk_q2", "text": "The energy cost of 'appearing calm and professional' while stressed is...", "domain": "career_mask", "subdomain": "emotional_labor", "options": [
                { "text": "Low.", "severity_weight": 0 },
                { "text": "Manageable.", "severity_weight": 1 },
                { "text": "Immense; it's the hardest part of my job.", "severity_weight": 2 },
                { "text": "Lethal; I feel 100 years old after every meeting.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cmk_q3", "text": "I fear that if my coworkers saw the 'Real Me' (vulnerable, messy, angry), I would be...", "domain": "career_mask", "subdomain": "exposure_fear", "options": [
                { "text": "Supported.", "severity_weight": 0 },
                { "text": "Viewed as human.", "severity_weight": 1 },
                { "text": "Sidelined or mocked.", "severity_weight": 2 },
                { "text": "Instantly fired or ostracized.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Emotional Labor", "text": "Suppressing the symptoms of distress to maintain a 'Professional Image' is a primary driver of burnout. This 'Meeting Mask' disconnects you from your own internal feedback loops, making it harder to know when you actually need help.", "source_name": "Sociological Labor Research" }
        },
        {
            "id": "cmk_q4", "text": "After work, my ability to 'drop the mask' and be myself is...", "domain": "career_mask", "subdomain": "recovery_latency", "options": [
                { "text": "Instant.", "severity_weight": 0 },
                { "text": "Takes an hour.", "severity_weight": 1 },
                { "text": "Very difficult; the mask is stuck for hours.", "severity_weight": 2 },
                { "text": "Impossible; I don't know where the mask ends and I begin.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "cmk_q5", "text": "Do you feel like you are 'living a lie' five days a week?", "domain": "career_mask", "subdomain": "authenticity_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a professional actor, not a professional [my role].", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "authentic", "risk_category": "low" },
            { "range": [4, 7], "label": "professional", "risk_category": "low" },
            { "range": [8, 11], "label": "masked", "risk_category": "medium" },
            { "range": [12, 15], "label": "disintegrating", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["career_blocks"] = {
    "id": "career_blocks",
    "title": "The Creative Blockade",
    "version": "1.0",
    "description": "Assess the 'Silence' of your inspiration. Discover if you are out of ideas or just out of safety.",
    "primary_domain": "Career & Performance",
    "context_tags": ["Workplace", "Identity", "Performance"],
    "theme_color": "#ec4899",
    "questions": [
        {
            "id": "cbk_q1", "text": "When I try to start a new creative task, my mind feels like...", "domain": "career_blocks", "subdomain": "ideation_state", "options": [
                { "text": "A flowing river.", "severity_weight": 0 },
                { "text": "A slow tap.", "severity_weight": 1 },
                { "text": "Sticky mud.", "severity_weight": 2 },
                { "text": "A blank, terrifying white wall.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cbk_q2", "text": "I avoid 'Starting' because I'm afraid the result will be trash...", "domain": "career_blocks", "subdomain": "perfectionism_paralysis", "options": [
                { "text": "Rarely; I just play.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently; it's a major anchor.", "severity_weight": 2 },
                { "text": "Always; I haven't finished anything in months.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "cbk_q3", "text": "I find myself 'Organizing' or 'Researching' for 10 hours to avoid 1 hour of actual creation...", "domain": "career_blocks", "subdomain": "procrastination_type", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "It's my primary workflow.", "severity_weight": 2 },
                { "text": "It's my lifestyle; I am an 'organizer', not a creator.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Resistance", "text": "Creative block isn't a lack of talent. It's 'Resistance'—the fear that expressing yourself will lead to judgment or failure. The higher the stakes, the higher the Resistance. Solution: Lower the bar until you can step over it.", "source_name": "The War of Art / Pressfield Psychology" }
        },
        {
            "id": "cbk_q4", "text": "The feeling after a 'Blocked' day is...", "domain": "career_blocks", "subdomain": "post_block_affect", "options": [
                { "text": "I'll try again tomorrow.", "severity_weight": 0 },
                { "text": "Frustrating.", "severity_weight": 1 },
                { "text": "Self-loathing.", "severity_weight": 2 },
                { "text": "Total existential despair.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cbk_q5", "text": "Do you feel like you have 'lost your spark' and it's never coming back?", "domain": "career_blocks", "subdomain": "despair_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "It feels like that sometimes.", "severity_weight": 1 },
                { "text": "Yes, I am a burnt-out candle.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, the fire is out and buried.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "flowing", "risk_category": "low" },
            { "range": [4, 7], "label": "stuttering", "risk_category": "low" },
            { "range": [8, 11], "label": "blocked", "risk_category": "medium" },
            { "range": [12, 15], "label": "fortified", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["trauma_hypervigilant"] = {
    "id": "trauma_hypervigilant",
    "title": "The Hypervigilant Scan",
    "version": "1.0",
    "description": "Assess your 'Scanning' habits. Discover if your brain is stuck in 'Threat Detection' mode.",
    "primary_domain": "Trauma & Nervous System",
    "context_tags": ["Trauma", "Somatic", "Anxiety"],
    "theme_color": "#451a03",
    "questions": [
        {
            "id": "thv_q1", "text": "When I enter a new public space (restaurant, mall), my first instinct is to...", "domain": "trauma_hypervigilant", "subdomain": "spatial_scanning", "options": [
                { "text": "Look for a comfortable seat.", "severity_weight": 0 },
                { "text": "Note the general vibe.", "severity_weight": 1 },
                { "text": "Identify the exits immediately.", "severity_weight": 2 },
                { "text": "Scan every person for potential weapons or aggression.", "severity_weight": 3 }
            ]
        },
        {
            "id": "thv_q2", "text": "I feel the need to sit with my 'Back to the Wall' in public...", "domain": "trauma_hypervigilant", "subdomain": "defensive_posturing", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "Always; I feel unsafe otherwise.", "severity_weight": 3 }
            ]
        },
        {
            "id": "thv_q3", "text": "My mind 'Simulates' possible disasters or attacks throughout the day...", "domain": "trauma_hypervigilant", "subdomain": "threat_simulation", "options": [
                { "text": "Rarely.", "severity_weight": 0 },
                { "text": "Slightly.", "severity_weight": 1 },
                { "text": "Regularly.", "severity_weight": 2 },
                { "text": "Constantly; I am always 'Battle-Ready'.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Hyper-Arousal", "text": "Hypervigilance is a symptom of a nervous system that has been 'Primed' by past danger. Your brain is trying to protect you by never letting your guard down. This 'High-Alert' state is exhausting and prevents deep physical recovery.", "source_name": "Trauma-Informed Neurobiology" }
        },
        {
            "id": "thv_q4", "text": "The sound of a loud noise (door slam, siren) makes me...", "domain": "trauma_hypervigilant", "subdomain": "startle_response", "options": [
                { "text": "Curious.", "severity_weight": 0 },
                { "text": "Annoyed.", "severity_weight": 1 },
                { "text": "Jump higher than most people.", "severity_weight": 2 },
                { "text": "Go into a full 'Freeze' or 'Flight' response.", "severity_weight": 3 }
            ]
        },
        {
            "id": "thv_q5", "text": "Do you feel like 'Peace' is just a trap and something bad is definitely about to happen?", "domain": "trauma_hypervigilant", "subdomain": "dread_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am always waiting for the other shoe to drop.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "observant", "risk_category": "low" },
            { "range": [4, 7], "label": "cautious", "risk_category": "low" },
            { "range": [8, 11], "label": "vigilant", "risk_category": "medium" },
            { "range": [12, 15], "label": "hyper-vigilant", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["trauma_numbness"] = {
    "id": "trauma_numbness",
    "title": "The Emotional Numbness Meter",
    "version": "1.0",
    "description": "Assess your 'Sensing' capacity. Discover if you are feeling 'Nothing' to protect yourself from 'Everything'.",
    "primary_domain": "Trauma & Nervous System",
    "context_tags": ["Trauma", "Dissociation", "Identity"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "tnm_q1", "text": "Lately, my favorite activities (music, food, hobbies) feel...", "domain": "trauma_numbness", "subdomain": "anhedonia_baseline", "options": [
                { "text": "Great.", "severity_weight": 0 },
                { "text": "Muted.", "severity_weight": 1 },
                { "text": "Grey and hollow.", "severity_weight": 2 },
                { "text": "Like I'm watching someone else enjoy them on a screen.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tnm_q2", "text": "My range of emotions currently feels like...", "domain": "trauma_numbness", "subdomain": "affect_range", "options": [
                { "text": "A full orchestra.", "severity_weight": 0 },
                { "text": "A few notes.", "severity_weight": 1 },
                { "text": "A single, flat line of 'Okay'.", "severity_weight": 2 },
                { "text": "Total silence; I feel 'Nothing'.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tnm_q3", "text": "I feel 'Far Away' from the people in my life even when they are right next to me...", "domain": "trauma_numbness", "subdomain": "depersonalization_connect", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Always; I am a ghost among the living.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Emotional Blunting", "text": "Numbness is a 'Functional Survival Strategy'. When the pain of the past or present becomes too much, the brain 'Trips the Circuit Breaker' to prevent overload. You aren't 'Cold'; you are 'Preserving Resources'. Healing means slowly turning the power back on.", "source_name": "Complex Trauma Theory" }
        },
        {
            "id": "tnm_q4", "text": "My memory of recent events is...", "domain": "trauma_numbness", "subdomain": "cognitive_fog", "options": [
                { "text": "Sharp.", "severity_weight": 0 },
                { "text": "A bit fuzzy.", "severity_weight": 1 },
                { "text": "Very poor.", "severity_weight": 2 },
                { "text": "A series of blackouts and 'skipped' time.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "tnm_q5", "text": "Do you feel like a 'body' without a 'person' inside it?", "domain": "trauma_numbness", "subdomain": "dissociation_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "Yes, I am a hollow suit of armor.", "severity_weight": 3, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "present", "risk_category": "low" },
            { "range": [4, 7], "label": "muted", "risk_category": "low" },
            { "range": [8, 11], "label": "numb", "risk_category": "medium" },
            { "range": [12, 15], "label": "dissociated", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["trauma_flashback"] = {
    "id": "trauma_flashback",
    "title": "The Time-Loop: Flashback Gauge",
    "version": "1.0",
    "description": "Assess 'Intrusive Memories'. Discover if your past is physically overriding your present.",
    "primary_domain": "Trauma & Nervous System",
    "context_tags": ["Trauma", "Somatic", "Night Terrors"],
    "theme_color": "#111827",
    "questions": [
        {
            "id": "tfb_q1", "text": "When a 'Trigger' happens, my reaction feels like...", "domain": "trauma_flashback", "subdomain": "trigger_depth", "options": [
                { "text": "A memory I can look at.", "severity_weight": 0 },
                { "text": "A strong emotional wave.", "severity_weight": 1 },
                { "text": "A total body takeover where I feel it all over again.", "severity_weight": 2 },
                { "text": "I 'lose time' and wake up elsewhere.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "tfb_q2", "text": "Nightmares or disturbing dreams about past events occur...", "domain": "trauma_flashback", "subdomain": "sleep_intrusion", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Once a month.", "severity_weight": 1 },
                { "text": "Once a week.", "severity_weight": 2 },
                { "text": "Every single night; I'm afraid to sleep.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "tfb_q3", "text": "I avoid 'Certain Places' or 'Certain People' because the memory is too violent to handle...", "domain": "trauma_flashback", "subdomain": "avoidance_logic", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often; my world is shrinking.", "severity_weight": 2 },
                { "text": "Always; I live in a fortress of my own design.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Body Remembers", "text": "A 'Flashback' isn't just a mental picture. It's a 'Somatic Flashback'—your body's adrenaline and cortisol spike as if the event is happening *now*. Your brain's 'Time-Stamp' mechanism (Hippocampus) is offline during trauma.", "source_name": "The Body Keeps the Score / van der Kolk" }
        },
        {
            "id": "tfb_q4", "text": "After a 'Flashback' episode, I feel...", "domain": "trauma_flashback", "subdomain": "recovery_latency", "options": [
                { "text": "Fine.", "severity_weight": 0 },
                { "text": "Tired.", "severity_weight": 1 },
                { "text": "Wrecked for the whole day.", "severity_weight": 2 },
                { "text": "Terrified that it will never stop.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tfb_q5", "text": "Do you feel like your 'Real Life' ended back then and this is just a ghost story?", "domain": "trauma_flashback", "subdomain": "existential_collapse_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent inhabitant of my own past.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "remembering", "risk_category": "low" },
            { "range": [4, 7], "label": "reminded", "risk_category": "low" },
            { "range": [8, 11], "label": "haunted", "risk_category": "medium" },
            { "range": [12, 15], "label": "reliving", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["trauma_somatic"] = {
    "id": "trauma_somatic",
    "title": "The Somatic Storage Audit",
    "version": "1.0",
    "description": "Assess 'Body-Stored Stress'. Discover where your story is being written in your muscles and nerves.",
    "primary_domain": "Trauma & Nervous System",
    "context_tags": ["Trauma", "Somatic", "Pain"],
    "theme_color": "#7c2d12",
    "questions": [
        {
            "id": "tss_q1", "text": "My muscles (jaw, shoulders, pelvic floor) usually feel...", "domain": "trauma_somatic", "subdomain": "muscle_baseline", "options": [
                { "text": "Loose and easy.", "severity_weight": 0 },
                { "text": "A bit tight.", "severity_weight": 1 },
                { "text": "Permanently tensed; like a coiled spring.", "severity_weight": 2 },
                { "text": "Painfully locked; I can't remember the last time I relaxed.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tss_q2", "text": "I feel 'Chronic Aches' that doctors can't find a clear physical cause for...", "domain": "trauma_somatic", "subdomain": "medically_unexplained_symptoms", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "Daily; my body is a site of chronic pain.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tss_q3", "text": "My 'Gut Feeling' or stomach area often feels...", "domain": "trauma_somatic", "subdomain": "visceral_reactivity", "options": [
                { "text": "Calm.", "severity_weight": 0 },
                { "text": "Nervous.", "severity_weight": 1 },
                { "text": "In a permanent knot or acidic.", "severity_weight": 2 },
                { "text": "Like a 'Cold Fire' or completely hollow and nauseous.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Somatic Experiencing", "text": "Trauma is not just in the mind; it's a 'Motor Pattern'. If you couldn't 'Fight' or 'Flee' during the original event, that energy stayed stuck in your muscles. 'Somatic Release'—shaking or gentle movement—is the path to clearing the storage.", "source_name": "Levine's Somatic Experiencing Frameworks" }
        },
        {
            "id": "tss_q4", "text": "I feel a 'Lump in my Throat' or 'Weight on my Chest'...", "domain": "trauma_somatic", "subdomain": "constrictional_affect", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Regularly.", "severity_weight": 2 },
                { "text": "I am being suffocated by an invisible weight daily.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tss_q5", "text": "Do you feel like your 'Body' is an enemy you have to fight against every day?", "domain": "trauma_somatic", "subdomain": "somatic_enemies_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am at war with my own skin.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "supple", "risk_category": "low" },
            { "range": [4, 7], "label": "tensed", "risk_category": "low" },
            { "range": [8, 11], "label": "stored", "risk_category": "medium" },
            { "range": [12, 15], "label": "armored", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["trauma_safety"] = {
    "id": "trauma_safety",
    "title": "The Safety Spectrum: Regulation Gauge",
    "version": "1.0",
    "description": "Assess your 'Window of Tolerance'. Discover if you are 'Regulated' or 'Red-Lining'.",
    "primary_domain": "Trauma & Nervous System",
    "context_tags": ["Trauma", "Anxiety", "Somatic"],
    "theme_color": "#166534",
    "questions": [
        {
            "id": "tsf_q1", "text": "Right now, in this moment, my body feels...", "domain": "trauma_safety", "subdomain": "current_state", "options": [
                { "text": "Safe and grounded.", "severity_weight": 0 },
                { "text": "A bit buzzy or distracted.", "severity_weight": 1 },
                { "text": "On edge; waiting for something.", "severity_weight": 2 },
                { "text": "I don't know; I can't feel my body.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "tsf_q2", "text": "If I am alone in a quiet room, I feel...", "domain": "trauma_safety", "subdomain": "solitary_regulation", "options": [
                { "text": "Peaceful.", "severity_weight": 0 },
                { "text": "A bit bored.", "severity_weight": 1 },
                { "text": "Anxious; I need to 'do' something.", "severity_weight": 2 },
                { "text": "Terror; the silence is too loud.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tsf_q3", "text": "I can 'Self-Soothe' without using food, substances, or screens...", "domain": "trauma_safety", "subdomain": "regulation_autonomy", "options": [
                { "text": "Yes, easily.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Rarely; I need external distractions.", "severity_weight": 2 },
                { "text": "Never; I would spiral without a distraction.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Window of Tolerance", "text": "You have a 'Window' where you can handle stress. If you are 'Above' the window (Hyper-arousal/Anger/Anxiety) or 'Below' (Hypo-arousal/Numbness), you aren't safe. Regulation is about coming back to the 'Center' where you can actually think.", "source_name": "Polyvagal Theory Foundations" }
        },
        {
            "id": "tsf_q4", "text": "My ability to 'Breathe Deeply' and feel it in my stomach is...", "domain": "trauma_safety", "subdomain": "diaphragmatic_access", "options": [
                { "text": "Natural.", "severity_weight": 0 },
                { "text": "Possible with focus.", "severity_weight": 1 },
                { "text": "Difficult; my breath is very high and shallow.", "severity_weight": 2 },
                { "text": "Impossible; my chest is locked.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tsf_q5", "text": "Do you feel like your 'Nervous System' is an old, faulty engine that could explode at any time?", "domain": "trauma_safety", "subdomain": "structural_fragility_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent living short-circuit.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "grounded", "risk_category": "low" },
            { "range": [4, 7], "label": "sensitive", "risk_category": "low" },
            { "range": [8, 11], "label": "overloaded", "risk_category": "medium" },
            { "range": [12, 15], "label": "dysregulated", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["trauma_dissociation"] = {
    "id": "trauma_dissociation",
    "title": "The Dissociation Drift",
    "version": "1.0",
    "description": "Assess 'Mental Distancing'. Discover if you are 'Floating' away from your own life.",
    "primary_domain": "Trauma & Nervous System",
    "context_tags": ["Trauma", "Dissociation", "Identity"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "tds_q1", "text": "I find myself 'Checking Out' during a conversation or meeting...", "domain": "trauma_dissociation", "subdomain": "attentional_drift", "options": [
                { "text": "Rarely.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often; I lose whole sentences.", "severity_weight": 2 },
                { "text": "Constantly; I am a ghost in the room.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tds_q2", "text": "The world around me sometimes looks 'Fake', 'Two-Dimensional', or like a dream...", "domain": "trauma_dissociation", "subdomain": "derealization_affect", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Regularly.", "severity_weight": 2 },
                { "text": "Almost all the time; I'm in a simulation.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "tds_q3", "text": "I feel like I'm 'Watching Myself' from the ceiling or outside my body...", "domain": "trauma_dissociation", "subdomain": "depersonalization_axis", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Significant out-of-body feeling.", "severity_weight": 2 },
                { "text": "I am a total observer; I don't inhabit the meat.", "severity_weight": 3, "risk_weight": 2 }
            ], "insight_cloud": { "type": "clinical", "title": "The Upward Escape", "text": "Dissociation is the 'Third Defense'. If you can't fight or run, you 'Escape Inward'. It's not 'Crazy'; it's a creative way your brain found to survive things that were too painful to witness directly. Connection to the 'Senses' (Sight, Sound, Touch) is the anchor.", "source_name": "DES Scale Principles" }
        },
        {
            "id": "tds_q4", "text": "I look in the mirror and...", "domain": "trauma_dissociation", "subdomain": "mirror_identity", "options": [
                { "text": "See myself clearly.", "severity_weight": 0 },
                { "text": "See a stranger.", "severity_weight": 1 },
                { "text": "See a mask or hollow shape.", "severity_weight": 2 },
                { "text": "Don't recognize the person at all.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tds_q5", "text": "Do you lose time or find things you don't remember doing?", "domain": "trauma_dissociation", "subdomain": "fugue_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "Regularly; I lead multiple lives I don't recall.", "severity_weight": 3, "risk_weight": 4 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "focused", "risk_category": "low" },
            { "range": [4, 7], "label": "drifting", "risk_category": "low" },
            { "range": [8, 11], "label": "detached", "risk_category": "medium" },
            { "range": [12, 15], "label": "fragmented", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["trauma_startle"] = {
    "id": "trauma_startle",
    "title": "The Startle Reflex Audit",
    "version": "1.0",
    "description": "Assess your 'Nervous Alarm'. Discover if your 'Shock Absorbers' are worn down.",
    "primary_domain": "Trauma & Nervous System",
    "context_tags": ["Trauma", "Somatic", "Anxiety"],
    "theme_color": "#b91c1c",
    "questions": [
        {
            "id": "tsr_q1", "text": "When someone touches me unexpectedly, I...", "domain": "trauma_startle", "subdomain": "tactile_startle", "options": [
                { "text": "Just turn around.", "severity_weight": 0 },
                { "text": "Flinch a little.", "severity_weight": 1 },
                { "text": "Jump violently.", "severity_weight": 2 },
                { "text": "Go into a full-blown combat or defensive stance.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tsr_q2", "text": "Unexpected phone calls/texts at night cause me to...", "domain": "trauma_startle", "subdomain": "digital_shivers", "options": [
                { "text": "Be curious.", "severity_weight": 0 },
                { "text": "Be annoyed.", "severity_weight": 1 },
                { "text": "Feel a drop in my stomach.", "severity_weight": 2 },
                { "text": "Have a racing heart for hours.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tsr_q3", "text": "I am sensitive to bright lights or high-pitched sounds...", "domain": "trauma_startle", "subdomain": "sensory_sensitivity", "options": [
                { "text": "Not really.", "severity_weight": 0 },
                { "text": "A bit.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2 },
                { "text": "Extremely; they feel like physical pain.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Sensory Gating", "text": "During trauma, your 'Sensory Gating'—the ability to filter out background noise—breaks. You start hearing *everything* as a potential threat. Lowering 'Stimulation' and using 'Sensory Tools' (noise-canceling, soft light) is a valid medical intervention.", "source_name": "Neuro-Psychology Foundations" }
        },
        {
            "id": "tsr_q4", "text": "My 'Resting Heart Rate' is usually...", "domain": "trauma_startle", "subdomain": "autonomic_baseline", "options": [
                { "text": "Slow and steady.", "severity_weight": 0 },
                { "text": "A bit fast.", "severity_weight": 1 },
                { "text": "Always racing.", "severity_weight": 2 },
                { "text": "I can feel my heart beating in my throat always.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tsr_q5", "text": "Do you feel like your 'Body' is a ticking time bomb of panic?", "domain": "trauma_startle", "subdomain": "panic_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am one ping away from an explosion.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "steady", "risk_category": "low" },
            { "range": [4, 7], "label": "shaky", "risk_category": "low" },
            { "range": [8, 11], "label": "reactive", "risk_category": "medium" },
            { "range": [12, 15], "label": "startled", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["trauma_trust"] = {
    "id": "trauma_trust",
    "title": "The Safety Gap: Trust After Trauma",
    "version": "1.0",
    "description": "Assess your 'Relational Safety'. Discover if your 'Old Wolves' are guarding your 'New Doors'.",
    "primary_domain": "Trauma & Nervous System",
    "context_tags": ["Trauma", "Relationship", "Identity"],
    "theme_color": "#0369a1",
    "questions": [
        {
            "id": "ttt_q1", "text": "When someone gives me a compliment, my first internal response is to...", "domain": "trauma_trust", "subdomain": "reception_integrity", "options": [
                { "text": "Thank them.", "severity_weight": 0 },
                { "text": "Feel a bit shy.", "severity_weight": 1 },
                { "text": "Wonder what they want from me.", "severity_weight": 2 },
                { "text": "Identify the lie; they are mocking or manipulating me.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ttt_q2", "text": "Meeting 'New People' feels primarily like...", "domain": "trauma_trust", "subdomain": "relational_scanning", "options": [
                { "text": "An opportunity.", "severity_weight": 0 },
                { "text": "A standard social event.", "severity_weight": 1 },
                { "text": "An interrogation; I have to keep my guard up 100%.", "severity_weight": 2 },
                { "text": "A dangerous game of 'find the predator'.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ttt_q3", "text": "I feel that 'Everyone' is eventually going to let me down or hurt me...", "domain": "trauma_trust", "subdomain": "general_cynicism", "options": [
                { "text": "No, I trust some.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "It's an absolute law of the universe; no one is safe.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Betrayal Trauma", "text": "When a 'Safe Person' becomes a 'Source of Danger', the brain's trust-wiring is damaged. This 'Betrayal Trauma' can lead to 'Compensatory Self-Reliance'—the idea that you must never need anyone again. Learning to 'Need' is the bravest part of healing.", "source_name": "Relational Trauma Research" }
        },
        {
            "id": "ttt_q4", "text": "The idea of 'Vulnerability' (sharing weakness) feels...", "domain": "trauma_trust", "subdomain": "vulnerability_affect", "options": [
                { "text": "Connecting.", "severity_weight": 0 },
                { "text": "Difficult.", "severity_weight": 1 },
                { "text": "Like handing someone a weapon to use against me later.", "severity_weight": 2 },
                { "text": "Lethal.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ttt_q5", "text": "Do you feel like you are 'faking' being a normal social human to hide your inner fortress?", "domain": "trauma_trust", "subdomain": "masking_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Yes, I am a spy in my own social circle.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a fortress with a human-skin door.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "trusted", "risk_category": "low" },
            { "range": [4, 7], "label": "guarded", "risk_category": "low" },
            { "range": [8, 11], "label": "walled", "risk_category": "medium" },
            { "range": [12, 15], "label": "fortified", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["trauma_night_terrors"] = {
    "id": "trauma_night_terrors",
    "title": "The Night Terror Log",
    "version": "1.0",
    "description": "Assess 'Nocturnal Trauma'. Discover if your night is more dangerous than your day.",
    "primary_domain": "Trauma & Nervous System",
    "context_tags": ["Trauma", "Somatic", "Sleep"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "tnt_q1", "text": "I wake up 'Bolting' out of bed or screaming...", "domain": "trauma_night_terrors", "subdomain": "awakening_style", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Once a year.", "severity_weight": 1 },
                { "text": "Monthly.", "severity_weight": 2 },
                { "text": "Weekly or nightly.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "tnt_q2", "text": "I wake up 'Sweating' and my heart is 'Racing' even without a clear dream memory...", "domain": "trauma_night_terrors", "subdomain": "autonomic_nocturnal_arousal", "options": [
                { "text": "Rarely.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "Every time I sleep.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tnt_q3", "text": "I avoid 'Going to Sleep' because I'm afraid of what's waiting there...", "domain": "trauma_night_terrors", "subdomain": "sleep_avoidance", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often; I stay up until I collapse.", "severity_weight": 2 },
                { "text": "Always; I haven't slept 'normally' in years.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Sleep & High Alert", "text": "When you sleep, your prefrontal cortex (the logic) turns down, but your amygdala (the alarm) stays on. For trauma survivors, the lack of logic makes the fear feels 100% 'Real' and 'Immediate'. Using 'Sleep Hygiene' and 'Imagery Rehearsal' can help.", "source_name": "Sleep Medicine Research" }
        },
        {
            "id": "tnt_q4", "text": "I feel I 'Shouldn't' be dreaming about this anymore...", "domain": "trauma_night_terrors", "subdomain": "shame_layer", "options": [
                { "text": "No shame.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Strong guilt/shame.", "severity_weight": 2 },
                { "text": "I am disgusted by my own mind's creations.", "severity_weight": 3 }
            ]
        },
        {
            "id": "tnt_q5", "text": "Do you feel like you are 'living' two separate, painful lives: one day, one night?", "domain": "trauma_night_terrors", "subdomain": "double_life_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent traveler in the dark.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "resting", "risk_category": "low" },
            { "range": [4, 7], "label": "disturbed", "risk_category": "low" },
            { "range": [8, 11], "label": "terrored", "risk_category": "medium" },
            { "range": [12, 15], "label": "shaken", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["trauma_regulation"] = {
    "id": "trauma_regulation",
    "title": "The Regulation Lab",
    "version": "1.0",
    "description": "Assess your 'Braking System'. Discover if you can slow down your own panic.",
    "primary_domain": "Trauma & Nervous System",
    "context_tags": ["Trauma", "Somatic", "Anxiety"],
    "theme_color": "#166534",
    "questions": [
        {
            "id": "trg_q1", "text": "When I am upset, I can 'Bring Myself Back' to calm using only my breath...", "domain": "trauma_regulation", "subdomain": "breath_efficacy", "options": [
                { "text": "Yes, reliably.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Rarely; I need a physical 'Out'.", "severity_weight": 2 },
                { "text": "Never; my breath feels like I'm choking when I'm upset.", "severity_weight": 3 }
            ]
        },
        {
            "id": "trg_q2", "text": "I use 'Sensory Grounding' (5-4-3-2-1 method) effectively...", "domain": "trauma_regulation", "subdomain": "sensory_grounding_skill", "options": [
                { "text": "Yes.", "severity_weight": 0 },
                { "text": "I've heard of it but struggle.", "severity_weight": 1 },
                { "text": "It doesn't work for me.", "severity_weight": 2 },
                { "text": "I am too dissociated to even try.", "severity_weight": 3 }
            ]
        },
        {
            "id": "trg_q3", "text": "I feel like I 'Need' to move my body (shaking, jumping, running) during stress...", "domain": "trauma_regulation", "subdomain": "motor_discharge_urge", "options": [
                { "text": "I listen to these urges.", "severity_weight": 0 },
                { "text": "I ignore them.", "severity_weight": 1 },
                { "text": "I feel like I'm 'trapped' in my body and can't move.", "severity_weight": 2 },
                { "text": "I freeze entirely and 'Go Away' internally.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "Co-Regulation vs Self-Regulation", "text": "You weren't meant to regulate alone. If you didn't have safe caregivers to 'Co-Regulate' with as a child, your 'Self-Regulation' wiring is thin. Healing is about 'Borrowing' the calm of a safe person (therapist, partner) until you can build your own.", "source_name": "Neuro-Physiology of Attachment" }
        },
        {
            "id": "trg_q4", "text": "My use of 'Self-Care' (baths, walks, tea) feels...", "domain": "trauma_regulation", "subdomain": "self_care_integrity", "options": [
                { "text": "Grounded and helpful.", "severity_weight": 0 },
                { "text": "A bit performative.", "severity_weight": 1 },
                { "text": "Useless; 'band-aids for a bullet wound'.", "severity_weight": 2 },
                { "text": "Taunting; I am too broken for tea to help.", "severity_weight": 3 }
            ]
        },
        {
            "id": "trg_q5", "text": "Do you feel like you are 'beyond repair' and regulation is just a lie people tell?", "domain": "trauma_regulation", "subdomain": "hopelessness_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent living malfunction.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "regulated", "risk_category": "low" },
            { "range": [4, 7], "label": "working", "risk_category": "low" },
            { "range": [8, 11], "label": "fragile", "risk_category": "medium" },
            { "range": [12, 15], "label": "disconnected", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["loneliness_digital"] = {
    "id": "loneliness_digital",
    "title": "The Digital Mirror: Screen Isolation",
    "version": "1.0",
    "description": "Assess the gap between 'Online Connection' and 'Physical Presence'. Discover if your social life is a hologram.",
    "primary_domain": "Loneliness & Connection",
    "context_tags": ["Loneliness", "Digital", "Social"],
    "theme_color": "#4f46e5",
    "questions": [
        {
            "id": "ldg_q1", "text": "After spending 2 hours on social media, I feel...", "domain": "loneliness_digital", "subdomain": "post_screen_affect", "options": [
                { "text": "Connected and informed.", "severity_weight": 0 },
                { "text": "A bit drained.", "severity_weight": 1 },
                { "text": "More alone than when I started.", "severity_weight": 2 },
                { "text": "Like a hollow ghost watching a party I'm not invited to.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ldg_q2", "text": "The number of 'Likes' or 'Views' I get changes my mood for the day...", "domain": "loneliness_digital", "subdomain": "validation_dependency", "options": [
                { "text": "Not at all.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2 },
                { "text": "It's the only thing that makes me feel 'real' or 'seen'.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ldg_q3", "text": "I find it harder to talk to people 'In Person' than through a screen...", "domain": "loneliness_digital", "subdomain": "social_atrophy", "options": [
                { "text": "No, I prefer in-person.", "severity_weight": 0 },
                { "text": "About the same.", "severity_weight": 1 },
                { "text": "Yes, screen is my safety barrier.", "severity_weight": 2 },
                { "text": "I have almost entirely lost the ability to maintain eye contact or live conversation.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Paradox of Choice", "text": "Digital connection offers 'Breadcrumbs' of sociality without the 'Nutrients' of physical presence (oxytocin, touch, micro-expressions). This leads to 'Hyper-Connectivity' alongside 'Terminal Loneliness'. You aren't 'Connected'; you are 'Tethered'.", "source_name": "Digital Sociology Research" }
        },
        {
            "id": "ldg_q4", "text": "My phone is the 'First Thing' I reach for when I feel a moment of boredom or silence...", "domain": "loneliness_digital", "subdomain": "reflexive_distraction", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Always.", "severity_weight": 2 },
                { "text": "It's a biological extension of my arm; I can't be 'alone' without it.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ldg_q5", "text": "Do you feel like you are 'performing' your life for an audience that doesn't actually care?", "domain": "loneliness_digital", "subdomain": "performative_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Yes, I am a content-creator, not a human.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a flickering image with no soul.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "grounded", "risk_category": "low" },
            { "range": [4, 7], "label": "scrolling", "risk_category": "low" },
            { "range": [8, 11], "label": "digitized", "risk_category": "medium" },
            { "range": [12, 15], "label": "holographic", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["loneliness_urban"] = {
    "id": "loneliness_urban",
    "title": "The Urban Desert",
    "version": "1.0",
    "description": "Assess 'Solitude in the City'. Discover if the crowd is making you invisible.",
    "primary_domain": "Loneliness & Connection",
    "context_tags": ["Loneliness", "Social", "Environment"],
    "theme_color": "#64748b",
    "questions": [
        {
            "id": "lub_q1", "text": "Wandering through a crowded street or subway makes me feel...", "domain": "loneliness_urban", "subdomain": "crowd_affect", "options": [
                { "text": "Part of a vibrant world.", "severity_weight": 0 },
                { "text": "Neutral.", "severity_weight": 1 },
                { "text": "Like a pebble in an ocean; zero impact.", "severity_weight": 2 },
                { "text": "Crushed by the realization that nobody here cares if I live or die.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lub_q2", "text": "I know my neighbors' names or talk to them regularly...", "domain": "loneliness_urban", "subdomain": "local_friction", "options": [
                { "text": "Yes, many.", "severity_weight": 0 },
                { "text": "One or two.", "severity_weight": 1 },
                { "text": "I recognize faces but no names.", "severity_weight": 2 },
                { "text": "Zero; we are ghosts living in stacked boxes.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lub_q3", "text": "I feel like a 'Tourist' in my own life or city...", "domain": "loneliness_urban", "subdomain": "belonging_deficit", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Always; I have no 'Home Base'.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Urban Anomie", "text": "High-density living often leads to 'Social Overload', causing people to 'Withdraw' into themselves for protection. This creates a paradox where you are physically surrounded but socially malnourished. 'Weak Ties'—smiling at the barista—are the clinical first step.", "source_name": "Sociology of Urban Loneliness" }
        },
        {
            "id": "lub_q4", "text": "The idea of a 'Free Weekend' with zero plans makes me...", "domain": "loneliness_urban", "subdomain": "unstructured_time_dread", "options": [
                { "text": "Excited to rest.", "severity_weight": 0 },
                { "text": "A bit bored.", "severity_weight": 1 },
                { "text": "Anxious about the silence.", "severity_weight": 2 },
                { "text": "Terrified of the void.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lub_q5", "text": "Do you feel like your 'presence' doesn't cast a shadow in this city?", "domain": "loneliness_urban", "subdomain": "invisibility_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am transparent.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "integrated", "risk_category": "low" },
            { "range": [4, 7], "label": "resident", "risk_category": "low" },
            { "range": [8, 11], "label": "anonymous", "risk_category": "medium" },
            { "range": [12, 15], "label": "invisible", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["loneliness_void"] = {
    "id": "loneliness_void",
    "title": "The Relational Void",
    "version": "1.0",
    "description": "Assess the 'Quality' of your 3 AM calls. Discover if you have 'People' or 'Partners'.",
    "primary_domain": "Loneliness & Connection",
    "context_tags": ["Loneliness", "Relationship", "Social"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "lrv_q1", "text": "If I had a major crisis at 3 AM tonight, I would call...", "domain": "loneliness_void", "subdomain": "safety_net_depth", "options": [
                { "text": "A reliable person who would definitely answer.", "severity_weight": 0 },
                { "text": "Someone, but I'd feel bad for bothering them.", "severity_weight": 1 },
                { "text": "The emergency services; I have no one personally.", "severity_weight": 2 },
                { "text": "No one; I'd just sit in the dark and wait.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "lrv_q2", "text": "I feel that my friends truly 'Know' my inner struggles...", "domain": "loneliness_void", "subdomain": "depth_visibility", "options": [
                { "text": "Yes, all of them.", "severity_weight": 0 },
                { "text": "Some of them.", "severity_weight": 1 },
                { "text": "None of them; I keep it hidden.", "severity_weight": 2 },
                { "text": "I have no real friends, only acquaintances.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lrv_q3", "text": "I find myself 'Mimicking' or 'Mirroring' others' personalities to be liked because my real self is too lonely...", "domain": "loneliness_void", "subdomain": "performative_belonging", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "It's the only way I can function socially.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Social Hunger", "text": "Loneliness isn't about being 'Alone'; it's about being 'Unseen'. You can have 100 people around you and still feel a 'Void' if you aren't authentic with them. Authentic vulnerability is the only cure for chronic loneliness.", "source_name": "Attachment & Connection Studies" }
        },
        {
            "id": "lrv_q4", "text": "The frequency of 'Deep, Soul-Feeding' conversations in my life is...", "domain": "loneliness_void", "subdomain": "conversational_nutrients", "options": [
                { "text": "Weekly.", "severity_weight": 0 },
                { "text": "Monthly.", "severity_weight": 1 },
                { "text": "Yearly.", "severity_weight": 2 },
                { "text": "I can't remember the last one.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lrv_q5", "text": "Do you feel like you are 'screaming into a vacuum' when you try to reach out?", "domain": "loneliness_void", "subdomain": "resonance_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent signal in an empty universe.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "connected", "risk_category": "low" },
            { "range": [4, 7], "label": "friended", "risk_category": "low" },
            { "range": [8, 11], "label": "isolated", "risk_category": "medium" },
            { "range": [12, 15], "label": "void-bound", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["loneliness_house"] = {
    "id": "loneliness_house",
    "title": "The Silent House",
    "version": "1.0",
    "description": "Assess the 'Acoustics' of your living space. Discover if your home is a sanctuary or a cell.",
    "primary_domain": "Loneliness & Connection",
    "context_tags": ["Loneliness", "Somatic", "Home"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "lsh_q1", "text": "When I return to an empty home, my first feeling is...", "domain": "loneliness_house", "subdomain": "homecoming_affect", "options": [
                { "text": "Relief and peace.", "severity_weight": 0 },
                { "text": "Standard routine.", "severity_weight": 1 },
                { "text": "A heavy weight in the chest.", "severity_weight": 2 },
                { "text": "A physical punch of loneliness; I want to leave immediately.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lsh_q2", "text": "I leave the TV or Podcast playing 24/7 just to have 'Background Noise'...", "domain": "loneliness_house", "subdomain": "acoustic_dependency", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Always; I can't handle the silence.", "severity_weight": 2 },
                { "text": "I feel like I'm dying without a human voice playing.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lsh_q3", "text": "The idea of eating 'Dinner Alone' at a table feels...", "domain": "loneliness_house", "subdomain": "solitary_rituals", "options": [
                { "text": "Fine; I enjoy my own company.", "severity_weight": 0 },
                { "text": "A bit sad.", "severity_weight": 1 },
                { "text": "Pathetic; I eat on the couch or bed instead.", "severity_weight": 2 },
                { "text": "Agonizing; I often skip meals to avoid the feeling.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Touch Hunger", "text": "Living in a 'Silent House' often leads to 'Skin Hunger' or 'Touch Starvation'—a physical deficiency in skin-to-skin contact. Since your brain needs this for brain health, the 'House' starts to feel like a 'Void'. Using weighted blankets or pets can provide a temporary biological bridge.", "source_name": "Environmental Psychology" }
        },
        {
            "id": "lsh_q4", "text": "My home decor (photos, objects) feels...", "domain": "loneliness_house", "subdomain": "environmental_echoes", "options": [
                { "text": "Representative of me.", "severity_weight": 0 },
                { "text": "A bit random.", "severity_weight": 1 },
                { "text": "Like a museum of a person I used to be.", "severity_weight": 2 },
                { "text": "Like a warehouse; there is no 'me' here.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lsh_q5", "text": "Do you feel like your 'house' is slowly eating your personality?", "domain": "loneliness_house", "subdomain": "environmental_erosion_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am being absorbed by the drywall.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "sheltered", "risk_category": "low" },
            { "range": [4, 7], "label": "solitary", "risk_category": "low" },
            { "range": [8, 11], "label": "confined", "risk_category": "medium" },
            { "range": [12, 15], "label": "imprisoned", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["loneliness_witness"] = {
    "id": "loneliness_witness",
    "title": "The Missing Witness",
    "version": "1.0",
    "description": "Assess the 'Loss of Narrative'. Discover if your life is real if no one saw it happen.",
    "primary_domain": "Loneliness & Connection",
    "context_tags": ["Loneliness", "Identity", "Existential"],
    "theme_color": "#111827",
    "questions": [
        {
            "id": "lmw_q1", "text": "When something 'Significant' happens (good or bad), my immediate thought is...", "domain": "loneliness_witness", "subdomain": "narrative_impulse", "options": [
                { "text": "I'll tell [Person] soon.", "severity_weight": 0 },
                { "text": "I'll post about it.", "severity_weight": 1 },
                { "text": "I have no one to tell who would care.", "severity_weight": 2 },
                { "text": "It doesn't matter anyway.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lmw_q2", "text": "I feel that 'My Story' is only existing inside my own head...", "domain": "loneliness_witness", "subdomain": "internal_narrative_solitude", "options": [
                { "text": "No, others share it.", "severity_weight": 0 },
                { "text": "Partially.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "Entirely; I am an unread book.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lmw_q3", "text": "The feeling of 'Invisible' is my primary daily state...", "domain": "loneliness_witness", "subdomain": "visibility_affect", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "Always; I am a ghost walking through light.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Witness Deficit", "text": "Humans are 'Social Storytellers'. We need a 'Witness'—someone who remembers our last week, our favorite food, our specific fears—to feel 'Concrete'. Without a witness, our identity starts to feel 'Fluid' and 'Fragile'. Keeping a journal is a way to 'Witness Yourself'.", "source_name": "Developmental Narratology" }
        },
        {
            "id": "lmw_q4", "text": "My 'Self-Talk' has become more frequent or vocal because there's no one else to talk to...", "domain": "loneliness_witness", "subdomain": "vocal_solitude", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2 },
                { "text": "I am my only conversational partner.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lmw_q5", "text": "Do you feel like you are 'fading away' at the edges?", "domain": "loneliness_witness", "subdomain": "dissipation_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Yes, I am dissolving.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am already a vapor.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "documented", "risk_category": "low" },
            { "range": [4, 7], "label": "private", "risk_category": "low" },
            { "range": [8, 11], "label": "unwitnessed", "risk_category": "medium" },
            { "range": [12, 15], "label": "erased", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["loneliness_belonging"] = {
    "id": "loneliness_belonging",
    "title": "The Belonging Debt",
    "version": "1.0",
    "description": "Assess your 'Social Bankruptcy'. Discover if you are 'Paying' too much for 'Belonging'.",
    "primary_domain": "Loneliness & Connection",
    "context_tags": ["Loneliness", "Social", "Identity"],
    "theme_color": "#064e3b",
    "questions": [
        {
            "id": "lbd_q1", "text": "In a social group, I feel like I'm 'Earning' my spot through performance or utility...", "domain": "loneliness_belonging", "subdomain": "conditional_belonging", "options": [
                { "text": "No, I'm just there.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2 },
                { "text": "I have no spot unless I provide for them.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lbd_q2", "text": "I feel 'Less Than' or 'Excluded' even when I am physically present with friends...", "domain": "loneliness_belonging", "subdomain": "internal_exclusion", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Always; I am the 'Extra' person.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lbd_q3", "text": "I would 'Betray My Own Values' just to stay in a group and not be alone...", "domain": "loneliness_belonging", "subdomain": "compliance_logic", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "I have already done it; I am a slave to the group consensus.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "Performative Belonging", "text": "When you belong 'Conditionally', you are still lonely because the 'Real You' isn't there. This 'Belonging Debt' creates a deep resentment. Real belonging is being 'Fully Known' and 'Fully Accepted'.", "source_name": "Social Psychology of Belonging" }
        },
        {
            "id": "lbd_q4", "text": "The 'Cost' of my social life (energy, money, lies) is...", "domain": "loneliness_belonging", "subdomain": "social_overhead", "options": [
                { "text": "Rewarding.", "severity_weight": 0 },
                { "text": "Average.", "severity_weight": 1 },
                { "text": "Too high.", "severity_weight": 2 },
                { "text": "Bankruptcy; I am hollowed out by my 'Friends'.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lbd_q5", "text": "Do you feel like you are 'paying rent' just to exist in other people's lives?", "domain": "loneliness_belonging", "subdomain": "transactional_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent debtor.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "integrated", "risk_category": "low" },
            { "range": [4, 7], "label": "contributing", "risk_category": "low" },
            { "range": [8, 11], "label": "indebted", "risk_category": "medium" },
            { "range": [12, 15], "label": "bankrupt", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["loneliness_terminal"] = {
    "id": "loneliness_terminal",
    "title": "The Terminal Aloneness",
    "version": "1.0",
    "description": "Assess 'Existential Solitude'. Discover if you believe you will die alone and what that means.",
    "primary_domain": "Loneliness & Connection",
    "context_tags": ["Loneliness", "Existential", "Identity"],
    "theme_color": "#000000",
    "questions": [
        {
            "id": "ltm_q1", "text": "I feel that deep down, 'No One' can ever truly understand another human...", "domain": "loneliness_terminal", "subdomain": "existential_isolation", "options": [
                { "text": "No, connection is possible.", "severity_weight": 0 },
                { "text": "It's hard but possible.", "severity_weight": 1 },
                { "text": "It's mostly impossible.", "severity_weight": 2 },
                { "text": "We are all permanent islands with no bridges.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ltm_q2", "text": "The idea of 'Dying Alone' is a fear that hits me...", "domain": "loneliness_terminal", "subdomain": "mortality_solitude", "options": [
                { "text": "Rarely.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Regularly.", "severity_weight": 2 },
                { "text": "Every single night; it's an agonizing certainty.", "severity_weight": 3, "risk_weight": 2 }
            ]
        },
        {
            "id": "ltm_q3", "text": "I have stopped 'Trying' to connect because the pain of failure is worse than the loneliness...", "domain": "loneliness_terminal", "subdomain": "resignation_logic", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Recently.", "severity_weight": 1 },
                { "text": "Yearly.", "severity_weight": 2 },
                { "text": "I am in a permanent state of social withdrawal.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "Existential Loneliness", "text": "This is a higher-level loneliness. It's the 'Human Condition'—the fact that we are born alone and die alone. Healing here isn't about more 'Friends'; it's about 'Existential Acceptance' and 'Spiritual Connection' to something larger than the self.", "source_name": "Yalom's Existential Psychotherapy" }
        },
        {
            "id": "ltm_q4", "text": "The feeling of 'Cosmic' loneliness—like being a tiny dot in an empty universe—is...", "domain": "loneliness_terminal", "subdomain": "cosmic_solitude", "options": [
                { "text": "Awe-inspiring.", "severity_weight": 0 },
                { "text": "Neutral.", "severity_weight": 1 },
                { "text": "Sad.", "severity_weight": 2 },
                { "text": "Crushing and nihilistic.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ltm_q5", "text": "Do you feel like you are already a 'ghost' just waiting for the body to catch up?", "domain": "loneliness_terminal", "subdomain": "ghosting_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 2 },
                { "text": "Yes, I am a permanent inhabitant of the void.", "severity_weight": 3, "risk_weight": 4 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "accepted", "risk_category": "low" },
            { "range": [4, 7], "label": "pondering", "risk_category": "low" },
            { "range": [8, 11], "label": "drifting", "risk_category": "medium" },
            { "range": [12, 15], "label": "void-bound", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["grief_anticipatory"] = {
    "id": "grief_anticipatory",
    "title": "The Anticipatory Shadow",
    "version": "1.0",
    "description": "Assess 'Grief Before Loss'. Discover if you are mourning a person who is still here.",
    "primary_domain": "Grief & Loss",
    "context_tags": ["Grief", "Anxiety", "Relationship"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "gas_q1", "text": "When I am with [Person], I find myself already 'Saying Goodbye' in my head...", "domain": "grief_anticipatory", "subdomain": "pre_loss_detachment", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Every time I see them; I am already in the future.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gas_q2", "text": "I feel 'Guilt' for wanting the illness or difficult situation to 'just end'...", "domain": "grief_anticipatory", "subdomain": "compassion_fatigue_shame", "options": [
                { "text": "No guilt.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Significant guilt.", "severity_weight": 2 },
                { "text": "I am consumed by the shame of wanting release.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gas_q3", "text": "I find it hard to 'Actually Connect' with them now because I'm so focused on the 'End'...", "domain": "grief_anticipatory", "subdomain": "presence_erosion", "options": [
                { "text": "No, I am fully present.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Regularly.", "severity_weight": 2 },
                { "text": "I have already 'Gone Away' to protect myself.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Anticipatory Grief", "text": "Grief doesn't start at the funeral. For many, it starts at the diagnosis. You are mourning the 'Future' you were supposed to have. This can lead to 'Premature Detachment'—a biological way your brain tries to soften the eventual hit.", "source_name": "Thanatology Research" }
        },
        {
            "id": "gas_q4", "text": "My 'Caregiving' duties have completely replaced our 'Relationship'...", "domain": "grief_anticipatory", "subdomain": "role_distortion", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "Entirely; I am a nurse/aide, not a partner/child.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gas_q5", "text": "Do you feel like you are 'waiting for a bell to ring' all day long?", "domain": "grief_anticipatory", "subdomain": "vigilance_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent inhabitant of the 'Waiting Room'.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "present", "risk_category": "low" },
            { "range": [4, 7], "label": "shadowed", "risk_category": "low" },
            { "range": [8, 11], "label": "mourning", "risk_category": "medium" },
            { "range": [12, 15], "label": "detached", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["grief_ghost_room"] = {
    "id": "grief_ghost_room",
    "title": "The Ghost Room: Domestic Absence",
    "version": "1.0",
    "description": "Assess the 'Space' they left behind. Discover if your home is a cemetery or a sanctuary.",
    "primary_domain": "Grief & Loss",
    "context_tags": ["Grief", "Somatic", "Home"],
    "theme_color": "#475569",
    "questions": [
        {
            "id": "ggr_q1", "text": "When I look at their 'Unchanged Objects' (clothes, desk, mug), I feel...", "domain": "grief_ghost_room", "subdomain": "artifact_affect", "options": [
                { "text": "Warmth.", "severity_weight": 0 },
                { "text": "Sadness.", "severity_weight": 1 },
                { "text": "A physical punch to the gut.", "severity_weight": 2 },
                { "text": "Terror; I feel I have to keep them exactly as they were or I'll lose the person again.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ggr_q2", "text": "I avoid 'Certain Rooms' in my own house because the silence is too violent...", "domain": "grief_ghost_room", "subdomain": "spatial_avoidance", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "Entirely; my house is a series of 'No-Go Zones'.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ggr_q3", "text": "The feeling that they are 'About to Walk Through the Door' is...", "domain": "grief_ghost_room", "subdomain": "hallucinatory_presence", "options": [
                { "text": "A nice fantasy.", "severity_weight": 0 },
                { "text": "A fleeting thought.", "severity_weight": 1 },
                { "text": "A constant, agonizing expectation.", "severity_weight": 2 },
                { "text": "I literally hear their footsteps or voice.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "The Searching Phase", "text": "In the early stages of grief, your brain is wired to 'Search' for the missing member of the pack. This is why you 'See' them in crowds or 'Hear' them in the house. It's a biological correction for a sudden void.", "source_name": "Bowlby's Attachment & Loss" }
        },
        {
            "id": "ggr_q4", "text": "Cleaning or moving their things feels like...", "domain": "grief_ghost_room", "subdomain": "erasure_fear", "options": [
                { "text": "Productive.", "severity_weight": 0 },
                { "text": "Difficult.", "severity_weight": 1 },
                { "text": "Like I'm murdering them again.", "severity_weight": 2 },
                { "text": "Impossible; I am paralyzed by the preservation of their ghost.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ggr_q5", "text": "Do you feel like you are 'living in a tomb' rather than a home?", "domain": "grief_ghost_room", "subdomain": "tomb_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am the caretaker of a cemetery.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "remembrance", "risk_category": "low" },
            { "range": [4, 7], "label": "haunted", "risk_category": "low" },
            { "range": [8, 11], "label": "shrine-bound", "risk_category": "medium" },
            { "range": [12, 15], "label": "entombed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["grief_digital"] = {
    "id": "grief_digital",
    "title": "The Digital Afterlife",
    "version": "1.0",
    "description": "Assess 'Grief in the Algorithm'. Discover if their social profile is helping or hurting you.",
    "primary_domain": "Grief & Loss",
    "context_tags": ["Grief", "Digital", "Identity"],
    "theme_color": "#312e81",
    "questions": [
        {
            "id": "gdi_q1", "text": "I look at their 'Social Media' profile...", "domain": "grief_digital", "subdomain": "digital_shrine_frequency", "options": [
                { "text": "Rarely.", "severity_weight": 0 },
                { "text": "Monthly.", "severity_weight": 1 },
                { "text": "Daily.", "severity_weight": 2 },
                { "text": "Dozens of times a day; I am waiting for it to change.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gdi_q2", "text": "I 'Listen' to their old voice notes or 'Watch' old videos of them repeatedly...", "domain": "grief_digital", "subdomain": "acoustic_preservation", "options": [
                { "text": "Occasionally.", "severity_weight": 0 },
                { "text": "When I'm sad.", "severity_weight": 1 },
                { "text": "Every night to fall asleep.", "severity_weight": 2 },
                { "text": "I have them playing on a loop; I can't stand the silence without them.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gdi_q3", "text": "The idea of 'Deleting' their contact or 'Removing' their profile is...", "domain": "grief_digital", "subdomain": "digital_erasure_paralyis", "options": [
                { "text": "A standard step.", "severity_weight": 0 },
                { "text": "Difficult.", "severity_weight": 1 },
                { "text": "Terrifying; like they'll be gone 'forever' if I do.", "severity_weight": 2 },
                { "text": "Unthinkable; I keep their phone charged to see notifications.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Digital Immortality", "text": "Unlike the past, our dead now live on in 'Servers'. They 'Pop Up' as memories on Facebook or 'Suggestions' in contacts. This creates 'Chronic Semi-Presence' that can prevent the brain from fully integrating the finality of the loss.", "source_name": "Digital Thanatology Studies" }
        },
        {
            "id": "gdi_q4", "text": "I 'Post' to their wall or 'Tag' them in things as if they are reading...", "domain": "grief_digital", "subdomain": "narrative_continuation", "options": [
                { "text": "Sometimes.", "severity_weight": 0 },
                { "text": "Often.", "severity_weight": 1 },
                { "text": "Every day; it's my primary form of 'connection'.", "severity_weight": 2 },
                { "text": "I am having full conversations with their account.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "gdi_q5", "text": "Do you feel like you are 'haunted' by a smartphone?", "domain": "grief_digital", "subdomain": "algorithmic_ghosting_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am trapped in a digital loop of the dead.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "recorded", "risk_category": "low" },
            { "range": [4, 7], "label": "preserving", "risk_category": "low" },
            { "range": [8, 11], "label": "looping", "risk_category": "medium" },
            { "range": [12, 15], "label": "digitally-haunted", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["grief_delayed"] = {
    "id": "grief_delayed",
    "title": "The Delayed Impact",
    "version": "1.0",
    "description": "Assess 'The Wave'. Discover if you are 'Fine' or just 'Frozen'.",
    "primary_domain": "Grief & Loss",
    "context_tags": ["Grief", "Anxiety", "Somatic"],
    "theme_color": "#111827",
    "questions": [
        {
            "id": "gdi2_q1", "text": "At the time of the loss, my primary reaction was...", "domain": "grief_delayed", "subdomain": "initial_shock_depth", "options": [
                { "text": "Emotional and raw.", "severity_weight": 0 },
                { "text": "Focused on logistics.", "severity_weight": 1 },
                { "text": "Shocked and numb.", "severity_weight": 2 },
                { "text": "Total blankness; I felt nothing at all.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gdi2_q2", "text": "People commented on how 'Strong' and 'Handled' I was...", "domain": "grief_delayed", "subdomain": "social_masking_integrity", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Yes, I was the one holding it together.", "severity_weight": 1 },
                { "text": "Constant praise for my 'resilience'.", "severity_weight": 2 },
                { "text": "I was 'too fine'; people were worried.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gdi2_q3", "text": "Now (months/years later), I feel 'Sudden' waves of intense pain over small things...", "domain": "grief_delayed", "subdomain": "surge_reactivity", "options": [
                { "text": "Rarely.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2 },
                { "text": "The dam is finally breaking and it's terrifying.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "Inhibited Grief", "text": "If you weren't 'Safe' to grieve at the time (had to work, care for kids, survive), your brain 'Stored' the grief. This 'Inhibited Grief' eventually resurfaces as 'Delayed Impact'. It's not a new problem; it's the 'Original Debt' coming due.", "source_name": "Worden's Tasks of Mourning" }
        },
        {
            "id": "gdi2_q4", "text": "My 'Physical Health' (illness, pain) has dropped since the loss...", "domain": "grief_delayed", "subdomain": "somatic_conversion", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Significant drop.", "severity_weight": 2 },
                { "text": "My body is finally breaking under the weight of the 'Strength' I showed.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gdi2_q5", "text": "Do you feel like you are 'living on borrowed time' before a total collapse?", "domain": "grief_delayed", "subdomain": "collapse_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a crumbling dam.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "integrated", "risk_category": "low" },
            { "range": [4, 7], "label": "delayed", "risk_category": "low" },
            { "range": [8, 11], "label": "surging", "risk_category": "medium" },
            { "range": [12, 15], "label": "breaking", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["grief_somatic"] = {
    "id": "grief_somatic",
    "title": "The Physical Grief",
    "version": "1.0",
    "description": "Assess 'The Weight'. Discover where the loss is sitting in your bones.",
    "primary_domain": "Grief & Loss",
    "context_tags": ["Grief", "Somatic", "Pain"],
    "theme_color": "#7c2d12",
    "questions": [
        {
            "id": "gps_q1", "text": "My chest feels like there is a 'Heavy Stone' sitting on it...", "domain": "grief_somatic", "subdomain": "visceral_weight", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Regularly.", "severity_weight": 2 },
                { "text": "I can't take a deep breath; it's crushing.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gps_q2", "text": "My appetite or digestion since the loss is...", "domain": "grief_somatic", "subdomain": "enteric_disturbance", "options": [
                { "text": "Normal.", "severity_weight": 0 },
                { "text": "A bit off.", "severity_weight": 1 },
                { "text": "I can't taste food anymore.", "severity_weight": 2 },
                { "text": "I have to force myself to eat; my throat is closed.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gps_q3", "text": "I feel 'Exhausted' to the point of being unable to stand, even after sleeping...", "domain": "grief_somatic", "subdomain": "adenosine_crash", "options": [
                { "text": "Rarely.", "severity_weight": 0 },
                { "text": "Often.", "severity_weight": 1 },
                { "text": "Always.", "severity_weight": 2 },
                { "text": "I am a living battery that has been drained to zero.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Grief Brain/Body", "text": "Grief is a 'Full-Body System Reboot'. Your brain is working overtime to map a world that no longer contains the lost person. This takes massive amounts of physical glucose and ATP. You aren't 'Lazy'; you are 'Relocating' your soul.", "source_name": "Biological Thanatology" }
        },
        {
            "id": "gps_q4", "text": "My 'Skin' or 'Limbs' feel cold or pins-and-needles without cause...", "domain": "grief_somatic", "subdomain": "autonomic_cooling", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "I feel like I'm made of ice or wood.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gps_q5", "text": "Do you feel like 'death' has leaked into your own physical cells?", "domain": "grief_somatic", "subdomain": "cellular_mourning_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am dying from the inside out.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "stable", "risk_category": "low" },
            { "range": [4, 7], "label": "heavy", "risk_category": "low" },
            { "range": [8, 11], "label": "weighted", "risk_category": "medium" },
            { "range": [12, 15], "label": "crushed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["grief_anniversary"] = {
    "id": "grief_anniversary",
    "title": "The Anniversary Spike",
    "version": "1.0",
    "description": "Assess 'The Calendar of Pain'. Discover if the dates are hunting you.",
    "primary_domain": "Grief & Loss",
    "context_tags": ["Grief", "Anxiety", "Identity"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "gap_q1", "text": "As a 'Certain Date' approaches, my mood starts to...", "domain": "grief_anniversary", "subdomain": "pre_strike_affect", "options": [
                { "text": "Stay normal.", "severity_weight": 0 },
                { "text": "Be a bit anxious.", "severity_weight": 1 },
                { "text": "Identify the dread clearly.", "severity_weight": 2 },
                { "text": "I experience a total emotional meltdown days before.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gap_q2", "text": "I feel like I'm 'Reliving' the exact timeline of the loss as the date nears...", "domain": "grief_anniversary", "subdomain": "temporal_reliving", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Significant timeline reliving.", "severity_weight": 2 },
                { "text": "I am back in that week/day entirely.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "gap_q3", "text": "The 'Birthdays' or 'Holidays' feel like a 'Mockery' of my pain...", "domain": "grief_anniversary", "subdomain": "festivity_dissonance", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2 },
                { "text": "I hate the world on those days; it should stop.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Anniversary Reaction", "text": "Your body has its own 'Internal Calendar'. Even if you forget the date mentally, your nervous system remembers the 'Season' and 'Light Levels' of the trauma. This is a 'Somatic Echo'. Preparing with 'Self-Compassion Rituals' is the antidote.", "source_name": "Post-Traumatic Growth Research" }
        },
        {
            "id": "gap_q4", "text": "My ability to 'Function' at work/school during these spikes is...", "domain": "grief_anniversary", "subdomain": "functional_impairment", "options": [
                { "text": "Fine.", "severity_weight": 0 },
                { "text": "Difficult.", "severity_weight": 1 },
                { "text": "Impossible; I take time off.", "severity_weight": 2 },
                { "text": "I am a total wreck; people are scared.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "gap_q5", "text": "Do you feel like you are 'trapped on a wheel' of pain that never stops spinning?", "domain": "grief_anniversary", "subdomain": "cyclical_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent passenger on the 'Pain Train'.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "navigating", "risk_category": "low" },
            { "range": [4, 7], "label": "spiking", "risk_category": "low" },
            { "range": [8, 11], "label": "cycling", "risk_category": "medium" },
            { "range": [12, 15], "label": "trapped", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["grief_role"] = {
    "id": "grief_role",
    "title": "The Role Collapse",
    "version": "1.0",
    "description": "Assess 'Identity Loss'. Discover who you are when [Role] is gone.",
    "primary_domain": "Grief & Loss",
    "context_tags": ["Grief", "Identity", "Relationship"],
    "theme_color": "#064e3b",
    "questions": [
        {
            "id": "grl_q1", "text": "Since the loss, I feel like I have 'Lost My Title' (wife, husband, child, friend)...", "domain": "grief_role", "subdomain": "titular_void", "options": [
                { "text": "I am still me.", "severity_weight": 0 },
                { "text": "It feels a bit weird.", "severity_weight": 1 },
                { "text": "Significant identity crisis.", "severity_weight": 2 },
                { "text": "I have no idea who I am anymore; I am an 'Ex-[Role]'.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "grl_q2", "text": "I find myself 'Performing' duties I didn't used to do, and it feels like a heavy coat...", "domain": "grief_role", "subdomain": "role_accretion", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Significant role burden.", "severity_weight": 2 },
                { "text": "I am buried under the weight of being 'Both' parents/people.", "severity_weight": 3 }
            ]
        },
        {
            "id": "grl_q3", "text": "When people ask 'How are you?', I feel like a liar because 'I' don't exist anymore...", "domain": "grief_role", "subdomain": "authenticity_deficit", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Always; I am a suit of clothes with no person inside.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Secondary Losses", "text": "Death isn't just one loss. It's a series of 'Secondary Losses'—the loss of the person who cooked, the person who made you laugh, the person who made you feel safe. You have to 'Re-Author' your own life story from scratch.", "source_name": "Narrative Therapy in Grief" }
        },
        {
            "id": "grl_q4", "text": "My 'Future Plans' have entirely dissolved...", "domain": "grief_role", "subdomain": "future_collapse", "options": [
                { "text": "No, I have new ones.", "severity_weight": 0 },
                { "text": "Partially.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "I can't see past next Tuesday; the future is a black wall.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "grl_q5", "text": "Do you feel like you 'died with them'?", "domain": "grief_role", "subdomain": "identity_extinction_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Yes, I am a permanent ghost.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am buried in the same grave.", "severity_weight": 3, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "adapting", "risk_category": "low" },
            { "range": [4, 7], "label": "unsteady", "risk_category": "low" },
            { "range": [8, 11], "label": "lost", "risk_category": "medium" },
            { "range": [12, 15], "label": "erased", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["grief_unfinished"] = {
    "id": "grief_unfinished",
    "title": "The Unfinished Business",
    "version": "1.0",
    "description": "Assess 'The Things Unsaid'. Discover if the silence is screaming.",
    "primary_domain": "Grief & Loss",
    "context_tags": ["Grief", "Relationship", "Identity"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "gub_q1", "text": "I feel 'Regret' or 'Guilt' over our last conversation or meeting...", "domain": "grief_unfinished", "subdomain": "final_moment_integrity", "options": [
                { "text": "No regret; it was good.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Significant regret.", "severity_weight": 2 },
                { "text": "I would give anything to delete that moment.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "gub_q2", "text": "I 'Talk to Them' in my mind to apologize or explain things...", "domain": "grief_unfinished", "subdomain": "reparative_internal_dialogue", "options": [
                { "text": "Rarely.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Daily.", "severity_weight": 2 },
                { "text": "It's my primary mental activity; I am begging for forgiveness.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gub_q3", "text": "I feel that if I had 'Done [Action]', they would still be here...", "domain": "grief_unfinished", "subdomain": "causal_guilt", "options": [
                { "text": "No, it wasn't my fault.", "severity_weight": 0 },
                { "text": "A tiny bit of doubt.", "severity_weight": 1 },
                { "text": "Strong belief in my own failure.", "severity_weight": 2 },
                { "text": "I am the reason for their death; an absolute certainty.", "severity_weight": 3, "risk_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Complicated Grief", "text": "Unfinished business—unresolved anger, secrets, or guilt—is the primary driver of 'Complicated Grief'. It keeps the wound 'Open' and preventing 'Integration'. Clinical tools like the 'Empty Chair' or 'Final Letter' are highly effective here.", "source_name": "Clinical Thanatology" }
        },
        {
            "id": "gub_q4", "text": "I see 'Signs' from them (birds, songs, numbers) that I interpret as signals...", "domain": "grief_unfinished", "subdomain": "semiotic_preservation", "options": [
                { "text": "Rarely.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "I live in a world of codes and signs from the beyond.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gub_q5", "text": "Do you feel like you are 'waiting for an answer' that will never come?", "domain": "grief_unfinished", "subdomain": "stalling_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent question mark.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "resolved", "risk_category": "low" },
            { "range": [4, 7], "label": "pondering", "risk_category": "low" },
            { "range": [8, 11], "label": "nagging", "risk_category": "medium" },
            { "range": [12, 15], "label": "haunted", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["grief_collective"] = {
    "id": "grief_collective",
    "title": "The Collective Mourning",
    "version": "1.0",
    "description": "Assess 'The World's Pain'. Discover if you are carrying the weight of the globe.",
    "primary_domain": "Grief & Loss",
    "context_tags": ["Grief", "Social", "Environment"],
    "theme_color": "#111827",
    "questions": [
        {
            "id": "gcm_q1", "text": "When I hear about 'Global Tragedies' (wars, disasters), I feel...", "domain": "grief_collective", "subdomain": "global_empathy_depth", "options": [
                { "text": "Sympathy.", "severity_weight": 0 },
                { "text": "Distorted and sad.", "severity_weight": 1 },
                { "text": "Personally attacked/broken.", "severity_weight": 2 },
                { "text": "A total extinction of hope for humanity.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gcm_q2", "text": "I feel 'Guilty' for being safe or 'Moving On' when others are suffering...", "domain": "grief_collective", "subdomain": "survivor_guilt_logic", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "It's a permanent stain on my soul.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gcm_q3", "text": "I have stopped 'Planning for the Future' because the world feels doomed...", "domain": "grief_collective", "subdomain": "civilizational_despair", "options": [
                { "text": "No, I'm optimistic.", "severity_weight": 0 },
                { "text": "Skeptical.", "severity_weight": 1 },
                { "text": "Significant despair.", "severity_weight": 2 },
                { "text": "I am a nihilist; everything is a house of cards.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "Eco-Grief/Global Grief", "text": "We are 'Collective Creatures'. When the 'Social Fabric' is torn by global violence or environmental loss, we feel 'Systemic Grief'. You aren't 'Too Sensitive'; you are 'Digitally Over-Exposed' and 'Relationally Under-Supported'. Rest is a revolutionary act.", "source_name": "Social Psychology of Disaster" }
        },
        {
            "id": "gcm_q4", "text": "The frequency of 'News Checking' in my life is...", "domain": "grief_collective", "subdomain": "surveillance_dependency", "options": [
                { "text": "Weekly.", "severity_weight": 0 },
                { "text": "Daily.", "severity_weight": 1 },
                { "text": "Hourly.", "severity_weight": 2 },
                { "text": "I am 'Doom-Scrolling' until I black out.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "gcm_q5", "text": "Do you feel like you are 'grieving the future' of the whole world?", "domain": "grief_collective", "subdomain": "extinction_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent mourner for the planet.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "observant", "risk_category": "low" },
            { "range": [4, 7], "label": "concerned", "risk_category": "low" },
            { "range": [8, 11], "label": "overwhelmed", "risk_category": "medium" },
            { "range": [12, 15], "label": "hopeless", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["grief_integration"] = {
    "id": "grief_integration",
    "title": "The Integration Meter",
    "version": "1.0",
    "description": "Assess 'The New Normal'. Discover if you are learning to walk with the ghost.",
    "primary_domain": "Grief & Loss",
    "context_tags": ["Grief", "Adaptation", "Identity"],
    "theme_color": "#166534",
    "questions": [
        {
            "id": "gin_q1", "text": "I can now 'Talk About Them' without a total breakdown...", "domain": "grief_integration", "subdomain": "verbal_fluency", "options": [
                { "text": "Yes, easily.", "severity_weight": 0 },
                { "text": "Mostly.", "severity_weight": 1 },
                { "text": "Rarely.", "severity_weight": 2 },
                { "text": "Never; I avoid their name like a curse.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gin_q2", "text": "I find myself 'Laughing' or 'Enjoying Life' without immediate guilt...", "domain": "grief_integration", "subdomain": "joy_permission", "options": [
                { "text": "Yes.", "severity_weight": 0 },
                { "text": "Getting there.", "severity_weight": 1 },
                { "text": "It feels like betrayal.", "severity_weight": 2 },
                { "text": "I have forgotten what 'Joy' even smells like.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gin_q3", "text": "I feel that 'My Life' can still be meaningful even without [Person]...", "domain": "grief_integration", "subdomain": "purpose_re_authorization", "options": [
                { "text": "Yes, I'm building it.", "severity_weight": 0 },
                { "text": "I hope so.", "severity_weight": 1 },
                { "text": "Doubtful.", "severity_weight": 2 },
                { "text": "The meaning died with them; I am just a ghost in a machine.", "severity_weight": 3, "risk_weight": 2 }
            ], "insight_cloud": { "type": "clinical", "title": "Continuing Bonds", "text": "Grief isn't about 'Getting Over' someone; it's about 'Bringing Them With You'. You are moving from a 'Physical Bond' to a 'Spiritual/Internal Bond'. When you can tell their stories and laugh, you have successfully integrated the loss.", "source_name": "Continuing Bonds Theory" }
        },
        {
            "id": "gin_q4", "text": "My ability to 'Face the Future' without fear of another loss is...", "domain": "grief_integration", "subdomain": "resilience_axis", "options": [
                { "text": "Solid.", "severity_weight": 0 },
                { "text": "Moderate.", "severity_weight": 1 },
                { "text": "Fragile.", "severity_weight": 2 },
                { "text": "Zero; I am waiting for the next death.", "severity_weight": 3 }
            ]
        },
        {
            "id": "gin_q5", "text": "Do you feel like you are 'learning a new language' for a world that is fundamentally different?", "domain": "grief_integration", "subdomain": "paradigm_shift_risk", "risk_flag": true, "options": [
                { "text": "Yes, I am fluent.", "severity_weight": 0 },
                { "text": "I'm learning.", "severity_weight": 1 },
                { "text": "I'm failing the class.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "I am illiterate and alone.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "integrated", "risk_category": "low" },
            { "range": [4, 7], "label": "adapting", "risk_category": "low" },
            { "range": [8, 11], "label": "lingering", "risk_category": "medium" },
            { "range": [12, 15], "label": "paralyzed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["youth_comparison"] = {
    "id": "youth_comparison",
    "title": "The Comparison Cage",
    "version": "1.0",
    "description": "Assess 'Social Media Dysmorphia'. Discover if your feed is poisoning your self-worth.",
    "primary_domain": "Adolescents & Youth",
    "context_tags": ["Youth", "Social Media", "Identity"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "ycc_q1", "text": "After scrolling for 20 minutes, my mood is usually...", "domain": "youth_comparison", "subdomain": "post_scroll_affect", "options": [
                { "text": "Inspired/Better.", "severity_weight": 0 },
                { "text": "Neutral.", "severity_weight": 1 },
                { "text": "Slightly worse.", "severity_weight": 2 },
                { "text": "I feel like a total failure compared to everyone else.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ycc_q2", "text": "I 'Photoshop' or 'Filter' my photos because the real me isn't good enough...", "domain": "youth_comparison", "subdomain": "image_distortion_gravity", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "I won't post anything unless it's been 'perfected'.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ycc_q3", "text": "I feel 'Anxious' if my post doesn't get a certain number of likes within the first hour...", "domain": "youth_comparison", "subdomain": "validation_latency", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2 },
                { "text": "I delete it if the numbers aren't high enough.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "Upward Social Comparison", "text": "Humans are wired to compare. But in the past, you compared yourself to 10 neighbors. Now, you compare yourself to 'The Global 1%'. This 'Infinite Comparison' creates a permanent sense of 'Inadequacy' because there is always someone better/richer/prettier on the screen.", "source_name": "Digital Youth Psychology" }
        },
        {
            "id": "ycc_q4", "text": "I find myself 'Spying' on people I don't like just to see if they're doing worse than me...", "domain": "youth_comparison", "subdomain": "aggressive_monitoring", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "It's a daily ritual of spite.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ycc_q5", "text": "Do you feel like you are 'performing' your life rather than living it?", "domain": "youth_comparison", "subdomain": "performative_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent actor in my own movie.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "centered", "risk_category": "low" },
            { "range": [4, 7], "label": "distracted", "risk_category": "low" },
            { "range": [8, 11], "label": "shaken", "risk_category": "medium" },
            { "range": [12, 15], "label": "caged", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["youth_academic"] = {
    "id": "youth_academic",
    "title": "The Academic Weight",
    "version": "1.0",
    "description": "Assess 'Grade Anxiety'. Discover if your GPA has replaced your personality.",
    "primary_domain": "Adolescents & Youth",
    "context_tags": ["Youth", "Academic", "Anxiety"],
    "theme_color": "#1e40af",
    "questions": [
        {
            "id": "yaw_q1", "text": "Getting a 'B' or worse feels like...", "domain": "youth_academic", "subdomain": "perfectionism_threshold", "options": [
                { "text": "Information for next time.", "severity_weight": 0 },
                { "text": "Disappointing.", "severity_weight": 1 },
                { "text": "A disaster.", "severity_weight": 2 },
                { "text": "The end of my future; total worthlessness.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "yaw_q2", "text": "I feel that my parents' love is 'Conditional' on my performance...", "domain": "youth_academic", "subdomain": "conditional_regard", "options": [
                { "text": "No, they love me anyway.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Significant pressure.", "severity_weight": 2 },
                { "text": "I am only as good as my last test score.", "severity_weight": 3 }
            ]
        },
        {
            "id": "yaw_q3", "text": "I have 'Sacrificed' sleep, friends, or health to keep my rank...", "domain": "youth_academic", "subdomain": "resource_exhaustion", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Yearly.", "severity_weight": 2 },
                { "text": "I have no life; I am a Grade-Producing Machine.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Achievement Culture", "text": "Modern youth are under 'Hyper-Pressure'. The path to a 'Good Life' seems narrower than ever. This creates 'Chronic Cortisol Elevation'. When a child's worth is tied to 'Output', they lose the ability to 'Play'—which is the primary way the brain develops resilience.", "source_name": "Educational Psychology Monitor" }
        },
        {
            "id": "yaw_q4", "text": "When I'm not studying, I feel 'Guilty', like I'm falling behind...", "domain": "youth_academic", "subdomain": "idleness_shame", "options": [
                { "text": "Rarely.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Always; relaxation is a sign of weakness/failure.", "severity_weight": 3 }
            ]
        },
        {
            "id": "yaw_q5", "text": "Do you feel like you are 'running a race' that has no finish line?", "domain": "youth_academic", "subdomain": "burnout_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, and my legs are already broken.", "severity_weight": 3, "risk_weight": 3 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "learning", "risk_category": "low" },
            { "range": [4, 7], "label": "striving", "risk_category": "low" },
            { "range": [8, 11], "label": "burdened", "risk_category": "medium" },
            { "range": [12, 15], "label": "collapsing", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["youth_future"] = {
    "id": "youth_future",
    "title": "The Future Uncertainty",
    "version": "1.0",
    "description": "Assess 'Existential Dread'. Discover if the upcoming years feel like an open door or a closing trap.",
    "primary_domain": "Adolescents & Youth",
    "context_tags": ["Youth", "Identity", "Anxiety"],
    "theme_color": "#111827",
    "questions": [
        {
            "id": "yfu_q1", "text": "When I think about the year 2030, I feel...", "domain": "youth_future", "subdomain": "long_term_projection", "options": [
                { "text": "Excited.", "severity_weight": 0 },
                { "text": "Neutral.", "severity_weight": 1 },
                { "text": "Anxious.", "severity_weight": 2 },
                { "text": "Numb and hopeless; I can't even imagine it.", "severity_weight": 3 }
            ]
        },
        {
            "id": "yfu_q2", "text": "The phrase 'What do you want to be?' makes me feel...", "domain": "youth_future", "subdomain": "vocation_dread", "options": [
                { "text": "Motivated.", "severity_weight": 0 },
                { "text": "Annoyed.", "severity_weight": 1 },
                { "text": "Panicked.", "severity_weight": 2 },
                { "text": "Like a fraud; I have no 'Self' to offer.", "severity_weight": 3 }
            ]
        },
        {
            "id": "yfu_q3", "text": "I feel that the 'Big Problems' (climate, AI, economy) have already ruined my chances...", "domain": "youth_future", "subdomain": "systemic_despair", "options": [
                { "text": "No, I'll adapt.", "severity_weight": 0 },
                { "text": "Skeptically.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "Entirely; why even try if it's all ending?", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "Eco-Anxiety/Pre-Grief", "text": "Gen Z and Gen Alpha are the first generations to be 'Digitally Aware' of global extinction risks before they even reach puberty. This creates 'Pre-Grief'—anxiety about a 'Lost Future' that hasn't happened yet. Validation of these fears is the first step to agency.", "source_name": "Lancet Planetary Health" }
        },
        {
            "id": "yfu_q4", "text": "The pressure to be 'Unique' or 'Exceptional' is...", "domain": "youth_future", "subdomain": "originality_burden", "options": [
                { "text": "A fun challenge.", "severity_weight": 0 },
                { "text": "Heavy.", "severity_weight": 1 },
                { "text": "Crushing.", "severity_weight": 2 },
                { "text": "It has paralyzed me; I would rather be no one.", "severity_weight": 3 }
            ]
        },
        {
            "id": "yfu_q5", "text": "Do you feel like 'time is running out' even though you are young?", "domain": "youth_future", "subdomain": "temporal_compression_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am 16 and already 'Late' for life.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "navigating", "risk_category": "low" },
            { "range": [4, 7], "label": "drifting", "risk_category": "low" },
            { "range": [8, 11], "label": "dreading", "risk_category": "medium" },
            { "range": [12, 15], "label": "paralyzed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["youth_pressure"] = {
    "id": "youth_pressure",
    "title": "The Peer Pressure Vortex",
    "version": "1.0",
    "description": "Assess 'Tribal Compliance'. Discover if you are making your own choices.",
    "primary_domain": "Adolescents & Youth",
    "context_tags": ["Youth", "Social", "Identity"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "ypp_q1", "text": "I do 'Stupid Things' just because my friends are doing them...", "domain": "youth_pressure", "subdomain": "herd_compliance", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Sometimes.", "severity_weight": 2 },
                { "text": "All the time; I can't say 'No' to the group.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ypp_q2", "text": "The fear of being 'Canceled' or 'Ostracized' from my group is...", "domain": "youth_pressure", "subdomain": "social_excommunication_dread", "options": [
                { "text": "Low.", "severity_weight": 0 },
                { "text": "Moderate.", "severity_weight": 1 },
                { "text": "High.", "severity_weight": 2 },
                { "text": "It controls every word that comes out of my mouth.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "ypp_q3", "text": "I feel 'Exhausted' by the need to 'Always Be Available' on chat/Snap...", "domain": "youth_pressure", "subdomain": "digital_vigilance", "options": [
                { "text": "No, I like it.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2 },
                { "text": "I am a slave to the notification bubble.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Social Brain", "text": "For teens, 'Social Death' is felt by the brain as 'Physical Threat'. The need to belong is absolute. This creates 'Tribal Compliance' where you prioritize'Group Survival' over 'Personal Values'. Learning to be 'Safely Alone' is the key development task.", "source_name": "Developmental Neuroscience" }
        },
        {
            "id": "ypp_q4", "text": "I hide my 'Real Interests' because my friends would find them weird...", "domain": "youth_pressure", "subdomain": "interest_suppression", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Entirely; they don't know the real me at all.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ypp_q5", "text": "Do you feel like you are just a 'copy' of your friend group?", "domain": "youth_pressure", "subdomain": "mimesis_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I have no original features left.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "individual", "risk_category": "low" },
            { "range": [4, 7], "label": "group-sync", "risk_category": "low" },
            { "range": [8, 11], "label": "compliant", "risk_category": "medium" },
            { "range": [12, 15], "label": "erased", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["youth_persona"] = {
    "id": "youth_persona",
    "title": "The Digital Persona",
    "version": "1.0",
    "description": "Assess 'The Mask'. Discover if your online self has eaten your real self.",
    "primary_domain": "Adolescents & Youth",
    "context_tags": ["Youth", "Digital", "Identity"],
    "theme_color": "#334155",
    "questions": [
        {
            "id": "ydp_q1", "text": "I feel more 'Powerful' and 'Myself' when I am online than offline...", "domain": "youth_persona", "subdomain": "digital_empowerment_bias", "options": [
                { "text": "No, I prefer offline.", "severity_weight": 0 },
                { "text": "Equal.", "severity_weight": 1 },
                { "text": "Online is better.", "severity_weight": 2 },
                { "text": "Offline is just a boring waiting room for the internet.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ydp_q2", "text": "I have 'Alt Accounts' or 'Finstas' where I show a completely different person...", "domain": "youth_persona", "subdomain": "identity_fragmentation", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "One/Two for fun.", "severity_weight": 1 },
                { "text": "Several; I am a different person on each.", "severity_weight": 2 },
                { "text": "I am so fragmented I don't know which one is the 'Base' anymore.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "ydp_q3", "text": "The feedback (likes, comments) on my persona affects my 'Physical Body' (heart race, sweat)...", "domain": "youth_persona", "subdomain": "somatic_sync", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "I am physically wired into the server; my body reacts to data.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Avatar Trap", "text": "When you invest all your 'Identity Capital' into an 'Avatar', your real body feels like a 'Limitation'. This can lead to 'Depersonalization'—feeling like a ghost in a machine. Integration of 'All Selves' is the only path to sanity.", "source_name": "Cyberpsychology Review" }
        },
        {
            "id": "ydp_q4", "text": "I 'Lied' about my age, location, or life online to feel more interesting...", "domain": "youth_persona", "subdomain": "narrative_falsification", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Small things.", "severity_weight": 1 },
                { "text": "Significant lies.", "severity_weight": 2 },
                { "text": "My entire online life is a fiction.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "ydp_q5", "text": "Do you feel like your 'profile' is more real than your person?", "domain": "youth_persona", "subdomain": "simulation_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, my body is just a battery for my profile.", "severity_weight": 3, "risk_weight": 4 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "authentic", "risk_category": "low" },
            { "range": [4, 7], "label": "filtering", "risk_category": "low" },
            { "range": [8, 11], "label": "masking", "risk_category": "medium" },
            { "range": [12, 15], "label": "dissociated", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["youth_friction"] = {
    "id": "youth_friction",
    "title": "The Parental Friction",
    "version": "1.0",
    "description": "Assess 'The Generational Gap'. Discover if your home is a battlefield or a base.",
    "primary_domain": "Adolescents & Youth",
    "context_tags": ["Youth", "Family", "Relationship"],
    "theme_color": "#991b1b",
    "questions": [
        {
            "id": "ypf_q1", "text": "Talking to my parents about 'Real Stuff' (emotions, problems) is...", "domain": "youth_friction", "subdomain": "disclosure_safety", "options": [
                { "text": "Easy/Open.", "severity_weight": 0 },
                { "text": "Hard but possible.", "severity_weight": 1 },
                { "text": "Terrifying/Dangerous.", "severity_weight": 2 },
                { "text": "Impossible; they are the last people I would tell.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ypf_q2", "text": "I feel that they 'Don't Understand' the world I live in (digital, social)...", "domain": "youth_friction", "subdomain": "empathy_gap", "options": [
                { "text": "They try.", "severity_weight": 0 },
                { "text": "Moderate gap.", "severity_weight": 1 },
                { "text": "Large gap.", "severity_weight": 2 },
                { "text": "They are on a different planet; zero connection.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ypf_q3", "text": "The 'Arguments' at home leave me feeling...", "domain": "youth_friction", "subdomain": "conflict_residue", "options": [
                { "text": "Heard/Resolved.", "severity_weight": 0 },
                { "text": "A bit annoyed.", "severity_weight": 1 },
                { "text": "Deeply hurt/angry.", "severity_weight": 2 },
                { "text": "Traumatized and shut down.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "Individuation vs. Rebellion", "text": "Arguments are part of 'Individuation'—the process of becoming a separate person. But if the friction is 'Constant' and 'Hostile', it creates 'Attachment Trauma'. You aren't 'Bad'; you are 'Fighting for Autonomy' in a system that hasn't updated its rules.", "source_name": "Family Systems Theory" }
        },
        {
            "id": "ypf_q4", "text": "I feel I have to 'Perform' to get their approval...", "domain": "youth_friction", "subdomain": "performative_sonship", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "Always; I am a project, not a person.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ypf_q5", "text": "Do you feel like you are 'homeless' even when you are inside your house?", "domain": "youth_friction", "subdomain": "alienation_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent stranger here.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "connected", "risk_category": "low" },
            { "range": [4, 7], "label": "strained", "risk_category": "low" },
            { "range": [8, 11], "label": "alienated", "risk_category": "medium" },
            { "range": [12, 15], "label": "estranged", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["youth_body"] = {
    "id": "youth_body",
    "title": "The Body Image Mirror",
    "version": "1.0",
    "description": "Assess 'Physical Self-Worth'. Discover if you are at war with your reflection.",
    "primary_domain": "Adolescents & Youth",
    "context_tags": ["Youth", "Somatic", "Identity"],
    "theme_color": "#7c2d12",
    "questions": [
        {
            "id": "ybi_q1", "text": "When I see myself in a 'Mirror', the first thing I do is...", "domain": "youth_body", "subdomain": "primary_evaluative_bias", "options": [
                { "text": "Smile.", "severity_weight": 0 },
                { "text": "Fix my hair.", "severity_weight": 1 },
                { "text": "Find a flaw.", "severity_weight": 2 },
                { "text": "Cringe and look away entirely.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ybi_q2", "text": "I 'Skip Meals' or 'Over-Exercise' to change how I look...", "domain": "youth_body", "subdomain": "restrictive_behavior", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Weekly.", "severity_weight": 2 },
                { "text": "Daily; it's an obsession.", "severity_weight": 3, "risk_weight": 2 }
            ]
        },
        {
            "id": "ybi_q3", "text": "I compare my 'Physical Parts' to people on TikTok/Insta...", "domain": "youth_body", "subdomain": "comparative_dysmorphia", "options": [
                { "text": "Rarely.", "severity_weight": 0 },
                { "text": "When I'm bored.", "severity_weight": 1 },
                { "text": "Every time I'm online.", "severity_weight": 2 },
                { "text": "I have a mental list of all the things I need to 'Fix'.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Digital Mirror", "text": "Teens today look at their own faces in 'Cameras' more than any generation in history. This creates 'Zoom Dysmorphia'—the tendency to fixate on tiny flaws that aren't even visible to others. Your body is a 'Vehicle', not a 'Billboard'.", "source_name": "Journal of Eating Disorders" }
        },
        {
            "id": "ybi_q4", "text": "I feel that if I were 'Prettier/Stronger', my whole life would be fixed...", "domain": "youth_body", "subdomain": "physical_salvation_logic", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Significantly.", "severity_weight": 2 },
                { "text": "Yes, my body is the only thing holding me back.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ybi_q5", "text": "Do you feel like your body is an 'enemy' to be defeated?", "domain": "youth_body", "subdomain": "body_hostility_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent prisoner of a broken shell.", "severity_weight": 3, "risk_weight": 4 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "accepting", "risk_category": "low" },
            { "range": [4, 7], "label": "neutral", "risk_category": "low" },
            { "range": [8, 11], "label": "conflicted", "risk_category": "medium" },
            { "range": [12, 15], "label": "hostile", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["youth_sleep"] = {
    "id": "youth_sleep",
    "title": "The Sleep Debt",
    "version": "1.0",
    "description": "Assess 'The Midnight Scroll'. Discover if your brain is literal trash from no rest.",
    "primary_domain": "Adolescents & Youth",
    "context_tags": ["Youth", "Somatic", "Digital"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "ysl_q1", "text": "When the lights go out, the first thing I grab is...", "domain": "youth_sleep", "subdomain": "midnight_engagement", "options": [
                { "text": "A Pillow.", "severity_weight": 0 },
                { "text": "A Book.", "severity_weight": 1 },
                { "text": "My Phone.", "severity_weight": 2 },
                { "text": "It never left my hand.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ysl_q2", "text": "My 'Morning' mood is usually...", "domain": "youth_sleep", "subdomain": "circadian_recovery", "options": [
                { "text": "Rested.", "severity_weight": 0 },
                { "text": "Tired but fine.", "severity_weight": 1 },
                { "text": "Exhausted/Zombie.", "severity_weight": 2 },
                { "text": "I feel like I haven't slept in years.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ysl_q3", "text": "I find myself 'Falling Asleep' in class or during the day...", "domain": "youth_sleep", "subdomain": "microsleep_frequency", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Weekly.", "severity_weight": 2 },
                { "text": "Daily; I can't stay awake.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "The Glymphatic Flush", "text": "When you sleep, your brain 'Flushes' out toxins. If you don't sleep, those toxins stay there. This leads to 'Irritability', 'Brain Fog', and 'Emotional Volatility'. You aren't 'Depressed'; you might just be 'Chronically Unwashed' at the biological level.", "source_name": "Sleep Medicine Reviews" }
        },
        {
            "id": "ysl_q4", "text": "I use 'Caffeine' or 'Energy Drinks' to survive the day...", "domain": "youth_sleep", "subdomain": "stimulant_reliance", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Every morning.", "severity_weight": 2 },
                { "text": "I am vibrating on 4+ monster/coffees; it's my fuel.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ysl_q5", "text": "Do you feel like you are 'vibrating' rather than existing?", "domain": "youth_sleep", "subdomain": "fatigue_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent inhabitant of the 'Grey Zone'.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "rested", "risk_category": "low" },
            { "range": [4, 7], "label": "drowsy", "risk_category": "low" },
            { "range": [8, 11], "label": "deprived", "risk_category": "medium" },
            { "range": [12, 15], "label": "bankrupt", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["youth_privacy"] = {
    "id": "youth_privacy",
    "title": "The Privacy Tug-of-War",
    "version": "1.0",
    "description": "Assess 'The Secret Life'. Discover if you are hiding or just being yourself.",
    "primary_domain": "Adolescents & Youth",
    "context_tags": ["Youth", "Family", "Digital"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "ypw_q1", "text": "The idea of my parents 'Checking My Phone' makes me feel...", "domain": "youth_privacy", "subdomain": "surveillance_affect", "options": [
                { "text": "Fine; nothing to hide.", "severity_weight": 0 },
                { "text": "Annoyed.", "severity_weight": 1 },
                { "text": "Panicked.", "severity_weight": 2 },
                { "text": "Violated; I would rather they read my organs.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ypw_q2", "text": "I have 'Codes' and 'Hidden Apps' to protect my real life...", "domain": "youth_privacy", "subdomain": "obfuscation_depth", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "One or two.", "severity_weight": 1 },
                { "text": "Significant obfuscation.", "severity_weight": 2 },
                { "text": "I lead a full double-life; they know nothing.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ypw_q3", "text": "I feel that 'Nowhere' is safe from the eyes of others (parents, school, online)...", "domain": "youth_privacy", "subdomain": "panopticon_despair", "options": [
                { "text": "No, I have safe spaces.", "severity_weight": 0 },
                { "text": "Mostly safe.", "severity_weight": 1 },
                { "text": "Mostly unsafe.", "severity_weight": 2 },
                { "text": "I am always being watched; there is no 'Off' switch.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "The Panopticon Youth", "text": "Youth today have 'Zero Privacy'. Between GPS tracking, browser history, and social footprints, the ability to 'Secretly Experiment' (which is vital for growth) is gone. This creates 'Performative Goodness' which leads to a massive 'Authenticity Debt' later in life.", "source_name": "Digital Ethics Journal" }
        },
        {
            "id": "ypw_q4", "text": "I am 'Scared' that something I did years ago will be found and ruin me...", "domain": "youth_privacy", "subdomain": "temporal_surveillance_anxiety", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Every day; the 'Permanent Record' is a ghost that haunts me.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ypw_q5", "text": "Do you feel like you are 'living in a glass house'?", "domain": "youth_privacy", "subdomain": "exposure_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, and everyone has a rock.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "private", "risk_category": "low" },
            { "range": [4, 7], "label": "guarded", "risk_category": "low" },
            { "range": [8, 11], "label": "hiding", "risk_category": "medium" },
            { "range": [12, 15], "label": "exposed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["youth_authenticity"] = {
    "id": "youth_authenticity",
    "title": "The Authenticity Struggle",
    "version": "1.0",
    "description": "Assess 'The True Self'. Discover if you are actually here or just a collection of opinions.",
    "primary_domain": "Adolescents & Youth",
    "context_tags": ["Youth", "Identity", "Spiritual"],
    "theme_color": "#166534",
    "questions": [
        {
            "id": "yas2_q1", "text": "In a group, I find myself 'Changing My Opinion' just because it's popular...", "domain": "youth_authenticity", "subdomain": "ideological_mimesis", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Always; I have no independent stance.", "severity_weight": 3 }
            ]
        },
        {
            "id": "yas2_q2", "text": "If my phone was 'Gone Forever', the 'Person Left' would be...", "domain": "youth_authenticity", "subdomain": "core_self_integrity", "options": [
                { "text": "Strong/Real.", "severity_weight": 0 },
                { "text": "A bit lost.", "severity_weight": 1 },
                { "text": "A stranger.", "severity_weight": 2 },
                { "text": "Actually dead; I am the phone.", "severity_weight": 3, "risk_weight": 2 }
            ]
        },
        {
            "id": "yas2_q3", "text": "I feel that no one has ever seen 'The Real Me'—not even me...", "domain": "youth_authenticity", "subdomain": "intrinsic_alienation", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "I am a permanent mystery to myself; an empty room.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The False Self", "text": "In a world of'Metrics' (grades, likes, followers), youth develop a 'False Self' to survive. The 'True Self'—the messy, un-shareable, un-gradeable part of you—goes into 'Hiding'. Healing is the slow, scary process of 'Un-Curating' your own life.", "source_name": "Winnicott's Mature Identity" }
        },
        {
            "id": "yas2_q4", "text": "My 'Hobbies' are things I actually like, not just what's cool...", "domain": "youth_authenticity", "subdomain": "autonomous_engagement", "options": [
                { "text": "Yes, entirely.", "severity_weight": 0 },
                { "text": "Mostly.", "severity_weight": 1 },
                { "text": "Rarely.", "severity_weight": 2 },
                { "text": "I have no hobbies; I only consume what's 'Trending'.", "severity_weight": 3 }
            ]
        },
        {
            "id": "yas2_q5", "text": "Do you feel like a 'product' rather than a person?", "domain": "youth_authenticity", "subdomain": "commodify_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a permanent asset to be optimized.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "authentic", "risk_category": "low" },
            { "range": [4, 7], "label": "curating", "risk_category": "low" },
            { "range": [8, 11], "label": "masking", "risk_category": "medium" },
            { "range": [12, 15], "label": "anonymous", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["academic_exam"] = {
    "id": "academic_exam",
    "title": "The Exam Vortex",
    "version": "1.0",
    "description": "Assess 'Evaluation Dread'. Discover if you are studying or just surviving the panic.",
    "primary_domain": "Academic Stress",
    "context_tags": ["Students", "Academic", "Performance"],
    "theme_color": "#4ECDC4",
    "questions": [
        {
            "id": "ae_q1", "text": "When a major deadline or exam is 48 hours away, I feel...", "domain": "academic_exam", "subdomain": "anticipatory_panic", "options": [
                { "text": "Ready to focus.", "severity_weight": 0 },
                { "text": "Tense but functional.", "severity_weight": 1 },
                { "text": "Nauseous or lightheaded.", "severity_weight": 2 },
                { "text": "Paralyzed; I cannot even open the book.", "severity_weight": 3, "risk_weight": 1 }
            ]
        },
        {
            "id": "ae_q2", "text": "In the middle of a test, my memory...", "domain": "academic_exam", "subdomain": "cognitive_retrieval", "options": [
                { "text": "Works well.", "severity_weight": 0 },
                { "text": "Stutters occasionally.", "severity_weight": 1 },
                { "text": "Blanks out on things I definitely know.", "severity_weight": 2 },
                { "text": "Vanishes entirely; I see static.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ae_q3", "text": "I feel that my 'Worth' as a human is tied to this grade...", "domain": "academic_exam", "subdomain": "identity_conflation", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little bit.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "Yes, an 'F' means I am a failure at life.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Panic Block", "text": "When you are in 'High Stakes' mode, your prefrontal cortex (the logic part) shuts down to let the Amygdala (the survival part) take over. Unfortunately, the Amygdala doesn't know Calculus. You aren't 'Forgotten'; you are just 'Protected' too much.", "source_name": "Test Anxiety Inventory (TAI)" }
        },
        {
            "id": "ae_q4", "text": "After the exam, I spend the next few days...", "domain": "academic_exam", "subdomain": "post_event_rumination", "options": [
                { "text": "Moving on.", "severity_weight": 0 },
                { "text": "Feeling tired.", "severity_weight": 1 },
                { "text": "Replaying every mistake.", "severity_weight": 2 },
                { "text": "In a state of total emotional collapse.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ae_q5", "text": "Do you experience physical shakes or cold sweats before testing?", "domain": "academic_exam", "subdomain": "somatic_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, every single time.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "prepared", "risk_category": "low" },
            { "range": [4, 7], "label": "nervous", "risk_category": "low" },
            { "range": [8, 11], "label": "swallowed", "risk_category": "medium" },
            { "range": [12, 15], "label": "vortex", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["academic_fatigue"] = {
    "id": "academic_fatigue",
    "title": "Scholar Fatigue",
    "version": "1.0",
    "description": "Assess 'The Study Slump'. Discover if you are tired or just academically empty.",
    "primary_domain": "Academic Stress",
    "context_tags": ["Students", "Academic", "Burnout"],
    "theme_color": "#4ECDC4",
    "questions": [
        {
            "id": "af_q1", "text": "Reading a single paragraph of my textbook feels like...", "domain": "academic_fatigue", "subdomain": "cognitive_load", "options": [
                { "text": "Normal.", "severity_weight": 0 },
                { "text": "Slippery; I have to re-read it.", "severity_weight": 1 },
                { "text": "Climbing a mountain.", "severity_weight": 2 },
                { "text": "Staring at a wall of static.", "severity_weight": 3 }
            ]
        },
        {
            "id": "af_q2", "text": "I feel 'Bored' by things I used to find interesting in my major...", "domain": "academic_fatigue", "subdomain": "academic_anhedonia", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "Yes, I hate everything about this now.", "severity_weight": 3 }
            ]
        },
        {
            "id": "af_q3", "text": "I find myself 'Spacing Out' for hours without realizing it...", "domain": "academic_fatigue", "subdomain": "dissociative_avoidance", "options": [
                { "text": "Rarely.", "severity_weight": 0 },
                { "text": "Weekly.", "severity_weight": 1 },
                { "text": "Daily.", "severity_weight": 2 },
                { "text": "Most of the time I'm 'Studying'.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Academic Avolition", "text": "When the brain is over-saturated with information without recovery, it enters a state of 'Avolition'—the lack of drive to perform self-directed tasks. It's not laziness; it's a blown fuse.", "source_name": "MBI-Student Survey" }
        },
        {
            "id": "af_q4", "text": "I feel my brain is 'Full' and cannot take one more bit of info...", "domain": "academic_fatigue", "subdomain": "saturation_despair", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Constantly.", "severity_weight": 3 }
            ]
        },
        {
            "id": "af_q5", "text": "Do you feel like your 'Spark' for learning has died?", "domain": "academic_fatigue", "subdomain": "exhaustion_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Flickering.", "severity_weight": 1 },
                { "text": "Dead.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "I was never a spark; I'm just charcoal.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "fresh", "risk_category": "low" },
            { "range": [4, 7], "label": "dim", "risk_category": "low" },
            { "range": [8, 11], "label": "saturated", "risk_category": "medium" },
            { "range": [12, 15], "label": "emptied", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["academic_competition"] = {
    "id": "academic_competition",
    "title": "The Competition Trap",
    "version": "1.0",
    "description": "Assess 'Peer Comparison'. Discover if you are running your own race or someone else's.",
    "primary_domain": "Academic Stress",
    "context_tags": ["Students", "Academic", "Social"],
    "theme_color": "#4ECDC4",
    "questions": [
        {
            "id": "ac_q1", "text": "When I see a friend get a better grade, I feel...", "domain": "academic_competition", "subdomain": "comparative_affect", "options": [
                { "text": "Happy for them.", "severity_weight": 0 },
                { "text": "A bit jealous.", "severity_weight": 1 },
                { "text": "Like I failed.", "severity_weight": 2 },
                { "text": "Rage or deep depression.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ac_q2", "text": "I check my 'Rank' or 'Percentile' obsessively...", "domain": "academic_competition", "subdomain": "rank_fixation", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "Daily; it's the only number that matters.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ac_q3", "text": "I feel like I'm in a 'Race' that never ends...", "domain": "academic_competition", "subdomain": "systemic_pressure", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "Yes, and if I stop, I'll be trampled.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Relative Deprivation", "text": "You can be performing at the 90th percentile and still feel like a failure if you are surrounded by the 99th. This is 'Relative Deprivation'—feeling poor in a room of billionaires. Your progress is real, even if it's not 'The Best'.", "source_name": "Social Comparison Scale" }
        },
        {
            "id": "ac_q4", "text": "I avoid talking to peers because I'm scared they're 'Ahead' of me...", "domain": "academic_competition", "subdomain": "social_withdrawal_stress", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Always; everyone is a threat.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ac_q5", "text": "Do you feel like you are 'replaceable' if you aren't #1?", "domain": "academic_competition", "subdomain": "worth_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a commodity, not a person.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "individual", "risk_category": "low" },
            { "range": [4, 7], "label": "competitive", "risk_category": "low" },
            { "range": [8, 11], "label": "strained", "risk_category": "medium" },
            { "range": [12, 15], "label": "trapped", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["academic_dark_academia"] = {
    "id": "academic_dark_academia",
    "title": "The Dark Library",
    "version": "1.0",
    "description": "Assess 'Performative Struggle'. Discover if you are romanticizing your pain.",
    "primary_domain": "Academic Stress",
    "context_tags": ["Students", "Academic", "Identity"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "ada_q1", "text": "I feel that to be 'Smart', I must also be 'Miserable'...", "domain": "academic_dark_academia", "subdomain": "aesthetic_conflation", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Yes, true genius is suffering.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ada_q2", "text": "I post about my 'Burnout' or 'Late Nights' to feel validated as a student...", "domain": "academic_dark_academia", "subdomain": "performative_exhaustion", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "It's my entire online identity.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ada_q3", "text": "I ignore my 'Health' because I think it makes me more dedicated...", "domain": "academic_dark_academia", "subdomain": "martyrdom_myth", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Physical health is secondary to the 'Scholar'.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Romanticized Wound", "text": "Struggle can be beautiful in fiction, but in reality, it's physiological damage. Romanticizing burnout creates a feedback loop where you feel you 'Need' to be unwell to be worthy. You are worth more than your library carrel.", "source_name": "SAD-Scale Identity Research" }
        },
        {
            "id": "ada_q4", "text": "I feel 'Boring' if I'm not overextended...", "domain": "academic_dark_academia", "subdomain": "stability_dread", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Maybe.", "severity_weight": 1 },
                { "text": "Yes.", "severity_weight": 2 },
                { "text": "Stability feels like a failure of ambition.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ada_q5", "text": "Do you feel like you are 'performing' a student role rather than being one?", "domain": "academic_dark_academia", "subdomain": "alienation_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a set piece in a play.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "grounded", "risk_category": "low" },
            { "range": [4, 7], "label": "aesthetic", "risk_category": "low" },
            { "range": [8, 11], "label": "performative", "risk_category": "medium" },
            { "range": [12, 15], "label": "consumed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["academic_graduation"] = {
    "id": "academic_graduation",
    "title": "The Graduation Void",
    "version": "1.0",
    "description": "Assess 'Transition Dread'. Discover if you are scared of the finish line.",
    "primary_domain": "Academic Stress",
    "context_tags": ["Students", "Academic", "Future"],
    "theme_color": "#4ECDC4",
    "questions": [
        {
            "id": "ag_q1", "text": "Thinking about 'Life After University' makes me feel...", "domain": "academic_graduation", "subdomain": "transition_affect", "options": [
                { "text": "Excited.", "severity_weight": 0 },
                { "text": "Uncertain.", "severity_weight": 1 },
                { "text": "Terrified.", "severity_weight": 2 },
                { "text": "Like I'm falling off a cliff.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ag_q2", "text": "I feel that I have 'No Identity' outside of being a student...", "domain": "academic_graduation", "subdomain": "identity_closure", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A tiny bit.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "Yes, I don't know who I am without a GPA.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ag_q3", "text": "I am 'Sabotaging' my final projects just to stay in school longer...", "domain": "academic_graduation", "subdomain": "avoidance_procrastination", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Subconsciously maybe.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "Yes, I'm terrified of the exit.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Institutional Void", "text": "For years, you've had a 'Script' (syllabi, grades, exams). Graduation takes it away. This is 'Post-Graduation Transition Trauma'—the sudden loss of structure. It's okay to feel lost; you're not 'Failing', you're just 'Un-scripted'.", "source_name": "PGTS Transitions Metric" }
        },
        {
            "id": "ag_q4", "text": "I feel 'Old' or 'Finished' even though I'm just starting my career...", "domain": "academic_graduation", "subdomain": "temporal_despair", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "I feel my life is essentially over.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ag_q5", "text": "Do you feel like the 'Real World' is a predator waiting for you?", "domain": "academic_graduation", "subdomain": "threat_perception_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am being hunted by time.", "severity_weight": 3, "risk_weight": 4 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "ready", "risk_category": "low" },
            { "range": [4, 7], "label": "hesitant", "risk_category": "low" },
            { "range": [8, 11], "label": "stalling", "risk_category": "medium" },
            { "range": [12, 15], "label": "paralyzed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["academic_belonging"] = {
    "id": "academic_belonging",
    "title": "The Belonging Gap",
    "version": "1.0",
    "description": "Assess 'Social Fit'. Discover if you are part of the campus or just a ghost on it.",
    "primary_domain": "Academic Stress",
    "context_tags": ["Students", "Academic", "Social"],
    "theme_color": "#4ECDC4",
    "questions": [
        {
            "id": "ab_q1", "text": "Walking into a lecture hall, I feel like...", "domain": "academic_belonging", "subdomain": "member_perception", "options": [
                { "text": "A student here.", "severity_weight": 0 },
                { "text": "A guest.", "severity_weight": 1 },
                { "text": "An intruder.", "severity_weight": 2 },
                { "text": "A ghost; invisible.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ab_q2", "text": "I feel that my 'Background' (class, race, history) makes me 'Other' here...", "domain": "academic_belonging", "subdomain": "diversity_stress", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Yes, this place wasn't built for me.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ab_q3", "text": "I keep my 'Personal Life' a total secret from peers because they wouldn't get it...", "domain": "academic_belonging", "subdomain": "narrative_isolation", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Some parts.", "severity_weight": 1 },
                { "text": "Most parts.", "severity_weight": 2 },
                { "text": "Everything; I wear a mask 24/7.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Secret Curriculum", "text": "Belonging isn't just about grades; it's about 'Membership'. If you feel like you missed a memo everyone else got, you are likely experiencing 'Secret Curriculum' anxiety—the feeling that others know the unwritten rules of how to exist in this space. You aren't 'Out', you're just 'New'.", "source_name": "SOM-A Academic Research" }
        },
        {
            "id": "ab_q4", "text": "When I struggle, I feel it's 'My Fault' and not just a hard class...", "domain": "academic_belonging", "subdomain": "attributional_blame", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Always; struggle is proof I don't belong.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ab_q5", "text": "Do you feel like you are 'faking' your intelligence to stay here?", "domain": "academic_belonging", "subdomain": "imposter_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, it's only a matter of time before I'm caught.", "severity_weight": 3, "risk_weight": 4 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "member", "risk_category": "low" },
            { "range": [4, 7], "label": "visitor", "risk_category": "low" },
            { "range": [8, 11], "label": "outsider", "risk_category": "medium" },
            { "range": [12, 15], "label": "estranged", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["academic_perfectionist"] = {
    "id": "academic_perfectionist",
    "title": "The Perfectionist Student",
    "version": "1.0",
    "description": "Assess 'Maladaptive Striving'. Discover if your standards are keeping you from actually learning.",
    "primary_domain": "Academic Stress",
    "context_tags": ["Students", "Academic", "Personality"],
    "theme_color": "#4ECDC4",
    "questions": [
        {
            "id": "ap_q1", "text": "If I get a '90%' instead of a '100%', I feel...", "domain": "academic_perfectionist", "subdomain": "discrepancy_affect", "options": [
                { "text": "Proud.", "severity_weight": 0 },
                { "text": "Okay.", "severity_weight": 1 },
                { "text": "Devastated.", "severity_weight": 2 },
                { "text": "Like I may as well have failed entirely.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ap_q2", "text": "I spend hours 'Perfecting' the font or layout rather than the content...", "domain": "academic_perfectionist", "subdomain": "avoidance_fixation", "options": [
                { "text": "Never.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "Yes, if it's not 'Right', it can't be sent.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ap_q3", "text": "I feel my 'Mistakes' are crimes I need to hide...", "domain": "academic_perfectionist", "subdomain": "shame_binding", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sort of.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "Yes, a mistake is a stain on my soul.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Paradox of High Standards", "text": "High standards are healthy. But when a 99 feels like a 0, that's not 'Standard', that's 'Shame'. You are replacing 'Curiosity' with 'Vigilance'. You aren't 'Learning'; you are 'Avoiding Judgment'.", "source_name": "FMPS Perfectionism Standard" }
        },
        {
            "id": "ap_q4", "text": "I avoid 'Hard' classes because I'm scared I won't get an A...", "domain": "academic_perfectionist", "subdomain": "low_risk_avoidance", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Maybe.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "I only do things I am already 'The Best' at.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ap_q5", "text": "Do you feel like you are 'not allowed' to be a beginner?", "domain": "academic_perfectionist", "subdomain": "growth_block_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I was born to be finished, not to start.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "striving", "risk_category": "low" },
            { "range": [4, 7], "label": "exacting", "risk_category": "low" },
            { "range": [8, 11], "label": "maladaptive", "risk_category": "medium" },
            { "range": [12, 15], "label": "paralyzed", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["academic_focus"] = {
    "id": "academic_focus",
    "title": "The Focus Fragment",
    "version": "1.0",
    "description": "Assess 'Attention Saturation'. Discover if your brain is offline or just overloaded.",
    "primary_domain": "Academic Stress",
    "context_tags": ["Students", "Academic", "Digital"],
    "theme_color": "#4ECDC4",
    "questions": [
        {
            "id": "af2_q1", "text": "I can sit and study for 60 minutes without checking my phone...", "domain": "academic_focus", "subdomain": "attention_span", "options": [
                { "text": "Yes, easily.", "severity_weight": 0 },
                { "text": "With effort.", "severity_weight": 1 },
                { "text": "Rarely.", "severity_weight": 2 },
                { "text": "I cannot even make it 5 minutes without a 'Hit' of distraction.", "severity_weight": 3 }
            ]
        },
        {
            "id": "af2_q2", "text": "I have 20+ tabs open and keep 'Jumping' between them...", "domain": "academic_focus", "subdomain": "switching_cost", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Always.", "severity_weight": 2 },
                { "text": "I am the human version of a glitching browser.", "severity_weight": 3 }
            ]
        },
        {
            "id": "af2_q3", "text": "I feel my brain is literally 'Noisy' (buzzing, racing) when I try to work...", "domain": "academic_focus", "subdomain": "cognitive_noise", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "The noise is deafening; I can't hear my own thoughts.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "The switching Cost", "text": "Every time you look at a notification, it takes your brain an average of 23 minutes to return to deep focus. You aren't 'Multitasking'; you are 'Task-Splintering'. Your focus isn't 'Gone'; it's just in a million pieces.", "source_name": "Cognitive Load Inventory" }
        },
        {
            "id": "af2_q4", "text": "I feel like I'm 'Forgetting' everything I just learned immediately...", "domain": "academic_focus", "subdomain": "encoding_failure", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Yes, my memory is a sieve.", "severity_weight": 3 }
            ]
        },
        {
            "id": "af2_q5", "text": "Do you feel like your 'Attention' is no longer yours to control?", "domain": "academic_focus", "subdomain": "sovereignty_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I am a passenger in a hijacked brain.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "focused", "risk_category": "low" },
            { "range": [4, 7], "label": "scattered", "risk_category": "low" },
            { "range": [8, 11], "label": "fragmented", "risk_category": "medium" },
            { "range": [12, 15], "label": "shattered", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["academic_imposter"] = {
    "id": "academic_imposter",
    "title": "The Scholar's Mask",
    "version": "1.0",
    "description": "Assess 'Intellectual Fraudulence'. Discover if you feel like you tricked everyone into admitting you.",
    "primary_domain": "Academic Stress",
    "context_tags": ["Students", "Academic", "Identity"],
    "theme_color": "#4ECDC4",
    "questions": [
        {
            "id": "ai2_q1", "text": "When I get an 'A', my first thought is...", "domain": "academic_imposter", "subdomain": "success_attribution", "options": [
                { "text": "I worked hard.", "severity_weight": 0 },
                { "text": "The test was easy.", "severity_weight": 1 },
                { "text": "I got lucky.", "severity_weight": 2 },
                { "text": "I tricked the professor into thinking I'm smart.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ai2_q2", "text": "I'm terrified someone will ask me a question and 'Expose' me...", "domain": "academic_imposter", "subdomain": "exposure_anxiety", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Every time I speak in class.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ai2_q3", "text": "I feel like a 'Fraud' who doesn't belong in this major/field...", "domain": "academic_imposter", "subdomain": "ontological_fraudulence", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "I am a total imposter; a walking lie.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Imposter Cycle", "text": "Imposter Syndrome is most common among 'High Achievers'. The more you succeed, the more you feel you are 'Faking' it. You aren't 'Bad'; you are just experiencing 'CIPS'—Clance Imposter Phenomenon. You are exactly where you are supposed to be.", "source_name": "CIPS Imposter Scale" }
        },
        {
            "id": "ai2_q4", "text": "I think my 'Peers' are much smarter and have it all figured out...", "domain": "academic_imposter", "subdomain": "comparative_illusion", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little.", "severity_weight": 1 },
                { "text": "Yes, everyone but me.", "severity_weight": 2 },
                { "text": "They are geniuses; I am an accidental entry.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ai2_q5", "text": "Do you feel like you are 'waiting for the letter' saying there was a mistake in your admission?", "domain": "academic_imposter", "subdomain": "expulsion_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I check the mail for my dismissal every day.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "scholar", "risk_category": "low" },
            { "range": [4, 7], "label": "anxious", "risk_category": "low" },
            { "range": [8, 11], "label": "imposter", "risk_category": "medium" },
            { "range": [12, 15], "label": "fraudulent", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["academic_deadline"] = {
    "id": "academic_deadline",
    "title": "The Deadline Rush",
    "version": "1.0",
    "description": "Assess 'Adrenaline Dependency'. Discover if you can work without a gun to your head.",
    "primary_domain": "Academic Stress",
    "context_tags": ["Students", "Academic", "Performance"],
    "theme_color": "#4ECDC4",
    "questions": [
        {
            "id": "ad2_q1", "text": "I only start a project when the 'Panic' sets in...", "domain": "academic_deadline", "subdomain": "initiation_threshold", "options": [
                { "text": "No, I start early.", "severity_weight": 0 },
                { "text": "I start a bit late.", "severity_weight": 1 },
                { "text": "I start at midnight before it's due.", "severity_weight": 2 },
                { "text": "I only work when the 'Dread' is physically painful.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ad2_q2", "text": "I feel I 'Need' the stress to perform well...", "domain": "academic_deadline", "subdomain": "adrenaline_reliance", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Maybe.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "Pressure is my only fuel.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ad2_q3", "text": "I spend the 'Free Time' before a deadline in a state of 'Numbness' instead of rest...", "domain": "academic_deadline", "subdomain": "pre_deadline_paralysis", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "I am a zombie until the buzzer hits.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "The Adrenaline Loop", "text": "If you only work under pressure, you are training your brain to ignore 'Calm' work and only respond to 'Cortisol'. This is an 'Executive Function' adaptation. You aren't 'Lazy'; you are 'Systemically Over-threshold'. You're running on emergency power 100% of the time.", "source_name": "PACS Procrastination Standard" }
        },
        {
            "id": "ad2_q4", "text": "After a big push, I feel 'Sick' or 'Depressed' for days...", "domain": "academic_deadline", "subdomain": "post_crash_collapse", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little tired.", "severity_weight": 1 },
                { "text": "I crash hard.", "severity_weight": 2 },
                { "text": "I become entirely non-functional.", "severity_weight": 3 }
            ]
        },
        {
            "id": "ad2_q5", "text": "Do you feel like you are 'addicted' to the rush of almost failing?", "domain": "academic_deadline", "subdomain": "risk_dependency", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I only feel alive when I'm on the edge.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "pacing", "risk_category": "low" },
            { "range": [4, 7], "label": "rushed", "risk_category": "low" },
            { "range": [8, 11], "label": "surging", "risk_category": "medium" },
            { "range": [12, 15], "label": "addicted", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["career_desk_drifter"] = {
    "id": "career_desk_drifter",
    "title": "The Desk Drifter",
    "version": "1.0",
    "description": "Assess 'Workplace Alienation'. Discover if you are actually working or just occupying space.",
    "primary_domain": "Career & Burnout",
    "context_tags": ["Workplace", "Burnout", "Career"],
    "theme_color": "#fbbf24",
    "questions": [
        {
            "id": "cdd_q1", "text": "I spend most of my work day thinking about...", "domain": "career_desk_drifter", "subdomain": "attentional_presence", "options": [
                { "text": "The task at hand.", "severity_weight": 0 },
                { "text": "The weekend.", "severity_weight": 1 },
                { "text": "Quitting.", "severity_weight": 2 },
                { "text": "How much I hate being in this chair.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cdd_q2", "text": "I feel that if I vanished, the company wouldn't notice for days...", "domain": "career_desk_drifter", "subdomain": "perceived_utility", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Maybe a few hours.", "severity_weight": 1 },
                { "text": "Probably a day.", "severity_weight": 2 },
                { "text": "Yes, I am a ghost in the machine.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cdd_q3", "text": "My 'Performance' is just meeting the absolute minimum to not get fired...", "domain": "career_desk_drifter", "subdomain": "functional_avolition", "options": [
                { "text": "No, I over-deliver.", "severity_weight": 0 },
                { "text": "I deliver what's asked.", "severity_weight": 1 },
                { "text": "I do the bare minimum.", "severity_weight": 2 },
                { "text": "I do less than the minimum and hope for the best.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Presenteeism", "text": "Being physically present but mentally absent is called 'Presenteeism'. It's often a precursor to complete burnout or 'Quiet Quitting'. You aren't 'Lazy'; you are 'Disconnecting' as a survival strategy from a toxic or meaningless environment.", "source_name": "Occupational Psychology Standard" }
        },
        {
            "id": "cdd_q4", "text": "I feel my 'Talents' are being completely wasted...", "domain": "career_desk_drifter", "subdomain": "skill_atrophy", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "I am becoming a shell of my former self.", "severity_weight": 3 }
            ]
        },
        {
            "id": "cdd_q5", "text": "Do you feel like you are 'acting' like a professional rather than being one?", "domain": "career_desk_drifter", "subdomain": "authenticity_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, it's a 9-to-5 play.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "anchored", "risk_category": "low" },
            { "range": [4, 7], "label": "drifting", "risk_category": "low" },
            { "range": [8, 11], "label": "detached", "risk_category": "medium" },
            { "range": [12, 15], "label": "alienated", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["loneliness_solo_voyager"] = {
    "id": "loneliness_solo_voyager",
    "title": "The Solo Voyager",
    "version": "1.0",
    "description": "Assess 'Pathological Independence'. Discover if you are alone by choice or by fear.",
    "primary_domain": "Loneliness & Connection",
    "context_tags": ["Single", "Identity", "Loneliness"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "lsv_q1", "text": "I feel that asking for 'Help' is a sign of weakness...", "domain": "loneliness_solo_voyager", "subdomain": "hyper_independence", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Yes, I must do everything alone.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lsv_q2", "text": "I prefer to spend my 'Wins' alone because sharing them feels risky...", "domain": "loneliness_solo_voyager", "subdomain": "vulnerability_avoidance", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Maybe.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "Yes, my wins are my safe harbor.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lsv_q3", "text": "I feel that I am 'Better Off' without people clogging up my life...", "domain": "loneliness_solo_voyager", "subdomain": "cynical_withdrawal", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "Yes, people are just complications.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Hyper-Independence", "text": "Hyper-independence is often a 'Trauma Response'. If people were unreliable in the past, your brain decides to never need them again. This is 'Protecting' yourself into a corner. You aren't 'Strong'; you're 'Locked In'.", "source_name": "UCLA Loneliness Model" }
        },
        {
            "id": "lsv_q4", "text": "I feel 'Deep Tension' when I have to rely on someone else...", "domain": "loneliness_solo_voyager", "subdomain": "dependency_dread", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little.", "severity_weight": 1 },
                { "text": "Yes.", "severity_weight": 2 },
                { "text": "It feels physically unsafe.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lsv_q5", "text": "Do you feel like your 'Circle' has become a 'Dot'?", "domain": "loneliness_solo_voyager", "subdomain": "isolation_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, and I'm the only thing in it.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "connected", "risk_category": "low" },
            { "range": [4, 7], "label": "independent", "risk_category": "low" },
            { "range": [8, 11], "label": "isolated", "risk_category": "medium" },
            { "range": [12, 15], "label": "hermetic", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["loneliness_birthdays"] = {
    "id": "loneliness_birthdays",
    "title": "The Birthday Ghost",
    "version": "1.0",
    "description": "Assess 'Occasion Loneliness'. Discover if your milestones feel like hollow echoes.",
    "primary_domain": "Loneliness & Connection",
    "context_tags": ["Single", "Milestones", "Loneliness"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "lb_q1", "text": "On my birthday or major holidays, I feel...", "domain": "loneliness_birthdays", "subdomain": "milestone_affect", "options": [
                { "text": "Celebrated.", "severity_weight": 0 },
                { "text": "Busy.", "severity_weight": 1 },
                { "text": "Ignored.", "severity_weight": 2 },
                { "text": "Grieved; like I'm at my own funeral.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lb_q2", "text": "I 'Hide' my birthday so people won't feel forced to say anything...", "domain": "loneliness_birthdays", "subdomain": "proactive_withdrawal", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Occasionally.", "severity_weight": 1 },
                { "text": "Always.", "severity_weight": 2 },
                { "text": "Yes, silence is better than forced pity.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lb_q3", "text": "Milestones feel like 'Reminders' of what I lack...", "domain": "loneliness_birthdays", "subdomain": "comparative_deficit", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Mostly.", "severity_weight": 2 },
                { "text": "Yes, every candle is a year of solitude.", "severity_weight": 3 }
            ], "insight_cloud": { "type": "clinical", "title": "Temporal Loneliness", "text": "Milestones create 'Temporal Comparisons'. You compare yourself to where you 'Should' be or where others 'Are'. This is 'Social Clock' pressure. You aren't 'Late'; you are just on a different path.", "source_name": "Social Anhedonia Research" }
        },
        {
            "id": "lb_q4", "text": "I feel 'Disappointed' even when people do reach out...", "domain": "loneliness_birthdays", "subdomain": "expectation_friction", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Maybe.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Yes, it never feels like enough.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lb_q5", "text": "Do you feel like you are 'aging in an empty room'?", "domain": "loneliness_birthdays", "subdomain": "existential_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, the walls are my only witnesses.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "observed", "risk_category": "low" },
            { "range": [4, 7], "label": "quiet", "risk_category": "low" },
            { "range": [8, 11], "label": "forgotten", "risk_category": "medium" },
            { "range": [12, 15], "label": "ghosted", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};

window.SoulamoreAssessments["loneliness_rejection"] = {
    "id": "loneliness_rejection",
    "title": "The Rejection Sensitive",
    "version": "1.0",
    "description": "Assess 'RSD: Rejection Sensitive Dysphoria'. Discover if you are hearing 'No' when people say 'Maybe'.",
    "primary_domain": "Loneliness & Connection",
    "context_tags": ["Social", "Sensitive", "Loneliness"],
    "theme_color": "#1e293b",
    "questions": [
        {
            "id": "lr_q1", "text": "If a friend doesn't text back for 4 hours, I assume...", "domain": "loneliness_rejection", "subdomain": "latency_interpretation", "options": [
                { "text": "They are busy.", "severity_weight": 0 },
                { "text": "They forgot.", "severity_weight": 1 },
                { "text": "They are annoyed with me.", "severity_weight": 2 },
                { "text": "They hate me and our friendship is over.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lr_q2", "text": "I 'Pre-Reject' people so they can't reject me first...", "domain": "loneliness_rejection", "subdomain": "proactive_defense", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Rarely.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2 },
                { "text": "Yes, I burn the bridge before I cross it.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lr_q3", "text": "I feel 'Physical Pain' when I am critiqued...", "domain": "loneliness_rejection", "subdomain": "somatic_dysphoria", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "A little sting.", "severity_weight": 1 },
                { "text": "Yes, it hurts.", "severity_weight": 2 },
                { "text": "It feels like a literal punch to the gut.", "severity_weight": 3, "risk_weight": 1 }
            ], "insight_cloud": { "type": "clinical", "title": "RSD: Rejection Sensitive Dysphoria", "text": "Your brain's 'Rejection Radar' is turned up to 1000%. You perceive 'Neutral' signals as 'Negative' ones. This is often linked to Neurodiversity or early attachment wounds. You aren't 'Dramatic'; your nervous system is just 'High Fidelity'.", "source_name": "Emotional Suppression Protocols" }
        },
        {
            "id": "lr_q4", "text": "I am a 'People Pleaser' just to avoid anyone being mad at me...", "domain": "loneliness_rejection", "subdomain": "compliance_coping", "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Often.", "severity_weight": 2 },
                { "text": "Always; I'm a human chameleon.", "severity_weight": 3 }
            ]
        },
        {
            "id": "lr_q5", "text": "Do you feel like you are 'one mistake away' from being exiled?", "domain": "loneliness_rejection", "subdomain": "safety_risk", "risk_flag": true, "options": [
                { "text": "No.", "severity_weight": 0 },
                { "text": "Sometimes.", "severity_weight": 1 },
                { "text": "Frequently.", "severity_weight": 2, "risk_weight": 1 },
                { "text": "Yes, I live on a permanent tightrope.", "severity_weight": 3, "risk_weight": 2 }
            ]
        }
    ],
    "scoring": {
        "max_possible": 15, "bands": [
            { "range": [0, 3], "label": "secure", "risk_category": "low" },
            { "range": [4, 7], "label": "sensitive", "risk_category": "low" },
            { "range": [8, 11], "label": "reactive", "risk_category": "medium" },
            { "range": [12, 15], "label": "dysphoric", "risk_category": "high", "escalation_required": true }
        ], "risk_threshold": 3
    }
};
