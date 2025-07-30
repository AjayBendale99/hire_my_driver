-- Hire Drive Database Schema for Supabase
-- Run these commands in your Supabase SQL editor

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'driver', 'admin');
CREATE TYPE approval_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Driver profiles table
CREATE TABLE public.driver_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    experience_years INTEGER NOT NULL CHECK (experience_years >= 0),
    vehicle_types TEXT[] NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    license_document_url TEXT NOT NULL,
    aadhar_document_url TEXT NOT NULL,
    profile_image_url TEXT,
    status approval_status NOT NULL DEFAULT 'pending',
    bio TEXT,
    location VARCHAR(255) NOT NULL,
    rating DECIMAL(2,1) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    total_ratings INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Bookings table
CREATE TABLE public.bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    notes TEXT,
    total_amount DECIMAL(10,2),
    customer_rating INTEGER CHECK (customer_rating >= 1 AND customer_rating <= 5),
    customer_review TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Reviews table (for detailed reviews)
CREATE TABLE public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE NOT NULL,
    customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    driver_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(booking_id)
);

-- Create indexes for better performance
CREATE INDEX idx_driver_profiles_status ON public.driver_profiles(status);
CREATE INDEX idx_driver_profiles_vehicle_types ON public.driver_profiles USING GIN(vehicle_types);
CREATE INDEX idx_driver_profiles_location ON public.driver_profiles(location);
CREATE INDEX idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX idx_bookings_driver_id ON public.bookings(driver_id);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_start_date ON public.bookings(start_date);

-- Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for driver_profiles table
CREATE POLICY "Anyone can view approved driver profiles" ON public.driver_profiles
    FOR SELECT USING (status = 'approved');

CREATE POLICY "Drivers can view their own profile" ON public.driver_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Drivers can insert their own profile" ON public.driver_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Drivers can update their own profile" ON public.driver_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for bookings table
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = customer_id OR auth.uid() = driver_id);

CREATE POLICY "Customers can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers and drivers can update their bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = customer_id OR auth.uid() = driver_id);

-- RLS Policies for reviews table
CREATE POLICY "Anyone can view reviews" ON public.reviews
    FOR SELECT USING (true);

CREATE POLICY "Customers can create reviews" ON public.reviews
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Customers can update their reviews" ON public.reviews
    FOR UPDATE USING (auth.uid() = customer_id);

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false);

-- Storage policies for documents bucket
CREATE POLICY "Users can upload their own documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Admins can view all documents" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'documents' AND 
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updating timestamps
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_driver_profiles_updated_at BEFORE UPDATE ON public.driver_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update driver ratings
CREATE OR REPLACE FUNCTION update_driver_rating()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.customer_rating IS NOT NULL AND NEW.customer_rating != OLD.customer_rating THEN
        UPDATE public.driver_profiles 
        SET 
            rating = (
                SELECT COALESCE(AVG(customer_rating), 0) 
                FROM public.bookings 
                WHERE driver_id = NEW.driver_id AND customer_rating IS NOT NULL
            ),
            total_ratings = (
                SELECT COUNT(*) 
                FROM public.bookings 
                WHERE driver_id = NEW.driver_id AND customer_rating IS NOT NULL
            )
        WHERE user_id = NEW.driver_id;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating driver ratings
CREATE TRIGGER update_driver_rating_trigger AFTER UPDATE ON public.bookings
    FOR EACH ROW EXECUTE FUNCTION update_driver_rating();

-- Create admin user function (run this after setting up auth)
-- INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
-- VALUES (gen_random_uuid(), 'admin@hiredrive.in', crypt('your-admin-password', gen_salt('bf')), NOW(), NOW(), NOW());

-- INSERT INTO public.users (id, email, full_name, phone, role)
-- SELECT id, 'admin@hiredrive.in', 'Admin User', '+919999999999', 'admin' 
-- FROM auth.users WHERE email = 'admin@hiredrive.in';
