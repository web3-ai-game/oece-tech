# 🚀 Windsurf 命令块指南

## 🎯 为什么不能直接丢命令块？

### ❌ 问题分析：
1. **Windsurf 是 IDE，不是命令行工具**
   - Windsurf = VS Code fork + AI 编程助手
   - 它需要在**图形界面**中操作，不支持远程SSH命令
   
2. **你的开发环境架构**：
   ```
   你的本地 Windsurf IDE (Windows/Mac)
   ↓ SSH连接
   GCP VM (Linux, 无GUI)
   ↓ 容器化
   Google Cloud Run (部署目标)
   ```

3. **正确的工作流**：
   ```
   Claude (在VS Code/Windsurf中) 
   → 生成代码和配置文件
   → 你在 Windsurf 中编辑/运行
   → 通过Git推送到GCP
   → 在GCP上部署到Cloud Run
   ```

## ✅ 正确的 Windsurf 使用方式

### 方案 A：本地 Windsurf + Git 同步
```bash
# 1. 在本地 Windsurf 打开项目
cd ~/Projects
git clone https://github.com/web3-ai-game/deepweay-sms.git
code deepweay-sms  # 或用 Windsurf 打开

# 2. 在 Windsurf 中使用 AI 助手
# Ctrl+L 或 Cmd+L 打开 Cascade
# 输入需求，AI 自动生成代码

# 3. 测试通过后推送
git add .
git commit -m "feat: 新功能"
git push origin main

# 4. 在 GCP 上拉取并部署
ssh gcp-vm
cd /home/svs-main-key/GCP/deepweay-sms
git pull
pm2 restart all
```

### 方案 B：远程 SSH + VS Code Server（推荐）
```bash
# 1. 在 GCP 安装 code-server（浏览器版 VS Code）
curl -fsSL https://code-server.dev/install.sh | sh
code-server --bind-addr 0.0.0.0:8080 --auth password

# 2. 通过浏览器访问
# https://deepweay.me:8080
# 在浏览器中使用 Windsurf 插件

# 3. 直接在 GCP 上编辑和部署
```

### 方案 C：Windsurf CLI Mode（实验性）
```bash
# Windsurf 目前没有独立的 CLI 工具
# 但可以通过 Codeium API 调用

# 安装 Codeium CLI
npm install -g codeium

# 使用 API 生成代码
codeium generate --prompt "创建 Express API 服务器" --output server.js
```

## 🎮 实战：MVP #1 Notion API 部署

### Step 1: 在 Windsurf 中创建项目结构
```javascript
// 在 Windsurf Cascade 中输入：
"创建一个 Express API 服务器，路由：
- GET /health - 健康检查
- POST /api/notion/clean - 清洗 Notion 数据
- GET /api/stats - 获取统计数据
使用 Cloud Run 环境变量，支持 CORS"
```

### Step 2: Windsurf 生成的代码示例
```javascript
// server.js - Windsurf AI 自动生成
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.post('/api/notion/clean', async (req, res) => {
  // AI 会自动实现数据清洗逻辑
  const { data } = req.body;
  // ... 清洗逻辑
  res.json({ success: true, cleaned: data });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 3: 部署到 Cloud Run
```bash
# 在 GCP VM 上执行
cd /home/svs-main-key/GCP/deepweay-sms

# 创建 Dockerfile（也可以让 Windsurf 生成）
cat > Dockerfile << 'EOF'
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
EOF

# 部署到 Cloud Run
gcloud run deploy notion-api \
  --source . \
  --region asia-southeast1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=${GEMINI_PRO_30}"
```

## 💡 最佳实践

### 1. 使用 Windsurf 作为代码生成器
```
你 → Claude (VS Code Chat)
    ↓
    生成详细需求文档
    ↓
在 Windsurf 中打开项目
    ↓
使用 Cascade (Ctrl+L) 输入需求
    ↓
AI 自动生成代码、测试、配置
    ↓
本地测试通过
    ↓
Git push 到 GitHub
    ↓
GCP 自动拉取部署（CI/CD）
```

### 2. Windsurf 1000 积分策略
- **单个 MVP**: 150-250 积分
- **代码生成**: 每 1000 行约 20-30 积分
- **重构/优化**: 每次约 10-20 积分
- **调试修复**: 每个 bug 约 5-10 积分

### 3. 积分节省技巧
1. **批量生成**: 一次性生成整个模块，比多次小改省积分
2. **精确提示**: 详细描述需求，减少重复生成
3. **模板复用**: 生成一次好的模板，后续手动修改
4. **关键功能优先**: 用 AI 生成核心逻辑，UI 手写

## 🔥 立即行动

### MVP #1: Notion API（现在就做）
```bash
# 在本地 Windsurf 中操作：

# 1. 打开项目
File → Open Folder → deepweay-sms

# 2. 打开 Cascade (Ctrl+L)
输入：
"创建一个生产级 Express API：
- 路由：/health, /api/notion/clean, /api/stats
- 集成 Gemini API 清洗 Notion 数据
- 错误处理和日志记录
- 适配 Google Cloud Run
- 包含 Dockerfile 和 cloudbuild.yaml"

# 3. AI 自动生成所有文件
# 4. 本地测试
npm install
npm run dev

# 5. 推送到 GitHub
git add .
git commit -m "feat: Notion API MVP"
git push origin main

# 6. 在 GCP 部署（SSH 到 GCP）
cd deepweay-sms
git pull
gcloud run deploy notion-api --source .
```

## 📊 成本对比

| 方法 | 成本 | 速度 | 质量 |
|------|------|------|------|
| 纯手写 | 0 | 慢 | 高（需经验） |
| ChatGPT/Claude | $20-50 | 中 | 中（需调整） |
| **Windsurf 1000积分** | **~$30** | **快** | **高（专业代码）** |
| GitHub Copilot | $10/月 | 中 | 中（补全为主） |
| Cursor Pro | $20/月 | 快 | 高 |

## 🎯 总结

**你不能直接"丢命令块"的原因**：
- Windsurf 不是 CLI 工具，是 IDE
- 需要在图形界面中操作
- 通过 AI 对话生成代码，不是执行命令

**正确姿势**：
1. 在本地 Windsurf 中用 Cascade 生成代码
2. 测试通过后 Git 推送
3. 在 GCP 上拉取并部署

**下一步**：
- 选择方案 A（本地开发）或方案 B（远程 code-server）
- 开始第一个 MVP 开发
- 使用 Windsurf 加速代码生成
