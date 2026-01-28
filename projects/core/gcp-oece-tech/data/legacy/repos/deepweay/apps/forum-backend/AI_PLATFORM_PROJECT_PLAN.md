# AI工具集合+论坛+教程平台 - 完整方案 🚀

## 🎯 项目目标

打造一个轻量级的AI工具聚合平台，包含：
- 📚 教程数据库/资料库
- 💬 加密论坛系统
- 🤖 AI工具集合
- 📝 Notion内容聚合
- 🔐 用户认证与权限

## 🏗️ 技术栈选择（低配VPS优化）

### 前端
```yaml
主框架: Next.js 14 (App Router)
  - SSR/SSG混合
  - 极致优化的性能
  - 内存占用: ~50MB

UI框架: 
  - TailwindCSS (无运行时)
  - shadcn/ui (组件库)
  - Lucide Icons

认证: NextAuth.js
```

### 后端
```yaml
语言: Go 1.21+
框架: Gin / Fiber (二选一)
  
数据库:
  - PostgreSQL (Firebase Supabase免费层)
  - SQLite (本地缓存)
  
缓存: Redis (可选，内存模式)

对象存储:
  - Firebase Storage (免费5GB)
  - Cloudflare R2 (免费10GB/月)
```

### 论坛系统
```yaml
推荐: Flarum (你想的那个！)
  - PHP 8+ (轻量)
  - 占用: ~20MB内存
  - 响应快: <50ms
  - 扩展丰富

备选: Discourse (Go版本)
  - 占用: ~100MB
  - 功能更强
```

## 📦 低配VPS成熟项目参考

### 1. Flarum - 轻量论坛 ⭐⭐⭐⭐⭐
```yaml
项目: flarum/flarum
语言: PHP 8
内存: 最低256MB，推荐512MB
特点:
  - 极致轻量
  - 现代UI
  - 扩展丰富
  - SEO友好
  
部署难度: ★★☆☆☆
维护成本: 低
```

### 2. GoHugo - 静态博客 ⭐⭐⭐⭐⭐
```yaml
项目: gohugoio/hugo
语言: Go
内存: 构建时~50MB，运行0MB（静态）
特点:
  - 超快构建
  - 完全静态
  - 0运行成本
  - CDN友好
  
部署难度: ★☆☆☆☆
维护成本: 极低
```

### 3. Answer - Go问答系统 ⭐⭐⭐⭐
```yaml
项目: answerdev/answer
语言: Go + React
内存: 128MB-256MB
特点:
  - Stack Overflow克隆
  - Go编写，性能优秀
  - 内置SEO
  - 插件系统
  
部署难度: ★★★☆☆
维护成本: 中
```

### 4. Payload CMS - 无头CMS ⭐⭐⭐⭐
```yaml
项目: payloadcms/payload
语言: TypeScript
内存: 256MB-512MB
特点:
  - 现代无头CMS
  - GraphQL + REST
  - 自动生成Admin
  - TypeScript全栈
  
部署难度: ★★★☆☆
维护成本: 中
```

### 5. Supabase（自托管版）⭐⭐⭐⭐
```yaml
项目: supabase/supabase
语言: TypeScript + PostgreSQL
内存: 1GB起（可优化到512MB）
特点:
  - Firebase替代品
  - PostgreSQL + Auth + Storage
  - 实时订阅
  - 自动API生成
  
部署难度: ★★★★☆
维护成本: 中高
```

## 🎨 推荐架构方案

### 方案A：极简轻量（512MB VPS）

```
架构:
┌─────────────────────────────────────┐
│   Cloudflare CDN (免费)             │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Caddy (自动HTTPS)                 │
│   - 反向代理                        │
│   - 静态文件服务                    │
│   内存: ~10MB                       │
└─────────────────────────────────────┘
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
┌─────────┐      ┌──────────────┐
│ Flarum  │      │   Go Backend │
│ 论坛    │      │   - API服务  │
│ 20MB    │      │   - AI工具   │
│         │      │   - 资料库   │
└─────────┘      │   20MB       │
                 └──────────────┘
                       ↓
              ┌────────────────┐
              │ Firebase/Supa  │
              │ (免费层)       │
              └────────────────┘
              
总内存占用: ~50MB
CPU: 0.5 vCPU
磁盘: 5GB
成本: $5/月
```

### 方案B：标准配置（1GB VPS）

