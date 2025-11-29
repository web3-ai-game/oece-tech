# 🔐 环境变量安全配置指南

## ⚠️ 安全原则

1. **永远不要**将真实密钥提交到 Git
2. **永远不要**在 `.env.example` 中填写真实值
3. **使用 Doppler** 管理生产环境密钥
4. **本地开发**使用 `.env.local`（已在 .gitignore 中）

---

## 🚀 快速开始

### 方法 1: 从 Doppler 拉取（推荐）

```bash
# 1. 安装 Doppler CLI
# macOS
brew install dopplerhq/cli/doppler

# Linux
curl -Ls https://cli.doppler.com/install.sh | sh

# 2. 登录 Doppler
doppler login

# 3. 拉取环境变量
./scripts/setup-env.sh
```

### 方法 2: 手动配置

```bash
# 1. 复制模板
cp .env.example .env.local

# 2. 编辑文件，填入真实值
nano .env.local

# 3. 设置安全权限
chmod 600 .env.local
```

---

## 📋 必需的环境变量

### 核心服务（必须配置）

#### Firebase（7个）
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_DATABASE_URL=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

#### Gemini API Keys（至少1个，建议20个）
```bash
GEMINI_API_KEY_1=AIzaSy...
GEMINI_API_KEY_2=AIzaSy...
# ... 最多 20 个
```

#### Upstash Redis（限流系统）
```bash
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
```

#### Supabase（论坛数据库）
```bash
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 可选服务

#### Algolia（知识库搜索）
```bash
ALGOLIA_APP_ID=
ALGOLIA_SEARCH_API_KEY=
```

#### Telegram Bot
```bash
TELEGRAM_BOT_TOKEN=
```

---

## 🔄 同步到 Doppler

```bash
# 将本地 .env.local 同步到 Doppler
./scripts/sync-to-doppler.sh
```

---

## 🚦 部署环境配置

### Firebase Hosting

在 `apphosting.yaml` 中配置：

```yaml
env:
  - variable: GEMINI_API_KEY_1
    secret: GEMINI_API_KEY_1
  - variable: UPSTASH_REDIS_REST_URL
    secret: UPSTASH_REDIS_REST_URL
```

### Vercel（备选）

在 Vercel Dashboard 中设置环境变量，或使用 Vercel CLI：

```bash
vercel env add GEMINI_API_KEY_1
```

---

## 🔍 检查清单

开发前确保：

- [ ] `.env.local` 已创建且包含所有必需变量
- [ ] `.env.local` 不在 Git 追踪中（`git status` 看不到）
- [ ] Firebase 配置正确（7个变量）
- [ ] 至少有 1 个 Gemini API Key
- [ ] Upstash Redis 已配置（如需限流）
- [ ] Supabase 已配置（如需论坛功能）

---

## 🛡️ 安全最佳实践

### 开发环境
- ✅ 使用 `.env.local`
- ✅ 权限设为 600
- ✅ 定期轮换密钥

### 生产环境
- ✅ 使用 Doppler 或 GitHub Secrets
- ✅ 启用密钥自动轮换
- ✅ 监控异常使用
- ✅ 最小权限原则

### 禁止事项
- ❌ 提交 `.env.local` 到 Git
- ❌ 在代码中硬编码密钥
- ❌ 在 Discord/Slack 分享密钥
- ❌ 使用共享密钥（除非团队密钥）

---

## 🆘 常见问题

### Q: 如何获取 Gemini API Keys？

A: 访问 https://makersuite.google.com/app/apikey

### Q: `.env.local` 会被提交到 Git 吗？

A: 不会，已在 `.gitignore` 中排除（`.env*`）

### Q: 如何验证环境变量是否生效？

A: 运行 `npm run dev`，检查控制台是否有错误

### Q: Doppler Token 在哪里？

A: 在 Doppler Dashboard → Access Tokens

---

## 📚 相关文档

- [Doppler 文档](https://docs.doppler.com/)
- [Firebase 配置](https://firebase.google.com/docs/web/setup)
- [Gemini API](https://ai.google.dev/tutorials/setup)
- [Upstash Redis](https://docs.upstash.com/redis)
- [Supabase](https://supabase.com/docs)

---

**最后更新**: 2025-11-29
**维护者**: OECE.tech Team
