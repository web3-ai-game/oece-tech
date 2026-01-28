# 04.6 终极可观测性平台搭建：Prometheus + Grafana + Loki实战

**作者**:Cline | **发布日期**: 2025-11-25 | **更新日期**: 2025-10-25 | **分类**: `云端基建` `DevOps` `监控` `Prometheus` `Grafana`

**摘要**: “如果你无法衡量它，你就无法改进它。” 在复杂的云原生应用中，仅仅知道“CPU使用率90%”是远远不够的，我们还需要知道“为什么”。现代的可观测性(Observability)理念，建立在三大支柱之上：**Metrics(指标)**, **Logs(日志)** 和 **Traces(追踪)**。本篇终极指南将带你从零开始，使用目前最流行的开源“黄金组合”，并通过Docker Compose快速搭建一个统一的、覆盖了两大支柱的可观测性平台：使用Prometheus采集指标，使用Loki收集日志，并最终在Grafana中实现指标与日志的无缝关联与可视化。

**SEO关键词**: 可观测性, Prometheus, Grafana, Loki, 监控告警, Docker Compose, PromQL, Alertmanager, 指标与日志

---

## 第1部分：可观测性三大支柱与我们的“黄金组合”

- **Metrics (指标)**: **告诉你“是什么”**。可聚合的、数值型的数据，用于衡量系统的总体状态。例如：CPU使用率、QPS、API延迟。我们的工具：**Prometheus**。
- **Logs (日志)**: **告诉你“为什么”**。离散的、带有丰富上下文的事件记录，用于定位和调试具体问题。例如：一次错误请求的完整堆栈追踪。
- **Traces (追踪)**: **告诉你“在哪里”**。记录了单个请求在分布式系统中的完整调用链，用于分析性能瓶颈和理解服务依赖。例如：一个API请求依次经过了网关、用户服务、订单服务的耗时。

本教程将聚焦于搭建一个统一的Metrics和Logs平台，这是任何可观测性系统的基石。

### 我们的架构

```mermaid
graph TD
    subgraph 数据源
        A[Node Exporter] -- 指标 --> D
        B[cAdvisor] -- 指标 --> D
        C[应用本身] -- 指标 --> D
        C -- 日志 --> E[Promtail]
    end
    subgraph 核心服务
        D[Prometheus Server] --> F[Grafana]
        E --> G[Loki]
        G --> F
        D --> H[Alertmanager]
    end
    subgraph 通知
        H --> I[Slack/Email]
    end
```

---

## 第2部分：使用Docker Compose一键部署可观测性平台

### 2.1 项目结构

```
monitoring-stack/
├── docker-compose.yml
├── prometheus/
│   ├── prometheus.yml
│   └── rules.yml
├── alertmanager/
│   └── config.yml
└── promtail/
    └── config.yml
```

### 2.2 `docker-compose.yml` (完整版)

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:v2.47.1
    container_name: prometheus
    restart: unless-stopped
    volumes:
      - ./prometheus:/etc/prometheus/
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'
    ports:
      - "9090:9090"
    networks:
      - monitoring_net

  node_exporter:
    image: prom/node-exporter:v1.7.0
    # ... (配置与上一版相同)
    networks:
      - monitoring_net

  cadvisor:
    image: gcr.io/cadvisor/cadvisor:v0.47.2
    # ... (配置与上一版相同)
    networks:
      - monitoring_net

  grafana:
    image: grafana/grafana:10.2.0
    # ... (配置与上一版相同)
    networks:
      - monitoring_net

  alertmanager:
    image: prom/alertmanager:v0.26.0
    # ... (配置与上一版相同)
    networks:
      - monitoring_net

  # --- 新增Loki和Promtail ---
  loki:
    image: grafana/loki:2.9.2
    container_name: loki
    restart: unless-stopped
    ports:
      - "3100:3100"
    command: -config.file=/etc/loki/local-config.yaml
    networks:
      - monitoring_net

  promtail:
    image: grafana/promtail:2.9.2
    container_name: promtail
    restart: unless-stopped
    volumes:
      - ./promtail/config.yml:/etc/promtail/config.yml
      - /var/log:/var/log
      - /var/lib/docker/containers:/var/lib/docker/containers:ro
    command: -config.file=/etc/promtail/config.yml
    networks:
      - monitoring_net

volumes:
  prometheus_data: {}
  grafana_data: {}

networks:
  monitoring_net:
    driver: bridge
```

### 2.3 `promtail/config.yml` (新增)

```yaml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  filename: /tmp/positions.yaml

clients:
  - url: http://loki:3100/loki/api/v1/push

scrape_configs:
  - job_name: docker
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
        refresh_interval: 5s
    relabel_configs:
      - source_labels: ['__meta_docker_container_name']
        regex: '/+(.*)'
        target_label: 'container'
```

---

## 第3部分：采集指标与日志：从主机到数据库

### 3.1 监控数据库 (PostgreSQL)

我们将使用`postgres-exporter`来暴露PostgreSQL的内部指标。

1.  在`docker-compose.yml`中添加`postgres-exporter`服务：
    ```yaml
    postgres_exporter:
      image: quay.io/prometheuscommunity/postgres-exporter
      container_name: postgres_exporter
      restart: unless-stopped
      environment:
        # 使用DSN连接字符串指向你的数据库容器
        DATA_SOURCE_NAME: "postgresql://user:password@postgres_db:5432/fluffy_db?sslmode=disable"
      ports:
        - "9187:9187"
      networks:
        - monitoring_net
    ```
2.  在`prometheus.yml`中添加新的抓取任务：
    ```yaml
    - job_name: 'postgres'
      static_configs:
        - targets: ['postgres_exporter:9187']
    ```

### 3.2 监控应用 (Python/Flask示例)

```python
# app.py
from flask import Flask
from prometheus_flask_exporter import PrometheusMetrics

