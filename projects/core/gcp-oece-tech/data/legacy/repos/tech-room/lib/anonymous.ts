// 匿名功能模块

/**
 * 生成匿名用户名
 */
export function generateAnonymousName(): string {
  const adjectives = ['勇敢的', '神秘的', '聪明的', '快乐的', '安静的']
  const nouns = ['探险者', '旅行者', '学习者', '创造者', '思考者']
  const number = Math.floor(Math.random() * 9999)
  
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)]
  const noun = nouns[Math.floor(Math.random() * nouns.length)]
  
  return `${adj}${noun}${number}`
}

/**
 * 生成匿名ID
 */
export function generateAnonymousId(): string {
  return 'anon_' + Math.random().toString(36).substring(2, 15)
}

/**
 * 验证是否为匿名用户
 */
export function isAnonymousUser(userId: string): boolean {
  return userId.startsWith('anon_')
}
