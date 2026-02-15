@echo off
echo Starting Soulamore Local Server...
echo.
echo.
echo Attempting to start Python server on port 8080...
echo You can close this window to stop the server.
echo.

:: Try Python 3
python -m http.server 8080 --bind 127.0.0.1 2>nul
if %ERRORLEVEL% EQU 0 goto :opened

:: Try Python (generic)
python -m http.server 8080 --bind 127.0.0.1
if %ERRORLEVEL% EQU 0 goto :opened

echo.
echo Could not start Python server. Converting to Node.js serve...
echo.

:: Try npx serve
call npx serve .
if %ERRORLEVEL% EQU 0 goto :opened

pause
exit /b

:opened
echo Server stopped.
pause
