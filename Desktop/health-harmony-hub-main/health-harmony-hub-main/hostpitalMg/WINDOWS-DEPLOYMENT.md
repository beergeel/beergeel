# Windows PC Deployment Guide

This guide explains how to build and deploy the Hospital Management System as a Windows desktop application.

## Prerequisites

1. **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
2. **Windows 10/11** (64-bit recommended)
3. **Git** (optional, for cloning the repository)

## Building for Windows

### Step 1: Install Dependencies

```bash
cd hostpitalMg
npm install
```

### Step 2: Build the Application

Build the React app and compile Electron files:

```bash
npm run electron:build
```

This will:
- Build the React application to the `dist/` folder
- Compile Electron TypeScript files to `electron-dist/`

### Step 3: Create Windows Installer

Create a Windows installer (.exe):

```bash
npm run electron:dist
```

This creates a Windows NSIS installer in the `release/` folder:
- `Hospital Management System Setup x.x.x.exe` - Windows installer

### Step 4: Install on Windows PC

1. Run the installer executable from the `release/` folder
2. Follow the installation wizard
3. Choose installation directory (default: `C:\Users\<Username>\AppData\Local\hospital-management-system`)
4. The app will create desktop and Start Menu shortcuts

## Data Storage Location

When running on Windows, all data is stored in:

```
C:\Users\<Username>\AppData\Roaming\hospital-management-system\hospital-data\
```

This includes:
- Database file: `database/hospital.db`
- All application data files

**Important**: Users can backup their data by copying the `hospital-data` folder.

## Running in Development Mode

For development and testing:

```bash
npm run electron:dev
```

This will:
- Start the Vite dev server on `http://localhost:8080`
- Launch Electron with DevTools open
- Enable hot-reload for React components

## Production Build Features

- ✅ Standalone Windows executable
- ✅ No internet connection required
- ✅ Local file system storage
- ✅ Desktop shortcut creation
- ✅ Start Menu integration
- ✅ Automatic updates (can be configured)

## Troubleshooting

### App won't start
- Check Windows Event Viewer for errors
- Ensure all dependencies are installed
- Try running as Administrator

### Database errors
- Check if the data directory exists: `%APPDATA%\hospital-management-system\hospital-data`
- Ensure write permissions to the AppData folder
- Check disk space availability

### Build fails
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear build folders: `rm -rf dist electron-dist release`
- Ensure you have enough disk space (at least 500MB free)

## System Requirements

- **OS**: Windows 10 (64-bit) or Windows 11
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 500MB for application + data storage
- **CPU**: Any modern processor (Intel Core i3 or equivalent)

## Uninstallation

1. Go to Windows Settings > Apps
2. Find "Hospital Management System"
3. Click Uninstall
4. Optionally delete data folder: `%APPDATA%\hospital-management-system`

## Support

For issues or questions, check the main README.md file or contact support.

