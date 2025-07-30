-- 🔧 MANDATORY STORAGE FIX - Must run in Supabase SQL Editor
-- This bypasses RLS policies and creates the missing storage infrastructure

-- =====================================================
-- 1. CREATE DOCUMENTS STORAGE BUCKET (BYPASS RLS)
-- =====================================================

-- This must be run with superuser privileges in SQL Editor
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types, created_at, updated_at) 
VALUES (
  'documents', 
  'documents', 
  true,  -- Public bucket for image viewing
  52428800,  -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'image/webp'],
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'image/webp'],
  updated_at = now();

-- =====================================================
-- 2. CREATE STORAGE POLICIES (ESSENTIAL)
-- =====================================================

-- Enable RLS on storage.objects (if not already enabled)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop conflicting policies
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects; 
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Public can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all documents" ON storage.objects;

-- Create comprehensive storage policies
CREATE POLICY "Allow authenticated uploads to documents" ON storage.objects
  FOR INSERT 
  TO authenticated
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow public reads from documents" ON storage.objects
  FOR SELECT 
  TO public, authenticated
  USING (bucket_id = 'documents');

CREATE POLICY "Allow authenticated updates to documents" ON storage.objects
  FOR UPDATE 
  TO authenticated
  USING (bucket_id = 'documents')
  WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Allow authenticated deletes from documents" ON storage.objects
  FOR DELETE 
  TO authenticated
  USING (bucket_id = 'documents');

-- =====================================================
-- 3. ENABLE STORAGE BUCKET RLS (PERMISSIVE)
-- =====================================================

-- Enable RLS on buckets table
ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

-- Drop existing bucket policies
DROP POLICY IF EXISTS "Allow bucket reads" ON storage.buckets;
DROP POLICY IF EXISTS "Allow bucket management" ON storage.buckets;

-- Allow authenticated users to read buckets
CREATE POLICY "Allow bucket reads" ON storage.buckets
  FOR SELECT 
  TO authenticated, anon
  USING (true);

-- =====================================================
-- 4. VERIFICATION AND TESTING
-- =====================================================

-- Verify bucket creation
SELECT 
  id, 
  name, 
  public, 
  file_size_limit, 
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE id = 'documents';

-- Verify storage policies
SELECT 
  policyname, 
  cmd as operation,
  roles,
  qual as condition
FROM storage.policies 
WHERE bucket_id = 'documents'
ORDER BY policyname;

-- Check bucket permissions
SELECT 
  schemaname,
  tablename, 
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename IN ('buckets', 'objects') 
AND schemaname = 'storage';

-- List any existing files (should show uploaded documents)
SELECT 
  name,
  bucket_id,
  created_at,
  metadata->>'size' as file_size
FROM storage.objects 
WHERE bucket_id = 'documents'
ORDER BY created_at DESC
LIMIT 10;
