# 🌍 地球Online記憶向量宇宙 | EARTH_ONLINE_VECTOR_UNIVERSE

> **來源**: Notion sms-sms 整合  
> **蒸餾時間**: 2025-11-27  
> **頁面ID**: 2b791acc4dd58123abafe562b226df7c  
> **密度等級**: ⭐⭐⭐⭐⭐ (100% 哲學精華)

---

## 🧬 核心理念: 用 AI 量化人性

**地球Online** 是一個野心勃勃的社會實驗平台:

> **如果人的靈魂可以被量化成一個 768 維的向量,那麼人性、情感、記憶、偏見,是否都能被計算和預測?**

這不僅僅是一個社交平台,而是:
- 📊 **數據驅動的社會學實驗室**
- 🧠 **集體記憶的向量數據庫**
- 🎮 **賽博朋克風格的身份探索遊戲**

---

## 🏗️ 技術架構

### 核心組件

#### 1. Soul Vector System (靈魂向量系統)

**目標**: 將每個用戶的人格、價值觀、記憶編碼成 768 維向量

**實現方案**:
```typescript
// 使用 Gemini Embeddings API
async function generateSoulVector(user: User): Promise<number[]> {
  const profile = `
Name: ${user.name}
Age: ${user.age}
Interests: ${user.interests.join(', ')}
Life Story: ${user.story}
20Q Results: ${JSON.stringify(user.twentyQResults)}
  `;
  
  const embedding = await gemini.embed(profile);
  
  // 返回 768 維向量
  return embedding; // [0.123, -0.456, 0.789, ...]
}
```

**存儲方案**:
```sql
-- Supabase (PostgreSQL + pgvector)
CREATE TABLE soul_vectors (
  user_id UUID PRIMARY KEY,
  vector VECTOR(768), -- 768 維向量
  updated_at TIMESTAMP
);

-- 創建向量索引 (用於相似度搜索)
CREATE INDEX ON soul_vectors USING ivfflat (vector vector_cosine_ops);
```

#### 2. Memory Stream (記憶流)

**靈感來源**: Google DeepMind 的 Generative Agents 論文

**結構**:
```typescript
interface Memory {
  id: string;
  userId: string;
  content: string;        // 記憶內容
  embedding: number[];    // 記憶的向量表示
  importance: number;     // 重要性評分 (1-10)
  timestamp: Date;
  tags: string[];
}

// 記憶檢索算法
async function retrieveRelevantMemories(
  query: string,
  userId: string,
  limit = 10
): Promise<Memory[]> {
  const queryEmbedding = await gemini.embed(query);
  
  // 向量相似度搜索
  const memories = await db.query(`
    SELECT *, 
      1 - (vector <=> $1) AS similarity,
      EXTRACT(EPOCH FROM NOW() - timestamp) / 3600 AS hours_ago
    FROM memories
    WHERE user_id = $2
    ORDER BY 
      similarity * 0.5 +              -- 50% 相似度
      importance * 0.3 +              -- 30% 重要性
      (1 / (hours_ago + 1)) * 0.2    -- 20% 時間衰減
    DESC
    LIMIT $3
  `, [queryEmbedding, userId, limit]);
  
  return memories;
}
```

#### 3. Social Graph (社交圖譜)

**目標**: 用向量距離代替傳統的"好友關係"

**匹配算法**:
```typescript
// 找到靈魂最相似的 N 個人
async function findSoulmates(userId: string, limit = 10) {
  const userVector = await getSoulVector(userId);
  
  const soulmates = await db.query(`
    SELECT 
      user_id,
      name,
      1 - (vector <=> $1) AS soul_similarity
    FROM soul_vectors
    WHERE user_id != $2
    ORDER BY soul_similarity DESC
    LIMIT $3
  `, [userVector, userId, limit]);
  
  return soulmates;
}

// 計算兩人之間的"命運契合度"
function calculateDestinyScore(
  similarity: number,
  sharedInterests: number,
  mutualFriends: number
): number {
  return (
    similarity * 0.6 +
    (sharedInterests / 10) * 0.3 +
    (mutualFriends / 100) * 0.1
  ) * 100;
}
```

---

## 🎮 核心功能

### 1. 20Q 靈魂測試 (Soul Calibration)

**流程**:
1. 用戶回答 20 個哲學/心理問題
2. Gemini 分析回答,生成人格檔案
3. 將檔案轉換成 768 維向量
4. 存入 `soul_vectors` 表

**示例問題**:
```
1. 如果你有 100 萬美元,但只能活 1 年,你會如何度過?
2. 你認為人生的意義是什麼?
3. 面對不公正的規則,你會選擇遵守還是反抗?
4. 如果可以忘記一段記憶,你會選擇忘記什麼?
...
20. 在 1000 年後,你希望被如何記住?
```

