# Fix for Dokploy Build Error

## The Problem

Your Dokploy is trying to use the wrong build path. It's treating the GitHub URL as a directory path, causing this error:

```
No such file or directory: /etc/dokploy/.../code/https:/github.com/.../blob/master/
```

## The Fix

### Step 1: Edit Application Settings

1. Go to your Dokploy dashboard
2. Navigate to: **Build-AI → production → MainApp**
3. Click on **"General"** or **"Settings"** tab
4. Look for these fields:

### Step 2: Fix the Build Path

Find the field called:
- **"Build Path"** OR
- **"Working Directory"** OR  
- **"Root Directory"**

**Current value (WRONG):**
```
/https:/github.com/allands365-hub/25_hackathon/blob/master/
```

**Change it to (CORRECT):**
```
/
```

Or simply **leave it empty** if that's an option.

### Step 3: Fix Dockerfile Path (if using Dockerfile method)

If you're using the Dockerfile build method:

- **"Dockerfile Path"** or **"Docker File"**
- Should be: `Dockerfile` (just the filename, no path)
- Should NOT include any GitHub URL paths

### Step 4: Verify Repository Settings

Check your Git settings:
- **Repository**: Should show just `github.com/allands365-hub/25_hackathon`
- **Branch**: `master` (or `main`)
- **Build Path**: `/` (empty or just a forward slash)

### Step 5: Save and Redeploy

1. Click **"Save"** or **"Update"**
2. Go to **"Deployments"** tab
3. Click **"Deploy"** or **"Redeploy"**

---

## Alternative: Use Nixpacks Build Pack

If the Dockerfile method continues to have issues, try the buildpack approach:

### Option: Switch to Nixpacks

1. In your application settings
2. Look for **"Build Pack"** or **"Build Type"**
3. Select **"Nixpacks"** instead of **"Dockerfile"**
4. Save and redeploy

Nixpacks will automatically detect Next.js and build it correctly.

---

## Quick Settings Summary

Your Dokploy Application should have these settings:

```
Project: Build-AI
Service: MainApp
Repository: github.com/allands365-hub/25_hackathon
Branch: master
Build Type: Dockerfile
Dockerfile Path: Dockerfile
Build Path: /
Working Directory: /
Port: 3000
```

---

## Environment Variables (Already Correct ✅)

Your environment variables look correct:
- ✅ NEXT_PUBLIC_SUPABASE_URL
- ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
- ✅ SUPABASE_SERVICE_ROLE_KEY
- ✅ GROQ_API_KEY
- ✅ RESEND_API_KEY
- ✅ NODE_ENV=production
- ✅ NEXT_PUBLIC_BASE_URL=https://classly.space
- ✅ PORT=3000

---

## If Still Having Issues

### Check Dokploy Version
You're on **v0.25.5** which should support all these features.

### Alternative: Manual Docker Build

If Dokploy continues to have issues, you can manually build and push:

```bash
# SSH into your VPS
ssh root@69.62.82.25

# Clone repo
git clone https://github.com/allands365-hub/25_hackathon.git
cd 25_hackathon

# Build Docker image
docker build -t classly-app .

# Run container
docker run -d \
  --name classly-app \
  -p 3000:3000 \
  -e NEXT_PUBLIC_BASE_URL=https://classly.space \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e SUPABASE_SERVICE_ROLE_KEY=your_key \
  -e GROQ_API_KEY=your_key \
  -e RESEND_API_KEY=your_key \
  -e NODE_ENV=production \
  classly-app
```

But ideally, fix the Build Path setting in Dokploy and use the automated deployment.

