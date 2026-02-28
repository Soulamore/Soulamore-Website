@echo off
cls
echo ===================================================
echo   SOULBOT POWERED BY SOULAMORE.AI
echo   STEP 4: EXPANDING CLINICAL KNOWLEDGE
echo ===================================================
echo.
:: One-time branding rename check
if exist "%~dp0models\soulamore_mistral_adapter" (
    echo [BRANDING] Renaming model to soulamore.ai...
    rename "%~dp0models\soulamore_mistral_adapter" "soulamore.ai"
)
echo.
echo This step will:
echo 1. Download any new research PDFs (WHO, NIH, etc).
echo 2. Generate new specialized cases (Archetypes).
echo 3. Update the Master Dataset with the new information.
echo.
echo NOTE: After this, you should run "2_START_TRAINING.bat" 
echo again to teach the model the new knowledge.
echo.
pause
echo.
echo [1/3] Downloading latest clinical resources...
python "%~dp0download_clinical_resources.py"
echo.
echo [2/3] Building Psychological Language Bank...
python "%~dp0language_bank_builder.py"
echo.
echo [3/3] Synthesizing Master Dataset (2000+ examples)...
python "%~dp0knowledge_engine_builder.py"
echo.
echo ==========================================
echo KNOWLEDGE EXPANSION COMPLETE!
echo ==========================================
echo Now run "2_START_TRAINING.bat" to finish the upgrade.
echo.
pause
