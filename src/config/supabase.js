import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// You can use environment variables or hardcode (fallback values provided)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://wbcnyzzvynqgoaexehor.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiY255enp2eW5xZ29hZXhlaG9yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY3MTExMjUsImV4cCI6MjA4MjI4NzEyNX0.Z9dGKDUHVXj2AzwN5veh3d7qMYsQnpi_S6v8cBdxp9U';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Service role client (use with caution - only for server-side/admin operations)
// DO NOT expose this in client-side code
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiY255enp2eW5xZ29hZXhlaG9yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjcxMTEyNSwiZXhwIjoyMDgyMjg3MTI1fQ.cDkU3xdSRJAbgSp-rw7w7Q2aY7EqEbDmg0zKeK1RM3g';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export default supabase;

