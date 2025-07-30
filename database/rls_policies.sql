-- 🔐 Row Level Security (RLS) Policies for Hire Drive
-- Execute these SQL commands in your Supabase SQL Editor

-- =====================================================
-- 1. USERS TABLE POLICIES (Simplified to avoid recursion)
-- =====================================================

-- Enable RLS on users table (if not already enabled)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe cleanup)
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "Users can read their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Admins can read all users" ON users;
DROP POLICY IF EXISTS "Admins can update all users" ON users;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON users;
DROP POLICY IF EXISTS "Allow signup user creation" ON users;

-- Policy: Allow user creation during signup (more permissive for INSERT)
CREATE POLICY "Allow signup user creation" ON users
  FOR INSERT 
  WITH CHECK (true);  -- Allow all inserts during signup

-- Policy: Allow users to read their own profile after login
CREATE POLICY "Users can read their own profile" ON users
  FOR SELECT 
  USING (auth.uid() = id);

-- Policy: Allow users to update their own profile after login
CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- 2. DRIVER_PROFILES TABLE POLICIES (Fixed for INSERT)
-- =====================================================

-- Enable RLS on driver_profiles table (if not already enabled)
ALTER TABLE driver_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (safe cleanup)
DROP POLICY IF EXISTS "Drivers can insert their own profile" ON driver_profiles;
DROP POLICY IF EXISTS "Drivers can read their own profile" ON driver_profiles;
DROP POLICY IF EXISTS "Drivers can update their own profile" ON driver_profiles;
DROP POLICY IF EXISTS "Customers can read approved drivers" ON driver_profiles;
DROP POLICY IF EXISTS "Admins can read all driver profiles" ON driver_profiles;
DROP POLICY IF EXISTS "Admins can update driver profiles" ON driver_profiles;
DROP POLICY IF EXISTS "Enable access for authenticated users" ON driver_profiles;
DROP POLICY IF EXISTS "Public can read approved drivers" ON driver_profiles;

-- Policy: Allow authenticated users to INSERT their own driver profile
CREATE POLICY "Drivers can insert their own profile" ON driver_profiles
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow authenticated users to SELECT their own driver profile
CREATE POLICY "Drivers can read their own profile" ON driver_profiles
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Allow authenticated users to UPDATE their own driver profile
CREATE POLICY "Drivers can update their own profile" ON driver_profiles
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Allow everyone to read approved driver profiles (for browsing)
CREATE POLICY "Public can read approved drivers" ON driver_profiles
  FOR SELECT 
  USING (status = 'approved');

-- =====================================================
-- 3. STORAGE POLICIES (for document uploads)
-- =====================================================

-- Drop existing storage policies if they exist (safe cleanup)
DROP POLICY IF EXISTS "Users can upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all documents" ON storage.objects;

-- Policy: Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload to their own folder" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Allow users to read their own documents
CREATE POLICY "Users can read their own documents" ON storage.objects
  FOR SELECT 
  USING (
    bucket_id = 'documents' AND 
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Allow admins to read all documents
CREATE POLICY "Admins can read all documents" ON storage.objects
  FOR SELECT 
  USING (
    bucket_id = 'documents' AND 
    EXISTS (
      SELECT 1 FROM users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- =====================================================
-- 4. ADMIN POLICIES (Run this AFTER creating an admin user)
-- =====================================================

/*
-- Step 1: First, create an admin user by signing up normally, then run:
UPDATE users SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- Step 2: Then run these admin policies:

-- Allow admins to read all users
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Allow admins to update all users  
CREATE POLICY "Admins can update all users" ON users
  FOR UPDATE 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Allow admins to read all driver profiles
CREATE POLICY "Admins can read all driver profiles" ON driver_profiles
  FOR SELECT 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Allow admins to update driver profiles (for approval)
CREATE POLICY "Admins can update driver profiles" ON driver_profiles
  FOR UPDATE 
  USING (
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );
*/

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if policies are created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('users', 'driver_profiles')
ORDER BY tablename, policyname;

-- Check RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('users', 'driver_profiles');
