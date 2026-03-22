import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel
import os
import sys
import json
import time
from datetime import datetime

# Logging Setup
LOG_DIR = os.path.join(os.path.dirname(__file__), "logs")
os.makedirs(LOG_DIR, exist_ok=True)
LOG_FILE = os.path.join(LOG_DIR, "soulbot_history.jsonl")

def log_turn(data):
    """Saves conversation turn to JSONL for future refinement."""
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(json.dumps(data, ensure_ascii=False) + "\n")

# Force UTF-8 for Windows Console
if sys.platform == "win32":
    os.system('chcp 65001')
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Paths
ADAPTER_PATH = os.path.join(os.path.dirname(__file__), "models", "soulamore.ai")
BASE_MODEL_PATH = os.path.join(os.path.dirname(__file__), "models", "mistral_7b_base")
MODEL_NAME = BASE_MODEL_PATH if os.path.exists(BASE_MODEL_PATH) else "mistralai/Mistral-7B-v0.1"

def load_soulbot():
    print(f"--- SOULBOT INFERENCE ENGINE ---")
    
    if not os.path.exists(ADAPTER_PATH):
        print(f"ERROR: No trained adapter found at {ADAPTER_PATH}.")
        print("Please wait for Step 2 (Training) to finish 100% first!")
        return None, None

    print(f"Loading SoulBot Engine: {ADAPTER_PATH}...")
    tokenizer = AutoTokenizer.from_pretrained(ADAPTER_PATH)
    tokenizer.pad_token = tokenizer.eos_token

    quantization_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_use_double_quant=True,
    )

    # 1. Load the original base model
    print(f"Step 1: Loading Base Mistral...")
    base_model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        quantization_config=quantization_config,
        device_map="auto",
        trust_remote_code=True,
        torch_dtype=torch.bfloat16,
    )
    
    # 2. Apply the trained adapter on top
    print(f"Step 2: Applying SoulBot Adapter (Rank 16)...")
    model = PeftModel.from_pretrained(base_model, ADAPTER_PATH)
    
    model.eval()
    
    print(f"SUCCESS: SoulBot is awake and ready.")
    return model, tokenizer

def classify_intent(user_input):
    """Detects the category of user input for routing."""
    text = user_input.lower().strip()

    # CRITICAL keywords
    CRISIS_KEYWORDS = ["suicide", "kill myself", "end my life", "no reason to live", "want to die"]
    if any(word in text for word in CRISIS_KEYWORDS):
        return "crisis"

    # HIGH DISTRESS
    HIGH_DISTRESS = ["hopeless", "worthless", "can't go on", "nothing matters", "panic attack"]
    if any(word in text for word in HIGH_DISTRESS):
        return "emotional_high"

    # MODERATE DISTRESS
    MODERATE_DISTRESS = ["anxious", "sad", "overwhelmed", "stressed", "lonely", "tired", "depressed"]
    if any(word in text for word in MODERATE_DISTRESS):
        return "emotional_moderate"

    # GREETINGS
    GREETING_WORDS = ["hi", "hello", "hey", "yo", "good morning", "good evening", "welcome"]
    if any(word in text for word in GREETING_WORDS):
        return "greeting"

    # CASUAL
    if len(text.split()) <= 3:
        return "casual_chat"

    return "emotional_light"

def calculate_severity(text):
    """Weighted severity scoring for distressed users."""
    SEVERITY_WEIGHTS = {
        "suicide": 10, "kill myself": 10, "end my life": 10,
        "hopeless": 5, "worthless": 5, "nothing matters": 5,
        "panic attack": 4, "anxious": 2, "sad": 2, "stressed": 2,
        "overwhelmed": 2, "lonely": 2, "tired": 2
    }
    score = 0
    t_lower = text.lower()
    for word, weight in SEVERITY_WEIGHTS.items():
        if word in t_lower:
            score += weight
    return score

def tone_dampener(response, severity):
    """Soften clinical language for low-distress casual users."""
    if severity >= 4:
        return response
        
    # Catching overly diagnostic or clinical phrases
    fixes = {
        r"(?i)based on the pattern of (\w+)": r"It sounds like you're dealing with \1",
        r"(?i)based on what you described, it appears": "It seems like",
        r"(?i)you may be experiencing": "It sounds like you're going through",
        r"(?i)clinical insight:": "Something to consider:",
        r"(?i)suggested step:": "A helpful step forward:"
    }
    import re
    for pattern, replacement in fixes.items():
        response = re.sub(pattern, replacement, response)
    return response

