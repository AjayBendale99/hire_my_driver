# 🔐 Database Security Setup Guide

## Problem
The signup is failing because **Row Level Security (RLS)** policies are blocking user creation. We need to configure proper security policies.

## Solution Steps

### Step 1: Access Supabase SQL Editor
1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project: **godohfvudqvmzymlqcni**
3. Click on **"SQL Editor"** in the left sidebar
4. Click **"New Query"**

### Step 2: Apply RLS Policies
1. **Copy** the entire content from `database/rls_policies.sql`
2. **Paste** it into the SQL Editor
3. **Click "Run"** to execute all the policies

### Step 3: Verify Policies Were Created
After running the SQL, you should see output showing the policies were created. If you get any errors, share them with me.

### Step 4: Create Your First Admin Account
1. **Go to**: http://localhost:3004/auth/signup?role=admin
2. **Sign up** with your email (e.g., `ajay@example.com`)
3. **After signup**, go back to Supabase SQL Editor
4. **Run this command** (replace with your email):
   ```sql
   UPDATE users 
   SET role = 'admin' 
   WHERE email = 'your-actual-email@example.com';
   ```

### Step 5: Test the Fix
1. **Run the signup test**: http://localhost:3004/admin/test-signup
2. **Try actual signup**: http://localhost:3004/auth/signup?role=driver
3. **Test driver registration**: http://localhost:3004/driver/register

## What These Policies Do

✅ **Users can create their own profile** during signup
✅ **Users can read/update their own data**
✅ **Drivers can create driver profiles**
✅ **Customers can see approved drivers**
✅ **Admins can manage everything**
✅ **Document upload permissions** are properly set

## Expected Results After Fix

- ✅ Signup should work without errors
- ✅ Driver registration should complete successfully
- ✅ Admin dashboard should show pending applications
- ✅ All user roles should work properly

## If You Get Errors

Share any SQL errors you get when running the policies, and I'll help fix them immediately!
