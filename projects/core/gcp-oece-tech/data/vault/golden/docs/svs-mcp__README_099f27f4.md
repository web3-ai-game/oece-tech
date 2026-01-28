# SVS-MCP - AI-Powered Web3 Knowledge Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-%3E%3D24.0-blue)](https://www.docker.com/)

SVS-MCP is a comprehensive microservices platform featuring knowledge base, AI bot, AI tools, and forum services. Built with modern technologies and designed for scalability, it provides a complete solution for AI-powered knowledge management and community interaction.

## Architecture

```
svs-mcp/
├── services/
│   ├── knowledge-base/     # MCP Knowledge Base Server
│   ├── aibot/             # Containerized AI Bot Service
│   ├── ai-tools/          # AI Tools & Utilities
│   └── forum/             # Containerized Forum Platform
├── shared/                # Shared libraries and utilities
├── docker-compose.yml     # Container orchestration
├── ecosystem.config.js    # PM2 process management
└── README.md
```

## Services

### 1. Knowledge Base (MCP Server)
- Model Context Protocol (MCP) server
- Knowledge graph storage and retrieval
- Vector embeddings for semantic search
- Port: 3001

### 2. AI Bot
- Containerized AI agent
- Multi-model support
- Context-aware conversations
- Port: 3002

### 3. AI Tools
- AI utility services
- Text generation, summarization
- Code analysis and generation
- Port: 3003

### 4. Forum
- Containerized forum platform
- User authentication
- Topic management
- Port: 3004

## Features

- **🧠 Knowledge Base (MCP Server)**: Model Context Protocol server with knowledge graph storage
- **🤖 AI Bot Service**: Multi-model AI chat with OpenAI and Anthropic support
- **🛠️ AI Tools**: Text processing, summarization, translation, and code analysis
- **💬 Forum Platform**: Full-featured community forum with authentication
- **📦 Shared Utilities**: Reusable logging, validation, caching, and error handling
- **🐳 Docker Support**: Containerized deployment with Docker Compose
- **⚡ PM2 Support**: Process management for Node.js applications
- **📊 Monitoring**: Built-in health checks and real-time monitoring
- **🔒 Security**: JWT authentication, rate limiting, input validation

## Quick Start

### Automated Setup (Recommended)

```bash
# Clone repository
git clone https://github.com/web3-ai-game/svs-mcp.git
cd svs-mcp

# Run automated setup
npm run setup

# Configure environment
cp .env.example .env
# Edit .env with your configuration

# Start services (choose one)
npm run docker:up      # Docker (recommended)
# or
npm run dev            # PM2 (development)

# Check health
npm run health-check
```

### Using Docker Compose

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Check status
docker compose ps

# Stop all services
docker compose down
```

### Using PM2 (Development)

```bash
# Install dependencies
npm install
npm run install:all

# Start all services
pm2 start ecosystem.config.js --env development

# Monitor
pm2 monit

# View logs
pm2 logs

# Stop all
pm2 stop all
```

## Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Docker >= 24.x
- Docker Compose >= 2.x
- PM2 (for non-containerized deployment)

## Environment Variables

Create a `.env` file in the root directory:

```env
# Common
NODE_ENV=production
LOG_LEVEL=info

# Knowledge Base
KB_PORT=3001
KB_DB_PATH=./data/knowledge.db

# AI Bot
AIBOT_PORT=3002
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_anthropic_key

# AI Tools
AI_TOOLS_PORT=3003

# Forum
FORUM_PORT=3004
FORUM_DB_HOST=postgres
FORUM_DB_PORT=5432
FORUM_DB_NAME=forum
FORUM_DB_USER=forum_user
FORUM_DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
```

## Available Scripts

```bash
# Setup and Installation
npm run setup              # Automated setup with dependencies
npm run install:all        # Install all service dependencies

# Development
npm run dev                # Start in development mode (PM2)
npm start                  # Start in production mode (PM2)
npm run stop               # Stop all services
npm run restart            # Restart all services

# Docker
npm run docker:up          # Start services with Docker
npm run docker:down        # Stop services
npm run docker:build       # Build Docker images
npm run docker:logs        # View logs
npm run docker:ps          # Check service status

# Monitoring
npm run health-check       # Check service health
npm run monitor            # Real-time monitoring
npm run logs               # View PM2 logs
npm run monit              # PM2 monitor

# Testing
npm test                   # Run tests
```

## Development

```bash
# Clone and setup
git clone https://github.com/web3-ai-game/svs-mcp.git
cd svs-mcp
npm run setup

# Start development
npm run dev

# Make changes and test
npm run health-check

# View logs
npm run logs

