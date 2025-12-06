-- Drop the overly permissive profiles SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;

-- Create owner-only SELECT policy for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

-- Create a secure view for displaying comment author pseudos
-- This view only exposes id and pseudo, protecting gender and other data
CREATE OR REPLACE VIEW public.profile_pseudos AS
SELECT id, pseudo FROM public.profiles;

-- Grant select on the view to authenticated users
GRANT SELECT ON public.profile_pseudos TO authenticated;
GRANT SELECT ON public.profile_pseudos TO anon;