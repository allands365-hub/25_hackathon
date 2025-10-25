# Testing GitHub Authentication

## Setup Checklist

### GitHub OAuth App Configuration
1. Go to: https://github.com/settings/developers
2. Create new OAuth App with:
   - **Homepage URL:** `http://localhost:3000`
   - **Callback URL:** `https://qbbdfgszjgfteusxlykl.supabase.co/auth/v1/callback`
3. Copy Client ID and Client Secret

### Supabase Configuration
1. Go to: https://supabase.com/dashboard/project/qbbdfgszjgfteusxlykl/auth/providers
2. Enable GitHub provider
3. Paste Client ID and Secret
4. Save

## Test Flow

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Open browser:** http://localhost:3000

3. **Click "Sign In with GitHub"**

4. **Expected flow:**
   - Redirects to GitHub
   - GitHub asks for permission
   - Redirects to Supabase callback
   - Supabase creates session
   - Redirects to your app at `/profile`

## Common Issues

### Error: "provider is not enabled"
- GitHub provider not enabled in Supabase
- Solution: Enable in Auth Providers settings

### Error: "redirect_uri mismatch"
- GitHub OAuth app callback URL doesn't match
- Solution: Use exactly `https://qbbdfgszjgfteusxlykl.supabase.co/auth/v1/callback`

### Error: "invalid client"
- Wrong Client ID or Secret
- Solution: Double-check credentials in Supabase settings

## After Authentication Works

Once auth works locally, for production:

1. **Update GitHub OAuth App:**
   - Add production homepage: `https://your-app.vercel.app`
   - Callback stays the same: `https://qbbdfgszjgfteusxlykl.supabase.co/auth/v1/callback`

2. **No changes needed in Supabase** - same settings work for dev and prod!

## Debugging

Check browser console for errors:
```javascript
// You should see successful auth flow:
// 1. Redirect to GitHub
// 2. Redirect to Supabase callback
// 3. Redirect to /profile with session
```

Check Supabase Auth Logs:
https://supabase.com/dashboard/project/qbbdfgszjgfteusxlykl/auth/logs
