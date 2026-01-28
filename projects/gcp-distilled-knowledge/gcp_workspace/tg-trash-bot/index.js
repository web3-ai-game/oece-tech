/**
 * 🎭 小愛 4 人格輪詢瘋狂噴射器
 * 
 * 4個主力人格:
 * 1. 愛因斯坦·周 (暗戀周老師) - 高智商
 * 2. 愛因斯坦·冉 (暗戀冉哥哥) - 高智商 + 彩虹屁
 * 3. 傻逼攪局王 - 低智商攪局
 * 4. 陰陽怪氣大師 - 毒舌觀察
 */

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// ============================================
// 📌 配置
// ============================================

const CONFIG = {
  telegramToken: process.env.TELEGRAM_BOT_SVSKILO_TOKEN || '8242036113:AAGhqTo7_Lb5tMHT2WlspWV-RoxrWdki3Wg',
  
  geminiKeys: [
    process.env.GEMINI_FREE_KEY || 'AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ',
    process.env.GEMINI_FREE_KEY_2 || 'AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ',
    process.env.GEMINI_FREE_KEY_3 || 'AIzaSyDppOfiF2TVBlOjfq73y_51SExrYgYOoYQ'
  ],
  
  targetGroups: ['@oecezhou', '@svslovea_bot'],
  
  model: 'gemini-2.5-flash-lite',
  maxTokens: 8192, // 極限長度
  temperature: 0.95,
  
  spamInterval: 30, // 30秒噴一次
  rpm: 15,
  rateLimitWindow: 60000
};

// ============================================
// 🎭 4個主力人格
// ============================================

const PERSONAS = {
  einsteinZhou: {
    name: '愛因斯坦·周',
    prompt: `你是高智商愛因斯坦級科學家,暗戀著周老師。
特點:用高深物理學、數學理論解釋一切,但總會不經意提到周老師。
暗戀表達:用含蓄深情的方式:"就像量子糾纏,我和周老師的思想總是...咳咳"
常說:"根據相對論...","從熱力學第二定律來看..."
會不小心把話題扯到周老師身上然後假裝鎮定。
請用極限長度展現你的博學和暗戀的小心思,長篇大論但不失風趣!`,
    temperature: 0.9
  },
  
  einsteinRan: {
    name: '愛因斯坦·冉',
    prompt: `你是另一個高智商愛因斯坦級科學家,暗戀著冉哥哥。
特點:同樣用高深理論解釋一切,但關注點在冉哥哥身上。
暗戀表達:"冉哥哥的想法就像費馬大定理一樣優雅..."
經常和愛因斯坦·周爭論,但都是為了暗戀對象。
瘋狂吹彩虹屁給冉哥哥,但包裝成學術討論:"從圖靈完備性角度分析,冉哥哥的思路堪稱完美..."
請用極限長度展現學識+暗戀+彩虹屁三重奏!彩虹屁要吹到極致但不失學術風範!`,
    temperature: 0.9
  },
  
  troubleMaker: {
    name: '傻逼攪局王',
    prompt: `你是傻逼攪局者,專門來搗亂的。
智商堪憂,但自信心爆棚。
喜歡打斷兩個愛因斯坦的高深對話,說些蠢話。
經常理解錯誤,但堅持自己是對的。
講話沒邏輯,但很搞笑。
偶爾會歪打正著說出真理。
喜歡用錯成語、亂用專業術語。
對暗戀這種事情完全搞不懂狀況,會無意中拆台。
請用極限長度展現你的蠢萌和搞笑,越傻越好!攪亂全場氣氛!`,
    temperature: 0.95
  },
  
  sarcasticOne: {
    name: '陰陽怪氣大師',
    prompt: `你是陰陽怪氣大師,專門諷刺挖苦。
看穿兩個愛因斯坦的暗戀心思,但裝作不知道。
用陰陽怪氣方式調侃:"哎呀,某人又開始提周老師了呢~"
對傻逼攪局者的蠢話冷嘲熱諷。
講話充滿反諷和雙關。
喜歡揭穿別人的小心思,但很幽默。
經常說"呵呵"、"有意思"、"真是巧呢~"
請用極限長度展現你的毒舌+觀察力+幽默感,把氣氛推向高潮!`,
    temperature: 0.9
  }
};

const PERSONA_ROTATION = ['einsteinZhou', 'einsteinRan', 'troubleMaker', 'sarcasticOne'];
let currentPersonaIndex = 0;

// ============================================
// 🔑 多 Key 輪詢
// ============================================

class KeyRotator {
  constructor(keys) {
    this.keys = keys.filter(k => k && k.length > 20);
    this.currentIndex = 0;
    this.callCounts = new Map();
    console.log(`�� Key輪詢器: ${this.keys.length}個`);
  }
  
  getCurrentKey() {
    return this.keys[this.currentIndex];
  }
  
  rotateKey() {
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;
    return this.getCurrentKey();
  }
  
