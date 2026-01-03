# 🖥️ Install as System Application

## Option 1: Use the Installer (Recommended)

### Step 1: Run the Installer
1. Go to: `release\Hospital Management System Setup 1.0.0.exe`
2. **Double-click** to run
3. Follow the installation wizard

### Step 2: Installation Options
- **Install for all users**: Choose "Install for all users" during setup
- **Install location**: Default is `C:\Program Files\Hospital Management System\`
- **Desktop shortcut**: Check "Create desktop shortcut"
- **Start menu**: Check "Create Start menu shortcut"

### Step 3: After Installation
- App will be available in **Start Menu**
- Desktop shortcut will be created
- Can be uninstalled via **Control Panel** → **Programs**

## Option 2: Manual System Installation

### Copy to Program Files
```powershell
# Run PowerShell as Administrator
# Copy app to Program Files
Copy-Item -Path "release\win-unpacked" -Destination "C:\Program Files\Hospital Management System" -Recurse -Force

# Create Start Menu shortcut for all users
$WshShell = New-Object -ComObject WScript.Shell
$StartMenu = "$env:ALLUSERSPROFILE\Microsoft\Windows\Start Menu\Programs"
$Shortcut = $WshShell.CreateShortcut("$StartMenu\Hospital Management System.lnk")
$Shortcut.TargetPath = "C:\Program Files\Hospital Management System\Hospital Management System.exe"
$Shortcut.WorkingDirectory = "C:\Program Files\Hospital Management System"
$Shortcut.Save()
```

## Option 3: Portable Version (Current)

The current build in `release\win-unpacked\` is **portable**:
- ✅ No installation needed
- ✅ Can run from anywhere
- ✅ Just create a shortcut

---

**Use the installer for system-wide installation!** 🚀

