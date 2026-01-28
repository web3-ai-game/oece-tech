# 🔐 SMS-Key 项目 - GCP & Doppler 集成

> 一个安全的环境变量和 API 密钥管理系统，实现本地开发到 GCP 生产环境的无缝部署

## 📋 项目概述

此项目用于管理：
- **API 密钥** - Gemini, OpenRouter, xAI 等 36+ 个 AI 模型密钥
- **数据库凭证** - Supabase, MongoDB, Redis 等
- **第三方服务** - GitHub, Telegram, Doppler 等
- **环境配置** - Dev, Staging, Production 三套环境

**核心特点**：
✅ 本地无缝加载（无需手动切换）  
✅ IDE 集成（VS Code + Windsurf）  
✅ SSH 直连 GCP  
✅ GitHub Private 仓库备份  
✅ 自动 CI/CD 部署  

## 🚀 快速开始

### 1. 克隆仓库

```bash
git clone git@github.com:your-username/sms-key.git
cd sms-key
```

### 2. 加载环境变量

```bash
# 自动加载（推荐）
source setup_env.sh

# 或手动加载
source .env.doppler

# 测试连接
doppler_test
```

### 3. VS Code 集成

```bash
# 安装扩展
code --install-extension ms-vscode-remote.remote-ssh

# 打开工作区
code sms-key.code-workspace
```

## 📁 文件结构

```
sms-key/
├── .env.doppler          # 📌 Doppler 配置 + 核心密钥
├── .env.example          # 🔧 环境变量模板
├── .gitignore            # 🔒 保护敏感文件
├── .ssh/                 # 🔑 SSH 密钥（已迁移）
├── setup_env.sh          # ⚙️ 环境加载脚本
├── setup_ide.sh          # 🎨 IDE 配置脚本
├── deploy_to_gcp.sh      # 🚀 GCP 部署脚本
├── check_ssh.sh          # ✓ SSH 验证脚本
├── migrate_ssh.sh        # 🔄 SSH 迁移脚本
├── GCP_SSH_SETUP.md      # 📖 GCP 连接指南
├── API密钥明文备份_*.md   # 📋 完整密钥列表（本地）
└── README.md             # 📚 此文件
```

## 🔧 配置步骤

### 步骤 1：验证 SSH 连接

```bash
./check_ssh.sh
```

**预期输出**：
```
✓ SSH 目录存在
✓ Ed25519 私钥存在  
✓ SSH Agent 正在运行
✓ 私钥有效
```

### 步骤 2：设置 Doppler

```bash
# 1. 创建 .env.local（本地覆盖）
cat > .env.local << 'EOF'
export DOPPLER_TOKEN="AQ.Ab8RN6LioS7k0Ipycl6oKXFuhww6VTXuosXwgeS8VMpTyZUFcw"
export DOPPLER_PROJECT="deepway-mcp"
export DOPPLER_CONFIG="prd"
EOF

# 2. 加载配置
source .env.local
source .env.doppler

# 3. 测试
doppler_status
```

### 步骤 3：配置 IDE（VS Code）

```bash
./setup_ide.sh
```

这将自动配置：
- Remote SSH 扩展
- 环境变量自动加载
- 调试配置

### 步骤 4：连接 GCP

```bash
# 编辑 SSH 配置
cat >> ~/.ssh/config << 'EOF'
Host gcp-prod
    HostName <YOUR_GCP_VM_IP>
    User <YOUR_GCP_USER>
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes
EOF

# 测试连接
ssh -v gcp-prod

# 部署环境变量到 GCP
./deploy_to_gcp.sh
```

## 💾 环境变量来源

| 来源 | 优先级 | 位置 | 说明 |
|------|--------|------|------|
| `.env.local` | ⭐⭐⭐ | 本地机器 | 机器特定覆盖 |
| `.env.doppler` | ⭐⭐ | Git 跟踪 | 核心配置（不含敏感数据） |
| Doppler | ⭐ | 远程服务 | 云端备份 |
| 系统环境 | - | OS 全局 | 后备选项 |

## 🔑 新增 Doppler Key 信息

```
Key: AQ.Ab8RN6LioS7k0Ipycl6oKXFuhww6VTXuosXwgeS8VMpTyZUFcw
用途: 生产环境 (90天赠金 $100)
创建: 2025-11-26
有效期: 90 天
地位: 现在是主用 key
```

