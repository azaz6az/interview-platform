@echo off
title Interview Platform - Build Production
echo ============================================
echo   Interview Platform - Build Production
echo ============================================
echo.

cd /d "%~dp0source-code"

if not exist node_modules (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Building production version...
call npm run build

echo.
echo Copying build output to dist folder...
echo.

REM Copy the built files to the dist folder
xcopy /E /Y /Q "%~dp0source-code\dist\*" "%~dp0dist\"

echo.
echo ============================================
echo   Build completed successfully!
echo   Production files are in the dist folder.
echo   Run start-preview.bat to preview.
echo ============================================
echo.

pause