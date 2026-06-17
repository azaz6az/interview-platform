@echo off
chcp 65001 >nul 2>nul
title Interview Platform Setup

echo.
echo   ==========================================
echo     Interview Platform - One-Click Setup
echo   ==========================================
echo.

:: Get current directory
set "PROJECT_DIR=%~dp0"
set "SOURCE_DIR=%PROJECT_DIR%source-code"

:: Check if source-code folder exists
if not exist "%SOURCE_DIR%" (
    echo   ERROR: source-code folder not found!
    echo   Please make sure this script is in the project root.
    pause
    exit /b 1
)

:: Install dependencies
echo   [1/3] Installing dependencies...
cd /d "%SOURCE_DIR%"
call npm install --silent
if errorlevel 1 (
    echo   ERROR: npm install failed. Make sure Node.js is installed.
    echo   Download Node.js: https://nodejs.org
    pause
    exit /b 1
)
echo   Done.

:: Create PowerShell helper script
echo   [2/3] Creating launcher...
(
echo $vitePath = "%SOURCE_DIR%"
echo Start-Process -FilePath "cmd.exe" -ArgumentList "/c cd /d `"`"$vitePath`"`" && npx vite --host --port 5173 --open" -WindowStyle Hidden
) > "%PROJECT_DIR%launch-hidden.ps1"

:: Create desktop shortcut
echo   [3/3] Creating desktop shortcut...
powershell -ExecutionPolicy Bypass -Command ^
 "$ws = New-Object -ComObject WScript.Shell; ^
  $desktop = [Environment]::GetFolderPath('Desktop'); ^
  $lnk = $ws.CreateShortcut([System.IO.Path]::Combine($desktop, 'Interview-Platform.lnk')); ^
  $lnk.TargetPath = 'powershell.exe'; ^
  $lnk.Arguments = '-ExecutionPolicy Bypass -WindowStyle Hidden -File \"%PROJECT_DIR%launch-hidden.ps1\"'; ^
  $lnk.WorkingDirectory = '%PROJECT_DIR%'; ^
  $lnk.WindowStyle = 7; ^
  $lnk.Save(); ^
  Write-Host '  Shortcut created on Desktop'"

echo.
echo   ==========================================
echo     Setup complete!
echo   ==========================================
echo.
echo   - Double-click "Interview-Platform" on Desktop to start
echo   - Browser will open automatically at http://localhost:5173
echo.
pause
