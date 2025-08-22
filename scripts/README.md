# Scripts Directory

This folder contains all automation scripts for the Descalco Media portfolio website.

## Available Scripts

### Portfolio Management

#### `update-portfolio.bat`
**Purpose**: Updates the portfolio data from the backoffice system
- Runs the `generate-portfolio-data.js` script
- Generates `assets/js/portfolio-data.js` from backoffice projects
- Updates the dynamic portfolio displayed on `other-projects.html`

**Usage**: Double-click to run, or execute from command line
```bash
scripts\update-portfolio.bat
```

### Backoffice Management

#### `open-backoffice.bat` (Recommended)
**Purpose**: Complete backoffice launcher with browser integration
- Starts the Node.js server
- Automatically opens the backoffice in your browser
- Includes server health monitoring
- Shows helpful URLs and login information

**Usage**: Double-click to run
```bash
scripts\open-backoffice.bat
```

#### `start-backoffice.bat`
**Purpose**: Simple server starter (command line only)
- Starts the backoffice server without opening browser
- Useful for development or when you want manual browser control

**Usage**: Double-click to run
```bash
scripts\start-backoffice.bat
```

#### `launch-backoffice.ps1`
**Purpose**: PowerShell version of the server launcher
- Alternative to batch files for PowerShell users
- Starts the backoffice server with colored output

**Usage**: Right-click → "Run with PowerShell" or from PowerShell:
```powershell
.\scripts\launch-backoffice.ps1
```

## Quick Start

1. **To manage portfolio projects**: Run `open-backoffice.bat`
2. **To update website with new projects**: Run `update-portfolio.bat`

## System Requirements

- Node.js installed and accessible from command line
- All dependencies installed in the backoffice folder (`npm install`)

## Troubleshooting

- If scripts fail, ensure you're running them from the project root directory
- Check that Node.js is installed: `node --version`
- Verify backoffice dependencies: `cd backoffice && npm install`

## Default Backoffice Access

- **URL**: http://localhost:3001/login.html
- **Password**: descalco2025!