```
架构:
┌─────────────────────────────────────┐
│   Cloudflare (CDN + WAF)            │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│   Nginx/Caddy                       │
│   - 负载均衡                        │
│   - SSL终止                         │
│   - 缓存                            │
└─────────────────────────────────────┘
              ↓
    ┌─────────┴──────────┬────────────┐
    ↓                    ↓            ↓
┌─────────┐      ┌──────────┐   ┌──────────┐
│ Flarum  │      │ Next.js  │   │ Go API   │
│ 论坛    │      │ 前端     │   │ 后端     │
│ 50MB    │      │ 50MB     │   │ 30MB     │
└─────────┘      └──────────┘   └──────────┘
                       ↓              ↓
              ┌────────┴──────────────┤
              ↓                       ↓
        ┌──────────┐           ┌──────────┐
        │ Firebase │           │ Redis    │
        │ 免费层   │           │ 内存模式 │
        └──────────┘           │ 20MB     │
                               └──────────┘
                               
总内存占用: ~180MB
CPU: 1 vCPU
磁盘: 10GB
成本: $10/月
```

## 🔐 加密加锁方案

### 1. 论坛加密

#### Flarum扩展
```php
// 私密板块插件
use Flarum\Extend;

return [
    (new Extend\Routes('api'))
        ->post('/discussions/encrypted', 'discussions.encrypted', 
               Controllers\CreateEncryptedDiscussion::class),
];

// 加密逻辑
class EncryptedDiscussion {
    public function encrypt($content, $key) {
        return openssl_encrypt($content, 'AES-256-CBC', $key);
    }
    
    public function decrypt($encrypted, $key) {
        return openssl_decrypt($encrypted, 'AES-256-CBC', $key);
    }
}
```

#### Go实现
```go
package encryption

import (
    "crypto/aes"
    "crypto/cipher"
    "crypto/rand"
    "encoding/base64"
    "io"
)

type ContentEncryptor struct {
    key []byte
}

func NewEncryptor(key string) *ContentEncryptor {
    return &ContentEncryptor{
        key: []byte(key),
    }
}

func (e *ContentEncryptor) Encrypt(plaintext string) (string, error) {
    block, err := aes.NewCipher(e.key)
    if err != nil {
        return "", err
    }
    
    ciphertext := make([]byte, aes.BlockSize+len(plaintext))
    iv := ciphertext[:aes.BlockSize]
    
    if _, err := io.ReadFull(rand.Reader, iv); err != nil {
        return "", err
    }
    
    stream := cipher.NewCFBEncrypter(block, iv)
    stream.XORKeyStream(ciphertext[aes.BlockSize:], []byte(plaintext))
    
    return base64.URLEncoding.EncodeToString(ciphertext), nil
}

func (e *ContentEncryptor) Decrypt(encrypted string) (string, error) {
    ciphertext, _ := base64.URLEncoding.DecodeString(encrypted)
    
    block, err := aes.NewCipher(e.key)
    if err != nil {
        return "", err
    }
    
    if len(ciphertext) < aes.BlockSize {
        return "", errors.New("ciphertext too short")
    }
    
    iv := ciphertext[:aes.BlockSize]
    ciphertext = ciphertext[aes.BlockSize:]
    
    stream := cipher.NewCFBDecrypter(block, iv)
    stream.XORKeyStream(ciphertext, ciphertext)
    
    return string(ciphertext), nil
}
```

### 2. 权限控制

```go
type Permission struct {
    UserID    int64
    Resource  string
    Action    string
    ExpiresAt time.Time
}

type ACL struct {
    permissions map[string][]Permission
    mu          sync.RWMutex
}

func (acl *ACL) CanAccess(userID int64, resource, action string) bool {
    acl.mu.RLock()
    defer acl.mu.RUnlock()
    
    key := fmt.Sprintf("%d:%s:%s", userID, resource, action)
    perms, exists := acl.permissions[key]
    
    if !exists {
        return false
    }
    
    // 检查是否过期
    for _, perm := range perms {
        if perm.ExpiresAt.After(time.Now()) {
            return true
        }
    }
    
    return false
}

// 使用示例
func ProtectedHandler(c *gin.Context) {
    userID := getUserID(c)
    
    if !acl.CanAccess(userID, "forum:premium", "read") {
        c.JSON(403, gin.H{"error": "Access denied"})
        return
    }
    
    // 返回加密内容
    encryptor := NewEncryptor(getEncryptionKey(userID))
    content := getContent(c.Param("id"))
    encrypted, _ := encryptor.Encrypt(content)
    
    c.JSON(200, gin.H{"content": encrypted})
}
```

## 📚 Notion集成方案

### 1. Notion API客户端（Go）

