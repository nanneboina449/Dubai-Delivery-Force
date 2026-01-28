-- UrbanFleet Supabase Database Schema
-- Run this in your Supabase SQL Editor to create the required tables

-- Users table (optional, for future admin functionality)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Rider Applications table
CREATE TABLE IF NOT EXISTS rider_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    nationality TEXT NOT NULL,
    current_location TEXT NOT NULL,
    visa_status TEXT NOT NULL,
    has_uae_driving_license TEXT NOT NULL,
    license_type TEXT,
    years_of_experience INTEGER NOT NULL,
    vehicle_type TEXT NOT NULL,
    owns_vehicle TEXT NOT NULL,
    available_to_start TEXT NOT NULL,
    preferred_work_area TEXT NOT NULL,
    english_proficiency TEXT NOT NULL,
    additional_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Contractor Applications table
CREATE TABLE IF NOT EXISTS contractor_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    trade_license TEXT NOT NULL,
    emirate TEXT NOT NULL,
    fleet_motorcycles INTEGER DEFAULT 0,
    fleet_cars INTEGER DEFAULT 0,
    fleet_vans INTEGER DEFAULT 0,
    fleet_trucks INTEGER DEFAULT 0,
    fleet_bicycles INTEGER DEFAULT 0,
    total_drivers INTEGER NOT NULL,
    years_in_business INTEGER NOT NULL,
    current_clients TEXT,
    insurance_coverage TEXT NOT NULL,
    additional_services TEXT,
    additional_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Business Inquiries table
CREATE TABLE IF NOT EXISTS business_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name TEXT NOT NULL,
    contact_person TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    industry TEXT NOT NULL,
    company_size TEXT NOT NULL,
    emirate TEXT NOT NULL,
    delivery_volume TEXT NOT NULL,
    vehicle_types_needed TEXT NOT NULL,
    riders_needed INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    contract_duration TEXT NOT NULL,
    special_requirements TEXT,
    additional_notes TEXT,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE rider_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policies to allow inserts from anonymous users (for form submissions)
CREATE POLICY "Allow anonymous inserts" ON rider_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON contractor_applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous inserts" ON business_inquiries FOR INSERT WITH CHECK (true);

-- Create policies to allow authenticated reads (for admin)
CREATE POLICY "Allow authenticated reads" ON rider_applications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated reads" ON contractor_applications FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated reads" ON business_inquiries FOR SELECT USING (auth.role() = 'authenticated');
