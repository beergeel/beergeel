# How to Open DevTools in Electron App

## ✅ I've Added DevTools Support!

After rebuilding, you can open DevTools in **3 ways**:

### Method 1: Press F12
- Just press **F12** key when the app is running
- DevTools will open/close

### Method 2: Use Menu
- Click **View** in the menu bar (top of window)
- Click **Toggle Developer Tools**
- Or use shortcut: **F12**

### Method 3: Keyboard Shortcut
- Press **Ctrl + Shift + I**
- DevTools will open/close

## 🔧 Rebuild Required

You need to rebuild for DevTools to work:

```bash
npm run electron:build
```

Then test: `release\win-unpacked\Hospital Management System.exe`

## 🔍 What to Check in DevTools

Once DevTools opens:

1. Go to **Console** tab
2. Look for these messages:
   - `Router type: HashRouter` (should say HashRouter)
   - `Is Electron: true` (should be true)
   - `Is File Protocol: true` (should be true)

3. If you see errors, check the **Console** tab for details

## ✅ After Rebuilding

1. Run the app
2. Press **F12** (or use View menu)
3. Check Console for router type
4. The 404 should be fixed if it says "HashRouter"

---

**Rebuild now and F12 will work!** 🚀

