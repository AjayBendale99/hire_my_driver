-- 🔧 SIMPLIFIED STORAGE FIX - For when bucket exists but isn't discoverable
-- Run this in Supabase SQL Editor (safer version)

-- =====================================================
-- 1. ENABLE STORAGE BUCKET DISCOVERY
-- =====================================================

-- Enable RLS on buckets table (if not already enabled)
ALTER TABLE IF EXISTS storage.buckets ENABLE ROW LEVEL SECURITY;

-- Drop existing bucket read policies to avoid conflicts
DROP POLICY IF EXISTS "Allow bucket reads" ON storage.buckets;
DROP POLICY IF EXISTS "Enable read access for all users" ON storage.buckets;
DROP POLICY IF EXISTS "Public bucket access" ON storage.buckets;

-- Create policy to allow bucket discovery
CREATE POLICY "Enable read access for all users" ON storage.buckets
  FOR SELECT 
  TO public, authenticated, anon
  USING (true);

-- =====================================================
-- 2. VERIFY STORAGE OBJECT POLICIES
-- =====================================================

-- Drop any conflicting storage object policies
DROP POLICY IF EXISTS "Public can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public reads from documents" ON storage.objects;

-- Create simple public read policy for documents bucket
CREATE POLICY "Public can view documents" ON storage.objects
  FOR SELECT 
  TO public, authenticated, anon
  USING (bucket_id = 'documents');

-- =====================================================
-- 3. VERIFICATION QUERIES
-- =====================================================

-- Check if we can now see the buckets
SELECT id, name, public FROM storage.buckets;

-- Check storage policies
SELECT policyname, cmd, roles 
FROM storage.policies 
WHERE bucket_id = 'documents'
ORDER BY policyname;

-- Test object access
SELECT name, bucket_id, created_at
FROM storage.objects 
WHERE bucket_id = 'documents'
LIMIT 5;
