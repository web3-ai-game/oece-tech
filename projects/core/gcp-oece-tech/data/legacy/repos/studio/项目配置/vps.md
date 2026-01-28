# VPS部署与Windsurf账户切换完整指南

> **项目**: Urban Diver (DeepWeay)  
> **VPS策略**: DigitalOcean 摧毁+重建+固定IP  
> **最终配置**: 2vCPU 4GB RAM + 80GB系统盘 + 20GB外挂盘  
> **更新时间**: 2025-11-06

---

## 📍 当前VPS信息

### **IP配置**
- **固定IP (Reserved IP)**: `134.209.142.24` ← DNS已指向
- **VPS自带IP**: `165.227.50.171`
- **旧VPS IP**: `188.166.180.96` (已废弃)

### **域名解析**
- **主域名**: `deepweay.me` → `134.209.142.24`
- **DNS服务商**: Cloudflare (推荐) 或域名注册商
- **A记录**: `@` → `134.209.142.24`
- **CNAME**: `www` → `deepweay.me`

### **VPS规格演进**
```
开发阶段: 1vCPU 2GB + 50GB (可随时摧毁)
         ↓
测试阶段: 2vCPU 2GB + 60GB
         ↓
生产阶段: 2vCPU 4GB + 80GB系统盘 + 20GB外挂盘 (最终固定)
```

---

## 💾 外挂盘策略说明

### **为什么要20GB外挂盘？**

1. **数据持久化**
   - VPS摧毁后数据不丢失
   - 代码、数据库备份、配置文件独立存储
   - 快速迁移到新VPS

2. **多项目隔离**
   ```
   /mnt/external-ssd/
   ├── svs/
   │   ├── studio/          ← 当前项目 (DeepWeay)
   │   └── oece.tech/       ← 下一个项目
   ├── backups/
   │   ├── supabase/
   │   └── git-repos/
   └── configs/
       ├── nginx/
       └── ssl/
   ```

3. **开发流程**
   - 在外挂盘的 `/mnt/external-ssd/svs/studio` 开发
   - Git push后切换账户继续开发
   - VPS摧毁不影响代码

### **外挂盘挂载**
```bash
# 创建挂载点
sudo mkdir -p /mnt/external-ssd

# 格式化外挂盘 (仅首次)
sudo mkfs.ext4 /dev/sda

# 挂载
sudo mount /dev/sda /mnt/external-ssd

# 永久挂载 (添加到/etc/fstab)
echo '/dev/sda /mnt/external-ssd ext4 defaults 0 0' | sudo tee -a /etc/fstab

# 设置权限
sudo chown -R $USER:$USER /mnt/external-ssd
```

---

## 🚀 VPS摧毁+重建流程

### **步骤1: 保存外挂盘**
```bash
# 确保所有改动已push
cd /mnt/external-ssd/svs/studio
git add -A && git commit -m "backup before VPS destroy"
git push origin main

# 卸载外挂盘
sudo umount /mnt/external-ssd
```

### **步骤2: DigitalOcean操作**
1. 进入DO控制台
2. 选择当前Droplet → **Destroy**
3. 创建新Droplet:
   - **Image**: Ubuntu 22.04 LTS
   - **Size**: 根据开发阶段选择
   - **Datacenter**: Singapore (sgp1) 或 San Francisco (sfo3)
   - **Additional Options**: ✅ Reserved IP (选择 134.209.142.24)
   - **Add Volume**: 选择已有的20GB外挂盘

### **步骤3: 新VPS初始化**
```bash
# SSH登录新VPS
ssh root@134.209.142.24

# 挂载外挂盘
sudo mount /dev/sda /mnt/external-ssd
echo '/dev/sda /mnt/external-ssd ext4 defaults 0 0' | sudo tee -a /etc/fstab

# 安装基础环境
curl -fsSL https://get.docker.com | sh
sudo apt install -y git nodejs npm nginx certbot python3-certbot-nginx

# 进入项目
cd /mnt/external-ssd/svs/studio

# 拉取最新代码
git pull origin main

# 重新部署
npm install
npm run build
```

---

## 🔄 Windsurf账户切换指南

### **当前账户即将用完点数时**

#### **1. 导出配置到项目根目录** ✅
已完成！所有配置在 `/svs/studio/项目配置/`

```
项目配置/
├── vps.md                          ← 本文档
├── windsurf-rules-backup.md        ← .windsurf/rules/1.md备份
├── windsurf-global-rules.md        ← 全局规则备份
├── mcp-settings.json               ← MCP配置备份
└── 账户切换检查清单.md              ← 交接事项
```

#### **2. 新账户设置流程**

**Step 1: 安装Windsurf (新账户)**
```bash
# 下载最新版Windsurf
# https://www.codeium.com/windsurf
```

**Step 2: 克隆项目**
```bash
# 本地开发
git clone git@github.com:web3-ai-game/studio.git
cd studio

# VPS外挂盘开发
ssh root@134.209.142.24
cd /mnt/external-ssd/svs/studio
git pull
```

**Step 3: 导入配置**

1. **全局规则** (`Settings` → `Memories` → `Global Rules`)
   - 复制 `项目配置/windsurf-global-rules.md` 内容
   - 粘贴并保存

2. **项目规则** (`Settings` → `Memories` → `Project Rules`)
   - 复制 `项目配置/windsurf-rules-backup.md` 内容
   - 粘贴并保存

