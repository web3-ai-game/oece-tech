# 🌊 Windsurf 宇宙虚空驾驶舱 | 快速启动指南

> **目标**: 登录 Windsurf 后，一瞬间拥有完整的 AI 开发环境，自动化流水线 50-75% 完成

---

## 🚀 30秒快速开始

### 1. 安装 Windsurf

```bash
# Mac
https://windsurf.com/windsurf/download_mac

# Linux
https://windsurf.com/windsurf/download_linux

# Windows
https://windsurf.com/windsurf/download_windows
```

### 2. 导入配置（一键完成）

```bash
# 克隆项目
cd /home/svs-main-key/GCP

# 配置文件已就位：
# .windsurf/settings.json  ← Windsurf 配置
# .windsurf/rules.md       ← 自动化规则
# 全能人格生成器.js        ← 人格路由系统
```

### 3. 打开 Windsurf

```bash
# 方式 A: 命令行打开
windsurf /home/svs-main-key/GCP

# 方式 B: 图形界面
# 1. 启动 Windsurf
# 2. File → Open Folder
# 3. 选择 /home/svs-main-key/GCP
```

### 4. 登录 Windsurf 账号

按 `Cmd/Ctrl+Shift+P` → 输入 "Sign in"

---

## 🎭 全能人格生成器使用

### 命令行模式

```bash
# 查看所有人格
node 全能人格生成器.js list

# 自动路由（智能识别）
node 全能人格生成器.js "设计一个高并发微服务架构"
# → 自动识别为"技术架构师"人格

# 手动指定人格
node 全能人格生成器.js architect "设计分布式缓存系统"
node 全能人格生成器.js fullstack "实现用户登录API"
node 全能人格生成器.js creative_writer "写一段产品介绍文案"

# 查看使用统计
node 全能人格生成器.js stats
```

### API 集成模式

```javascript
const { PersonaRouter } = require('./全能人格生成器.js');

const router = new PersonaRouter({
  gemini: process.env.GEMINI_FREE_KEY,
  openrouter: process.env.OPENROUTER_API_KEY
});

// 自动路由
const result = await router.generate('帮我优化这段代码');

// 手动指定
const result = await router.generate('设计数据库架构', 'architect');

console.log(result.text);
```

---

## 🧠 12 种内置人格

| 人格 | ID | 温度 | 模型 | 用途 |
|------|-----|------|------|------|
| 🏗️ 技术架构师 | `architect` | 0.3 | 3-pro | 系统设计、架构评审 |
| 💻 全栈工程师 | `fullstack` | 0.5 | 2.5-flash | 代码实现、Bug修复 |
| 🧠 AI研究员 | `ai_researcher` | 0.7 | 3-pro | AI策略、模型优化 |
| 📊 产品经理 | `product_manager` | 0.5 | 2.5-flash | 需求分析、MVP规划 |
| 🚀 DevOps专家 | `devops` | 0.3 | 2.5-flash | 部署、CI/CD |
| 📈 数据分析师 | `data_analyst` | 0.2 | 2.5-flash-lite | SQL、数据分析 |
| ✍️ 创意文案 | `creative_writer` | 0.9 | 2.5-flash | 营销文案、品牌故事 |
| 🔐 安全专家 | `security_expert` | 0.2 | 3-pro | 安全审计、漏洞修复 |
| 🎨 UI设计师 | `ui_designer` | 0.7 | 2.5-flash | 界面设计、交互优化 |
| 👨‍🏫 技术导师 | `tech_mentor` | 0.6 | 2.5-flash-lite | 技术教学、代码审查 |
| 🤖 TG客服 | `tg_support` | 0.5 | 2.5-flash-lite | 客户支持、快速回复 |
| 👀 代码审查员 | `code_reviewer` | 0.3 | 3-pro | 代码审查、质量检查 |

---

## 🌊 Windsurf Cascade 高级技巧

### 1. 人格切换（在 Cascade 中）

```
// 方式 A: 直接描述（自动识别）
"帮我设计一个高并发系统架构"
→ 自动切换到 🏗️ 技术架构师

// 方式 B: 明确指定
"以技术架构师的角度，设计一个..."
"作为全栈工程师，实现..."
```

### 2. 上下文引用

```
@file:server.js 帮我优化性能
@folder:scripts/ 审查所有脚本
@conversation:上次的架构设计 继续优化
```

### 3. 连续任务（自动 Todo）

```
请帮我完成以下任务：
1. 设计 API 接口
2. 实现代码
3. 编写测试
4. 更新文档

→ Cascade 会自动创建 Todo List 并逐步执行
```

### 4. 检查点管理

```
创建检查点: v1.0-stable
→ 保存当前状态

回滚到检查点: v1.0-stable
→ 恢复到之前的状态
```

### 5. 批量文件操作

```
修改以下文件：
- server.js: 添加速率限制
- ecosystem.config.json: 更新环境变量
- Dockerfile: 优化镜像大小

→ Cascade 会自动处理所有文件
```

---

## 🔑 密钥配置（2 种方式）

### 方式 A: Doppler（推荐）

```bash
# 1. 安装 Doppler CLI
curl -Ls https://cli.doppler.com/install.sh | sudo sh

# 2. 登录
doppler login

# 3. 绑定项目
cd /home/svs-main-key/GCP
doppler setup

# 4. 运行（自动注入环境变量）
doppler run -- windsurf .
```

### 方式 B: 环境变量文件

