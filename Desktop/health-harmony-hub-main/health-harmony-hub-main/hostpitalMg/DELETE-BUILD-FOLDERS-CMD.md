# 🗑️ Delete Build Folders - Command Prompt (CMD)

## For Command Prompt (cmd.exe)

### Delete Folders One by One:
```cmd
rmdir /s /q release
rmdir /s /q dist
rmdir /s /q electron-dist
```

### Or All at Once:
```cmd
rmdir /s /q release && rmdir /s /q dist && rmdir /s /q electron-dist
```

## For PowerShell (if you switch to PowerShell)

```powershell
Remove-Item -Recurse -Force release -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force electron-dist -ErrorAction SilentlyContinue
```

## Quick Fix - Copy and Paste This:

```cmd
rmdir /s /q release
rmdir /s /q dist
rmdir /s /q electron-dist
```

If it says "cannot find path", that's OK - just means folder doesn't exist.

---

**Use these commands in Command Prompt (cmd.exe)!** 🚀

