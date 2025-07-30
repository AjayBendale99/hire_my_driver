-- 🔧 TEMPORARY FIX: Disable RLS for Testing
-- Run this first to test if signup works without RLS

-- Disable RLS temporarily to test signup
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles DISABLE ROW LEVEL SECURITY;

-- Test your signup now, then come back and run the secure version

-- =====================================================
-- After testing, re-enable with proper policies:
-- =====================================================

/*
-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;

-- Then run the policies from rls_policies.sql
*/
