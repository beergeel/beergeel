# Pharmacy Stock Database Fix Guide

## Problem
Pharmacy stock items are not being added to the database.

## Possible Causes
1. The `pharmacy_stock` table doesn't exist in Supabase
2. The `image_url` column is missing from the table
3. Row Level Security (RLS) policies are blocking inserts
4. The table exists but has incorrect permissions

---

## Solution Steps

### Step 1: Run the Fix SQL Script

1. **Open Supabase Dashboard**
   - Go to https://supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy and Paste**
   - Open the file: `FIX_PHARMACY_STOCK_TABLE.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

4. **Run the Script**
   - Click "Run" or press `Ctrl+Enter`
   - Wait for the script to complete
   - Check the output messages

5. **Expected Output**
   You should see messages like:
   ```
   NOTICE: image_url column already exists (or "Added image_url column")
   NOTICE: pharmacy_stock table has 17 columns
   NOTICE: pharmacy_stock table currently has X rows
   ```

---

### Step 2: Test the Database

1. **Open SQL Editor Again**
   - Click "New Query"

2. **Copy and Paste Test Queries**
   - Open the file: `TEST_PHARMACY_STOCK.sql`
   - Copy the entire contents
   - Paste into the SQL Editor

3. **Run Tests One by One**
   - Highlight each test query (from the comments)
   - Press `Ctrl+Enter` to run
   - Check the results

4. **What to Look For**
   - **Test 1**: Should return `true` (table exists)
   - **Test 2**: Should show columns including `image_url`
   - **Test 3**: Should show count (0 or more)
   - **Test 6**: Should successfully insert a test item
   - **Test 7**: Should show the test item

---

### Step 3: Verify in the Application

1. **Open the Application**
   - Go to Pharmacy Stock page
   - Click "Add Stock Item"

2. **Fill in the Form**
   - Medication Name: Test Med
   - Quantity: 10
   - Unit Price: 5.00
   - (other fields optional)
   - Click "Save" or "Add Stock"

3. **Check Browser Console**
   - Press `F12` to open Developer Tools
   - Click "Console" tab
   - Look for these messages:
     ```
     === PHARMACY STOCK: Saving item ===
     Data: {medication_name: "Test Med", ...}
     Added item: {id: X, medication_name: "Test Med", ...}
     === PHARMACY STOCK: Loading data ===
     Stock items: X
     ```

4. **Verify Item Appears**
   - The item should appear in the table
   - If it doesn't, check the console for errors

---

## Common Issues and Solutions

### Issue 1: "relation pharmacy_stock does not exist"
**Solution**: The table doesn't exist
- Run `FIX_PHARMACY_STOCK_TABLE.sql` completely
- This will create the table

### Issue 2: "column image_url does not exist"
**Solution**: The column is missing
- Run `FIX_PHARMACY_STOCK_TABLE.sql`
- It will add the missing column

### Issue 3: "new row violates row-level security policy"
**Solution**: RLS is blocking inserts
- Run `FIX_PHARMACY_STOCK_TABLE.sql`
- It will create the proper policy

### Issue 4: Items add but don't show
**Solution**: Check filters
- In the app, make sure:
  - Search box is empty
  - Category filter is set to "All"
  - Status filter is set to "All"
- Check browser console for the count of items loaded

### Issue 5: "permission denied for table pharmacy_stock"
**Solution**: User permissions issue
- Run this in SQL Editor:
  ```sql
  GRANT ALL ON pharmacy_stock TO public;
  GRANT USAGE, SELECT ON SEQUENCE pharmacy_stock_id_seq TO public;
  ```

---

## Verification Checklist

After running the fix, verify:

- [ ] Table exists: Run `SELECT * FROM pharmacy_stock;`
- [ ] Can insert: Run Test 6 from TEST_PHARMACY_STOCK.sql
- [ ] RLS policy exists: Run Test 5 from TEST_PHARMACY_STOCK.sql
- [ ] App shows console logs when adding
- [ ] Items appear in the table after adding
- [ ] Images can be uploaded (optional)

---

## Still Not Working?

If items still don't appear after all these steps:

1. **Check the exact error**
   - Open browser console (F12)
   - Try adding an item
   - Copy the exact error message
   - Share it for further help

2. **Check database connection**
   - Verify Supabase URL in `src/config/supabase.js`
   - Make sure you're connected to the right project

3. **Check browser network**
   - Open Network tab in DevTools
   - Try adding an item
   - Look for failed requests (red)
   - Check the response

4. **Manual database check**
   - Go to Supabase > Table Editor
   - Click on "pharmacy_stock"
   - See if items are actually there but not displaying

---

## Success Indicators

You'll know it's working when:
1. ✅ No errors in browser console
2. ✅ See "Added item:" log with data
3. ✅ See "Stock items: X" with count increasing
4. ✅ Item appears in the table immediately
5. ✅ Can edit and delete items

---

## Need More Help?

Share:
1. Console error messages
2. Result of Test 1 (table_exists query)
3. Result of Test 2 (column list)
4. Any error from trying to insert a test item

