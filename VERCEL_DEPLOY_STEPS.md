# Vercel Deployment Guide - Step by Step

## 🚀 Exact Steps to Deploy Your Hire My Driver Website

### Step 1: Login to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Sign Up" or "Log In"
3. **Choose "Continue with GitHub"** (this is important!)
4. Authorize Vercel to access your GitHub repositories

### Step 2: Import Your Repository
1. After login, you'll see "Import Project" or click "New Project"
2. Look for your repository: **`AjayBendale99/hire_my_driver`**
3. Click **"Import"** next to it

### Step 3: Configure Project Settings
**Framework Preset:** Next.js (should auto-detect)
**Root Directory:** `./` (leave as default)
**Build Command:** `npm run build` (should auto-fill)
**Output Directory:** `.next` (should auto-fill)

### Step 4: Add Environment Variables
Click **"Environment Variables"** section and add these **exactly**:

```
NEXT_PUBLIC_SUPABASE_URL
Value: [Your Supabase Project URL - looks like https://xxx.supabase.co]

NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: [Your Supabase Anon Key - starts with eyJ...]

SUPABASE_SERVICE_ROLE_KEY
Value: [Your Supabase Service Role Key - starts with eyJ...]
```

### Step 5: Deploy
1. Click **"Deploy"** button
2. Wait 2-3 minutes for build to complete
3. You'll get a live URL like: `https://hire-my-driver-xxx.vercel.app`

## 🔧 Common Issues & Solutions

### Issue 1: "Repository not found"
**Solution:** Make sure you signed up with GitHub and authorized Vercel

### Issue 2: "Build failed" 
**Solution:** Check if all environment variables are added correctly

### Issue 3: "Supabase connection error"
**Solution:** Verify your Supabase URL and keys are correct

## 📋 Your Supabase Credentials Checklist

From your Supabase dashboard (Settings → API):

- [ ] Project URL copied
- [ ] Anon public key copied  
- [ ] Service role key copied
- [ ] All keys start with `eyJ` (except URL)

## 🆘 If Still Having Issues

1. **Screenshot the error** and tell me what step you're stuck on
2. **Check your Supabase credentials** - go to Settings → API and re-copy them
3. **Try incognito mode** if Vercel isn't loading properly

## 🎯 Your Repository Details
- **GitHub Repo:** https://github.com/AjayBendale99/hire_my_driver
- **Your Username:** AjayBendale99
- **Project Name:** hire_my_driver
