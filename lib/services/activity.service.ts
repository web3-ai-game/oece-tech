// 📊 用户活动日志服务

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ActivityType } from '@/lib/types/user';

/**
 * 记录用户活动
 */
export async function logActivity(
  userId: string,
  type: ActivityType | string,
  action: string,
  details?: Record<string, any>
): Promise<void> {
  if (!db) return;

  try {
    await addDoc(collection(db, 'activities'), {
      userId,
      type,
      action,
      details: details || {},
      ip: await getClientIP(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      timestamp: serverTimestamp()
    });
  } catch (error) {
    // 静默失败 - 日志不应该阻塞主流程
    console.error('Failed to log activity:', error);
  }
}

/**
 * 获取客户端 IP（简化版）
 */
async function getClientIP(): Promise<string | undefined> {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return undefined;
  }
}
