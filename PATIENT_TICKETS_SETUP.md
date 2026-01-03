# Patient Tickets - Quick Setup Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Database Table

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor**
4. Open the file `CREATE_PATIENT_TICKETS_TABLE.sql`
5. Copy all contents
6. Paste into SQL Editor
7. Click **Run** or press `Ctrl/Cmd + Enter`

**✅ Success indicators:**
- "Success. No rows returned"
- Table created with triggers and functions

### Step 2: Verify Installation

Run this query in SQL Editor:

```sql
-- Test ticket code generation
SELECT generate_ticket_code();

-- Check table structure
SELECT * FROM patient_tickets LIMIT 1;
```

### Step 3: Test the Feature

1. **Start your React app:**
   ```bash
   npm start
   ```

2. **Login as reception:**
   - Username: `4026635`
   - Password: `1234`
   - Role: Reception

3. **Navigate to Patient Tickets:**
   - Click "Patient Tickets" in the sidebar

4. **Create a test ticket:**
   - Click "Create New Ticket"
   - Search for a patient (or create one first)
   - Fill in the form
   - Submit

5. **Test the shareable link:**
   - Copy the ticket link
   - Open in a new browser tab/window
   - Verify ticket displays correctly

### Step 4: Test WhatsApp Integration

1. **Create a ticket with WhatsApp number:**
   - Use format: `252634026635` (with country code)
   - Click WhatsApp button
   - WhatsApp should open with pre-filled message

2. **Test on mobile:**
   - Share ticket link to your phone
   - Open link on mobile browser
   - Click WhatsApp button
   - Verify WhatsApp app opens

---

## 📱 Mobile Testing

### iOS Testing
1. Open Safari on iPhone
2. Navigate to ticket link
3. Test all buttons (Call, WhatsApp)
4. Check layout in portrait and landscape
5. Try adding to home screen

### Android Testing
1. Open Chrome on Android
2. Navigate to ticket link
3. Test all buttons
4. Check responsiveness
5. Try share functionality

---

## 🔧 Configuration

### Default Clinic Phone Number

Update in `PublicTicketView.js`:

```javascript
// Line ~37
const whatsappNumber = ticket.whatsapp_number || '252634026635'; // Change this
```

And in `PatientTickets.js`:

```javascript
// Line ~94 (shareViaWhatsApp function)
const message = `...Contact: 0634026635`; // Change this
```

### Clinic Information

Update in `PublicTicketView.js`:

```javascript
// Clinic name (line ~64)
<h3 className="clinic-name">Beergeel Obstetrics and Gynecology Clinic</h3>

// Clinic address (line ~153)
<span>Xero awr kasoo horjeedka Ayuub Restaurant...</span>

// Clinic hours (line ~179)
<p>Monday - Saturday: 5:00 PM - 10:00 PM</p>
```

---

## 🌐 Deployment

### For Production Deployment

