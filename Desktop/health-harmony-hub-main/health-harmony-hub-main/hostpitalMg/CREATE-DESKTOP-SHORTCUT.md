# 🖥️ Create Desktop Shortcut

## Quick Method: Manual

1. **Go to**: `release\win-unpacked\Hospital Management System.exe`
2. **Right-click** on `Hospital Management System.exe`
3. **Send to** → **Desktop (create shortcut)**
4. Done! ✅

## PowerShell Method (Automated)

Run this command:

```powershell
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut("$env:USERPROFILE\Desktop\Hospital Management System.lnk")
$Shortcut.TargetPath = "$PWD\release\win-unpacked\Hospital Management System.exe"
$Shortcut.WorkingDirectory = "$PWD\release\win-unpacked"
$Shortcut.IconLocation = "$PWD\release\win-unpacked\Hospital Management System.exe,0"
$Shortcut.Description = "Hospital Management System - Desktop Application"
$Shortcut.Save()
Write-Host "Desktop shortcut created!"
```

## Install as System Application

To install it system-wide (for all users), you need to:

1. **Run the installer**: `release\Hospital Management System Setup 1.0.0.exe`
2. **Install** it to Program Files (default location)
3. It will create shortcuts for all users

---

**Choose the method you prefer!** 🚀

