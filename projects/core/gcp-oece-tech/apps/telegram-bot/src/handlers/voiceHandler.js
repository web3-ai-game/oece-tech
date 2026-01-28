import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import axios from 'axios';
import config from '../../config/index.js';
import logger from '../utils/logger.js';

const genAI = new GoogleGenerativeAI(config.apiKeys.gemini);
const openaiKey = process.env.OPENAI_API_KEY;
const openai = openaiKey ? new OpenAI({ apiKey: openaiKey }) : null;

export async function handleVoiceMessage(bot, msg) {
  try {
    const chatId = msg.chat.id;
    const fileId = msg.voice.file_id;

    // 1) 下載語音檔案連結
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${config.telegram.botToken}/${file.file_path}`;

    // 2) 送 Gemini 2.5 Flash 做音訊理解 + 回覆
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const prompt = 'Transcribe this audio exactly. If it is a question, answer it immediately in warm, caring tone.';
    const result = await model.generateContent([
      { text: prompt },
      { inlineData: { mimeType: 'audio/ogg', data: (await axios.get(fileUrl, { responseType: 'arraybuffer' })).data } },
    ]);
    const textResponse = result.response.text();

    // 3) 回覆文字
    await bot.sendMessage(chatId, textResponse);

    // 4) 若可用，再做 TTS 語音回覆
    if (openai) {
      const speech = await openai.audio.speech.create({
        model: 'tts-1',
        voice: 'sage',
        input: textResponse,
      });
      const audioBuffer = Buffer.from(await speech.arrayBuffer());
      await bot.sendVoice(chatId, audioBuffer);
    }
  } catch (err) {
    logger.error('Voice handler error:', err);
  }
}
