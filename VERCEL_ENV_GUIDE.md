# Environment Variables Template for Vercel

## Required Environment Variables for hire_my_driver

### 1. NEXT_PUBLIC_SUPABASE_URL
- **Value**: https://YOUR_PROJECT_ID.supabase.co
- **Example**: https://abcdefghijklmnop.supabase.co
- **Where to find**: Supabase Dashboard → Settings → API → Project URL

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
- **Value**: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9... (long string)
- **Where to find**: Supabase Dashboard → Settings → API → Project API keys → anon public

### 3. SUPABASE_SERVICE_ROLE_KEY  
- **Value**: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9... (different long string)
- **Where to find**: Supabase Dashboard → Settings → API → Project API keys → service_role
- **⚠️ IMPORTANT**: Keep this secret! Don't share publicly.

## Vercel Setup Instructions

1. Go to https://vercel.com/dashboard
2. Click on your "hire_my_driver" project  
3. Go to Settings → Environment Variables
4. Add each variable above:
   - Name: [Variable name from above]
   - Value: [Your actual value from Supabase]
   - Environments: Check ALL (Production, Preview, Development)
5. Click "Save"
6. Redeploy your project

## Common Mistakes to Avoid

❌ Don't use "Secrets" - use direct values
❌ Don't forget to check all environments (Production, Preview, Development)  
❌ Don't copy partial keys - copy the entire key
❌ Don't add quotes around the values
❌ Don't confuse anon key with service role key

✅ Use the exact variable names shown above
✅ Copy complete URLs and keys from Supabase
✅ Check all three environments
✅ Click Save after adding each variable
