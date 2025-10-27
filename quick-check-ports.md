# Quick Port Check Commands

## From Your Local Machine

```bash
# Check port 80 (HTTP)
curl -I http://69.62.82.25

# Check port 443 (HTTPS)
curl -I https://69.62.82.25

# Check port 3000
curl http://69.62.82.25:3000

# Check if port is open (if you have netcat)
nc -zv 69.62.82.25 80
nc -zv 69.62.82.25 443
nc -zv 69.62.82.25 3000
```

## From Your VPS (SSH)

```bash
# SSH into your VPS first
ssh root@69.62.82.25

# Then run these commands:

# 1. Check firewall status
sudo ufw status

# 2. Check if ports are listening
sudo ss -tlnp | grep -E ':(80|443|3000)'

# 3. Check Dokploy containers
sudo docker ps

# 4. Test application locally
curl http://localhost:3000
```

## Online Port Checker
Visit: https://www.yougetsignal.com/tools/open-ports/
- Enter IP: `69.62.82.25`
- Click "Check"
- Look for ports 80, 443, 3000

## If Ports Are Closed

Open them with:

```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw reload
```

