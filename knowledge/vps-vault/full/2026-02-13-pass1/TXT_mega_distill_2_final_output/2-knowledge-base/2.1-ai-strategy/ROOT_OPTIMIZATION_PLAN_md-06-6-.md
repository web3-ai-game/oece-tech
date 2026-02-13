---
distilled_by: grok-4-0709
mode: B
---
part: 6
---

## 6. 進階知識與工具整合

### 6.1 工具推薦

整合Git、Docker與GCP工具。背景：容器化提升可移植性。原理：Dockerfile可參考新結構。

代碼範例8：Dockerfile 示例

```dockerfile
FROM node:14
WORKDIR /app
COPY core/ /app/core/
COPY scripts/ /app/scripts/
CMD ["node", "core/main.js"]

# 註釋: 按新結構拷貝文件，確保容器內一致性
```

### 6.2 擴展到多項目管理

對於多子項目，使用`projects`目錄嵌套。

表格：單項目 vs 多項目結構

| 結構類型      | 單項目                             | 多項目                             |
|---------------|-------------------------------------|-------------------------------------|
| 目錄深度     | 淺（一級分類）                     | 深（嵌套子目錄）                   |
| 適用場景     | 小型Windsurf                       | 大型企業GCP                        |
| 維護成本     | 低                                 | 中（需額外管理）                   |
