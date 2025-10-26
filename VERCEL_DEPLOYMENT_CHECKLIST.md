# Vercel Deployment Checklist

## ✅ Pre-Deployment (All Done!)

- [x] Code builds successfully (`npm run build`)
- [x] All gitignored files removed from tracking
- [x] ESLint and TypeScript errors fixed
- [x] Environment variables configured locally
- [x] Repository pushed to GitHub

## 🚀 Deployment Steps

### 1. Connect to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import repository: `allands365-hub/25_hackathon`

### 2. Configure Build Settings
- Framework: Next.js (auto-detected)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 3. Add Environment Variables (CRITICAL!)
Add these in Vercel dashboard:

**Supabase:**
```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_project_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_supabase_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_supabase_service_role_key>
```

**GitHub OAuth:**
```
GITHUB_CLIENT_ID=<get from GitHub OAuth settings>
GITHUB_CLIENT_SECRET=<get from GitHub OAuth settings>
```

**Resend (Email):**
```
RESEND_API_KEY=<get from Resend dashboard>
```

**Groq (LLM):**
```
GROQ_API_KEY=<get from Groq console>
```

### 4. Update GitHub OAuth Callback
- Go to GitHub → Settings → Developer settings → OAuth Apps
- Update callback URL to: `https://your-project.vercel.app/auth/callback`

### 5. Deploy
- Click "Deploy" button
- Wait for build (~2-3 minutes)

## ✅ Post-Deployment Testing

- [ ] Test homepage loads
- [ ] Test GitHub OAuth sign-in
- [ ] Test challenge creation (Sponsor)
- [ ] Test project submission (Builder)
- [ ] Test LLM evaluation
- [ ] Test email notifications
- [ ] Test dark/light mode toggle
- [ ] Test leaderboard
- [ ] Test challenge detail page

## 📊 Monitoring

- Check Vercel deployment logs
- Monitor Supabase logs for database errors
- Monitor Resend logs for email delivery
- Check Groq console for API usage

## 🔗 Quick Links

- **Repository**: https://github.com/allands365-hub/25_hackathon
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Resend Dashboard**: https://resend.com/api-keys
- **Groq Console**: https://console.groq.com/keys

