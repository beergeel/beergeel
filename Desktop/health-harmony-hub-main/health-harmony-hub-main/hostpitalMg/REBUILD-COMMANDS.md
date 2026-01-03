# Rebuild Commands - Run One at a Time

## Step-by-Step Commands

Copy and paste each command **one at a time** into Command Prompt:

### Step 1: Navigate to Project Folder
```bash
cd C:\Users\pc\Desktop\health-harmony-hub-main\health-harmony-hub-main\hostpitalMg
```

### Step 2: Delete dist folder
```bash
rmdir /s /q dist
```
(If it says "The system cannot find the path specified" - that's OK, it means the folder doesn't exist)

### Step 3: Delete electron-dist folder
```bash
rmdir /s /q electron-dist
```
(If it says "The system cannot find the path specified" - that's OK)

### Step 4: Delete release folder
```bash
rmdir /s /q release
```
(If it says "The system cannot find the path specified" - that's OK)

### Step 5: Rebuild the Application
```bash
npm run electron:build
```

Wait for this to complete (30-60 seconds).

### Step 6: Test the App
Go to: `release\win-unpacked\Hospital Management System.exe`

---

## Alternative: If Folders Don't Exist

If you get "The system cannot find the path specified" for all three folders, that's fine! Just skip to Step 5:

```bash
npm run electron:build
```

This will create fresh build files with all the fixes.

---

## Quick Version (If folders already deleted)

Just run:
```bash
npm run electron:build
```

Then test: `release\win-unpacked\Hospital Management System.exe`

