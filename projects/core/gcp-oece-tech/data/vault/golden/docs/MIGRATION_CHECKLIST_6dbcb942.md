# 🚀 DeepWeay VPS Migration & Verification Checklist

> **Migration Date**: [填入日期]  
> **VPS**: DigitalOcean SFO2 (165.227.50.171)  
> **Reserved IP**: 134.209.142.24  
> **Domain**: deepweay.me

---

## 📋 Pre-Migration Setup

### 1. DNS Configuration
- [ ] Update A record: `deepweay.me` → `134.209.142.24`
- [ ] Update A record: `www.deepweay.me` → `134.209.142.24`
- [ ] Wait for DNS propagation (check: `dig +short deepweay.me`)
- [ ] TTL reduced to 300s (5 minutes) before migration

### 2. Environment Variables
- [ ] Copy `.env.production.template` to `.env.production`
- [ ] Fill in `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Fill in `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Fill in `GOOGLE_GENAI_API_KEY`
- [ ] Fill in `TELEGRAM_BOT_TOKEN_1`
- [ ] Fill in `TELEGRAM_BOT_TOKEN_2`
- [ ] Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- [ ] Verify `NEXT_PUBLIC_SITE_URL=https://deepweay.me`

### 3. Server Prerequisites
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install docker-compose
sudo apt install docker-compose -y

# Verify installations
docker --version
docker-compose --version

# Clone repository
cd /root
git clone https://github.com/web3-ai-game/studio.git
cd studio
```

---

## 🐳 Docker Deployment

### 4. Initial Deployment
- [ ] Run deployment script: `chmod +x vps-scripts/docker-deploy.sh`
- [ ] Execute: `./vps-scripts/docker-deploy.sh`
- [ ] Verify SSL certificate obtained successfully
- [ ] Check all containers running: `docker-compose ps`

### 5. Container Health
- [ ] **deepweay-nginx**: `healthy` status
- [ ] **deepweay-web**: `healthy` status
- [ ] **deepweay-tg-bot-1**: `running` status
- [ ] **deepweay-tg-bot-2**: `running` status
- [ ] **deepweay-datadog**: `running` status

```bash
# Check health
docker-compose ps

# View logs
docker-compose logs -f
```

---

## ✅ Functionality Verification

### 6. Authentication System
#### Login Flow
- [ ] Visit `https://deepweay.me/login`
- [ ] Test existing user login
  - Email: [test account]
  - Password: [test password]
- [ ] Verify redirect to `/dashboard` after login
- [ ] Check user info displays correctly in Header

#### Registration Flow
- [ ] Click "CREATE_ACCOUNT" button
- [ ] Fill registration form:
  - Username: `TestDiver2024`
  - Email: `test@example.com`
  - Password: `password123`
  - Invite Code: `WELCOME2024`
- [ ] Verify success toast notification
- [ ] Check user receives 2 invite codes automatically
- [ ] Test login with new account

#### Invite Code System
- [ ] Generate new invite code from dashboard
- [ ] Copy and use code for another registration
- [ ] Verify `invites_remaining` decrements
- [ ] Test PRO user gets extra invite code

**Issues Found**:
```
[记录遇到的问题]
```

---

### 7. AI Tools Collection (PRO Only)
- [ ] Navigate to `/ai-tools`
- [ ] Verify PRO-only gate for Guest users
- [ ] Test with PRO account access
- [ ] Check all 6 AI tools load correctly:
  1. [ ] Visa Assistant
  2. [ ] Cost Calculator
  3. [ ] Trip Planner
  4. [ ] Community Finder
  5. [ ] Language Helper
  6. [ ] Document Translator

#### Gemini API Integration
- [ ] Test an AI tool (e.g., Visa Assistant)
- [ ] Verify API response within 5 seconds
- [ ] Check rate limiting works (Flash: 2K/day)
- [ ] Test error handling (invalid input)

**Issues Found**:
```
[记录遇到的问题]
```

---

### 8. BBS Forum Functionality
#### Post Listing
- [ ] Navigate to `/bbs`
- [ ] Verify posts load correctly
- [ ] Check pagination works (if >20 posts)
- [ ] Test pinned posts appear first

#### Create Post
- [ ] Click "New Post" button
- [ ] Fill title and content
- [ ] Submit post successfully
- [ ] Verify post appears in list
- [ ] Check author name displays correctly

#### Reply System
- [ ] Click on a post to view details
- [ ] Add a reply
- [ ] Test nested replies (reply to reply)
- [ ] Verify `reply_count` increments

#### Supabase RLS
- [ ] Test as Guest user (should fail to post)
- [ ] Test as Free member (should succeed)
- [ ] Test delete own post
- [ ] Test delete others' post (should fail)

