-- 🔧 COMPLETE STORAGE FIX - Run this in Supabase SQL Editor
-- This will create the missing storage bucket and fix all image access issues

-- =====================================================
-- 1. CREATE DOCUMENTS STORAGE BUCKET
-- =====================================================

-- Create the documents bucket (this is what's missing!)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
  'documents', 
  'documents', 
  true,  -- Make it public so images can be viewed
  52428800,  -- 50MB limit
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 52428800,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf', 'image/webp'];

-- =====================================================
-- 2. CREATE STORAGE POLICIES
-- =====================================================

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
DROP POLICY IF EXISTS "Public can view documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;

-- Policy 1: Allow authenticated users to upload documents
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT 
  WITH CHECK (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

-- Policy 2: Allow public read access for viewing images
CREATE POLICY "Public can view documents" ON storage.objects
  FOR SELECT 
  USING (bucket_id = 'documents');

-- Policy 3: Allow authenticated users to update their documents
CREATE POLICY "Allow authenticated updates" ON storage.objects
  FOR UPDATE 
  USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

-- Policy 4: Allow authenticated users to delete their documents
CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE 
  USING (
    bucket_id = 'documents' AND 
    auth.role() = 'authenticated'
  );

-- =====================================================
-- 3. VERIFICATION QUERIES
-- =====================================================

-- Check if bucket was created successfully
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'documents';

-- Check storage policies
SELECT policyname, cmd, roles, qual
FROM storage.policies 
WHERE bucket_id = 'documents'
ORDER BY policyname;

-- List any existing files in the bucket
SELECT name, bucket_id, created_at, metadata
FROM storage.objects 
WHERE bucket_id = 'documents'
LIMIT 10;
