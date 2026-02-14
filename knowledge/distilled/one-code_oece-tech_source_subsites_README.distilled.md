---
source: one-code_oece-tech_source_subsites_README.md
distilled_at: 2026-02-14T09:21:17.684Z
model: grok-4-1-fast-non-reasoning
---

# OECE Tech 子站點開發與部署知識文檔

本文檔詳細說明 OECE Tech 專案中 `subsites/` 資料夾的結構、開發流程及部署方式，基於符號連結 (symlinks) 的統一開發架構。

## 專案結構 (Project Structure)

```
oece-tech/
├── subsites/                 # 子站點符號連結資料夾
│   └── me -> ../../oece-me   # 指向個人名片網站專案 (me.oece.tech)
└── oece-me/                  # 實際的個人名片網站原始碼
```

### 符號連結設計目的
- **`subsites/` 資料夾**：包含所有子站點專案的符號連結，形成統一的開發入口。
- **優點**：
  - 從單一位置管理多個子站點。
  - 支援同時開發多個子站點。
  - 方便執行全域開發指令。

### 目前子站點清單
| 子站點符號連結 | 實際路徑          | 對應域名          | 描述             |
|----------------|-------------------|-------------------|------------------|
| `me`           | `../../oece-me`   | `me.oece.tech`    | 個人名片網站     |

## 開發流程 (Development Workflow)

### 啟動個人名片網站開發伺服器
兩種方式任選其一：

```bash
# 方法 1：進入子站點資料夾
cd subsites/me
npm run dev
```

```bash
# 方法 2：從 oece-tech 根目錄執行 (推薦)
npm run dev:me
```

### 同時啟動所有子站點
```bash
# 從 oece-tech 根目錄執行
npm run dev:all
```
這將同時啟動所有 `subsites/` 中的子站點開發伺服器。

## 部署流程 (Deployment Workflow)

### Firebase Hosting 架構
- 每個子站點部署至**獨立的 Firebase Hosting 目標 (target)**。
- 目前配置：
  | 域名            | Firebase Hosting 目標 |
  |-----------------|----------------------|
  | `me.oece.tech`  | `me`                 |

### 部署個人名片網站
```bash
# 完整部署流程
cd subsites/me
npm run build      # 建置生產版本
firebase deploy --only hosting:me  # 部署至指定 Firebase 目標
```

**注意事項**：
- 確保已登入 Firebase：`firebase login`
- 確認專案已連結至正確的 Firebase 專案：`firebase use [project-id]`
- `--only hosting:me` 參數確保只部署指定目標，不影響其他 hosting 設定。

## 快速參考指令表

| 操作類型       | 指令                                      | 說明                           |
|----------------|-------------------------------------------|--------------------------------|
| **開發 - 單站** | `npm run dev:me`                          | 啟動個人名片開發伺服器         |
| **開發 - 全站** | `npm run dev:all`                         | 同時啟動所有子站點             |
| **建置**       | `cd subsites/me && npm run build`         | 建置個人名片生產版本           |
| **部署**       | `cd subsites/me && firebase deploy --only hosting:me` | 部署個人名片至 Firebase |

## 疑難排解 (Troubleshooting)

### 符號連結問題
```bash
# 如果符號連結失效，重新建立
rm subsites/me
ln -s ../../oece-me subsites/me
```

### Firebase 目標不存在
```bash
# 查看可用目標
firebase target:list

# 建立新目標 (如需要)
firebase target:apply hosting me me.oece.tech
```

此架構提供高效的統一開發體驗，同時保持每個子站點的獨立部署能力。未來新增子站點時，只需新增符號連結並配置對應的 Firebase 目標即可。