# 🧪 SVS-MCP 测试指南

完整的测试配置和API密钥获取指南。

## 快速开始测试

### 步骤 1: 配置环境

```bash
# 复制测试配置模板
cp .env.test.example .env

# 编辑配置文件
nano .env  # 或使用你喜欢的编辑器
```

### 步骤 2: 获取测试用 API 密钥

你只需要**至少一个** AI API 密钥：

#### 选项 A: OpenAI (推荐新手)

1. **访问**: https://platform.openai.com/api-keys
2. **注册/登录**: 使用Google账号或邮箱
3. **创建密钥**: 点击 "Create new secret key"
4. **复制密钥**: 格式像 `sk-proj-abc123...`
5. **免费额度**: 新用户有 $5 免费测试额度

**配置示例:**
```env
OPENAI_API_KEY=sk-proj-你的密钥
AI_MODEL=gpt-4o-mini  # 最便宜的模型
```

#### 选项 B: Anthropic Claude

1. **访问**: https://console.anthropic.com/settings/keys
2. **注册/登录**: 创建账号
3. **创建密钥**: 点击 "Create Key"
4. **复制密钥**: 格式像 `sk-ant-api03-abc123...`

**配置示例:**
```env
ANTHROPIC_API_KEY=sk-ant-api03-你的密钥
AI_MODEL=claude-3-haiku-20240307
```

### 步骤 3: 设置测试密钥

**最简配置** (只测试AI功能):
```env
# 只需填这一个!
OPENAI_API_KEY=sk-proj-你的真实密钥

# 其他保持默认即可
JWT_SECRET=a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
SESSION_SECRET=b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3
POSTGRES_PASSWORD=TestPassword123!
```

### 步骤 4: 启动服务

```bash
# 使用 Docker (推荐)
npm run docker:up

# 或使用 PM2
npm run dev
```

### 步骤 5: 验证服务

```bash
# 检查所有服务
npm run health-check

# 应该看到:
# ✓ Knowledge Base... Healthy
# ✓ AI Bot... Healthy  
# ✓ AI Tools... Healthy
# ✓ Forum... Healthy
```

## API 测试示例

### 1. 测试 AI 聊天

```bash
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "你好！请介绍一下你自己。"}
    ],
    "provider": "openai"
  }'
```

**预期响应:**
```json
{
  "content": "你好！我是一个AI助手...",
  "model": "gpt-4o-mini",
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 50,
    "total_tokens": 70
  }
}
```

### 2. 测试文本摘要

```bash
curl -X POST http://localhost:3003/api/tools/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "text": "人工智能（AI）是计算机科学的一个分支，致力于创建能够执行通常需要人类智能的任务的系统。这包括学习、推理、问题解决、感知和语言理解。近年来，深度学习和神经网络的进步推动了AI技术的快速发展。",
    "max_length": 50,
    "style": "bullet_points"
  }'
```

### 3. 测试论坛注册

```bash
curl -X POST http://localhost:3004/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

### 4. 测试论坛登录

```bash
curl -X POST http://localhost:3004/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123"
  }'
```

保存返回的 token 用于后续请求。

### 5. 创建话题 (需要 token)

```bash
TOKEN="你的JWT令牌"

curl -X POST http://localhost:3004/api/topics \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "我的第一个话题",
    "description": "这是测试话题"
  }'
```

## 成本估算

### OpenAI 测试成本

**使用 gpt-4o-mini (最便宜):**

| 操作 | Tokens | 成本 | $5可用次数 |
|------|--------|------|-----------|
| 简单对话 | ~100 | $0.00008 | ~62,500次 |
| 文本摘要 | ~500 | $0.0004 | ~12,500次 |
| 代码分析 | ~1000 | $0.0008 | ~6,250次 |

**使用 gpt-4o:**
- 约为 gpt-4o-mini 的 20-30 倍成本
- 适合需要高质量输出的场景

### Anthropic 测试成本

**使用 claude-3-haiku (最便宜):**

| 操作 | Tokens | 成本 | 示例 |
|------|--------|------|------|
| 简单对话 | ~100 | $0.00014 | 非常便宜 |
| 文本摘要 | ~500 | $0.0007 | 很实惠 |
| 长文本 | ~2000 | $0.0028 | 可接受 |

## 生成安全密钥

### 方法 1: 使用 OpenSSL (推荐)

```bash
# 生成 JWT Secret
openssl rand -hex 32

# 生成 Session Secret  
openssl rand -hex 32
```

### 方法 2: 使用 Node.js

```javascript
// 在 Node.js REPL 中运行
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 方法 3: 在线生成

- https://randomkeygen.com/
- https://www.random.org/strings/

⚠️ **注意**: 生产环境必须使用随机生成的强密钥！

## 测试检查清单

- [ ] 已配置 API 密钥 (OpenAI 或 Anthropic)
- [ ] 已设置 JWT_SECRET 和 SESSION_SECRET
- [ ] 已设置数据库密码
- [ ] 服务已启动 (`npm run docker:up` 或 `npm run dev`)
- [ ] 健康检查通过 (`npm run health-check`)
- [ ] AI 聊天测试成功
- [ ] 论坛注册/登录测试成功
- [ ] 查看日志无错误

## 常见问题

### Q: 我需要付费才能测试吗？

**A:** OpenAI 新用户有 $5 免费额度，足够进行大量测试。使用 `gpt-4o-mini` 模型，这个额度可以测试数千次。

### Q: 可以同时配置两个 AI 提供商吗？

**A:** 可以！同时配置 OPENAI_API_KEY 和 ANTHROPIC_API_KEY，然后在 API 请求中指定 `provider` 参数选择使用哪个。

### Q: JWT_SECRET 必须是真实的吗？

**A:** 测试环境可以使用示例值，但生产环境**必须**使用随机生成的强密钥。

### Q: 如何监控 API 使用量？

**A:** 
- OpenAI: https://platform.openai.com/usage
- Anthropic: https://console.anthropic.com/settings/usage

### Q: 测试完成后如何清理？

```bash
# 停止服务
npm run docker:down

# 清理数据
rm -rf data/* logs/*

# 删除配置 (可选)
rm .env
```

## 安全最佳实践

### ✅ 应该做的

- 使用 `.env` 文件管理密钥
- 定期轮换 API 密钥
- 监控 API 使用量
- 为不同环境使用不同密钥
- 设置速率限制

### ❌ 不应该做的

- 提交 `.env` 文件到 Git
- 在代码中硬编码密钥
- 在公共场合分享密钥
- 在生产环境使用测试密钥
- 在日志中打印完整密钥

## 获取帮助

- **文档**: 查看 [README.md](README.md) 和 [API_DOCUMENTATION.md](API_DOCUMENTATION.md)
- **Issues**: https://github.com/web3-ai-game/svs-mcp/issues
- **讨论**: https://github.com/web3-ai-game/svs-mcp/discussions

---

**准备好了吗？开始测试！** 🚀

```bash
npm run setup        # 设置项目
cp .env.test.example .env  # 复制配置
nano .env            # 填入你的 API 密钥
npm run docker:up    # 启动服务
npm run health-check # 验证
```
