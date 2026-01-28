# ⚡ 快速开始指南

## 📦 立即推送到 GitHub

```bash
# 给脚本执行权限
chmod +x push-to-github.sh

# 推送（自定义提交信息）
./push-to-github.sh "feat: 完成 GeekSEA 重构"

# 或使用默认提交信息
./push-to-github.sh
```

## 🚀 部署选项

### 选项 1: Cloudflare Pages（推荐 - 免费）

1. 推送代码到 GitHub
2. 访问 [Cloudflare Pages](https://pages.cloudflare.com/)
3. 连接 GitHub 仓库 `web3-ai-game/tech-room`
4. 构建设置：
   - Build command: `npm run build`
   - Build output: `dist`
5. 部署完成！

### 选项 2: DigitalOcean（$5/月）

```bash
# 在 DO Droplet 上运行
scp setup-remote-dev.sh root@YOUR_IP:~/
ssh root@YOUR_IP
./setup-remote-dev.sh
```

查看详细步骤：[DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)

### 选项 3: Vercel（免费）

```bash
npm i -g vercel
vercel --prod
```

## 📝 下一步

### 本地开发

```bash
# 1. 克隆（如果是新机器）
git clone https://github.com/web3-ai-game/tech-room.git
cd tech-room

# 2. 安装依赖
npm install

# 3. 启动开发
npm run dev

# 访问 http://localhost:4321
```

### 创建教程

```bash
# 使用脚本
npm run new:tutorial

# 手动创建
cd src/content/tutorials/zh-TW/vps
touch my-tutorial.md
```

### 迁移旧内容

```bash
# 运行迁移脚本
npm run migrate

# 查看迁移报告
cat migration-report.json
```

## 🔧 常用命令

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm run preview          # 预览生产版本

# 工具
npm run new:tutorial     # 创建新教程
npm run migrate          # 迁移内容
npm run optimize:images  # 优化图片

# 部署
./push-to-github.sh      # 推送到 GitHub
```

## 📂 项目结构速览

```
tech-room/
├── src/
│   ├── content/         # 📝 Markdown 教程
│   ├── components/      # 🧩 UI 组件
│   ├── pages/           # 📄 路由页面
│   └── layouts/         # 🎨 布局模板
├── public/              # 🖼️  静态资源
├── scripts/             # 🔧 工具脚本
└── astro.config.mjs     # ⚙️  配置文件
```

## 🎯 关键文件

| 文件 | 说明 |
|------|------|
| `README.md` | 项目介绍 |
| `DEPLOY-GUIDE.md` | 部署指南 |
| `GEEKSEA-REFACTOR-GUIDE.md` | 重构计划 |
| `setup-remote-dev.sh` | DO 远程环境 |
| `astro.config.mjs` | Astro 配置 |
| `src/content/config.ts` | 内容集合配置 |

## 🐛 遇到问题？

### 构建失败

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build
```

### 环境变量

创建 `.env` 文件：

```env
PUBLIC_SUPABASE_URL=https://xxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
PUBLIC_SITE_URL=https://your-domain.com
```

### 端口被占用

```bash
# 更改端口
npm run dev -- --port 3000
```

## 📞 获取帮助

- 📖 完整文档：[GEEKSEA-REFACTOR-GUIDE.md](./GEEKSEA-REFACTOR-GUIDE.md)
- 🚀 部署指南：[DEPLOY-GUIDE.md](./DEPLOY-GUIDE.md)
- 💬 GitHub Issues：[提交问题](https://github.com/web3-ai-game/tech-room/issues)

---

**准备好了？开始推送！** 🚀

```bash
./push-to-github.sh "feat: GeekSEA 教程平台上线"
```
