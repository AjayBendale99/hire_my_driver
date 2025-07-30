-- 🔧 STORAGE POLICIES FIX - Run this in Supabase SQL Editor
-- This fixes storage upload issues for document uploads

-- =====================================================
-- 1. CREATE STORAGE BUCKET IF NOT EXISTS
-- =====================================================

-- Create documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 2. DROP EXISTING STORAGE POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can upload to their own folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can read their own documents" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;

-- =====================================================
-- 3. CREATE PERMISSIVE STORAGE POLICIES
-- =====================================================

-- Allow authenticated users to upload documents
CREATE POLICY "Allow authenticated uploads" ON storage.objects
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
  );

-- Allow authenticated users to read documents
CREATE POLICY "Allow authenticated reads" ON storage.objects
  FOR SELECT 
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
  );

-- Allow users to update their own documents
CREATE POLICY "Allow authenticated updates" ON storage.objects
  FOR UPDATE 
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
  );

-- Allow users to delete their own documents
CREATE POLICY "Allow authenticated deletes" ON storage.objects
  FOR DELETE 
  TO authenticated
  USING (
    bucket_id = 'documents' AND
    auth.role() = 'authenticated'
  );

-- =====================================================
-- 4. VERIFICATION
-- =====================================================

-- Check bucket exists
SELECT * FROM storage.buckets WHERE name = 'documents';

-- Check storage policies
SELECT policyname, cmd, roles FROM storage.policies WHERE bucket_id = 'documents';
