# ⚡ 诸葛亮军团系统 - 完整技术架构文档(AI 可执行版)

**來源**: https://www.notion.so/a8125e6333e140a48cb358c9bb07cfe3
**更新時間**: 2025-11-21

## 系统概述

这是一个基于 5 个 AI Agent 并发推理的决策支持系统,通过不同角色的 AI 模型进行多维度分析,最终由仲裁者生成纳什均衡解决方案。

## 核心设计理念

- **Key 1-4**: 本地运行 Yi-6B INT8 模型,零成本并发推理
- **Key 5**: 调用 Gemini API 作为最终决策者
- **成本控制**: $0.02-0.05 per 决策,混合架构降低 95% 成本
- **部署方式**: Mac 本地 + GCP Cloud Run(可选)

## 技术栈

### 核心技术
```yaml
编程语言: Go 1.21+
本地推理引擎: llama.cpp
模型: Yi-6B-Chat GGUF INT8 (9GB)
API: Google Gemini 1.5 Pro
数据库: SQLite (轻量缓存)
向量搜索: Qdrant Lite (本地)
部署: Docker + (可选) GCP Cloud Run
```

## 系统架构

### 目录结构
```
zhuge-legion/
├── cmd/
│   └── server/
│       └── main.go              # 主入口
├── internal/
│   ├── agents/
│   │   ├── agent.go             # Agent 接口定义
│   │   ├── local_agent.go       # 本地模型 Agent (Key 1-4)
│   │   └── gemini_agent.go      # Gemini Agent (Key 5)
│   ├── legion/
│   │   ├── legion.go            # 军团协调器
│   │   └── strategy.go          # 决策策略
│   ├── cache/
│   │   ├── vector_cache.go      # 向量缓存
│   │   └── result_cache.go      # 结果缓存
│   └── config/
│       └── config.go            # 配置管理
├── models/
│   └── yi-6b-chat-q8_0.gguf     # 模型文件 (需下载)
├── configs/
│   └── prompts.yaml             # Prompt 模板
└── docker/
    ├── Dockerfile
    └── docker-compose.yml
```

## 核心组件设计

### Agent 接口

```go
package agents

import "context"

// AgentRole 定义 Agent 角色
type AgentRole string

const (
    RoleArchitect AgentRole = "architect" // 理想方案生成器
    RoleAdversary AgentRole = "adversary" // 红队攻击者
    RoleRealist   AgentRole = "realist"   // 现实约束评估
    RoleChaos     AgentRole = "chaos"     // 盲盒变异器
    RoleArbiter   AgentRole = "arbiter"   // 纳什均衡仲裁
)

// Agent 接口定义
type Agent interface {
    Generate(ctx context.Context, prompt string) (string, error)
    GetRole() AgentRole
    GetTemperature() float32
    Close() error
}
```

## System Prompts 配置

```yaml
agents:
  architect:
    system_prompt: |
      你是一个理想化方案设计师。你的任务是在无限资源、零摩擦的假设下,
      设计出技术上最优的解决方案。不考虑成本、时间、人力限制。
      
      输出格式:
      1. 核心方案概述
      2. 技术架构设计
      3. 预期效果
      4. 所需资源(理想状态)
    temperature: 0.7
    
  adversary:
    system_prompt: |
      你是一个专业的红队攻击者和风险评估专家。你的任务是找出方案中的
      所有漏洞、风险点、潜在失败模式。
      
      分析维度:
      1. 技术风险(漏洞、性能瓶颈)
      2. 人为风险(操作失误、恶意行为)
      3. 外部风险(黑天鹅事件、竞争对手)
      4. 边缘案例(极端情况下的表现)
    temperature: 0.8
    
  realist:
    system_prompt: |
      你是一个务实的项目评估专家。你的任务是在现实约束下评估方案的
      可行性和成本。
      
      考虑因素:
      1. 预算限制
      2. 时间限制
      3. 人力资源
      4. 法律合规
      5. 技术债务
    temperature: 0.7
    
  chaos:
    system_prompt: |
      你是一个非常规方案生成器。你的任务是提出违反直觉但可能有效的
      解决思路。
      
      要求:
      1. 必须合法且物理上可行
      2. 可以挑战常规最佳实践
      3. 关注被忽视的角度
      4. 提出创新性组合
      
      禁止: 纯粹的随机噪音、不可行的幻想
    temperature: 1.5
    
  arbiter:
    system_prompt: |
      你是最终仲裁者,负责综合多维度分析,找出纳什均衡解决方案。
      
      职责:
      1. 评估各方案的优劣
      2. 识别矛盾点
      3. 寻找平衡点(各方都无法通过单方面改变策略而获益)
      4. 给出可执行的综合建议
      5. 标注关键风险
    temperature: 0.7
```

