# 🚀 自然语言开发完整指南

> 在任何环境（本地、SSH、Termius 手机、IDE）中无缝使用 Gemini、Copilot、Doppler 进行自然语言开发

---

## 🎯 快速开始（5 分钟）

### 1️⃣ 本地开发 (Mac/Linux)

```bash
# 克隆仓库
git clone https://github.com/web3-ai-game/sms-key.git
cd sms-key

# 加载环境
source init.sh

# 开始开发
gemini 创建一个 Python 函数计算斐波那契数列
```

### 2️⃣ SSH 远程开发

```bash
# 连接到 GCP
ssh gcp-prod

# 环境自动加载（已集成到 ~/.zshrc）

# 直接使用
gemini 写一个 Node.js 服务器
copilot explain "什么是闭包"
```

### 3️⃣ 📱 iOS Termius 手机开发

```
1. 打开 Termius
2. 创建新的 SSH 连接
   - 主机: <GCP_IP>
   - 用户: ubuntu
   - 密钥: 你的 Ed25519 私钥
3. 连接后输入:
   gemini 创建一个 React 组件
```

---

## 📋 命令参考

### 🧠 Gemini 自然语言生成

```bash
# 基础用法
gemini 创建一个函数

# 高级用法
gemini --optimize "优化数据库查询"
gemini --test "生成单元测试"
gemini --debug "帮助调试这个错误"

# 管道输入
cat mycode.py | gemini "优化这段代码"
```

### 🤖 GitHub Copilot CLI

```bash
# 解释代码
copilot explain "这个函数做什么"

# 建议改进
copilot suggest "如何重构这个类"

# 需要: gh CLI 安装
brew install gh
gh auth login
```

### 🌍 OpenRouter 多模型

```bash
# 使用最强的 GPT-4
openrouter 创建完整的 REST API

# 使用 Claude 进行复杂推理
openrouter "分析这个算法的时间复杂度"

# 使用 Mistral 经济方案
openrouter "生成文档字符串"
```

### 🎛️ 通用 dev 命令

```bash
dev help              # 显示完整帮助
dev status            # 检查环境状态
dev gemini <prompt>   # 使用 Gemini
dev copilot <action>  # 使用 Copilot
dev shell             # 交互式开发 shell
```

---

## ⚙️ 完整配置（所有环境）

### 第 1 步：初始化本地环境

```bash
# 1. 克隆或进入 sms-key 目录
cd /Volumes/128/sms-key

# 2. 配置 shell
# 对于 zsh:
echo 'source /Volumes/128/sms-key/init.sh' >> ~/.zshrc
source ~/.zshrc

# 对于 bash:
echo 'source /Volumes/128/sms-key/init.sh' >> ~/.bashrc
source ~/.bashrc

# 3. 验证
dev status
```

### 第 2 步：配置 IDE（VS Code / Windsurf）

```bash
# 已配置的项目文件：
code sms-key.code-workspace

# 快捷方式：
# Cmd+Shift+P → 输入 "dev status"
# Cmd+Shift+P → 输入 "Load Environment"
```

### 第 3 步：配置 SSH / GCP 连接

```bash
# 编辑 SSH 配置
nano ~/.ssh/config

# 添加：
Host gcp-prod
    HostName <YOUR_GCP_IP>
    User ubuntu
    IdentityFile ~/.ssh/id_ed25519
    AddKeysToAgent yes

# 测试连接
ssh -v gcp-prod

# 部署环境到 GCP
./deploy_to_gcp.sh
```

### 第 4 步：配置 Termius（iOS）

```bash
# 1. 生成配置
bash ./setup_termius.sh

# 2. 在 Termius 中创建新的 SSH 连接
#    - 主机: <GCP_IP>
#    - 用户: ubuntu
#    - 密钥: Ed25519

# 3. 连接后：
source ~/.sms-key/init_env.sh
dev status
```

---

## 🎨 使用场景示例

### 场景 1：快速代码生成

```bash
# 本地快速原型
gemini 创建一个 Svelte 组件用于实时数据展示

# 结果会立即显示在终端
```

### 场景 2：代码审查和优化

```bash
# 上传代码并优化
cat complex_function.py | gemini "分析这个函数的性能瓶颈并优化"

# 或使用 Copilot 更详细的分析
copilot explain "这个递归函数为什么很慢"
```

### 场景 3：在 GCP 上开发

```bash
# SSH 连接到 GCP
ssh gcp-prod

# 自动加载所有环境变量
echo $GEMINI_API_KEY  # 已可用

# 在 GCP 上直接生成代码
gemini 创建一个 FastAPI 应用

# 保存代码
gemini 创建 FastAPI app > app.py
```

### 场景 4：手机上实时开发

