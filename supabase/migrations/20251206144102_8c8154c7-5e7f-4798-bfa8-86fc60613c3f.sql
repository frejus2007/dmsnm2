-- Drop and recreate the view as SECURITY INVOKER (the default)
DROP VIEW IF EXISTS public.profile_pseudos;

-- Recreate view with SECURITY INVOKER (explicit for clarity)
CREATE VIEW public.profile_pseudos 
WITH (security_invoker = true) AS
SELECT id, pseudo FROM public.profiles;

-- Grant select on the view to all users
GRANT SELECT ON public.profile_pseudos TO authenticated;
GRANT SELECT ON public.profile_pseudos TO anon;

-- Add RLS policy on profiles to allow reading pseudos for comment display
-- This uses a permissive policy so authenticated users can read any pseudo
CREATE POLICY "Authenticated users can view pseudos"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);