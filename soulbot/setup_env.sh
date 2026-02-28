# Soulamore SoulBot: Local Environment Setup

# This script prepares the local machine for Mistral 7B fine-tuning and inference.
# Requirement: NVIDIA GPU (RTX 3060 recommended) + CUDA Drivers.

# 1. Create Conda Environment
# conda create -n soulamore-ai python=3.10 -y
# conda activate soulamore-ai

# 2. Install PyTorch (CUDA 12.1)
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# 3. Install Fine-Tuning Libraries
pip install transformers datasets peft accelerate bitsandbytes trl sentencepiece

# 4. Success Check
python -c "import torch; print(f'CUDA available: {torch.cuda.is_available()}'); print(f'GPU: {torch.cuda.get_device_name(0) if torch.cuda.is_available() else 'None'}')"
