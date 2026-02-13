---
title: BACKEND-API
slug: backend-api
category: vps_oece_docs
tags: [vps-sync]
lang: zh
created: 2026-02-13
source: vps-pass1-sync
vector_ready: true
---

# 🚀 OECE.tech 后端 API 文档

完整的后端API实现，包含所有核心功能模块。

---

## 📋 目录

1. [Gemini AI API](#gemini-ai-api)
2. [文件上传 API](#文件上传-api)
3. [算命功能 API](#算命功能-api)
4. [论坛 API](#论坛-api)
5. [用户管理 API](#用户管理-api)
6. [知识库搜索 API](#知识库搜索-api)
7. [Bot 管理 API](#bot-管理-api)

---

## 🤖 Gemini AI API

### 1. 聊天 API（非流式）

**端点**: `POST /api/gemini/chat`

**请求体**:
```json
{
  "model": "gemini-lite" | "gemini-flash" | "gemini-pro",
  "message": "Hello, AI!",
  "systemInstruction": "You are a helpful assistant",
  "temperature": 0.7,
  "maxTokens": 2048
}
```

**响应**:
```json
{
  "response": "Hello! How can I help you?",
  "usage": {
    "promptTokens": 10,
    "completionTokens": 20,
    "totalTokens": 30
  },
  "cost": {
    "tokens": 30,
    "thb": 0.42
  },
  "rateLimit": {
    "remaining": 4,
    "reset": 1735554000000,
    "limit": 5
  }
}
```

### 2. 流式聊天 API

**端点**: `POST /api/gemini/stream`

**请求体**: 同上

**响应**: Server-Sent Events (SSE)

```
data: {"text":"Hello"}
data: {"text":" there"}
data: {"text":"!"}
```

### 3. 多模态 API

**端点**: `POST /api/gemini/multimodal`

**请求体**:
```json
{
  "model": "gemini-flash",
  "prompt": "Describe this image",
  "imageBase64": "base64_encoded_image_data",
  "mimeType": "image/jpeg"
}
```

---

## 📤 文件上传 API

**端点**: `POST /api/upload`

**请求**: `multipart/form-data`

```
file: File (max 10MB)
userId: string
folder: string (optional, default: "uploads")
```

**响应**:
```json
{
  "success": true,
  "url": "https://firebasestorage.googleapis.com/...",
  "fileName": "image.jpg",
  "fileSize": 102400,
  "fileType": "image/jpeg"
}
```

**支持的文件类型**:
- 图片: JPEG, PNG, WebP, GIF
- 文档: PDF, DOC, DOCX, TXT

---

## 🔮 算命功能 API

### 支持的占卜类型

1. **塔罗牌**: `/api/divination/tarot`
2. **星座**: `/api/divination/astrology`
3. **易经**: `/api/divination/iching`
4. **解梦**: `/api/divination/dream`
5. **情感**: `/api/divination/love`

**端点**: `POST /api/divination/[type]`

**请求体**:
```json
{
  "question": "我最近的运势如何？",
  "birthDate": "1990-01-01",
  "gender": "男"
}
```

**响应**:
```json
{
  "type": "tarot",
  "question": "我最近的运势如何？",
  "response": "赛博神佛的占卜结果...",
  "usage": {
    "totalTokens": 500
  },
  "cost": {
    "tokens": 500,
    "thb": 7.00
  },
  "rateLimit": {
    "remaining": 4,
    "reset": 1735554000000,
    "limit": 5
  }
}
```

---

## 📝 论坛 API

### 1. 获取帖子列表

**端点**: `GET /api/forum/posts?category=ai-discussion&page=1&limit=20`

**响应**:
```json
{
  "posts": [
    {
      "id": "uuid",
      "user_id": "user123",
      "user_name": "DeepWeay",
      "title": "AI 讨论",
      "content": "帖子内容...",
      "category": "ai-discussion",
      "likes_count": 10,
      "replies_count": 5,
      "views_count": 100,
      "created_at": "2025-11-29T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 2. 创建帖子

**端点**: `POST /api/forum/posts`

**请求体**:
```json
{
  "userId": "user123",
  "userName": "DeepWeay",
  "title": "新帖子标题",
  "content": "帖子内容...",
  "category": "ai-discussion",
  "tags": ["AI", "讨论"]
}
```

### 3. 获取单个帖子

**端点**: `GET /api/forum/posts/[id]`

### 4. 获取回复

**端点**: `GET /api/forum/replies?postId=uuid`

### 5. 创建回复

**端点**: `POST /api/forum/replies`

```json
{
  "postId": "uuid",
  "userId": "user123",
  "userName": "DeepWeay",
  "content": "回复内容..."
}
```

### 6. 点赞/取消点赞

**端点**: `POST /api/forum/likes`

```json
{
  "userId": "user123",
  "targetType": "post" | "reply",
  "targetId": "uuid"
}
```

---

## 💰 用户管理 API

### 1. 获取 Token 统计

**端点**: `GET /api/user/tokens?userId=user123`

**响应**:
```json
{
  "tokens": 9999,
  "tokensUsed": 1234,
  "tier": "beta",
  "lastUpdated": "2025-11-29T00:00:00Z"
}
```

### 2. 扣除/增加 Tokens

**端点**: `POST /api/user/tokens`

```json
{
  "userId": "user123",
  "amount": 100,
  "operation": "deduct" | "add"
}
```

### 3. 获取对话历史

**端点**: `GET /api/user/conversations?userId=user123&limit=50`

### 4. 保存对话

**端点**: `POST /api/user/conversations`

```json
{
  "userId": "user123",
  "model": "gemini-flash",
  "messages": [...],
  "title": "对话标题",
  "tokens": 500
}
```

### 5. 删除对话

**端点**: `DELETE /api/user/conversations?id=conv123&userId=user123`

---

## 🔍 知识库搜索 API

**端点**: `POST /api/knowledge/search`

**请求体**:
```json
{
  "query": "AI 战略",
  "category": "ai-strategy",
  "limit": 20
}
```

**响应**:
```json
{
  "results": [
    {
      "objectID": "doc123",
      "title": "AI 战略核心",
      "content": "...",
      "category": "ai-strategy",
      "_highlightResult": {...}
    }
  ],
  "total": 10,
  "query": "AI 战略"
}
```

---

## 🤖 Bot 管理 API

### Telegram Webhook

**端点**: `POST /api/bots/telegram/webhook`

**请求体**: Telegram Update Object

**响应**:
```json
{
  "ok": true
}
```

**功能**:
- 接收 Telegram 消息
- 调用 Gemini API 生成回复
- 自动发送回复到用户

---

## 🔐 环境变量

所有 API 需要以下环境变量（参考 `.env.example`）：

```bash
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...

# Gemini API Keys（20个）
GEMINI_API_KEY_1=...
GEMINI_API_KEY_2=...
...

# Upstash Redis
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Algolia
ALGOLIA_APP_ID=...
ALGOLIA_SEARCH_API_KEY=...

# Telegram
TELEGRAM_BOT_TOKEN=...
```

---

## 🚦 限流规则

| 模型 | 每分钟请求数 | 每日请求数 |
|------|-------------|-----------|
| Gemini Lite | ∞ | ∞ |
| Gemini Flash | 5 | 100 |
| Gemini Pro (赛博神佛) | 5 | 50 |

---

## 💰 计费标准

| 模型 | 价格/1K tokens (THB) |
|------|---------------------|
| Gemini Lite | ฿0.00 (免费) |
| Gemini Flash | ฿0.14 |
| Gemini Pro | ฿7.00 |

---

## 📊 数据库结构

### Firebase Firestore

**users** 集合:
```json
{
  "uid": "user123",
  "email": "user@example.com",
  "displayName": "User",
  "tokens": 9999,
  "tokensUsed": 0,
  "tier": "beta",
  "role": "user",
  "createdAt": "2025-11-29T00:00:00Z"
}
```

**conversations** 集合:
```json
{
  "userId": "user123",
  "model": "gemini-flash",
  "messages": [...],
  "title": "Conversation Title",
  "tokens": 500,
  "createdAt": "2025-11-29T00:00:00Z"
}
```

### Supabase

参考 `lib/supabase/schema.sql`

---

**创建时间**: 2025-11-29
**状态**: ✅ 所有核心 API 已实现
**下一步**: 测试和优化
