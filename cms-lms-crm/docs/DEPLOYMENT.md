# Deployment Guide

This guide covers deploying the CMS/LMS/CRM system to various environments including development, staging, and production.

## Prerequisites

- Node.js 18+ 
- MySQL 8.0+
- PM2 (for production)
- Nginx (recommended for production)
- SSL certificate (for production)

## Environment Setup

### Development Environment

1. **Clone and Install Dependencies**
```bash
git clone <repository-url>
cd cms-lms-crm
npm install
```

2. **Environment Configuration**
```bash
cp .env.example .env
```

Edit `.env` with your development settings:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_dev_password
DB_NAME=cms_lms_crm_dev
JWT_SECRET=your-development-jwt-secret
```

3. **Database Setup**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE cms_lms_crm_dev;"

# Start application (migrations run automatically)
npm run start:dev
```

### Production Environment

#### Option 1: Traditional Server Deployment

1. **Server Setup (Ubuntu 20.04+)**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MySQL
sudo apt install mysql-server -y
sudo mysql_secure_installation

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y
```

2. **Application Deployment**
```bash
# Create application directory
sudo mkdir -p /var/www/cms-lms-crm
cd /var/www/cms-lms-crm

# Clone repository
sudo git clone <repository-url> .
sudo chown -R $USER:$USER /var/www/cms-lms-crm

# Install dependencies
npm ci --only=production

# Build application
npm run build
```

3. **Environment Configuration**
```bash
# Create production environment file
sudo nano .env
```

Production `.env`:
```env
NODE_ENV=production
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=cms_user
DB_PASSWORD=secure_production_password
DB_NAME=cms_lms_crm_prod
JWT_SECRET=super-secure-jwt-secret-min-32-chars
JWT_EXPIRES_IN=24h

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your-email@company.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@company.com

# WhatsApp Configuration
WHATSAPP_API_URL=https://api.whatsapp.com
WHATSAPP_API_KEY=your-production-api-key
WHATSAPP_PHONE_NUMBER=your-business-number

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,application/pdf

# Swagger
SWAGGER_TITLE=CMS/LMS/CRM API
SWAGGER_DESCRIPTION=Production API for Contact Management System
SWAGGER_VERSION=1.0
```

4. **Database Setup**
```bash
# Create production database and user
sudo mysql -u root -p
```

```sql
CREATE DATABASE cms_lms_crm_prod;
CREATE USER 'cms_user'@'localhost' IDENTIFIED BY 'secure_production_password';
GRANT ALL PRIVILEGES ON cms_lms_crm_prod.* TO 'cms_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

```bash
# Run migrations
npm run migration:run
```

5. **PM2 Configuration**

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'cms-lms-crm',
    script: 'dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/cms-lms-crm/error.log',
    out_file: '/var/log/cms-lms-crm/out.log',
    log_file: '/var/log/cms-lms-crm/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
```

```bash
# Create log directory
sudo mkdir -p /var/log/cms-lms-crm
sudo chown -R $USER:$USER /var/log/cms-lms-crm

# Start application with PM2
pm2 start ecosystem.config.js
pm2 startup
pm2 save
```

6. **Nginx Configuration**

Create `/etc/nginx/sites-available/cms-lms-crm`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /path/to/your/certificate.pem;
    ssl_certificate_key /path/to/your/private.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security Headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

    # File Upload Size
    client_max_body_size 10M;

    # API Proxy
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 86400;
    }

    # Static files (if serving frontend)
    location / {
        root /var/www/cms-lms-crm/public;
        try_files $uri $uri/ =404;
    }

    # Logs
    access_log /var/log/nginx/cms-lms-crm.access.log;
    error_log /var/log/nginx/cms-lms-crm.error.log;
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/cms-lms-crm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Option 2: Docker Deployment

1. **Create Dockerfile**
```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS runner

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY . .

RUN npm run build

USER nestjs

EXPOSE 3000

ENV NODE_ENV production

CMD ["node", "dist/main"]
```

2. **Create docker-compose.yml**
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=mysql
      - DB_PORT=3306
      - DB_USERNAME=cms_user
      - DB_PASSWORD=secure_password
      - DB_NAME=cms_lms_crm
      - JWT_SECRET=super-secure-jwt-secret
    depends_on:
      - mysql
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped

  mysql:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=root_password
      - MYSQL_DATABASE=cms_lms_crm
      - MYSQL_USER=cms_user
      - MYSQL_PASSWORD=secure_password
    volumes:
      - mysql_data:/var/lib/mysql
    ports:
      - "3306:3306"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/ssl/certs
    depends_on:
      - app
    restart: unless-stopped

volumes:
  mysql_data:
```

3. **Deploy with Docker**
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

#### Option 3: Cloud Deployment (AWS/Digital Ocean)

##### AWS Deployment with RDS

1. **RDS Setup**
```bash
# Create RDS MySQL instance via AWS Console or CLI
aws rds create-db-instance \
    --db-instance-identifier cms-lms-crm-prod \
    --db-instance-class db.t3.micro \
    --engine mysql \
    --master-username admin \
    --master-user-password SecurePassword123 \
    --allocated-storage 20 \
    --vpc-security-group-ids sg-xxxxxxxxx
```

2. **EC2 Setup**
```bash
# Launch EC2 instance and SSH into it
ssh -i your-key.pem ubuntu@your-ec2-ip

# Install dependencies (same as traditional server setup)
# Configure environment with RDS endpoint
```

