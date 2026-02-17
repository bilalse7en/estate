-- ============================================================================
-- PROFESSIONAL MEDIA TRACKING & AUTO-CLEANUP SYSTEM
-- ============================================================================
-- This creates a relationship between inquiries and their attachments,
-- and sets up automatic cleanup of old data while protecting website assets.
-- ============================================================================

-- 1. Add tracking columns to media table
ALTER TABLE public.media 
ADD COLUMN IF NOT EXISTS inquiry_id UUID REFERENCES public.client_forms(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS is_website_asset BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_inquiry_id ON public.media(inquiry_id);
CREATE INDEX IF NOT EXISTS idx_media_is_website_asset ON public.media(is_website_asset);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON public.media(created_at);

-- 3. Create a function to clean up old inquiries and their media
CREATE OR REPLACE FUNCTION cleanup_old_inquiries()
RETURNS TABLE(deleted_inquiries INT, deleted_media INT) AS $$
DECLARE
  inquiry_count INT;
  media_count INT;
BEGIN
  -- Delete media attached to old inquiries (older than 1 year)
  WITH deleted_media AS (
    DELETE FROM public.media 
    WHERE inquiry_id IN (
      SELECT id FROM public.client_forms 
      WHERE created_at < NOW() - INTERVAL '1 year'
    )
    AND is_website_asset = false
    RETURNING id
  )
  SELECT COUNT(*) INTO media_count FROM deleted_media;

  -- Delete old inquiries (cascade will handle remaining references)
  WITH deleted_inquiries AS (
    DELETE FROM public.client_forms 
    WHERE created_at < NOW() - INTERVAL '1 year'
    RETURNING id
  )
  SELECT COUNT(*) INTO inquiry_count FROM deleted_inquiries;

  -- Delete orphaned media (not attached to inquiries, not website assets, older than 1 year)
  WITH deleted_orphans AS (
    DELETE FROM public.media 
    WHERE inquiry_id IS NULL 
    AND is_website_asset = false 
    AND created_at < NOW() - INTERVAL '1 year'
    RETURNING id
  )
  SELECT COALESCE(media_count, 0) + COUNT(*) INTO media_count FROM deleted_orphans;

  RETURN QUERY SELECT inquiry_count, media_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Mark existing blog/page images as website assets (protection)
-- This only runs if the posts table exists
DO $$ 
BEGIN
  -- Check if posts table exists before trying to protect assets
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'posts') THEN
    UPDATE public.media 
    SET is_website_asset = true 
    WHERE id IN (
      SELECT DISTINCT m.id 
      FROM public.media m
      CROSS JOIN public.posts p
      WHERE p.content::text LIKE '%' || m.public_url || '%'
         OR p.featured_image = m.public_url
    );
    RAISE NOTICE 'Website assets marked for protection';
  ELSE
    RAISE NOTICE 'Posts table not found - skipping asset protection (you can run this later)';
  END IF;
END $$;

-- 5. Add RLS policies for media
ALTER TABLE public.media ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view media" ON public.media;
CREATE POLICY "Anyone can view media"
  ON public.media FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Admins can manage media" ON public.media;
CREATE POLICY "Admins can manage media"
  ON public.media FOR ALL
  TO authenticated
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Verification queries
SELECT 
  COUNT(*) FILTER (WHERE is_website_asset = true) as protected_assets,
  COUNT(*) FILTER (WHERE is_website_asset = false) as inquiry_media,
  COUNT(*) FILTER (WHERE inquiry_id IS NOT NULL) as linked_to_inquiry
FROM public.media;
