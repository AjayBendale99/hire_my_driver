# Development Setup Guide

## 🚀 Quick Setup for Local Development

### Step 1: Environment Variables
1. Copy `.env.example` to `.env.local`
2. For local development without Supabase, use these placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder_anon_key
SUPABASE_SERVICE_ROLE_KEY=placeholder_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Run Development Server
```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## 🗄️ Setting Up Supabase (Production Ready)

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be set up

### Step 2: Get API Keys
1. Go to Project Settings → API
2. Copy the Project URL and anon public key
3. Copy the service_role key (keep this secret!)

### Step 3: Set Up Database
1. Go to SQL Editor in Supabase
2. Copy the contents of `database/schema.sql`
3. Execute the SQL to create tables and policies

### Step 4: Configure Storage
1. Go to Storage in Supabase
2. Create a bucket named `documents`
3. Set appropriate policies for file uploads

### Step 5: Update Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_actual_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚢 Deployment to Vercel

### Step 1: Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### Step 2: Deploy to Vercel
1. Go to [https://vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Add environment variables in Vercel dashboard
4. Deploy

### Step 3: Update Supabase Settings
1. In Supabase → Authentication → Settings
2. Add your Vercel deployment URL to Site URL
3. Add your domain to Redirect URLs

## 🔧 Features Available

### Without Supabase Setup
- ✅ Browse website and UI components
- ✅ View all pages and design
- ❌ User registration/login
- ❌ Driver profile creation
- ❌ Admin features

### With Full Supabase Setup
- ✅ Complete user authentication
- ✅ Driver registration with document upload
- ✅ Admin approval workflow
- ✅ Customer booking system
- ✅ Rating and review system

## 🎯 User Accounts for Testing

After setting up Supabase, you can create these test accounts:

### Admin Account
```sql
-- Run in Supabase SQL Editor after auth setup
INSERT INTO public.users (id, email, full_name, phone, role)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'admin@hiredrive.test'),
  'admin@hiredrive.test',
  'Admin User',
  '+919999999999',
  'admin'
);
```

### Test Driver Account
1. Sign up as driver on the website
2. Complete driver registration
3. Use admin account to approve the driver

### Test Customer Account
1. Sign up as customer on the website
2. Browse and book drivers

## 📱 Mobile Testing

The website is fully responsive. Test on:
- Chrome DevTools mobile view
- Actual mobile devices
- Tablet devices

## 🔍 Debugging Tips

### Common Issues

1. **Build fails with Supabase error**
   - Make sure environment variables are set
   - Use placeholder values for local development

2. **Images not loading**
   - Check if image URLs are accessible
   - Verify Supabase storage policies

3. **Authentication not working**
   - Verify Supabase project settings
   - Check if email confirmation is required

### Debug Mode
```bash
npm run dev
```
Check browser console for errors and network tab for API calls.

## 🚀 Next Steps

Once you have the basic setup working:

1. Customize the design and branding
2. Add payment integration
3. Implement real-time notifications
4. Add mobile app with React Native
5. Set up analytics and monitoring

## 🆘 Support

If you run into issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure Supabase database schema is properly set up
4. Check network connectivity to Supabase

For more help, refer to:
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
