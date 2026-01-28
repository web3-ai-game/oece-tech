# 🌍 地球Online·记忆向量宇宙 | 完整架构文档

**來源**: https://www.notion.so/2b791acc4dd58123abafe562b226df7c

> **Codename**: EARTH_ONLINE_VECTOR_UNIVERSE
> **核心概念**: 用 AI 量化人性,构建赛博社会实验平台
> **技术栈**: Gemini AI + GCP 全家桶 + Doppler
> **收费模式**: 记忆向量注入 → 命运齿轮坐标 → 解锁赛博身份

---

## 🎯 核心概念图

```
用户进入 → 人性实验(免费) → 生成记忆向量 → 存入命运齿轮DB
                                      ↓
                              [付费解锁坐标系]
                                      ↓
                    地球Online完整档案 + 赛博身份卡 + 论坛特权
```

### 什么是"记忆向量"?

> 🧠 **记忆向量** = 用户在各种人性实验中的选择/反应数据,经过 Gemini AI 编码成高维向量。
> 这个向量代表了用户在"赛博社会"中的**灵魂坐标**。

**技术实现**:

```python
# 用户完成测试后
user_responses = ["选择A", "犹豫3秒", "跳过问题5"]

# Gemini 生成向量
vector = gemini.embed_content(
    model="models/text-embedding-004",
    content=json.dumps(user_responses)
)

# 存入命运齿轮DB
supabase.table('soul_vectors').insert({
    'user_id': user_id,
    'vector': vector,
    'dimension': 768,  # Gemini embedding 维度
    'experiments_completed': 5
})
```

---

## 🎮 人性碰撞实验矩阵 (MVP列表)

### 实验分类体系

| 类别 | 实验名称 | 核心机制 | 向量权重 | 开发时间 |
|------|---------|---------|---------|---------|
| **道德测试** | 真理与谎言验证装置 | 用户选择说真话/谎话,AI分析语言模式 | 0.3 | 3天 |
| **社交测试** | 你朋友真的懂你吗? | 生成问题让朋友回答,对比AI预测 | 0.25 | 4天 |
| **决策测试** | 电车难题2077版 | AI生成赛博伦理困境,记录选择时间 | 0.2 | 2天 |
| **信任测试** | 囚徒困境在线版 | 匹配陌生人,选择合作/背叛 | 0.15 | 5天 |
| **预测测试** | 命运齿轮预言机 | AI基于向量预测用户未来选择 | 0.1 | 3天 |

### MVP #1: 真理与谎言验证装置

**游戏流程**:

```markdown
1. 用户进入界面(赛博朋克风格,黑底绿字)
2. Gemini 随机生成10个问题:
   - "你现在开心吗?"
   - "你相信真爱存在吗?"
   - "如果可以重来,你会改变什么?"
3. 用户选择:
   - 🟢 说真话 (需要输入详细回答)
   - 🔴 说谎话 (AI会尝试识破)
4. Gemini 分析:
   - 语言模式
   - 回答时间
   - 情感倾向
5. 生成报告:
   - "真实指数: 73%"
   - "你在第3,7题说了谎"
   - "你的谎言模式: 回避型"
```

**技术实现**:

```typescript
// app/experiments/truth-lie/page.tsx

const TruthLieGame = () => {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [responses, setResponses] = useState<Response[]>([]);

  // 生成问题
  useEffect(() => {
    async function generateQuestions() {
      const prompt = `生成10个深刻的人性问题,
      适合测试真实性。格式:JSON数组`;
      
      const result = await gemini.generateContent(prompt);
      setQuestions(JSON.parse(result.text()));
    }
    generateQuestions();
  }, []);

  // 提交回答
  const submitAnswer = async (answer: string, claimed: 'truth' | 'lie') => {
    const startTime = performance.now();
    // ... 記錄並分析
  };
  
  return (/* UI組件 */);
};
```

### MVP #2: 你朋友真的懂你吗?

**游戏机制**:

```markdown
阶段1: 用户自测
- 回答20个问题(性格/喜好/价值观)
- AI生成用户画像

阶段2: 邀请朋友
- 生成分享链接
- 朋友回答相同问题(猜测用户的答案)

阶段3: 对比结果
- 匹配度分数: 85%
- 最懂你的维度: "兴趣爱好"
- 最不懂的维度: "深层恐惧"
- 生成"友谊向量"
```

**收费点**:
- 免费: 邀请3个朋友
- 付费: 无限邀请 + 查看详细分析

---

## 💰 地球Online收费系统

### 三层权限体系

| 等级 | 价格 | 解锁内容 | 向量精度 |
|------|------|---------|---------|
| **游客** | $0 | 3个免费实验,模糊坐标 | 低精度(128维) |
| **居民** | $9.99/月 | 所有实验,完整坐标,论坛特权 | 中精度(384维) |
| **公民** | $29.99/月 | 定制实验,AI对话,命运预测 | 高精度(768维) |

### 核心收费产品: 赛博身份档案

