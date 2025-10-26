# BuildAI Arena - Deployment Guide

## Local Testing

### 1. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### 2. Test Key Features
- ✓ Sign in as Builder (GitHub OAuth)
- ✓ Sign in as Sponsor (GitHub OAuth)
- ✓ Create challenges (Sponsor)
- ✓ Submit projects (Builder)
- ✓ Review submissions (Sponsor)
- ✓ View leaderboards
- ✓ Dark/Light mode toggle

## Vercel Deployment Steps

### Prerequisites
1. GitHub account with your code pushed to the repository
2. Vercel account (sign up at https://vercel.com)

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect GitHub Repository**
   - Go to https://vercel.com/dashboard
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `allands365-hub/25_hackathon`
   - Vercel will auto-detect it's a Next.js project

2. **Configure Project Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
   - **Install Command**: `npm install` (auto-filled)

3. **Environment Variables** (CRITICAL!)
   Add these in the Vercel dashboard under "Environment Variables":
   
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # GitHub OAuth (same as Supabase Auth)
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   
   # Resend (Email)
   RESEND_API_KEY=your_resend_api_key
   
   # Groq (LLM)
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~2-3 minutes)
   - Your app will be live at a `your-project.vercel.app` URL

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link Project**
   ```bash
   vercel link
   ```

4. **Set Environment Variables**
   ```bash
   vercel env add NEXT_PUBLIC_SUPABASE_URL
   vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
   vercel env add SUPABASE_SERVICE_ROLE_KEY
   vercel env add GITHUB_CLIENT_ID
   vercel env add GITHUB_CLIENT_SECRET
   vercel env add RESEND_API_KEY
   vercel env add GROQ_API_KEY
   ```

5. **Deploy**
   ```bash
   vercel --prod
   ```

## Post-Deployment Checklist

- [ ] Test GitHub OAuth sign-in
- [ ] Test challenge creation
- [ ] Test project submission
- [ ] Test LLM evaluation (with Groq)
- [ ] Test email notifications
- [ ] Test dark/light mode toggle
- [ ] Verify environment variables are set correctly
- [ ] Check Vercel deployment logs for errors

## Environment Variables Reference

Get these values from your `.env.local` file or respective service dashboards:

### Supabase
- **NEXT_PUBLIC_SUPABASE_URL**: From Supabase dashboard → Settings → API
- **NEXT_PUBLIC_SUPABASE_ANON_KEY**: From Supabase dashboard → Settings → API
- **SUPABASE_SERVICE_ROLE_KEY**: From Supabase dashboard → Settings → API

### GitHub OAuth
- **GITHUB_CLIENT_ID**: From GitHub → Settings → Developer settings → OAuth Apps
- **GITHUB_CLIENT_SECRET**: From GitHub → Settings → Developer settings → OAuth Apps
- Configure callback URL in GitHub: `https://your-project.vercel.app/auth/callback`

### Resend
- **RESEND_API_KEY**: From Resend dashboard at https://resend.com/api-keys
- Currently using test domain: `onboarding@resend.dev`

### Groq
- **GROQ_API_KEY**: From Groq dashboard at https://console.groq.com/keys

## Troubleshooting

### Build Fails
- Check environment variables are all set in Vercel dashboard
- Check build logs in Vercel dashboard for specific errors
- Ensure all dependencies are in `package.json`

### Authentication Errors
- Verify Supabase project is active
- Check GitHub OAuth callback URL is correct
- Verify environment variables are set correctly

### Email Not Sending
- Verify Resend API key is valid
- Check domain is verified (or using test domain)
- Monitor Resend dashboard for delivery status

### Database Errors
- Verify Supabase project is active
- Check RLS policies are correctly configured
- Verify service role key has proper permissions

## Monitoring

- **Vercel Analytics**: Automatic analytics in Vercel dashboard
- **Supabase Logs**: Check Supabase dashboard → Logs
- **Resend Logs**: Check Resend dashboard → Logs
- **Groq Logs**: Check Groq console for API usage

## Next Steps

1. Set up custom domain (optional)
2. Enable Vercel Analytics
3. Configure GitHub webhooks for auto-deployment
4. Set up monitoring and alerts
5. Configure backup and disaster recovery

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs
- Resend Docs: https://resend.com/docs