# Build Docker images
docker compose build
```

## Production Deployment

```bash
# Build and start in production mode
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Enable PM2 startup
pm2 startup
pm2 save
```

## Monitoring

### Health Checks

```bash
# Quick health check
npm run health-check

# Continuous monitoring
npm run monitor

# Individual service checks
curl http://localhost:3001/health  # Knowledge Base
curl http://localhost:3002/health  # AI Bot
curl http://localhost:3003/health  # AI Tools
curl http://localhost:3004/health  # Forum
```

### Logs

**PM2:**
```bash
pm2 logs              # All services
pm2 logs aibot        # Specific service
pm2 logs --err        # Errors only
```

**Docker:**
```bash
docker compose logs -f              # All services
docker compose logs -f aibot        # Specific service
docker compose logs --tail=100      # Last 100 lines
```

### Performance

```bash
# PM2 monitoring
pm2 monit

# Docker stats
docker stats

# System resources
htop
```

## API Documentation

Complete API documentation is available in [API_DOCUMENTATION.md](API_DOCUMENTATION.md).

### Quick API Examples

**AI Chat:**
```bash
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

**Forum - Register:**
```bash
curl -X POST http://localhost:3004/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"user","email":"user@example.com","password":"password123"}'
```

**Knowledge Base - Search:**
```bash
# Use MCP tools (stdio-based)
```

## Shared Utilities

The platform includes a comprehensive shared utilities library:

- **Logger**: Winston-based logging with file rotation
- **Validators**: Input validation and sanitization
- **Errors**: Custom error classes and handling
- **Cache**: Redis-based caching manager
- **Utils**: Common utility functions

See [shared/README.md](shared/README.md) for detailed documentation.

## Deployment

For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Production Deployment

```bash
# Using Docker
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Using PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## Security

- **Authentication**: JWT-based authentication for forum
- **Rate Limiting**: Configurable rate limiting on all APIs
- **Input Validation**: Comprehensive input validation
- **CORS**: Configurable CORS policies
- **Environment Variables**: Secure credential management

⚠️ **Important**: Change default secrets in production!

```bash
# Generate secure secrets
openssl rand -hex 32  # For JWT_SECRET
openssl rand -hex 32  # For SESSION_SECRET
```

## Troubleshooting

### Services won't start
```bash
# Check logs
npm run logs  # PM2
docker compose logs  # Docker

# Check ports
lsof -i :3001-3004

# Reset services
pm2 delete all && pm2 start ecosystem.config.js
```

### Database connection errors
```bash
# Verify PostgreSQL
docker compose logs postgres

# Check credentials in .env
```

For more troubleshooting, see [DEPLOYMENT.md#troubleshooting](DEPLOYMENT.md#troubleshooting).

## Project Structure

```
svs-mcp/
├── services/              # Microservices
│   ├── knowledge-base/    # MCP Knowledge Base
│   ├── aibot/            # AI Bot Service
│   ├── ai-tools/         # AI Tools Service
│   └── forum/            # Forum Service
├── shared/               # Shared utilities
│   ├── logger.js         # Logging
│   ├── validators.js     # Validation
│   ├── errors.js         # Error handling
│   ├── cache.js          # Caching
│   └── utils.js          # Utilities
├── cyberpunk-app/        # Cyberpunk Next.js App
├── scripts/              # Utility scripts
├── data/                 # Data storage
├── logs/                 # Log files
├── docker-compose.yml    # Docker config
├── ecosystem.config.js   # PM2 config
└── README.md
```

## Technology Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (Forum), SQLite (Knowledge Base)
- **Cache**: Redis
- **AI**: OpenAI, Anthropic Claude
- **Process Manager**: PM2
- **Containerization**: Docker & Docker Compose
- **Frontend**: Next.js 14 (Cyberpunk App)

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Quick Contribution Guide

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Documentation

- [API Documentation](API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](DEPLOYMENT.md) - Production deployment
- [Contributing Guide](CONTRIBUTING.md) - Contribution guidelines
- [Shared Utilities](shared/README.md) - Shared library documentation
- [Cyberpunk App](cyberpunk-app/README.md) - Frontend application

## Support

- **Issues**: [GitHub Issues](https://github.com/web3-ai-game/svs-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/web3-ai-game/svs-mcp/discussions)
- **Email**: support@svs-mcp.com

## Roadmap

- [ ] GraphQL API Gateway
- [ ] WebSocket support for real-time features
- [ ] Enhanced knowledge graph visualization
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile applications
- [ ] Kubernetes deployment configs

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenAI for GPT models
- Anthropic for Claude models
- The open-source community

---

**Made with ❤️ by web3-ai-game**
