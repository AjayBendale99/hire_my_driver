-- STEP 1: Run this first to clean up existing policies
-- Copy and paste this into Supabase SQL Editor and run it

DROP POLICY IF EXISTS "Enable access for authenticated users" ON driver_profiles;
DROP POLICY IF EXISTS "Drivers can insert their own profile" ON driver_profiles;
DROP POLICY IF EXISTS "Drivers can read their own profile" ON driver_profiles;
DROP POLICY IF EXISTS "Drivers can update their own profile" ON driver_profiles;
DROP POLICY IF EXISTS "Public can read approved drivers" ON driver_profiles;
DROP POLICY IF EXISTS "Customers can read approved drivers" ON driver_profiles;
DROP POLICY IF EXISTS "Admins can read all driver profiles" ON driver_profiles;
DROP POLICY IF EXISTS "Admins can update driver profiles" ON driver_profiles;