**Issues Found**:
```
[记录遇到的问题]
```

---

### 9. Telegram Bot Integration
#### Bot 1: svsinst_bot (小爱同学)
- [ ] Send `/start` to bot
- [ ] Verify welcome message
- [ ] Test user verification flow
- [ ] Check PRO-only commands gated

#### Bot 2: svslovea_bot (备用)
- [ ] Same tests as Bot 1
- [ ] Verify both bots don't conflict

**Issues Found**:
```
[记录遇到的问题]
```

---

### 10. Performance & Monitoring
#### Load Testing
- [ ] Test homepage load time < 2s
- [ ] Test dashboard load time < 1.5s
- [ ] Check Core Web Vitals:
  - LCP < 2.5s
  - FID < 100ms
  - CLS < 0.1

#### Datadog Monitoring
- [ ] Login to Datadog dashboard
- [ ] Verify `deepweay-vps-production` host appears
- [ ] Check container metrics visible
- [ ] Test log collection from all services
- [ ] Set up alerts:
  - Container down alert
  - High CPU usage (>80%)
  - High memory usage (>6GB)
  - Error rate spike

**Datadog Dashboard**: https://app.datadoghq.com

---

### 11. Security Verification
#### SSL/TLS
- [ ] Visit `https://deepweay.me`
- [ ] Verify green lock icon in browser
- [ ] Check certificate validity
- [ ] Test HTTP→HTTPS redirect
- [ ] Run SSL test: https://www.ssllabs.com/ssltest/

#### Headers
```bash
curl -I https://deepweay.me
```
- [ ] Verify `X-Frame-Options: SAMEORIGIN`
- [ ] Verify `X-Content-Type-Options: nosniff`
- [ ] Verify `X-XSS-Protection: 1; mode=block`
- [ ] Verify `Referrer-Policy` set

#### Rate Limiting
```bash
# Test API rate limit (10 req/s)
for i in {1..15}; do curl https://deepweay.me/api/test; done
```
- [ ] Verify 429 status after limit

---

### 12. Mobile Responsiveness
- [ ] Test on iPhone (375px viewport)
- [ ] Test on Android (360px viewport)
- [ ] Verify navigation menu works
- [ ] Check touch interactions
- [ ] Test landscape orientation

---

## 🔄 Continuous Operations

### 13. Auto-deployment Setup
- [ ] Configure GitHub Actions (if needed)
- [ ] Test `git push` triggers deployment
- [ ] Verify rollback mechanism works

### 14. Backup Strategy
- [ ] Supabase auto-backup enabled
- [ ] Docker volumes backed up
- [ ] SSL certificates backed up
- [ ] `.env.production` stored securely (not in git!)

### 15. SSL Renewal (Auto)
```bash
# Add to crontab for auto-renewal
0 0 1 * * docker-compose run --rm nginx certbot renew
```
- [ ] Certbot renewal cron job set
- [ ] Test renewal: `docker-compose run --rm nginx certbot renew --dry-run`

---

## 📊 Post-Migration Report

### Performance Metrics
- **Homepage Load Time**: ____s
- **Dashboard Load Time**: ____s
- **API Response Time**: ____ms
- **LCP**: ____s
- **Docker Build Time**: ____min

### Issues Summary
| Issue | Severity | Status | Notes |
|-------|----------|--------|-------|
| [问题1] | High/Medium/Low | Open/Resolved | [备注] |

### Next Steps
1. [ ] Monitor for 24 hours
2. [ ] Gather user feedback
3. [ ] Optimize slow queries (if any)
4. [ ] Plan feature development:
   - [ ] Complete AI tools collection
   - [ ] Expand BBS functionality
   - [ ] Add payment integration (PRO subscription)

---

## 🆘 Troubleshooting

### Common Issues

**Container won't start**
```bash
docker-compose logs [container_name]
docker-compose restart [container_name]
```

**SSL certificate failed**
```bash
# Check DNS
dig +short deepweay.me

# Manual certificate
docker-compose run --rm nginx certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  -d deepweay.me -d www.deepweay.me
```

**Database connection failed**
```bash
# Test from container
docker-compose exec web node test-supabase.js
```

**Nginx 502 Bad Gateway**
```bash
# Check Next.js is running
docker-compose ps web
docker-compose logs web

# Restart web service
docker-compose restart web
```

---

## ✅ Migration Sign-off

- [ ] All checklist items completed
- [ ] No critical issues remaining
- [ ] Performance acceptable
- [ ] Monitoring active
- [ ] Team notified

**Signed by**: _______________  
**Date**: _______________  
**Time to production**: _______________

---

**Last Updated**: 2025-11-06  
**Version**: 1.0.0  
**Status**: Ready for deployment
