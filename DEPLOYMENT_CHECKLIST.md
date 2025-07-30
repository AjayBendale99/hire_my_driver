# ✅ Production Deployment Checklist

## Phase 1: GitHub Repository Setup

### Create GitHub Repository
- [ ] Go to https://github.com/new
- [ ] Repository name: `hire-drive-website`
- [ ] Description: `Professional driver booking platform for India`
- [ ] Make it **Public** (for free Vercel hosting)
- [ ] **Don't** initialize with README (we have one)
- [ ] Click **Create repository**

### Connect Local Repository to GitHub
```bash
# Replace YOUR-USERNAME with your GitHub username
git remote add origin https://github.com/YOUR-USERNAME/hire-drive-website.git
git branch -M main
git push -u origin main
```

## Phase 2: Supabase Database Setup

### Create Supabase Project
- [ ] Go to https://supabase.com
- [ ] Click **New Project**
- [ ] Organization: Your personal account
- [ ] Project name: `hire-drive-prod`
- [ ] Database password: (generate strong password)
- [ ] Region: **Singapore** (closest to India)
- [ ] Click **Create new project**
- [ ] Wait 2-3 minutes for setup

### Configure Database
- [ ] Go to **SQL Editor**
- [ ] Click **New query**
- [ ] Copy entire contents from `database/schema.sql`
- [ ] Click **Run** to execute
- [ ] Verify tables created in **Table Editor**

### Set up Storage
- [ ] Go to **Storage**
- [ ] Click **Create bucket**
- [ ] Name: `documents`
- [ ] Public: **No** (keep private)
- [ ] Click **Create bucket**

### Get API Credentials
- [ ] Go to **Settings** → **API**
- [ ] Copy **Project URL**
- [ ] Copy **anon public** key
- [ ] Copy **service_role secret** key
- [ ] Save these for Vercel deployment

### Configure Authentication
- [ ] Go to **Authentication** → **Settings**
- [ ] Site URL: `http://localhost:3000` (update after Vercel)
- [ ] Redirect URLs: `http://localhost:3000/auth/callback`

## Phase 3: Vercel Deployment

### Deploy to Vercel
- [ ] Go to https://vercel.com
- [ ] Click **Add New** → **Project**
- [ ] **Import Git Repository**
- [ ] Select your `hire-drive-website` repository
- [ ] Framework Preset: **Next.js** (auto-detected)
- [ ] Root Directory: `./`
- [ ] Click **Deploy**

### Configure Environment Variables
- [ ] In Vercel project dashboard, go to **Settings** → **Environment Variables**
- [ ] Add these variables (all environments):

```
NEXT_PUBLIC_SUPABASE_URL = https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY = your-service-role-key-here
NEXT_PUBLIC_APP_URL = https://your-vercel-domain.vercel.app
```

### Redeploy with Environment Variables
- [ ] Go to **Deployments** tab
- [ ] Click **Redeploy** on latest deployment
- [ ] Wait for deployment to complete

## Phase 4: Final Configuration

### Update Supabase URLs
- [ ] Copy your Vercel deployment URL
- [ ] In Supabase → **Authentication** → **Settings**
- [ ] Update **Site URL** to your Vercel URL
- [ ] Add **Redirect URLs**: `https://your-domain.vercel.app/auth/callback`

### Create Admin Account
- [ ] Visit your live site
- [ ] Sign up with your admin email
- [ ] Go to Supabase → **Authentication** → **Users**
- [ ] Copy your User ID
- [ ] In **SQL Editor**, run:
```sql
UPDATE public.users SET role = 'admin' WHERE id = 'your-user-id';
```

## Phase 5: Testing & Launch

### Test Core Features
- [ ] User registration (customer & driver)
- [ ] Login/logout functionality
- [ ] Driver registration with file uploads
- [ ] Browse drivers page
- [ ] Search and filtering
- [ ] Mobile responsiveness
- [ ] Admin can view pending drivers

### Performance Check
- [ ] All pages load under 3 seconds
- [ ] Images display correctly
- [ ] Forms submit without errors
- [ ] File uploads work
- [ ] Database operations successful

### Security Verification
- [ ] Environment variables secure
- [ ] File upload restrictions work
- [ ] RLS policies active
- [ ] Authentication required for protected pages

## 🎉 Launch!

### Go Live Checklist
- [ ] Custom domain setup (optional)
- [ ] Social media announcement
- [ ] SEO optimization
- [ ] Analytics setup
- [ ] Monitor initial user registrations

## Support & Monitoring

### Post-Launch Tasks
- [ ] Monitor Vercel analytics
- [ ] Check Supabase usage
- [ ] Review user feedback
- [ ] Approve driver registrations
- [ ] Scale based on demand

---

## 🆘 Common Issues & Solutions

### Build Fails
- Check environment variables are set
- Verify Supabase credentials
- Review build logs in Vercel

### Authentication Not Working
- Verify Supabase URLs in auth settings
- Check redirect URLs match your domain
- Ensure environment variables are correct

### File Uploads Fail
- Verify Supabase storage bucket exists
- Check storage policies are applied
- Confirm file size limits

### Database Errors
- Ensure schema.sql was executed completely
- Check RLS policies are enabled
- Verify user permissions

---

**🎯 Status: Ready for deployment!**

Your Hire Drive platform is production-ready. Follow this checklist step by step for a successful launch! 🚀
