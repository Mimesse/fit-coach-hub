-- Add unique constraint on CREF
ALTER TABLE public.profiles ADD CONSTRAINT profiles_cref_unique UNIQUE (cref);

-- Drop the overly permissive public policy
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;

-- Create policy for users to view their own full profile
CREATE POLICY "Users can view their own full profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for public to view only non-sensitive trainer data
-- This uses a subquery to check if the profile belongs to a trainer
CREATE POLICY "Public can view trainer basic info"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = profiles.user_id 
    AND user_roles.role = 'trainer'
  )
);

-- Note: The second policy allows viewing trainer profiles, but we need to handle 
-- sensitive field exclusion at the application layer since Postgres RLS is row-level, not column-level