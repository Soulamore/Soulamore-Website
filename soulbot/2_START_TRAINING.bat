@echo off
cls
echo ==========================================
echo STEP 2: STARTING SOULBOT TRAINING
echo ==========================================
echo.
echo 1. Prepares your data.
echo 2. Downloads Mistral 7B (5GB).
echo 3. Starts training on your RTX 3060.
echo.
echo IMPORTANT: This takes 1-2 hours. Do not close!
echo.
pause

:: Run data preparation (Knowledge Engine Builder)
python "%~dp0knowledge_engine_builder.py"

:: Run training
python "%~dp0train.py"

echo.
echo ==========================================
echo TRAINING FINISHED! Run Step 3 to check.
echo ==========================================
pause
