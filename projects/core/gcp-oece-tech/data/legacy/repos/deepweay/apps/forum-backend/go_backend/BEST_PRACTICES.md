# Go最佳实践借鉴 🎯

## 🔍 成熟案例参考

### 1. 路由设计 - 借鉴 Gin & Chi

#### 参考项目
- **Gin**: github.com/gin-gonic/gin
- **Chi**: github.com/go-chi/chi
- **Echo**: github.com/labstack/echo

#### 我们的实现优化
```go
// 借鉴Gin的中间件模式
type HandlerFunc func(*Context) error

type Router struct {
    handlers map[string]HandlerFunc
    middleware []MiddlewareFunc
}

// 借鉴Chi的路由组
func (r *Router) Group(pattern string) *Router {
    return &Router{
        prefix: pattern,
        parent: r,
    }
}
```

### 2. 密钥管理 - 借鉴 Vault & Doppler

#### 参考项目
- **HashiCorp Vault**: github.com/hashicorp/vault
- **SOPS**: github.com/mozilla/sops
- **Doppler CLI**: github.com/DopplerHQ/cli

#### 核心设计模式

##### A. 密钥轮换（Key Rotation）
```go
// 借鉴Vault的密钥版本管理
type KeyVersion struct {
    Key       string
    Version   int
    CreatedAt time.Time
    ExpiresAt time.Time
    Status    KeyStatus
}

type KeyManager struct {
    current  *KeyVersion
    previous *KeyVersion
    next     *KeyVersion
}

// 自动轮换
func (km *KeyManager) Rotate() error {
    km.previous = km.current
    km.current = km.next
    km.next = km.generateNew()
    return nil
}
```

##### B. 熔断器模式（Circuit Breaker）
```go
// 借鉴 github.com/sony/gobreaker
type CircuitBreaker struct {
    maxRequests   uint32
    interval      time.Duration
    timeout       time.Duration
    readyToTrip   func(counts Counts) bool
    onStateChange func(name string, from State, to State)
    
    mutex      sync.Mutex
    state      State
    generation uint64
    counts     Counts
    expiry     time.Time
}
```

##### C. 限流器（Rate Limiter）
```go
// 借鉴 golang.org/x/time/rate
import "golang.org/x/time/rate"

type KeyRateLimiter struct {
    limiters map[string]*rate.Limiter
    mu       sync.RWMutex
    r        rate.Limit  // per second
    b        int         // burst
}

func (krl *KeyRateLimiter) Allow(key string) bool {
    krl.mu.Lock()
    limiter, exists := krl.limiters[key]
    if !exists {
        limiter = rate.NewLimiter(krl.r, krl.b)
        krl.limiters[key] = limiter
    }
    krl.mu.Unlock()
    
    return limiter.Allow()
}
```

### 3. 配置管理 - 借鉴 Viper

#### 参考项目
- **Viper**: github.com/spf13/viper
- **Envconfig**: github.com/kelseyhightower/envconfig

#### 优化实现
```go
// 借鉴Viper的配置热重载
import "github.com/fsnotify/fsnotify"

type ConfigWatcher struct {
    watcher  *fsnotify.Watcher
    config   *Config
    onChange func(*Config)
}

func (cw *ConfigWatcher) Watch() {
    go func() {
        for {
            select {
            case event := <-cw.watcher.Events:
                if event.Op&fsnotify.Write == fsnotify.Write {
                    cw.reload()
                }
            }
        }
    }()
}
```

### 4. 并发控制 - 借鉴 Uber Go Patterns

#### 参考资源
- **Uber Go Style Guide**: github.com/uber-go/guide
- **errgroup**: golang.org/x/sync/errgroup

#### Worker Pool模式
```go
// 借鉴Uber的worker pool实现
type WorkerPool struct {
    workers   int
    tasks     chan Task
    results   chan Result
    wg        sync.WaitGroup
}

func (wp *WorkerPool) Start() {
    for i := 0; i < wp.workers; i++ {
        wp.wg.Add(1)
        go wp.worker()
    }
}

func (wp *WorkerPool) worker() {
    defer wp.wg.Done()
    for task := range wp.tasks {
        result := task.Execute()
        wp.results <- result
    }
}
```

### 5. 错误处理 - 借鉴 pkg/errors

#### 参考项目
- **pkg/errors**: github.com/pkg/errors
- **Go 1.13+ errors**

#### 错误包装
```go
import "fmt"

// 自定义错误类型
type APIError struct {
    Code    string
    Message string
    Err     error
}

func (e *APIError) Error() string {
    if e.Err != nil {
        return fmt.Sprintf("%s: %s: %v", e.Code, e.Message, e.Err)
    }
    return fmt.Sprintf("%s: %s", e.Code, e.Message)
}

func (e *APIError) Unwrap() error {
    return e.Err
}
```

