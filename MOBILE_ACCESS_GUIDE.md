# 📱 How to Access Your App from Mobile Device

## The Problem
You're seeing **"ERR_CONNECTION_REFUSED"** because `localhost:3000` on your phone refers to **your phone**, not your computer!

---

## ✅ Solution: Use Your Computer's IP Address

### **Step 1: Find Your Computer's IP Address**

#### On Windows (PowerShell or Command Prompt):

```powershell
ipconfig
```

Look for **"IPv4 Address"** under your active network adapter (WiFi or Ethernet).

**Example output:**
```
Wireless LAN adapter Wi-Fi:
   IPv4 Address. . . . . . . . . . . : 192.168.1.100
```

Your IP is: **192.168.1.100**

#### Quick Command (Copy & Paste):
```powershell
ipconfig | findstr /i "IPv4"
```

---

### **Step 2: Make Sure Both Devices Are on the Same WiFi**

⚠️ **IMPORTANT:** Your phone and computer must be connected to the **SAME WiFi network**!

- Computer WiFi: Same network as phone
- Phone WiFi: Same network as computer

---

### **Step 3: Access from Your Phone**

Instead of:
```
❌ http://localhost:3000
```

Use:
```
✅ http://YOUR_IP_ADDRESS:3000
```

**Example:**
```
http://192.168.1.100:3000
```

---

### **Step 4: Access a Ticket Link**

For ticket links, replace:
```
❌ http://localhost:3000/ticket/ABC12XY7
```

With:
```
✅ http://192.168.1.100:3000/ticket/ABC12XY7
```

---

## 🚀 Quick Test Steps

1. **On your computer:**
   - Run: `ipconfig` in PowerShell
   - Note your IPv4 address (e.g., 192.168.1.100)
   - Make sure `npm start` is running

2. **On your phone:**
   - Connect to same WiFi
   - Open browser
   - Type: `http://YOUR_IP:3000`
   - Press Enter

3. **You should see:**
   - Your clinic app homepage!

---

## 🐛 Troubleshooting

### Error: "Site can't be reached"

**Check:**
- ✅ Both devices on same WiFi?
- ✅ `npm start` is running on computer?
- ✅ Firewall not blocking port 3000?
- ✅ IP address correct?

### Fix Windows Firewall (if needed):

```powershell
# Run as Administrator
netsh advfirewall firewall add rule name="React Dev Server" dir=in action=allow protocol=TCP localport=3000
```

---

## 📱 Alternative: Use ngrok (For Internet Access)

If you want to access from anywhere (not just same WiFi):

1. **Install ngrok:**
   ```bash
   npm install -g ngrok
   ```

2. **Start ngrok:**
   ```bash
   ngrok http 3000
   ```

3. **Use the provided URL:**
   ```
   https://abc123.ngrok.io
   ```

This works from anywhere with internet!

---

## 💡 Pro Tips

### Save Your IP in Environment Variable

Create `.env.local`:
```
REACT_APP_HOST=192.168.1.100
```

Update ticket links to use:
```javascript
const link = `http://${process.env.REACT_APP_HOST || window.location.host}/ticket/${ticketCode}`;
```

### Update package.json (Optional)

To automatically use your IP:

```json
{
  "scripts": {
    "start": "set HOST=0.0.0.0 && react-scripts start"
  }
}
```

Then access with your IP automatically!

---

## 🎯 Testing Ticket Feature on Mobile

1. **Create ticket on computer**
2. **Copy ticket code** (e.g., ABC12XY7)
3. **On your phone, open:**
   ```
   http://YOUR_IP:3000/ticket/ABC12XY7
   ```
4. **Test WhatsApp button** - should open WhatsApp app!

---

## 📊 Network Setup Visual

```
┌─────────────────┐
│  WiFi Router    │
│  192.168.1.1    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│ PC   │  │Phone │
│:3000 │  │Chrome│
└──────┘  └──────┘
192.168    Access via
  .1.100   192.168.1.100:3000
```

---

## ✅ Success Checklist

- [ ] Found computer IP address (ipconfig)
- [ ] Both devices on same WiFi
- [ ] npm start is running
- [ ] Can access http://YOUR_IP:3000 from phone
- [ ] Ticket links work with IP instead of localhost
- [ ] WhatsApp button opens WhatsApp app

---

## 🔥 Quick Reference

**Find IP:**
```powershell
ipconfig | findstr IPv4
```

**Test from phone:**
```
http://YOUR_IP:3000
```

**Ticket link format:**
```
http://YOUR_IP:3000/ticket/CODE
```

---

**Remember:** Replace `YOUR_IP` with your actual IP address! 🚀

