import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// 初始化Gemini API客户端
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, style, aspectRatio } = body;

    if (!prompt) {
      return NextResponse.json(
        { error: '请输入图片描述' },
        { status: 400 }
      );
    }

    // 如果没有配置API Key，返回模拟数据
    if (!process.env.GEMINI_API_KEY) {
      console.log('⚠️ 未配置GEMINI_API_KEY，返回模拟图片');
      
      // 使用placeholder图片服务作为演示
      const size = aspectRatio === '16:9' ? '1024x576' : 
                   aspectRatio === '9:16' ? '576x1024' : '1024x1024';
      
      return NextResponse.json({
        imageUrl: `https://placehold.co/${size}/6366f1/white?text=${encodeURIComponent(prompt.substring(0, 20))}`,
        prompt,
        cost: 0.5,
        model: 'placeholder',
        message: '这是模拟图片，配置GEMINI_API_KEY后将使用Gemini 2.5 Pro生成概念',
      });
    }

    console.log('🎨 调用Gemini 2.5 Pro API生成图片描述...');
    console.log('📝 提示词:', prompt);

    // ==================== 核心：使用Gemini 2.5 Pro ====================
    
    // 使用统一的Gemini 2.5 Pro模型
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-pro',
      generationConfig: {
        temperature: 0.9,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 2048,
      },
    });

    // 构建提示词：让Gemini 2.5 Pro生成超详细的图片描述
    const styleMap: Record<string, string> = {
      realistic: 'photorealistic, high detail professional photography',
      artistic: 'artistic painting with creative expressive brushstrokes',
      anime: 'anime style manga art with vibrant colors',
      '3d': '3D rendered with cinema 4d quality',
      'oil-painting': 'classical oil painting on canvas',
      watercolor: 'soft watercolor painting',
    };
    
    const styleDesc = style && styleMap[style] ? styleMap[style] : 'high quality';
    const ratioDesc = aspectRatio === '16:9' ? 'wide landscape' : 
                      aspectRatio === '9:16' ? 'tall portrait' : 'square';
    
    // 让AI生成详细的图片描述和元数据
    const imagePrompt = `You are an expert AI image generator prompt engineer. 

User wants to create an image with this description: "${prompt}"
Style: ${styleDesc}
Format: ${ratioDesc} format

Please respond with a JSON object containing:
1. An enhanced, super-detailed prompt for image generation (200+ words)
2. A brief description of what the image should look like
3. Suggested colors, mood, lighting
4. Technical details

Format your response as valid JSON:
{
  "enhancedPrompt": "detailed prompt here...",
  "description": "brief description...",
  "visualElements": {
    "colors": ["color1", "color2"],
    "mood": "mood description",
    "lighting": "lighting description",
    "composition": "composition description"
  }
}

Generate the JSON now:`;

    // 调用Gemini 2.5 Pro生成图片描述
    const result = await model.generateContent(imagePrompt);
    const response = result.response;
    const text = response.text();
    
    console.log('✅ Gemini 2.5 Pro响应:', text);
    
    // 解析JSON响应
    interface ImageMetadata {
      enhancedPrompt?: string;
      description?: string;
      visualElements?: {
        colors?: string[];
        mood?: string;
        lighting?: string;
        composition?: string;
      };
    }
    
    let imageMetadata: ImageMetadata = {};
    try {
      const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/{[\s\S]*}/);
      if (jsonMatch) {
        const jsonStr = jsonMatch[0].replace(/```json|```/g, '').trim();
        imageMetadata = JSON.parse(jsonStr);
      }
    } catch {
      console.log('JSON解析失败，使用原始文本');
      imageMetadata = {
        enhancedPrompt: text,
        description: prompt,
      };
    }
    
    // 生成图片URL（使用AI生成的描述创建可视化）
    // 这里使用Unsplash API或其他图片服务作为演示
    const size = aspectRatio === '16:9' ? '1200x675' : 
                 aspectRatio === '9:16' ? '675x1200' : '1024x1024';
    
    // 从prompt提取关键词用于搜索
    const keywords = prompt.split(' ').slice(0, 3).join(',');
    const imageUrl = `https://source.unsplash.com/random/${size}/?${encodeURIComponent(keywords)}`;
    
    console.log('✅ 图片元数据生成成功！');

    // 计算费用
    const cost = 0.5; // $0.50 per image

    return NextResponse.json({
      imageUrl,
      prompt: imageMetadata.enhancedPrompt || prompt,
      originalPrompt: prompt,
      description: imageMetadata.description || prompt,
      visualElements: imageMetadata.visualElements || {},
      style,
      aspectRatio,
      cost,
      model: 'gemini-2.5-pro',
      note: 'Using Unsplash for demo - Gemini 2.5 Pro generated the concept',
    });

  } catch (error: unknown) {
    console.error('❌ 图片生成失败:', error);
    
    // 详细错误处理
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('API key')) {
      return NextResponse.json(
        { error: 'API密钥无效' },
        { status: 401 }
      );
    }

    if (errorMessage.includes('quota')) {
      return NextResponse.json(
        { error: 'API配额不足' },
        { status: 429 }
      );
    }

    if (errorMessage.includes('safety')) {
      return NextResponse.json(
        { error: '内容违反安全策略，请修改提示词' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: '图片生成失败',
        details: errorMessage,
        tip: '请检查提示词或稍后重试'
      },
      { status: 500 }
    );
  }
}
