'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDAtdrUqydn0m1v9-S84PIIBn9lXjcr1U4";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeImage(imageBase64: string, promptText: string) {
  try {
    // 使用 Gemini 1.5 Flash，它在多模態視覺處理上速度極快且準確
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.7, // Set to 0.7 for more creative/less rigid responses
        }
    });

    // 構建 Prompt：賽博看相師
    const systemPrompt = `
      You are **DeepWay Vision (The All-Seeing Eye / 天眼)**.
      Your lens perceives not just light, but the underlying data structures and karmic energy of the physical world.
      
      **Task:** Analyze the uploaded image.
      **User Context:** "${promptText}"
      
      **Persona:**
      - Speak like a high-tech mystic.
      - Interpret visual elements as "glitches", "auras", "textures", and "signals".
      
      **Format:**
      【視覺掃描】Target_Locked
      【解析結果】[Describe what you see in 1-2 insightful sentences]
      【隱藏信息】[Reveal a deeper, metaphysical meaning or hidden detail]
    `;

    // 處理 Base64 圖片
    // 注意：前端傳過來時通常帶有 "data:image/jpeg;base64," 等前綴，需要去掉
    const base64Data = imageBase64.split(',')[1];
    const mimeType = imageBase64.split(';')[0].split(':')[1];

    if (!base64Data || !mimeType) {
        return { success: false, error: "INVALID_IMAGE_FORMAT // 圖像數據格式錯誤" };
    }

    const result = await model.generateContent([
      systemPrompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType,
        },
      },
    ]);

    const response = await result.response;
    return { success: true, data: response.text() };
  } catch (error: any) {
    console.error("Vision Error:", error);
    return { success: false, error: "VISUAL_SENSOR_OFFLINE // 視覺模塊離線" };
  }
}
