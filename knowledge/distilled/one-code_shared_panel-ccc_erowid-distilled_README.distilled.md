---
source: one-code_shared_panel-ccc_erowid-distilled_README.md
distilled_at: 2026-02-14T09:35:00.384Z
model: grok-4-1-fast-non-reasoning
---

# 迷幻物质知识文档：临床评估与减害指南

**文档声明**：本知识文档仅供医学研究和教育目的使用，不构成医疗建议、处方或诊断依据。所有信息基于公开来源，并非临床指导。使用前请咨询合格医疗专业人士。

**生成模型**：grok-4-0709  
**预算**：$30（生成与维护成本）  
**主要来源**：erowid.org（经验报告、基础数据与文献汇总）  
**更新机制**：自动同步erowid.org数据源  

---

## 引言与背景

本知识文档基于结构化目录布局和标准化分析框架，提供对迷幻物质（psychedelics）、致幻剂（hallucinogens）和相关化合物的全面临床评估。这些物质历史悠久，从传统萨满仪式（如Ayahuasca）到现代神经科学研究（如psilocybin用于抑郁治疗），已吸引广泛学术关注。

**目录布局**概述了数据组织方式，便于研究者检索：
- **`chemicals/`**：纯化学物质档案（如DMT、LSD、MDMA），聚焦合成或半合成化合物。
- **`plants/`**：天然植物来源（如Ayahuasca、Cannabis），强调传统使用与提取物。
- **`experiences/`**：用户报告数据库，具有临床观察价值（主观效应、剂量响应）。
- **`library_books/`**：学术书籍与专著，提供理论基础。
- **`research/`**：同行评审论文，追踪最新试验数据。

**分析框架**标准化每份资料的评估，确保客观性与全面性。框架源于药理学、毒理学和循证医学原则，参考FDA/EMA指南与MAPS（Multidisciplinary Association for Psychedelic Studies）研究。

---

## 数据结构详解

### 1. `chemicals/` - 化学物质档案
存储孤立化合物的详细profile，例如：
- **DMT**（N,N-二甲基色胺）：强效血清素2A受体激动剂，常通过烟熏摄入。
- **LSD**（麦角酸二乙胺）：长效致幻剂，微克级剂量即有效。
- **MDMA**（3,4-亚甲基二氧甲基苯丙胺）：肾上腺素与血清素释放剂，兼具移情增强效应。

这些档案链接至光谱数据、合成路径与纯度测试指南。

### 2. `plants/` - 植物来源档案
聚焦天然矩阵，例如：
- **Ayahuasca**：含DMT与β-咔啉碱（MAOI）的Amazonian brew。
- **Cannabis**（大麻）：THC/CBD主导，变异性高因品系差异。

强调农药残留、标准化提取与传统制备。

### 3. `experiences/` - 使用报告数据库
数千匿名报告，提供剂量-效应曲线与不良事件统计。临床价值：识别罕见副作用（如HPPD，持续感知障碍）。

### 4. `library_books/` - 学术文献库
核心文本如《The Psychedelic Explorer's Guide》（James Fadiman）与《How to Change Your Mind》（Michael Pollan），补充历史与哲学脉络。

### 5. `research/` - 研究论文库
索引PubMed/ClinicalTrials.gov条目，例如Johns Hopkins的psilocybin抑郁试验。

---

## 分析框架：临床评估维度

每份资料均按以下维度评估，数据来源于erowid.org与交叉验证的meta-analysis（e.g., Cochrane Reviews）。

### 1. 药理学评估
- **作用机制**：受体亲和性（e.g., 5-HT2A激动导致视觉幻觉）；神经递质影响（血清素、多巴胺释放）。
- **药代动力学（ADME）**：
  | 参数 | 示例（LSD） | 示例（MDMA） |
  |------|-------------|-------------|
  | 吸收 | 舌下/口服，生物利用度~70% | 口服，峰值1-2小时 |
  | 分布 | 广泛脑分布，半衰期~3-5小时 | Vd 5-6 L/kg |
  | 代谢 | CYP2D6/3A4 | CYP2D6（PM风险高） |
  | 排泄 | 尿液，~1%原型 | 尿液，pH依赖 |
- **剂量-效应关系**：阈值、低、中、高剂量阈值（e.g., psilocybin 1-5mg/70kg为疗效窗）。

### 2. 临床风险评估
- **急性毒性风险**：LD50高（e.g., LSD >100mg/kg），但心理恐慌常见；过量致高温/抽搐。
- **药物相互作用**：
  | 交互 | 风险 | 示例 |
  |------|------|------|
  | MAOIs | 血清素综合征 | Ayahuasca + SSRIs |
  | SSRIs | 减弱效应 | LSD + fluoxetine |
  | 刺激剂 | 心血管事件 | MDMA + cocaine |
- **禁忌症人群**：精神病史（加重精神分裂）、心血管病、孕妇。
- **成瘾潜力**：低（无物理依赖），但心理依赖可能（Hofmann评分）。

### 3. 治疗潜力评估
- **临床研究证据**：Phase II/III试验（e.g., MDMA for PTSD, FDA突破疗法地位）。
- **潜在适应症**：
  | 适应症 | 证据水平 | 关键研究 |
  |--------|----------|----------|
  | PTSD | 高（MAPS） | MDMA-assisted therapy |
  | 抑郁 | 中等（Phase III） | Psilocybin (COMPASS Pathways) |
  | 成瘾 | 初步 | Ibogaine for opioids |
  | 焦虑/终末癌 | 高 | Johns Hopkins |
- **研究进展阶段**：多数Phase II；LSD/psilocybin进入Phase III。

### 4. 减害医学建议
- **急诊处理要点**：
  1. 确保安全环境（“set and setting”）。
  2. 苯二氮卓类镇静恐慌；避免物理约束。
  3. 高热/抽搐：降温和支持性护理。
- **监测指标**：生命体征（HR>140bpm警戒）、Glasgow量表、血清素综合征筛查（Hunter标准）。

---

## 统计与证据基础

- **不良事件发生率**（erowid数据，n>50,000报告）：急性恐慌~10%、持久精神病<1%、死亡极罕见（间接，如事故）。
- **疗效meta-analysis**：Psilocybin抑郁缓解率~70%（4周随访，JAMA Psychiatry 2022）。
- **局限性**：多数数据为观察性；随机对照试验有限。

---

## 结论与资源链接

此框架促进证据-based迷幻医学，推动从娱乐向治疗范式转变。未来更新将纳入Phase III结果与全球监管变化（e.g., Oregon Psilocybin Program）。

**进一步阅读**：
- [Erowid.org](https://erowid.org) - 原始数据源。
- [MAPS.org](https://maps.org) - 临床试验。
- PubMed搜索："psychedelics clinical trials"。

**最后提醒**：实验风险自负；优先合法、监督环境。