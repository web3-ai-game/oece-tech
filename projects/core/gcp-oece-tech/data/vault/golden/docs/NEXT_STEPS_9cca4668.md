# 🚀 下一步开发计划

## ✅ 本次已完成

1. **完整环境变量模板** (`.env.template`)
   - 所有Token配置说明
   - Telegram/Slack/WhatsApp/Line
   - Datadog监控
   - 获取方式详细文档

2. **开发策略文档** (`VPS_SETUP.md`)
   - 基于Notion文档整理
   - Gemini免费层使用策略
   - 容器化架构规划
   - 多平台Bot集成方案

3. **Token已配置**
   - ✅ Gemini API Key
   - ✅ Telegram Bot 1 (@svsinst_bot)
   - ✅ Telegram Bot 2 (@svslovea_bot)
   - ✅ Telegram Admin ID

---

## 🎯 立即开始 (Phase 1)

### 1. 创建Gemini基础设施

**目标:** 实现速率限制和翻译队列

```bash
# 在Windsurf中执行
@Notion 执行Windsurf命令块0
```

**任务清单:**
- [ ] 创建 `src/lib/gemini/client.ts`
- [ ] 创建 `src/lib/gemini/rate-limiter.ts`
- [ ] 创建 `src/lib/gemini/translation-queue.ts`
- [ ] 测试Flash/Lite/Pro模型
- [ ] 验证速率限制

**预计时间:** 2-3小时

---

### 2. BBS自动翻译功能

**目标:** 发帖后自动翻译繁中↔英文

```bash
@Notion 执行Windsurf命令块1
```

**任务清单:**
- [ ] 创建翻译API: `/api/translate`
- [ ] 修改发帖逻辑（触发翻译）
- [ ] 数据库存储双语内容
- [ ] 前端显示语言切换
- [ ] 测试翻译效果

**预计时间:** 3-4小时

---

### 3. Telegram Bot开发

**Bot 1 配置 (@svsinst_bot - 小爱同学):**
- Token: `8076798362:AAFL1LaRlQnKJ_i87AyWW5EhkJkdCmOGJDg`
- 用途: PRO会员专属对话
- 模型: Gemini Flash

**开发步骤:**

```bash
# 1. 创建Bot目录
mkdir -p telegram-bot/src
cd telegram-bot

# 2. 初始化
npm init -y
npm install grammy @supabase/supabase-js @google/generative-ai

# 3. 创建代码
# (参考 VPS_SETUP.md 中的实现)

# 4. 测试
node src/index.js
```

**任务清单:**
- [ ] Grammy框架集成
- [ ] PRO会员验证
- [ ] Gemini对话功能
- [ ] 错误处理
- [ ] Docker容器化
- [ ] 测试对话流程

**预计时间:** 4-6小时

---

### 4. 首页AI聊天窗口

**功能:**
- 浮动窗口（右下角）
- 中英文切换
- 接待员角色
- Gemini Flash

**任务清单:**
- [ ] 创建 `src/components/common/ai-chat-widget.tsx`
- [ ] 创建 API: `/api/ai/chat`
- [ ] 接待员Prompt模板
- [ ] 样式和动画
- [ ] 添加到 `layout.tsx`

**预计时间:** 3-4小时

---

## 📋 本周目标 (2025-11-06 ~ 11-12)

### 高优先级 (P0/P1)

- [x] ✅ 环境变量配置完成
- [x] ✅ 架构文档完成
- [ ] 🔄 Gemini基础设施
- [ ] 🔄 BBS自动翻译
- [ ] 🔄 Telegram Bot 1
- [ ] 🔄 首页AI聊天

### 中优先级 (P2)

- [ ] ⏳ Docker Compose配置
- [ ] ⏳ Telegram Bot 2
- [ ] ⏳ Slack Token获取
- [ ] ⏳ Footer联系方式更新

### 低优先级 (P3)

- [ ] ⏳ Slack Bot开发
- [ ] ⏳ WhatsApp集成
- [ ] ⏳ Line Bot开发
- [ ] ⏳ Datadog监控

---

## 🔧 Slack配置步骤（下周开始）

### 1. 创建Slack App

1. 访问: https://api.slack.com/apps
2. 点击 "Create New App"
3. 选择 "From scratch"
4. 输入:
   - App Name: `DeepWeay Bot`
   - Workspace: 选择你的工作区

### 2. 配置Bot

**OAuth & Permissions:**
- `chat:write`
- `channels:read`
- `groups:read`
- `im:read`
- `users:read`

安装到工作区后获得: `SLACK_BOT_TOKEN` (xoxb-...)

### 3. 启用Socket Mode

**Basic Information → Socket Mode:**
- 启用 Socket Mode
- 创建 App-Level Token
- Scope: `connections:write`
- 获得: `SLACK_APP_TOKEN` (xapp-...)

### 4. 订阅Events

**Event Subscriptions:**
- `message.channels`
- `message.groups`
- `message.im`

### 5. 获取Signing Secret

**Basic Information → App Credentials:**
- 复制 `Signing Secret`

---

## 🐳 Docker部署计划

### 容器列表

1. **deepweay-web** (Next.js)
   - Port: 3000
   - 状态: ✅ 代码ready

2. **deepweay-tg-bot-1** (主Bot)
   - Port: -
   - 状态: ⏳ 待开发