3. **Environment Configuration**
```env
NODE_ENV=production
PORT=3000
DB_HOST=cms-lms-crm-prod.xxxxxxxxx.us-east-1.rds.amazonaws.com
DB_PORT=3306
DB_USERNAME=admin
DB_PASSWORD=SecurePassword123
DB_NAME=cms_lms_crm
```

##### Digital Ocean App Platform

1. **Create `app.yaml`**
```yaml
name: cms-lms-crm
services:
- name: api
  source_dir: /
  github:
    repo: your-username/cms-lms-crm
    branch: main
  run_command: npm run start:prod
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  env:
  - key: NODE_ENV
    value: production
  - key: DB_HOST
    value: ${db.HOSTNAME}
  - key: DB_PORT
    value: ${db.PORT}
  - key: DB_USERNAME
    value: ${db.USERNAME}
  - key: DB_PASSWORD
    value: ${db.PASSWORD}
  - key: DB_NAME
    value: ${db.DATABASE}
  - key: JWT_SECRET
    value: your-super-secure-jwt-secret
databases:
- name: db
  engine: MYSQL
  version: "8"
  size: basic-xs
```

2. **Deploy**
```bash
# Install doctl CLI
doctl apps create --spec app.yaml
```

## Database Migrations

### Running Migrations

```bash
# Development
npm run migration:run

# Production
NODE_ENV=production npm run migration:run
```

### Creating New Migrations

```bash
# Generate migration based on entity changes
npm run migration:generate -- AddNewFeature

# Create empty migration
npm run typeorm migration:create -- AddNewFeature
```

### Migration Rollback

```bash
# Rollback last migration
npm run migration:revert
```

## Monitoring and Logging

### PM2 Monitoring

```bash
# Monitor processes
pm2 monit

# View logs
pm2 logs cms-lms-crm

# Restart application
pm2 restart cms-lms-crm

# Reload application (zero-downtime)
pm2 reload cms-lms-crm
```

### Log Management

1. **Log Rotation with PM2**
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
```

2. **System Logs**
```bash
# Application logs
tail -f /var/log/cms-lms-crm/combined.log

# Nginx logs
tail -f /var/log/nginx/cms-lms-crm.access.log
tail -f /var/log/nginx/cms-lms-crm.error.log

# MySQL logs
tail -f /var/log/mysql/error.log
```

### Health Checks

Create health check endpoint monitoring:
```bash
# Add to crontab
*/5 * * * * curl -f http://localhost:3000/api/v1/health || pm2 restart cms-lms-crm
```

## Backup Strategy

### Database Backups

1. **Automated Daily Backups**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mysql"
mkdir -p $BACKUP_DIR

mysqldump -u cms_user -p'secure_password' cms_lms_crm_prod > $BACKUP_DIR/cms_lms_crm_$DATE.sql
gzip $BACKUP_DIR/cms_lms_crm_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete
```

2. **Schedule with cron**
```bash
# Add to crontab
0 2 * * * /path/to/backup.sh
```

### File Backups

```bash
# Backup uploaded files
rsync -av /var/www/cms-lms-crm/uploads/ /var/backups/uploads/
```

## Security Considerations

### SSL/TLS Configuration

1. **Let's Encrypt (Free SSL)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

2. **SSL Security Test**
```bash
# Test SSL configuration
curl -I https://your-domain.com
```

### Firewall Configuration

```bash
# UFW Firewall
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### Database Security

```bash
# MySQL security
sudo mysql_secure_installation

# Limit MySQL access
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
# Add: bind-address = 127.0.0.1
```

### Application Security

1. **Environment Variables**
   - Never commit `.env` files
   - Use strong JWT secrets (32+ characters)
   - Rotate secrets regularly

2. **Dependencies**
   ```bash
   # Audit dependencies
   npm audit
   npm audit fix
   ```

3. **Rate Limiting**
   - Configure rate limiting in production
   - Monitor for suspicious activity

## Troubleshooting

### Common Issues

1. **Application Won't Start**
```bash
# Check logs
pm2 logs cms-lms-crm

# Check environment
pm2 env 0

# Restart
pm2 restart cms-lms-crm
```

2. **Database Connection Issues**
```bash
# Test connection
mysql -h localhost -u cms_user -p cms_lms_crm_prod

# Check MySQL status
sudo systemctl status mysql
```

3. **High Memory Usage**
```bash
# Monitor memory
pm2 monit

# Restart if needed
pm2 restart cms-lms-crm
```

### Performance Optimization

1. **Database Optimization**
```sql
-- Add indexes for frequently queried fields
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_company ON contacts(company);
CREATE INDEX idx_crm_leads_status ON crm_leads(status);
```

2. **Application Optimization**
```bash
# Enable compression in Nginx
gzip on;
gzip_types text/plain application/json application/javascript text/css;
```

## Maintenance

### Regular Maintenance Tasks

1. **Weekly**
   - Review application logs
   - Check disk space
   - Verify backups

2. **Monthly**
   - Update dependencies
   - Review performance metrics
   - Clean up old logs

3. **Quarterly**
   - Security audit
   - Performance optimization
   - Disaster recovery test

### Update Process

1. **Staging Deployment**
```bash
# Deploy to staging first
git checkout develop
npm install
npm run build
npm run migration:run
```

2. **Production Deployment**
```bash
# Zero-downtime deployment
git pull origin main
npm install
npm run build
npm run migration:run
pm2 reload cms-lms-crm
```

This deployment guide provides comprehensive instructions for deploying the CMS/LMS/CRM system in various environments. Choose the deployment method that best fits your infrastructure and requirements.