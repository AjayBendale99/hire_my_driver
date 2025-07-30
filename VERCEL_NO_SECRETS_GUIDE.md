# Visual Guide: Adding Vercel Environment Variables (NOT Secrets)

## 🎯 The Correct Way vs Wrong Way

### ✅ CORRECT: Direct Environment Variables
```
┌─ Environment Variables ─────────────────────────────────────┐
│                                                             │
│ NEXT_PUBLIC_SUPABASE_URL                                    │
│ Value: https://abcdefgh.supabase.co                         │
│ Environments: Production, Preview, Development              │
│                                                             │
│ NEXT_PUBLIC_SUPABASE_ANON_KEY                               │
│ Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...             │
│ Environments: Production, Preview, Development              │
│                                                             │
│ SUPABASE_SERVICE_ROLE_KEY                                   │
│ Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...             │
│ Environments: Production, Preview, Development              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### ❌ WRONG: Using Secrets (This Causes Your Error)
```
┌─ Environment Variables ─────────────────────────────────────┐
│                                                             │
│ NEXT_PUBLIC_SUPABASE_URL                                    │
│ References secret "next_public_supabase_url"               │  ← This is wrong!
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📝 Step-by-Step Form Filling

### When Adding Each Variable:

```
┌─ Add Environment Variable ─────────────────────────────────┐
│                                                            │
│ Name: [TYPE EXACTLY]                                       │
│ NEXT_PUBLIC_SUPABASE_URL                                   │
│                                                            │
│ Value: [PASTE FROM SUPABASE]                               │
│ https://yourprojectid.supabase.co                          │
│                                                            │
│ Environments:                                              │
│ ☑️ Production    ← Check this                              │
│ ☑️ Preview       ← Check this                              │
│ ☑️ Development   ← Check this                              │
│                                                            │
│ [ Save ]  ← Click this (NOT "Add as Secret")              │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## 🚨 Common Mistakes

### Mistake 1: Clicking "Add as Secret"
```
❌ Don't click: [Add as Secret]
✅ Click: [Save]
```

### Mistake 2: Not Checking All Environments
```
❌ Only Production checked
✅ All three environments checked:
   ☑️ Production
   ☑️ Preview  
   ☑️ Development
```

### Mistake 3: Wrong Variable Names
```
❌ next_public_supabase_url (lowercase)
✅ NEXT_PUBLIC_SUPABASE_URL (uppercase)

❌ SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_URL
```

## 🎯 After Adding Variables Successfully

Your environment variables list should show:
```
Variable Name                    Environments
─────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL        Production, Preview, Development
NEXT_PUBLIC_SUPABASE_ANON_KEY   Production, Preview, Development
SUPABASE_SERVICE_ROLE_KEY       Production, Preview, Development
```

## 🔄 If You Need to Fix Existing Variables

1. Find the variable with "References secret" error
2. Click the 3 dots (...) on the right
3. Click "Remove"
4. Add it again using the correct method above
5. Redeploy your project