## 部署方案

### 方案 A: Mac 本地运行

```bash
# 1. 克隆仓库
git clone <your-repo>
cd zhuge-legion

# 2. 下载模型
bash scripts/download_model.sh

# 3. 配置环境变量
export GEMINI_API_KEY="your-key"

# 4. 运行
go run cmd/server/main.go
```

### 方案 B: Docker 部署

```dockerfile
FROM golang:1.21-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o zhuge-legion cmd/server/main.go

FROM alpine:latest
RUN apk add --no-cache libc6-compat

WORKDIR /app
COPY --from=builder /app/zhuge-legion .
COPY models/ ./models/
COPY configs/ ./configs/

EXPOSE 8080
CMD ["./zhuge-legion"]
```

## 性能优化

### 1. 模型量化
- INT8 → INT4 可进一步减小模型大小
- 从 9GB → 4.5GB
- 推理速度稍快,质量损失可接受

### 2. 批处理
```go
func (l *Legion) DeployBatch(ctx context.Context, missions []string) ([]*Decision, error) {
    results := make([]*Decision, len(missions))
    
    for i, mission := range missions {
        results[i], _ = l.Deploy(ctx, mission)
    }
    
    return results, nil
}
```

### 3. 缓存策略
使用向量相似度匹配缓存,避免重复计算

## 成本估算

### 运行成本(Mac 本地)
- **硬件成本**: $0 (已有设备)
- **电费**: 约 $0.01/小时 (M3 Pro 功耗 ~50W)
- **Gemini API**: $0.02-0.05/决策
- **月成本**: <$20 (假设每天 20 次决策)

### 运行成本(GCP Cloud Run)
- **计算成本**: $0.00002400/vCPU-秒
- **内存成本**: $0.00000250/GiB-秒
- **Gemini API**: $0.02-0.05/决策
- **月成本**: $10-30 (按需使用)

## 路线图

### Phase 1: MVP (1-2周)
- [x] 完成核心架构设计
- [ ] 实现 5 个 Agent
- [ ] 本地运行测试
- [ ] 基础 HTTP API

### Phase 2: 优化 (2-3周)
- [ ] 向量缓存系统
- [ ] 性能优化
- [ ] 监控日志
- [ ] Docker 部署

### Phase 3: 生产 (3-4周)
- [ ] GCP 部署
- [ ] 安全加固
- [ ] 压力测试
- [ ] 文档完善

## 快速启动检查清单

### 环境准备
- [ ] Go 1.21+ 已安装
- [ ] 18GB+ 可用内存
- [ ] Gemini API Key 已获取
- [ ] Git 已安装

### 模型准备
- [ ] Yi-6B GGUF INT8 已下载 (9GB)
- [ ] 模型文件放在 `models/` 目录
- [ ] 文件完整性已验证

### 代码实现
- [ ] 创建项目目录结构
- [ ] 实现 Agent 接口
- [ ] 实现 Legion 协调器
- [ ] 编写主程序
- [ ] 配置 prompts.yaml

### 测试运行
- [ ] 本地编译通过
- [ ] 启动服务成功
- [ ] API 调用正常
- [ ] 结果符合预期

---

**这份文档可以直接交给 Windsurf/Cursor/Claude 等 AI IDE,让它们按照架构实现代码。**
