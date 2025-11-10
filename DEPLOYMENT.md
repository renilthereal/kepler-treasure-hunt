# Deployment Guide for K.E.P.L.E.R Treasure Hunt

This guide provides step-by-step instructions for deploying the treasure hunt application to kepler.inps.info.

## Prerequisites

- A server with Ubuntu 20.04 or later
- Node.js 18.x or later
- Domain name configured: kepler.inps.info
- Cloudflare account with DNS access
- SSH access to the server

## Step 1: Server Setup

### 1.1 Update System

```bash
sudo apt update
sudo apt upgrade -y
```

### 1.2 Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v18.x or higher
```

### 1.3 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
pm2 --version
```

### 1.4 Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 2: Deploy Application

### 2.1 Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/renilthereal/kepler-treasure-hunt.git
cd kepler-treasure-hunt
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Create Environment File

```bash
cp .env.example .env
nano .env
```

Update the .env file:

```env
PORT=3000
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
NODE_ENV=production
MEET_URL=https://meet.google.com/ymy-sows-owk
```

**Important:** Change the SESSION_SECRET to a random string for security.

### 2.4 Initialize Database

```bash
node init-db.js
```

This will:
- Create the SQLite database
- Set up tables (users, attempts)
- Populate with 94 participants from the data

### 2.5 Test Application Locally

```bash
node server.js
```

Visit http://YOUR_SERVER_IP:3000 to verify it works.
Press Ctrl+C to stop.

## Step 3: Configure PM2

### 3.1 Start Application with PM2

```bash
pm2 start server.js --name kepler-treasure-hunt
pm2 save
pm2 startup
```

Follow the command output to enable PM2 to start on boot.

### 3.2 View Application Status

```bash
pm2 status
pm2 logs kepler-treasure-hunt
```

## Step 4: Configure Nginx Reverse Proxy

### 4.1 Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/kepler-treasure-hunt
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name kepler.inps.info;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### 4.2 Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/kepler-treasure-hunt /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: Configure Cloudflare

### 5.1 Add DNS Record

1. Log in to Cloudflare dashboard
2. Select your domain (inps.info)
3. Go to DNS settings
4. Add an A record:
   - Type: A
   - Name: kepler
   - IPv4 address: YOUR_SERVER_IP
   - Proxy status: Proxied (orange cloud)
   - TTL: Auto

### 5.2 SSL/TLS Settings

1. Go to SSL/TLS > Overview
2. Set encryption mode to "Full" or "Full (strict)"
3. Enable "Always Use HTTPS" under SSL/TLS > Edge Certificates

### 5.3 Security Settings (Optional but Recommended)

- Enable "Bot Fight Mode" under Security > Bots
- Set Security Level to "Medium" or "High"
- Enable "Browser Integrity Check"

## Step 6: Final Testing

### 6.1 Test Application

1. Visit https://kepler.inps.info
2. Try logging in with test credentials:
   - Username: abdul (case-insensitive)
   - Password: 8076374618
3. Verify all 10 questions load correctly
4. Check that timer starts automatically
5. Test anti-cheat features:
   - Try right-clicking (should be disabled)
   - Try text selection (should be disabled)
   - Switch tabs (should show warning)
6. Submit answers and verify scoring works

### 6.2 Monitor Logs

```bash
pm2 logs kepler-treasure-hunt --lines 100
```

## Step 7: Maintenance

### Update Application

```bash
cd /var/www/kepler-treasure-hunt
git pull origin main
npm install
pm2 restart kepler-treasure-hunt
```

### View Database

```bash
sqlite3 treasure_hunt.db
.tables
SELECT * FROM users LIMIT 5;
.exit
```

### Backup Database

```bash
cp treasure_hunt.db treasure_hunt_backup_$(date +%Y%m%d_%H%M%S).db
```

## Troubleshooting

### Application Won't Start

```bash
pm2 logs kepler-treasure-hunt
```

Check for:
- Port 3000 already in use
- Missing .env file
- Database file permissions

### Can't Access Website

1. Check Nginx status: `sudo systemctl status nginx`
2. Check PM2 status: `pm2 status`
3. Verify Cloudflare DNS has propagated: `dig kepler.inps.info`
4. Check firewall: `sudo ufw status`

### Database Issues

```bash
# Reset database (WARNING: Deletes all data)
rm treasure_hunt.db
node init-db.js
pm2 restart kepler-treasure-hunt
```

## Security Checklist

- [ ] SESSION_SECRET changed from default
- [ ] Firewall configured (only ports 22, 80, 443 open)
- [ ] SSH key-based authentication enabled
- [ ] Regular backups scheduled
- [ ] PM2 startup script configured
- [ ] Cloudflare proxy enabled
- [ ] HTTPS enforced
- [ ] Server OS updated regularly

## Support

For issues, check:
- Application logs: `pm2 logs kepler-treasure-hunt`
- Nginx logs: `sudo tail -f /var/log/nginx/error.log`
- System logs: `sudo journalctl -xe`

## Event Day Checklist

1 day before:
- [ ] Test all participant logins
- [ ] Verify all 10 questions display correctly
- [ ] Test timer functionality
- [ ] Backup database
- [ ] Monitor server resources

Event day:
- [ ] Monitor application logs
- [ ] Watch for unusual activity
- [ ] Have backup plan ready
- [ ] Keep contact info for tech support handy
