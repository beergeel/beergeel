# Pharmacy Queue Error Fix Guide

## Problem
**Error Message**: "Prescription not found! Please make sure the doctor has created a prescription for this visit."

**What's happening**: Patient "axmed" (06330511980) is in the pharmacy queue, but there's no prescription record in the database for this visit.

---

## Root Cause

The patient was added to the pharmacy queue, but the doctor **didn't create a prescription** during consultation. The prescription is only created when:
1. Doctor fills in the "Prescribed Drugs" field in the consultation form
2. Doctor clicks "Save & Wait for Results" or "Complete Consultation"

---

## Solution Steps

### Option 1: Doctor Creates Prescription (Recommended)

1. **Login as Doctor**
   - Login ID: `4696972`
   - Password: `1234`
   - Role: Doctor

2. **Go to Doctor Queue**
   - Click "Doctor Queue" in the sidebar
   - Find patient "axmed" in the queue

3. **Start/Continue Consultation**
   - Click "Start Consultation" or "Continue" button
   - Fill in consultation details (Chief Complaint, Diagnosis, etc.)

4. **Add Prescription**
   - Scroll down to the "Prescription" section
   - In the "Prescribed Drugs" textarea, enter the medication details
   - Example: "Paracetamol 500mg, 2 tablets twice daily for 5 days"

5. **Save Consultation**
   - Click "Save & Wait for Results" or "Complete Consultation"
   - This will create the prescription record AND add patient to pharmacy queue

6. **Verify**
   - Go back to Pharmacy Queue
   - Patient should now show the prescription details
   - You can now dispense

---

### Option 2: Remove from Queue (If No Prescription Needed)

If the patient doesn't actually need a prescription:

1. **Login as Reception or Doctor**
2. **Check the visit**
   - Go to Patient List
   - Find patient "axmed"
   - Check if they actually need a prescription

3. **Remove from Pharmacy Queue** (Manual database fix)
   - You may need to manually remove the queue entry from Supabase
   - Or wait for the system to auto-remove after consultation completion

---

## Prevention: Correct Workflow

### Proper Workflow for Doctor:

```
1. Patient visits → Reception creates visit → Added to Doctor Queue
2. Doctor views queue → Starts consultation
3. Doctor fills consultation form:
   ✓ Chief Complaint (required)
   ✓ History, Physical Exam, Diagnosis
   ✓ Lab Tests (if needed)
   ✓ Prescription (if medication needed) ← IMPORTANT!
4. Doctor saves consultation
5. System automatically:
   - Creates consultation record
   - Creates prescription (if prescription field filled)
   - Adds to pharmacy queue (if prescription exists)
   - Adds to lab queue (if lab tests selected)
```

### Key Points:
- **Prescription field must NOT be empty** if patient needs medication
- Prescription is created only when doctor enters text in "Prescribed Drugs" field
- Pharmacy queue is created automatically when prescription is created
- If prescription field is empty, no prescription record is created

---

## Quick Check Commands

To verify the issue in Supabase:

```sql
-- Check if prescription exists for this visit
SELECT * FROM prescriptions WHERE visit_id = [VISIT_ID];

-- Check queue entries
SELECT * FROM queue WHERE department = 'pharmacy' AND status = 'pending';

-- Check visits for patient
SELECT v.*, p.name, p.mobile 
FROM visits v 
JOIN patients p ON v.patient_id = p.id 
WHERE p.mobile = '06330511980';
```

---

## Next Steps

1. **Immediate**: Have doctor create prescription for this visit
2. **Verify**: Check pharmacy queue again - prescription should appear
3. **Dispense**: Pharmacy can now dispense the medication
4. **Prevent**: Ensure doctors always fill prescription field when medication is needed

