@echo off
cls
echo ==========================================
echo STEP 1: SETTING UP AI LIBRARIES
echo ==========================================
echo.
echo This will install the GPU drivers and libraries.
echo This only needs to be run ONCE.
echo.
pause

pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install transformers[torch] datasets peft accelerate bitsandbytes trl sentencepiece

echo.
echo ==========================================
echo SETUP COMPLETE! You can now run Step 2.
echo ==========================================
pause
