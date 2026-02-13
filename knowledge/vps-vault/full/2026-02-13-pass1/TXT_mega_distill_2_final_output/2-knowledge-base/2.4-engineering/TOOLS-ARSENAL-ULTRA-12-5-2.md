---
title: 🛠️ 工具武器庫 | TOOL ARSENAL
category: 2-knowledge-base/2.4-engineering
source: docs/05-資源與工具/TOOLS-ARSENAL-ULTRA.md
distilled_by: grok-4-0709
mode: B
---
part: 12
---

## 5.2 Docker Compose部署服務

```yaml
# docker-compose.yml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "80:80"  # 映射端口
```