3. **deepweay-tg-bot-2** (备用)
   - Port: -
   - 状态: ⏳ 待开发

4. **deepweay-slack-bot**
   - Port: -
   - 状态: ⏳ 待开发

5. **deepweay-datadog** (监控)
   - Port: -
   - 状态: ⏳ 待配置

### Docker Compose配置

文件已在 `VPS_SETUP.md` 中提供完整配置，待实际部署时创建：
- `docker-compose.yml`
- 各Bot的 `Dockerfile`

---

## 📱 Footer更新计划

### 当前Footer

```typescript
// src/components/common/footer.tsx
// 只有基础链接
```

### 更新后Footer

**联系方式分组:**

**社群 (Community):**
- Telegram中文群
- Telegram英文群  
- Slack工作区

**PRO专属:**
- Telegram私密频道
- Slack PRO频道

**其他联系:**
- WhatsApp
- Line
- Email

**代码示例:**
```typescript
const contactLinks = {
  community: [
    { icon: Send, label: 'Telegram (中文)', href: TELEGRAM_GROUP_ZH },
    { icon: Send, label: 'Telegram (EN)', href: TELEGRAM_GROUP_EN },
    { icon: Hash, label: 'Slack', href: SLACK_WORKSPACE_URL },
  ],
  pro: [
    { icon: Lock, label: 'TG PRO Channel', href: TELEGRAM_PRO_CHANNEL },
    { icon: Lock, label: 'Slack PRO', href: SLACK_CHANNEL_PRO },
  ],
  direct: [
    { icon: MessageCircle, label: 'WhatsApp', href: WHATSAPP_URL },
    { icon: MessageSquare, label: 'Line', href: LINE_URL },
  ],
};
```

---

## 🧪 测试清单

### 本地测试

**Gemini API:**
- [ ] Flash模型调用
- [ ] Lite模型调用
- [ ] Pro模型调用
- [ ] 速率限制验证
- [ ] 错误处理

**翻译功能:**
- [ ] 繁中→英文
- [ ] 英文→繁中
- [ ] 队列处理
- [ ] 数据库存储

**Telegram Bot:**
- [ ] Bot响应
- [ ] PRO验证
- [ ] 对话流程
- [ ] 错误处理

**首页AI聊天:**
- [ ] 窗口打开/关闭
- [ ] 消息发送
- [ ] Gemini响应
- [ ] 语言切换

### VPS部署测试

- [ ] Docker构建
- [ ] 容器启动
- [ ] 网络连通
- [ ] SSL证书
- [ ] 域名解析
- [ ] 性能测试

---

## 📊 监控指标

### Gemini API使用量

需要监控的指标:
- 每日请求数 (RPD)
- 每分钟请求数 (RPM)
- Token使用量 (TPM)
- 错误率
- 响应时间

### 系统性能

- CPU使用率
- 内存使用率
- 容器健康状态
- 数据库连接数
- API响应时间

### 用户行为

- 日活用户
- 发帖数量
- AI工具使用次数
- Bot对话次数
- 付费转化率

---

## 💰 成本预估（月度）

### 当前成本

- VPS (DigitalOcean): $12/月
- 域名: $15/年 ≈ $1.25/月
- **总计: ~$13/月**

### Gemini API

- 免费配额完全够用
- 至少支撑到200+日活
- **成本: $0**

### 未来扩展（可选）

- Datadog免费版: $0
- Slack免费版: $0
- Stripe (按交易): 2.9% + $0.30
- **预计月成本: <$20**

---

## 🎯 里程碑

### Week 1 (当前周)
- [x] ✅ 环境配置完成
- [x] ✅ 架构文档完成
- [ ] 🔄 Gemini基础设施
- [ ] 🔄 BBS翻译
- [ ] 🔄 TG Bot 1

### Week 2
- [ ] ⏳ 首页AI聊天
- [ ] ⏳ Docker化
- [ ] ⏳ TG Bot 2
- [ ] ⏳ Slack配置

### Week 3
- [ ] ⏳ Slack Bot
- [ ] ⏳ Footer更新
- [ ] ⏳ 监控系统

### Week 4
- [ ] ⏳ WhatsApp集成
- [ ] ⏳ Line Bot
- [ ] ⏳ 性能优化

### Month 2
- [ ] ⏳ PRO功能完善
- [ ] ⏳ 支付系统
- [ ] ⏳ 公开测试

---

## 🔗 快速链接

**Notion文档:**
- [Gemini策略](https://www.notion.so/DeepWeay-me-Gemini-2a26b9c2d3798192a39cf93230061ff0)
- [Windsurf命令](https://www.notion.so/Windsurf-DeepWeay-2a26b9c2d379814d99f1fd613bcc39ca)

**项目文档:**
- [VPS_SETUP.md](./VPS_SETUP.md) - 完整架构
- [.env.template](./.env.template) - 环境变量
- [DEPLOY_STATUS.md](./DEPLOY_STATUS.md) - 部署状态

**开发工具:**
- GitHub: https://github.com/web3-ai-game/studio
- VPS: 188.166.180.96
- 域名: https://deepweay.me

---

**更新时间:** 2025-11-05 21:00 UTC+7  
**下次更新:** 完成Gemini基础设施后
