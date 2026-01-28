# SVS-MCP Deployment Guide

Complete deployment guide for the SVS-MCP platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Docker Deployment](#docker-deployment)
4. [PM2 Deployment](#pm2-deployment)
5. [Production Deployment](#production-deployment)
6. [Environment Configuration](#environment-configuration)
7. [Security](#security)
8. [Monitoring](#monitoring)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Optional (Choose one)

- **Docker** >= 24.x (for containerized deployment)
- **Docker Compose** >= 2.x
- **PM2** (for process management)
- **PostgreSQL** >= 14.x (if not using Docker)
- **Redis** >= 7.x (if not using Docker)

### System Requirements

- **CPU:** 2+ cores recommended
- **RAM:** 4GB minimum, 8GB recommended
- **Disk:** 10GB minimum
- **OS:** Linux, macOS, or Windows with WSL2

---

## Quick Start

### 1. Clone and Setup

```bash
# Clone repository
git clone https://github.com/web3-ai-game/svs-mcp.git
cd svs-mcp

# Run setup script
npm run setup

# Or manually:
npm install
npm run install:all
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env  # or your preferred editor
```

### 3. Start Services

**Option A: Docker (Recommended)**
```bash
npm run docker:up
```

**Option B: PM2**
```bash
npm run dev
```

### 4. Verify Services

```bash
# Check health status
npm run health-check

# Monitor in real-time
npm run monitor
```

---

## Docker Deployment

### Development

```bash
# Build and start services
docker compose up -d

# View logs
docker compose logs -f

# Check status
docker compose ps

# Stop services
docker compose down
```

### Production

```bash
# Build with production configuration
docker compose -f docker-compose.yml -f docker-compose.prod.yml build

# Start services
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# View logs
docker compose logs -f --tail=100
```

### Docker Commands

```bash
# Restart specific service
docker compose restart aibot

# View service logs
docker compose logs -f aibot

# Execute command in container
docker compose exec aibot sh

# Remove containers and volumes
docker compose down -v

# Rebuild specific service
docker compose build --no-cache knowledge-base
```

---

## PM2 Deployment

### Development Mode

```bash
# Start all services
pm2 start ecosystem.config.js --env development

# View status
pm2 status

# View logs
pm2 logs

# Monitor
pm2 monit
```

### Production Mode

```bash
# Start in production mode
pm2 start ecosystem.config.js --env production

# Save process list
pm2 save

# Setup startup script
pm2 startup

# Follow the instructions provided by PM2
```

### PM2 Commands

```bash
# Restart all services
pm2 restart ecosystem.config.js

# Restart specific service
pm2 restart aibot

# Stop all services
pm2 stop all

# Delete all processes
pm2 delete all

# View real-time logs
pm2 logs --lines 100

# View service info
pm2 info aibot
```

---

## Production Deployment

### 1. Prepare Server

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Or install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### 2. Clone and Configure

```bash
# Clone repository
git clone https://github.com/web3-ai-game/svs-mcp.git
cd svs-mcp

# Setup
npm run setup

# Configure production environment
cp .env.example .env
nano .env
```

### 3. Security Setup

```bash
# Generate secure secrets
openssl rand -hex 32  # For JWT_SECRET
openssl rand -hex 32  # For SESSION_SECRET

# Update .env with generated secrets
```

### 4. Database Setup (if not using Docker)

```bash
# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Create database and user
sudo -u postgres psql
CREATE DATABASE forum;
CREATE USER forum_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE forum TO forum_user;
\q

# Install Redis
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

### 5. Deploy with PM2

```bash
# Start services
pm2 start ecosystem.config.js --env production

# Save configuration
pm2 save

# Setup auto-restart on reboot
pm2 startup
# Follow the instructions

# Configure log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 6. Setup Nginx (Optional)

```bash
# Install Nginx
sudo apt install -y nginx

# Create configuration
sudo nano /etc/nginx/sites-available/svs-mcp
```

**Nginx Configuration:**
```nginx
# AI Bot Service
server {
    listen 80;
    server_name aibot.yourdomain.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

# Forum Service
server {
    listen 80;
    server_name forum.yourdomain.com;

    location / {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/svs-mcp /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 7. SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d aibot.yourdomain.com -d forum.yourdomain.com

# Auto-renewal is configured automatically
sudo certbot renew --dry-run
```

---

## Environment Configuration

### Required Variables

```bash
# AI Configuration (Required for AI services)
OPENAI_API_KEY=sk-your-key-here
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Database (Required for Forum)
POSTGRES_USER=forum_user
POSTGRES_PASSWORD=secure_password_here
POSTGRES_DB=forum

# Security (Required for Forum)
JWT_SECRET=generate-secure-32-char-secret
SESSION_SECRET=generate-secure-32-char-secret
```

### Optional Variables

```bash
# Service Ports
KB_PORT=3001
AIBOT_PORT=3002
AI_TOOLS_PORT=3003
FORUM_PORT=3004

# AI Model Configuration
AI_MODEL=gpt-4o-mini
AI_TEMPERATURE=0.7
AI_MAX_TOKENS=2000

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# CORS Configuration
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info  # error, warn, info, debug
NODE_ENV=production
```

---

## Security

### Best Practices

1. **Change Default Secrets**
   ```bash
   # Generate secure secrets
   openssl rand -hex 32
   ```

2. **Use Environment Variables**
   - Never commit `.env` file
   - Use environment-specific configurations
   - Rotate secrets regularly

3. **Enable HTTPS**
   - Use SSL/TLS certificates
   - Enforce HTTPS in production
   - Configure HSTS headers

4. **Database Security**
   - Use strong passwords
   - Enable SSL connections
   - Restrict network access
   - Regular backups

5. **API Security**
   - Implement rate limiting
   - Validate all inputs
   - Use JWT tokens
   - Enable CORS properly

6. **Container Security**
   - Use official base images
   - Run as non-root user
   - Scan for vulnerabilities
   - Keep images updated

### Firewall Configuration

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# Block direct access to service ports (if using Nginx)
sudo ufw deny 3001:3004/tcp
```

---

## Monitoring

### Health Checks

```bash
# Quick health check
npm run health-check

# Continuous monitoring
npm run monitor

# Service-specific checks
curl http://localhost:3002/health
curl http://localhost:3004/health
```

### Logs

**PM2 Logs:**
```bash
# View all logs
pm2 logs

# View specific service
pm2 logs aibot

# View error logs only
pm2 logs --err

# Clear logs
pm2 flush
```

**Docker Logs:**
```bash
# View all services
docker compose logs -f

# View specific service
docker compose logs -f aibot

# View last 100 lines
docker compose logs --tail=100 aibot
```

### Performance Monitoring

```bash
# PM2 monitoring
pm2 monit

# System resources
htop  # or top

# Docker stats
docker stats

# Database connections
docker compose exec postgres psql -U forum_user -d forum -c "SELECT count(*) FROM pg_stat_activity;"
```

---

## Troubleshooting

### Service Won't Start

**Check logs:**
```bash
# PM2
pm2 logs --err

# Docker
docker compose logs --tail=50
```

**Common issues:**
- Port already in use
- Missing environment variables
- Database connection failed
- Insufficient permissions

### Database Connection Errors

**Check PostgreSQL:**
```bash
# Test connection
docker compose exec postgres pg_isready

# Check logs
docker compose logs postgres

# Verify credentials in .env
```

**Forum service:**
```bash
# Check forum logs
docker compose logs forum

# Verify database exists
docker compose exec postgres psql -U forum_user -l
```

### High Memory Usage

```bash
# Check process memory
pm2 list

# Restart service
pm2 restart aibot

# Or with Docker
docker compose restart aibot

# Adjust memory limits in ecosystem.config.js
max_memory_restart: '1G'
```

### Rate Limiting Issues

**Adjust limits in .env:**
```bash
RATE_LIMIT_WINDOW_MS=900000     # Increase window
RATE_LIMIT_MAX_REQUESTS=200     # Increase limit
```

**Clear rate limit cache:**
```bash
# Redis
docker compose exec redis redis-cli FLUSHDB
```

### Port Conflicts

**Find process using port:**
```bash
lsof -i :3002
# or
netstat -tulpn | grep 3002
```

**Kill process:**
```bash
kill -9 <PID>
```

### Reset Everything

```bash
# Stop all services
pm2 stop all
pm2 delete all

# Or with Docker
docker compose down -v

# Clear data
rm -rf data/*
rm -rf logs/*

# Reinstall
npm run setup
```

---

## Backup and Restore

### Backup

```bash
# Backup data directory
tar -czf backup-data-$(date +%Y%m%d).tar.gz data/

# Backup PostgreSQL
docker compose exec postgres pg_dump -U forum_user forum > backup-forum-$(date +%Y%m%d).sql

# Backup environment
cp .env .env.backup
```

### Restore

```bash
# Restore data
tar -xzf backup-data-20240101.tar.gz

# Restore PostgreSQL
docker compose exec -T postgres psql -U forum_user forum < backup-forum-20240101.sql
```

---

## Scaling

### Horizontal Scaling

**PM2 Cluster Mode:**
```javascript
// ecosystem.config.js
{
  instances: 4,  // or "max" for all CPUs
  exec_mode: 'cluster'
}
```

**Docker Swarm:**
```bash
docker swarm init
docker stack deploy -c docker-compose.yml svs-mcp
docker service scale svs-mcp_aibot=3
```

### Load Balancing

Use Nginx or HAProxy for load balancing multiple instances.

---

## Support

- **Documentation:** [README.md](README.md)
- **API Docs:** [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Issues:** https://github.com/web3-ai-game/svs-mcp/issues

---

## License

MIT