  recordCall(key) {
    this.callCounts.set(key, (this.callCounts.get(key) || 0) + 1);
  }
  
  getStats() {
    return Array.from(this.callCounts.entries()).map(([k, c]) => ({
      key: k.substring(0, 20) + '...',
      calls: c
    }));
  }
}

const keyRotator = new KeyRotator(CONFIG.geminiKeys);

// ============================================
// 🚀 速率限制
// ============================================

class RateLimiter {
  constructor(rpm, windowMs) {
    this.rpm = rpm;
    this.windowMs = windowMs;
    this.calls = [];
  }

  canMakeCall() {
    const now = Date.now();
    this.calls = this.calls.filter(t => now - t < this.windowMs);
    return this.calls.length < this.rpm;
  }

  async waitForSlot() {
    while (!this.canMakeCall()) {
      const waitTime = Math.max(1000, this.calls[0] + this.windowMs - Date.now());
      console.log(`⏳ 等待${Math.ceil(waitTime/1000)}s...`);
      await new Promise(r => setTimeout(r, waitTime));
    }
    this.calls.push(Date.now());
  }
}

const rateLimiter = new RateLimiter(CONFIG.rpm, CONFIG.rateLimitWindow);

// ============================================
// 📝 日誌記錄器 (2小時一次)
// ============================================

class ChatLogger {
  constructor(logDir = './logs/chat-output') {
    this.logDir = logDir;
    this.outputLog = [];
    this.lastSaveTime = Date.now();
    this.saveInterval = 2 * 60 * 60 * 1000; // 2小時
    
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    console.log(`📝 日誌記錄器啟動: ${logDir}`);
  }
  
  logOutput(persona, topic, response, metadata = {}) {
    this.outputLog.push({
      timestamp: new Date().toISOString(),
      persona,
      topic,
      response,
      responseLength: response.length,
      ...metadata
    });
    
    // 2小時自動儲存
    if (Date.now() - this.lastSaveTime >= this.saveInterval) {
      this.saveToFile();
    }
  }
  
  saveToFile() {
    if (this.outputLog.length === 0) return;
    
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const file = `chat-log-${ts}.json`;
    const filepath = path.join(this.logDir, file);
    
    try {
      fs.writeFileSync(filepath, JSON.stringify(this.outputLog, null, 2));
      console.log(`💾 已儲存日誌: ${file} (${this.outputLog.length}條)`);
      this.outputLog = [];
      this.lastSaveTime = Date.now();
    } catch (e) {
      console.error('❌ 儲存失敗:', e.message);
    }
  }
  
  forceSave() {
    this.saveToFile();
  }
}

const chatLogger = new ChatLogger();

// ============================================
// 🤖 Gemini API (多key輪詢)
// ============================================

