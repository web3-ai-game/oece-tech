# GitHub推送指南

## 推送前检查清单

### 1. 敏感信息检查 ⚠️

```bash
# 检查是否有敏感词
grep -r "VPN\|翻墙\|代理\|科学上网" --include="*.tsx" --include="*.ts" --include="*.md" .

# 确保所有敏感词已转换为黑话
```

### 2. 环境变量检查

```bash
# 确保.env文件在.gitignore中
cat .gitignore | grep .env

# 创建.env.example
cp .env .env.example
# 然后手动编辑，移除所有真实值
```

### 3. 清理不必要文件

```bash
# 删除开发文件
rm -rf .next node_modules
rm -rf database/*.db
rm -rf .DS_Store

# 清理日志
rm -rf *.log
```

---

## Git操作步骤

### 初始化仓库（如果还没有）

```bash
# 1. 初始化
git init

# 2. 添加远程仓库
git remote add origin https://github.com/YOUR_USERNAME/tech-room.git

# 3. 检查远程仓库
git remote -v
```

### 提交代码

```bash
# 1. 添加所有文件
git add .

# 2. 检查状态
git status

# 3. 提交
git commit -m "feat: 完整的OECE技术平台

- 实现匿名注册系统
- 高科技概念漂移黑话系统
- 广告收益积分模块  
- 实时VPN监控评测系统
- 友情链接导航
- Windows 98 UI风格
- 完整的知识库结构"

# 4. 推送到GitHub
git push -u origin main
```

---

## 仓库设置

### 1. 创建README

确保README.md包含：

- 项目简介（使用黑话）
- 技术栈
- 快速开始
- 部署指南链接

### 2. 添加.gitignore

```gitignore
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# database
/database/*.db
/database/*.db-shm
/database/*.db-wal
/database/backup/

# IDE
.idea/
*.swp
*.swo
*~

# VS Code settings (keep settings.json)
.vscode/*
!.vscode/settings.json
!.vscode/extensions.json

# logs
*.log
logs/

# temp files
tmp/
temp/
```

### 3. 创建分支策略

```bash
# 创建开发分支
git checkout -b develop

# 创建功能分支
git checkout -b feature/monitoring-system

# 合并到主分支
git checkout main
git merge develop
```

---

## GitHub Actions配置

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## 仓库安全设置

### 1. 启用安全功能

在GitHub仓库设置中：

- ✅ Enable Dependabot alerts
- ✅ Enable Dependabot security updates
- ✅ Enable Code scanning
- ✅ Enable Secret scanning

### 2. 添加Secrets

Settings → Secrets → Actions:

```text
VERCEL_TOKEN=xxx
DATABASE_URL=xxx
JWT_SECRET=xxx
GEMINI_FREE_KEY=xxx
```

### 3. 设置分支保护

Settings → Branches:

- 要求PR审查
- 要求状态检查通过
- 禁止强制推送
- 要求分支是最新的

---

## 项目文档结构

```text
tech-room/
├── README.md                      # 项目介绍
├── DEPLOYMENT-GUIDE.md            # 部署指南
├── GITHUB-PUSH-GUIDE.md          # 本文件
├── ADVANCED-BLACKHAT-SYSTEM.md   # 黑话系统文档
├── AD-POINTS-SYSTEM.md           # 积分系统文档
├── REALTIME-MONITORING-SYSTEM.md # 监控系统文档
├── docs/
│   ├── API.md                    # API文档
│   ├── DATABASE.md               # 数据库设计
│   └── SECURITY.md               # 安全指南
└── knowledge-base/                # 知识库内容
    ├── cryptography/              # 密码学教程
    ├── network-protocols/         # 网络协议
    ├── digital-nomad/            # 数字游民
    └── monetization/             # 技能变现
```

---

## 推送后任务

### 1. 验证部署

```bash
# 检查网站是否正常
curl https://oece.tech

# 检查API
curl https://oece.tech/api/health
```

### 2. 设置域名

如果使用Vercel:

```bash
vercel domains add oece.tech
```

### 3. 配置Analytics

添加隐私友好的分析（不要用Google Analytics）:

- Plausible
- Umami
- Matomo

### 4. 备份策略

设置自动备份:

```bash
# GitHub Actions定时备份数据库
# 每天凌晨3点
0 3 * * * /backup-script.sh
```

---

## 紧急回滚

如果出现问题:

```bash
# 查看提交历史
git log --oneline

# 回滚到上一个版本
git revert HEAD

# 或回滚到指定版本
git reset --hard <commit-hash>

# 强制推送（谨慎使用）
git push --force
```

---

## 最终检查

在推送前，确认：

```text
✅ 所有敏感词已替换为黑话
✅ 环境变量已移除或使用示例值
✅ 数据库文件已删除
✅ node_modules已删除
✅ .next构建文件已删除
✅ 所有API密钥已移除
✅ README文件已更新
✅ 部署文档已完成
```

---

## 推送命令汇总

```bash
# 一键推送脚本
#!/bin/bash

echo "🔍 检查敏感信息..."
if grep -r "VPN\|翻墙" --include="*.tsx" --include="*.ts" .; then
  echo "❌ 发现敏感词，请先处理"
  exit 1
fi

echo "🧹 清理文件..."
rm -rf .next node_modules database/*.db

echo "📝 提交代码..."
git add .
git commit -m "feat: OECE技术平台完整版本"

echo "🚀 推送到GitHub..."
git push origin main

echo "✅ 推送完成!"
```

保存为 `push.sh` 并执行:

```bash
chmod +x push.sh
./push.sh
```

---

**准备就绪！**

确认所有检查项后，即可安全推送到GitHub。记住：

1. **永远不要**在公开仓库中包含真实的API密钥
2. **始终使用**黑话系统替换敏感词
3. **定期备份**数据库和用户数据
4. **监控**服务器状态和安全日志

祝部署顺利！🚀