def chat():
    model, tokenizer = load_soulbot()
    if not model: return

    print("\n" + "="*50)
    print("WELCOME TO THE CLINICAL KNOWLEDGE ENGINE")
    print("Type your message below (or 'exit' to quit).")
    print("="*50 + "\n")

    from transformers import TextStreamer
    streamer = TextStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
    
    # NEURAL MEMORY (Structured Context)
    memory = {
        "emotion_state": "neutral",
        "topic": "none",
        "risk_flag": False,
        "turns": []
    }

    while True:
        try:
            user_input = input("USER > ")
        except EOFError:
            break
            
        if user_input.lower() in ["exit", "quit"]: break

        # 1. BRAIN ROUTING (Pre-Model)
        intent = classify_intent(user_input)
        severity = calculate_severity(user_input)
        
        # --- HARD GATE: BYPASS MODEL FOR GREETINGS ---
        if intent == "greeting":
            response = "Hi there! I'm SoulBot, your clinical companion at Soulamore. I'm here to listen and support you. How are you feeling today?"
            print(f"\n[Warm Companion] SOULBOT > {response}\n")
            log_turn({"timestamp": datetime.now().isoformat(), "user_input": user_input, "intent": intent, "severity": severity, "mode": "Bypass", "response": response, "latency": 0, "feedback": "None"})
            continue

        # 2. MODE SELECTOR & TEMPLATE ISOLATION
        if intent == "crisis" or severity >= 10:
            mode = "Safety Anchor"
            instruction = (
                "You are SoulBot: Safety Anchor. The user is in crisis. "
                "Provide a very short, grounding response. Acknowledge the pain. "
                "Direct them to help immediately. Do NOT analyze or use clinical templates."
            )
            template_format = "### Response:\n" 
        elif intent == "emotional_high" or severity >= 7:
            mode = "Structured Support"
            instruction = (
                "You are SoulBot: Structured Support for Soulamore. Be empathetic and highly structured. "
                "You MUST provide: 1. A warm response. 2. A 'Clinical Insight' header. 3. A 'Suggested Step' header."
            )
            template_format = "### Response:\n" 
        elif intent == "emotional_moderate" or severity >= 3:
            mode = "Reflective Guide"
            instruction = (
                "You are SoulBot: Reflective Guide. Listen deeply and validate. "
                "Provide a mild clinical insight to help them name the pattern. "
                "Do NOT use emergency grounding techniques unless specifically asked."
            )
            template_format = "### Response:\n" 
        else:
            mode = "Soft Validation"
            instruction = (
                "You are SoulBot: Soft Validation. Listen warmly and validate. "
                "Do NOT provide 'Clinical Insights' or 'Suggested Steps'. "
                "Just be human and ask an open-ended question to learn more."
            )
            # HARD TEMPLATE GUARD: Remove clinical headers from the prompt expectation
            template_format = "### Response:\n"

        # 3. BUILD PROMPT WITH TEMPLATE ISOLATION
        prompt = (
            f"### Instruction:\n{instruction}\n\n"
            f"### Context: (Emotion State: {memory['emotion_state']}, Severity: {severity})\n"
            f"### Input:\n{user_input}\n\n"
            f"{template_format}"
        )
        
        inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
        
        print(f"\n[{mode}] SOULBOT > ", end="", flush=True)
        
        start_time = time.time()
        with torch.no_grad():
            outputs = model.generate(
                **inputs, 
                max_new_tokens=200,   # Shorter responses for better flow
                temperature=0.3,     # Lower temp for more precision
                top_p=0.9,
                repetition_penalty=1.1,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
                streamer=streamer,
                use_cache=True
            )
        latency = time.time() - start_time
        
        # 4. POST-PROCESSOR & FEEDBACK
        raw_response = tokenizer.decode(outputs[0][inputs['input_ids'].shape[-1]:], skip_special_tokens=True).strip()
        
        # Hard Grounding Guard: If severity < 6, scrub any grounding scripts if the model leaked them
        if severity < 6:
            grounding_terms = ["5-4-3-2-1", "grounding technique", "name 5 things"]
            if any(term in raw_response.lower() for term in grounding_terms):
                raw_response = "I'm listening. That sounds like a lot to hold. Can you tell me more about what's been making you feel this way?"

        final_response = tone_dampener(raw_response, severity)
        
        # Feedback Loop
        feedback = input("\n[Helpful? +/-/Enter to skip]: ").strip()
        
        # 5. LOGGING
        log_data = {
            "timestamp": datetime.now().isoformat(),
            "user_input": user_input,
            "intent": intent,
            "severity": severity,
            "mode": mode,
            "response": final_response,
            "latency": round(latency, 2),
            "feedback": feedback if feedback else "None"
        }
        log_turn(log_data)
        
        # 6. UPDATE MEMORY
        memory["emotion_state"] = intent
        memory["turns"].append({"u": user_input, "b": final_response})
        
        print("\n" + "-"*50 + "\n")

if __name__ == "__main__":
    chat()
