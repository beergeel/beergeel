# ✅ Correct Commands to Delete Build Folders

## You're Using PowerShell (Not Command Prompt)

### Option 1: PowerShell Commands (One by One)
```powershell
Remove-Item -Recurse -Force release -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force electron-dist -ErrorAction SilentlyContinue
```

### Option 2: PowerShell Commands (All at Once)
```powershell
Remove-Item -Recurse -Force release,dist,electron-dist -ErrorAction SilentlyContinue
```

### Option 3: If Folders Don't Exist (Safe)
```powershell
if (Test-Path release) { Remove-Item -Recurse -Force release }
if (Test-Path dist) { Remove-Item -Recurse -Force dist }
if (Test-Path electron-dist) { Remove-Item -Recurse -Force electron-dist }
```

## For Command Prompt (cmd.exe) - If You Switch

```cmd
rmdir /s /q release
rmdir /s /q dist
rmdir /s /q electron-dist
```

## ✅ Quick Copy-Paste (PowerShell)

Copy and paste this:
```powershell
Remove-Item -Recurse -Force release,dist,electron-dist -ErrorAction SilentlyContinue
```

---

**Use PowerShell commands in PowerShell!** 🚀

