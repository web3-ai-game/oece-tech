---
title: 知識蒸餾知識庫總覽
slug: knowledge-base-overview
category: root
tags: [知識庫, Firebase, 向量化检索, 蒸餾, deepweay-me, oece-tech]
lang: zh-TW
created: 2026-02-12
source: kilo-code-distilled
vector_ready: true
embedding_model: BAAI/bge-m3
---

# 1. 知識庫結構總覽
## 1.1 設計原則
1.11 適應 Firebase：每個 MD 文件帶 frontmatter，可拆分為 chunks 存入 Firestore/Realtime DB，每 chunk 有 id, text, vector, metadata。
1.12 支持向量化检索：使用 bge-m3 等模型生成 embedding，支持語義搜索（集成 Vertex AI 或 Pinecone）。
1.13 Wittgenstein 目錄結構：數字層級 1. 1.1 1.11 ... 邏輯遞進，便於 Notion 導入與導航。
1.14 Notion 友好：純 MD，層級標題，checklist/code blocks。
1.15 GitHub 備份：整個 txt/ 可直接 push 至 repo，如 txt-DO-distilled。

## 1.2 目錄樹
```
txt/
├── index.md                          # 本總覽
├── deepweay-me/                      # deepweay-me 專屬：道德黑客、安全技能
│   └── ethical-hacking/
│       ├── red-team-level-[a|b|c].md # 紅隊 A(基礎)-C(高級，Kali熟練)
│       └── blue-team-level-[a|b|c].md # 藍隊 A(基礎)-C(高級防禦)
├── oece-tech/                        # oece-tech 專屬：創意、劇本推演
│   └── novel-script-engine/
│       ├── 爽文結構.md
│       ├── 穿越劇本.md
│       └── 推演引擎結構.md
├── survival-skills/                  # 生存技能：街頭、遊民、工程學
│   ├── street-fighting.md
│   ├── digital-nomad-visas.md
│   └── social-engineering.md
└── confidential/                     # 機密軼事：人類學、外星事件
    └── ufo-anthropology.md
```

## 1.3 Firebase 導入指南
1.31 拆分 chunks：每 500 字一段，生成 embedding。
1.32 存儲結構：
```json
{
  "id": "chunk_1_1",
  "parent_doc": "ethical-hacking-red-team-a",
  "text": "內容...",
  "vector": [0.1, 0.2, ...],
  "metadata": { "level": "A", "team": "red" }
}
```
1.33 搜索：使用 cosine similarity on vectors。

## 1.4 使用說明
- 直接閱覽 MD。
- Notion：拖入文件夾，自動解析層級。
- 蒸餾後續：可跑 DO-VPS-PLAN.py 批量向量化。

後續文件將依此結構填充內容，所有基於公開事實、OWASP/NIST/Kali docs 等權威來源，非虛構。