1. **Update base URL:**
   - In `PatientTickets.js`, update:
     ```javascript
     const link = `https://your-domain.com/ticket/${ticketCode}`;
     ```

2. **Configure routing:**
   - Ensure server handles client-side routing
   - For React apps, all routes should redirect to index.html

3. **Test production build:**
   ```bash
   npm run build
   npm install -g serve
   serve -s build
   ```

### Netlify Deployment

Create `_redirects` file in `public/` folder:

```
/*    /index.html   200
```

### Vercel Deployment

Create `vercel.json`:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 📊 Database Queries

### View all tickets

```sql
SELECT 
    pt.*,
    p.name as patient_name,
    p.mobile as patient_mobile
FROM patient_tickets pt
JOIN patients p ON pt.patient_id = p.id
ORDER BY pt.created_date DESC;
```

### View active tickets

```sql
SELECT * FROM patient_tickets 
WHERE status = 'active' 
ORDER BY appointment_date;
```

### Count tickets by status

```sql
SELECT status, COUNT(*) as count
FROM patient_tickets
GROUP BY status;
```

### Find tickets expiring soon

```sql
SELECT * FROM patient_tickets 
WHERE status = 'active' 
AND expires_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
ORDER BY expires_date;
```

---

## 🎨 Customization

### Change Ticket Code Format

Edit `CREATE_PATIENT_TICKETS_TABLE.sql`:

```sql
-- Change length from 8 to 10 characters
FOR i IN 1..10 LOOP  -- Changed from 8
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
END LOOP;
```

### Change Ticket Number Format

```sql
-- Current: TKT-20231227-0001
-- Change to: BRGL-20231227-0001
NEW.ticket_number := 'BRGL-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || ...
```

### Add Custom Fields

```sql
ALTER TABLE patient_tickets 
ADD COLUMN custom_field TEXT;
```

Then update components to include new field.

---

## 🐛 Troubleshooting

### "Table does not exist"

**Solution:**
- Run CREATE_PATIENT_TICKETS_TABLE.sql again
- Check Supabase connection
- Verify project is correct

### "Ticket not found" on valid link

**Solution:**
- Check ticket_code in database
- Verify URL format: `/ticket/CODE`
- Check browser console for errors
- Ensure App.js routing is correct

### WhatsApp button does nothing

**Solution:**
- Check phone number format (no spaces, include country code)
- Allow popups in browser
- Verify WhatsApp is installed (mobile)
- Check browser console for blocked popups

### Responsive issues

**Solution:**
- Hard refresh browser (Ctrl/Cmd + Shift + R)
- Clear cache
- Verify index.css was updated
- Check viewport meta tag in index.html

### Auto-generation not working

**Solution:**
```sql
-- Verify trigger exists
SELECT * FROM pg_trigger WHERE tgname = 'before_insert_patient_tickets';

-- Verify function exists
SELECT * FROM pg_proc WHERE proname = 'generate_ticket_code';

-- Re-run CREATE_PATIENT_TICKETS_TABLE.sql
```

---

## 📞 Support Checklist

Before asking for help, verify:

- [ ] Database table created successfully
- [ ] All files are saved
- [ ] React app restarted after changes
- [ ] No console errors
- [ ] Supabase connection working
- [ ] Correct user role logged in
- [ ] Browser cache cleared

---

## 🎯 Testing Checklist

- [ ] Create ticket successfully
- [ ] Ticket appears in list
- [ ] Copy link works
- [ ] Ticket link opens correctly
- [ ] All patient info displays
- [ ] WhatsApp button works
- [ ] Call button works (mobile)
- [ ] Responsive on mobile
- [ ] Status updates work
- [ ] Filter by status works

---

## 📝 Common Scenarios

### Scenario 1: Walk-in Patient

1. Register patient (if new)
2. Create ticket with immediate appointment time
3. Mark as "Used" when checked in
4. Link ticket to visit record

### Scenario 2: Scheduled Appointment

1. Create ticket with future date
2. Add WhatsApp number
3. Share via WhatsApp
4. Patient receives link
5. Patient arrives with ticket code
6. Mark as "Used"

### Scenario 3: Follow-up Visit

1. Find patient in system
2. Create ticket with "Follow-up" purpose
3. Reference previous visit in notes
4. Share with patient
5. Track appointment

### Scenario 4: Emergency

1. Create ticket with "Emergency" purpose
2. No appointment time needed
3. Immediate WhatsApp notification
4. Patient arrives
5. Priority handling

---

## 🔐 Security Notes

### Ticket Code Security

- 8 characters = 2,821,109,907,456 combinations
- Characters exclude similar-looking ones (I, O, 0, 1)
- Auto-generated, not predictable
- Case-insensitive for user convenience

### Data Privacy

- No medical information in URL
- Ticket shows only basic patient info
- Diagnosis/results NOT included
- Secure HTTPS recommended in production

### Access Control

- Only reception staff can create tickets
- Patients can only view via direct link
- No public ticket listing
- Staff can cancel if compromised

---

## 📈 Success Metrics

Track these to measure success:

1. **Ticket Creation Rate**
   - Tickets created per day
   - Purpose distribution

2. **Usage Rate**
   - % of tickets marked as "Used"
   - Average time from creation to use

3. **No-Show Rate**
   - % of tickets expired/cancelled
   - Time-of-day patterns

4. **WhatsApp Engagement**
   - % of tickets shared via WhatsApp
   - Patient response rate

---

## 🚀 Next Steps

After basic setup:

1. **Train staff** on creating tickets
2. **Test with real patients** (beta group)
3. **Gather feedback** from patients
4. **Monitor usage** for first week
5. **Optimize** based on data
6. **Roll out** to all patients

---

## ✅ Quick Reference

### File Locations

```
beergeel/
├── CREATE_PATIENT_TICKETS_TABLE.sql (Database)
├── PATIENT_TICKETS_GUIDE.md (Full guide)
├── PATIENT_TICKETS_SETUP.md (This file)
└── src/
    ├── components/
    │   ├── PatientTickets.js (Staff interface)
    │   ├── PublicTicketView.js (Patient view)
    │   ├── MainApp.js (Updated)
    │   └── Sidebar.js (Updated)
    ├── utils/
    │   └── supabaseDB.js (Updated)
    ├── App.js (Updated with routing)
    └── index.css (Updated with styles)
```

### Key URLs

- Staff: `/` → Login → Patient Tickets menu
- Patient: `/ticket/[CODE]` → Direct access

### Default Credentials

- Reception: `4026635` / `1234`

---

**Need Help?** Check PATIENT_TICKETS_GUIDE.md for detailed documentation.

