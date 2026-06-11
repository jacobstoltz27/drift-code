@echo off
title Drift App Setup
echo.
echo  ====================================
echo   DRIFT APP - One-Click Setup
echo  ====================================
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo.
    echo  Please install it first:
    echo  1. Go to: https://nodejs.org
    echo  2. Click the big green LTS button to download
    echo  3. Run the installer ^(keep all defaults^)
    echo  4. Come back and double-click this file again
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js found:
node --version
echo.

:: Enable Windows long paths ^(fixes common React Native install errors^)
reg add "HKLM\SYSTEM\CurrentControlSet\Control\FileSystem" /v LongPathsEnabled /t REG_DWORD /d 1 /f >nul 2>&1

:: Install dependencies
echo [INFO] Installing dependencies ^(this takes 2-3 minutes the first time^)...
cd /d "%~dp0frontend"
npm install
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] npm install failed. Trying with legacy peer deps...
    npm install --legacy-peer-deps
)

:: Start Expo
echo.
echo ============================================
echo  A QR code will appear in a moment.
echo  Open Expo Go on your phone and scan it.
echo  Your phone and PC must be on the same WiFi.
echo ============================================
echo.
npx expo start

pause
