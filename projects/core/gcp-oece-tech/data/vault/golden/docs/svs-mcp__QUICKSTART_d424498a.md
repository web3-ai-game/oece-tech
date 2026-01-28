# 🚀 SVS-MCP Quick Start Guide

Get up and running with SVS-MCP in under 5 minutes!

## Prerequisites Check

```bash
node --version   # Should be >= 18.0.0
npm --version    # Should be >= 9.0.0
docker --version # Optional, >= 24.0
```

## Installation (3 Steps)

### Step 1: Clone and Setup

```bash
git clone https://github.com/web3-ai-game/svs-mcp.git
cd svs-mcp
npm run setup
```

### Step 2: Configure Environment

```bash
cp .env.example .env
nano .env  # or use your favorite editor
```

**Minimal required configuration:**
```env
# Add your API keys (at least one)
OPENAI_API_KEY=sk-your-openai-key-here
# OR
ANTHROPIC_API_KEY=sk-ant-your-anthropic-key-here

# Database password
POSTGRES_PASSWORD=changeme123

# Security secrets (generate with: openssl rand -hex 32)
JWT_SECRET=your-generated-secret-here
SESSION_SECRET=your-generated-secret-here
```

### Step 3: Start Services

**Option A: Docker (Recommended)**
```bash
npm run docker:up
```

**Option B: PM2 (Development)**
```bash
npm run dev
```

## Verify Installation

```bash
# Check all services are healthy
npm run health-check

# Expected output:
# ✓ Knowledge Base... Healthy
# ✓ AI Bot... Healthy
# ✓ AI Tools... Healthy
# ✓ Forum... Healthy
```

## Test the APIs

### 1. AI Chat (Port 3002)

```bash
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, who are you?"}
    ],
    "provider": "openai"
  }'
```

### 2. Text Summarization (Port 3003)

```bash
curl -X POST http://localhost:3003/api/tools/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your long text here...",
    "max_length": 100
  }'
```

### 3. Forum - Register User (Port 3004)

```bash
curl -X POST http://localhost:3004/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

### 4. Forum - Login

```bash
curl -X POST http://localhost:3004/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

Save the token from the response for authenticated requests.

### 5. Forum - Create Topic (Requires Auth)

```bash
curl -X POST http://localhost:3004/api/topics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Topic",
    "description": "This is a test topic"
  }'
```

## Monitoring

### Real-time Monitoring Dashboard

```bash
npm run monitor
```

### View Logs

**PM2:**
```bash
npm run logs
# or
pm2 logs aibot
```

**Docker:**
```bash
npm run docker:logs
# or
docker compose logs -f aibot
```

### Check Individual Services

```bash
curl http://localhost:3001/health  # Knowledge Base
curl http://localhost:3002/health  # AI Bot
curl http://localhost:3003/health  # AI Tools
curl http://localhost:3004/health  # Forum
```

## Common Commands

```bash
# Start services
npm run docker:up        # Docker
npm run dev              # PM2

# Stop services
npm run docker:down      # Docker
npm run stop             # PM2

# Restart services
npm run docker:restart   # Docker
npm run restart          # PM2

# Check status
npm run health-check     # Health check
npm run docker:ps        # Docker status
pm2 status               # PM2 status

# View logs
npm run docker:logs      # Docker logs
npm run logs             # PM2 logs

# Monitor
npm run monitor          # Real-time monitor
```

## Service Ports

- **3001** - Knowledge Base (MCP Server)
- **3002** - AI Bot (Chat API)
- **3003** - AI Tools (Utilities)
- **3004** - Forum (Community)
- **5432** - PostgreSQL (Database)
- **6379** - Redis (Cache)

## Stopping Services

**Docker:**
```bash
npm run docker:down
```

**PM2:**
```bash
npm run stop
# or delete all
pm2 delete all
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :3002

# Kill process
kill -9 <PID>
```

### Services Won't Start

```bash
# Check logs
npm run logs              # PM2
npm run docker:logs       # Docker

# Verify environment
cat .env | grep -v "^#" | grep -v "^$"

# Reset and restart
npm run docker:down && npm run docker:up
```

### Database Connection Error

```bash
# Check PostgreSQL is running
docker compose ps postgres

# Check credentials
grep POSTGRES .env
```

### Missing Dependencies

```bash
# Reinstall all
npm run install:all

# Or manually
cd services/knowledge-base && npm install
cd ../aibot && npm install
cd ../ai-tools && npm install
cd ../forum && npm install
```

## Next Steps

1. **Read the Documentation**
   - [README.md](README.md) - Main documentation
   - [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
   - [DEPLOYMENT.md](DEPLOYMENT.md) - Production guide

2. **Explore the APIs**
   - Test all endpoints
   - Try different AI models
   - Create forum topics and posts

3. **Customize Configuration**
   - Adjust rate limits
   - Configure CORS
   - Set log levels
   - Tune AI parameters

4. **Deploy to Production**
   - Follow [DEPLOYMENT.md](DEPLOYMENT.md)
   - Set up SSL/HTTPS
   - Configure domain
   - Enable monitoring

## Getting Help

- 📖 **Documentation**: Check the `/docs` folder
- 🐛 **Issues**: [GitHub Issues](https://github.com/web3-ai-game/svs-mcp/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/web3-ai-game/svs-mcp/discussions)
- 📧 **Email**: support@svs-mcp.com

## Success! 🎉

You now have a fully functional AI-powered microservices platform running!

**What you can do:**
- Chat with AI models (OpenAI, Anthropic)
- Process and analyze text
- Manage knowledge graphs
- Run a community forum
- Scale horizontally
- Deploy to production

Enjoy building with SVS-MCP! 🚀