## 🎯 使用场景

### 场景 1：本地开发

```bash
# 1. 加载环境
source setup_env.sh

# 2. 启动本地开发服务器
npm run dev

# 所有 API 密钥自动可用
```

### 场景 2：连接到 GCP

```bash
# 1. SSH 连接
ssh gcp-prod

# 2. 环境变量已自动同步
echo $DOPPLER_TOKEN
echo $GEMINI_API_KEY

# 3. 部署应用
./deploy_to_gcp.sh
```

### 场景 3：测试新 Key

```bash
# 1. 测试 Gemini Key
export GEMINI_API_KEY="AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ"
doppler_prod curl -X POST https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent

# 2. 测试 OpenRouter
export OPENROUTER_API_KEY="sk-or-v1-d09b96..."
doppler_prod curl https://openrouter.ai/api/v1/models
```

## 🐛 故障排查

### 问题：找不到 SSH 密钥

```bash
# 解决方案
./migrate_ssh.sh svs.loline $(whoami)
ssh-add ~/.ssh/id_ed25519
```

### 问题：Doppler Token 无效

```bash
# 检查 token 格式
echo $DOPPLER_TOKEN

# 更新到新 key
export DOPPLER_TOKEN="AQ.Ab8RN6LioS7k0Ipycl6oKXFuhww6VTXuosXwgeS8VMpTyZUFcw"

# 测试
doppler_test
```

### 问题：GCP 连接拒绝

```bash
# 检查防火墙
gcloud compute firewall-rules list --filter="name~ssh"

# 检查公钥
gcloud compute instances describe <INSTANCE_NAME> --format='get(metadata.items.ssh-keys)'

# 手动添加公钥
gcloud compute instances add-metadata <INSTANCE_NAME> \
  --metadata-from-file ssh-keys=~/.ssh/authorized_keys.txt
```

## 📊 密钥管理

### 当前库存

| 类型 | 数量 | 状态 |
|------|------|------|
| Gemini Keys | 28 | ✅ 全部有效 |
| OpenRouter Keys | 1 | ✅ 有效 ($1,111 余额) |
| xAI Keys | 2 | ✅ 有效 |
| Doppler Keys | 1 ✨ | ✅ 新增 (90天) |
| 数据库 | 12 | ✅ 已验证 |
| 其他服务 | 60+ | ✅ 已备份 |

### 密钥轮换计划

- **周期**: 每 30 天
- **流程**: Doppler 远程轮换 → 本地同步 → GCP 部署
- **通知**: 有效期 7 天时自动告警

## 🔐 安全最佳实践

1. **从不提交敏感文件**
   ```bash
   # .gitignore 会自动排除
   *.env
   .env.*
   ```

2. **本地覆盖敏感数据**
   ```bash
   echo ".env.local" >> .gitignore
   ```

3. **定期审查提交**
   ```bash
   git log --all --oneline | head -10
   ```

4. **SSH 密钥权限**
   ```bash
   chmod 600 ~/.ssh/id_ed25519
   chmod 644 ~/.ssh/id_ed25519.pub
   ```

## 📚 相关文档

- [GCP SSH 设置指南](./GCP_SSH_SETUP.md)
- [SSH 迁移总结](./SSH_MIGRATION_SUMMARY.md)
- [完整 API 密钥列表](./API密钥明文备份_20251118.md)（仅本地）

## 🤝 贡献指南

1. 创建特性分支
   ```bash
   git checkout -b feature/new-key
   ```

2. 提交更改
   ```bash
   git commit -m "feat: add new Doppler key for production"
   ```

3. 推送到 GitHub
   ```bash
   git push origin feature/new-key
   ```

4. 创建 Pull Request

## 📞 支持

有问题或需要帮助？

- 查看 [GCP_SSH_SETUP.md](./GCP_SSH_SETUP.md) 的故障排查部分
- 运行 `./check_ssh.sh` 进行诊断
- 检查日志: `doppler_test`

## 📄 许可证

⚠️ **PRIVATE REPOSITORY** - 仅限授权用户访问

---

**最后更新**: 2025-11-26  
**维护者**: deepweay  
**状态**: ✅ 生产就绪
