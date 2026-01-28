# SVS-MCP API Documentation

Complete API documentation for all SVS-MCP platform services.

## Base URLs

- Knowledge Base: `http://localhost:3001`
- AI Bot: `http://localhost:3002`
- AI Tools: `http://localhost:3003`
- Forum: `http://localhost:3004`

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Knowledge Base Service (Port 3001)

MCP-compatible knowledge graph server for storing and querying entities and relationships.

### Create Entities

Create multiple entities in the knowledge graph.

**Endpoint:** `POST /tools/create_entities`

**Request:**
```json
{
  "entities": [
    {
      "name": "John Doe",
      "entityType": "person",
      "observations": [
        "Software engineer",
        "Works at OpenAI",
        "Interested in AI"
      ]
    }
  ]
}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe"
  }
]
```

### Create Relations

Create relationships between entities.

**Endpoint:** `POST /tools/create_relations`

**Request:**
```json
{
  "relations": [
    {
      "from": "John Doe",
      "to": "OpenAI",
      "relationType": "works_at"
    }
  ]
}
```

### Search Nodes

Search entities by name or observations.

**Endpoint:** `POST /tools/search_nodes`

**Request:**
```json
{
  "query": "software engineer"
}
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "type": "person",
    "observations": ["Software engineer", "..."]
  }
]
```

### Read Graph

Get overview of the knowledge graph.

**Endpoint:** `POST /tools/read_graph`

**Response:**
```json
{
  "entities": 150,
  "relations": 230
}
```

---

## AI Bot Service (Port 3002)

AI-powered chat service with multi-model support.

### Health Check

