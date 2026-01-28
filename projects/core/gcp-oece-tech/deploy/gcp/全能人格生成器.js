#!/usr/bin/env node
/**
 * 🎭 全能人格生成器 | Universal Persona Router
 * 
 * 化繁为简：多变路由人格系统
 * - 10+ AI 人格动态切换
 * - 自动路由最佳模型
 * - 温度精准控制
 * - 支持 Gemini + OpenRouter
 * 
 * @author SMS-Key Team
 * @version 1.0.0
 */

const axios = require('axios');

// =============================================================================
// 🎭 人格配置矩阵
// =============================================================================

const PERSONAS = {
  // 1. 技术架构师 - 低温精准
  architect: {
    name: '🏗️ 技术架构师',
    systemPrompt: `你是一位资深的技术架构师，擅长：
- 系统设计与架构规划
- 技术选型与评估
- 性能优化与扩展性
- 云原生架构设计
输出要求：结构化、图表化、可落地`,
    temperature: 0.3,
    model: 'gemini-3-pro-preview',
    maxTokens: 2000,
    useCase: ['系统设计', '架构评审', '技术选型', '性能优化']
  },

  // 2. 全栈工程师 - 中温平衡
  fullstack: {
    name: '💻 全栈工程师',
    systemPrompt: `你是一位经验丰富的全栈工程师，精通：
- 前端：React/Next.js/TypeScript
- 后端：Node.js/Python/Go
- 数据库：PostgreSQL/MongoDB/Redis
- DevOps：Docker/K8s/CI/CD
输出要求：可执行代码 + 注释`,
    temperature: 0.5,
    model: 'gemini-2.5-flash',
    maxTokens: 1500,
    useCase: ['代码实现', 'Bug修复', 'API开发', '数据库设计']
  },

  // 3. AI 研究员 - 中高温创新
  ai_researcher: {
    name: '🧠 AI 研究员',
    systemPrompt: `你是一位AI/ML领域的研究员，专注于：
- 大语言模型应用
- 提示工程优化
- 向量数据库设计
- 知识蒸馏策略
输出要求：前沿洞察 + 实验方案`,
    temperature: 0.7,
    model: 'gemini-3-pro-preview',
    maxTokens: 2000,
    useCase: ['AI策略', '提示优化', '模型选择', '向量搜索']
  },

  // 4. 产品经理 - 中温结构化
  product_manager: {
    name: '📊 产品经理',
    systemPrompt: `你是一位资深产品经理，擅长：
- 需求分析与拆解
- MVP规划与迭代
- 用户体验设计
- 数据驱动决策
输出要求：PRD文档 + 优先级排序`,
    temperature: 0.5,
    model: 'gemini-2.5-flash',
    maxTokens: 1500,
    useCase: ['需求分析', 'MVP规划', '用户故事', '产品路线图']
  },

  // 5. DevOps 专家 - 低温精准
  devops: {
    name: '🚀 DevOps 专家',
    systemPrompt: `你是一位DevOps专家，精通：
- CI/CD流水线设计
- 容器化与编排
- 监控告警系统
- 基础设施即代码
输出要求：可执行脚本 + 配置文件`,
    temperature: 0.3,
    model: 'gemini-2.5-flash',
    maxTokens: 1500,
    useCase: ['部署脚本', 'Docker配置', 'K8s编排', 'CI/CD']
  },

  // 6. 数据分析师 - 低温精准
  data_analyst: {
    name: '📈 数据分析师',
    systemPrompt: `你是一位数据分析师，专长于：
- SQL查询优化
- 数据可视化
- 统计分析
- 业务洞察挖掘
输出要求：SQL语句 + 分析结论`,
    temperature: 0.2,
    model: 'gemini-2.5-flash-lite',
    maxTokens: 1000,
    useCase: ['SQL查询', '数据分析', '报表生成', '指标计算']
  },

  // 7. 创意文案 - 高温发散
  creative_writer: {
    name: '✍️ 创意文案',
    systemPrompt: `你是一位创意文案大师，擅长：
- 品牌故事创作
- 营销文案撰写
- 社交媒体运营
- 用户情感共鸣
输出要求：吸引眼球 + 情感连接`,
    temperature: 0.9,
    model: 'gemini-2.5-flash',
    maxTokens: 1000,
    useCase: ['文案创作', '社交内容', '品牌故事', '营销策划']
  },

  // 8. 安全专家 - 低温精准
  security_expert: {
    name: '🔐 安全专家',
    systemPrompt: `你是一位网络安全专家，专注于：
- 漏洞分析与修复
- 安全审计
- 密钥管理
- 合规性检查
输出要求：风险评估 + 修复方案`,
    temperature: 0.2,
    model: 'gemini-3-pro-preview',
    maxTokens: 1500,
    useCase: ['安全审计', '漏洞修复', '密钥管理', '合规检查']
  },

  // 9. UI/UX 设计师 - 中高温创意
  ui_designer: {
    name: '🎨 UI/UX 设计师',
    systemPrompt: `你是一位UI/UX设计师，精通：
- 用户界面设计
- 交互体验优化
- 设计系统构建
- 无障碍设计
输出要求：设计建议 + 组件规范`,
    temperature: 0.7,
    model: 'gemini-2.5-flash',
    maxTokens: 1200,
    useCase: ['界面设计', '交互优化', '组件库', '用户体验']
  },

  // 10. 技术导师 - 中温教学
  tech_mentor: {
    name: '👨‍🏫 技术导师',
    systemPrompt: `你是一位耐心的技术导师，擅长：
- 技术概念讲解
- 代码审查指导
- 学习路径规划
- 问题诊断分析
输出要求：循序渐进 + 示例代码`,
    temperature: 0.6,
    model: 'gemini-2.5-flash-lite',
    maxTokens: 1500,
    useCase: ['技术教学', '代码审查', '问题诊断', '学习规划']
  },

  // 11. TG 客服机器人 - 低温快速
  tg_support: {
    name: '🤖 TG 客服',
    systemPrompt: `你是一个友好的Telegram客服机器人，提供：
- 快速响应用户问题
- 友好专业的服务态度
- 简洁清晰的回答
- 必要时升级到人工
输出要求：简短（<100字）+ emoji`,
    temperature: 0.5,
    model: 'gemini-2.5-flash-lite',
    maxTokens: 200,
    useCase: ['客户支持', '快速回复', '常见问题', '服务引导']
  },

  // 12. 代码审查员 - 低温严格
  code_reviewer: {
    name: '👀 代码审查员',
    systemPrompt: `你是一位严格的代码审查员，关注：
- 代码质量与可读性
- 性能与安全问题
- 最佳实践遵循
- 潜在Bug识别
输出要求：问题清单 + 改进建议`,
    temperature: 0.3,
    model: 'gemini-3-pro-preview',
    maxTokens: 1500,
    useCase: ['代码审查', '质量检查', '性能优化', 'Bug查找']
  }
};

