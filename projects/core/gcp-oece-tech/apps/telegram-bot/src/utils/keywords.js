/**
 * 關鍵詞識別工具
 * 
 * 支持簡體繁體雙語識別
 * 母親用簡體，用戶用繁體
 */

// 簡繁對照表
const SIMPLIFIED_TRADITIONAL_MAP = {
  // 常用動詞
  '画': '畫',
  '报': '報',
  '说': '說',
  '写': '寫',
  '读': '讀',
  '听': '聽',
  '看': '看',
  '问': '問',
  '答': '答',
  '帮': '幫',
  '学': '學',
  '玩': '玩',
  '记': '記',
  '忘': '忘',
  
  // 功能相關
  '新闻': '新聞',
  '菜单': '菜單',
  '设置': '設置',
  '统计': '統計',
  '游戏': '遊戲',
  '数独': '數獨',
  '五子棋': '五子棋',
  '养生': '養生',
  '健康': '健康',
  '医疗': '醫療',
  '笔记': '筆記',
  '便签': '便簽',
  '记忆': '記憶',
  '历史': '歷史',
  '搜索': '搜索',
  '查找': '查找',
  
  // 特殊詞
  '脑筋急转弯': '腦筋急轉彎',
  '头脑': '頭腦',
  '训练': '訓練',
  '测试': '測試',
  '挑战': '挑戰',
  
  // 情緒
  '开心': '開心',
  '难过': '難過',
  '烦恼': '煩惱',
  '压力': '壓力',
  '焦虑': '焦慮',
  
  // 其他
  '图片': '圖片',
  '视频': '視頻',
  '语音': '語音',
  '文字': '文字'
};

// 反向映射
const TRADITIONAL_SIMPLIFIED_MAP = Object.fromEntries(
  Object.entries(SIMPLIFIED_TRADITIONAL_MAP).map(([k, v]) => [v, k])
);

/**
 * 關鍵詞定義 (同時包含簡繁體)
 */
export const KEYWORDS = {
  // 報新聞
  news: {
    triggers: ['報新聞', '报新闻', '新聞', '新闻', '今日新聞', '今日新闻', '每日播報', '每日播报'],
    action: 'news'
  },
  
  // 輿論摘要
  opinion: {
    triggers: ['輿論', '舆论', '熱點', '热点', '網絡熱議', '网络热议'],
    action: 'opinion'
  },
  
  // 畫畫
  draw: {
    triggers: ['畫畫', '画画', '畫圖', '画图', '生成圖片', '生成图片', '來張圖', '来张图', '畫一張', '画一张'],
    action: 'draw'
  },
  
  // 菜單
  menu: {
    triggers: ['菜單', '菜单', '功能', '選單', '选单', '主菜單', '主菜单'],
    action: 'menu'
  },
  
  // 養生
  health: {
    triggers: ['養生', '养生', '健康', '保健', '中醫', '中医', '穴位', '食療', '食疗'],
    action: 'health'
  },
  
  // 遊戲
  games: {
    triggers: ['遊戲', '游戏', '玩遊戲', '玩游戏', '數獨', '数独', '五子棋'],
    action: 'games'
  },
  
  // 數獨
  sudoku: {
    triggers: ['數獨', '数独', '玩數獨', '玩数独'],
    action: 'sudoku'
  },
  
  // 五子棋
  gomoku: {
    triggers: ['五子棋', '下棋', '對弈', '对弈'],
    action: 'gomoku'
  },
  
  // 腦筋急轉彎
  brainTeaser: {
    triggers: ['腦筋急轉彎', '脑筋急转弯', '猜謎', '猜谜', '謎語', '谜语'],
    action: 'brainTeaser'
  },
  
  // 便簽
  notes: {
    triggers: ['便簽', '便签', '筆記', '笔记', '記事', '记事', '備忘', '备忘'],
    action: 'notes'
  },
  
  // 記憶
  memory: {
    triggers: ['記憶', '记忆', '回憶', '回忆', '記住', '记住'],
    action: 'memory'
  },
  
  // 統計
  stats: {
    triggers: ['統計', '统计', '數據', '数据', '使用情況', '使用情况'],
    action: 'stats'
  },
  
  // 幫助
  help: {
    triggers: ['幫助', '帮助', '怎麼用', '怎么用', '使用說明', '使用说明', '教程'],
    action: 'help'
  },
  
  // 每日任務
  dailyTask: {
    triggers: ['每日任務', '每日任务', '今日任務', '今日任务', '打卡', '簽到', '签到'],
    action: 'dailyTask'
  },
  
  // 算命
  fortune: {
    triggers: ['算命', '運勢', '运势', '星座', '塔羅', '塔罗', '占卜'],
    action: 'fortune'
  }
};

/**
 * 標準化文本 (簡體轉繁體)
 */
export function normalizeText(text) {
  let normalized = text;
  for (const [simplified, traditional] of Object.entries(SIMPLIFIED_TRADITIONAL_MAP)) {
    normalized = normalized.replace(new RegExp(simplified, 'g'), traditional);
  }
  return normalized;
}

/**
 * 檢測關鍵詞
 */
export function detectKeyword(text) {
  const lowerText = text.toLowerCase().trim();
  
  for (const [name, config] of Object.entries(KEYWORDS)) {
    for (const trigger of config.triggers) {
      if (lowerText.includes(trigger.toLowerCase())) {
        return {
          keyword: name,
          action: config.action,
          trigger: trigger
        };
      }
    }
  }
  
  return null;
}

/**
 * 檢測是否為繪畫請求
 */
export function isDrawRequest(text) {
  const drawKeywords = KEYWORDS.draw.triggers;
  return drawKeywords.some(k => text.includes(k));
}

/**
 * 檢測是否為新聞請求
 */
export function isNewsRequest(text) {
  const newsKeywords = [...KEYWORDS.news.triggers, ...KEYWORDS.opinion.triggers];
  return newsKeywords.some(k => text.includes(k));
}

/**
 * 提取繪畫提示詞
 */
export function extractDrawPrompt(text) {
  // 移除觸發詞
  let prompt = text;
  for (const trigger of KEYWORDS.draw.triggers) {
    prompt = prompt.replace(trigger, '').trim();
  }
  
  // 如果沒有具體描述，返回隨機主題
  if (!prompt || prompt.length < 2) {
    const randomTopics = [
      '一隻可愛的貓咪在陽光下打盹',
      '山水畫風格的中國風景',
      '一朵盛開的蓮花',
      '溫馨的家庭聚餐場景',
      '夕陽下的海邊',
      '春天的櫻花樹',
      '一杯熱茶和一本書'
    ];
    return randomTopics[Math.floor(Math.random() * randomTopics.length)];
  }
  
  return prompt;
}

/**
 * 簡繁體轉換工具
 */
export const converter = {
  toTraditional: (text) => {
    let result = text;
    for (const [s, t] of Object.entries(SIMPLIFIED_TRADITIONAL_MAP)) {
      result = result.replace(new RegExp(s, 'g'), t);
    }
    return result;
  },
  
  toSimplified: (text) => {
    let result = text;
    for (const [t, s] of Object.entries(TRADITIONAL_SIMPLIFIED_MAP)) {
      result = result.replace(new RegExp(t, 'g'), s);
    }
    return result;
  }
};

export default {
  KEYWORDS,
  normalizeText,
  detectKeyword,
  isDrawRequest,
  isNewsRequest,
  extractDrawPrompt,
  converter
};
