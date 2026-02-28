import torch
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import PeftModel
import os

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

    print(f"Loading Base Model: {MODEL_NAME}...")
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    tokenizer.pad_token = tokenizer.eos_token

    quantization_config = BitsAndBytesConfig(
        load_in_4bit=True,
        bnb_4bit_compute_dtype=torch.bfloat16,
        bnb_4bit_quant_type="nf4",
        bnb_4bit_use_double_quant=True,
    )

    model = AutoModelForCausalLM.from_pretrained(
        MODEL_NAME,
        quantization_config=quantization_config,
        device_map="auto",
        trust_remote_code=True,
        torch_dtype=torch.bfloat16,
    )

    print(f"Applying Fine-Tuned Clinical Knowledge (Adapter)...")
    model = PeftModel.from_pretrained(model, ADAPTER_PATH)
    model.eval()
    
    print(f"SUCCESS: SoulBot is awake and ready.")
    return model, tokenizer

def chat():
    model, tokenizer = load_soulbot()
    if not model: return

    print("\n" + "="*50)
    print("WELCOME TO THE CLINICAL KNOWLEDGE ENGINE")
    print("Type your message below (or 'exit' to quit).")
    print("="*50 + "\n")

    while True:
        user_input = input("USER > ")
        if user_input.lower() in ["exit", "quit"]: break

        # Match the training template
        instruction = "You are the SoulBot Clinical Engine. Provide a structured, empathetic, and culturally intelligent response."
        prompt = f"### Instruction:\n{instruction}\n\n### Input:\n{user_input}\n\n### Response:\n"

        inputs = tokenizer(prompt, return_tensors="pt").to("cuda")
        
        with torch.no_grad():
            outputs = model.generate(
                **inputs, 
                max_new_tokens=500,
                temperature=0.7,
                top_p=0.9,
                repetition_penalty=1.2,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id
            )

        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        # Clean up the output to show only the response part
        if "### Response:" in response:
            response = response.split("### Response:")[-1].strip()
        
        print(f"\nSOULBOT > {response}\n")

if __name__ == "__main__":
    chat()
