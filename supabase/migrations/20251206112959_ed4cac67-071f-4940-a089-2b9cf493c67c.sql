-- Create enum for gender
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other');

-- Create profiles table with anonymous pseudo
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  pseudo TEXT NOT NULL UNIQUE,
  gender gender_type NOT NULL DEFAULT 'other',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Create episodes table
CREATE TABLE public.episodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  spotify_url TEXT NOT NULL,
  spotify_id TEXT,
  category TEXT NOT NULL DEFAULT 'Général',
  duration TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on episodes
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;

-- Episodes policies (public read for published)
CREATE POLICY "Anyone can view published episodes" ON public.episodes
  FOR SELECT USING (published = true);

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  episode_id UUID NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'flagged')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Comments policies
CREATE POLICY "Anyone can view approved comments" ON public.comments
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Authenticated users can create comments" ON public.comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments" ON public.comments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON public.comments
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  episode_id UUID NOT NULL REFERENCES public.episodes(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, episode_id)
);

-- Enable RLS on favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON public.favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites" ON public.favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites" ON public.favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Create participation_requests table
CREATE TABLE public.participation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  subject TEXT NOT NULL,
  reason TEXT NOT NULL,
  anonymous BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on participation_requests
ALTER TABLE public.participation_requests ENABLE ROW LEVEL SECURITY;

-- Participation requests - anyone can submit
CREATE POLICY "Anyone can submit participation request" ON public.participation_requests
  FOR INSERT WITH CHECK (true);

-- Create user_roles table for admin
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'user',
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check user role (security definer to avoid recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- User roles policies
CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Function to generate random pseudo
CREATE OR REPLACE FUNCTION public.generate_pseudo(p_gender gender_type)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  prefixes TEXT[];
  suffixes TEXT[];
  prefix TEXT;
  suffix TEXT;
  random_num TEXT;
  new_pseudo TEXT;
  attempts INT := 0;
BEGIN
  -- Different prefix pools based on feeling/personality
  prefixes := ARRAY[
    'Whispering', 'Silent', 'Gentle', 'Peaceful', 'Dreaming',
    'Wandering', 'Floating', 'Glowing', 'Shining', 'Rising',
    'Healing', 'Growing', 'Flowing', 'Drifting', 'Blooming',
    'Bright', 'Warm', 'Calm', 'Soft', 'Kind'
  ];
  
  suffixes := ARRAY[
    'Soul', 'River', 'Storm', 'Star', 'Moon',
    'Cloud', 'Wave', 'Light', 'Shadow', 'Echo',
    'Dream', 'Heart', 'Wind', 'Rain', 'Leaf',
    'Bloom', 'Sky', 'Ocean', 'Forest', 'Mountain'
  ];
  
  LOOP
    prefix := prefixes[1 + floor(random() * array_length(prefixes, 1))::int];
    suffix := suffixes[1 + floor(random() * array_length(suffixes, 1))::int];
    random_num := '_' || floor(random() * 100)::int::text;
    new_pseudo := prefix || suffix || random_num;
    
    -- Check if pseudo already exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE pseudo = new_pseudo) THEN
      RETURN new_pseudo;
    END IF;
    
    attempts := attempts + 1;
    IF attempts > 100 THEN
      -- Fallback with timestamp
      RETURN prefix || suffix || '_' || extract(epoch from now())::int::text;
    END IF;
  END LOOP;
END;
$$;

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_gender gender_type;
  user_pseudo TEXT;
BEGIN
  -- Get gender from metadata or default to 'other'
  user_gender := COALESCE(
    (NEW.raw_user_meta_data->>'gender')::gender_type,
    'other'
  );
  
  -- Generate unique pseudo
  user_pseudo := public.generate_pseudo(user_gender);
  
  -- Insert profile
  INSERT INTO public.profiles (id, pseudo, gender)
  VALUES (NEW.id, user_pseudo, user_gender);
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_episodes_updated_at
  BEFORE UPDATE ON public.episodes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at
  BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();