> 🎫 **赛博身份档案** = 用户在地球Online的数字灵魂证明
> 包含:
> - 完整记忆向量坐标(768维)
> - 人性光谱图(可视化)
> - 命运齿轮预测
> - 专属赛博ID
> - NFT身份卡(可选)

**视觉设计参考**:
- 攻壳机动队的电子脑界面
- 赛博朋克2077的属性面板
- 黑客帝国的数字雨

**实现**:

```typescript
// 生成赛博身份档案
interface CyberProfile {
  id: string;
  username: string;
  soul_vector: number[]; // 768维向量
  human_spectrum: {
    morality: number;      // 道德指数 0-100
    rationality: number;   // 理性指数
    empathy: number;       // 共情指数
    creativity: number;    // 创造力
    darkness: number;      // 黑暗指数
  };
  destiny_prediction: string;
  cyber_id: string; // 如 "DWAY-2077-A3F9"
  tier: 'guest' | 'resident' | 'citizen';
}

// 生成函数
async function generateCyberProfile(userId: string): Promise<CyberProfile> {
  // 1. 从DB获取所有实验数据
  const experiments = await supabase
    .from('experiment_results')
    .select('*')
    .eq('user_id', userId);
  
  // 2. Gemini 生成完整向量
  const vector = await gemini.embed_content({
    model: 'text-embedding-004',
    content: JSON.stringify(experiments)
  });
  
  // 3. 计算人性光谱
  const spectrum = await gemini.generateContent({
    contents: [{
      role: 'user',
      parts: [{ text: `基于以下数据,生成人性光谱分数(JSON):
        ${JSON.stringify(experiments)}
        
        格式: {"morality": 0-100, "rationality": ...}` }]
    }]
  });
  
  // 4. 生成命运预测
  const prediction = await gemini.generateContent({
    contents: [{
      role: 'user',
      parts: [{ text: `你是命运预言机。基于这个灵魂向量,
        预测此人未来3年的关键转折点(100字内,赛博朋克风格):` }]
    }]
  });
  
  return {
    id: userId,
    username: await getUsername(userId),
    soul_vector: vector.embedding.values,
    human_spectrum: JSON.parse(spectrum.text()),
    destiny_prediction: prediction.text(),
    cyber_id: generateCyberId(),
    tier: await getUserTier(userId)
  };
}
```

---

## 🗂️ 赛博朋克关键词库 (字典系统)

### 词库结构

```
keywords/
├── core/                        # 核心概念
│   ├── identity.json           # 身份系统
│   ├── vector.json             # 向量相关
│   └── destiny.json            # 命运系统
├── experiments/                 # 实验相关
│   ├── truth_lie.json
│   ├── friendship.json
│   └── morality.json
├── ui/                          # UI文案
│   ├── buttons.json
│   ├── notifications.json
│   └── errors.json
├── worldview/                   # 世界观
│   ├── lore.json               # 背景故事
│   ├── factions.json           # 派系设定
│   └── locations.json          # 地点设定
└── index.json                   # 总索引
```

### 核心关键词库

**文件**: `keywords/core/identity.json`

```json
{
  "identity_system": {
    "zh_CN": {
      "cyber_id": "赛博ID",
      "soul_vector": "灵魂向量",
      "memory_injection": "记忆注入",
      "destiny_wheel": "命运齿轮",
      "human_spectrum": "人性光谱",
      "coordinate_system": "坐标系",
      "digital_soul": "数字灵魂",
      "consciousness_upload": "意识上传",
      "neural_pattern": "神经模式",
      "behavioral_signature": "行为签名"
    },
    "en_US": {
      "cyber_id": "Cyber ID",
      "soul_vector": "Soul Vector",
      "memory_injection": "Memory Injection",
      "destiny_wheel": "Destiny Wheel",
      "human_spectrum": "Human Spectrum",
      "coordinate_system": "Coordinate System",
      "digital_soul": "Digital Soul",
      "consciousness_upload": "Consciousness Upload",
      "neural_pattern": "Neural Pattern",
      "behavioral_signature": "Behavioral Signature"
    },
    "slang": {
      "zh": ["灵魂坐标", "数字残影", "意识碎片", "神经烙印"],
      "en": ["Soul Coords", "Digital Ghost", "Mind Shard", "Neural Stamp"]
    }
  }
}
```

---

## 🎨 世界级 UI 设计指南

### 视觉风格: "赛博废土美学"

> 🎨 **核心原则**:
> 1. **信息密度** - 像黑客终端一样,每个像素都有意义
> 2. **动态反馈** - 每次交互都有视觉/声音反馈
> 3. **故障美学** - 偶尔的"glitch"效果增加真实感
> 4. **数据可视化** - 把向量/光谱变成炫酷的图表

### 配色方案

