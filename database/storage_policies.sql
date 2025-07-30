-- Storage RLS Policies for documents bucket
-- Safe to run multiple times - handles existing policies

-- Drop existing policies if they exist (optional, comment out if you want to keep them)
-- DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
-- DROP POLICY IF EXISTS "Authenticated users can view documents" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can update their own documents" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can delete their own documents" ON storage.objects;

-- Allow authenticated users to upload files
DO $$
BEGIN
  CREATE POLICY "Authenticated users can upload documents" 
  ON storage.objects 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (bucket_id = 'documents');
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Policy "Authenticated users can upload documents" already exists, skipping.';
END
$$;

-- Allow authenticated users to view documents
DO $$
BEGIN
  CREATE POLICY "Authenticated users can view documents" 
  ON storage.objects 
  FOR SELECT 
  TO authenticated 
  USING (bucket_id = 'documents');
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Policy "Authenticated users can view documents" already exists, skipping.';
END
$$;

-- Allow users to update their own documents
DO $$
BEGIN
  CREATE POLICY "Users can update their own documents" 
  ON storage.objects 
  FOR UPDATE 
  TO authenticated 
  USING (bucket_id = 'documents');
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Policy "Users can update their own documents" already exists, skipping.';
END
$$;

-- Allow users to delete their own documents
DO $$
BEGIN
  CREATE POLICY "Users can delete their own documents" 
  ON storage.objects 
  FOR DELETE 
  TO authenticated 
  USING (bucket_id = 'documents');
EXCEPTION
  WHEN duplicate_object THEN
    RAISE NOTICE 'Policy "Users can delete their own documents" already exists, skipping.';
END
$$;

-- Make sure the bucket is public for viewing
UPDATE storage.buckets SET public = true WHERE id = 'documents';
