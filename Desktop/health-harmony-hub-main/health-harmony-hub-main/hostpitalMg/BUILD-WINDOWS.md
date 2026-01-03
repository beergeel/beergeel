# Step-by-Step Guide: Building Windows PC Installer

Follow these steps to create a Windows installer (.exe) file for the Hospital Management System.

## Prerequisites Check

Before starting, ensure you have:

- ✅ **Node.js** installed (v18 or higher)
  - Check: Open Command Prompt and type `node --version`
  - Download: https://nodejs.org/ if not installed

- ✅ **Windows 10/11** (64-bit)

- ✅ **Git** (optional, only if cloning repository)

---

## Step 1: Open Command Prompt

1. Press `Windows Key + R`
2. Type `cmd` and press Enter
3. Or search "Command Prompt" in Start Menu

---

## Step 2: Navigate to Project Folder

```bash
cd C:\Users\pc\Desktop\health-harmony-hub-main\health-harmony-hub-main\hostpitalMg
```

**Or** if you're already in the project folder, verify with:
```bash
dir
```
You should see `package.json`, `src`, `electron` folders.

---

## Step 3: Install Dependencies

This downloads all required packages (first time only, or after updates):

```bash
npm install
```

**Wait for completion** - This may take 2-5 minutes. You'll see:
```
added 500+ packages
```

**If you get errors:**
- Make sure you have internet connection
- Try: `npm cache clean --force` then `npm install` again

---

## Step 4: Build the Application

This compiles the React app and Electron files:

```bash
npm run electron:build
```

**What this does:**
- Builds React app → `dist/` folder
- Compiles Electron TypeScript → `electron-dist/` folder

**Wait for completion** - You'll see:
```
✓ built in XXs
```

**Time:** Usually 30-60 seconds

---

## Step 5: Create Windows Installer

This creates the `.exe` installer file:

```bash
npm run electron:dist
```

**What this does:**
- Packages everything into a Windows installer
- Creates installer in `release/` folder

**Wait for completion** - This takes 1-3 minutes. You'll see:
```
Packaging app for platform win32 x64
```

---

## Step 6: Find Your Installer

After Step 5 completes, your installer is ready!

**Location:**
```
C:\Users\pc\Desktop\health-harmony-hub-main\health-harmony-hub-main\hostpitalMg\release\
```

**File name:**
```
Hospital Management System Setup 1.0.0.exe
```

---

## Step 7: Test the Installer (Optional)

1. Double-click the `.exe` file
2. Follow the installation wizard
3. Choose installation location (or use default)
4. Check "Create desktop shortcut" if desired
5. Click "Install"
6. Launch the app from desktop or Start Menu

---

## Quick Reference Commands

**All-in-one build command:**
```bash
npm install && npm run electron:build && npm run electron:dist
```

**Development mode (for testing):**
```bash
npm run electron:dev
```

**Clean and rebuild (if having issues):**
```bash
npm run electron:compile
npm run build
npm run electron:build
npm run electron:dist
```

---

## Troubleshooting

### Error: "npm is not recognized"
- **Solution:** Install Node.js from https://nodejs.org/
- Restart Command Prompt after installation

### Error: "Cannot find module"
- **Solution:** Run `npm install` again

### Build fails
- **Solution:** 
  1. Delete `node_modules` folder
  2. Delete `dist` and `electron-dist` folders
  3. Run `npm install` again
  4. Try building again

### Installer not created
- **Check:** Look in `release/` folder
- **Solution:** Make sure Step 4 completed successfully before Step 5

### Out of disk space
- **Solution:** Free up at least 500MB of disk space

---

## File Sizes

- **Installer:** ~100-200 MB
- **Installed app:** ~200-300 MB
- **Data folder:** Grows with usage

---

## Success Checklist

After completing all steps, you should have:

- ✅ `release/Hospital Management System Setup 1.0.0.exe` file exists
- ✅ File size is around 100-200 MB
- ✅ You can double-click and install it
- ✅ App launches after installation
- ✅ Data is saved in `%APPDATA%\hospital-management-system\`

---

## Next Steps

1. **Distribute:** Share the `.exe` file with users
2. **Install:** Users can install on any Windows PC
3. **Backup:** Users can backup data from `%APPDATA%\hospital-management-system\hospital-data\`

---

## Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Make sure all prerequisites are installed
3. Try the troubleshooting steps above
4. Check `WINDOWS-DEPLOYMENT.md` for more details

