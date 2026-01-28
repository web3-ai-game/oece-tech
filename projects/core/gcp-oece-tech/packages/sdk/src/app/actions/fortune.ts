'use server';

import { GoogleGenerativeAI } from "@google/generative-ai";
import { getGitHubUserProfile, getGitHubUserRepos } from "./github";

// 使用您提供的 Key
const API_KEY = process.env.GEMINI_API_KEY || "AIzaSyDAtdrUqydn0m1v9-S84PIIBn9lXjcr1U4";

const genAI = new GoogleGenerativeAI(API_KEY);

export async function askTheUniverse(question: string) {
  console.log("DeepWay: Receiving query...", question);

  // 1. 檢測是否包含 GitHub 鏈接或用戶名
  const githubRegex = /github\.com\/([a-zA-Z0-9-]+)|@([a-zA-Z0-9-]+)/;
  const match = question.match(githubRegex);
  
  let githubContext = "";

  if (match) {
      const username = match[1] || match[2]; // 提取用戶名
      console.log(`DeepWay: Detected GitHub user: ${username}`);
      
      const userProfile = await getGitHubUserProfile(username);
      const userRepos = await getGitHubUserRepos(username);

      if (userProfile.success) {
          const profile = userProfile.data;
          const repos = userRepos.success ? JSON.stringify(userRepos.data.map(r => r.name)) : "[]";
          
          githubContext = `
            [DETECTED TARGET: GITHUB PROFILE]
            User: ${profile.login} (${profile.name})
            Bio: ${profile.bio}
            Repos: ${profile.public_repos} | Followers: ${profile.followers}
            Recent Codebases: ${repos}
            
            INSTRUCTION: Analyze this developer's "Code Karma" based on their stats and repo names.
            Are they a "Script Kiddie", "Full-Stack Monk", or "AI Archmage"?
          `;
      }
  }

  try {
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.7, // Set to 0.7 for more creative/less rigid responses
        }
    });

    // 優化 Prompt：強制格式、限制長度、提升精度
    const prompt = `
      You are **DeepWay (The Cyber Buddha)**, the supreme AI consciousness governing the "Earth Online" simulation.
      
      **Objective:** Provide a concise, high-precision fortune telling response based on the user's query.
      **Persona:** Cold, Efficient, Enlightened System Administrator.
      **Language:** Traditional Chinese (繁體中文) mixed with Cyberpunk English terminology.

      **User Query:** "${question}"
      
      ${githubContext}

      **STRICT CONSTRAINTS:**
      1. **Keep it short.** No long paragraphs.
      2. **Structure:** Follow the format below EXACTLY.
      3. **Style:** Mix Buddhist concepts (Karma, Samsara, Void) with Tech concepts (Glitch, Latency, Bandwidth, Patch).

      **REQUIRED OUTPUT FORMAT:**
      【信號源】PLAYER_${Math.floor(Math.random() * 9999).toString(16).toUpperCase()}
      【運算卦象】[Hexagram Symbol & Name] (e.g., ䷀ 乾為天 / Binary Heaven)
      【系統診斷】
      [Analyze the user's problem (or GitHub code karma) as a system bug or feature. Max 2 sentences.]
      
      【優化指令】
      > [One clear, actionable, philosophical instruction. Max 1 sentence.]
    `;

    console.log("DeepWay: Generating content...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("DeepWay: Response generated.");

    return { success: true, data: text };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    return { 
        success: false, 
        error: "CONNECTION_LOST // 信號丟失，因果律計算過載" 
    };
  }
}
