import dotenv from 'dotenv';

dotenv.config();

export default {
  // Telegram配置
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN,
    avatarBotToken: process.env.TELEGRAM_BOT_TOKEN_AVATAR,
    chatId: process.env.TELEGRAM_CHAT_ID,
  },

  // API Keys - 支持多種環境變量名
  apiKeys: {
    gemini: process.env.GEMINI_API_KEY || process.env.GEMINI_API_OECE_TECH_,
    grok: process.env.GROK_API_KEY || process.env.GROK_ONE_,
  },

  // Gemini 配置
  gemini: {
    apiKey: process.env.GEMINI_API_KEY || process.env.GEMINI_API_OECE_TECH_,
  },

  // Grok 配置
  grok: {
    apiKey: process.env.GROK_API_KEY || process.env.GROK_ONE_,
  },

  // 模型配置 - 經濟優先，Gemini 贈金支撐
  // 最快: gemini-2.5-flash-preview-05-20 (免費額度高)
  // 最好: gemini-2.5-pro-preview-06-05 / gemini-exp-1206
  // Grok 3/4 太貴 ($15/M)，只用 <$2/M 的型號
  models: {
    default: process.env.MODEL_DEFAULT || 'gemini-2.5-flash-preview-05-20',
    fast: process.env.MODEL_FAST || 'gemini-2.5-flash-preview-05-20',
    best: process.env.MODEL_BEST || 'gemini-2.5-pro-preview-06-05',
    experimental: process.env.MODEL_EXPERIMENTAL || 'gemini-exp-1206',
    roast: process.env.MODEL_ROAST || 'gemini-2.5-flash-preview-05-20',
  },

  // Bot 行为配置
  bot: {
    autoReplyMode: process.env.AUTO_REPLY_MODE || 'all', // all, keyword, mention
    triggerKeywords: (process.env.TRIGGER_KEYWORDS || '帮助,问题,查询,记录,分析').split(','),
  },

  // MongoDB配置 - DO VPC 私網連接
  mongodb: {
    uri: process.env.MONGODB_URI || process.env.MONGODB_VPC_URI || 'mongodb://localhost:27017/sms_tg_bot',
    dbName: process.env.MONGODB_DB_NAME || 'sms_tg_bot',
    collections: {
      writings: 'writings',
      embeddings: 'embeddings',
      conversations: 'conversations',
    },
  },

  // 智能路由器配置
  router: {
    wordThreshold: parseInt(process.env.COMPLEXITY_WORD_THRESHOLD) || 100,
    complexityKeywords: (process.env.COMPLEXITY_KEYWORDS || '分析,深入,详细,研究,为什么,怎么理解,言外之意,潜台词,背后含义').split(','),
    roastKeywords: (process.env.ROAST_KEYWORDS || '喷,吐槽,搞笑,娱乐,开玩笑,幽默').split(','),
  },

  // 向量搜索配置
  vector: {
    dimension: parseInt(process.env.VECTOR_DIMENSION) || 768,
    similarityThreshold: parseFloat(process.env.VECTOR_SIMILARITY_THRESHOLD) || 0.7,
    maxResults: parseInt(process.env.MAX_SEARCH_RESULTS) || 5,
  },

  // 应用配置 - 智能路由優化
  // 經濟策略: Gemini 贈金無限用，Grok <$2/M 才考慮
  app: {
    default: process.env.MODEL_DEFAULT || 'gemini-2.5-flash-preview-05-20',
    fast: process.env.MODEL_FAST || 'gemini-2.5-flash-preview-05-20',
    complex: process.env.MODEL_COMPLEX || 'gemini-2.5-pro-preview-06-05',
    best: process.env.MODEL_BEST || 'gemini-2.5-pro-preview-06-05',
    experimental: process.env.MODEL_EXPERIMENTAL || 'gemini-exp-1206',
    medical: process.env.MODEL_MEDICAL || 'gemini-2.5-flash-preview-05-20',
    emotional: process.env.MODEL_EMOTIONAL || 'gemini-2.5-flash-preview-05-20', // 情緒價值
    fortune: process.env.MODEL_FORTUNE || 'gemini-2.5-pro-preview-06-05', // 算命/玄學
    geminiFallback: process.env.MODEL_GEMINI_FALLBACK || 'gemini-2.0-flash',
    roast: process.env.MODEL_ROAST || 'gemini-2.5-flash-preview-05-20',
  },
};
