# 快速部署指南

## 本地开发

1. 安装依赖
```bash
npm install
```

2. 启动开发服务器（已配置.env.local）
```bash
npm run dev
```

访问: http://localhost:3000

## VPS自动部署

1. 在GitHub仓库 Settings → Secrets 添加:
   - `SSH_PRIVATE_KEY`: 你的SSH私钥（本地 `cat ~/.ssh/id_ed25519` 内容）
   - `SSH_USER`: VPS用户名（通常是 `root`）
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. 初始化VPS（仅第一次，详见VPS_SETUP.md）

3. 部署
```bash
git push origin main
```

自动构建并部署到 https://deepweay.me

## 数据库

TablePlus连接Supabase:
- Host: qhgdymgxcbyhtxezvoqt.supabase.co
- Port: 5432
- User: postgres
- Password: （从Supabase获取）
- Database: postgres
