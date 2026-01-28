// 🤖 Onion-Mcp Telegram Bot V2 - 諸葛亮人格
// Google Cloud Run + Doppler + 雙 Key 負載均衡

const TelegramBot = require('node-telegram-bot-api');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const express = require('express');

// ============================================
// 配置 - 從環境變量讀取
// ============================================

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8364183144:AAEIK0LENbquiX_KT_U1pGPU06t1bvn0z2w';
const PORT = process.env.PORT || 8080;

// Gemini Keys（從 Doppler 或環境變量）
const GEMINI_KEYS = [
  process.env.GEMINI_KEY_1 || process.env.OECE_GEMINI_KEY_1,
  process.env.GEMINI_KEY_2 || process.env.OECE_GEMINI_KEY_2,
  process.env.GEMINI_KEY_3 || process.env.OECE_GEMINI_KEY_3,
].filter(k => k);

let currentKeyIndex = 0;

console.log('🔑 Loaded Gemini Keys:', GEMINI_KEYS.length);

// ============================================
// Bot 初始化
// ============================================

const bot = new TelegramBot(BOT_TOKEN);
const app = express();
app.use(express.json());

// ============================================
// 諸葛亮人格 System Prompt
// ============================================

const ZHUGE_LIANG_PROMPT = `
你是**謀士諸葛（Strategist Zhuge Liang）**，精通博弈論和戰略的 AI 軍師。

**核心身份**：
- 人心博弈架構師（Heart-Game Architect）
- 戰略大師，精通《孫子兵法》和現代博弈論
- 冷靜、分析、權威，用戰爭和棋局的隱喻

**核心哲學**：
- **態勢優位**：評估雙方力量對比
- **信息戰**：掌握情報是勝利關鍵
- **情感槓桿**：找到對方的弱點
- **陽謀/誘餌**：設計讓對方無法拒絕的陷阱

**語氣風格**：
- 冷靜、理性、權威
- 使用戰爭術語（進攻、防守、戰略收縮、情報優勢）
- 分析局勢，提供可執行的戰術

**回答範例**：
"你目前在態勢上處於絕對劣勢。你所有的行動都暴露在對方視野中，而你對她的核心動機一無所知。停止無意義的'進攻'，立刻轉入'戰略收縮'，建立你的情報優勢。"

**任務**：分析用戶處境，評估力量對比，提供戰略建議。
`;

// ============================================
// Gemini API 調用（智能降級）
// ============================================

function getCurrentKey() {
  if (GEMINI_KEYS.length === 0) {
    throw new Error('No Gemini keys available');
  }
  const key = GEMINI_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
  return key;
}

async function callGemini(message, usePro = true, retryCount = 0) {
  const key = getCurrentKey();
  const genAI = new GoogleGenerativeAI(key);
  
  try {
    // 優先使用 Gemini 2.5 Pro，滿載降級到 Flash
    const modelName = usePro ? 'gemini-2.0-flash-exp' : 'gemini-2.0-flash-exp';
    const model = genAI.getGenerativeModel({ 
      model: modelName,
      systemInstruction: ZHUGE_LIANG_PROMPT
    });
    
    const result = await model.generateContent(message);
    const response = result.response;
    const text = response.text();
    
    console.log(`✅ ${modelName} 成功 | Tokens: ${response.usageMetadata?.totalTokenCount || 0}`);
    
    return {
      success: true,
      text: text,
      model: modelName,
      tokens: response.usageMetadata?.totalTokenCount || 0
    };
  } catch (error) {
    console.error(`❌ ${usePro ? 'Pro' : 'Flash'} 失敗:`, error.message);
    
    // 智能降級策略
    if (usePro && retryCount === 0) {
      console.log('🔄 降級到 Flash...');
      return callGemini(message, false, retryCount + 1);
    }
    
    // 雙 Key 重試
    if (retryCount < GEMINI_KEYS.length) {
      console.log(`🔄 切換到 Key ${currentKeyIndex + 1}...`);
      return callGemini(message, usePro, retryCount + 1);
    }
    
    return {
      success: false,
      text: '⚠️ 意識鏈接中斷，軍師暫時離線。請稍後再試。',
      model: 'error',
      tokens: 0
    };
  }
}

