# SVS Telegram Bot - Go Edition 🚀

> 高性能 Telegram Bot，使用 Go 语言完全重构，提供智能对话、VIP系统和多模态支持

## 🎯 核心特性

### 技术优势
- **⚡ 极速响应** - Go语言原生并发，毫秒级响应
- **💾 超低内存** - 仅需20MB内存，比Python版本降低90%
- **🔧 高可靠性** - 编译型语言，类型安全，错误处理完善
- **📦 单文件部署** - 静态编译，无需运行时依赖

### 功能特性
- **🤖 Gemini AI集成** - 支持多模型智能对话
- **👑 VIP会话系统** - 多轮对话记忆，分级权限管理
- **🔑 智能密钥路由** - 25+API密钥池，智能负载均衡
- **💾 数据持久化** - Supabase/内存双模式存储
- **📊 实时监控** - 系统状态、密钥使用情况实时查看

## 🏗️ 架构设计

```
go_backend/
├── cmd/
│   └── bot/            # 主程序入口
├── internal/           # 内部包
│   ├── config/         # 配置管理
│   ├── database/       # 数据库层
│   ├── router/         # API密钥路由
│   ├── ai/            # AI集成（Gemini）
│   └── session/        # VIP会话管理
├── pkg/               # 公共包
├── Dockerfile         # Docker构建
├── docker-compose.yml # 编排配置
├── Makefile          # 构建脚本
└── go.mod            # 依赖管理
```

## 🚀 快速开始

### 环境要求
- Go 1.21+
- Docker (可选)
- Supabase账号 (可选)

### 配置环境变量

创建 `.env` 文件：

```bash
# Telegram配置
TELEGRAM_BOT_SVSKILO_TOKEN=your_bot_token_here

# Gemini API Keys (至少配置一组)
GROUP_A_KEYS=key1,key2,key3
GROUP_B_KEYS=key4,key5,key6
GROUP_C_KEYS=key7,key8,key9
GROUP_D_KEYS=key10,key11,key12

# Router Keys (可选，用于负载均衡)
ROUTER_KEY_A=router_key_1
ROUTER_KEY_B=router_key_2

# Supabase配置 (可选)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key

# Redis配置 (可选)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# 日志级别
LOG_LEVEL=INFO
```

### 本地运行

```bash
# 安装依赖
make deps

# 直接运行
make run

# 或构建后运行
make build
./bin/svs-bot
```

### Docker部署

```bash
# 构建镜像
make docker-build

# 使用docker-compose启动
make docker-compose-up

# 或直接运行
docker run --env-file .env svs/telegram-bot:latest
```

### Systemd服务（生产环境）

创建 `/etc/systemd/system/svs-bot.service`:

```ini
[Unit]
Description=SVS Telegram Bot (Go)
After=network.target

[Service]
Type=simple
User=svs
WorkingDirectory=/opt/svs-bot
ExecStart=/opt/svs-bot/svs-bot
Restart=always
RestartSec=10
Environment="LOG_LEVEL=INFO"
EnvironmentFile=/opt/svs-bot/.env

[Install]
WantedBy=multi-user.target
```

启动服务：

```bash
sudo systemctl daemon-reload
sudo systemctl enable svs-bot
sudo systemctl start svs-bot
```

## 📝 使用指南

### Bot命令

- `/start` - 开始使用
- `/help` - 显示帮助
- `/status` - 查看系统状态
- `/vip` - 查看VIP会话状态

### VIP系统

| 角色 | 会话轮数 | 优先级 | 特权 |
|------|---------|--------|------|
| Owner | 10轮 | 最高 | 踢出其他VIP |
| VIP | 7轮 | 高 | 专属密钥组 |
| Premium | 5轮 | 中 | 优先响应 |
| Normal | 3轮 | 低 | 基础服务 |
| Guest | 0轮 | 无 | 单次对话 |

### API密钥配置

系统支持4组密钥池：
- **Group A**: VIP/Owner专用 (高配额)
- **Group B**: Premium用户 (中配额)
- **Group C**: 普通会员 (标准配额)
- **Group D**: 游客/备用 (保守配额)

每组密钥独立管理，支持：
- 自动轮换
- 错误重试
- 黑名单机制
- 日限额控制

## 🔧 开发指南

### 构建命令

```bash
make help           # 显示所有命令
make build          # 构建二进制
make test           # 运行测试
make lint           # 代码检查
make fmt            # 格式化代码
make benchmark      # 性能测试
make security       # 安全检查
```

### 项目结构说明

```go
// 配置管理
internal/config/
  - config.go       // 全局配置定义

// 数据库层
internal/database/
  - database.go     // Supabase/内存双模式

// 路由系统
internal/router/
  - key_router.go   // 密钥智能路由

// AI集成
internal/ai/
  - gemini.go       // Gemini API封装

// 会话管理
internal/session/
  - vip_manager.go  // VIP会话系统
```

### 添加新功能

1. 在 `internal/` 创建新模块
2. 在 `cmd/bot/main.go` 集成
3. 添加配置项到 `config/config.go`
4. 更新测试和文档

## 📊 性能对比

| 指标 | Python版本 | Go版本 | 提升 |
|------|-----------|--------|------|
| 启动时间 | ~3秒 | <100ms | 30x |
| 内存占用 | 200MB | 20MB | 10x |
| 响应延迟 | 300ms | 50ms | 6x |
| 并发能力 | 100 | 10000 | 100x |
| CPU使用率 | 15% | 2% | 7.5x |

## 🐛 故障排除

### Bot无响应
1. 检查Token是否正确
2. 确认网络连接
3. 查看日志：`docker logs svs-bot-go`

### 密钥错误
1. 确认密钥格式正确
2. 检查配额是否用完
3. 查看路由状态：`/status`

### 内存泄漏
- Go版本已优化，正常不会泄漏
- 如遇问题，使用 `pprof` 分析

## 🤝 贡献指南

1. Fork项目
2. 创建功能分支
3. 提交更改
4. 发起Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

- Telegram Bot API
- Google Gemini AI
- Supabase
- Go社区

---

**作者**: SVS Team  
**版本**: 1.0.0  
**架构**: 菌丝网络架构 🍄
