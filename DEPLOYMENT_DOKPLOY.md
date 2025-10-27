# Dokploy Deployment Guide for classly.space

## Prerequisites Checklist
- ✅ Dokploy installed on VPS (69.62.82.25)
- ✅ Domain: classly.space
- ✅ DNS record pointing to VPS (69.62.82.25)
- ✅ Git repository connected to Dokploy
- ✅ VPS IP: 69.62.82.25

---

## Step 1: Update Dockerfile for Standalone Build

The `next.config.ts` has been updated with `output: 'standalone'` for optimized Docker builds.

---

## Step 2: Create Application in Dokploy

1. **Login to Dokploy Dashboard**
   - Go to: http://69.62.82.25 (or your Dokploy domain)
   - Sign in with your credentials

2. **Create New Application**
   - Click "New Application" or "+"
   - Choose "From Git Repository"
   - Select your connected repository: `25_hackathon`

---

## Step 3: Configure Application Settings

### Build Settings
- **Build Type**: Dockerfile
- **Dockerfile Path**: `Dockerfile`
- **Build Command**: (Leave empty, handled by Dockerfile)
- **Working Directory**: `/`

### Port Configuration
- **Port**: `3000`
- **Port Type**: HTTP

---

## Step 4: Environment Variables

Add these environment variables in your Dokploy application settings:

```bash
# Next.js Configuration
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://classly.space
PORT=3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Groq AI Configuration
GROQ_API_KEY=your-groq-api-key

# Resend Email Configuration
RESEND_API_KEY=your-resend-api-key
```

**⚠️ Important**: Replace all the placeholder values with your actual API keys!

---

## Step 5: Domain Configuration

1. **Configure Domain in Dokploy**
   - Go to your application settings
   - Find "Domain" or "Custom Domain" section
   - Add domain: `classly.space`
   - Enable HTTPS/SSL (Dokploy should auto-generate SSL certificate)

2. **If using Dokploy's reverse proxy:**
   - Dokploy will automatically handle SSL via Let's Encrypt
   - Make sure port 80 and 443 are open on your firewall

---

## Step 6: Firewall Configuration

Ensure these ports are open on your VPS:

```bash
# SSH (required)
ufw allow 22/tcp

# HTTP
ufw allow 80/tcp

# HTTPS
ufw allow 443/tcp

# Dokploy dashboard port (if different)
# Check your Dokploy installation
```

---

## Step 7: DNS Verification

Verify your DNS is correctly configured:

```bash
# Check if domain points to your VPS
nslookup classly.space

# Should return: 69.62.82.25
```

Expected output:
```
Server:         8.8.8.8
Address:        8.8.8.8#53

Non-authoritative answer:
Name:   classly.space
Address: 69.62.82.25
```

---

## Step 8: Deploy

1. **Push changes to your repository** (if you haven't already)
2. **In Dokploy**, click "Deploy" or "Redeploy"
3. **Monitor the build logs** for any errors
4. **Wait for build to complete** (usually 3-5 minutes)

---

## Step 9: Verify Deployment

### Health Check
1. Visit: https://classly.space
2. Check browser console for errors
3. Test authentication flow
4. Test API routes

### Common Issues

**Issue**: Application not accessible
- **Solution**: Check if Dokploy's reverse proxy is configured and listening on port 80/443

**Issue**: 502 Bad Gateway
- **Solution**: Check Docker container logs in Dokploy dashboard

**Issue**: Environment variables not working
- **Solution**: Ensure all variables are set in Dokploy application settings and restart the container

**Issue**: SSL certificate not generating
- **Solution**: Verify DNS is correctly pointing to your VPS IP

---

## Step 10: Continuous Deployment (Optional)

Dokploy supports automatic deployments:

1. Go to application settings
2. Enable "Auto Deploy" for your branch (usually `master` or `main`)
3. Every push to the main branch will trigger a new deployment

---

## Monitoring and Maintenance

### View Logs
- Go to your application in Dokploy
- Click "Logs" tab to view real-time logs

### Restart Application
- Click "Restart" button in Dokploy dashboard

### Update Application
- Push new commits to your repository
- Dokploy will automatically rebuild and redeploy (if auto-deploy is enabled)

---

## Important URLs

- **App URL**: https://classly.space
- **Dokploy Dashboard**: http://69.62.82.25 (or your Dokploy domain)
- **Git Repository**: https://github.com/allands365-hub/25_hackathon

---

## Troubleshooting

### Check Application Status
```bash
# SSH into your VPS
ssh your-user@69.62.82.25

# Check if Docker containers are running
sudo docker ps

# View application logs
sudo docker logs <container-id>
```

### Check Dokploy Status
```bash
# Check Dokploy logs
sudo dokploy logs

# Restart Dokploy
sudo systemctl restart dokploy
```

### Reset Everything
If something goes wrong:
1. Delete the application in Dokploy
2. Recreate it from scratch
3. Make sure all environment variables are set correctly
4. Redeploy

---

## Security Checklist

- ✅ SSL/HTTPS enabled
- ✅ Environment variables secured (not in code)
- ✅ Firewall configured
- ✅ Strong passwords for Dokploy dashboard
- ✅ Regular security updates for VPS

---

## Support

If you encounter issues:
1. Check Dokploy logs
2. Check Docker container logs
3. Verify DNS configuration
4. Verify firewall rules
5. Check Supabase, Groq, and Resend API keys are valid

---

**Last Updated**: Based on Next.js 15.5.6 and Dokploy deployment best practices.

