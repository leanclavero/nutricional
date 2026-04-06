-- 1. Create Profile Table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    role TEXT CHECK (role IN ('patient', 'nutritionist')),
    nutritionist_id UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create Meals Table
CREATE TABLE public.meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    photo_urls TEXT[] NOT NULL DEFAULT '{}',
    comments TEXT,
    meal_type TEXT CHECK (meal_type IN ('Desayuno', 'Almuerzo', 'Merienda', 'Cena', 'Snack')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Create Interactions Table
CREATE TABLE public.interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    meal_id UUID NOT NULL REFERENCES public.meals(id) ON DELETE CASCADE,
    nutritionist_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN ('like', 'comment')),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Profiles
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for Meals
CREATE POLICY "Patients can view their own meals" 
ON public.meals FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Nutritionists can view their assigned patients' meals" 
ON public.meals FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = public.meals.patient_id AND nutritionist_id = auth.uid()
    )
);

CREATE POLICY "Patients can insert their own meals" 
ON public.meals FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update their own meals within 24 hours" 
ON public.meals FOR UPDATE USING (
    auth.uid() = patient_id AND created_at > now() - INTERVAL '24 hours'
);

CREATE POLICY "Patients can delete their own meals within 24 hours" 
ON public.meals FOR DELETE USING (
    auth.uid() = patient_id AND created_at > now() - INTERVAL '24 hours'
);

-- RLS Policies for Interactions
CREATE POLICY "Users can view interactions for meals they can see" 
ON public.interactions FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.meals 
        WHERE id = public.interactions.meal_id
    )
);

CREATE POLICY "Nutritionists can insert interactions for assigned patients" 
ON public.interactions FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.meals m
        JOIN public.profiles p ON m.patient_id = p.id
        WHERE m.id = public.interactions.meal_id AND p.nutritionist_id = auth.uid()
    )
);

-- Storage Setup (Instructional: Bucket 'meal-photos' must be created in dashboard)
-- Storage RLS Placeholder (assuming bucket name 'meal-photos')
-- INSERT INTO storage.buckets (id, name) VALUES ('meal-photos', 'meal-photos');
