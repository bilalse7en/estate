-- ============================================================================
-- UPDATE INQUIRIES SYSTEM
-- ============================================================================
-- Run this in your Supabase SQL Editor to enable professional responses
-- and attachment tracking for client inquiries.
-- ============================================================================

-- 1. Add missing professional tracking columns
ALTER TABLE public.client_forms 
ADD COLUMN IF NOT EXISTS admin_response TEXT,
ADD COLUMN IF NOT EXISTS responded_at TIMESTAMP WITH TIME ZONE;

-- 2. Expand the status system to include 'reviewed'
-- First, we need to drop the existing constraint if it exists
DO $$ 
BEGIN
    ALTER TABLE public.client_forms DROP CONSTRAINT IF EXISTS client_forms_status_check;
EXCEPTION
    WHEN undefined_object THEN null;
END $$;

-- 3. Re-apply a more comprehensive status constraint
ALTER TABLE public.client_forms 
ADD CONSTRAINT client_forms_status_check 
CHECK (status IN ('new', 'contacted', 'qualified', 'closed', 'reviewed'));

-- 4. Ensure RLS allows updates for admins (should already be there, but double checking)
-- DROP POLICY IF EXISTS "Admins can update all forms" ON public.client_forms;
-- CREATE POLICY "Admins can update all forms"
--   ON public.client_forms FOR UPDATE
--   TO authenticated
--   USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Verification
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'client_forms' 
AND column_name IN ('admin_response', 'responded_at', 'status');