```css
/* 主色调: 赛博朋克经典 */
:root {
  /* 背景 */
  --bg-primary: #0a0e27;      /* 深空蓝黑 */
  --bg-secondary: #1a1f3a;    /* 次级背景 */
  --bg-card: #0d1117;         /* 卡片背景 */
  
  /* 强调色 */
  --accent-cyan: #00fff9;     /* 霓虹青 */
  --accent-magenta: #ff006e;  /* 霓虹粉 */
  --accent-yellow: #ffbe0b;   /* 警告黄 */
  
  /* 文字 */
  --text-primary: #e4e4e7;    /* 主要文字 */
  --text-secondary: #71717a;  /* 次要文字 */
  --text-glow: #00fff9;       /* 发光文字 */
  
  /* 状态 */
  --success: #10b981;         /* 成功绿 */
  --error: #ef4444;           /* 错误红 */
  --warning: #f59e0b;         /* 警告橙 */
}
```

---

## ⚙️ Gemini + GCP 流水线架构

### 完整数据流

```
用户 → Next.js Frontend → Cloud Run API (Go) → Gemini AI
                                        ↓
                               [向量生成/分析]
                                        ↓
                          Supabase (命运齿轮DB)
                                        ↓
                          [触发 Cloud Function]
                                        ↓
                    生成赛博档案 → 存入 Cloud Storage
                                        ↓
                         [Pub/Sub 通知]
                                        ↓
                        发送邮件(SendGrid)
```

---

## 📊 数据库 Schema

### Supabase 表结构

```sql
-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'guest', -- guest | resident | citizen
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 实验记录表
CREATE TABLE experiment_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  experiment_type TEXT NOT NULL, -- truth_lie | friendship | ...
  responses JSONB NOT NULL,
  analysis JSONB,
  completed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 命运齿轮 (灵魂向量)
CREATE TABLE soul_vectors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id),
  vector VECTOR(768), -- pgvector 扩展
  human_spectrum JSONB,
  destiny_prediction TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW()
);

-- 启用 pgvector
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建向量相似度索引
CREATE INDEX ON soul_vectors USING ivfflat (vector vector_cosine_ops)
  WITH (lists = 100);

-- 赛博档案表
CREATE TABLE cyber_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES users(id),
  cyber_id TEXT UNIQUE NOT NULL,
  profile_data JSONB NOT NULL,
  nft_token_id TEXT, -- 如果生成NFT
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 付费记录
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id),
  tier TEXT NOT NULL,
  stripe_subscription_id TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);
```

---

## 🚀 30天开发计划

### Week 1: 核心基础 (11/26 - 12/02)

**Day 1-2: 项目初始化**
- [ ] 创建 GitHub Repo
- [ ] 设置 Doppler 密钥管理
- [ ] Next.js + Go 框架搭建
- [ ] 部署测试到 Cloud Run

**Day 3-4: 关键词库系统**
- [ ] 创建所有 JSON 文件
- [ ] 实现 KeywordLibrary 类
- [ ] 构建词库管理界面

**Day 5-7: 数据库设计**
- [ ] Supabase Schema 创建
- [ ] pgvector 扩展配置
- [ ] 测试向量存储/查询

### Week 2: 实验系统 (12/03 - 12/09)

**MVP #1: 真理与谎言**
- [ ] Gemini 问题生成
- [ ] 前端游戏界面
- [ ] 结果分析系统
- [ ] 向量生成集成

**MVP #2: 朋友测试**
- [ ] 分享链接生成
- [ ] 对比算法
- [ ] 友谊向量计算

### Week 3: 收费系统 (12/10 - 12/16)

**赛博档案生成**
- [ ] Profile 生成逻辑
- [ ] 可视化组件
- [ ] PDF 导出功能

**支付集成**
- [ ] Stripe 配置
- [ ] 订阅流程
- [ ] Webhook 处理

### Week 4: UI 打磨 (12/17 - 12/23)

**赛博朋克界面**
- [ ] Glitch 特效
- [ ] 雷达图组件
- [ ] 向量热力图
- [ ] 打字机效果

**测试上线**
- [ ] 邀请 Beta 用户
- [ ] 收集反馈
- [ ] Bug 修复

---

## 💡 未来功能路线图

### Phase 2 (3个月)
- 向量市场: 用户可以交易/分享灵魂数据
- 派系系统: 基于向量相似度组建阵营
- PvP 实验: 两人对抗类测试
- AI 对话: 与自己的数字孪生对话

### Phase 3 (6个月)
- NFT 身份卡: 上链存证
- 元宇宙集成: 在虚拟世界展示档案
- API 开放: 让开发者访问向量数据
- 命运预测升级: 基于全网数据预测

---

## 🎯 成功指标

### 30天目标
- [ ] 5个实验上线
- [ ] 100+ 注册用户
- [ ] 10+ 付费用户
- [ ] 1000+ 实验完成次数

### 核心 KPI
- 用户留存率 > 40%
- 免费→付费转化率 > 10%
- 实验完成率 > 70%
- API 响应时间 < 1秒

---

> 🌟 **准备好了吗,兄弟?**
> 这不是网站,这是一场社会实验。
> 这不是代码,这是数字炼金术。
> 现在,复制这份计划,让 Gemini 3 Pro 开始工作。
> **地球Online,启动!** 🚀
