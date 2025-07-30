# Supabase Auth Configuration for Production

## Email Verification Setup

When deploying to production, you need to configure Supabase Auth URLs properly to ensure email verification links point to your production domain instead of localhost.

### 1. Supabase Dashboard Configuration

Go to your Supabase Dashboard → Project → Authentication → URL Configuration:

#### Site URL
Change from: `http://localhost:3001`
To: `https://your-app-name.vercel.app`

#### Redirect URLs
Add these URLs to the allowed redirect URLs list:
```
https://your-app-name.vercel.app/**
https://your-app-name.vercel.app/dashboard
https://your-app-name.vercel.app/auth/callback
```

### 2. Environment Variables

#### For Vercel Production:
```bash
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_database_connection_string
```

#### For Local Development:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Testing Email Verification

After deployment:
1. Create a new account on your production site
2. Check your email for the verification link
3. Verify the link points to your production domain
4. Click the link to confirm it redirects properly

### 4. Common Issues

**Problem**: Email links still show localhost
**Solution**: Clear your Supabase Auth URL configuration and re-enter the production URLs

**Problem**: Infinite redirect loops after email verification
**Solution**: Ensure the redirect URLs match exactly in both Supabase dashboard and your app

**Problem**: "Invalid redirect URL" errors
**Solution**: Make sure all possible redirect URLs are added to the Supabase allowed list

### 5. Auth Flow

1. User signs up → Email sent with production domain link
2. User clicks email link → Redirected to production `/dashboard`
3. User is authenticated → Can access protected routes

## Notes

- Always test email verification in production after deployment
- Update Supabase URLs before going live
- Keep localhost URLs for development environment
