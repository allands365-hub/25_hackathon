# How to Check if Ports are Exposed on VPS

## Required Ports for Dokploy Deployment

For your classly.space deployment, these ports should be open:
- **Port 22** (SSH)
- **Port 80** (HTTP)
- **Port 443** (HTTPS)
- **Port 3000** (Your Next.js application)

---

## Method 1: Check Firewall Status

### If using UFW (Ubuntu/Debian):

```bash
# SSH into your VPS
ssh root@69.62.82.25

# Check UFW status
sudo ufw status

# If firewall is inactive, enable it
sudo ufw enable

# Check specific port
sudo ufw status | grep 80
sudo ufw status | grep 443
sudo ufw status | grep 3000

# Open ports if needed
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp

# Verify after opening
sudo ufw status
```

### If using firewalld (CentOS/RHEL):

```bash
# Check firewall status
sudo systemctl status firewalld

# Check open ports
sudo firewall-cmd --list-ports

# Open ports if needed
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload

# Verify
sudo firewall-cmd --list-ports
```

### If using iptables:

```bash
# Check iptables rules
sudo iptables -L -n

# Open ports
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT

# Save rules
sudo iptables-save
```

---

## Method 2: Check if Ports are Listening

```bash
# Check if ports are listening on the server
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
sudo netstat -tlnp | grep :3000

# Alternative using ss command
sudo ss -tlnp | grep :80
sudo ss -tlnp | grep :443
sudo ss -tlnp | grep :3000
```

**Expected output if port is listening:**
```
tcp        0      0 0.0.0.0:80              0.0.0.0:*               LISTEN
tcp        0      0 0.0.0.0:443             0.0.0.0:*               LISTEN
```

---

## Method 3: Test Ports from External Computer

### From your local machine:

```bash
# Test port 80 (HTTP)
telnet 69.62.82.25 80

# Or using curl
curl -I http://69.62.82.25

# Test port 443 (HTTPS)
telnet 69.62.82.25 443
curl -I https://69.62.82.25

# Test port 3000
telnet 69.62.82.25 3000
curl http://69.62.82.25:3000
```

### Using nc (netcat):

```bash
# Test if port is open
nc -zv 69.62.82.25 80
nc -zv 69.62.82.25 443
nc -zv 69.62.82.25 3000
```

### Using online port checker:
- Visit: https://www.yougetsignal.com/tools/open-ports/
- Enter IP: `69.62.82.25`
- Check ports: 80, 443, 3000

---

## Method 4: Check Dokploy Internal Ports

Since Dokploy handles reverse proxy, check internal ports:

```bash
# SSH into VPS
ssh root@69.62.82.25

# Check Dokploy containers
sudo docker ps

# Check what ports containers are using
sudo docker ps --format "table {{.Names}}\t{{.Ports}}"
```

---

## Method 5: Full Port Scan (Quick)

```bash
# From your VPS
sudo nmap -sT -O localhost

# Or scan external IP
sudo nmap -p 80,443,3000 69.62.82.25
```

---

## Quick Check Script

Create and run this script on your VPS:

```bash
#!/bin/bash
echo "Checking VPS Ports..."
echo "===================="

# Check if ports are listening
echo -e "\nPorts listening on VPS:"
sudo ss -tlnp | grep -E ':(80|443|3000)'

# Check firewall status
echo -e "\nFirewall Status:"
if command -v ufw &> /dev/null; then
    sudo ufw status | grep -E '(80|443|3000)'
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --list-ports | grep -E '(80|443|3000)'
else
    echo "Firewall not detected (iptables?)"
fi

# Check Docker containers
echo -e "\nDocker containers with ports:"
sudo docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E '(80|443|3000)'

# Test external accessibility
echo -e "\nTesting external accessibility:"
echo "Port 80: $(timeout 2 nc -zv 69.62.82.25 80 2>&1 | grep -c succeeded || echo closed)"
echo "Port 443: $(timeout 2 nc -zv 69.62.82.25 443 2>&1 | grep -c succeeded || echo closed)"
echo "Port 3000: $(timeout 2 nc -zv 69.62.82.25 3000 2>&1 | grep -c succeeded || echo closed)"
```

Save as `check-ports.sh`, make executable, and run:
```bash
chmod +x check-ports.sh
./check-ports.sh
```

---

## Troubleshooting

### Issue: Port is closed

**Solution:**
1. Check if application is running
2. Check firewall rules
3. Verify cloud provider security group settings

### Issue: Port 80/443 not working

**Solution:**
```bash
# Make sure Dokploy's reverse proxy is running
sudo docker ps | grep traefik

# Or check Nginx if Dokploy uses it
sudo systemctl status nginx
```

### Issue: Cloud Provider Firewall

If using cloud VPS (AWS, DigitalOcean, etc.):

1. **DigitalOcean**:
   - Go to Networking → Firewalls
   - Check security groups

2. **AWS EC2**:
   - Go to EC2 → Security Groups
   - Check inbound rules

3. **Linode**:
   - Go to Networking → Firewall
   - Check rules

4. **Hetzner Cloud**:
   - Go to Networks → Firewalls
   - Check rules

---

## Verify Port 3000 Specifically

Since your Next.js app runs on port 3000:

```bash
# SSH into VPS
ssh root@69.62.82.25

# Check if Dokploy container is running
sudo docker ps | grep buildai-mainapp-ianblz

# Check application logs
sudo docker logs buildai-mainapp-ianblz

# Test internal port
curl http://localhost:3000

# Check if Traefik is forwarding
sudo docker ps | grep traefik
```

---

## Summary: What You Should See

✅ **Port 80**: Should be open (Dokploy's reverse proxy)
✅ **Port 443**: Should be open (HTTPS/SSL)
✅ **Port 3000**: May be internal only (Traefik forwards to your app)
⚠️ **Port 22**: Must be open (SSH access)

If all ports show as open/listening, your VPS is properly configured!

---

## Quick Commands Reference

```bash
# 1. SSH into VPS
ssh root@69.62.82.25

# 2. Check firewall
sudo ufw status

# 3. Check listening ports
sudo ss -tlnp | grep -E ':(80|443|3000)'

# 4. Test from external
nc -zv 69.62.82.25 80

# 5. Check Docker
sudo docker ps
```

