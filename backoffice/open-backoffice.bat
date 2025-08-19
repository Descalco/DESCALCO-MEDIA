@echo off
title Descalco Media - Portfolio Backoffice Launcher
echo.
echo ========================================
echo   DESCALCO MEDIA - Portfolio Backoffice
echo ========================================
echo.
echo 🚀 Starting server and opening browser...
echo.

cd /d "%~dp0"

REM Check if node is available
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    echo 🌐 Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if package.json exists
if not exist "package.json" (
    echo ❌ package.json not found! Make sure you're in the right directory.
    pause
    exit /b 1
)

REM Start the server in background
echo 📦 Starting Node.js server...
start /B node server.js

REM Wait a moment for server to start
echo ⏳ Waiting for server to initialize...
timeout /t 5 /nobreak >nul

REM Test if server is running
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3001' -TimeoutSec 2 -UseBasicParsing | Out-Null; Write-Host '✅ Server is running!' } catch { Write-Host '❌ Server failed to start!' }"

REM Open the backoffice in default browser (corrected URL)
echo 🌐 Opening backoffice in browser...
start http://localhost:3001/login.html

echo.
echo ✅ Backoffice should now be open in your browser!
echo 🌐 URL: http://localhost:3001/login.html
echo 🔑 Default password: descalco2025!
echo.
echo 📋 Available URLs:
echo    • Login: http://localhost:3001/login.html
echo    • Dashboard: http://localhost:3001/dashboard.html
echo    • Add Project: http://localhost:3001/add-project.html
echo.
echo ⚠️  Keep this window open to keep the server running.
echo 📝 Server logs will appear here...
echo.
echo Press Ctrl+C to stop the server, or close this window.
echo.

REM Keep the window open and show server status
:loop
timeout /t 10 /nobreak >nul
powershell -Command "try { Invoke-WebRequest -Uri 'http://localhost:3001' -TimeoutSec 1 -UseBasicParsing | Out-Null; Write-Host '[%date% %time%] Server OK' } catch { Write-Host '[%date% %time%] Server NOT responding!' }"
goto loop