```bash
# 1. 创建 .env 文件
cat > .env <<EOF
GEMINI_FREE_KEY=AIzaSyD_cNll0AKAmKZgO6pOJzMRosKiBJxuUNM
GEMINI_PRO_30=AIzaSyAj08QZ4B8CMU_CTG-QtGUEv0gBHZbM_cQ
OPENROUTER_API_KEY=sk-or-v1-YOUR_KEY
GCP_PROJECT_ID=your-project
NODE_ENV=development
EOF

# 2. 加载环境变量
source .env

# 3. 启动 Windsurf
windsurf .
```

⚠️ **重要**: `.env` 文件已在 `.gitignore` 中，不会提交到 Git

---

## 🚀 自动化工作流（内置）

### 1. 快速部署到 Cloud Run

```
// 在 Cascade 中输入：
"部署到 Cloud Run"

→ 自动执行：
1. 检查 Dockerfile
2. 构建镜像
3. 推送到 GCR
4. 部署到 Cloud Run
5. 健康检查
```

### 2. 创建新 API 端点

```
"创建一个获取用户信息的 API 端点"

→ 自动执行：
1. 设计 API 接口
2. 实现路由处理
3. 添加参数验证
4. 编写单元测试
5. 更新 API 文档
```

### 3. 代码审查与优化

```
"审查 server.js 的代码质量"

→ 自动执行：
1. 静态代码分析
2. 性能瓶颈识别
3. 安全漏洞检查
4. 重构建议
5. 测试覆盖率分析
```

---

## 📊 使用统计与监控

### 查看人格使用统计

```bash
node 全能人格生成器.js stats
```

输出示例：
```json
{
  "totalCalls": 50,
  "personaUsage": {
    "architect": 15,
    "fullstack": 20,
    "ai_researcher": 10,
    "devops": 5
  },
  "modelUsage": {
    "gemini-3-pro-preview": 25,
    "gemini-2.5-flash": 20,
    "gemini-2.5-flash-lite": 5
  },
  "topPersona": "fullstack"
}
```

---

## 🎯 实战示例

### 示例 1: 设计微服务架构

```bash
node 全能人格生成器.js architect "设计一个电商平台的微服务架构，包含用户、订单、支付、库存模块"
```

输出：
```
🎭 选择人格: 🏗️ 技术架构师
🌡️  温度: 0.3
🤖 模型: gemini-3-pro-preview

⏳ 生成中...

✅ 生成成功 (1250ms, 1500 tokens)

────────────────────────────────────────
## 电商平台微服务架构设计

### 1. 架构图
...
### 2. 技术栈选型
...
### 3. 扩展性分析
...
### 4. 风险评估
...
────────────────────────────────────────
```

### 示例 2: 实现登录 API

```bash
node 全能人格生成器.js fullstack "实现一个 JWT 登录 API，包含注册、登录、刷新 token"
```

### 示例 3: 优化 SQL 查询

```bash
node 全能人格生成器.js data_analyst "优化这个查询：SELECT * FROM users WHERE created_at > '2025-01-01'"
```

### 示例 4: 写营销文案

```bash
node 全能人格生成器.js creative_writer "为我们的 AI 开发工具写一段吸引人的产品介绍"
```

---

## 🔧 故障排除

### Q1: Windsurf 无法加载配置？

**A**: 确认配置文件路径正确：
```bash
ls -la /home/svs-main-key/GCP/.windsurf/
# 应该看到 settings.json 和 rules.md
```

### Q2: API Key 未生效？

**A**: 检查环境变量：
```bash
echo $GEMINI_FREE_KEY
# 应该输出你的 API Key
```

### Q3: 人格生成器报错？

**A**: 检查 Node.js 版本和依赖：
```bash
node --version  # 应该 >= 18.0.0
npm install axios
```

### Q4: Cascade 无法识别人格？

**A**: 使用明确的触发词：
```
❌ "帮我做个东西"  → 太模糊
✅ "作为技术架构师，设计一个..." → 明确
```

---

## 📚 进阶配置

### 自定义人格

编辑 `全能人格生成器.js`，添加新人格：

```javascript
const PERSONAS = {
  // ... 现有人格
  
  // 新增自定义人格
  blockchain_expert: {
    name: '⛓️ 区块链专家',
    systemPrompt: `你是一位区块链技术专家...`,
    temperature: 0.5,
    model: 'gemini-3-pro-preview',
    maxTokens: 2000,
    useCase: ['智能合约', '链上数据', 'Web3']
  }
};
```

### 自定义 Windsurf 规则

编辑 `.windsurf/rules.md`，添加项目特定规则：

```markdown
## 🏢 公司特定规范

### 代码风格
- 使用 2 空格缩进
- 函数名使用 camelCase
- 类名使用 PascalCase

### API 规范
- RESTful 风格
- 统一错误码
- 返回格式：{success, data, error}
```

---

## 🎉 完成！

现在你拥有：
- ✅ 12 种 AI 人格，自动路由
- ✅ Windsurf 宇宙虚空驾驶舱配置
- ✅ 自动化工作流（50-75% 完成）
- ✅ 密钥管理（Doppler 集成）
- ✅ 一键部署到 Cloud Run

### 下一步建议

1. **试用所有人格**: `node 全能人格生成器.js list`
2. **导入 Windsurf**: 打开项目文件夹
3. **开始第一个任务**: 在 Cascade 中尝试复杂任务
4. **查看统计**: `node 全能人格生成器.js stats`
5. **分享反馈**: 优化人格配置

---

**最后更新**: 2025-11-26  
**维护者**: SMS-Key Team  
**版本**: v1.0

🌊 **祝你在宇宙虚空中驾驶愉快！**
