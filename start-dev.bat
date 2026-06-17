@echo off
title Interview Platform - Dev Server
echo ============================================
echo   Interview Platform - Development Server
echo ============================================
echo.

cd /d "%~dp0source-code"

if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting Vite dev server...
echo Browser will open automatically...
echo Press Ctrl+C to stop the server
echo ============================================
echo.

:: Wait a few seconds then open browser
start "" cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:5173"

call npx vite --host --port 5173

pause