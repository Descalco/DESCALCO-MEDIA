@echo off
echo.
echo ========================================
echo   PORTFOLIO DATA UPDATE SCRIPT
echo ========================================
echo.
echo This script will update your portfolio with the latest projects from the backoffice.
echo.
pause
echo.
echo Generating portfolio data from backoffice...
cd /d "%~dp0.."
node generate-portfolio-data.js
echo.
if %errorlevel% equ 0 (
    echo ✅ Portfolio data updated successfully!
    echo.
    echo Your portfolio now includes all projects from the backoffice.
    echo You can now view your updated portfolio at: other-projects.html
) else (
    echo ❌ Error updating portfolio data.
    echo Please check that Node.js is installed and try again.
)
echo.
pause