**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "healthy",
  "service": "aibot",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "openai": true,
  "anthropic": true
}
```

### Chat Completion

Send messages to AI models.

**Endpoint:** `POST /api/chat`

**Request:**
```json
{
  "messages": [
    {
      "role": "system",
      "content": "You are a helpful assistant."
    },
    {
      "role": "user",
      "content": "Hello!"
    }
  ],
  "provider": "openai",
  "model": "gpt-4o-mini",
  "temperature": 0.7,
  "max_tokens": 2000
}
```

**Parameters:**
- `messages` (required): Array of chat messages
- `provider` (optional): `openai` or `anthropic` (default: `openai`)
- `model` (optional): Model identifier
- `temperature` (optional): 0-2 (default: 0.7)
- `max_tokens` (optional): Maximum response tokens

**Response:**
```json
{
  "content": "Hello! How can I help you today?",
  "model": "gpt-4o-mini",
  "usage": {
    "prompt_tokens": 20,
    "completion_tokens": 10,
    "total_tokens": 30
  }
}
```

### Streaming Chat

Stream AI responses in real-time.

**Endpoint:** `POST /api/chat/stream`

**Request:** Same as chat completion

**Response:** Server-Sent Events (SSE) stream
```
data: {"content": "Hello", "delta": "Hello"}
data: {"content": "Hello!", "delta": "!"}
data: [DONE]
```

---

## AI Tools Service (Port 3003)

Utility AI services for text processing and analysis.

### Health Check

**Endpoint:** `GET /health`

### Text Summarization

Summarize long text content.

**Endpoint:** `POST /api/tools/summarize`

**Request:**
```json
{
  "text": "Long text content to summarize...",
  "max_length": 200,
  "style": "bullet_points"
}
```

**Parameters:**
- `text` (required): Text to summarize
- `max_length` (optional): Maximum summary length
- `style` (optional): `paragraph` or `bullet_points`

**Response:**
```json
{
  "summary": "Summarized content...",
  "original_length": 1000,
  "summary_length": 150
}
```

### Text Translation

Translate text between languages.

**Endpoint:** `POST /api/tools/translate`

**Request:**
```json
{
  "text": "Hello world",
  "target_language": "es",
  "source_language": "en"
}
```

**Response:**
```json
{
  "translated_text": "Hola mundo",
  "source_language": "en",
  "target_language": "es"
}
```

### Sentiment Analysis

Analyze text sentiment.

**Endpoint:** `POST /api/tools/sentiment`

**Request:**
```json
{
  "text": "I love this product!"
}
```

**Response:**
```json
{
  "sentiment": "positive",
  "score": 0.95,
  "emotions": {
    "joy": 0.9,
    "trust": 0.8
  }
}
```

### Code Analysis

Analyze and explain code.

**Endpoint:** `POST /api/tools/code/analyze`

**Request:**
```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript"
}
```

**Response:**
```json
{
  "explanation": "This is a simple addition function...",
  "complexity": "O(1)",
  "suggestions": [
    "Add type checking",
    "Add JSDoc comments"
  ]
}
```

---

## Forum Service (Port 3004)

Community forum with user management.

### Health Check

**Endpoint:** `GET /health`

### User Registration

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Validation:**
- Username: 3-50 characters, alphanumeric
- Email: Valid email format
- Password: Minimum 6 characters

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### User Login

Authenticate and receive JWT token.

**Endpoint:** `POST /api/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```

### List Topics

Get all forum topics with pagination.

**Endpoint:** `GET /api/topics?page=1&limit=20`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)

**Response:**
```json
{
  "topics": [
    {
      "id": 1,
      "title": "Welcome to the forum",
      "description": "Introduction topic",
      "username": "johndoe",
      "post_count": 5,
      "is_pinned": true,
      "is_locked": false,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-02T00:00:00.000Z"
    }
  ],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

### Create Topic

Create a new forum topic (requires authentication).

**Endpoint:** `POST /api/topics`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "My new topic",
  "description": "Topic description"
}
```

**Validation:**
- Title: 5-255 characters
- Description: Optional

**Response:**
```json
{
  "topic": {
    "id": 2,
    "title": "My new topic",
    "description": "Topic description",
    "user_id": 1,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Get Topic Posts

Get all posts in a topic.

**Endpoint:** `GET /api/topics/:topicId/posts?page=1&limit=50`

**Response:**
```json
{
  "posts": [
    {
      "id": 1,
      "topic_id": 1,
      "username": "johndoe",
      "content": "Post content...",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "total": 50,
  "page": 1,
  "limit": 50
}
```

### Create Post

Add a post to a topic (requires authentication).

**Endpoint:** `POST /api/topics/:topicId/posts`

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "content": "My post content..."
}
```

**Validation:**
- Content: 1-10000 characters
- Topic must exist and not be locked

**Response:**
```json
{
  "post": {
    "id": 1,
    "topic_id": 1,
    "user_id": 1,
    "content": "My post content...",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Error Responses

All services return consistent error responses:

```json
{
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "timestamp": "2024-01-01T00:00:00.000Z",
    "errors": ["Specific error 1", "Specific error 2"]
  }
}
```

### Common Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error
- `502 Bad Gateway` - External service error
- `503 Service Unavailable` - Service down

---

## Rate Limiting

All services implement rate limiting:

- **Window:** 15 minutes (configurable)
- **Max Requests:** 100 per window (configurable)
- **Headers:**
  - `X-RateLimit-Limit`: Maximum requests
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## CORS

CORS is enabled for configured origins. Default: `*` (all origins)

Configure via environment variable:
```
CORS_ORIGIN=http://localhost:3000,https://example.com
```

---

## Examples

### cURL Examples

**AI Chat:**
```bash
curl -X POST http://localhost:3002/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "provider": "openai"
  }'
```

**Forum Login:**
```bash
curl -X POST http://localhost:3004/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password"
  }'
```

### JavaScript Examples

**Using Fetch:**
```javascript
// AI Chat
const response = await fetch('http://localhost:3002/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    messages: [{ role: 'user', content: 'Hello' }],
    provider: 'openai',
  }),
});
const data = await response.json();

// Forum with Auth
const token = 'your-jwt-token';
const topicResponse = await fetch('http://localhost:3004/api/topics', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    title: 'My Topic',
    description: 'Description',
  }),
});
```

---

## Support

For issues or questions:
- GitHub: https://github.com/web3-ai-game/svs-mcp
- Email: support@svs-mcp.com

## License

MIT
