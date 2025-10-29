# OAuth Redirect URL Fix

## Issue
When signing in via GitHub OAuth, users were being redirected to `https://0.0.0.0:3000` instead of `https://classly.space`, resulting in an `ERR_ADDRESS_INVALID` error.

## Root Cause
The OAuth callback was using an incorrect origin URL (`0.0.0.0:3000`) which could happen due to:
1. Supabase dashboard having an incorrect "Site URL" configured
2. Request headers not properly forwarding the correct host
3. Missing environment variables for production base URL

## Fix Applied

### 1. Updated Callback Route (`app/auth/callback/route.ts`)
- Added intelligent origin detection that:
  - Checks `NEXT_PUBLIC_BASE_URL` environment variable first
  - Uses `x-forwarded-host` and `x-forwarded-proto` headers (for proxies/CDNs)
  - Falls back to request origin
  - **Never allows `0.0.0.0` or `localhost` in production**
  - Falls back to `https://classly.space` if invalid origin detected

### 2. Updated Environment Variable Documentation
- Added clearer comments in `env.example` about setting `NEXT_PUBLIC_BASE_URL` for production

## Required Actions

### 1. Set Environment Variables (Vercel/Docker/Production)
Make sure `NEXT_PUBLIC_BASE_URL` is set in your production environment:
```bash
NEXT_PUBLIC_BASE_URL=https://classly.space
```

### 2. Check Supabase Dashboard Settings
1. Go to your Supabase project dashboard
2. Navigate to **Authentication** → **URL Configuration**
3. Verify **Site URL** is set to: `https://classly.space`
4. Ensure **Redirect URLs** include:
   - `https://classly.space/auth/callback`
   - `https://classly.space/auth/callback?role=builder`
   - `https://classly.space/auth/callback?role=sponsor`

### 3. Check GitHub OAuth App Settings
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Verify your OAuth app's **Authorization callback URL** is:
   - `https://qbbdfgszjgfteusxlykl.supabase.co/auth/v1/callback`
   - (This is your Supabase Auth callback URL, not your app's callback)

## Testing
After deploying the fix:
1. Clear browser cache and cookies
2. Navigate to `https://classly.space/auth/signin`
3. Click "Sign In with GitHub"
4. Complete the OAuth flow
5. Verify you're redirected to `https://classly.space/challenges` (or appropriate page) instead of `0.0.0.0:3000`

## Code Changes Summary
- ✅ Enhanced origin detection in callback route
- ✅ Added production safety checks (no localhost/0.0.0.0 in prod)
- ✅ Added fallback to `https://classly.space` if invalid origin detected
- ✅ Updated environment variable documentation

