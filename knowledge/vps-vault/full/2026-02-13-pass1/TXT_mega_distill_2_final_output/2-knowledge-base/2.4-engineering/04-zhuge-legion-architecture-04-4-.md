---
title: 04-zhuge-legion-architecture-04-4-
slug: 04-zhuge-legion-architecture-04-4
category: TXT_mega_distill_2_final_output/2-knowledge-base/2.4-engineering
tags: [vps-sync]
lang: zh
created: 2026-02-13
source: vps-pass1-sync
vector_ready: true
---

## 4. 部署與優化

### 4.1 部署方案剖析

#### 4.11 Mac本地部署

背景：適合開發測試。原理：利用本地硬體零成本。

代碼範例4：啟動腳本（Bash）

```bash
# scripts/download_model.sh
#!/bin/bash
wget https://huggingface.co/Yi-6B-Chat-GGUF -O models/yi-6b-chat-q8_0.gguf # 下載模型
echo "模型下載完成" # 輸出提示
```

#### 4.12 Docker部署

原理：容器化確保可移植。

代碼範例5：Dockerfile擴展

```dockerfile
# Dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download # 下載依賴
COPY . .
RUN go build -o zhuge-legion cmd/server/main.go # 編譯二進位

FROM alpine:latest
RUN apk add --no-cache libc6-compat # 添加相容性庫
WORKDIR /app
COPY --from=builder /app/zhuge-legion .
COPY models/ ./models/ # 複製模型
COPY configs/ ./configs/ # 複製配置
EXPOSE 8080
CMD ["./zhuge-legion"] # 啟動服務
```

### 4.2 性能優化策略

#### 4.21 模型量化

從INT8到INT4減小大小。原理：量化減少位元表示，犧牲少許精度換取速度。

#### 4.22 批處理與緩存

代碼範例6：批處理函數（Go）

```go
// legion/legion.go
func (l *Legion) DeployBatch(ctx context.Context, missions []string) ([]*Decision, error) {
    results := make([]*Decision, len(missions))
    for i, mission := range missions {
        results[i], _ = l.Deploy(ctx, mission) // 並行處理任務
    }
    return results, nil
}
```

代碼範例7：向量緩存（Go）

```go
// cache/vector_cache.go
package cache

import "github.com/qdrant/go-client/qdrant"

type VectorCache struct {
    client *qdrant.Client
}

func (vc *VectorCache) Search(query []float32) (string, bool) {
    res := vc.client.Search(query) // 向量相似度搜索
    if res.Score > 0.9 {
        return res.Payload, true // 命中返回緩存
    }
    return "", false
}
```

#### 4.23 成本估算

表格對比本地與雲端成本。

| 部署類型 | 硬件成本 | API成本 | 月總成本 |
|----------|----------|---------|----------|
| Mac本地 | $0 | $0.02-0.05/決策 | <$20 |
| GCP Cloud Run | $0.000024/vCPU-秒 | $0.02-0.05/決策 | $10-30 |
