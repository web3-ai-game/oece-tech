# 🚀 MCP服务器配置指南

## 目录
- [简介](#简介)
- [快速开始](#快速开始)
- [可用MCP服务器](#可用mcp服务器)
- [配置说明](#配置说明)
- [使用示例](#使用示例)
- [故障排除](#故障排除)

## 简介

MCP（Model Context Protocol）服务器为AI助手提供了强大的扩展能力，让您的开发体验更加智能和高效。本项目配置了30+个MCP服务器，涵盖了开发、测试、部署等各个环节。

## 快速开始

### 1. 安装MCP服务器

```bash
# 赋予脚本执行权限
chmod +x scripts/setup-mcp.sh

# 运行安装脚本
./scripts/setup-mcp.sh

# 选择安装类型:
# 1) 快速安装 - 仅基础服务器
# 2) 标准安装 - 基础+开发工具
# 3) 完整安装 - 所有服务器
# 4) 自定义安装 - 选择需要的服务器
```

### 2. 配置环境变量

编辑 `.windsurf/.env.mcp` 文件，填入您的API密钥：

```bash
# 编辑环境变量
nano .windsurf/.env.mcp
```

### 3. 在Windsurf中启用MCP

1. 打开Windsurf设置
2. 导航到MCP配置
3. 导入 `.windsurf/mcp-enhanced.json`
4. 重启Windsurf

## 可用MCP服务器

### 🎯 核心服务器（已启用）

| 服务器名称 | 功能描述 | 状态 |
|-----------|---------|------|
| **sequential-thinking** | 顺序思考和逻辑推理 | ✅ 已启用 |
| **memory** | 持久化记忆存储 | ✅ 已启用 |
| **filesystem** | 文件系统操作 | ✅ 已启用 |
| **puppeteer** | 浏览器自动化测试 | ✅ 已启用 |
| **fetch** | HTTP请求和API测试 | ✅ 已启用 |
| **everything** | 综合工具集 | ✅ 已启用 |

### 🛠️ 开发工具

| 服务器名称 | 功能描述 | 状态 |
|-----------|---------|------|
| **git** | Git版本控制 | ✅ 已启用 |
| **playwright** | 端到端测试 | ✅ 已启用 |
| **docker** | Docker容器管理 | ✅ 已启用 |
| **kubernetes** | K8s编排 | ⚪ 可选 |

### 💾 数据库服务

| 服务器名称 | 功能描述 | 配置要求 |
|-----------|---------|---------|
| **sqlite** | 本地SQLite数据库 | 无需配置 |
| **postgres** | PostgreSQL数据库 | 需要DATABASE_URL |
| **mongodb** | MongoDB NoSQL | 需要MONGODB_URI |
| **redis** | Redis缓存 | 需要REDIS_URL |
| **elasticsearch** | 全文搜索 | 需要ELASTICSEARCH_URL |

### ☁️ 云服务集成

| 服务器名称 | 功能描述 | 配置要求 |
|-----------|---------|---------|
| **firebase** | Firebase后端服务 | PROJECT_ID, PRIVATE_KEY |
| **aws** | AWS云服务 | ACCESS_KEY, SECRET_KEY |
| **netlify** | Netlify静态部署 | NETLIFY_AUTH_TOKEN |
| **supabase** | Supabase后端 | SUPABASE_URL, ANON_KEY |

### 🔗 第三方服务

| 服务器名称 | 功能描述 | 配置要求 |
|-----------|---------|---------|
| **notion** | Notion文档同步 | NOTION_API_KEY |
| **github** | GitHub集成 | GITHUB_PERSONAL_ACCESS_TOKEN |
| **slack** | Slack通知 | SLACK_BOT_TOKEN |
| **jira** | Jira项目管理 | JIRA_HOST, EMAIL, API_TOKEN |
| **confluence** | Confluence文档 | CONFLUENCE_HOST, EMAIL, API_TOKEN |

### 💳 支付与通信

| 服务器名称 | 功能描述 | 配置要求 |
|-----------|---------|---------|
| **stripe** | Stripe支付 | STRIPE_API_KEY |
| **sendgrid** | 邮件发送 | SENDGRID_API_KEY |
| **twilio** | 短信服务 | TWILIO_ACCOUNT_SID, AUTH_TOKEN |

### 🤖 AI服务

| 服务器名称 | 功能描述 | 配置要求 |
|-----------|---------|---------|
| **openai** | OpenAI API | OPENAI_API_KEY |
| **anthropic** | Claude API | ANTHROPIC_API_KEY |

### 📊 监控服务

| 服务器名称 | 功能描述 | 配置要求 |
|-----------|---------|---------|
| **sentry** | 错误追踪 | SENTRY_DSN |
| **datadog** | APM监控 | DATADOG_API_KEY, APP_KEY |

## 配置说明

### 基础配置示例

```json
{
  "mcpServers": {
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"],
      "env": {
        "MEMORY_FILE_PATH": "/path/to/memory.json"
      },
      "disabled": false
    }
  }
}
```

### 环境变量配置

在 `.windsurf/.env.mcp` 中配置：

```env
# 数据库
DATABASE_URL=postgresql://user:pass@localhost:5432/hotel_db

# Firebase
FIREBASE_PROJECT_ID=hotel-inistel
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-admin@hotel-inistel.iam.gserviceaccount.com

# GitHub
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx

# Notion
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxx
```

## 使用示例

### 1. 使用Puppeteer进行UI测试

```javascript
// AI助手可以直接控制浏览器
// 示例: "请测试登录功能"
// AI会自动打开浏览器、填写表单、验证结果
```

### 2. 使用Git服务器管理版本

```bash
# AI助手可以执行Git操作
# 示例: "请创建一个新功能分支"
# AI会自动创建分支、提交代码、推送远程
```

### 3. 使用数据库服务器

```sql
-- AI助手可以直接操作数据库
-- 示例: "创建一个新的预订记录"
-- AI会自动生成并执行SQL
```

### 4. 使用Notion同步文档

```markdown
# AI助手可以读写Notion文档
# 示例: "将项目进度更新到Notion"
# AI会自动同步文档内容
```

## 高级功能

### 🔄 自动化工作流

结合多个MCP服务器创建强大的自动化工作流：

1. **开发流程自动化**
   - Git提交 → GitHub PR → Slack通知 → Jira更新

2. **部署流程自动化**
   - Docker构建 → 测试运行 → Vercel部署 → Sentry监控

3. **文档同步**
   - 代码注释 → Notion文档 → Confluence知识库

### 🎯 最佳实践

1. **按需启用**
   - 只启用需要的MCP服务器，避免资源浪费

2. **安全配置**
   - 使用环境变量管理敏感信息
   - 定期更新API密钥

3. **性能优化**
   - 合理配置缓存服务器（Redis）
   - 使用CDN加速静态资源

## 故障排除

### 常见问题

#### 1. MCP服务器无法启动

```bash
# 检查Node.js版本
node --version  # 需要 v14+

# 重新安装依赖
npm install -g @modelcontextprotocol/server-name
```

#### 2. 连接超时

```bash
# 检查网络连接
ping api.example.com

# 检查防火墙设置
sudo ufw status
```

#### 3. API密钥错误

```bash
# 验证环境变量
echo $API_KEY_NAME

# 检查配置文件
cat .windsurf/.env.mcp | grep API_KEY
```

### 调试命令

```bash
# 检查MCP服务器状态
./scripts/check-mcp.sh

# 查看日志
tail -f ~/.windsurf/logs/mcp.log

# 重启服务器
./scripts/stop-mcp.sh && ./scripts/start-mcp.sh
```

## 扩展开发

### 创建自定义MCP服务器

```javascript
// custom-mcp-server.js
import { Server } from '@modelcontextprotocol/sdk';

const server = new Server({
  name: 'hotel-custom',
  version: '1.0.0',
  description: '酒店管理系统专用MCP服务器'
});

server.setRequestHandler('booking.create', async (params) => {
  // 自定义预订逻辑
  return { success: true, bookingId: '12345' };
});

server.start();
```

### 集成到项目

```json
{
  "mcpServers": {
    "hotel-custom": {
      "command": "node",
      "args": ["./mcp/custom-mcp-server.js"],
      "env": {},
      "disabled": false
    }
  }
}
```

## 资源链接

- [MCP官方文档](https://modelcontextprotocol.org)
- [MCP服务器列表](https://github.com/modelcontextprotocol/servers)
- [Windsurf MCP集成](https://docs.windsurf.ai/mcp)
- [项目GitHub](https://github.com/yourusername/hotel-inistel)

## 支持与反馈

遇到问题或有建议？请通过以下方式联系：

- 📧 邮件: support@hotel-inistel.com
- 💬 Slack: #mcp-support
- 🐛 Issues: GitHub Issues

---

*最后更新: 2024年1月*
*版本: 1.0.0*