### 6. 日志记录 - 借鉴 Zap & Logrus

#### 参考项目
- **Zap**: github.com/uber-go/zap (我们已使用)
- **Zerolog**: github.com/rs/zerolog

#### 结构化日志
```go
// 已实现，但可以增强
logger.Info("API request",
    zap.String("method", "POST"),
    zap.String("path", "/api/chat"),
    zap.Duration("latency", duration),
    zap.Int("status", 200),
    zap.String("user_id", userID),
)
```

### 7. 健康检查 - 借鉴 Kubernetes

#### 参考标准
- **Kubernetes Probes**
- **gRPC Health Checking Protocol**

#### 实现
```go
type HealthChecker struct {
    checks map[string]HealthCheck
}

type HealthCheck func(context.Context) error

func (hc *HealthChecker) AddCheck(name string, check HealthCheck) {
    hc.checks[name] = check
}

func (hc *HealthChecker) Check(ctx context.Context) error {
    for name, check := range hc.checks {
        if err := check(ctx); err != nil {
            return fmt.Errorf("%s failed: %w", name, err)
        }
    }
    return nil
}
```

## 🎯 优化后的密钥路由架构

### 分层设计
```
┌─────────────────────────────────────┐
│         API Gateway                 │
│  (Load Balancer + Rate Limiter)    │
└─────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│      Key Router (Smart)             │
│  - User Role Recognition            │
│  - Key Pool Management              │
│  - Circuit Breaker                  │
│  - Fallback Strategy                │
└─────────────────────────────────────┘
              │
        ┌─────┴─────┬─────────┬──────────┐
        ▼           ▼         ▼          ▼
    ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐
    │Group │  │Group │  │Group │  │Group │
    │  A   │  │  B   │  │  C   │  │  D   │
    │(VIP) │  │(Prem)│  │(Norm)│  │(Guest)│
    └──────┘  └──────┘  └──────┘  └──────┘
```

### 关键优化点

#### 1. 智能故障转移
```go
type FallbackStrategy struct {
    primary   KeyPool
    secondary KeyPool
    tertiary  KeyPool
}

func (fs *FallbackStrategy) GetKey() (string, error) {
    if key, err := fs.primary.Get(); err == nil {
        return key, nil
    }
    if key, err := fs.secondary.Get(); err == nil {
        return key, nil
    }
    return fs.tertiary.Get()
}
```

#### 2. 预测性扩缩容
```go
type KeyPoolScaler struct {
    metrics   *MetricsCollector
    threshold float64
}

func (kps *KeyPoolScaler) ShouldScale() bool {
    usage := kps.metrics.GetUsageRate()
    return usage > kps.threshold
}
```

#### 3. 智能缓存
```go
import "github.com/patrickmn/go-cache"

type KeyCache struct {
    cache *cache.Cache
    ttl   time.Duration
}

func (kc *KeyCache) GetOrFetch(key string, fetch func() (string, error)) (string, error) {
    if val, found := kc.cache.Get(key); found {
        return val.(string), nil
    }
    
    val, err := fetch()
    if err == nil {
        kc.cache.Set(key, val, kc.ttl)
    }
    return val, err
}
```

## 📚 推荐学习资源

### 官方文档
- [Effective Go](https://go.dev/doc/effective_go)
- [Go Code Review Comments](https://github.com/golang/go/wiki/CodeReviewComments)

### 开源项目
- [Kubernetes](https://github.com/kubernetes/kubernetes) - 云原生架构
- [Prometheus](https://github.com/prometheus/prometheus) - 监控系统
- [Consul](https://github.com/hashicorp/consul) - 服务发现
- [NATS](https://github.com/nats-io/nats-server) - 消息系统

### 设计模式
- [Go Patterns](https://github.com/tmrts/go-patterns)
- [Concurrency Patterns](https://github.com/luk4z7/go-concurrency-patterns)

## 🔧 待优化项

### 短期（1-2周）
- [ ] 添加熔断器模式
- [ ] 实现密钥自动轮换
- [ ] 添加更详细的metrics
- [ ] 完善健康检查

### 中期（1-2月）
- [ ] 添加分布式追踪（OpenTelemetry）
- [ ] 实现配置热重载
- [ ] 添加A/B测试支持
- [ ] 优化内存分配

### 长期（3-6月）
- [ ] gRPC支持
- [ ] 多区域部署
- [ ] 自动扩缩容
- [ ] 机器学习集成

---

**原则**: 不重复造轮子，站在巨人的肩膀上！🚀