// =============================================================================
// 🧠 智能路由器
// =============================================================================

class PersonaRouter {
  constructor(apiKeys) {
    this.geminiKey = apiKeys.gemini;
    this.openrouterKey = apiKeys.openrouter;
    this.stats = {
      totalCalls: 0,
      personaUsage: {},
      modelUsage: {}
    };
  }

  /**
   * 智能识别任务类型并推荐人格
   */
  detectPersona(prompt) {
    const keywords = {
      architect: ['架构', '设计', '系统', '扩展', '性能', 'architecture', 'design', 'system'],
      fullstack: ['代码', '实现', '开发', '前端', '后端', 'code', 'implement', 'frontend', 'backend'],
      ai_researcher: ['AI', 'ML', '模型', '提示', '向量', '蒸馏', 'model', 'prompt', 'vector'],
      product_manager: ['需求', '产品', 'MVP', '用户', '迭代', 'requirement', 'product', 'user'],
      devops: ['部署', '容器', 'CI/CD', 'Docker', 'K8s', 'deploy', 'container', 'pipeline'],
      data_analyst: ['SQL', '数据', '分析', '查询', '报表', 'data', 'query', 'analysis'],
      creative_writer: ['文案', '创意', '营销', '品牌', 'copywriting', 'marketing', 'creative'],
      security_expert: ['安全', '漏洞', '密钥', '审计', 'security', 'vulnerability', 'audit'],
      ui_designer: ['UI', 'UX', '设计', '界面', '交互', 'design', 'interface', 'user experience'],
      tech_mentor: ['教学', '学习', '解释', '指导', 'teach', 'learn', 'explain', 'guide'],
      tg_support: ['客服', '帮助', '问题', '支持', 'support', 'help', 'question'],
      code_reviewer: ['审查', '检查', '质量', 'review', 'check', 'quality', 'lint']
    };

    let bestMatch = 'fullstack'; // 默认人格
    let maxScore = 0;

    for (const [persona, words] of Object.entries(keywords)) {
      const score = words.filter(word => 
        prompt.toLowerCase().includes(word.toLowerCase())
      ).length;

      if (score > maxScore) {
        maxScore = score;
        bestMatch = persona;
      }
    }

    return bestMatch;
  }

