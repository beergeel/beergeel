# Create Release Folder - Build the App

## The `release` folder doesn't exist yet - that's normal!

The `release` folder is **created automatically** when you build the installer.

## ✅ Steps to Create Release Folder

### Step 1: Build the Application
```bash
npm run electron:build
```

Wait for completion (30-60 seconds). This creates:
- `dist/` folder (React app)
- `electron-dist/` folder (Electron files)

### Step 2: Create Installer (This Creates Release Folder)
```bash
npm run electron:dist
```

Wait for completion (1-3 minutes). This creates:
- `release/` folder ← **This is what you need!**
  - `release\win-unpacked\` - Unpacked app for testing
  - `release\Hospital Management System Setup 1.0.0.exe` - Windows installer

## 🎯 All-in-One Command

Run both commands:

```bash
npm run electron:build
npm run electron:dist
```

## 📍 After Building

The `release` folder will be at:
```
C:\Users\pc\Desktop\health-harmony-hub-main\health-harmony-hub-main\hostpitalMg\release\
```

Inside you'll find:
- `win-unpacked\Hospital Management System.exe` - Run this to test
- `Hospital Management System Setup 1.0.0.exe` - Installer for distribution

## ✅ Quick Test

After `electron:build` completes, you can test immediately:
- Go to: `dist\` folder
- But for full Electron app, you need `electron:dist` to create `release\win-unpacked\`

---

**Run the build commands and the release folder will be created!** 🚀

