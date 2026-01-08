-- Add CREF column to profiles table for trainers
ALTER TABLE public.profiles ADD COLUMN cref TEXT;

-- Create index for CREF lookup
CREATE INDEX idx_profiles_cref ON public.profiles(cref) WHERE cref IS NOT NULL;