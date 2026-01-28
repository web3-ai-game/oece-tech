/**
 * Telegram Bot with Claude API Integration
 * 輕量級設計，適合 2GB RAM VPS
 */

require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api')
const Anthropic = require('@anthropic-ai/sdk')

// 環境變量配置
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY

if (!TELEGRAM_TOKEN || !CLAUDE_API_KEY) {
  console.error('❌ 請設置環境變量：TELEGRAM_BOT_TOKEN 和 CLAUDE_API_KEY')
  process.exit(1)
}

// 初始化 Bot
const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true })
const anthropic = new Anthropic({ apiKey: CLAUDE_API_KEY })

// 用戶對話歷史（內存中，重啟後清空）
const userSessions = new Map()

// 限制每個用戶的歷史記錄長度，避免內存溢出
const MAX_HISTORY_LENGTH = 10

console.log('🤖 Telegram Bot 啟動成功！')

// 獲取或創建用戶會話
function getUserSession(userId) {
  if (!userSessions.has(userId)) {
    userSessions.set(userId, [])
  }
  return userSessions.get(userId)
}

// 添加消息到歷史
function addToHistory(userId, role, content) {
  const history = getUserSession(userId)
  history.push({ role, content })

  // 保持歷史記錄在合理範圍內
  if (history.length > MAX_HISTORY_LENGTH * 2) {
    history.splice(0, 2) // 移除最早的一對對話
  }
}

// 清空用戶歷史
function clearHistory(userId) {
  userSessions.set(userId, [])
}

// /start 命令
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id
  const welcomeMessage = `
👋 歡迎使用 OECE.TECH AI 助手！

我是一個由 Claude AI 驅動的 Telegram Bot，可以幫助你：

• 回答技術問題
• 解決編程難題
• 討論旅行和數字遊民生活
• 提供建議和想法

📝 命令列表：
/start - 顯示此歡迎消息
/clear - 清空對話歷史
/help - 獲取幫助

💬 直接發送消息開始對話！
`
  bot.sendMessage(chatId, welcomeMessage)
})

// /help 命令
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id
  const helpMessage = `
📖 幫助信息

🔹 如何使用：
直接發送消息給我，我會用 Claude AI 回覆你。

🔹 可用命令：
/start - 開始使用
/clear - 清空對話歷史（開始新對話）
/help - 顯示此幫助信息

🔹 提示：
• 我會記住對話上下文（最近 ${MAX_HISTORY_LENGTH} 輪對話）
• 使用 /clear 可以開始全新的對話
• 我支持中英文對話

💡 訪問我們的網站：https://oece.tech
`
  bot.sendMessage(chatId, helpMessage)
})

// /clear 命令
bot.onText(/\/clear/, (msg) => {
  const chatId = msg.chat.id
  const userId = msg.from.id

  clearHistory(userId)
  bot.sendMessage(chatId, '✅ 對話歷史已清空，我們可以開始全新的對話了！')
})

// 處理普通消息
bot.on('message', async (msg) => {
  // 忽略命令
  if (msg.text && msg.text.startsWith('/')) {
    return
  }

  const chatId = msg.chat.id
  const userId = msg.from.id
  const userMessage = msg.text

  if (!userMessage) {
    return
  }

  console.log(`📩 收到消息 [${userId}]: ${userMessage}`)

  // 發送"正在輸入"狀態
  bot.sendChatAction(chatId, 'typing')

  try {
    // 獲取用戶歷史
    const history = getUserSession(userId)

    // 添加用戶消息到歷史
    addToHistory(userId, 'user', userMessage)

    // 調用 Claude API
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      system: `你是 OECE.TECH 的 AI 助手。OECE.TECH 是一個關於數字遊民開發者的博客，
作者是一位從大廠轉型的開發者，現在在世界各地旅行的同時進行開發工作。
你應該友好、專業，能夠回答技術問題、提供編程建議，也可以聊旅行和數字遊民生活。
回覆時請簡潔明了，適合 Telegram 對話場景。支持中英文對話。`,
      messages: history,
    })

    // 提取回覆內容
    const assistantMessage = response.content[0].text

    // 添加助手回覆到歷史
    addToHistory(userId, 'assistant', assistantMessage)

    // 發送回覆
    await bot.sendMessage(chatId, assistantMessage, {
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    })

    console.log(`✅ 已回覆 [${userId}]`)

  } catch (error) {
    console.error('❌ 錯誤:', error.message)

    let errorMessage = '抱歉，處理你的消息時出現了錯誤。'

    if (error.status === 429) {
      errorMessage = '⏰ API 請求過於頻繁，請稍後再試。'
    } else if (error.status === 401) {
      errorMessage = '🔑 API 密鑰無效，請聯繫管理員。'
    }

    bot.sendMessage(chatId, errorMessage)
  }
})

// 錯誤處理
bot.on('polling_error', (error) => {
  console.error('❌ Polling 錯誤:', error.message)
})

// 優雅退出
process.on('SIGINT', () => {
  console.log('\n👋 Bot 正在關閉...')
  bot.stopPolling()
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n👋 Bot 正在關閉...')
  bot.stopPolling()
  process.exit(0)
})
