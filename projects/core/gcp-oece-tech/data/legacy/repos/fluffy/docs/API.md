# Fluffy API 文档

## 基础信息

- **Base URL**: `http://localhost:3001/api`
- **认证方式**: JWT Bearer Token
- **内容类型**: `application/json`

## 认证接口

### 用户登录

**POST** `/auth/login`

登录并获取访问令牌。

**请求体**:
```json
{
  "email": "string",     // 用户邮箱
  "password": "string"   // 用户密码
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "string",   // JWT令牌
    "user": {
      "id": 1,
      "email": "admin@fluffy.com",
      "name": "系统管理员",
      "role": "admin"
    }
  }
}
```

**错误响应**:
```json
{
  "success": false,
  "error": "邮箱或密码错误"
}
```

### 用户注册

**POST** `/auth/register`

注册新用户账号。

**请求体**:
```json
{
  "email": "string",     // 用户邮箱
  "password": "string",  // 用户密码
  "name": "string"       // 用户姓名
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "token": "string",
    "user": {
      "id": 2,
      "email": "new@fluffy.com",
      "name": "新用户",
      "role": "user"
    }
  }
}
```

### 获取当前用户信息

**GET** `/auth/me`

获取当前登录用户的详细信息。

**请求头**:
```
Authorization: Bearer <token>
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "admin@fluffy.com", 
    "name": "系统管理员",
    "role": "admin"
  }
}
```

## 用户管理接口

### 获取用户列表

**GET** `/users`

获取所有用户列表。

**响应**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "张三",
      "email": "zhangsan@fluffy.com",
      "role": "admin"
    },
    {
      "id": 2,
      "name": "李四", 
      "email": "lisi@fluffy.com",
      "role": "user"
    }
  ],
  "total": 2
}
```

### 获取单个用户

**GET** `/users/:id`

根据ID获取用户详细信息。

**路径参数**:
- `id` (number): 用户ID

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "张三",
    "email": "zhangsan@fluffy.com", 
    "role": "admin"
  }
}
```

**错误响应**:
```json
{
  "success": false,
  "error": "用户不存在"
}
```

### 创建用户

**POST** `/users`

创建新用户。

**请求体**:
```json
{
  "name": "string",      // 用户姓名
  "email": "string",     // 用户邮箱
  "role": "string"       // 用户角色 (可选，默认: "user")
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "王五",
    "email": "wangwu@fluffy.com",
    "role": "user"
  }
}
```

### 更新用户

**PUT** `/users/:id`

更新用户信息。

**路径参数**:
- `id` (number): 用户ID

**请求体**:
```json
{
  "name": "string",      // 用户姓名
  "email": "string",     // 用户邮箱  
  "role": "string"       // 用户角色
}
```

**响应**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "更新后的姓名",
    "email": "updated@fluffy.com",
    "role": "admin"
  }
}
```

### 删除用户

**DELETE** `/users/:id`

删除指定用户。

**路径参数**:
- `id` (number): 用户ID

**响应**:
```json
{
  "success": true,
  "message": "用户删除成功"
}
```

## 系统接口

### 健康检查

**GET** `/health`

检查系统运行状态。

**响应**:
```json
{
  "status": "ok",
  "timestamp": "2023-12-20T10:30:00.000Z",
  "uptime": 3600
}
```

## 错误代码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权访问 |
| 403 | 访问被禁止 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 429 | 请求频率过高 |
| 500 | 服务器内部错误 |

## 响应格式

所有API响应都遵循统一格式：

**成功响应**:
```json
{
  "success": true,
  "data": <响应数据>,
  "message": "操作成功" // 可选
}
```

**错误响应**:
```json
{
  "success": false,
  "error": "错误描述"
}
```

## 使用示例

### cURL 示例

```bash
# 用户登录
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fluffy.com","password":"password"}'

# 获取用户列表
curl -X GET http://localhost:3001/api/users

# 创建用户
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"新用户","email":"new@example.com","role":"user"}'

# 获取当前用户信息 (需要先登录获取token)
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <your-jwt-token>"
```

### JavaScript/Fetch 示例

```javascript
// 登录
const login = async (email, password) => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.data.token);
    return data.data.user;
  }
  throw new Error(data.error);
};

// 获取用户列表
const getUsers = async () => {
  const response = await fetch('http://localhost:3001/api/users');
  const data = await response.json();
  return data.success ? data.data : [];
};

// 带认证的请求
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:3001/api/auth/me', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  const data = await response.json();
  return data.success ? data.data : null;
};
```

## 速率限制

- **窗口时间**: 15分钟
- **最大请求数**: 100次/IP
- **超出限制响应**: 429 状态码

## 安全注意事项

1. **JWT Token**: 24小时有效期
2. **CORS**: 仅允许配置的前端域名访问
3. **HTTPS**: 生产环境建议使用HTTPS
4. **密码**: 使用bcrypt加密存储