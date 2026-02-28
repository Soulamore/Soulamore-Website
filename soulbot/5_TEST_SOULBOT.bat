@echo off
cls
echo ===================================================
echo   SOULBOT POWERED BY SOULAMORE.AI
echo   STEP 5: CHATTING WITH THE CLINICAL ENGINE
echo ===================================================
echo.
echo NOTE: This only works if Step 2 (Training) is 100%% finished.
echo.
python "%~dp0inference.py"
echo.
pause
