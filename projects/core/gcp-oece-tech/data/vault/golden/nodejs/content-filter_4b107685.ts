// 内容过滤模块

const SENSITIVE_WORDS = [
  'vpn',
  'proxy',
  '翻墙',
  '梯子',
  '科学上网',
  'gfw',
  'shadowsocks',
  'v2ray'
]

/**
 * 检查内容是否包含敏感词
 */
export function containsSensitiveWords(content: string): boolean {
  const lowerContent = content.toLowerCase()
  return SENSITIVE_WORDS.some(word => lowerContent.includes(word.toLowerCase()))
}

/**
 * 过滤敏感词，替换为游戏化术语
 */
export function filterSensitiveWords(content: string): string {
  let filtered = content
  
  const replacements: Record<string, string> = {
    'vpn': '传送门',
    'proxy': '中继站',
    '翻墙': '探索',
    '梯子': '装备',
    '科学上网': '全球地图解锁',
    'gfw': '防护墙',
    'shadowsocks': '暗影协议',
    'v2ray': '星际协议'
  }
  
  Object.entries(replacements).forEach(([word, replacement]) => {
    const regex = new RegExp(word, 'gi')
    filtered = filtered.replace(regex, replacement)
  })
  
  return filtered
}

/**
 * 验证内容是否安全
 */
export function isContentSafe(content: string): { safe: boolean; reason?: string } {
  // 检查长度
  if (content.length > 10000) {
    return { safe: false, reason: '内容过长' }
  }
  
  // 检查是否包含恶意脚本
  if (/<script|<iframe|javascript:/gi.test(content)) {
    return { safe: false, reason: '包含不安全内容' }
  }
  
  // 检查敏感词（但不阻止，只是标记）
  if (containsSensitiveWords(content)) {
    // 自动替换敏感词，不阻止发布
    return { safe: true }
  }
  
  return { safe: true }
}

export default {
  containsSensitiveWords,
  filterSensitiveWords,
  isContentSafe
}
