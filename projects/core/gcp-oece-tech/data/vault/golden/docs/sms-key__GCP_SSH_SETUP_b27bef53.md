# GCP SSH 连接设置指南

## 前置条件

1. **SSH 密钥已配置**（刚才已完成）
2. **已有 GCP 项目和 VM 实例**
3. **已将公钥添加到 GCP VM**

## 第一步：获取 GCP VM 信息

```bash
# 列出你的 GCP VM 实例
gcloud compute instances list

# 获取特定实例的外部 IP
gcloud compute instances describe YOUR_INSTANCE_NAME \
  --zone=YOUR_ZONE \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

## 第二步：配置本地 SSH 配置

编辑 `~/.ssh/config`，添加类似以下内容：

```
Host gcp-server
    HostName <YOUR_GCP_VM_EXTERNAL_IP>
    User <YOUR_USERNAME>
    IdentityFile ~/.ssh/id_ed25519
    StrictHostKeyChecking accept-new
    UserKnownHostsFile ~/.ssh/known_hosts
    AddKeysToAgent yes
```

## 第三步：测试连接

```bash
# 测试 SSH 连接
ssh gcp-server

# 或使用 -v 标志查看详细信息
ssh -v gcp-server
```

## 第四步：配置 Doppler（可选）

如果你要在 GCP 上使用 Doppler 管理环境变量：

```bash
# 在 GCP VM 上安装 Doppler CLI
curl -Ls https://cli.doppler.com/install.sh | sh

# 登录 Doppler
doppler login

# 配置项目
doppler setup

# 运行命令时自动加载环境变量
doppler run -- your_command
```

## 第五步：设置环境变量桥接

在 GCP VM 上创建 `/home/your_user/.env.local`：

```bash
export DOPPLER_TOKEN="your-token-here"
export GCP_PROJECT_ID="your-project-id"
# 其他环境变量...
```

然后在 `~/.bashrc` 或 `~/.zshrc` 中加载：

```bash
[ -f ~/.env.local ] && source ~/.env.local
```

## 故障排查

### 连接拒绝
```bash
# 检查防火墙规则
gcloud compute firewall-rules list --filter="name~ssh"

# 添加 SSH 防火墙规则
gcloud compute firewall-rules create allow-ssh \
  --allow=tcp:22 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=ssh
```

### 权限被拒绝
```bash
# 检查公钥是否在 GCP 中正确配置
gcloud compute instances describe YOUR_INSTANCE_NAME \
  --format='get(metadata.items.ssh-keys)'

# 手动添加公钥
gcloud compute instances add-metadata YOUR_INSTANCE_NAME \
  --metadata-from-file ssh-keys=~/.ssh/authorized_keys.txt
```

### SSH 密钥权限
```bash
# 确保本地密钥权限正确
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

## 安全建议

1. ✓ 使用 Ed25519 密钥（已完成）
2. ✓ 正确的文件权限（已完成）
3. ✓ 不在版本控制中存储 token
4. ✓ 定期轮换凭证
5. ✓ 在 GCP 中启用 OS Login（推荐）

## 快速连接

一旦设置完成，只需：

```bash
ssh gcp-server
```

或使用脚本中的函数：

```bash
source /Volumes/128/sms-key/.env.example
gcp_ssh
```
