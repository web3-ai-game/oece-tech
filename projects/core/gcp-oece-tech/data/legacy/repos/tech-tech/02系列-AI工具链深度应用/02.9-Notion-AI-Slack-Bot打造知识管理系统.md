# 02.9 终极知识库：Notion + Slack + AI自动化整合实战

**作者**: Cline | **发布日期**: 2025-11-09 | **分类**: `AI工具链` `自动化` `Notion` `Slack` `DevOps`

**摘要**: 在任何一个高速发展的团队中，知识的沉淀与检索都是一个巨大的挑战。宝贵的决策、精彩的讨论、关键的解决方案，往往散落在无数个Slack频道中，随着时间流逝而“蒸发”。与此同时，精心整理在Notion中的知识库，却因为“懒得去查”而束之高阁。本文将为您提供一套终极解决方案，通过编写一个智能AI机器人，将三大神器——Notion（结构化知识后端）、Slack（高频沟通前端）和大型语言模型（智能大脑）——无缝地连接起来，打造一个能自动沉淀、能智能问答的“团队第二大脑”。

**SEO关键词**: Notion API, Slack Bot, AI知识库, 自动化工作流, Serverless, Node.js, 团队知识管理, Zapier替代方案

---

## 第1部分：架构与愿景

### 1.1 问题：知识的“熵增定律”

- **Slack的“瞬时性”**: Slack是思想碰撞的绝佳场所，但它的信息是流式的、非结构化的。重要的对话很快就会被新的消息淹没，难以追溯和复用。
- **Notion的“孤岛性”**: Notion是沉淀结构化知识的完美工具，但它与日常工作流是割裂的。从Slack切换到Notion进行搜索，这个小小的动作摩擦力，足以让大多数人放弃。

### 1.2 愿景：一个“活”的知识库

我们设想一个理想的工作流：
- **沉淀**: 在Slack中，对于任何一段有价值的讨论，只需一个简单的命令（如`/save-thread`），AI机器人就能自动将整个对话进行总结，并存入Notion知识库。
- **检索**: 同样在Slack中，当你遇到问题时，无需离开当前对话，只需一个命令（如`/ask-kb 关键词`），AI机器人就能搜索Notion知识库，并用自然语言给你一个精准的、总结好的答案。

### 1.3 我们的技术架构

```mermaid
graph TD
    subgraph Slack Workspace
        A[用户] -- 使用斜杠命令 --> B{Slack API}
    end

    subgraph Serverless Platform (e.g., Vercel)
        C[AI Bot (Node.js/Express)]
    end

    subgraph 外部服务
        D[Notion API]
        E[AI Model API (Gemini/OpenAI)]
    end

    B -- HTTP POST请求 --> C
    C -- /save-thread --> D(创建页面)
    C -- /save-thread --> E(总结对话)
    C -- /ask-kb --> D(搜索页面)
    C -- /ask-kb --> E(根据搜索结果回答)
    C -- 返回消息 --> B
```

**核心组件**: 
1.  **Notion**: 作为我们的结构化知识数据库。
2.  **Slack**: 作为用户交互的前端界面。
3.  **AI Bot**: 一个运行在Serverless平台上的Node.js应用，作为连接所有服务的“智能中枢”。
4.  **LLM API**: 用于总结和问答的“大脑”。

---

## 第2部分：Notion作为知识库后端

### 2.1 创建知识库数据库

1.  在你的Notion工作区中，创建一个新的全页数据库，命名为“团队知识库 (Team KB)”。
2.  为其设计以下核心属性 (Properties)：

| 属性名 | 类型 | 说明 |
| :--- | :--- | :--- |
| `主题 (Topic)` | `Title` | 知识点或问题的核心标题 |
| `摘要 (Summary)` | `Text` | 由AI生成的、对整个对话的简短总结 |
| `来源 (Source)` | `URL` | 指向原始Slack对话的永久链接 |
| `标签 (Tags)` | `Multi-select` | 如 `Engineering`, `Marketing`, `Decision`, `Bugfix` |
| `创建者 (Creator)` | `Text` | 保存这条知识的Slack用户名 |
| `创建时间 (Created At)` | `Created time` | 自动记录创建时间 |