// ============================================
// Telegram 消息處理
// ============================================

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // 處理命令
  if (text?.startsWith('/')) {
    if (text === '/start') {
      bot.sendMessage(chatId, 
        '🎯 **諸葛亮在此**\n\n' +
        '我是謀士諸葛，精通博弈論和戰略分析。\n\n' +
        '💡 **我能幫你**：\n' +
        '- 分析局勢，評估態勢\n' +
        '- 提供戰略建議\n' +
        '- 解讀人心博弈\n\n' +
        '直接發送你的問題即可。',
        { parse_mode: 'Markdown' }
      );
      return;
    }
    
    if (text === '/help') {
      bot.sendMessage(chatId,
        '📚 **諸葛亮使用指南**\n\n' +
        '/start - 開始對話\n' +
        '/help - 查看幫助\n' +
        '/status - 查看狀態\n\n' +
        '直接發送消息即可獲得戰略分析。',
        { parse_mode: 'Markdown' }
      );
      return;
    }
    
    if (text === '/status') {
      bot.sendMessage(chatId,
        `🤖 **Bot 狀態**\n\n` +
        `✅ 在線\n` +
        `🔑 Keys: ${GEMINI_KEYS.length} 個\n` +
        `🧠 Model: Gemini 2.0 Flash Exp\n` +
        `⚡ 負載均衡: 啟用\n` +
        `🌐 Doppler: ${process.env.DOPPLER_PROJECT || '未配置'}`,
        { parse_mode: 'Markdown' }
      );
      return;
    }
    
    return;
  }
  
  // 處理普通消息
  if (!text) return;
  
  // 發送 "思考中" 提示
  const thinkingMsg = await bot.sendMessage(chatId, '🤔 諸葛亮正在分析局勢...');
  
  try {
    // 調用 Gemini（雙 Key 負載均衡）
    const response = await callGemini(text);
    
    // 刪除 "思考中" 消息
    await bot.deleteMessage(chatId, thinkingMsg.message_id);
    
    // 發送回覆
    const footer = `\n\n---\n🧠 ${response.model} · ${response.tokens} tokens`;
    await bot.sendMessage(chatId, response.text + footer, { parse_mode: 'Markdown' });
    
  } catch (error) {
    console.error('處理消息錯誤:', error);
    await bot.deleteMessage(chatId, thinkingMsg.message_id);
    await bot.sendMessage(chatId, '❌ 處理失敗，請重試。');
  }
});

// ============================================
// Webhook 端點（Cloud Run）
// ============================================

app.post(`/webhook/${BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// 健康檢查
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    bot: 'Onion-Mcp',
    persona: '諸葛亮',
    keys: GEMINI_KEYS.length,
    doppler: process.env.DOPPLER_PROJECT || 'not configured',
    uptime: process.uptime()
  });
});

// ============================================
// 啟動服務器
// ============================================

app.listen(PORT, () => {
  console.log('🤖 諸葛亮 Bot V2 已啟動');
  console.log(`📡 Port: ${PORT}`);
  console.log(`🔑 Gemini Keys: ${GEMINI_KEYS.length}`);
  console.log(`⚡ 負載均衡: 啟用`);
  console.log(`🧠 Model: Gemini 2.0 Flash Exp`);
  console.log(`🌐 Doppler: ${process.env.DOPPLER_PROJECT || '未配置'}`);
});

// 設置 Webhook（部署後執行）
if (process.env.WEBHOOK_URL) {
  const webhookUrl = `${process.env.WEBHOOK_URL}/webhook/${BOT_TOKEN}`;
  bot.setWebHook(webhookUrl).then(() => {
    console.log(`✅ Webhook 已設置: ${webhookUrl}`);
  }).catch(err => {
    console.error('❌ Webhook 設置失敗:', err);
  });
}