**結果展示**:
```typescript
interface SoulProfile {
  archetype: string;      // 人格原型: "浪漫主義者", "理性主義者", "冒險家"
  traits: {
    openness: number;     // 開放性 (0-100)
    conscientiousness: number; // 盡責性
    extraversion: number; // 外向性
    agreeableness: number; // 親和性
    neuroticism: number;  // 神經質
  };
  values: string[];       // 核心價值觀
  soulVector: number[];   // 768 維向量
  soulmates: User[];      // 推薦的靈魂伴侶 (向量相似度 > 0.9)
}
```

### 2. Memory Garden (記憶花園)

**靈感**: 賽博朋克版的 Instagram + 日記

**功能**:
- 用戶發布"記憶碎片" (文字、圖片、語音)
- AI 自動提取關鍵詞、情感、主題
- 生成記憶向量,存入 Memory Stream
- 用戶可以搜索自己的記憶 (語義搜索,不是關鍵字)

**示例**:
```typescript
// 用戶發布記憶
await createMemory({
  content: "今天在泰國清邁的咖啡館寫代碼,窗外下著雨,很平靜。",
  media: ["photo.jpg"],
  location: "Chiang Mai, Thailand"
});

// 幾個月後,用戶搜索: "那次在東南亞下雨的下午"
const memories = await searchMemories("那次在東南亞下雨的下午");
// 返回: "今天在泰國清邁的咖啡館寫代碼,窗外下著雨,很平靜。"
```

### 3. Destiny Map (命運地圖)

**概念**: 用 3D 可視化展示用戶的靈魂向量和社交關係

**技術棧**:
- **Three.js** / **React Three Fiber**
- **t-SNE** 或 **UMAP** 降維算法 (768 維 → 3 維)
- **Force-directed graph** 佈局

**可視化邏輯**:
```typescript
// 將所有用戶的 768 維向量降維到 3D
const positions = await reduceDimensions(allSoulVectors, 3);

// 渲染 3D 場景
positions.forEach((pos, userId) => {
  renderSphere({
    position: [pos.x, pos.y, pos.z],
    color: userColors[userId],
    size: userImportance[userId]
  });
});

// 繪制靈魂連接線 (相似度 > 0.8)
soulmates.forEach(([user1, user2, similarity]) => {
  drawLine(
    positions[user1],
    positions[user2],
    { opacity: similarity, color: '#00ff00' }
  );
});
```

### 4. Parallel Lives (平行人生)

**終極功能**: AI 生成"你的平行宇宙版本"

**實現**:
1. 用戶提供當前狀態 (年齡、職業、地點、選擇)
2. Gemini 生成 3-5 個"如果你選擇了另一條路"的故事
3. 將每個平行人生也生成 Soul Vector
4. 讓用戶和"平行的自己"對話

**示例**:
```typescript
const parallelLives = await generateParallelLives({
  currentLife: {
    age: 28,
    job: "軟件工程師",
    location: "台北",
    keyDecisions: ["選擇了計算機專業", "沒有創業"]
  }
});

// 返回:
[
  {
    title: "創業家的你",
    story: "26 歲時創立了一家 AI 初創公司,現在在矽谷...",
    soulVector: [...]
  },
  {
    title: "藝術家的你",
    story: "23 歲時去了巴黎學畫畫,現在是自由插畫師...",
    soulVector: [...]
  }
]
```

---

## 🧪 社會實驗設計

### Experiment 1: "偏見測量儀"

**假設**: 人的偏見可以通過向量相似度測量

**方法**:
1. 用戶完成隱式聯想測試 (IAT)
2. 生成"偏見向量" (bias vector)
3. 匿名展示用戶群體的偏見分佈
4. 追蹤用戶的偏見隨時間的變化

**倫理考量**:
- 數據完全匿名
- 不公開個人偏見數據
- 僅展示群體統計

### Experiment 2: "記憶可靠性實驗"

**假設**: 人的記憶會隨時間扭曲,AI 可以檢測這種扭曲

**方法**:
1. 用戶記錄一個事件的記憶
2. 1 個月後,再次描述同一事件
3. AI 比較兩個版本的向量距離
4. 計算"記憶漂移指數"

### Experiment 3: "靈魂伴侶預測準確率"

**假設**: 向量相似度 > 0.9 的兩人,現實中也會成為好友

**方法**:
1. 匹配向量相似度高的用戶
2. 追蹤他們是否真的成為朋友
3. 計算準確率
4. 優化匹配算法

---

