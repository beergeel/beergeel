# Patient Tickets Feature - Complete Guide

## Overview

The Patient Tickets feature is a comprehensive system that allows the clinic to generate unique, shareable ticket links for patients. This feature works seamlessly on both mobile and web platforms and includes WhatsApp integration for easy communication.

---

## Features

### 1. **Unique Ticket Generation**
- Each ticket has two identifiers:
  - **Ticket Number**: Format `TKT-YYYYMMDD-NNNN` (e.g., TKT-20231227-0001)
  - **Ticket Code**: 8-character unique code (e.g., `ABC12XY7`)
- Automatic generation of unique codes using database triggers
- Prevents duplicate codes

### 2. **Shareable Links**
- Direct link format: `https://your-clinic-url.com/ticket/ABC12XY7`
- Copy link to clipboard with one click
- Share directly via WhatsApp with pre-formatted message

### 3. **WhatsApp Integration**
- Click-to-chat functionality
- Pre-filled messages with ticket information
- Opens WhatsApp on mobile or web (wa.me link)
- Country code support (default: Somalia +252)

### 4. **Responsive Design**
- Mobile-first approach
- Touch-friendly buttons (44px minimum touch targets)
- Optimized for small screens
- Works offline once loaded

### 5. **Ticket Management**
- Create, view, update, and cancel tickets
- Filter by status (Active, Used, Expired, Cancelled)
- Track appointment dates and times
- Add notes and special instructions

---

## Installation & Setup

### Step 1: Database Setup

Run the SQL migration file in your Supabase SQL Editor:

```bash
# File: CREATE_PATIENT_TICKETS_TABLE.sql
```

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `CREATE_PATIENT_TICKETS_TABLE.sql`
4. Click "Run" to create the table, indexes, functions, and triggers

**What this creates:**
- `patient_tickets` table
- Indexes for performance
- `generate_ticket_code()` function
- Auto-trigger for ticket number and code generation

### Step 2: Verify Installation

After running the migration, verify:

```sql
-- Check if table exists
SELECT * FROM patient_tickets LIMIT 1;

-- Check if function exists
SELECT generate_ticket_code();
```

---

## How to Use

### For Reception Staff

#### Creating a New Ticket

1. **Login** as reception staff
2. Navigate to **Patient Tickets** from the sidebar
3. Click **"Create New Ticket"** button
4. Fill in the form:
   - **Select Patient**: Search by name or mobile number
   - **Purpose**: Choose from dropdown (Consultation, Follow-up, Lab Test, etc.)
   - **Appointment Date**: Set date and time (optional)
   - **WhatsApp Number**: Patient's WhatsApp number (with country code)
   - **Notes**: Additional instructions
   - **Expiry Date**: When the ticket should expire (optional)
5. Click **"Create Ticket"**

#### Sharing a Ticket

**Method 1: Copy Link**
1. Find the ticket in the list
2. Click the **Link icon** (🔗)
3. Link is copied to clipboard
4. Share via email, SMS, or any messaging app

**Method 2: WhatsApp Direct Share**
1. Find the ticket in the list
2. Click the **WhatsApp icon** (📱)
3. WhatsApp opens with pre-filled message
4. Select recipient and send

#### Managing Tickets

**Mark as Used:**
- Click the **checkmark icon** (✓)
- Ticket status changes to "Used"

**Cancel Ticket:**
- Click the **X icon**
- Ticket status changes to "Cancelled"

**Filter Tickets:**
- Use status filter buttons: All, Active, Used, Expired, Cancelled

---

### For Patients

#### Accessing a Ticket

1. **Receive the link** from clinic (via WhatsApp, SMS, or email)
   - Example: `https://clinic.com/ticket/ABC12XY7`

2. **Open the link** on mobile or web browser

3. **View ticket information:**
   - Ticket code and number
   - Patient details
   - Appointment date and time
   - Purpose of visit
   - Special notes or instructions

4. **Contact the clinic:**
   - Click **"Call Clinic"** to make a phone call
   - Click **"WhatsApp"** to start a chat

