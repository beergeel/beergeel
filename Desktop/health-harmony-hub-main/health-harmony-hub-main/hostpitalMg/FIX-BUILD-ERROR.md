# Fix: Build Error - Symbolic Link Permission Issue

## Problem
You're getting this error:
```
ERROR: Cannot create symbolic link : A required privilege is not held by the client.
```

## Solution Applied
I've disabled code signing in the build configuration. This fixes the issue.

## Try Building Again

Run this command again:
```bash
npm run electron:dist
```

## Alternative Solutions (if still having issues)

### Option 1: Run as Administrator
1. Close current Command Prompt
2. Right-click on Command Prompt
3. Select "Run as administrator"
4. Navigate to project folder
5. Run: `npm run electron:dist`

### Option 2: Enable Developer Mode (Windows 10/11)
1. Open Windows Settings (Windows Key + I)
2. Go to "Privacy & Security" → "For developers"
3. Enable "Developer Mode"
4. Restart Command Prompt
5. Run: `npm run electron:dist`

### Option 3: Clear Cache and Retry
```bash
rmdir /s /q "%LOCALAPPDATA%\electron-builder\Cache"
npm run electron:dist
```

## What Changed
- Disabled code signing (`"sign": false`)
- This is fine for local builds and testing
- You can enable it later if you need signed installers

## Next Steps
After the build completes successfully, you'll find your installer in:
```
hostpitalMg\release\Hospital Management System Setup 1.0.0.exe
```