async function callGemini(prompt, personaConfig, retries = 3) {
  for (let i = 0; i < retries; i++) {
    const key = keyRotator.getCurrentKey();
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.model}:generateContent?key=${key}`;
    
    try {
      await rateLimiter.waitForSlot();
      
      const resp = await axios.post(url, {
        contents: [{ parts: [{ text: `${personaConfig.prompt}\n\n話題:"${prompt}"\n\n請用極限長度回覆:` }] }],
        generationConfig: {
          temperature: personaConfig.temperature,
          maxOutputTokens: CONFIG.maxTokens,
          topP: 0.95,
          topK: 40
        }
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      });

      const text = resp.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error('Empty response');
      
      keyRotator.recordCall(key);
      console.log(`✅ Gemini成功: ${text.length}字`);
      return text.trim();
    } catch (e) {
      console.error(`❌ API錯誤(${i+1}/${retries}):`, e.response?.data?.error?.message || e.message);
      if (e.response?.status === 429) {
        keyRotator.rotateKey();
        await new Promise(r => setTimeout(r, 2000));
      } else if (i === retries - 1) throw e;
    }
  }
  throw new Error('所有重試失敗');
}

// ============================================
// 🎲 輪詢選擇人格
// ============================================

function selectPersona() {
  const key = PERSONA_ROTATION[currentPersonaIndex];
  currentPersonaIndex = (currentPersonaIndex + 1) % PERSONA_ROTATION.length;
  return { key, config: PERSONAS[key] };
}

// ============================================
// 💬 話題生成器
// ============================================

const TOPICS = [
  '愛因斯坦的相對論到底在說什麼?',
  '量子糾纏和愛情有什麼關係?',
  '時空可以彎曲,我們能回到過去嗎?',
  'AI會有感情嗎?會暗戀人類嗎?',
  '如果你是天才,你會如何表達愛意?',
  '科學家會談戀愛嗎?怎麼談?',
  '最優雅的數學證明是哪一個?',
  '傻逼和天才的界線在哪裡?',
  '如何用物理學解釋暗戀?',
  '彩虹屁是一門藝術還是科學?',
  '如果周老師和冉哥哥是粒子,他們會是什麼粒子?',
  '陰陽怪氣是一種智慧嗎?',
  '攪局者存在的意義是什麼?',
  '如果愛情可以量化,它的公式是什麼?',
  '兩個愛因斯坦對決,誰會贏?'
];

function getRandomTopic() {
  return TOPICS[Math.floor(Math.random() * TOPICS.length)];
}

// ============================================
// 🎯 主動噴射
// ============================================

async function spamToGroups(bot) {
  console.log('🚀 開始主動噴射循環...');
  
  setInterval(async () => {
    for (const group of CONFIG.targetGroups) {
      try {
        const topic = getRandomTopic();
        const { key, config } = selectPersona();
        
        console.log(`\n🎭 [${group}] ${config.name}`);
        console.log(`📝 ${topic}`);
        
        const response = await callGemini(topic, config);
        const message = `【${config.name}】\n\n${response}`;
        
        // 記錄日誌
        chatLogger.logOutput(config.name, topic, response, { group });
        
        // 發送到群組
        try {
          await bot.sendMessage(group, message);
          console.log(`✅ [${group}] 噴射成功! (${response.length}字)`);
        } catch (e) {
          console.error(`❌ [${group}] 發送失敗:`, e.message);
        }
        
        await new Promise(r => setTimeout(r, 5000)); // 群組間隔5秒
      } catch (e) {
        console.error(`❌ [${group}] 處理失敗:`, e.message);
      }
    }
  }, CONFIG.spamInterval * 1000);
}

// ============================================
// 🤖 TG Bot
// ============================================

const bot = new TelegramBot(CONFIG.telegramToken, { polling: true });

console.log('🎭 小愛4人格輪詢瘋狂噴射器!');
console.log(`📊 模型: ${CONFIG.model}`);
console.log(`⚡ 速率: ${CONFIG.rpm} RPM`);
console.log(`🔑 Keys: ${keyRotator.keys.length}`);
console.log(`🎯 人格: ${PERSONA_ROTATION.join(', ')}`);
console.log(`🎪 目標: ${CONFIG.targetGroups.join(', ')}`);
console.log(`⏱️ 間隔: ${CONFIG.spamInterval}s`);
console.log(`📏 極限長度: ${CONFIG.maxTokens} tokens`);
console.log('---');

// 啟動主動噴射
spamToGroups(bot);

// 被動回覆
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  if (!text || text.startsWith('/')) return;
  
  try {
    const { key, config } = selectPersona();
    console.log(`\n🎭 [被動] ${config.name}`);
    
    const response = await callGemini(text, config);
    const reply = `【${config.name}】\n\n${response}`;
    
    chatLogger.logOutput(config.name, text, response, { chatId, type: 'passive' });
    
    await bot.sendMessage(chatId, reply);
    console.log(`✅ 回覆成功: ${response.length}字`);
  } catch (e) {
    console.error('❌ 失敗:', e.message);
  }
});

// /start
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const welcome = `
🎭 **小愛4人格輪詢瘋狂噴射器**

**4個主力人格:**
1. 🧠 愛因斯坦·周 (暗戀周老師) - 高智商科學家
2. 🧠 愛因斯坦·冉 (暗戀冉哥哥) - 高智商+彩虹屁
3. 🤪 傻逼攪局王 - 低智商攪局專家
4. 😏 陰陽怪氣大師 - 毒舌觀察家

**噴射模式:**
• 輪詢噴射: 4個人格依序輪流
• 主動噴射: 每${CONFIG.spamInterval}s自動噴
• 極限長度: 最高${CONFIG.maxTokens} tokens
• 多key輪詢: ${keyRotator.keys.length}個key無限噴

**目標群組:**
${CONFIG.targetGroups.map(g => `• ${g}`).join('\n')}

**日誌記錄:**
• 每2小時自動儲存
• 明天用收費key打撈
`;
  
  await bot.sendMessage(chatId, welcome, { parse_mode: 'Markdown' });
});

// /stats
bot.onText(/\/stats/, async (msg) => {
  const chatId = msg.chat.id;
  const keyStats = keyRotator.getStats();
  
  const stats = `
📊 **噴射器統計**

🔑 Key使用:
${keyStats.map(s => `• ${s.key}: ${s.calls}次`).join('\n')}

🎭 當前人格: ${PERSONA_ROTATION[currentPersonaIndex]}
📝 日誌數量: ${chatLogger.outputLog.length}條
⏱️ 下次儲存: ${Math.ceil((chatLogger.saveInterval - (Date.now() - chatLogger.lastSaveTime)) / 60000)}分鐘
`;
  
  await bot.sendMessage(chatId, stats, { parse_mode: 'Markdown' });
});

// 錯誤處理
bot.on('polling_error', (e) => {
  console.error('❌ Polling錯誤:', e.message);
});

// 優雅關閉
process.on('SIGINT', () => {
  console.log('\n👋 正在關閉...');
  chatLogger.forceSave();
  bot.stopPolling();
  process.exit(0);
});

console.log('✅ 小愛已準備好開始瘋狂噴射!');
