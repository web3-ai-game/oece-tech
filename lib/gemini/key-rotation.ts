// 🔄 Gemini API Key 轮换系统

import { getGeminiKeys } from './config';

class KeyRotation {
  private keys: string[];
  private currentIndex: number = 0;

  constructor() {
    this.keys = getGeminiKeys();

    if (this.keys.length === 0) {
      console.warn('⚠️ No Gemini API keys found!');
    }
  }

  /**
   * 获取下一个可用的 API Key（轮询）
   */
  getNextKey(): string {
    if (this.keys.length === 0) {
      throw new Error('No Gemini API keys available');
    }

    const key = this.keys[this.currentIndex];
    this.currentIndex = (this.currentIndex + 1) % this.keys.length;

    return key;
  }

  /**
   * 获取随机 API Key
   */
  getRandomKey(): string {
    if (this.keys.length === 0) {
      throw new Error('No Gemini API keys available');
    }

    const randomIndex = Math.floor(Math.random() * this.keys.length);
    return this.keys[randomIndex];
  }

  /**
   * 获取 Key 池状态
   */
  getStatus() {
    return {
      totalKeys: this.keys.length,
      currentIndex: this.currentIndex,
      availableKeys: this.keys.length > 0
    };
  }
}

// 单例模式
const keyRotation = new KeyRotation();

export default keyRotation;