#### Mobile Experience

- **Screenshot the ticket** for offline access
- **Save to home screen** (progressive web app)
- **Share with family** using native share function

---

## WhatsApp Integration Details

### How It Works

The system uses WhatsApp's `wa.me` API to create direct chat links:

```
https://wa.me/252634026635?text=Hello%20I%27m%20Name...
```

### Phone Number Format

- **Include country code**: 252 for Somalia
- **No spaces or special characters**: 252634026635 (not 252-63-402-6635)
- **Remove leading zeros**: If patient enters 0634026635, convert to 252634026635

### Example Numbers

| Country | Format | Example |
|---------|--------|---------|
| Somalia | 252XXXXXXXXX | 252634026635 |
| Kenya | 254XXXXXXXXX | 254712345678 |
| Ethiopia | 251XXXXXXXXX | 251911234567 |

### Pre-filled Message Template

When sharing via WhatsApp:
```
Hello [Patient Name],

Your appointment ticket for Beergeel Clinic:

Ticket Code: ABC12XY7
Ticket Number: TKT-20231227-0001
Purpose: Consultation
Appointment: [Date and Time]

View your ticket: https://clinic.com/ticket/ABC12XY7

Beergeel Obstetrics and Gynecology Clinic
Contact: 0634026635
```

---

## Ticket Lifecycle

```
CREATE → ACTIVE → USED
         ↓
         CANCELLED
         ↓
         EXPIRED
```

### Status Definitions

