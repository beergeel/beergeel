# ⚠️ Close the App First!

## The Problem

You're getting "Access is denied" because **the Electron app is still running**!

The files are locked because the app is using them.

## ✅ Solution: Close App, Then Delete

### Step 1: Close the Electron App
1. Look for "Hospital Management System" in your taskbar
2. Right-click it → **Close** or **Exit**
3. Or press `Alt + F4` when the app window is focused
4. Or use Task Manager:
   - Press `Ctrl + Shift + Esc`
   - Find "Hospital Management System.exe"
   - Right-click → **End Task**

### Step 2: Wait a Few Seconds
Wait 2-3 seconds for files to unlock.

### Step 3: Delete Release Folder Again
```bash
rmdir /s /q release
```

### Step 4: Rebuild
```bash
npm run electron:build
```

## 🎯 Quick Method: Use Task Manager

1. Press `Ctrl + Shift + Esc` (opens Task Manager)
2. Find "Hospital Management System.exe"
3. Right-click → **End Task**
4. Wait 2 seconds
5. Run: `rmdir /s /q release`
6. Run: `npm run electron:build`

## ✅ Alternative: Skip Deleting Release

If you can't delete it, just rebuild - it will overwrite:

```bash
npm run electron:build
```

The new build will replace the old files.

---

**Close the app first, then rebuild!** 🚀

