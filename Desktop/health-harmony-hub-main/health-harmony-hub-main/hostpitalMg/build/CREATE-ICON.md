# 🎨 Create Your App Icon

## Quick Steps

### Step 1: Convert SVG to ICO

1. **Open the SVG file**: `build/icon.svg`
2. **Use an online converter**:
   - Go to: https://convertio.co/svg-ico/
   - Upload `icon.svg`
   - Select sizes: **16x16, 32x32, 48x48, 256x256**
   - Download as `icon.ico`
   - Save to: `build/icon.ico`

### Step 2: Alternative - Use Your Own Icon

If you have your own icon image:

1. **Create/Find an icon** (PNG, JPG, or SVG)
   - Size: 512x512 or 1024x1024 pixels
   - Medical/hospital theme recommended

2. **Convert to ICO**:
   - Visit: https://www.icoconverter.com/
   - Upload your image
   - Select all sizes (16, 32, 48, 256)
   - Download and save as `build/icon.ico`

### Step 3: Rebuild the App

After adding `build/icon.ico`:

```bash
npm run electron:build
npm run electron:dist
```

The new icon will appear in:
- ✅ Taskbar
- ✅ Window title bar  
- ✅ Desktop shortcut
- ✅ Installer

## Icon File Locations

- **Windows**: `build/icon.ico` (required)
- **Mac**: `build/icon.icns` (optional)
- **Linux**: `build/icon.png` (optional)

## Recommended Icon Design

For Hospital Management System:
- 🏥 Medical cross (red/blue)
- ❤️ Heart with medical symbol
- 🩺 Stethoscope
- 🏥 Hospital building
- 💊 Medical bag

## Online Icon Converters

- **Convertio**: https://convertio.co/png-ico/
- **ICO Convert**: https://icoconvert.com/
- **Favicon.io**: https://favicon.io/favicon-converter/
- **RealFaviconGenerator**: https://realfavicongenerator.net/

## Desktop Tools

- **IcoFX** (Windows): https://icofx.ro/
- **Image2icon** (Mac): https://www.img2icnsapp.com/
- **GIMP** (Free, all platforms)

---

**After creating `build/icon.ico`, rebuild the app to see your custom icon!** 🚀

