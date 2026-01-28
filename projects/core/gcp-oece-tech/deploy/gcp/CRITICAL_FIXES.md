# 🚨 紧急修复清单

## ❌ 发现的问题

### 1. Gemini API Key 泄露 ⚠️⚠️⚠️
```
ERROR: Your API key was reported as leaked. Please use another API key.
```

**原因**: ecosystem.config.json 中明文暴露 API key
**影响**: Gemini API 被 GitHub 扫描到，已被禁用
**紧急度**: 🔴 最高优先级

### 2. Gemini 配额耗尽
```
Quota exceeded for metric: generativelanguage.googleapis.com/generate_requests_per_model_per_day, limit: 0
```

**原因**: 免费版 Gemini 每日配额用尽
**影响**: notion-cleaner 无法工作
**紧急度**: 🟡 中等

### 3. GCP 权限不足
```
Permission denied to list services for consumer container [projects/95048230206]
```

**原因**: 使用 Compute Engine 服务账号，权限受限
**影响**: 无法部署 Cloud Run
**紧急度**: 🟡 中等

---

## ✅ 解决方案

### 修复 1: 更换 Gemini API Key（立即执行）

```bash
# 1. 停止 notion-cleaner
pm2 stop notion-cleaner

# 2. 从 Doppler 获取新的 API Key
cd /home/svs-main-key/GCP/sms-key
source .env.doppler

# 检查可用的 Gemini keys
env | grep GEMINI

# 3. 使用备用 Key（收费版）
export NEW_GEMINI_KEY="从 sms-key/.env.doppler 中获取 GEMINI_PRO_25_KEY"

# 4. 更新 ecosystem.config.json
cd /home/svs-main-key/GCP/deepweay-sms
nano ecosystem.config.json
# 替换为: "GEMINI_API_KEY": "${NEW_GEMINI_KEY}"

# 5. 重启服务
pm2 start notion-cleaner
```

### 修复 2: 切换到 OpenRouter（推荐）

**优势**:
- $1,111 余额充足
- 支持多模型（Claude, GPT-4, Gemini）
- 不会泄露 key（通过环境变量）

```bash
# 1. 修改 notion-cleaner 使用 OpenRouter
cd /home/svs-main-key/GCP/deepweay-sms/scripts

# 2. 创建新的清洗脚本
cat > extract_with_openrouter.js << 'EOF'
#!/usr/bin/env node
const axios = require('axios');

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function analyzeWithOpenRouter(content) {
  const response = await axios.post(OPENROUTER_URL, {
    model: 'google/gemini-2.0-flash-exp:free', // 免费模型
    messages: [{
      role: 'user',
      content: `分析以下 Notion 内容并提取核心价值:\n${content}`
    }]
  }, {
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'HTTP-Referer': 'https://deepweay.me',
      'X-Title': 'Notion Cleaner'
    }
  });
  
  return response.data.choices[0].message.content;
}

module.exports = { analyzeWithOpenRouter };
EOF

# 3. 更新 ecosystem.config.json
nano ecosystem.config.json
# 修改为:
# "script": "./scripts/extract_with_openrouter.js",
# "env": {
#   "OPENROUTER_API_KEY": "从 sms-key/.env.doppler 获取"
# }
```

### 修复 3: 使用用户账号认证 GCP

```bash
# 1. 安装 gcloud 用户认证
gcloud auth login --no-launch-browser
# 会显示一个 URL，在浏览器打开完成认证

# 2. 设置项目
gcloud config set project deep-weay

# 3. 启用 Cloud Run API
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com

# 4. 重新部署
cd /home/svs-main-key/GCP/deepweay-sms
gcloud run deploy notion-api \
  --source . \
  --region asia-southeast1 \
  --platform managed \
  --allow-unauthenticated
```

---

## 🎯 立即行动计划

### Phase 1: 紧急修复（5分钟）
```bash
# 1. 停止泄露的服务
pm2 stop notion-cleaner

# 2. 删除 ecosystem.config.json 中的明文 key
cd /home/svs-main-key/GCP/deepweay-sms
sed -i 's/AIzaSy[^"]*/\$\{GEMINI_API_KEY\}/g' ecosystem.config.json

# 3. 提交修复到 GitHub
git add ecosystem.config.json
git commit -m "🔒 安全修复：移除硬编码 API Key"
git push origin main
```

### Phase 2: 切换到安全方案（10分钟）
```bash
# 使用 Doppler 环境变量
cd /home/svs-main-key/GCP
source ./deploy-env.sh

# 验证环境变量
env | grep -E "GEMINI|OPENROUTER"

# 重启服务
pm2 restart notion-cleaner --update-env
```

### Phase 3: 申请新的 Gemini Key（可选）
1. 访问: https://aistudio.google.com/apikey
2. 创建新的 API Key
3. 添加到 sms-key/.env.doppler
4. 重新部署环境变量

---

## 📊 安全最佳实践

### ✅ DO:
- 使用环境变量存储密钥
- 使用 Doppler 集中管理
- Git ignore 所有 .env 文件
- 定期轮换 API Keys

### ❌ DON'T:
- 硬编码 API Keys 在代码中
- 提交 .env 文件到 Git
- 在日志中打印密钥
- 使用共享的 API Keys

---

## 🚀 下一步

1. **立即执行**: Phase 1 修复（防止更多泄露）
2. **短期**: 切换到 OpenRouter（$1111 余额）
3. **中期**: 申请新的 Gemini Pro Key（收费版，无配额限制）
4. **长期**: 建立 CI/CD 自动轮换密钥机制

---

## 💡 Windsurf 开发建议

鉴于当前问题，建议：

1. **暂停 notion-cleaner 开发**
2. **优先开发简单的 MVP**（不依赖 Gemini）
3. **使用 Windsurf 生成安全的配置模板**
4. **等 API Key 修复后再继续数据清洗**

**推荐 MVP 顺序调整**:
- MVP #1: 健康检查 API（不需要外部 API） ✅ 立即开始
- MVP #2: SMS 网关（使用 Twilio 等现成服务）
- MVP #3: 数字资产追踪（只读 API）
- MVP #4: Notion 清洗（等 Key 修复）
