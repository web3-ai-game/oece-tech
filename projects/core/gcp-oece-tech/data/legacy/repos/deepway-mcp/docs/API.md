# API 文檔

## 認證 API

### POST /api/auth/register
註冊新用戶

**請求體：**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123",
  "name": "User Name"
}
```

### POST /api/auth/login
用戶登錄

**請求體：**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

## 論壇 API

### GET /api/posts
獲取帖子列表

**查詢參數：**
- `page`: 頁碼（默認 1）
- `limit`: 每頁數量（默認 20）
- `category`: 分類 slug
- `tag`: 標籤 slug
- `sort`: 排序方式（latest, popular, featured）

### POST /api/posts
創建新帖子

**請求體：**
```json
{
  "title": "帖子標題",
  "content": "帖子內容",
  "categoryId": "category-id",
  "tags": ["tag1", "tag2"]
}
```

### GET /api/posts/:slug
獲取單個帖子

### PUT /api/posts/:id
更新帖子

### DELETE /api/posts/:id
刪除帖子

## 商品 API

### GET /api/products
獲取商品列表

### POST /api/products
創建新商品

### GET /api/products/:slug
獲取單個商品

## 用戶 API

### GET /api/users/:username
獲取用戶資料

### PUT /api/users/:id
更新用戶資料

### GET /api/users/:id/posts
獲取用戶的帖子

## 錯誤碼

- 200: 成功
- 201: 創建成功
- 400: 請求錯誤
- 401: 未授權
- 403: 禁止訪問
- 404: 未找到
- 500: 服務器錯誤
