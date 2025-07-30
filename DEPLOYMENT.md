# 🚀 Production Deployment Guide

## Step 1: Create Supabase Project

1. **Go to Supabase**: https://supabase.com
2. **Sign up/Login** with your GitHub account
3. **Create New Project**:
   - Project Name: `hire-drive-prod`
   - Database Password: (choose a strong password)
   - Region: Choose closest to India (Singapore/Mumbai if available)
4. **Wait 2-3 minutes** for project setup to complete

## Step 2: Configure Supabase Database

### Get Your Credentials
1. Go to **Settings → API**
2. Copy the following:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key

### Set Up Database Schema
1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Copy and paste the entire contents from `database/schema.sql`
4. Click **Run** to execute the schema

### Configure Storage
1. Go to **Storage** in Supabase dashboard
2. Create a new bucket named `documents`
3. Make it private (not public)
4. The policies are already set up in the schema

### Enable Authentication
1. Go to **Authentication → Settings**
2. Enable **Email** provider
3. Set **Site URL** to: `http://localhost:3000` (we'll update this after Vercel deployment)
4. Add **Redirect URLs**: `http://localhost:3000/auth/callback`

## Step 3: Update Environment Variables

Update your `.env.local` file with real Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 4: Test Locally

```bash
npm run dev
```

Test the following:
- ✅ User registration
- ✅ Login/logout
- ✅ Driver registration with file uploads
- ✅ Browse drivers page

## Step 5: Deploy to Vercel

### Prepare for Deployment
1. **Commit your changes**:
```bash
git add .
git commit -m "Ready for production deployment"
```

2. **Push to GitHub**:
```bash
git push origin main
```

### Deploy to Vercel
1. **Go to Vercel**: https://vercel.com
2. **Sign up/Login** with GitHub
3. **Import Project**:
   - Select your GitHub repository
   - Framework Preset: Next.js
   - Root Directory: `./`
4. **Configure Environment Variables**:
   - Add all variables from your `.env.local`
   - Update `NEXT_PUBLIC_APP_URL` to your Vercel domain
5. **Deploy**

### Update Supabase Settings
After Vercel deployment:
1. Copy your Vercel deployment URL (e.g., `https://hire-drive.vercel.app`)
2. In Supabase → Authentication → Settings:
   - Update **Site URL** to your Vercel URL
   - Add **Redirect URLs**: `https://your-vercel-url.vercel.app/auth/callback`

## Step 6: Create Admin Account

After deployment, create an admin account:

1. **Sign up normally** on your deployed site with email: `admin@yourdomain.com`
2. **Go to Supabase → Authentication → Users**
3. **Find your user** and copy the User ID
4. **Go to SQL Editor** and run:
```sql
UPDATE public.users 
SET role = 'admin' 
WHERE id = 'your-user-id-here';
```

## Step 7: Test Production

Test all features on your live site:
- ✅ User registration/login
- ✅ Driver registration with document upload
- ✅ Admin can approve drivers
- ✅ Browse and search drivers
- ✅ Mobile responsiveness

## Step 8: Custom Domain (Optional)

1. **Buy a domain** (e.g., `hiredrive.in`)
2. **In Vercel**:
   - Go to your project settings
   - Add custom domain
   - Follow DNS configuration instructions
3. **Update Supabase settings** with your custom domain

## 🎯 Production Checklist

### Security
- ✅ Environment variables are secure
- ✅ Supabase RLS policies are enabled
- ✅ File upload restrictions in place
- ✅ Input validation on all forms

### Performance
- ✅ Images optimized
- ✅ Build successful without errors
- ✅ Pages load under 3 seconds
- ✅ Mobile performance optimized

### Functionality
- ✅ User registration works
- ✅ Email verification (if enabled)
- ✅ File uploads to Supabase Storage
- ✅ Database operations work
- ✅ Search and filtering functional

### Monitoring
- ✅ Set up Vercel analytics
- ✅ Monitor Supabase usage
- ✅ Set up error tracking (optional)

## 🚀 Go Live!

Your Hire Drive platform is now live and ready for Indian users!

### Share Your Platform
- ✅ Social media announcement
- ✅ Local driver communities
- ✅ Customer acquisition campaigns
- ✅ SEO optimization

### Next Steps
1. Monitor user registrations
2. Approve driver applications
3. Gather user feedback
4. Iterate and improve features
5. Scale based on demand

---

**🎉 Congratulations! Your Hire Drive platform is now live in production!**
