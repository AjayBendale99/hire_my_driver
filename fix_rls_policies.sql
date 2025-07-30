-- 🔧 FIX FOR RLS POLICY VIOLATION ERROR (ROBUST VERSION)
-- Copy and paste this SQL into your Supabase SQL Editor
-- Go to: Supabase Dashboard > SQL Editor > New Query

-- =====================================================
-- SAFELY DROP ALL EXISTING POLICIES FIRST
-- =====================================================

-- Drop all possible policy names to avoid conflicts
DROP POLICY IF EXISTS "Enable access for authenticated users" ON driver_profiles;
DROP POLICY IF EXISTS "Drivers can insert their own profile" ON driver_profiles;
DROP POLICY IF EXISTS "Drivers can read their own profile" ON driver_profiles;
DROP POLICY IF EXISTS "Drivers can update their own profile" ON driver_profiles;
DROP POLICY IF EXISTS "Public can read approved drivers" ON driver_profiles;
DROP POLICY IF EXISTS "Customers can read approved drivers" ON driver_profiles;
DROP POLICY IF EXISTS "Admins can read all driver profiles" ON driver_profiles;
DROP POLICY IF EXISTS "Admins can update driver profiles" ON driver_profiles;

-- Wait a moment for cleanup
SELECT pg_sleep(1);

-- =====================================================
-- CREATE NEW FIXED POLICIES FOR DRIVER_PROFILES
-- =====================================================

-- Policy 1: Allow authenticated users to INSERT their own driver profile
CREATE POLICY "Drivers can insert their own profile" ON driver_profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy 2: Allow authenticated users to SELECT their own driver profile
CREATE POLICY "Drivers can read their own profile" ON driver_profiles
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy 3: Allow authenticated users to UPDATE their own driver profile
CREATE POLICY "Drivers can update their own profile" ON driver_profiles
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Allow everyone to read approved driver profiles (for browsing)
CREATE POLICY "Public can read approved drivers" ON driver_profiles
  FOR SELECT 
  TO authenticated, anon
  USING (status = 'approved');

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if policies are created correctly
SELECT 
  policyname, 
  cmd, 
  permissive, 
  roles, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'driver_profiles'
ORDER BY policyname;

-- Check RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'driver_profiles';

-- Test query (this should work after policies are fixed)
-- Uncomment the line below to test:
-- SELECT count(*) FROM driver_profiles;
