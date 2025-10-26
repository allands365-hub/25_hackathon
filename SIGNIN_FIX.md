# Sign-In Redirect Fix

## Problem
Users were not being automatically redirected after signing in. After OAuth authentication, the session was not being properly stored in browser cookies, causing users to appear unauthenticated even after successful sign-in.

## Root Cause
The OAuth callback handler was using the Supabase service role key to exchange the authorization code for a session, but it wasn't properly setting session cookies that the browser could access. This meant:

1. OAuth code exchange happened ✅
2. User profile was created/updated ✅
3. Redirect to `/challenges` or `/sponsor` happened ✅
4. **BUT** - Session wasn't in cookies ❌
5. User appeared unauthenticated on the destination page ❌

## Solution

### 1. Installed `@supabase/ssr` Package
```bash
npm install @supabase/ssr
```

This package provides proper cookie management for Supabase in Next.js 15 App Router.

### 2. Updated OAuth Callback Handler (`app/auth/callback/route.ts`)

**Before:**
```typescript
// Used service role key without cookie handling
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
```

**After:**
```typescript
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Create client with proper cookie handling
const cookieStore = await cookies();
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options);
        });
      },
    },
  }
);
```

Now when the OAuth code is exchanged for a session, the session cookies are properly set in the response.

### 3. Updated Middleware (`middleware.ts`)

**Before:**
- Used basic `createClient` from `@supabase/supabase-js`
- No session refresh logic

**After:**
```typescript
import { createServerClient } from '@supabase/ssr';

// Create client with cookie handling
const supabase = createServerClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Update both request and response cookies
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  }
);

// Automatically refresh expired sessions
await supabase.auth.getUser();
```

Now the middleware automatically refreshes expired tokens on every request.

## Sign-In Flow (After Fix)

### Builder Sign-In (GitHub OAuth)
1. User clicks "Sign In with GitHub" on `/auth/signin`
2. Redirected to GitHub OAuth
3. GitHub redirects back to `/auth/callback?role=builder&code=...`
4. Callback handler:
   - Creates Supabase client with cookie handling
   - Exchanges code for session
   - **Stores session in cookies** ✅
   - Creates/updates user profile in database
   - Redirects to `/challenges`
5. User lands on `/challenges` **authenticated** ✅

### Sponsor Sign-In (Email/Password)
1. User enters email/password on `/auth/signin`
2. `supabase.auth.signInWithPassword()` is called
3. Session is stored automatically by the Supabase client
4. Redirects to `/sponsor`
5. User lands on `/sponsor` authenticated ✅

## Testing the Fix

### Manual Testing
1. Start dev server: `npm run dev`
2. Navigate to `http://localhost:3000/auth/signin`
3. Click "Sign In with GitHub" (requires GitHub OAuth configured)
4. Should redirect to GitHub, then back to `/challenges`
5. Should see authenticated content without needing to refresh

### What Was Fixed
- ✅ Session cookies are properly set after OAuth
- ✅ Users are authenticated immediately after redirect
- ✅ Token refresh happens automatically in middleware
- ✅ No need for manual page refresh

## Files Changed
- `app/auth/callback/route.ts` - OAuth callback with cookie handling
- `middleware.ts` - Session refresh logic
- `package.json` - Added `@supabase/ssr` dependency

## Related Issues
- Text readability fixes in profile and leaderboard pages
- Theme toggle implementation
