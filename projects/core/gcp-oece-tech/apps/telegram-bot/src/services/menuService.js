/**
 * 互動菜單服務 - Telegram Inline Keyboard
 * 
 * 為母親設計的友好界面，無需輸入 /指令
 */

// 功能状态标记
// ✅ = 已完成  🔨 = 开发中  📋 = 计划中

// BongBong 主菜單 (聊天/筆記/養生/新聞/創作)
export const MAIN_MENU = {
  text: `🎭 **BongBong 主菜单**

我是你的靠谱助手，选择功能：`,
  
  keyboard: [
    [
      { text: '💬 聊天', callback_data: 'menu_chat' },
      { text: '📝 笔记', callback_data: 'menu_notes' }
    ],
    [
      { text: '🌿 养生', callback_data: 'menu_health' },
      { text: '📰 新闻', callback_data: 'menu_news' }
    ],
    [
      { text: '🎨 创作', callback_data: 'menu_creative' },
      { text: '⚙️ 设置', callback_data: 'menu_settings' }
    ]
  ]
};

// Admin Bot 主菜單 (簽證/腦力/遊戲/生成)
export const ADMIN_MENU = {
  text: `🤖 **Admin Bot 菜单**

我负责签证、游戏和生成任务：`,
  
  keyboard: [
    [
      { text: '🛂 签证', callback_data: 'admin_visa' },
      { text: '🧠 脑力', callback_data: 'admin_brain' }
    ],
    [
      { text: '🎮 游戏', callback_data: 'admin_games' },
      { text: '🔮 真实之眼', callback_data: 'admin_eye' }
    ],
    [
      { text: '🖼️ 图片', callback_data: 'admin_image' },
      { text: '🎬 视频', callback_data: 'admin_video' }
    ]
  ]
};

// 新聞菜單
export const NEWS_MENU = {
  text: `📰 **新闻中心**

Gemini + Grok 双引擎新闻对比：`,
  
  keyboard: [
    [
      { text: '📰 今日新闻', callback_data: 'news_today' },
      { text: '🗣️ 舆论风向', callback_data: 'news_opinion' }
    ],
    [
      { text: '⚖️ 新闻+舆论对比', callback_data: 'news_compare' }
    ],
    [
      { text: '🔄 刷新', callback_data: 'news_refresh' },
      { text: '◀️ 返回', callback_data: 'menu_main' }
    ]
  ]
};

export const CHAT_MENU = {
  text: `💬 *聊天模式*

選擇對話風格：`,
  
  keyboard: [
    [
      { text: '🚀 快速問答', callback_data: 'chat_fast' },
      { text: '🧠 深度分析', callback_data: 'chat_deep' }
    ],
    [
      { text: '😎 幽默模式', callback_data: 'chat_humor' },
      { text: '💝 情感支持', callback_data: 'chat_emotional' }
    ],
    [
      { text: '🔮 玄學算命', callback_data: 'chat_fortune' },
      { text: '📚 知識問答', callback_data: 'chat_knowledge' }
    ],
    [
      { text: '🔥 全火力模式', callback_data: 'chat_fullpower' }
    ],
    [
      { text: '◀️ 返回主菜單', callback_data: 'menu_main' }
    ]
  ]
};

// 全火力模式說明
export const FULLPOWER_MODE = {
  text: `🔥 *全火力模式啟動*

這是一個特殊模式，用於複雜問題的深度分析：

**觸發條件：**
- 問題真的很複雜
- 需要多角度分析
- 現實生活中的實際問題

**模型配置：**
- Gemini 2.5 Pro (嚴謹分析)
- Grok 3 Mini (擴散思考)
- 語意分析決定 token 用量

**注意：**
- 會消耗較多 token
- 適合重要問題
- 不適合閒聊

發送你的問題，我會全力分析！`,
  
  keyboard: [
    [
      { text: '◀️ 返回聊天菜單', callback_data: 'menu_chat' }
    ]
  ]
};

export const NOTES_MENU = {
  text: `📝 **笔记本**

选择笔记本：`,
  
  keyboard: [
    [
      { text: '👩‍🦳 妈妈的笔记', callback_data: 'notes_mother' },
      { text: '👨‍💻 我的笔记', callback_data: 'notes_mine' }
    ],
    [
      { text: '➕ 新建', callback_data: 'notes_new' },
      { text: '📋 全部', callback_data: 'notes_list' },
      { text: '🔍 搜索', callback_data: 'notes_search' }
    ],
    [
      { text: '◀️ 返回', callback_data: 'menu_main' }
    ]
  ]
};

