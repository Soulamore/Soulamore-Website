@echo off
setlocal enabledelayedexpansion

:: ======================================================================
:: SOULAMORE SOULBOT: EASY LOCAL SETUP & TRAINING
:: ======================================================================

cls
echo ======================================================================
echo           SOULAMORE SOULBOT - LOCAL AI SETUP (RTX 3060)
echo ======================================================================
echo.
echo Hello! This script will prepare your computer to run SoulBot locally.
echo This means No API Costs, Full Privacy, and Your Own AI Model.
echo.
echo This process has 5 Main Steps:
echo 1. Installing AI Libraries (Torch, Transformers)
echo 2. Preparing your Assessment Knowledge (Dataset)
echo 3. Starting the Initial Training (Mistral 7B)
echo 4. Expanding Knowledge (Adding new research & cases)
echo 5. Testing your Model (Chatting with the Engine!)
echo.
echo REQUIREMENTS:
echo - NVIDIA GPU (You have an RTX 3060 - Perfect!)
echo - Python installed
echo - About 10GB of free disk space
echo.
set /p proceed="Ready to start the future of Soulamore? (Y/N): "
if /I not "%proceed%"=="Y" exit

echo.
echo [STEP 1/3] - Installing AI Libraries...
echo This connects your GPU to the AI code.
echo.
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121
pip install transformers[torch] datasets peft accelerate bitsandbytes trl sentencepiece
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Something went wrong with the installation. 
    echo Please make sure Python is in your PATH and try again.
    pause
    exit /b
)
echo [SUCCESS] Libraries installed successfully!
echo.

echo [STEP 2/3] - Preparing your Assessment Knowledge...
echo Turning your JSON assessment files into training data for the AI.
python "%~dp0knowledge_engine_builder.py"
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Failed to generate the dataset. 
    echo Check if %~dp0dataset_generator.py exists.
    pause
    exit /b
)
echo [SUCCESS] Knowledge base prepared!
echo.

echo ======================================================================
echo [STEP 3/3] - THE BIG DOWNLOAD & TRAINING
echo ======================================================================
echo.
echo CRITICAL INFORMATION:
echo 1. This will download "Mistral-7B" (about 5GB). 
echo    Your internet speed will determine how long this takes.
echo 2. Once downloaded, your RTX 3060 will work hard for 1-2 hours.
echo 3. Your screen might flicker slightly - this is normal.
echo 4. DO NOT CLOSE THIS WINDOW or turn off your PC during training.
echo.
set /p confirm_train="Start the download and training now? (Y/N): "
if /I not "%confirm_train%"=="Y" (
    echo No problem! You can run this file again when you are ready.
    pause
    exit
)

echo.
echo Starting the engine... Mistral 7B is coming home.
echo.
python "%~dp0train.py"

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] Training interrupted. 
    echo This often happens if the GPU runs out of memory (VRAM).
    echo Close other apps (Chrome, Games) and try again.
    pause
    exit /b
)

echo.
echo ======================================================================
echo [CELEBRATION] TRAINING COMPLETE!
echo ======================================================================
echo Your local Soulamore model is ready in 'soulbot/models/soulamore.ai'.
echo You no longer need Gemini for assessment interpretations.
echo.
pause
