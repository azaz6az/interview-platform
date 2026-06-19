@echo off
chcp 65001 >nul
echo ========================================
echo   Deploy dist to GitHub Pages
echo ========================================
echo.

cd /d "%~dp0source-code"

if not exist "dist\index.html" (
    echo [ERROR] dist not found. Run: npm run build
    pause
    exit /b 1
)

findstr /C:"umami" dist\index.html >nul 2>&1
if errorlevel 1 (
    echo [WARN] umami code NOT found in dist/index.html!
    pause
    exit /b 1
)
echo [OK] umami tracking code found in dist

set TEMP_DIR=%TEMP%\gh-pages-deploy-%RANDOM%
echo [INFO] Temp dir: %TEMP_DIR%
mkdir "%TEMP_DIR%"

echo [INFO] Cloning gh-pages branch...
git clone --branch gh-pages --single-branch --depth 1 https://github.com/azaz6az/interview-platform.git "%TEMP_DIR%"
if errorlevel 1 (
    echo [ERROR] Clone failed. Check VPN and network.
    rmdir /s /q "%TEMP_DIR%"
    pause
    exit /b 1
)

cd /d "%TEMP_DIR%"
for /f "delims=" %%i in ('dir /a /b ^| findstr /v ".git"') do (
    if exist "%%i\" (
        rmdir /s /q "%%i"
    ) else (
        del /f /q "%%i"
    )
)

echo [INFO] Copying dist files...
xcopy /s /e /y /q "D:\interview-platform-delivery\source-code\dist\*" "%TEMP_DIR%\"

echo [INFO] Committing...
git add -A
git commit -m "deploy: add umami tracking code"

echo [INFO] Pushing to GitHub...
git push origin gh-pages

if errorlevel 1 (
    echo [ERROR] Push failed. Check VPN.
    cd /d "%~dp0"
    rmdir /s /q "%TEMP_DIR%"
    pause
    exit /b 1
)

cd /d "%~dp0"
rmdir /s /q "%TEMP_DIR%"

echo.
echo ========================================
echo   [OK] Deployed successfully!
echo   Visit: https://azaz6az.github.io/interview-platform/
echo ========================================
pause
