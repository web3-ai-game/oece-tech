# SSH 迁移完成 & GCP 连接计划

## ✅ 已完成的步骤

### 1. SSH 密钥迁移 
- ✓ 从 `svs.loline` 用户迁移 SSH 密钥到 `deepweay` 用户
- ✓ 私钥权限设置为 600
- ✓ 公钥权限设置为 644
- ✓ SSH 配置文件已复制
- ✓ Known hosts 已复制
- ✓ SSH Agent 正在运行

### 2. 验证和工具创建
- ✓ 所有 SSH 密钥验证成功
- ✓ `migrate_ssh.sh` - 为其他用户迁移 SSH 的脚本
- ✓ `check_ssh.sh` - 检查 SSH 配置状态的脚本
- ✓ `.env.example` - 环境变量模板
- ✓ `GCP_SSH_SETUP.md` - GCP 连接完整指南

## 📋 下一步：连接到 GCP

### 第一阶段：GCP 实例信息（已自动探测）

```bash
# ========== GCP 基础信息 ==========
GCP_VM_NAME="instance-20251123-140442"
GCP_INSTANCE_ID="7456749371435947654"
GCP_ZONE="asia-southeast1-b"
GCP_REGION="asia-southeast1"

# ========== 机器配置 ==========
MACHINE_TYPE="n2-standard-2"           # 2 vCPU, 8 GB RAM
CPU_PLATFORM="Intel Cascade Lake"
ARCHITECTURE="x86/64"

# ========== 网络配置 ==========
EXTERNAL_IP="35.198.200.211"           # 公网 IP (deepshit)
INTERNAL_IP="10.148.0.3"               # 内网 IP
NETWORK="default"
SUBNET="default"

# ========== 用户信息 ==========
GCP_VM_USER="svs-main-key"             # SSH 用户名
SSH_KEY_TYPE="ssh-ed25519"
SSH_KEY_FINGERPRINT="AAAAC3NzaC1lZDI1NTE5AAAAICYcxKQvNWkCcXYKZngPVXSYyk7RoK2g31Z5coi6Shqu"

# ========== 磁盘配置 ==========
BOOT_DISK="instance-20251123-140442"   # 30 GB SSD
DATA_DISK="svs-msm"                    # 100 GB 平衡永久磁盘

# ========== 防火墙规则 ==========
HTTP_ENABLED="true"                    # 80 端口开放
HTTPS_ENABLED="true"                   # 443 端口开放
NETWORK_TAGS="http-server https-server lb-health-check"

# ========== 服务账号 ==========
SERVICE_ACCOUNT="95048230206-compute@developer.gserviceaccount.com"
API_SCOPES="允许所有 Cloud API 的完整访问权"

# ========== 操作系统 ==========
OS_IMAGE="ubuntu-minimal-2404-noble-amd64-v20251120"
OS="Ubuntu 24.04 LTS"

# ========== 创建时间 ==========
CREATED_AT="2025-11-23 22:29:46 UTC"
```

### 第二阶段：配置 SSH 连接

一旦你提供信息，我将：

1. 获取 GCP VM 的公网 IP
2. 更新 `~/.ssh/config` 以包含 GCP 连接配置
3. 测试 SSH 连接
4. 配置 Doppler 环境变量集成（如需要）

### 第三阶段：设置环境变量桥接

```bash
# 在 GCP VM 上创建环境变量文件
# 从 Doppler 或明文配置中获取所有必需的变量
# 设置自动加载机制
```

## 📂 文件位置

所有相关文件都在: `/Volumes/128/sms-key/`

```
sms-key/
├── migrate_ssh.sh          # SSH 迁移脚本
├── check_ssh.sh            # SSH 验证脚本
├── .env.example            # 环境变量模板
├── GCP_SSH_SETUP.md        # GCP 连接指南
└── SSH_MIGRATION_SUMMARY.md # 本文件
```

## 🔧 快速命令参考

```bash
# 检查 SSH 状态
/Volumes/128/sms-key/check_ssh.sh

# 为另一个用户迁移 SSH
sudo /Volumes/128/sms-key/migrate_ssh.sh svs.loline <new_user>

# 查看当前 SSH 配置
cat ~/.ssh/config

# 测试特定主机连接
ssh -v gcp-server  # 假设已配置

# 启动 SSH Agent（如需要）
eval $(ssh-agent -s)

# 查看已加载的密钥
ssh-add -l

# 添加密钥到 Agent
ssh-add ~/.ssh/id_ed25519
```

## 💡 关键要点

1. **安全**: 私钥权限已正确设置为 600，不会被他人读取
2. **可访问性**: 当前用户 `deepweay` 可以使用完整的 SSH 功能
3. **扩展性**: 脚本可轻松迁移到其他用户账户
4. **配置已保留**: SSH config 中的所有现有配置都已保留

## ⚠️ 重要提示

- **不要**在版本控制中提交真实的 token 或凭证
- **始终**使用 `.env.local` 或 `.env.$(hostname)` 来覆盖敏感信息
- **定期**轮换 SSH 密钥和 API token
- **备份**你的 SSH 私钥到安全位置

## 📞 需要帮助？

如果遇到问题，请：

1. 运行 `/Volumes/128/sms-key/check_ssh.sh` 检查状态
2. 查看 `GCP_SSH_SETUP.md` 中的故障排查部分
3. 检查 SSH 日志: `ssh -v <host>`

---

**状态**: ✅ 已就绪，等待 GCP 连接信息
**最后更新**: 2025-11-26
