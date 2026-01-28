# 🔧 Mini Gemini API 配置指南

## 快速开始

Mini Gemini Chat 默认使用内置的 Gemini API，但你可以轻松配置成使用你自己调教后的模型！

## 配置自定义 API

### 方法 1：使用环境变量（推荐）

在项目根目录的 `.env.local` 文件中添加：

```env
# 自定义 API 端点
NEXT_PUBLIC_CHAT_API_ENDPOINT=https://your-custom-api.com/chat

# 可选：模型配置
NEXT_PUBLIC_CHAT_MODEL=gemini-1.5-pro-tuned
NEXT_PUBLIC_CHAT_TEMPERATURE=0.8
NEXT_PUBLIC_CHAT_MAX_TOKENS=4096
```

### 方法 2：直接修改配置文件

编辑 `config/chat.ts` 文件：

```typescript
export const chatConfig = {
  // 修改这里的 API 端点
  apiEndpoint: 'https://your-custom-api.com/chat',
  
  model: {
    name: 'your-model-name',
    temperature: 0.8,
    maxTokens: 4096,
  },
};
```

## API 接口规范

### 请求格式

你的自定义 API 需要接受以下格式的 POST 请求：

```json
POST /chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "你好"
    },
    {
      "role": "assistant", 
      "content": "你好！有什么我可以帮助你的吗？"
    },
    {
      "role": "user",
      "content": "告诉我今天天气怎么样"
    }
  ]
}
```

### 响应格式

你的 API 应该返回以下格式：

```json
{
  "message": "这是 AI 的回复内容",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 完整示例

### 使用 Google Cloud Function

```python
from flask import Flask, request, jsonify
from google.cloud import aiplatform
import vertexai
from vertexai.generative_models import GenerativeModel

app = Flask(__name__)

# 初始化 Vertex AI
vertexai.init(project="your-project", location="us-central1")
model = GenerativeModel("gemini-1.5-pro-tuned")

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    messages = data.get('messages', [])
    
    # 转换消息格式
    chat = model.start_chat()
    
    # 发送消息并获取响应
    for msg in messages[:-1]:
        chat.send_message(msg['content'])
    
    # 获取最后一条消息的响应
    response = chat.send_message(messages[-1]['content'])
    
    return jsonify({
        'message': response.text,
        'timestamp': datetime.now().isoformat()
    })
```

### 使用 Vercel Serverless Function

创建 `api/chat.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { messages } = await request.json();
  
  // 调用你的自定义 Gemini API
  const response = await fetch('https://your-gemini-endpoint.com/v1/chat', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.YOUR_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messages }),
  });
  
  const data = await response.json();
  
  return NextResponse.json({
    message: data.response,
    timestamp: new Date().toISOString(),
  });
}
```

## 高级配置

### 添加自定义请求头

编辑 `app/(dashboard)/dashboard/tools/chat/page.tsx`:

```typescript
const response = await fetch(chatConfig.apiEndpoint, {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.NEXT_PUBLIC_YOUR_API_KEY}`,
    // 添加更多自定义头
  },
  body: JSON.stringify({
    messages: [...],
    // 添加更多参数
    temperature: chatConfig.model.temperature,
    max_tokens: chatConfig.model.maxTokens,
  }),
});
```

### 自定义系统提示词

如果你的 API 支持系统提示词：

```typescript
const response = await fetch(chatConfig.apiEndpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    system: "你是一个专业的AI助手...",  // 系统提示词
    messages: [...messages, userMessage].map((m) => ({
      role: m.role,
      content: m.content,
    })),
  }),
});
```

## 测试你的配置

1. 修改配置文件或添加环境变量
2. 重启开发服务器：
   ```bash
   npm run dev
   ```
3. 访问 http://localhost:3000/dashboard/tools/chat
4. 发送测试消息

## 常见问题

### Q: API 调用失败怎么办？

A: 检查以下几点：
- API 端点 URL 是否正确
- 网络连接是否正常
- API 返回格式是否符合规范
- 查看浏览器控制台的错误信息

### Q: 如何调试 API 请求？

A: 在浏览器开发者工具的 Network 标签中查看请求详情

### Q: 可以使用其他 AI 模型吗？

A: 可以！只要你的 API 遵循上述请求/响应格式，可以使用任何 AI 模型

### Q: 如何添加请求认证？

A: 在环境变量中添加 API Key，然后在请求头中使用：
```env
NEXT_PUBLIC_YOUR_API_KEY=your-api-key-here
```

## 示例配置

### 使用自己的 Gemini Pro 模型
```env
NEXT_PUBLIC_CHAT_API_ENDPOINT=https://your-vertex-ai.com/gemini
NEXT_PUBLIC_CHAT_MODEL=gemini-1.5-pro-custom
NEXT_PUBLIC_CHAT_TEMPERATURE=0.7
```

### 使用 OpenAI 兼容接口
```env
NEXT_PUBLIC_CHAT_API_ENDPOINT=https://api.openai.com/v1/chat/completions
NEXT_PUBLIC_CHAT_MODEL=gpt-4
```

### 使用本地部署的模型
```env
NEXT_PUBLIC_CHAT_API_ENDPOINT=http://localhost:8000/chat
NEXT_PUBLIC_CHAT_MODEL=local-llama-2
```

## 安全建议

⚠️ **重要提示**：
- 不要在客户端代码中硬编码 API 密钥
- 使用环境变量存储敏感信息
- 如果需要 API Key，建议通过后端代理请求
- 生产环境请使用 HTTPS

## 性能优化

### 启用流式响应（可选）

如果你的 API 支持流式响应，可以实现打字机效果：

```typescript
const response = await fetch(chatConfig.apiEndpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    messages: [...],
    stream: true,  // 启用流式响应
  }),
});

const reader = response.body?.getReader();
// 处理流式数据...
```

## 获取帮助

如果遇到问题：
1. 查看浏览器控制台错误信息
2. 检查 API 端点是否可访问
3. 验证 API 响应格式
4. 查看示例代码

---

祝你配置成功！享受你的定制 Mini Gemini！🚀
