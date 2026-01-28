# 部署清单与30天均衡计划（静态+VPS容器+异步后端）

> 重要：Gemini API 配额按「日」重置，不计入月度预算计算（Monthly Pool）。月度池宽度与每日限额仅针对其它依赖和服务（如 Datadog、Supabase/Postgres、Deepnote/Camber、Notion、GitHub、OpenRouter 等）。

## 目标池策略（已在代码落地）
- **2.5-pro 池（Admin任务专用）**
  - 速率策略：1.5s/次 ≈ 40/min
  - 集群额度：1150/天（安全920）
  - 触发：/mode work 或 /ssh 命令，私聊任务执行
- **2.5-flash 池（VIP+Web工具专用）**
  - 集群额度：5750/天（安全4600）
  - 用途：VIP用户私聊、网站AI工具集（迎宾、检索、轻任务）
- **2.5-flash-lite 池（主力聊天）**
  - 集群额度：23000/天（安全18000）
  - 用途：群聊、论坛交互、普通会员私聊、首页聊天客服

## 月度池宽度预算（不含 Gemini）
- 目的：将月配额/成本换算为“每日安全限额”，避免 30 天周期内超用。
- 适用：Datadog、Supabase/Postgres（行写入/计算/存储）、Deepnote/Camber（任务运行次数）、第三方 API（按月计费/配额）、DO 流量等。
- 计算：
  - 每日安全限额 = ⌊ 月度配额 × 安全系数(0.8) ÷ 30 ⌋
  - 峰值日（论坛热度/活动日）可临时提升到 1.2×，需以后续日做 0.6× 回补。
- 执行：
  - Worker 调度间隔：优先拉长（如 3h/6h/12h），避免高频消耗免费层次数。
  - 报表/Notebook：按周出报，峰值周额外出一次。
  - 观测：配额>80% 预警，>90% 禁止可选项（或自动降频）。

## 组件部署拓扑
- **静态站点**：Netlify/Vercel（免费层，CDN）
- **论坛**：VPS 容器（建议 Discourse/Flarum 二选一）
- **Bot**：VPS 容器（现有 Python 版，后续引入 Go 高并发版）
- **异步后端**：VPS Worker 容器（archive_worker.py，Redis→Supabase/Postgres）
- **观测**：Datadog/Prometheus+Grafana（二选一，优先免费额度）

## 容器与主机建议（DigitalOcean 2 vCPU AMD / 8GB RAM）
- `forum`: 2GB RAM, 1 vCPU（Discourse/Flarum）
- `bot`: 1.5GB RAM, 1 vCPU（现有 Python 版）
- `worker`: 0.5GB RAM, 0.5 vCPU（批量归档）
- 预留：~3GB 系统+缓存+峰值

## Doppler 分组与变量
- 分组：`gemini`, `bot`, `forum`, `worker`, `observability`, `integrations`
- 最小变量：
  - `gemini`: GEMINI_KEYS（JSON/逗号分隔）、KEY_GROUPS、DEFAULT_MODELS
  - `bot`: TELEGRAM_BOT_TOKEN, REDIS_URL
  - `worker`: SUPABASE_URL, SUPABASE_SERVICE_KEY（或 POSTGRES_URL）
  - `observability`: DATADOG_API_KEY（可选）
  - `integrations`: GITHUB_TOKEN, NOTION_API_KEY, OPENROUTER_API_KEY（按需）

## 运行与排程
- Bot: `docker-compose up -d bot`
- Worker: `ARCHIVE_INTERVAL_MIN=180 docker-compose up -d worker`
- 论坛：按官方容器文档部署（Discourse 一键脚本或 Flarum Docker）

## 指标与警戒线
- QPS/P95：bot、forum、worker 单独暴露或通过 Datadog Agent 采集
- 模型用量：api_events 表与 quotas 聚合
- 警戒：
  - 2.5-pro：> 800/天 预警
  - 2.5-flash：> 4000/天 预警
  - 2.5-flash-lite：> 16000/天 预警

## 30天均衡计划
- Week 1（落地与观测）
  - 上线 `/ssh` 与管理员任务模式（已完成）
  - 启动 Worker（3h 间隔），跑通 api_events 与 quotas 表
  - 配置 Doppler 分组与密钥，同步到容器
- Week 2（高并发能力）
  - 抽象 Go Router（令牌桶：模型×Key 粒度），优先接管 2.5-flash-lite 池
  - Prometheus 指标/或 Datadog 自定义指标
- Week 3（论坛与工具集）
  - 论坛接入 AI 助手（调用 2.5-flash-lite）
  - Web 工具集：VIP 同权（2.5-flash），仅 Admin 可管理会员
- Week 4（成本优化与自动化）
  - 归档间隔调参（6h/12h）；DoH 边缘缓存静态站
  - 事件/配额报表自动推送（Deepnote/Camber Notebook 定时）

## 迁移/扩缩容
- 全容器化：备份 `.env` 与 Doppler Config，打包镜像与卷
- 横向扩展：拆分 `bot` 与 `router`，独立伸缩
- 回滚策略：`docker image tag`+`compose rollback`，保留前一版本镜像
