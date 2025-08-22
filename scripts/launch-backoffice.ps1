# Descalco Media - Portfolio Backoffice Launcher
# PowerShell script for easy launching

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  DESCALCO MEDIA - Portfolio Backoffice" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Get the directory where this script is located and navigate to backoffice
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backofficeDir = Join-Path (Split-Path $scriptDir -Parent) "backoffice"
Set-Location $backofficeDir

Write-Host "🚀 Starting the backoffice server..." -ForegroundColor Green
Write-Host ""

# Start the server
npm start

Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