```go
package notion

import (
    "context"
    "github.com/jomei/notionapi"
)

type NotionClient struct {
    client *notionapi.Client
}

func NewNotionClient(token string) *NotionClient {
    return &NotionClient{
        client: notionapi.NewClient(notionapi.Token(token)),
    }
}

// 读取数据库
func (nc *NotionClient) GetDatabase(databaseID string) ([]notionapi.Page, error) {
    ctx := context.Background()
    
    query := &notionapi.DatabaseQueryRequest{
        Sorts: []notionapi.SortObject{
            {
                Property:  "Created",
                Direction: notionapi.SortOrderDESC,
            },
        },
    }
    
    result, err := nc.client.Database.Query(ctx, notionapi.DatabaseID(databaseID), query)
    if err != nil {
        return nil, err
    }
    
    return result.Results, nil
}

// 同步到本地
func (nc *NotionClient) SyncToLocal(databaseID string, storage Storage) error {
    pages, err := nc.GetDatabase(databaseID)
    if err != nil {
        return err
    }
    
    for _, page := range pages {
        article := convertPageToArticle(page)
        storage.Save(article)
    }
    
    return nil
}

// 转换Notion页面为文章
func convertPageToArticle(page notionapi.Page) Article {
    return Article{
        ID:        string(page.ID),
        Title:     getTitle(page.Properties),
        Content:   getContent(page),
        Tags:      getTags(page.Properties),
        CreatedAt: page.CreatedTime,
        UpdatedAt: page.LastEditedTime,
    }
}
```

### 2. 自动同步服务

```go
type NotionSyncService struct {
    client   *NotionClient
    storage  Storage
    interval time.Duration
}

func (nss *NotionSyncService) Start() {
    ticker := time.NewTicker(nss.interval)
    
    for range ticker.C {
        log.Println("🔄 Syncing from Notion...")
        
        databases := []string{
            "database_id_1", // 教程
            "database_id_2", // 文档
            "database_id_3", // FAQ
        }
        
        for _, dbID := range databases {
            if err := nss.client.SyncToLocal(dbID, nss.storage); err != nil {
                log.Printf("❌ Sync failed for %s: %v", dbID, err)
                continue
            }
            log.Printf("✅ Synced database: %s", dbID)
        }
    }
}
```

## 🔥 Firebase集成（免费层）

### Firebase配置
```yaml
免费配额:
  - Firestore: 1GB存储, 50K读/天, 20K写/天
  - Storage: 5GB
  - Functions: 125K调用/月
  - Hosting: 10GB/月
  - Authentication: 无限制
```

### Go Firebase SDK

```go
package firebase

import (
    "context"
    firebase "firebase.google.com/go"
    "firebase.google.com/go/auth"
    "google.golang.org/api/option"
)

type FirebaseService struct {
    app  *firebase.App
    auth *auth.Client
}

func NewFirebaseService(credFile string) (*FirebaseService, error) {
    opt := option.WithCredentialsFile(credFile)
    app, err := firebase.NewApp(context.Background(), nil, opt)
    if err != nil {
        return nil, err
    }
    
    authClient, err := app.Auth(context.Background())
    if err != nil {
        return nil, err
    }
    
    return &FirebaseService{
        app:  app,
        auth: authClient,
    }, nil
}

// 验证Token
func (fs *FirebaseService) VerifyToken(token string) (*auth.Token, error) {
    ctx := context.Background()
    return fs.auth.VerifyIDToken(ctx, token)
}

// 创建用户
func (fs *FirebaseService) CreateUser(email, password string) (*auth.UserRecord, error) {
    ctx := context.Background()
    params := (&auth.UserToCreate{}).
        Email(email).
        Password(password).
        EmailVerified(false)
    
    return fs.auth.CreateUser(ctx, params)
}

// Gin中间件
func (fs *FirebaseService) AuthMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        token := c.GetHeader("Authorization")
        token = strings.TrimPrefix(token, "Bearer ")
        
        decoded, err := fs.VerifyToken(token)
        if err != nil {
            c.JSON(401, gin.H{"error": "Unauthorized"})
            c.Abort()
            return
        }
        
        c.Set("userID", decoded.UID)
        c.Next()
    }
}
```

## 🚀 完整部署方案

### Docker Compose配置

```yaml
version: '3.8'

services:
  # Caddy反向代理
  caddy:
    image: caddy:2-alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 20M

  # Go后端
  api:
    build: ./go_backend
    image: svs-api:latest
    environment:
      - FIREBASE_CREDS=/secrets/firebase.json
      - NOTION_TOKEN=${NOTION_TOKEN}
      - DATABASE_URL=${DATABASE_URL}
    volumes:
      - ./secrets:/secrets:ro
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 50M
          cpus: '0.25'

  # Flarum论坛
  flarum:
    image: mondedie/flarum:stable
    environment:
      - DB_HOST=db
      - DB_NAME=flarum
      - DB_USER=flarum
      - DB_PASS=${DB_PASSWORD}
    depends_on:
      - db
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 50M

  # PostgreSQL (可选，或用Firebase)
  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=flarum
      - POSTGRES_USER=flarum
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/postgresql/data
    deploy:
      resources:
        limits:
          memory: 50M

  # Redis缓存(可选)
  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 20mb --maxmemory-policy allkeys-lru
    deploy:
      resources:
        limits:
          memory: 30M

volumes:
  caddy_data:
  db_data:
```

