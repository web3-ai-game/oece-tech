---
distilled_by: grok-4-0709
mode: B
---
part: 6
---

## 6. 雲計算/DevOps 路線
**目標**：掌握AWS/GCP、CI/CD、容器化。

6.1 **總時長**：85小時（10-14周）。背景：DevOps源自agile運動，強調automation。

6.11 **基礎部署 (35h)**：Grokking Modern + Spring Boot。

6.12 **Go微服務 (33h)**：Go Programming + Advanced Go。

6.13 **監控/擴展 (17h)**：Node.js API優化。

| 階段 | 課程名稱 | 主題 | 時長 | 等級 | 理由 |
|------|----------|------|------|------|------|
| 基礎 | Modern Design + Spring | Microservices | 35h | 中級 | 雲原生 |
| Go | Go + Advanced Go | Goroutines | 33h | 初-進階 | 高效能 |
| 監控 | Node.js | Scalability | 17h | 中級 | Pipeline |

6.2 **學習建議**：AWS Free Tier實作。輸出：Kubernetes YAML + CI/CD。

6.3 **代碼範例擴展**：
繼續添加3個DevOps相關範例。

6.31 **範例6: Docker Compose (YAML)**
```yaml
# 目的: 容器化後端服務
version: '3'
services:
  web:
    image: node:14  # 使用Node鏡像
    ports:
      - "3000:3000"  # 映射端口
    volumes:
      - .:/app  # 掛載代碼
# 運行: docker-compose up
```

6.32 **範例7: CI/CD Pipeline (GitHub Actions)**
```yaml
# 目的: 自動測試和部署
name: CI
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2  # 拉取代碼
      - name: Run tests
        run: npm test  # 執行測試
```

6.33 **範例8: Kubernetes Deployment (YAML)**
```yaml
# 目的: 部署微服務
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
spec:
  replicas: 3  # 副本數
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
      - name: app
        image: myimage:latest  # 鏡像
        ports:
        - containerPort: 80  # 暴露端口
```
