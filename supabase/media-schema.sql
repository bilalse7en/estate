-- ALL-IN-ONE MEDIA SYSTEM SETUP
-- Run this in your Supabase SQL Editor

-- 1. Create media table
CREATE TABLE IF NOT EXISTS public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  uploader_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create indexes
CREATE INDEX IF NOT EXISTS idx_media_created_at ON public.media(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON public.media(uploaded_by);

-- 3. Enable RLS on media table
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

-- 4. Policies for media table
DROP POLICY IF EXISTS "Allow authenticated users to read media" ON public.media;
CREATE POLICY "Allow authenticated users to read media"
  ON public.media FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to upload media" ON public.media;
CREATE POLICY "Allow authenticated users to upload media"
  ON public.media FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow users to delete their own media" ON public.media;
CREATE POLICY "Allow users to delete their own media"
  ON public.media FOR DELETE
  TO authenticated
  USING (uploaded_by = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- 5. Storage bucket setup
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage policies for the 'media' bucket
-- IMPORTANT: These allow authenticated users to perform actions on the 'media' bucket

DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media');

DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'media');

DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Authenticated Delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media' AND (owner = auth.uid() OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'));

-- 7. Ensure profiles table and role column exist (Support check)
-- This is just a reminder, if your profiles table is different, adjust the delete policy above.
