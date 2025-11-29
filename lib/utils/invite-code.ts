// 🎫 邀请码生成工具

/**
 * 生成唯一的邀请码
 * 格式: OECE-XXXX-XXXX
 */
export async function generateInviteCode(): Promise<string> {
  const part1 = generateRandomString(4, true);
  const part2 = generateRandomString(4, true);

  return `OECE-${part1}-${part2}`;
}

/**
 * 生成随机字符串
 */
function generateRandomString(length: number, uppercase: boolean = false): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';

  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return uppercase ? result.toUpperCase() : result;
}

/**
 * 验证邀请码格式
 */
export function isValidInviteCodeFormat(code: string): boolean {
  // 格式: XXXX-XXXX-XXXX 或 OECE-XXXX-XXXX
  const regex = /^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
  return regex.test(code);
}