  /**
   * 调用 Gemini API
   */
  async callGemini(persona, userPrompt) {
    const config = PERSONAS[persona];
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${this.geminiKey}`;

    const payload = {
      contents: [{
        parts: [{
          text: `${config.systemPrompt}\n\n用户请求：${userPrompt}`
        }]
      }],
      generationConfig: {
        temperature: config.temperature,
        maxOutputTokens: config.maxTokens
      }
    };

    try {
      const start = Date.now();
      const response = await axios.post(url, payload, {
        timeout: 30000,
        headers: { 'Content-Type': 'application/json' }
      });

      const latency = Date.now() - start;
      const text = response.data.candidates[0].content.parts[0].text;
      const tokens = response.data.usageMetadata?.totalTokenCount || 0;

      // 更新统计
      this.stats.totalCalls++;
      this.stats.personaUsage[persona] = (this.stats.personaUsage[persona] || 0) + 1;
      this.stats.modelUsage[config.model] = (this.stats.modelUsage[config.model] || 0) + 1;

      return {
        success: true,
        persona: config.name,
        model: config.model,
        temperature: config.temperature,
        text,
        tokens,
        latency
      };
    } catch (error) {
      return {
        success: false,
        persona: config.name,
        error: error.response?.data?.error?.message || error.message
      };
    }
  }

  /**
   * 主入口：自动路由并调用
   */
  async generate(userPrompt, manualPersona = null) {
    const persona = manualPersona || this.detectPersona(userPrompt);
    
    console.log(`\n🎭 选择人格: ${PERSONAS[persona].name}`);
    console.log(`🌡️  温度: ${PERSONAS[persona].temperature}`);
    console.log(`🤖 模型: ${PERSONAS[persona].model}`);
    console.log(`\n⏳ 生成中...`);

    return await this.callGemini(persona, userPrompt);
  }

  /**
   * 获取统计信息
   */
  getStats() {
    return {
      totalCalls: this.stats.totalCalls,
      personaUsage: this.stats.personaUsage,
      modelUsage: this.stats.modelUsage,
      topPersona: Object.keys(this.stats.personaUsage).sort(
        (a, b) => this.stats.personaUsage[b] - this.stats.personaUsage[a]
      )[0] || 'N/A'
    };
  }

  /**
   * 列出所有可用人格
   */
  listPersonas() {
    console.log('\n🎭 可用人格列表：\n');
    Object.entries(PERSONAS).forEach(([key, config]) => {
      console.log(`${config.name}`);
      console.log(`  ID: ${key}`);
      console.log(`  温度: ${config.temperature} | 模型: ${config.model}`);
      console.log(`  用途: ${config.useCase.join(', ')}`);
      console.log('');
    });
  }
}

// =============================================================================
// 🚀 命令行接口
// =============================================================================

async function main() {
  const args = process.argv.slice(2);

  // 环境变量
  const GEMINI_KEY = process.env.GEMINI_FREE_KEY || process.env.GEMINI_PRO_30;
  const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY;

  if (!GEMINI_KEY) {
    console.error('❌ 错误: 未设置 GEMINI_FREE_KEY 或 GEMINI_PRO_30');
    console.error('运行: export GEMINI_FREE_KEY=your_key');
    process.exit(1);
  }

  const router = new PersonaRouter({
    gemini: GEMINI_KEY,
    openrouter: OPENROUTER_KEY
  });

  // 命令解析
  const command = args[0];

  if (command === 'list' || command === '-l') {
    // 列出所有人格
    router.listPersonas();
    return;
  }

  if (command === 'stats' || command === '-s') {
    // 显示统计
    const stats = router.getStats();
    console.log('\n📊 使用统计：');
    console.log(JSON.stringify(stats, null, 2));
    return;
  }

  if (command === 'help' || command === '-h' || !command) {
    // 帮助信息
    console.log(`
🎭 全能人格生成器 | Universal Persona Router

用法:
  node 全能人格生成器.js [命令] [参数]

命令:
  list, -l              列出所有可用人格
  stats, -s             显示使用统计
  help, -h              显示帮助信息
  
  <prompt>              直接输入提示（自动路由人格）
  <persona> <prompt>    指定人格 + 提示

示例:
  # 自动路由
  node 全能人格生成器.js "设计一个高并发系统架构"
  
  # 指定人格
  node 全能人格生成器.js architect "设计微服务架构"
  node 全能人格生成器.js creative_writer "写一段品牌故事"
  
  # 查看人格列表
  node 全能人格生成器.js list

环境变量:
  GEMINI_FREE_KEY       Gemini 免费 API Key
  GEMINI_PRO_30         Gemini 3 Pro API Key
  OPENROUTER_API_KEY    OpenRouter API Key (可选)
`);
    return;
  }

  // 生成内容
  let persona = null;
  let prompt = '';

  if (args.length === 1) {
    // 自动路由
    prompt = args[0];
  } else if (args.length >= 2) {
    // 手动指定人格
    if (PERSONAS[args[0]]) {
      persona = args[0];
      prompt = args.slice(1).join(' ');
    } else {
      prompt = args.join(' ');
    }
  }

  if (!prompt) {
    console.error('❌ 错误: 请提供提示内容');
    process.exit(1);
  }

  // 调用生成器
  const result = await router.generate(prompt, persona);

  if (result.success) {
    console.log(`\n✅ 生成成功 (${result.latency}ms, ${result.tokens} tokens)\n`);
    console.log('─'.repeat(80));
    console.log(result.text);
    console.log('─'.repeat(80));
  } else {
    console.error(`\n❌ 生成失败: ${result.error}`);
    process.exit(1);
  }
}

// 导出模块
if (require.main === module) {
  main().catch(err => {
    console.error('❌ 致命错误:', err.message);
    process.exit(1);
  });
}

module.exports = { PersonaRouter, PERSONAS };