app = Flask(__name__)
metrics = PrometheusMetrics(app)

@app.route('/')
def hello():
    return "Hello, World!"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```
`prometheus-flask-exporter`会自动创建一个`/metrics`端点，并暴露如HTTP请求延迟、请求计数等标准指标。

---

## 第4部分：Grafana高级可视化：从指标到日志

### 4.1 PromQL高级查询：计算P99延迟

- **Histogram类型**: 像`http_request_duration_seconds`这样的指标通常是Histogram类型，它将观测值分布到不同的“桶”(bucket)中。
- **`histogram_quantile`函数**: 我们可以用这个函数来计算分位数，例如P99延迟（99%的请求都低于这个延迟时间）。
  ```promql
  # 计算在过去5分钟内，99%的HTTP请求延迟
  histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le, job))
  ```

### 4.2 创建带变量的仪表盘

1.  在Grafana仪表盘设置中，进入`Variables` -> `Add variable`。
2.  **Name**: `instance`
3.  **Type**: `Query`
4.  **Data source**: `Prometheus`
5.  **Query**: `label_values(node_load1, instance)`
6.  现在，你的仪表盘顶部会出现一个下拉框，你可以在查询中使用`$instance`变量，例如`node_load1{instance="$instance"}`。切换下拉框的值，整个仪表盘的数据都会随之更新。

### 4.3 关联指标与日志 (终极技巧)

1.  **添加Loki数据源**: 在Grafana中，添加Loki数据源，URL为`http://loki:3100`。
2.  **配置Prometheus数据源**: 
    - 进入你已添加的Prometheus数据源的设置页面。
    - 找到`Derived Fields`部分。
    - **Name**: `Logs`
    - **Regex**: `instance="([^"]+)"` (从`instance`标签中提取主机名)
    - **URL/Query**: `{
  "datasource": "Loki",
  "query": "{container=~\"*.${1}.*\"}"
}` (这里的`${1}`会引用Regex捕获到的主机名)
    - **Internal Link**: 开启。
3.  **工作流**: 现在，在任何一个Prometheus图表中，点击数据点，弹出的菜单中会出现一个`Logs`的链接。点击它，你会直接跳转到Grafana的Explore视图，并且Loki的查询和时间范围已经自动为你设置好，精确地显示出在那个时间点、来自那台主机的日志！

---

## 第5部分：Alertmanager高级配置

### 5.1 `alertmanager.yml` (生产级示例)

```yaml
# alertmanager/config.yml
global:
  slack_api_url: 'YOUR_SLACK_WEBHOOK_URL'

# 路由树，定义告警的分发逻辑
route:
  receiver: 'default-receiver'
  group_by: ['alertname', 'cluster']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h

  # 如果告警有`severity=critical`标签，则路由到 pagerduty-receiver
  routes:
    - receiver: 'pagerduty-receiver'
      matchers:
        - severity = 'critical'
    - receiver: 'slack-warnings'
      matchers:
        - severity = 'warning'

# 抑制规则：当一个更高级别的告警触发时，抑制相关的低级别告警
inhibit_rules:
  - target_matchers:
      - severity = 'warning'
    source_matchers:
      - severity = 'critical'
    equal: ['cluster', 'alertname']

# 接收器定义
receivers:
  - name: 'default-receiver'
    slack_configs:
      - channel: '#alerts-default'

  - name: 'pagerduty-receiver'
    # 此处应为PagerDuty的配置

  - name: 'slack-warnings'
    slack_configs:
      - channel: '#alerts-warnings'
```

**解读**: 
- **路由 (route)**: 实现了告警的分级。`critical`级别的严重告警会被发送到PagerDuty（会打电话叫醒你），而`warning`级别的告警只会发到Slack的另一个频道。
- **抑制 (inhibit_rules)**: 定义了告警之间的抑制关系。例如，如果“整个集群都挂了”的告警正在触发，那么所有“某个实例挂了”的告警都会被静默，避免信息风暴。

## 结论

通过将Prometheus、Grafana和Loki这三大开源利器组合在一起，我们用纯开源、低成本的方案，搭建起了一套覆盖了“指标”和“日志”两大支柱的、统一的可观测性平台。这套系统不仅能告诉你系统“发生了什么”，更能通过指标与日志的无缝联动，帮助你快速定位“为什么会发生”。掌握这套“黄金组合”，意味着你拥有了以数据驱动的方式，来保证系统稳定性和优化性能的强大能力。

## 参考资料

1.  [Prometheus Official Documentation](https://prometheus.io/docs/introduction/overview/)
2.  [Grafana Loki Documentation](https://grafana.com/docs/loki/latest/)
3.  [Awesome Prometheus (各种Exporter和客户端库列表)](https://github.com/roaldnefs/awesome-prometheus)
4.  [Postgres Exporter for Prometheus](https://github.com/prometheus-community/postgres_exporter)