-- Fix recursive RLS policy vulnerability and add missing DELETE policy

-- Step 1: Create security definer function to safely check user roles
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Step 2: Drop the problematic recursive policy
DROP POLICY IF EXISTS "Therapists can view therapy client profiles" ON public.profiles;

-- Step 3: Create new non-recursive policy using security definer function
CREATE POLICY "Therapists can view therapy client profiles"
ON public.profiles
FOR SELECT
USING (
  (public.get_current_user_role() = 'therapist' AND role = 'therapy_client')
  OR auth.uid() = user_id
);

-- Step 4: Add missing DELETE policy for profiles
CREATE POLICY "Users can delete their own profile"
ON public.profiles
FOR DELETE
USING (auth.uid() = user_id);