### Caddyfile配置

```caddy
{
    email your@email.com
}

ai-platform.com {
    # 前端(静态或Next.js)
    reverse_proxy /api/* api:8080
    reverse_proxy /forum/* flarum:80
    
    # 静态资源缓存
    @static {
        path *.js *.css *.png *.jpg *.ico
    }
    header @static Cache-Control "public, max-age=31536000"
    
    # 压缩
    encode gzip
    
    # 日志
    log {
        output file /var/log/caddy/access.log
        format json
    }
}
```

## 📋 部署确认清单

### 1. 基础设施 ✅

- [ ] **VPS购买**
  - 供应商: DigitalOcean / Vultr / Hetzner
  - 配置: 1GB RAM, 1 vCPU, 25GB SSD
  - 位置: 选择离用户近的
  - 成本: $5-10/月

- [ ] **域名配置**
  - [ ] 购买域名
  - [ ] DNS配置(Cloudflare)
  - [ ] SSL证书(Let's Encrypt自动)

- [ ] **CDN设置**
  - [ ] Cloudflare免费计划
  - [ ] 缓存规则配置
  - [ ] WAF规则设置

### 2. Firebase设置 ✅

- [ ] **创建项目**
  - [ ] Firebase Console创建项目
  - [ ] 启用Authentication
  - [ ] 启用Firestore
  - [ ] 启用Storage

- [ ] **获取凭证**
  - [ ] 下载service account JSON
  - [ ] 配置Web API Key
  - [ ] 设置安全规则

- [ ] **配额监控**
  - [ ] 设置告警(80%配额)
  - [ ] 配置备份策略

### 3. Notion集成 ✅

- [ ] **API设置**
  - [ ] 创建Integration
  - [ ] 获取Token
  - [ ] 共享数据库

- [ ] **数据库结构**
  - [ ] 教程数据库
  - [ ] 文档数据库
  - [ ] FAQ数据库

### 4. Doppler密钥管理 ✅

- [ ] **项目设置**
  - [ ] 创建Doppler项目
  - [ ] 配置环境(dev/staging/prod)
  - [ ] 上传所有密钥

- [ ] **集成配置**
  - [ ] GitHub Actions集成
  - [ ] Docker集成
  - [ ] Webhook配置

### 5. 代码部署 ✅

- [ ] **Go后端**
  - [ ] 编译测试
  - [ ] Docker镜像构建
  - [ ] 健康检查端点

- [ ] **Flarum论坛**
  - [ ] 安装配置
  - [ ] 插件安装
  - [ ] 主题定制

- [ ] **前端**
  - [ ] Next.js构建
  - [ ] 静态资源优化
  - [ ] CDN配置

### 6. 监控告警 ✅

- [ ] **系统监控**
  - [ ] Uptime监控(UptimeRobot免费)
  - [ ] 资源监控(htop/netdata)
  - [ ] 日志聚合

- [ ] **告警设置**
  - [ ] 服务宕机告警
  - [ ] 磁盘空间告警
  - [ ] 流量异常告警

## 💰 成本估算

### 月度成本
```
VPS(1GB):           $10
域名:               $1 (年费/12)
Cloudflare:         $0 (免费)
Firebase:           $0 (免费层)
Doppler:            $0 (免费5用户)
监控:               $0 (免费工具)
----------------------------
总计:               ~$11/月
```

### 可服务规模
```
用户数:             1000-5000 DAU
并发:               100-500
存储:               5GB + 数据库
带宽:               1TB/月
```

## 🎯 下一步行动

### 立即可做(今天)
1. [ ] VPS购买和配置
2. [ ] Firebase项目创建
3. [ ] Doppler项目设置
4. [ ] GitHub仓库创建

### 本周完成
1. [ ] Go后端完整实现
2. [ ] Flarum安装配置
3. [ ] Notion API集成
4. [ ] 基础部署完成

### 两周完成
1. [ ] 前端开发完成
2. [ ] AI工具集成
3. [ ] 加密功能测试
4. [ ] 性能优化

### 一个月上线
1. [ ] 全面测试
2. [ ] 文档完善
3. [ ] SEO优化
4. [ ] 正式发布

---

**项目特色**: 极致轻量 + 现代架构 + 完全免费(基础版)  
**技术栈**: Go + Flarum + Firebase + Notion  
**适合**: 个人开发者、小团队、创业项目
