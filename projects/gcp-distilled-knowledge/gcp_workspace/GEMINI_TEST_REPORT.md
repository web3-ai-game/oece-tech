# 🔥 Gemini API Keys 测试报告

## 📊 测试结果总结

### ✅ 可用 Keys

#### 1. 免费Key-1 (AIzaSyD_cNll0AKAmKZg...)
- **状态**: ✅ 完全可用
- **成功率**: 100% (8/8 测试通过)
- **平均延迟**: 1099ms
- **总消耗**: 867 tokens
- **支持模型**: 
  - ✅ gemini-2.5-flash-lite (15 RPM, 免费)
  - ✅ gemini-2.0-flash-lite (30 RPM, 免费)
- **推荐用途**: 开发测试、原型验证

### ❌ 不可用 Keys

#### 2. 临时Key-1 (AQ.Ab8RN6LlrNEKtXon...)
- **状态**: ❌ OAuth2 Token，不是 API Key
- **错误**: `API keys are not supported by this API. Expected OAuth2 access token`
- **原因**: 这是 Cloud Run/Vertex AI 的临时访问令牌，不能用于 Gemini API

#### 3. 临时Key-2 (AQ.Ab8RN6LioS7k0Ipyc...)
- **状态**: ❌ OAuth2 Token，不是 API Key
- **错误**: 同上
- **原因**: 同上

#### 4. Gemini-Pro-Key-1 (AIzaSyAj08QZ4B8CMU...)
- **状态**: ❌ 已泄露被禁用
- **错误**: `Your API key was reported as leaked`
- **建议**: 立即删除并申请新 Key

#### 5. Gemini-Pro-Key-2 (AIzaSyA3ikY04T94AoAw...)
- **状态**: ❌ 已泄露被禁用
- **错误**: `Your API key was reported as leaked`
- **建议**: 立即删除并申请新 Key

---

## 🎯 向量噴射策略验证

### 测试的4种温度策略

#### 1. 低温切割 (T=0.1) ❄️
- **用途**: 精确答案、数学计算
- **测试**: "1+1=?"
- **结果**: ✅ 准确输出 "2"
- **延迟**: 554ms (2.5 Flash-Lite)

#### 2. 向量噴射 (T=0.7) 🎯
- **用途**: 代码分析、技术问题
- **测试**: 时间复杂度分析
- **结果**: ✅ 准确识别 O(n²)，详细解释
- **延迟**: 1262ms

#### 3. 高温扩散 (T=1.2) 🔥
- **用途**: 创意写作、头脑风暴
- **测试**: 量子计算原理（发散思维）
- **结果**: ✅ 创意性描述，比喻丰富
- **延迟**: 1420ms

#### 4. 蒸馏半截 (T=0.5) 💧
- **用途**: 总结提炼、核心要点
- **测试**: AI定义蒸馏
- **结果**: ✅ 精准提炼核心
- **延迟**: 505ms

---

## 🚀 容器化部署建议

### 推荐架构

```
┌─────────────────────────────────────────┐
│         Google Cloud Run                │
│  ┌───────────────────────────────────┐  │
│  │   SMS-Key 容器化 AI 服务          │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  向量噴射引擎 (Vector Jet)  │  │  │
│  │  │  - 低温切割: gemini-2.5     │  │  │
│  │  │  - 向量噴射: gemini-2.5     │  │  │
│  │  │  - 高温扩散: gemini-2.5     │  │  │
│  │  │  - 蒸馏半截: gemini-2.0     │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  API Key 管理 (Doppler)     │  │  │
│  │  │  - 免费Key: AIzaSyD_cNll... │  │  │
│  │  │  - 新申请: 待获取            │  │  │
│  │  └─────────────────────────────┘  │  │
│  │                                   │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │  备用路由 (OpenRouter)      │  │  │
│  │  │  - $1111 余额充足            │  │  │
│  │  │  - 多模型支持                │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### 环境变量配置

```bash
# Gemini API (免费层)
GEMINI_FREE_KEY=AIzaSyD_cNll0AKAmKZgO6pOJzMRosKiBJxuUNM

# OpenRouter (备用)
OPENROUTER_API_KEY=sk-or-v1-<your-key>
OPENROUTER_BALANCE=1111

# Doppler (密钥管理)
DOPPLER_TOKEN=<your-doppler-token>

# 温度策略
TEMP_COLD=0.1
TEMP_VECTOR=0.7
TEMP_HOT=1.2
TEMP_DISTILL=0.5

# 速率限制
RATE_LIMIT_RPM=15
RATE_LIMIT_TPM=250000
```

---

## 💡 立即行动建议

### Phase 1: 安全修复 (立即)
```bash
# 1. 删除泄露的 keys
rm -f /home/svs-main-key/GCP/sms-key/.env.doppler.backup

# 2. 更新 sms-key 环境变量
cd /home/svs-main-key/GCP/sms-key
cat > .env.doppler << 'EOF'
# Gemini Free (可用)
GEMINI_FREE_KEY=AIzaSyD_cNll0AKAmKZgO6pOJzMRosKiBJxuUNM

# OpenRouter (备用路由)
OPENROUTER_API_KEY=<从 Doppler 获取>
OPENROUTER_BALANCE=1111

# Doppler
DOPPLER_TOKEN=<your-token>
EOF

# 3. 重新部署环境变量
source /home/svs-main-key/GCP/deploy-env.sh
```

### Phase 2: 申请新 Gemini Key (1小时内)
1. 访问: https://aistudio.google.com/apikey
2. 删除泄露的 keys
3. 创建新的 API Key
4. 绑定 Cloud Billing 账户（升级到付费层）
5. 添加到 Doppler

### Phase 3: 容器化部署 (今晚)
```bash
# 创建 Dockerfile
cat > /home/svs-main-key/GCP/Dockerfile << 'EOF'
FROM node:18-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["node", "server.js"]
EOF

# 部署到 Cloud Run
gcloud run deploy sms-key-api \
  --source /home/svs-main-key/GCP \
  --region asia-southeast1 \
  --set-env-vars="GEMINI_FREE_KEY=${GEMINI_FREE_KEY}" \
  --allow-unauthenticated
```

---

## 📈 性能优化建议

### 1. 智能路由策略
```javascript
function selectModel(task) {
  if (task.type === 'calculation') {
    return { model: 'gemini-2.5-flash-lite', temp: 0.1 }; // 低温切割
  } else if (task.type === 'analysis') {
    return { model: 'gemini-2.5-flash-lite', temp: 0.7 }; // 向量噴射
  } else if (task.type === 'creative') {
    return { model: 'gemini-2.0-flash-lite', temp: 1.2 }; // 高温扩散
  } else if (task.type === 'summarize') {
    return { model: 'gemini-2.0-flash-lite', temp: 0.5 }; // 蒸馏半截
  }
}
```

### 2. 速率限制管理
- 免费层: 15 RPM → 每4秒1个请求
- 使用队列缓冲高峰流量
- 失败自动切换到 OpenRouter

### 3. 成本优化
- 开发环境: 100% 使用免费 Flash-Lite
- 生产环境: 80% Flash-Lite + 20% Flash
- 复杂任务: 按需使用 Pro

---

## 🎯 下一步

1. ✅ **测试完成**: 确认免费Key可用
2. ⏭️ **申请新Key**: 获取付费层 API Key
3. ⏭️ **容器化**: 部署到 Cloud Run
4. ⏭️ **集成**: 将向量噴射引擎整合到 MVP

准备好开始容器化部署了吗？
