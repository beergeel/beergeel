# 🎨 Using Your Custom Logo as App Icon

## Steps to Use Your Logo

### Step 1: Save Your Logo Image

1. **Right-click on the logo image** you want to use
2. **Save it** to your computer
3. **Recommended location**: Save it as `build/logo.png` or `build/logo.jpg`

### Step 2: Convert to ICO Format

Your logo needs to be converted to `.ico` format for Windows Electron apps.

#### Option A: Online Converter (Easiest)

1. **Go to**: https://convertio.co/png-ico/ or https://www.icoconverter.com/
2. **Upload** your logo image (PNG, JPG, or SVG)
3. **Select multiple sizes**:
   - ✅ 16x16 pixels
   - ✅ 32x32 pixels
   - ✅ 48x48 pixels
   - ✅ 256x256 pixels
4. **Click "Convert"**
5. **Download** the `.ico` file
6. **Save it as**: `build/icon.ico`

#### Option B: Using IcoFX (Windows Desktop Tool)

1. **Download IcoFX**: https://icofx.ro/
2. **Open** your logo image in IcoFX
3. **File → Export → Export as ICO**
4. **Select all sizes** (16, 32, 48, 256)
5. **Save as**: `build/icon.ico`

### Step 3: Verify the File

Make sure the file is saved as:
```
build/icon.ico
```

### Step 4: Rebuild the App

After placing `icon.ico` in the `build/` folder:

```bash
npm run electron:build
npm run electron:dist
```

## ✅ Your Icon Will Appear In:

- Taskbar (when app is running)
- Window title bar
- Desktop shortcut
- Start menu shortcut
- Installer file
- File Explorer

## 📝 Quick Command (If Logo is Already Saved)

If you've already saved your logo as `logo.png` in the `build/` folder:

1. Convert it online to `icon.ico`
2. Place `icon.ico` in `build/` folder
3. Rebuild: `npm run electron:build`

---

**Once `build/icon.ico` exists, rebuild to see your custom logo!** 🚀

