# ✅ Verified Dokploy Deployment Guide for classly.space

Based on [official Dokploy documentation](https://docs.dokploy.com/docs/core/nextjs) and verified best practices.

## 🎯 CORRECTED Deployment Steps

### Step 1: Access Dokploy Dashboard
- Go to: **http://69.62.82.25:3000** (or your Dokploy custom domain)
- Login with your credentials

---

### Step 2: Create Project
1. Click **"Create Project"**
2. Name: `classly-space`
3. Click **"Create"**

---

### Step 3: Add Service (Application)
1. Within your project, click **"Add a Service"**
2. Choose **"Application"** as service type
3. Name: `classly-nextjs` (or any name you prefer)
4. Click **"Create"**

---

### Step 4: Configure Build Method

**Important**: For Next.js with Docker support, you have TWO options:

#### **Option A: Use Buildpack (Recommended for Simplicity)**

1. Under **"Source"** section:
   - Select your connected GitHub repository
   - Branch: `master` (or `main`)
   - Build Path: `/` (root directory)
   
2. Under **"Build Configuration"**:
   - **Build Pack**: Select **"Next"** (Dokploy will auto-detect)
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Port**: `3000`

#### **Option B: Use Dockerfile (More Control)**

1. **Source Configuration**:
   - Repository: Your GitHub repo
   - Branch: `master`
   
2. **Build Configuration**:
   - **Build Type**: Select **"Dockerfile"**
   - **Dockerfile Path**: Leave as `Dockerfile` (or specify custom path)
   - No build command needed (handled by Dockerfile)

**Your project already has a Dockerfile**, so **Option B** is ready to use!

---

### Step 5: Environment Variables ⚠️ CRITICAL

Add these in Dokploy service settings under **"Environment Variables"**:

```bash
# Domain Configuration (NO TRAILING SLASH!)
NEXT_PUBLIC_BASE_URL=https://classly.space

# Node Environment
NODE_ENV=production

# Port (if using Dockerfile)
PORT=3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key

# Groq
GROQ_API_KEY=your_groq_key

# Resend
RESEND_API_KEY=your_resend_key
```

**⚠️ Remove the trailing slash from NEXT_PUBLIC_BASE_URL!**

---

### Step 6: Configure Domain & SSL

1. In your service settings, find **"Domains"** section
2. Add domain: `classly.space`
3. Dokploy will automatically:
   - Generate SSL certificate (Let's Encrypt)
   - Configure HTTPS
   - Update reverse proxy configuration

---

### Step 7: Deploy

1. Click **"Deploy"** button in your service
2. Monitor build logs in real-time
3. Build usually takes 3-5 minutes
4. Look for "Deployment successful" message

---

### Step 8: Verify Deployment

1. **DNS Check** (wait 5-15 minutes for propagation):
   ```bash
   nslookup classly.space
   # Should return: 69.62.82.25
   ```

2. **Access Your App**:
   - Visit: **https://classly.space**
   - Check browser console for errors
   - Test authentication
   - Test API endpoints

---

## 🔧 Key Corrections Based on Official Docs

### What I Got RIGHT ✅
- ✅ Dockerfile approach is valid
- ✅ Next.js standalone output
- ✅ Environment variables structure
- ✅ Port 3000 configuration
- ✅ SSL automatic configuration

### What Needs Clarification 🔄
According to [Dokploy docs](https://docs.dokploy.com/docs/core/nextjs):

1. **Service Type**: Use **"Application"** (not just "Build from Git")
2. **Build Path**: For Next.js, root directory `/` is correct
3. **Build Command**: `npm run build` (already in package.json)
4. **Start Command**: `npm start` (already in package.json)
5. **Access Dashboard**: Port 3000 by default (`http://69.62.82.25:3000`)

---

## 📋 Dokploy-Specific Commands Reference

### Start/Restart Service
```bash
# Via Dokploy Dashboard:
Click "Restart" button on service page

# Via SSH:
ssh root@69.62.82.25
cd /var/lib/dokploy
docker-compose restart
```

### View Logs
```bash
# Via Dokploy Dashboard:
Open service → Click "Logs" tab

# Via SSH:
ssh root@69.62.82.25
docker logs <service-name>
```

### Backup & Restore
```bash
# Dokploy has built-in backup in dashboard
# Navigate to: Project → Backup
```

---

## 🚨 Common Issues & Solutions

### Issue: Build Fails
**Solution**: Check Dockerfile or buildpack logs in Dokploy dashboard

### Issue: Port 3000 Already in Use
**Solution**: Change port in Dokploy settings to available port (e.g., 3001)

### Issue: SSL Certificate Not Generated
**Solution**: 
1. Verify DNS points to VPS: `nslookup classly.space`
2. Wait 5-15 minutes for DNS propagation
3. Check if ports 80/443 are open: `ufw status`

### Issue: Environment Variables Not Loading
**Solution**: 
1. Verify variable names (case-sensitive)
2. Ensure no extra spaces
3. Restart service after adding variables

---

## 📚 Official Resources

- [Dokploy Next.js Documentation](https://docs.dokploy.com/docs/core/nextjs)
- [Dokploy Getting Started](https://docs.dokploy.com/docs/getting-started)
- [Dokploy Production Guide](https://docs.dokploy.com/docs/core/applications/going-production)

---

## ✅ Verification Summary

Your deployment method is **CORRECT**! The key points:

1. ✅ **Dockerfile**: Proper multi-stage build
2. ✅ **Standalone Output**: Optimal for production
3. ✅ **Environment Variables**: Correct structure
4. ✅ **Domain Configuration**: classly.space
5. ✅ **Build Commands**: Already in package.json
6. ✅ **Security**: Non-root user, proper permissions

**You're ready to deploy!** Follow the steps above in Dokploy dashboard.