3. **MCP工具配置** (`Settings` → `MCP Servers`)
   - 复制 `项目配置/mcp-settings.json` 配置
   - 按以下顺序添加MCP服务器：

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/svs/studio"]
    },
    "github-mcp-server": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_你的新token"
      }
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-memory"]
    },
    "sequential-thinking": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sequential-thinking"]
    },
    "supabase-mcp-server": {
      "command": "npx",
      "args": ["-y", "@shinework/supabase-mcp-server"],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "你的Supabase token"
      }
    }
  }
}
```

**Step 4: 验证配置**
```bash
# 新账户Cascade对话测试
"请读取项目规则，确认当前项目名称和技术栈"
# 预期回答: Urban Diver, Next.js 15.5.6 + Supabase

"列出可用的MCP工具"
# 预期: filesystem, github, memory, sequential-thinking, supabase

"读取外挂盘路径并列出项目"
# 预期: /mnt/external-ssd/svs/studio, /mnt/external-ssd/svs/oece.tech
```

---

## 🔑 必需Token清单

### **新账户需要准备**

1. **GitHub Personal Access Token**
   - 权限: `repo`, `workflow`, `write:packages`
   - 获取: https://github.com/settings/tokens/new
   - 用途: MCP GitHub工具、Git push

2. **Supabase Access Token**
   - 项目: `qhgdymgxcbyhtxezvoqt`
   - 获取: Supabase Dashboard → Project Settings → API
   - 用途: MCP Supabase工具、数据库操作

3. **DigitalOcean API Token** (可选)
   - 获取: DO控制台 → API → Personal Access Tokens
   - 用途: 自动化VPS管理

4. **环境变量** (`.env.local`)
   ```bash
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://qhgdymgxcbyhtxezvoqt.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   SUPABASE_SERVICE_ROLE_KEY=eyJ...
   
   # Gemini AI
   GOOGLE_GENAI_API_KEY=AIza...
   
   # Site
   NEXT_PUBLIC_SITE_URL=https://deepweay.me
   ```

---

## 📦 项目状态快照 (2025-11-06)

### **已完成功能**
- ✅ 用户认证系统 (Supabase Auth + 邀请码)
- ✅ BBS论坛 (完整UI/UX + 管理员功能)
- ✅ Dashboard (用户统计 + BBS活动统计)
- ✅ 响应式布局 (移动端优化)
- ✅ 测试数据 (8篇帖子 + 多用户)
- ✅ 实时更新 (Supabase Realtime)

### **待开发功能**
- ⏳ AI工具页面 (Gemini 2.5集成)
- ⏳ 文章系统 (Markdown编辑器)
- ⏳ PRO会员订阅 (Stripe集成)
- ⏳ Telegram Bot集成
- ⏳ 数据分析面板 (Datadog)
- ⏳ 静态页面分离部署

### **数据库Schema**
- `users` (profiles, roles, invites)
- `invites` (邀请码管理)
- `articles` (文章内容)
- `bbs_posts` (论坛帖子)
- `bbs_replies` (帖子回复)
- `subscriptions` (订阅记录)

### **Git状态**
```bash
Branch: main
Remote: git@github.com:web3-ai-game/studio.git
Latest Commit: feat: Dashboard添加BBS论坛活动统计卡片 (803419a)
```

---

## 🎯 下一个项目: oece.tech

### **项目隔离策略**

```bash
# 外挂盘结构
/mnt/external-ssd/svs/
├── studio/              ← DeepWeay (当前)
│   ├── .windsurf/
│   ├── 项目配置/
│   └── ...
└── oece.tech/           ← 新项目
    ├── .windsurf/       ← 完全不同的规则
    ├── 项目配置/
    └── ...
```

### **切换工作流**
1. DeepWeay开发完一个阶段
2. Git push所有改动
3. `cd /mnt/external-ssd/svs/oece.tech`
4. 在Windsurf中打开新项目
5. 重新设置项目规则 (不复用DeepWeay规则)
6. 继续开发oece.tech

---

## 🔧 常用命令速查

### **VPS管理**
```bash
# 连接VPS
ssh root@134.209.142.24

# 查看外挂盘
df -h | grep external

# 进入项目
cd /mnt/external-ssd/svs/studio

# Git操作
git pull && npm install && npm run build
```

### **Docker容器**
```bash
# 查看运行容器
docker ps

# 启动所有服务
docker-compose up -d

# 查看日志
docker-compose logs -f web

# 重启服务
docker-compose restart
```

### **Nginx**
```bash
# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx

# 查看错误日志
sudo tail -f /var/log/nginx/error.log
```

### **SSL证书**
```bash
# 申请证书
sudo certbot --nginx -d deepweay.me -d www.deepweay.me

# 自动续期
sudo certbot renew --dry-run
```

---

## ⚠️ 注意事项

### **账户切换前必做**
1. ✅ Push所有代码到GitHub
2. ✅ 备份Supabase数据 (SQL导出)
3. ✅ 复制所有Token到密码管理器
4. ✅ 确认外挂盘数据完整
5. ✅ 记录当前开发进度

### **新账户首次启动**
1. ✅ 验证MCP工具可用
2. ✅ 测试Git push权限
3. ✅ 确认Supabase连接
4. ✅ 检查环境变量
5. ✅ 运行一次完整测试

### **VPS摧毁前检查**
1. ✅ 数据库已备份
2. ✅ 外挂盘已卸载
3. ✅ SSL证书已导出
4. ✅ Nginx配置已保存
5. ✅ 所有代码已push

---

## 📞 紧急联系

- **GitHub Repo**: https://github.com/web3-ai-game/studio
- **Supabase项目**: qhgdymgxcbyhtxezvoqt
- **DigitalOcean**: https://cloud.digitalocean.com
- **域名管理**: deepweay.me DNS控制台

---

**最后更新**: 2025-11-06  
**下次更新**: DeepWeay完整部署后或切换账户前
