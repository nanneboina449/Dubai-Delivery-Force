# UrbanFleet - Vercel + Supabase Deployment Guide

This guide will walk you through deploying the UrbanFleet application to Vercel with Supabase as the database.

---

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in with your GitHub account
3. Click "New Project"

### 1.2 Create Your Project
1. Choose your organization
2. Enter project name: `urbanfleet`
3. Set a strong database password (save this!)
4. Select a region close to UAE (e.g., `Central EU` or `West EU`)
5. Click "Create new project"

### 1.3 Create Database Tables
1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `docs/supabase-schema.sql`
4. Click "Run" to create all tables

### 1.4 Get Your API Keys
1. Go to **Settings** → **API**
2. Copy these values (you'll need them for Vercel):
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

---

## Step 2: Set Up Vercel

### 2.1 Create a Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with your GitHub account

### 2.2 Connect Your Repository
1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/urbanfleet.git
   git push -u origin main
   ```

2. In Vercel, click "Add New" → "Project"
3. Import your GitHub repository

### 2.3 Configure Build Settings
Vercel should auto-detect the settings, but verify:
- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 2.4 Add Environment Variables
In Vercel project settings, go to **Settings** → **Environment Variables** and add:

| Name | Value |
|------|-------|
| `SUPABASE_URL` | Your Supabase Project URL |
| `SUPABASE_ANON_KEY` | Your Supabase anon public key |

### 2.5 Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. Your site will be live at `https://your-project.vercel.app`

---

## Step 3: Configure Custom Domain (Optional)

### 3.1 Add Your Domain
1. In Vercel, go to **Settings** → **Domains**
2. Add your domain: `urbanfleetdelivery.ae`
3. Follow the DNS configuration instructions

### 3.2 DNS Settings
Add these records at your domain registrar:
- **A Record**: `76.76.19.19`
- **CNAME**: `cname.vercel-dns.com` (for www subdomain)

---

## Project Structure for Vercel

```
urbanfleet/
├── api/                          # Vercel Serverless Functions
│   ├── rider-applications.ts     # POST /api/rider-applications
│   ├── contractor-applications.ts # POST /api/contractor-applications
│   └── business-inquiries.ts     # POST /api/business-inquiries
├── client/                       # React Frontend
├── dist/public/                  # Built static files
├── vercel.json                   # Vercel configuration
└── docs/
    └── supabase-schema.sql       # Database schema
```

---

## Environment Variables Summary

| Variable | Where to Get It | Purpose |
|----------|-----------------|---------|
| `SUPABASE_URL` | Supabase Dashboard → Settings → API | Database connection |
| `SUPABASE_ANON_KEY` | Supabase Dashboard → Settings → API | Database authentication |

---

## Troubleshooting

### Forms not saving to database
1. Check Vercel function logs: **Vercel Dashboard** → **Functions** → **Logs**
2. Verify environment variables are set correctly
3. Ensure Supabase RLS policies allow inserts

### Build fails
1. Check that all dependencies are in `package.json`
2. Run `npm run build` locally first to verify

### API returns 500 error
1. Check Supabase table structure matches the schema
2. Verify API keys are correct
3. Check Vercel function logs for detailed errors

---

## Notes

- **EmailJS**: Still works client-side, no changes needed
- **Static Export**: The `html-export/` folder can still be used for static hosting elsewhere
- **Database Access**: Use Supabase Dashboard → Table Editor to view submissions

---

## Quick Reference

**Vercel Dashboard**: https://vercel.com/dashboard  
**Supabase Dashboard**: https://supabase.com/dashboard  
**Your Site**: https://your-project.vercel.app

---

*Deployment guide prepared for UrbanFleet Delivery Services*
