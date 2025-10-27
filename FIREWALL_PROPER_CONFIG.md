# Proper UFW Firewall Configuration

## The Issue

You disabled UFW because it was blocking GitHub repository access. But we still need firewall rules for ports 80/443 for your website!

---

## ✅ Correct UFW Configuration

UFW by default allows **ALL outbound traffic** but blocks **inbound traffic** unless explicitly allowed.

Run these commands:

```bash
# 1. Enable UFW
sudo ufw enable

# 2. Allow SSH FIRST (don't get locked out!)
sudo ufw allow 22/tcp

# 3. Allow HTTP
sudo ufw allow 80/tcp

# 4. Allow HTTPS
sudo ufw allow 443/tcp

# 5. Check status
sudo ufw status
```

---

## Why This Won't Block GitHub

✅ **Outbound traffic is allowed by default**
- GitHub cloning/pull requests work fine
- HTTPS connections to GitHub work
- Docker pulling images work
- Your app can make API calls

✅ **Only inbound ports are restricted**
- Port 22 (SSH) - allowed (you can SSH in)
- Port 80 (HTTP) - allowed (website works)
- Port 443 (HTTPS) - allowed (SSL works)
- Everything else - blocked (secure!)

---

## Verify It Works

After running the commands above, test:

### 1. Check UFW Status:

```bash
sudo ufw status verbose
```

Expected output:
```
Status: active
Logging: on
Default: deny (incoming), allow (outgoing)
              
To                         Action      From
--                         ------      ----
22/tcp                     ALLOW IN    Anywhere
80/tcp                     ALLOW IN    Anywhere
443/tcp                    ALLOW IN    Anywhere
```

Key line: `Default: deny (incoming), allow (outgoing)` ✅

### 2. Test GitHub Access:

```bash
# Clone a test repo (should work)
git clone https://github.com/octocat/Hello-World.git

# Or just check GitHub connectivity
curl -I https://github.com
```

### 3. Test Your Website:

```bash
# From your local machine
curl -I http://classly.space
curl -I https://classly.space
```

---

## If GitHub Still Doesn't Work

This is rare, but if it happens:

### Option 1: Check UFW Logs

```bash
# See what's being blocked
sudo tail -f /var/log/ufw.log

# Try git command and see what gets logged
```

### Option 2: Temporarily Make Rules More Permissive

```bash
# Allow all HTTPS traffic (GitHub uses HTTPS)
sudo ufw allow out 443/tcp

# Allow HTTP (for redirects)
sudo ufw allow out 80/tcp
```

These are **outbound** rules to ensure your server can make HTTPS requests.

### Option 3: Check if You're Using IP Tables Directly

```bash
# If someone configured iptables separately
sudo iptables -L -n

# Flush iptables if needed (careful!)
sudo iptables -F
```

---

## Complete Secure Configuration

Here's the recommended set of rules for your VPS:

```bash
# Reset UFW
sudo ufw reset

# Enable UFW with defaults
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow essential ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Enable firewall
sudo ufw enable

# Verify
sudo ufw status verbose
```

**This configuration:**
- ✅ Blocks all incoming connections EXCEPT ports 22, 80, 443
- ✅ Allows ALL outgoing connections (GitHub, APIs, etc.)
- ✅ Keeps your server secure
- ✅ Allows your website to work

---

## Test Everything Works

After configuring, verify:

### 1. SSH (should work):
```bash
# Try reconnecting
ssh root@69.62.82.25
```

### 2. GitHub (should work):
```bash
# Clone or pull should work
git clone https://github.com/test/repo.git
# OR
git pull origin master
```

### 3. Website (should work):
```bash
# From your local machine
curl -I http://classly.space
curl -I https://classly.space
```

---

## Why UFW Blocked GitHub Before

Possible reasons:

1. **Someone changed default rules** - UFW should allow all outbound by default
2. **Custom iptables rules** - Additional firewall rules outside UFW
3. **Misconfiguration** - Rules were set incorrectly

The configuration above ensures GitHub access while keeping your server secure.

---

## Quick Reference: Proper UFW Setup

```bash
# One-command setup
sudo ufw default deny incoming && \
sudo ufw default allow outgoing && \
sudo ufw allow 22/tcp && \
sudo ufw allow 80/tcp && \
sudo ufw allow 443/tcp && \
sudo ufw enable && \
sudo ufw status
```

This is the secure, production-ready firewall configuration!