```
1. 打开 Termius
2. 点击保存的 gcp-prod 连接
3. 输入: dev status (检查环境)
4. 输入: gemini "创建一个 Web 爬虫"
5. 复制生成的代码到本地
```

---

## 🔐 安全性和凭证管理

### 环境变量加载优先级

```
1. .env.local (最高优先级 - 本地覆盖)
2. .env.doppler (版本控制中)
3. Doppler 远程配置
4. 系统环境变量
```

### 保护敏感信息

```bash
# 仅本地使用（不提交）
echo "export DOPPLER_TOKEN='...'" > .env.local

# .gitignore 自动排除
.env.local
.env.明文备份
*.env
```

### 定期轮换密钥

```bash
# 通过 Doppler 管理
doppler run -- npm start

# 在 GCP 中使用 Secret Manager
gcloud secrets versions access latest --secret="doppler-token"
```

---

## 🛠️ 故障排查

### 问题 1：gemini 命令不工作

```bash
# 检查 API key
echo $GEMINI_API_KEY

# 重新加载环境
source init.sh

# 验证网络
curl -I https://generativelanguage.googleapis.com

# 测试 API
gemini "test"
```

### 问题 2：SSH 连接失败

```bash
# 检查密钥权限
chmod 600 ~/.ssh/id_ed25519

# 测试连接
ssh -v gcp-prod

# 检查防火墙
gcloud compute firewall-rules list
```

### 问题 3：Termius 中环境变量不加载

```bash
# SSH 连接后手动运行
source ~/.sms-key/init_env.sh

# 检查文件是否存在
ls -la ~/.sms-key/

# 验证 shell 配置
cat ~/.zshrc | grep sms-key
```

### 问题 4：API 额度用尽

```bash
# 检查 Doppler 余额
doppler secrets get GEMINI_API_KEY

# 使用备用 key
export GEMINI_API_KEY="$GEMINI_API_KEY_BACKUP"

# 切换到 OpenRouter
openrouter "你的提示"
```

---

## 📊 系统架构

```
┌─────────────────────────────────────────┐
│         任何设备/环境                    │
│  (本地 / SSH / Termius / IDE)          │
└──────────────┬──────────────────────────┘
               │
        ┌──────▼──────┐
        │   init.sh   │ (统一入口)
        └──────┬──────┘
               │
       ┌───────┴────────┐
       ▼                ▼
   smart_env.sh    nldev.sh
   (环境加载)      (自然语言工具)
       │                │
       ├────────┬───────┤
       ▼        ▼       ▼
    Doppler  Gemini  OpenRouter
    │         │         │
    └─────────┴─────────┘
             │
         ┌───▼────┐
         │  GCP   │
         │  VPS   │
         └────────┘
```

---

## 🚀 最佳实践

### 1️⃣ 本地开发最佳实践

```bash
# 始终加载环境
source init.sh

# 在每个新 shell 中验证
dev status

# 使用别名加快输入
alias g="gemini"
g "创建一个函数"
```

### 2️⃣ SSH 开发最佳实践

```bash
# 使用持久连接
ssh -N -f gcp-prod  # 后台保持连接

# 快速命令执行
ssh gcp-prod "gemini '你的提示'"

# 同步代码
rsync -avz . gcp-prod:~/project/
```

### 3️⃣ 手机开发最佳实践

```
• 保存常用的 SSH 连接
• 使用快捷方式快速执行命令
• 定期同步代码到本地
• 利用 Termius 的会话功能
```

---

## 📚 完整命令列表

| 命令 | 用途 | 示例 |
|------|------|------|
| `gemini <提示>` | Gemini 代码生成 | `gemini 创建 Flask app` |
| `copilot explain <代码>` | Copilot 代码解释 | `copilot explain "什么是闭包"` |
| `openrouter <提示>` | 多模型 API | `openrouter 优化查询` |
| `dev status` | 检查环境 | - |
| `dev shell` | 交互式 shell | - |
| `gcp` | 连接到 GCP | - |
| `sync-to-gcp` | 同步到 GCP | `sync-to-gcp ./src` |
| `sync-from-gcp` | 从 GCP 拉取 | `sync-from-gcp ~/project` |
| `g` | gemini 快捷 | `g "创建函数"` |
| `c` | copilot 快捷 | `c explain "代码"` |
| `d` | dev 快捷 | `d status` |

---

## 🔗 相关资源

- [GitHub 仓库](https://github.com/web3-ai-game/sms-key)
- [Doppler CLI 文档](https://docs.doppler.com/docs/cli)
- [Gemini API 文档](https://ai.google.dev/)
- [GitHub Copilot CLI 文档](https://github.com/features/copilot)
- [GCP 文档](https://cloud.google.com/docs)

---

**最后更新**: 2025-11-26  
**版本**: 1.0.0  
**状态**: ✅ 生产就绪
