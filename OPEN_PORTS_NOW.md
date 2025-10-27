# 🚨 CRITICAL: Open Ports 80 and 443

## The Problem

Ports 80 and 443 are **CLOSED** but they **MUST BE OPEN** for:
- Port 80: HTTP traffic
- Port 443: HTTPS/SSL traffic

Without these ports open, no one can access your website at classly.space!

---

## ✅ Quick Fix - Run These Commands

SSH into your VPS and run these commands:

```bash
# 1. SSH into your VPS
ssh root@69.62.82.25

# 2. Open port 80 (HTTP)
sudo ufw allow 80/tcp

# 3. Open port 443 (HTTPS)
sudo ufw allow 443/tcp

# 4. Reload firewall
sudo ufw reload

# 5. Verify ports are open
sudo ufw status
```

---

## Expected Output

After running `sudo ufw status`, you should see:

```
Status: active

To                         Action      From
--                         ------      ----
80/tcp                     ALLOW       Anywhere
443/tcp                    ALLOW       Anywhere
3000/tcp                   ALLOW       Anywhere
22/tcp                     ALLOW       Anywhere
```

---

## Alternative: If UFW is Not Installed

If you get "command not found", try these alternatives:

### Option 1: Using iptables

```bash
# Allow port 80
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT

# Allow port 443
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# Save rules
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```

### Option 2: Disable Firewall Temporarily (for testing)

```bash
# Check firewall status
sudo systemctl status firewalld

# If active, disable temporarily
sudo systemctl stop firewalld
sudo systemctl disable firewalld

# Restart Dokploy
sudo systemctl restart dokploy
```

⚠️ **Warning**: Only disable firewall for testing. Re-enable it after confirming ports work.

---

## Verify Ports are Now Open

### 1. Check from VPS:

```bash
sudo ufw status
# Should show ports 80 and 443 as ALLOW
```

### 2. Check from External (Your Computer):

```bash
# Test HTTP
curl -I http://69.62.82.25

# Test HTTPS
curl -I https://69.62.82.25
```

### 3. Check if Traefik (Dokploy's reverse proxy) is running:

```bash
# Check Docker containers
sudo docker ps | grep traefik

# If Traefik is not running, restart Dokploy
sudo systemctl restart dokploy
```

---

## Important: Cloud Provider Firewall

If you're using a cloud VPS (DigitalOcean, AWS, Linode, etc.), you ALSO need to open ports in the **cloud provider's firewall**:

### DigitalOcean:
1. Go to: https://cloud.digitalocean.com/networking/firewalls
2. Find/create firewall for your VPS
3. Add inbound rules:
   - Port 80 (HTTP)
   - Port 443 (HTTPS)
   - Port 3000 (Your app)

### AWS:
1. Go to EC2 Dashboard
2. Click Security Groups
3. Find your VPS's security group
4. Add inbound rules:
   - Port 80 (0.0.0.0/0)
   - Port 443 (0.0.0.0/0)
   - Port 3000 (0.0.0.0/0)

### Hetzner:
1. Go to Networks
2. Select your network
3. Add firewall rules:
   - Port 80
   - Port 443
   - Port 3000

---

## After Opening Ports

### 1. Restart Dokploy:

```bash
sudo systemctl restart dokploy
```

### 2. Check Dokploy Dashboard:

Visit: http://69.62.82.25:3000
- Should load successfully

### 3. Configure Domain:

In Dokploy dashboard:
1. Go to **MainApp → Domains**
2. Add domain: `classly.space`
3. Wait for SSL certificate generation

### 4. Test Your Site:

```bash
# Test HTTP
curl -I http://classly.space

# Test HTTPS
curl -I https://classly.space
```

---

## Why Ports Were Closed

Common reasons:
1. **Security**: Many VPS providers keep ports closed by default
2. **New installation**: UFW/firewall not configured yet
3. **Cloud provider firewall**: External firewall blocking ports
4. **Dokploy installation**: May not have automatically configured firewall

---

## Full Checklist

- [ ] SSH into VPS
- [ ] Open port 80: `sudo ufw allow 80/tcp`
- [ ] Open port 443: `sudo ufw allow 443/tcp`
- [ ] Reload firewall: `sudo ufw reload`
- [ ] Verify: `sudo ufw status`
- [ ] Restart Dokploy: `sudo systemctl restart dokploy`
- [ ] Check cloud provider firewall (if applicable)
- [ ] Test: `curl -I http://69.62.82.25`
- [ ] Configure domain in Dokploy
- [ ] Test: `curl -I https://classly.space`

---

## Troubleshooting

### Issue: Ports still closed after opening

**Solution:**
1. Check cloud provider firewall
2. Verify UFW status: `sudo ufw status verbose`
3. Try disabling UFW temporarily to test
4. Check for other firewall (firewalld, iptables)

### Issue: Cloud provider doesn't allow rule changes

**Solution:**
1. Contact support
2. Check documentation for your provider
3. Some providers have security groups that need manual configuration

### Issue: Still can't access after opening ports

**Solution:**
```bash
# Check if Traefik is running
sudo docker ps | grep traefik

# Check Traefik logs
sudo docker logs traefik

# Check if Dokploy is running
sudo systemctl status dokploy

# View Dokploy logs
sudo journalctl -u dokploy -n 50
```

---

## Expected Results

After opening ports, you should be able to:

✅ Access: http://69.62.82.25
✅ Access: https://69.62.82.25 (after SSL setup)
✅ Access: https://classly.space
✅ See your Next.js application

---

**Run these commands NOW to open ports 80 and 443!**

