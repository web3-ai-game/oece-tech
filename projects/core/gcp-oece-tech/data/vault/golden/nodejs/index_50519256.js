import { Bot, session } from 'grammy';
import { freeStorage } from '@grammyjs/storage-free';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import 'dotenv/config';

// 选择使用哪个Bot (1或2)
const BOT_NUM = process.env.BOT_NUM || '1';
const BOT_TOKEN = process.env[`TELEGRAM_BOT_TOKEN_${BOT_NUM}`];
const BOT_USERNAME = process.env[`TELEGRAM_BOT_USERNAME_${BOT_NUM}`];

if (!BOT_TOKEN) {
  console.error(`❌ TELEGRAM_BOT_TOKEN_${BOT_NUM} not found in .env.local`);
  process.exit(1);
}

console.log(`🤖 Starting Bot ${BOT_NUM}: @${BOT_USERNAME}`);

// 初始化Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// 初始化Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const gemini = genAI.getGenerativeModel({ 
  model: 'gemini-2.5-flash',
  generationConfig: {
    temperature: 0.9,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

// 创建Bot
const bot = new Bot(BOT_TOKEN);

// Session管理
bot.use(session({
  initial: () => ({ 
    conversationHistory: [],
    messageCount: 0,
  }),
  storage: freeStorage(bot.token),
}));

// 辅助函数：验证PRO会员
async function checkProMember(telegramId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, role, email')
      .eq('telegram_id', telegramId)
      .single();
    
    if (error) {
      console.log('User not found in database:', telegramId);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error checking PRO member:', error);
    return null;
  }
}

// 辅助函数：记录使用量
async function logGeminiUsage(userId, tokens, type = 'telegram_bot') {
  try {
    await supabase.from('gemini_usage').insert({
      user_id: userId,
      model: 'flash',
      type,
      tokens,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error logging usage:', error);
  }
}

// 命令: /start
bot.command('start', async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;
  
  console.log(`📥 /start from ${username} (${userId})`);
  
  const user = await checkProMember(userId);
  
  if (!user || user.role !== 'pro') {
    return ctx.reply(
      '🌊 *Welcome to DeepWeay!*\n\n' +
      'This bot is exclusively for PRO members.\n\n' +
      '✨ Upgrade to PRO to unlock:\n' +
      '• Unlimited AI conversations\n' +
      '• Trip planning assistance\n' +
      '• Cost analysis tools\n' +
      '• Priority support\n\n' +
      '👉 Visit: https://deepweay.me/pricing',
      { parse_mode: 'Markdown' }
    );
  }
  
  await ctx.reply(
    `🌊 *Welcome back, ${username}!*\n\n` +
    'I\'m your AI assistant powered by Gemini Flash. I can help you with:\n\n' +
    '🗺️ Travel planning\n' +
    '💰 Cost analysis\n' +
    '🌏 Visa information\n' +
    '💬 Any questions about digital nomad life\n\n' +
    '_Just send me a message to start chatting!_',
    { parse_mode: 'Markdown' }
  );
});

// 命令: /help
bot.command('help', async (ctx) => {
  await ctx.reply(
    '*DeepWeay Bot Commands:*\n\n' +
    '/start - Start the bot\n' +
    '/help - Show this help message\n' +
    '/reset - Reset conversation history\n' +
    '/stats - Show your usage stats\n\n' +
    '_Just send any message to chat with AI!_',
    { parse_mode: 'Markdown' }
  );
});

// 命令: /reset
bot.command('reset', async (ctx) => {
  ctx.session.conversationHistory = [];
  ctx.session.messageCount = 0;
  await ctx.reply('✅ Conversation history reset!');
});

// 命令: /stats
bot.command('stats', async (ctx) => {
  const userId = ctx.from.id;
  const user = await checkProMember(userId);
  
  if (!user) {
    return ctx.reply('Please link your Telegram account on deepweay.me first.');
  }
  
  // 获取今日使用量
  const today = new Date().toISOString().split('T')[0];
  const { data: usage } = await supabase
    .from('gemini_usage')
    .select('tokens')
    .eq('user_id', user.id)
    .gte('created_at', today)
    .eq('type', 'telegram_bot');
  
  const totalTokens = usage?.reduce((sum, u) => sum + u.tokens, 0) || 0;
  const messageCount = ctx.session.messageCount || 0;
  
  await ctx.reply(
    `📊 *Your Stats Today*\n\n` +
    `Messages: ${messageCount}\n` +
    `Tokens Used: ${totalTokens.toLocaleString()}\n` +
    `Model: Gemini Flash\n\n` +
    `_Keep chatting! No limits for PRO members._`,
    { parse_mode: 'Markdown' }
  );
});

// 调试：记录所有收到的消息
bot.on('message', (ctx) => {
  console.log(`📥 Received message in ${ctx.chat.type} from ${ctx.from.username}: ${ctx.message.text?.substring(0, 30) || '[non-text]'}`);
});

// 消息处理
bot.on('message:text', async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username || ctx.from.first_name;
  const message = ctx.message.text;
  const chatType = ctx.chat.type; // 'private', 'group', 'supergroup', 'channel'
  
  console.log(`🔍 Processing text message: type=${chatType}, text="${message.substring(0, 50)}"`);
  
  // 忽略命令
  if (message.startsWith('/')) {
    console.log(`⏭️  Skipping command: ${message}`);
    return;
  }
  
  // 群聊处理逻辑
  if (chatType !== 'private') {
    const botUsername = ctx.me.username;
    const isMention = message.includes(`@${botUsername}`);
    const isReply = ctx.message.reply_to_message?.from?.id === ctx.me.id;
    
    // 关键词列表（简体、繁体、英文）
    const keywords = [
      '小爱同学', '小愛同學',  // 简繁体
      '小爱', '小愛',
      'xiaoai', 'xiao ai',
      'love', 'bot',
      'deepweay', 'deep weay',
      '助手', '助理'
    ];
    
    // 检查是否包含关键词（不区分大小写）
    const lowerMessage = message.toLowerCase();
    const hasKeyword = keywords.some(keyword => 
      lowerMessage.includes(keyword.toLowerCase())
    );
    
    // 只响应@mention、回复bot消息或包含关键词的情况
    if (!isMention && !isReply && !hasKeyword) {
      console.log(`⏭️  Ignoring group message (no trigger): ${message.substring(0, 30)}...`);
      return;
    }
    
    const triggerType = isMention ? '@mention' : isReply ? 'reply' : 'keyword';
    console.log(`📨 Group message from ${username} (${triggerType}): ${message.substring(0, 50)}...`);
  } else {
    console.log(`📨 Private message from ${username}: ${message.substring(0, 50)}...`);
  }
  
  // 验证PRO会员
  const user = await checkProMember(userId);
  
  if (!user || user.role !== 'pro') {
    return ctx.reply(
      '⚠️ This feature is for PRO members only.\n\n' +
      'Upgrade at: https://deepweay.me/pricing'
    );
  }
  
  try {
    // 显示"正在输入"
    await ctx.replyWithChatAction('typing');
    
    // 构建对话历史
    const history = ctx.session.conversationHistory || [];
    
    // 系统提示词
    const systemPrompt = `You are DeepWeay AI Assistant, helping digital nomads with travel planning, cost analysis, visa information, and lifestyle advice. 

Be concise, friendly, and practical. Provide actionable advice. Use emojis sparingly but effectively.

User's language preference: ${ctx.from.language_code || 'en'}`;
    
    // 调用Gemini
    const chat = gemini.startChat({
      history: [
        { role: 'user', parts: [{ text: systemPrompt }] },
        { role: 'model', parts: [{ text: 'Understood! I\'m ready to help.' }] },
        ...history,
      ],
    });
    
    const result = await chat.sendMessage(message);
    const response = result.response.text();
    
    // 保存到历史
    history.push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: response }] }
    );
    
    // 限制历史长度（最多10轮对话）
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }
    
    ctx.session.conversationHistory = history;
    ctx.session.messageCount = (ctx.session.messageCount || 0) + 1;
    
    // 回复（处理长消息）
    if (response.length > 4096) {
      // 分段发送
      for (let i = 0; i < response.length; i += 4096) {
        await ctx.reply(response.substring(i, i + 4096), {
          parse_mode: 'Markdown',
        });
      }
    } else {
      await ctx.reply(response, {
        parse_mode: 'Markdown',
        reply_to_message_id: ctx.message.message_id,
      });
    }
    
    // 记录使用量
    const tokens = result.response.usageMetadata?.totalTokenCount || 0;
    await logGeminiUsage(user.id, tokens);
    
    console.log(`✅ Replied to ${username} (${tokens} tokens)`);
    
  } catch (error) {
    console.error('❌ Error processing message:', error);
    
    if (error.message.includes('429')) {
      await ctx.reply(
        '⏳ Sorry, I\'m a bit overwhelmed right now. Please try again in a minute.',
        { reply_to_message_id: ctx.message.message_id }
      );
    } else {
      await ctx.reply(
        '😅 Oops! Something went wrong. Please try again or contact support.',
        { reply_to_message_id: ctx.message.message_id }
      );
    }
  }
});

// 错误处理
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`❌ Error while handling update ${ctx.update.update_id}:`);
  console.error(err.error);
});

// 启动Bot
console.log(`✅ Bot started: @${BOT_USERNAME}`);
console.log(`📍 Bot ID: ${BOT_TOKEN.split(':')[0]}`);
console.log(`🤖 Bot ${BOT_NUM} is running...`);

// 先删除webhook再启动polling（避免409冲突）
bot.api.deleteWebhook({ drop_pending_updates: true })
  .then(() => {
    console.log('🗑️  Webhook cleared, starting polling...');
    return bot.start();
  })
  .catch(err => {
    console.error('❌ Failed to start bot:', err);
    process.exit(1);
  });

// 优雅关闭
process.once('SIGINT', () => {
  console.log('\n👋 Shutting down bot...');
  bot.stop();
});
process.once('SIGTERM', () => {
  console.log('\n👋 Shutting down bot...');
  bot.stop();
});
