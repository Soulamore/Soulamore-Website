# SoulBot: Clinical Knowledge Engine Strategy

Soulamore's AI is transitioning from a generic advice bot to a **Structured Clinical Knowledge Engine**. This architecture ensures that responses are psychologically grounded, culturally intelligent (India-context), and clinically safe.

## 🧠 The 4-Layer Architecture

### 1. Scenario Database (Case Archetypes)
Instead of advice paragraphs, we store **Case Archetypes**—recurring real-world patterns.
- **Relationship Archetypes:** Arranged marriage ambivalence, Long-distance strain, Parental disapproval.
- **Student Archetypes (Indian Context):** IIT/NEET pressure, "Log Kya Kahenge" anxiety, Coaching burnout.
- **Expat Archetypes:** Acculturation stress, identity isolation.

### 2. Clinical Construct Engine
Structured psychological knowledge retrieved during inference.
- **Constructs:** Emotional Enmeshment, Rejection Sensitivity, Performance-Based Self-Worth.
- **Distortions:** Catastrophizing, Mind Reading, Moral Guilt Overload.

### 3. Empathetic Language Tuner
Calibrated tone profiles to ensure cultural and clinical fit.
- **Profiles:** Soft Reflective, Structured Clinical, Crisis Support, Indian Parental Conflict Mode.

### 4. Intervention Library
Actionable "How-To" patterns for real-world change.
- **Scripts:** Boundary scripts for parents, de-escalation for partners.
- **Micro-Steps:** Regulation techniques linked to specific stress responses.

## 🛠️ Implementation Pipeline

1. **Structured Data Initialization:** Populate JSON databases with archetypes and constructs derived from WHO, NIMH, and SAMHSA.
2. **Knowledge Synthesis:** Use `knowledge_engine_builder.py` to generate 2000+ high-fidelity training pairs (Scenario + Structure -> Safe Response).
3. **BF16 Native Fine-Tuning:** Train the local Mistral 7B on the RTX 3060 utilizing the QLoRA pipeline.
4. **Safety Filter:** Layered crisis detection and escalation routing.
5. **Cloud-Ready Migration (NEW):** Host the `soulamore.ai` adapter on a serverless GPU endpoint (e.g., Replicate) to ensure 24/7 global availability during periods where the local PC is offline (e.g., travel).

## 🎯 Goal
Build the first culturally intelligent, mental-health operating system for the Indian and Expat population.

## 🔒 Safety & Ethics
- **No Diagnosis:** Models trained to avoid diagnostic labels.
- **Crisis Routing:** IMMEDIATE professional referral for high-risk flags.
- **Data Privacy:** Local hosting ensures sensitive emotional data stays with the user.
