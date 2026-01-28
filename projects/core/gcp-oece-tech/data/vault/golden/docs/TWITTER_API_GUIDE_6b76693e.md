# 🐦 Twitter (X) API 获取与配置指南

## 📋 方案对比

### 方案1：官方 Twitter Developer API（推荐）
**优点**：
- 官方支持，稳定可靠
- 完整API功能
- 每月免费配额

**缺点**：
- 需要申请开发者账号
- 审核可能需要时间
- 有速率限制

### 方案2：使用第三方服务
**选项**：
1. **RapidAPI** - 提供Twitter API代理
2. **Twit npm包** - 简化的Twitter客户端
3. **Puppeteer自动化** - 模拟浏览器操作

### 方案3：开源替代
- **Mastodon** - 去中心化社交网络
- **Bluesky** - Twitter替代品
- **Threads** - Meta的Twitter竞品

---

## 🚀 官方API申请步骤

### Step 1: 申请开发者账号
1. 访问: https://developer.twitter.com
2. 点击 "Sign up"
3. 选择账号类型:
   - **Essential** (免费) - 基础功能，500K推文/月
   - **Elevated** (免费) - 进阶功能，2M推文/月  
   - **Academic** (免费) - 学术研究，10M推文/月

### Step 2: 填写申请表
```
用途描述模板：
"I'm building a personal AI assistant bot that helps me manage and schedule my social media content. The bot will:
1. Post scheduled tweets about AI, Web3, and technology
2. Analyze engagement metrics
3. Auto-reply to mentions with AI-generated responses
This is for personal use only, not commercial."
```

### Step 3: 创建App
1. 进入 Dashboard > Projects & Apps
2. 创建新的App
3. 获取以下密钥:
   - API Key
   - API Secret Key
   - Bearer Token
   - Access Token
   - Access Token Secret

### Step 4: 设置权限
- Read and Write 权限
- Direct Message 权限（可选）

---

## 🔧 快速部署方案（使用Twit库）

### 安装依赖
```bash
npm install twit node-cron dotenv
```

### 环境变量配置
```env
# Twitter API Credentials
TWITTER_API_KEY=your_api_key
TWITTER_API_SECRET=your_api_secret
TWITTER_ACCESS_TOKEN=your_access_token
TWITTER_ACCESS_SECRET=your_access_secret
```

### 简单实现代码
```javascript
const Twit = require('twit');

const T = new Twit({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_SECRET,
  timeout_ms: 60*1000,
  strictSSL: true,
});

// 发推文
async function tweet(status) {
  try {
    const result = await T.post('statuses/update', { status });
    console.log('Tweet posted:', result.data.text);
    return result.data;
  } catch (error) {
    console.error('Tweet error:', error);
    return null;
  }
}

// 获取时间线
async function getTimeline() {
  try {
    const result = await T.get('statuses/home_timeline', { count: 10 });
    return result.data;
  } catch (error) {
    console.error('Timeline error:', error);
    return [];
  }
}

// 自动回复提及
async function replyToMentions() {
  try {
    const mentions = await T.get('statuses/mentions_timeline', { count: 5 });
    
    for (const mention of mentions.data) {
      const reply = `@${mention.user.screen_name} Thanks for mentioning me! 🤖`;
      await T.post('statuses/update', {
        status: reply,
        in_reply_to_status_id: mention.id_str
      });
    }
  } catch (error) {
    console.error('Reply error:', error);
  }
}
```

---

## 🎭 Puppeteer自动化方案（备选）

### 优点
- 无需API密钥
- 可以执行任何浏览器操作
- 绕过API限制

### 缺点
- 需要更多资源
- 可能违反ToS
- 需要处理验证码

### 实现示例
```javascript
const puppeteer = require('puppeteer');

async function autoTweet(username, password, tweetText) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // 登录
  await page.goto('https://twitter.com/login');
  await page.type('input[name="text"]', username);
  await page.click('div[role="button"]:has-text("Next")');
  await page.waitForTimeout(1000);
  await page.type('input[name="password"]', password);
  await page.click('div[role="button"]:has-text("Log in")');
  
  // 发推
  await page.waitForSelector('[data-testid="tweetTextarea_0"]');
  await page.type('[data-testid="tweetTextarea_0"]', tweetText);
  await page.click('[data-testid="tweetButtonInline"]');
  
  await browser.close();
}
```

---

## 📊 速率限制

### Essential (免费版)
- **发推**: 200次/15分钟
- **获取推文**: 180次/15分钟
- **搜索**: 180次/15分钟

### Elevated
- **发推**: 300次/3小时
- **获取推文**: 900次/15分钟
- **搜索**: 450次/15分钟

---

## 🔐 安全建议

1. **永远不要**在代码中硬编码API密钥
2. 使用环境变量存储敏感信息
3. 定期轮换Access Token
4. 监控API使用量避免超限
5. 实现错误重试机制
6. 记录所有API调用日志

---

## 🚨 注意事项

### Twitter Developer政策
- 不能用于垃圾信息
- 不能自动关注/取关
- 必须遵守内容政策
- 需要标明是Bot账号

### 替代方案
如果Twitter API申请困难，可以考虑：
1. **Buffer** - 社媒管理平台，有API
2. **Hootsuite** - 企业级社媒管理
3. **IFTTT** - 自动化工具，支持Twitter
4. **Zapier** - 工作流自动化

---

## 📱 Telegram Bot集成

在Love Assistant Bot中使用：

```javascript
// 发推命令
bot.onText(/\/tweet (.+)/, async (msg, match) => {
  const chatId = msg.chat.id;
  const tweetContent = match[1];
  
  const result = await postToTwitter(tweetContent);
  
  if (result.success) {
    bot.sendMessage(chatId, '✅ 推文已发送！');
  } else {
    bot.sendMessage(chatId, '❌ 发送失败：' + result.error);
  }
});
```

---

## 📈 监控和分析

使用Twitter Analytics API获取数据：
- 展示次数
- 互动率
- 关注者增长
- 最佳发布时间

---

## 💡 最佳实践

1. **发布时间**: 早上9点、下午1点、晚上8点
2. **内容比例**: 
   - 40% 原创内容
   - 30% 转发互动
   - 30% 回复评论
3. **Hashtag策略**: 每条推文2-3个相关标签
4. **多媒体**: 带图片的推文获得更多互动

---

## 🛠️ 故障排查

### 常见错误
1. **401 Unauthorized** - API密钥错误
2. **429 Too Many Requests** - 超过速率限制
3. **403 Forbidden** - 权限不足
4. **400 Bad Request** - 参数错误

### 解决方案
```javascript
// 重试机制
async function tweetWithRetry(content, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await postToTwitter(content);
    } catch (error) {
      if (error.code === 429) {
        // 速率限制，等待15分钟
        await new Promise(r => setTimeout(r, 15 * 60 * 1000));
      } else if (i === retries - 1) {
        throw error;
      }
    }
  }
}
```
