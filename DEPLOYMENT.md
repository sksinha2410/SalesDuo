# SalesDuo Deployment Guide

This guide covers deploying SalesDuo to production environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Security Considerations](#security-considerations)
7. [Monitoring and Maintenance](#monitoring-and-maintenance)

---

## Prerequisites

Before deploying to production:

- [ ] Production server (VPS, cloud instance, etc.)
- [ ] Domain name (optional but recommended)
- [ ] SSL certificate (Let's Encrypt recommended)
- [ ] MySQL database (managed or self-hosted)
- [ ] OpenAI API key with sufficient credits
- [ ] Node.js v14+ installed on server
- [ ] Nginx or Apache for reverse proxy
- [ ] Process manager (PM2 recommended)

---

## Environment Setup

### 1. Server Preparation

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js (v18 LTS)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL (if not using managed database)
sudo apt install -y mysql-server

# Install Nginx
sudo apt install -y nginx

# Install PM2 globally
sudo npm install -g pm2
```

### 2. Clone Repository

```bash
cd /var/www
sudo git clone https://github.com/sksinha2410/SalesDuo.git
cd SalesDuo
sudo chown -R $USER:$USER .
```

---

## Database Setup

### Option 1: Local MySQL

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p

# In MySQL shell:
CREATE DATABASE salesduo;
CREATE USER 'salesduo_user'@'localhost' IDENTIFIED BY 'strong_password_here';
GRANT ALL PRIVILEGES ON salesduo.* TO 'salesduo_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import schema
mysql -u salesduo_user -p salesduo < backend/db/schema.sql
```

### Option 2: Managed Database (AWS RDS, DigitalOcean, etc.)

1. Create a MySQL database instance
2. Note the connection details (host, port, username, password)
3. Import the schema using your database management tool
4. Whitelist your server's IP address

---

## Backend Deployment

### 1. Install Dependencies

```bash
cd /var/www/SalesDuo/backend
npm install --production
```

### 2. Configure Environment

```bash
cp .env.example .env
nano .env
```

Update with production values:

```env
PORT=3001
NODE_ENV=production

# Database
DB_HOST=your_database_host
DB_USER=salesduo_user
DB_PASSWORD=strong_password_here
DB_NAME=salesduo

# OpenAI
OPENAI_API_KEY=sk-your-actual-api-key

# Security
USER_AGENT=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36
```

### 3. Start with PM2

```bash
# Start the backend
pm2 start src/index.js --name salesduo-backend

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
# Follow the instructions displayed

# Monitor logs
pm2 logs salesduo-backend
```

### 4. Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/salesduo-api
```

Add configuration:

```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings for long-running requests
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

Enable and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/salesduo-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Frontend Deployment

### 1. Build the Frontend

```bash
cd /var/www/SalesDuo/frontend

# Update API URL in .env
echo "REACT_APP_API_URL=https://api.yourdomain.com/api" > .env

# Build for production
npm run build
```

### 2. Configure Nginx for Frontend

```bash
sudo nano /etc/nginx/sites-available/salesduo-frontend
```

Add configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/SalesDuo/frontend/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/javascript application/xml+rss application/json;
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/salesduo-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal is set up automatically
# Test renewal
sudo certbot renew --dry-run
```

---

## Security Considerations

### 1. Firewall Configuration

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. Environment Variables

- Never commit `.env` files
- Use secrets management (AWS Secrets Manager, HashiCorp Vault, etc.)
- Rotate credentials regularly

### 3. Rate Limiting

Add to Nginx configuration:

```nginx
# In http block
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

# In server block
location /api/products/process {
    limit_req zone=api_limit burst=5;
    # ... rest of proxy config
}
```

### 4. Database Security

- Use strong passwords
- Enable SSL connections
- Regular backups
- Limit network access
- Keep MySQL updated

### 5. Application Security

- Keep Node.js and dependencies updated
- Run `npm audit` regularly
- Use HTTPS only
- Implement API authentication
- Sanitize user inputs
- Set up monitoring and alerting

---

## Monitoring and Maintenance

### 1. PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs salesduo-backend

# Restart application
pm2 restart salesduo-backend

# Monitor resources
pm2 monit
```

### 2. Log Rotation

```bash
# Install logrotate for PM2
pm2 install pm2-logrotate

# Configure
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3. Backups

Create a backup script:

```bash
#!/bin/bash
# /var/www/SalesDuo/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/salesduo"

mkdir -p $BACKUP_DIR

# Backup database
mysqldump -u salesduo_user -p'password' salesduo > $BACKUP_DIR/db_backup_$DATE.sql

# Compress
gzip $BACKUP_DIR/db_backup_$DATE.sql

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.gz" -type f -mtime +30 -delete

echo "Backup completed: $DATE"
```

Set up cron job:

```bash
crontab -e
# Add line:
0 2 * * * /var/www/SalesDuo/backup.sh >> /var/log/salesduo-backup.log 2>&1
```

### 4. Updates

```bash
# Pull latest changes
cd /var/www/SalesDuo
git pull

# Backend updates
cd backend
npm install --production
pm2 restart salesduo-backend

# Frontend updates
cd ../frontend
npm install
npm run build
```

### 5. Monitoring Services

Consider using:
- **Uptime monitoring**: UptimeRobot, Pingdom
- **Error tracking**: Sentry, Rollbar
- **Performance**: New Relic, DataDog
- **Logs**: ELK Stack, Papertrail

---

## Docker Deployment (Alternative)

### 1. Build and Deploy with Docker

```bash
cd /var/www/SalesDuo

# Create .env file with production values
nano .env

# Build and start services
docker-compose -f docker-compose.prod.yml up -d

# View logs
docker-compose logs -f
```

### 2. Docker Production Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: salesduo-mysql
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: salesduo
      MYSQL_USER: salesduo_user
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./backend/db/schema.sql:/docker-entrypoint-initdb.d/schema.sql
    networks:
      - salesduo-network

  backend:
    build: ./backend
    container_name: salesduo-backend
    restart: always
    environment:
      PORT: 3001
      NODE_ENV: production
      DB_HOST: mysql
      DB_USER: salesduo_user
      DB_PASSWORD: ${MYSQL_PASSWORD}
      DB_NAME: salesduo
      OPENAI_API_KEY: ${OPENAI_API_KEY}
    depends_on:
      - mysql
    networks:
      - salesduo-network

  frontend:
    build: 
      context: ./frontend
      args:
        REACT_APP_API_URL: ${API_URL}
    container_name: salesduo-frontend
    restart: always
    depends_on:
      - backend
    networks:
      - salesduo-network

  nginx:
    image: nginx:alpine
    container_name: salesduo-nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - backend
      - frontend
    networks:
      - salesduo-network

volumes:
  mysql_data:

networks:
  salesduo-network:
    driver: bridge
```

---

## Troubleshooting

### Backend Won't Start

1. Check logs: `pm2 logs salesduo-backend`
2. Verify database connection
3. Check environment variables
4. Ensure port 3001 is available

### Frontend Not Loading

1. Check Nginx configuration: `sudo nginx -t`
2. Verify build was successful
3. Check browser console for errors
4. Verify API URL is correct

### Database Connection Issues

1. Verify database is running
2. Check credentials
3. Ensure network connectivity
4. Check firewall rules

---

## Performance Optimization

1. **Caching**: Implement Redis for caching API responses
2. **CDN**: Use CloudFlare or AWS CloudFront for static assets
3. **Database Indexing**: Ensure proper indexes on frequently queried fields
4. **Connection Pooling**: Configure MySQL connection pool size
5. **Compression**: Enable gzip compression in Nginx
6. **Asset Optimization**: Minify and compress frontend assets

---

## Rollback Plan

In case of issues:

```bash
# Backend rollback
pm2 stop salesduo-backend
git checkout previous-commit-hash
cd backend && npm install --production
pm2 start salesduo-backend

# Frontend rollback
git checkout previous-commit-hash
cd frontend && npm install && npm run build
```

---

## Support

For deployment issues:
- Check logs first
- Review documentation
- Open an issue on GitHub
- Contact support team

Good luck with your deployment!
