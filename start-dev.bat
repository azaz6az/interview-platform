@echo off
title Interview Platform

echo.
echo   ========================================
echo     Interview Platform - Dev Server
echo   ========================================
echo.

cd /d "%~dp0source-code"
echo   Working dir: %CD%
echo.

if not exist node_modules (
    echo   Installing dependencies...
    call npm install
    echo.
)

echo   Starting Vite...
echo   Browser will open at http://localhost:5173
echo   Press Ctrl+C to stop
echo.
echo   ========================================
echo.

npx vite --host --port 5173 --open

echo.
echo   Server stopped. Press any key to exit.
pause >nul