### 2.2 获取Notion API密钥

1.  访问 [notion.so/my-integrations](https://www.notion.so/my-integrations) 创建一个新的集成（Integration），命名为“Slack Knowledge Bot”。
2.  复制生成的“Internal Integration Token”，这就是你的`NOTION_API_KEY`。
3.  回到你创建的“团队知识库”数据库页面，点击右上角的“...”，选择`Add connections`，然后搜索并连接你刚刚创建的“Slack Knowledge Bot”集成。
4.  点击浏览器地址栏，从URL中复制出数据库ID（`https://www.notion.so/your-workspace/THIS_IS_THE_DATABASE_ID?v=...`），这就是你的`NOTION_DATABASE_ID`。

---

## 第3部分：Slack作为交互前端

### 3.1 创建Slack应用

1.  访问 [api.slack.com/apps](https://api.slack.com/apps) 并点击`Create New App`。
2.  选择`From scratch`，为你的App命名（如“Notion KB Bot”），并选择你的工作区。

### 3.2 配置斜杠命令 (Slash Commands)

1.  在App管理页面的左侧菜单，进入`Slash Commands`。
2.  点击`Create New Command`，创建两个命令：
    - **Command**: `/save-thread`
        - **Request URL**: 我们稍后部署好机器人后，会得到一个URL填入此处。
        - **Short Description**: `Saves the current thread to the Notion knowledge base.`
    - **Command**: `/ask-kb`
        - **Request URL**: (同上)
        - **Short Description**: `Asks a question to the Notion knowledge base.`
        - **Usage Hint**: `[your question]`

### 3.3 配置权限 (OAuth & Permissions)

1.  进入`OAuth & Permissions`页面。
2.  在`Scopes` -> `Bot Token Scopes`部分，添加以下权限：
    - `commands`: 允许应用接收斜杠命令。
    - `chat:write`: 允许应用在频道中发送消息。
    - `channels:history`, `groups:history`, `im:history`, `mpim:history`: 允许应用读取它所在频道的历史消息（用于获取thread内容）。

### 3.4 安装应用并获取凭证

1.  在`OAuth & Permissions`页面顶部，点击`Install to Workspace`来安装你的应用。
2.  安装后，复制生成的`Bot User OAuth Token`，这就是你的`SLACK_BOT_TOKEN`。
3.  进入`Basic Information`页面，找到`App Credentials`部分，复制`Signing Secret`，这就是你的`SLACK_SIGNING_SECRET`。

---

## 第4部分：AI机器人核心逻辑 (Node.js + Bolt)

我们将使用Slack官方的Bolt框架来简化开发。

**项目初始化**: 
```bash
mkdir notion-slack-bot
cd notion-slack-bot
npm init -y
npm install express @slack/bolt @notionhq/client @google/generative-ai dotenv
```

**主文件 `index.js`**: 
```javascript
require('dotenv').config();
const { App, ExpressReceiver } = require('@slack/bolt');
const { Client } = require('@notionhq/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');

// --- 初始化 --- //
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const gemini = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const expressReceiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  receiver: expressReceiver
});

const expressApp = expressReceiver.app;

// --- 命令处理逻辑 --- //

// 处理 /save-thread 命令
app.command('/save-thread', async ({ command, ack, client, say }) => {
  await ack('Got it! I will summarize and save this thread to Notion... ⏳');

  try {
    // 1. 获取Thread的所有消息
    const result = await client.conversations.replies({
      channel: command.channel_id,
      ts: command.thread_ts || command.ts // 如果在thread内，用thread_ts
    });

    const threadContent = result.messages.map(msg => `${msg.user}: ${msg.text}`).join('\n\n');

    // 2. 使用AI生成摘要和标题
    const prompt = `Summarize the following conversation thread into a concise one-paragraph summary, and then suggest a short, descriptive title for it. Format the output as a JSON object with keys 