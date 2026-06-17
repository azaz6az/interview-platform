@echo off
title Interview Platform - Production Preview
echo ============================================
echo   Interview Platform - Production Preview
echo ============================================
echo.

cd /d "%~dp0dist"

echo Checking Python availability...

where python >nul 2>nul
if %errorlevel% equ 0 (
    echo Found Python. Starting HTTP server on port 8080...
    echo Browser will open automatically...
    echo Press Ctrl+C to stop the server
    echo ============================================
    echo.
    start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:8080"
    python -m http.server 8080
    goto end
)

where python3 >nul 2>nul
if %errorlevel% equ 0 (
    echo Found Python3. Starting HTTP server on port 8080...
    echo Browser will open automatically...
    echo Press Ctrl+C to stop the server
    echo ============================================
    echo.
    start "" cmd /c "timeout /t 3 /nobreak >nul & start http://localhost:8080"
    python3 -m http.server 8080
    goto end
)

where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo Found Node.js. Starting serve on port 8080...
    echo Browser will open automatically...
    echo Press Ctrl+C to stop the server
    echo ============================================
    echo.
    start "" cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:8080"
    call npx -y serve -s -l 8080 .
    goto end
)

echo ERROR: No suitable server found.
echo Please install Python or Node.js to run the production preview.
echo.
pause

:end