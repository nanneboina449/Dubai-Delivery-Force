# UrbanFleet - Supabase SQL Scripts

This file tracks all SQL scripts used for the Supabase database.

---

## 1. Initial Table Creation

Run this first to create all required tables:

```sql
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
```

---

## 2. Disable Row Level Security (Required for Form Submissions)

Run this after creating tables to allow form submissions:

```sql
-- Disable RLS on all tables (allows anonymous inserts)
ALTER TABLE rider_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_applications DISABLE ROW LEVEL SECURITY;
ALTER TABLE business_inquiries DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Allow anonymous inserts" ON rider_applications;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON contractor_applications;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON business_inquiries;
DROP POLICY IF EXISTS "Allow all inserts" ON rider_applications;
DROP POLICY IF EXISTS "Allow all inserts" ON contractor_applications;
DROP POLICY IF EXISTS "Allow all inserts" ON business_inquiries;
DROP POLICY IF EXISTS "Allow authenticated reads" ON rider_applications;
DROP POLICY IF EXISTS "Allow authenticated reads" ON contractor_applications;
DROP POLICY IF EXISTS "Allow authenticated reads" ON business_inquiries;
```

---

## 3. Optional: Enable RLS with Proper Policies

If you want to re-enable security later while still allowing form submissions:

```sql
-- Enable RLS
ALTER TABLE rider_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractor_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_inquiries ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert
CREATE POLICY "Allow anon inserts" ON rider_applications 
    FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon inserts" ON contractor_applications 
    FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow anon inserts" ON business_inquiries 
    FOR INSERT TO anon WITH CHECK (true);

-- Allow authenticated users to read all records
CREATE POLICY "Allow auth reads" ON rider_applications 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth reads" ON contractor_applications 
    FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow auth reads" ON business_inquiries 
    FOR SELECT TO authenticated USING (true);
```

---

## 4. Useful Queries

### View all submissions:
```sql
SELECT * FROM rider_applications ORDER BY created_at DESC;
SELECT * FROM contractor_applications ORDER BY created_at DESC;
SELECT * FROM business_inquiries ORDER BY created_at DESC;
```

### Count submissions:
```sql
SELECT 
    (SELECT COUNT(*) FROM rider_applications) as rider_count,
    (SELECT COUNT(*) FROM contractor_applications) as contractor_count,
    (SELECT COUNT(*) FROM business_inquiries) as inquiry_count;
```

### Delete test data (use carefully):
```sql
-- Delete all records (CAUTION: irreversible)
TRUNCATE rider_applications;
TRUNCATE contractor_applications;
TRUNCATE business_inquiries;
```

---

---

## 5. Admin Backend Schema Updates (Jan 28, 2026)

Add status and admin notes fields to all application tables:

```sql
-- Add status and admin fields to rider_applications
ALTER TABLE rider_applications 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' NOT NULL,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL;

-- Add status and admin fields to contractor_applications
ALTER TABLE contractor_applications 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' NOT NULL,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL;

-- Add status and admin fields to business_inquiries
ALTER TABLE business_inquiries 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' NOT NULL,
ADD COLUMN IF NOT EXISTS admin_notes TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW() NOT NULL;

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);
```

---

---

## 6. Admin Users Table (Jan 28, 2026)

Create admin_users table for admin authentication:

```sql
-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Disable RLS for admin_users
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
```

---

## Script History

| Date | Script | Purpose |
|------|--------|---------|
| Jan 28, 2026 | Table Creation | Initial database setup |
| Jan 28, 2026 | Disable RLS | Fix form submission errors |
| Jan 28, 2026 | Admin Schema | Add status, admin_notes, updated_at fields |
| Jan 28, 2026 | Admin Users | Create admin_users table for authentication |

---

*Last updated: January 28, 2026*