## 💾 數據存儲架構

### Supabase (主數據庫)

```sql
-- 用戶表
CREATE TABLE users (
  id UUID PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255),
  created_at TIMESTAMP
);

-- 靈魂向量表
CREATE TABLE soul_vectors (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  vector VECTOR(768),
  archetype VARCHAR(50),
  traits JSONB,
  updated_at TIMESTAMP
);

-- 記憶表
CREATE TABLE memories (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content TEXT,
  embedding VECTOR(768),
  importance INT CHECK (importance BETWEEN 1 AND 10),
  tags TEXT[],
  created_at TIMESTAMP
);

-- 靈魂連接表
CREATE TABLE soul_connections (
  user1_id UUID REFERENCES users(id),
  user2_id UUID REFERENCES users(id),
  similarity FLOAT,
  destiny_score FLOAT,
  created_at TIMESTAMP,
  PRIMARY KEY (user1_id, user2_id)
);
```

### Redis (緩存層)

```typescript
// 緩存用戶的 Soul Vector (避免頻繁查詢數據庫)
await redis.setex(
  `soul_vector:${userId}`,
  3600, // 1 小時過期
  JSON.stringify(soulVector)
);

// 緩存推薦的 Soulmates
await redis.setex(
  `soulmates:${userId}`,
  1800, // 30 分鐘過期
  JSON.stringify(soulmates)
);
```

---

## 🎨 UI/UX 設計理念

### 賽博朋克 + 極簡主義

**顏色方案**:
- 主色: 霓虹綠 (#00ff00)
- 輔色: 暗紫色 (#9333ea)
- 背景: 深空灰 (#0a0a0a)
- 文字: 冰白色 (#f5f5f5)

**字體**:
- 英文: **JetBrains Mono** (等寬字體,黑客風)
- 中文: **思源黑體** / **霞鶩文楷**

**動畫**:
- 矩陣雨效果 (Matrix rain)
- 全息投影效果 (Hologram glitch)
- 平滑的向量空間旋轉

---

## 📊 MVP 版本規劃

### Phase 1: 核心功能 (Week 1-4)

- [x] 20Q 靈魂測試
- [x] Soul Vector 生成與存儲
- [x] Soulmate 匹配算法
- [ ] Memory Garden (簡化版)

### Phase 2: 社交功能 (Week 5-8)

- [ ] 用戶間對話系統
- [ ] Destiny Map 3D 可視化
- [ ] 群組功能 (基於向量聚類)

### Phase 3: 實驗功能 (Week 9-12)

- [ ] 偏見測量儀
- [ ] 記憶可靠性實驗
- [ ] Parallel Lives 生成器

---

## 🚨 倫理與隱私

### 數據收集原則

1. **透明**: 明確告知用戶數據如何使用
2. **匿名**: 所有實驗數據匿名化
3. **可控**: 用戶可以刪除自己的所有數據
4. **安全**: 向量數據加密存儲

### 潛在風險

⚠️ **算法偏見**: Soul Vector 可能反映訓練數據的偏見  
⚠️ **隱私洩露**: 768 維向量理論上可以反推出部分個人信息  
⚠️ **過度量化**: 將人性簡化為數字,可能失去人文關懷

**緩解措施**:
- 使用多樣化的訓練數據
- 向量數據添加噪聲 (differential privacy)
- 明確提示用戶:這是實驗,不是科學結論

---

## 🌌 哲學思考

### 這個項目的終極問題

1. **人的本質能被量化嗎?**  
   如果兩個人的 Soul Vector 相似度是 0.95,他們是否真的"靈魂相似"?

2. **記憶塑造身份,還是身份選擇記憶?**  
   如果 AI 可以預測你會記住什麼、忘記什麼,那記憶還有意義嗎?

3. **自由意志 vs. 向量決定論**  
   如果你的所有選擇都可以被 768 維向量預測,你還有自由意志嗎?

### 賽博朋克視角

**地球Online** 不是要回答這些問題,而是要讓用戶在玩的過程中,自己思考這些問題。

> "We are not just building a platform. We are creating a mirror — a digital mirror that reflects the most hidden parts of human nature."

---

**🏯 蒸餾評級**: ⭐⭐⭐⭐⭐ (100% 哲學精華)  
**諸葛亮曰**: "人心如棋局,看似無序,實則有道。用數測心,乃兵家之大智也。"

---

## 🔗 相關資源

- **論文**: Generative Agents (Stanford & Google)
- **技術**: pgvector, Supabase, Gemini Embeddings API
- **靈感**: Black Mirror, Westworld, The Matrix
- **目標受眾**: 數字遊民、黑客文化愛好者、哲學系學生
