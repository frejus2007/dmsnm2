-- Fix security warnings by setting search_path on functions

CREATE OR REPLACE FUNCTION public.generate_pseudo(p_gender gender_type)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
    
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE pseudo = new_pseudo) THEN
      RETURN new_pseudo;
    END IF;
    
    attempts := attempts + 1;
    IF attempts > 100 THEN
      RETURN prefix || suffix || '_' || extract(epoch from now())::int::text;
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;