1. **Active**: Ticket is valid and can be used
2. **Used**: Patient has arrived and ticket was validated
3. **Cancelled**: Ticket was cancelled (rescheduled or patient didn't show)
4. **Expired**: Ticket passed its expiration date

### Automatic Expiration

- Check expires_date field
- Display warning if ticket is expired
- Staff can still manually mark as used

---

## URL Routing

The app automatically detects ticket URLs:

### Pattern Matching
```
/ticket/[TICKET_CODE]
```

### Examples
- ✅ `https://clinic.com/ticket/ABC12XY7`
- ✅ `http://localhost:3000/ticket/XYZ98ABC`
- ❌ `https://clinic.com/tickets/ABC12XY7` (wrong path)
- ❌ `https://clinic.com/ticket/` (missing code)

### Case Insensitive
- `ABC12XY7` = `abc12xy7` = `AbC12xY7`
- System automatically converts to uppercase

---

## Mobile Optimization

### Touch Targets
- Minimum button size: **44px × 44px**
- Increased padding for easier tapping
- Proper spacing between interactive elements

### Responsive Breakpoints

```css
/* Mobile First (default) */
@media (max-width: 576px) { ... }

/* Small tablets */
@media (min-width: 576px) { ... }

/* Tablets and up */
@media (min-width: 768px) { ... }
```

### Mobile-Specific Features
- Smooth scrolling with `-webkit-overflow-scrolling: touch`
- Full-width buttons on small screens
- Stacked layout for contact buttons
- Optimized font sizes
- Reduced padding/margins

---

## Testing

### Test Ticket Creation

1. Create a test patient
2. Generate a ticket
3. Copy the ticket link
4. Open in new incognito/private browser window
5. Verify all information displays correctly

### Test WhatsApp Integration

**On Mobile:**
1. Generate ticket with WhatsApp number
2. Click WhatsApp button
3. Verify WhatsApp app opens
4. Check pre-filled message is correct

**On Desktop:**
1. Same steps
2. WhatsApp Web should open
3. Or download WhatsApp Desktop prompt

### Test Responsive Design

1. Open ticket link on mobile device
2. Check layout is readable
3. Test all buttons work
4. Try both portrait and landscape
5. Test on different devices/browsers

---

## Troubleshooting

### Issue: Ticket Not Found

**Possible Causes:**
- Ticket code is incorrect
- Ticket was deleted from database
- Database connection issue

**Solution:**
1. Verify ticket code is correct (case-insensitive)
2. Check database for ticket record
3. Generate new ticket if needed

### Issue: WhatsApp Not Opening

**Possible Causes:**
- WhatsApp not installed (mobile)
- Phone number format incorrect
- Browser blocking popup

**Solution:**
1. Ensure WhatsApp is installed
2. Check phone number includes country code
3. Allow popups in browser settings
4. Try copying link manually

### Issue: Ticket Link Not Working

**Possible Causes:**
- Routing not configured
- React app not handling URL parameters
- Server redirect issues

**Solution:**
1. Verify App.js includes ticket routing code
2. Check browser console for errors
3. Ensure public/index.html allows client-side routing

### Issue: Responsive Issues

**Solution:**
1. Clear browser cache
2. Verify index.css includes ticket styles
3. Test in different browsers
4. Check viewport meta tag in index.html

---

## Best Practices

### For Staff

1. **Always verify patient details** before creating ticket
2. **Include appointment time** when scheduling
3. **Add clear notes** for special instructions
4. **Use WhatsApp share** for faster communication
5. **Mark tickets as used** immediately when patient arrives

### For Patients

1. **Save ticket screenshot** for offline access
2. **Arrive 15 minutes early** as instructed
3. **Bring ticket code** to reception
4. **Contact clinic** if need to reschedule

### Security Considerations

1. **Ticket codes are 8 characters** - difficult to guess
2. **No sensitive medical info** in ticket link
3. **Expiry dates** for time-limited tickets
4. **Staff can cancel** compromised tickets

---

## Database Schema

### patient_tickets Table

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| patient_id | INTEGER | FK to patients |
| ticket_number | VARCHAR(50) | Auto-generated TKT-YYYYMMDD-NNNN |
| ticket_code | VARCHAR(20) | Auto-generated 8-char code |
| purpose | TEXT | Reason for visit |
| appointment_date | TIMESTAMPTZ | Scheduled date/time |
| notes | TEXT | Additional instructions |
| status | VARCHAR(50) | active/used/expired/cancelled |
| whatsapp_number | VARCHAR(50) | WhatsApp contact |
| created_by | INTEGER | FK to users |
| created_date | TIMESTAMPTZ | Creation timestamp |
| updated_date | TIMESTAMPTZ | Last update |
| expires_date | TIMESTAMPTZ | Optional expiry |
| used_date | TIMESTAMPTZ | When marked as used |

### Indexes

- `idx_patient_tickets_patient_id` on patient_id
- `idx_patient_tickets_ticket_number` on ticket_number
- `idx_patient_tickets_ticket_code` on ticket_code
- `idx_patient_tickets_status` on status

---

## API Methods (supabaseDB.js)

### Available Methods

```javascript
// Create new ticket
await db.createTicket(ticketData);

// Get ticket by code
await db.getTicketByCode('ABC12XY7');

// Get ticket by number
await db.getTicketByNumber('TKT-20231227-0001');

// Get all tickets for a patient
await db.getPatientTickets(patientId);

// Get all tickets
await db.getAllTickets();

// Update ticket status
await db.updateTicketStatus(ticketId, 'used', usedDate);

// Get ticket with patient info
await db.getTicketWithPatient('ABC12XY7');
```

---

## Future Enhancements

### Potential Improvements

1. **QR Code Generation**
   - Add QR code to ticket
   - Scan at reception for quick check-in

2. **SMS Notifications**
   - Send ticket via SMS
   - Appointment reminders

3. **Email Integration**
   - Email ticket to patient
   - Calendar invite attachment

4. **Analytics Dashboard**
   - Track ticket usage
   - Appointment show/no-show rates

5. **Push Notifications**
   - Reminder notifications
   - Status updates

6. **Multi-language Support**
   - Somali, English, Arabic
   - Auto-detect user language

---

## Support

For technical support or feature requests:
- Check logs in browser console
- Review Supabase error logs
- Contact system administrator

---

## License & Credits

Built for Beergeel Obstetrics and Gynecology Clinic
© 2024 - All rights reserved

