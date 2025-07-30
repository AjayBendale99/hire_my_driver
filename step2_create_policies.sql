-- STEP 2: Run this after step 1 completes
-- Copy and paste this into Supabase SQL Editor and run it

-- Create the correct policies for driver profiles
CREATE POLICY "Drivers can insert their own profile" ON driver_profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Drivers can read their own profile" ON driver_profiles
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Drivers can update their own profile" ON driver_profiles
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can read approved drivers" ON driver_profiles
  FOR SELECT 
  TO authenticated, anon
  USING (status = 'approved');