// 🛂 签证咨询菜单（母亲专用）
export const VISA_MENU = {
  text: `🛂 **签证咨询**

泰国签证政策专家，为您解答：`,
  
  keyboard: [
    [
      { text: '🆓 免签政策', callback_data: 'visa_free' },
      { text: '📋 落地签', callback_data: 'visa_arrival' }
    ],
    [
      { text: '👴 养老签证', callback_data: 'visa_retirement' },
      { text: '💎 精英签证', callback_data: 'visa_elite' }
    ],
    [
      { text: '📅 最新政策', callback_data: 'visa_latest' },
      { text: '❓ 自由提问', callback_data: 'visa_ask' }
    ],
    [
      { text: '◀️ 返回主菜单', callback_data: 'menu_main' }
    ]
  ]
};

export const CREATIVE_MENU = {
  text: `🎨 *創作工具*

釋放你的創意：`,
  
  keyboard: [
    [
      { text: '✍️ 寫作助手', callback_data: 'creative_writing' },
      { text: '📖 故事續寫', callback_data: 'creative_story' }
    ],
    [
      { text: '🖼️ 生成圖片', callback_data: 'creative_image' },
      { text: '🎬 生成視頻', callback_data: 'creative_video' }
    ],
    [
      { text: '💡 靈感激發', callback_data: 'creative_inspire' },
      { text: '📝 擴寫潤色', callback_data: 'creative_expand' }
    ],
    [
      { text: '◀️ 返回主菜單', callback_data: 'menu_main' }
    ]
  ]
};

export const IMAGE_MENU = {
  text: `🖼️ *圖片生成*

選擇圖片風格：`,
  
  keyboard: [
    [
      { text: '📷 寫實風格 (Gemini)', callback_data: 'image_realistic' },
      { text: '😂 搞笑模因 (Grok)', callback_data: 'image_meme' }
    ],
    [
      { text: '🎨 藝術風格', callback_data: 'image_art' },
      { text: '🌸 中國風', callback_data: 'image_chinese' }
    ],
    [
      { text: '◀️ 返回創作工具', callback_data: 'menu_creative' }
    ]
  ]
};

export const VIDEO_MENU = {
  text: `🎬 *視頻生成*

⚠️ 每日限制: 5次 (每次8秒)
📊 今日剩餘: {remaining}/5

選擇視頻類型：`,
  
  keyboard: [
    [
      { text: '🎥 生成視頻', callback_data: 'video_generate' }
    ],
    [
      { text: '📊 查看配額', callback_data: 'video_quota' },
      { text: '◀️ 返回', callback_data: 'menu_creative' }
    ]
  ]
};

export const BRAIN_MENU = {
  text: `🧠 *腦力訓練*

保持大腦活力：`,
  
  keyboard: [
    [
      { text: '🧩 腦筋急轉彎', callback_data: 'brain_teaser' },
      { text: '🖼️ 看圖說話', callback_data: 'brain_picture' }
    ],
    [
      { text: '📝 記憶測試', callback_data: 'brain_memory' },
      { text: '🔢 數學題', callback_data: 'brain_math' }
    ],
    [
      { text: '✅ 今日任務', callback_data: 'brain_daily' },
      { text: '🏆 成就', callback_data: 'brain_achievements' }
    ],
    [
      { text: '◀️ 返回主菜單', callback_data: 'menu_main' }
    ]
  ]
};

export const HEALTH_MENU = {
  text: `🌿 *養生專區*

中西醫結合的健康建議：`,
  
  keyboard: [
    [
      { text: '🏥 症狀查詢', callback_data: 'health_symptom' },
      { text: '💊 藥物諮詢', callback_data: 'health_medicine' }
    ],
    [
      { text: '🍵 食療養生', callback_data: 'health_food' },
      { text: '🧘 穴位按摩', callback_data: 'health_acupoint' }
    ],
    [
      { text: '📅 養生日曆', callback_data: 'health_calendar' },
      { text: '💡 今日小貼士', callback_data: 'health_tip' }
    ],
    [
      { text: '◀️ 返回主菜單', callback_data: 'menu_main' }
    ]
  ]
};

