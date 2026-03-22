@echo off
cls
echo ==========================================
echo OPTIONAL: RELOCATE MODEL TO PROJECT
echo ==========================================
echo.
echo This will MOVE the 13GB Mistral model from the 
echo global cache to your 'soulbot/models/' folder.
echo.
echo WHY DO THIS?
echo - Makes the project folder self-contained.
echo - Easier to find the files.
echo.
echo WHY STAY?
echo - Keeps your user folder cleaner.
echo - Standard AI practice.
echo.
set /p confirm="Do you want to move the 13GB files now? (Y/N): "
if /I not "%confirm%"=="Y" exit

python "%~dp0MOVE_MODEL_TO_PROJECT.py"

echo.
echo Done! Run Step 3 to verify.
echo.
pause
