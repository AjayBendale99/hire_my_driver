-- 🔧 FIX STORAGE ACCESS FOR IMAGE VIEWING
-- Run this in your Supabase SQL Editor to fix 404 image errors

-- =====================================================
-- 1. MAKE DOCUMENTS BUCKET PUBLIC
-- =====================================================

-- Update the documents bucket to be public for image viewing
UPDATE storage.buckets 
SET public = true 
WHERE id = 'documents';

-- =====================================================
-- 2. ADD PUBLIC READ POLICY FOR EVERYONE
-- =====================================================

-- Allow anyone to read documents (for image viewing)
DROP POLICY IF EXISTS "Public can view documents" ON storage.objects;

CREATE POLICY "Public can view documents" ON storage.objects
  FOR SELECT 
  TO public
  USING (bucket_id = 'documents');

-- =====================================================
-- 3. VERIFICATION
-- =====================================================

-- Check if bucket is now public
SELECT id, name, public FROM storage.buckets WHERE id = 'documents';

-- Check storage policies
SELECT policyname, cmd, roles 
FROM storage.policies 
WHERE bucket_id = 'documents' 
ORDER BY policyname;
