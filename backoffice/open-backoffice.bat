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

REM Start the server in background
start /B npm start

REM Wait a moment for server to start
timeout /t 3 /nobreak >nul

REM Open the backoffice in default browser
start http://localhost:3001/admin/login.html

echo.
echo ✅ Backoffice opened in your browser!
echo 🌐 URL: http://localhost:3001/admin/login.html
echo 🔑 Login: admin / admin123
echo.
echo Press any key to stop the server...
pause >nul

REM Kill the node process
taskkill /f /im node.exe >nul 2>&1
echo.
echo ✅ Server stopped. You can close this window.
pause