export const GAMES_MENU = {
  text: `🎮 *休閒遊戲*

放鬆一下：`,
  
  keyboard: [
    [
      { text: '🔢 數獨', callback_data: 'game_sudoku' },
      { text: '⚫ 五子棋', callback_data: 'game_gomoku' }
    ],
    [
      { text: '🎯 猜謎語', callback_data: 'game_riddle' },
      { text: '📝 成語接龍', callback_data: 'game_idiom' }
    ],
    [
      { text: '◀️ 返回主菜單', callback_data: 'menu_main' }
    ]
  ]
};

export const SETTINGS_MENU = {
  text: `⚙️ *設置*

個性化你的 BongBong：`,
  
  keyboard: [
    [
      { text: '🎭 人格風格', callback_data: 'settings_persona' },
      { text: '🔔 提醒設置', callback_data: 'settings_reminder' }
    ],
    [
      { text: '🤖 模型偏好', callback_data: 'settings_model' },
      { text: '💾 記憶管理', callback_data: 'settings_memory' }
    ],
    [
      { text: '◀️ 返回主菜單', callback_data: 'menu_main' }
    ]
  ]
};

export const MEMORY_MENU = {
  text: `💾 *記憶管理*

管理 BongBong 的記憶：`,
  
  keyboard: [
    [
      { text: '📥 創建存檔點', callback_data: 'memory_checkpoint' },
      { text: '📋 查看記憶', callback_data: 'memory_list' }
    ],
    [
      { text: '🔍 搜索記憶', callback_data: 'memory_search' },
      { text: '🗑️ 清除記憶', callback_data: 'memory_clear' }
    ],
    [
      { text: '◀️ 返回設置', callback_data: 'menu_settings' }
    ]
  ]
};

// 快捷回覆按鈕 (附加在每條消息後)
export const QUICK_ACTIONS = {
  keyboard: [
    [
      { text: '💾 保存', callback_data: 'quick_save' },
      { text: '📋 複製', callback_data: 'quick_copy' },
      { text: '🔄 重新生成', callback_data: 'quick_regenerate' }
    ]
  ]
};

// 確認對話框
export const CONFIRM_DIALOG = (action) => ({
  text: `⚠️ 確認${action}？`,
  keyboard: [
    [
      { text: '✅ 確認', callback_data: `confirm_${action}` },
      { text: '❌ 取消', callback_data: 'confirm_cancel' }
    ]
  ]
});

/**
 * 菜單服務類
 */
class MenuService {
  constructor() {
    this.menus = {
      // BongBong 菜單
      main: MAIN_MENU,
      chat: CHAT_MENU,
      notes: NOTES_MENU,
      news: NEWS_MENU,
      creative: CREATIVE_MENU,
      health: HEALTH_MENU,
      settings: SETTINGS_MENU,
      memory: MEMORY_MENU,
      // Admin Bot 菜單
      admin: ADMIN_MENU,
      visa: VISA_MENU,
      brain: BRAIN_MENU,
      games: GAMES_MENU,
      image: IMAGE_MENU,
      video: VIDEO_MENU
    };
  }

  /**
   * 獲取菜單
   */
  getMenu(menuName) {
    return this.menus[menuName] || MAIN_MENU;
  }

  /**
   * 構建 Telegram Inline Keyboard
   */
  buildKeyboard(menu) {
    return {
      reply_markup: {
        inline_keyboard: menu.keyboard
      }
    };
  }

  /**
   * 發送菜單
   */
  async sendMenu(bot, chatId, menuName, customText = null) {
    const menu = this.getMenu(menuName);
    const text = customText || menu.text;
    
    return await bot.sendMessage(chatId, text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: menu.keyboard
      }
    });
  }

  /**
   * 更新菜單 (編輯現有消息)
   */
  async updateMenu(bot, chatId, messageId, menuName, customText = null) {
    const menu = this.getMenu(menuName);
    const text = customText || menu.text;
    
    try {
      return await bot.editMessageText(text, {
        chat_id: chatId,
        message_id: messageId,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: menu.keyboard
        }
      });
    } catch (error) {
      // 忽略 "message is not modified" 錯誤
      if (error.message?.includes('message is not modified')) {
        return null;
      }
      // 如果消息不存在，發送新菜單
      if (error.message?.includes('message to edit not found')) {
        return await this.sendMenu(bot, chatId, menuName, customText);
      }
      throw error;
    }
  }

  /**
   * 添加快捷操作按鈕
   */
  getQuickActions() {
    return {
      reply_markup: {
        inline_keyboard: QUICK_ACTIONS.keyboard
      }
    };
  }
}

export default new MenuService();
