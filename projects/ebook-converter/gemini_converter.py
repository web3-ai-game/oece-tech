#!/usr/bin/env python3
import os
import time
import logging
from typing import List, Dict, Optional, Union
import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODELS
from PIL import Image
import io

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeminiConverter:
    def __init__(self, model_type: str = 'fast'):
        genai.configure(api_key=GEMINI_API_KEY)
        self.model_name = GEMINI_MODELS.get(model_type, GEMINI_MODELS['default'])
        self.model = genai.GenerativeModel(self.model_name)
        logger.info(f"Gemini 轉換器初始化完成，使用模型: {self.model_name}")
    
    def analyze_image(self, image: Union[bytes, Image.Image], prompt: str = None) -> str:
        """使用 Gemini 分析圖像內容"""
        if prompt is None:
            prompt = "請詳細分析這張圖片的內容。如果是文檔頁面，請提取其中的文字並描述其排版結構。"
            
        try:
            # 處理圖像輸入
            img_part = image
            if isinstance(image, bytes):
                img_part = Image.open(io.BytesIO(image))
            
            response = self.model.generate_content([prompt, img_part])
            return response.text
        except Exception as e:
            logger.error(f"圖像分析失敗: {e}")
            return f"圖像分析失敗: {str(e)}"

    def convert_text_to_markdown_stream(self, text: str, metadata: Dict):
        """使用 Gemini 將文本轉換為結構化的 Markdown (流式輸出)"""
        
        prompt = f"""請將以下文本轉換為結構化的 Markdown 格式。要求：

1. 識別並標記標題層級 (# ## ### 等)
2. 保持段落結構
3. 識別列表並使用 Markdown 列表語法
4. 識別引用並使用 > 語法
5. 識別代碼塊並使用 ``` 語法
6. 保留重要的格式信息
7. 如果是學術文本，識別引用、註釋等
8. 清理多餘的空白和格式錯誤

文檔元數據：
- 文件名: {metadata.get('filename', 'unknown')}
- 類型: {metadata.get('type', 'unknown')}

原始文本：
{text}

請直接輸出 Markdown 格式的內容，不要添加任何解釋。"""

        max_retries = 10
        base_wait = 2

        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(prompt, stream=True)
                for chunk in response:
                    # Check for safety/copyright blocks
                    if chunk.candidates:
                        reason = chunk.candidates[0].finish_reason
                        # 1=STOP, 0=UNKNOWN. 2=SAFETY, 8=RECITATION
                        if reason not in [0, 1]: 
                            logger.warning(f"內容被攔截 (Stream). Reason: {reason}")
                            yield f"\n\n> [內容被 AI 模型攔截/過濾，代碼: {reason}]\n\n"
                            return # Stop trying for this text

                    try:
                        if chunk.text:
                            yield chunk.text
                    except ValueError:
                        continue
                return
            except Exception as e:
                if "429" in str(e) or "quota" in str(e).lower():
                    wait_time = base_wait * (1.5 ** attempt) + (attempt * 0.5) # Jitter
                    logger.warning(f"Quota exceeded (Stream). Retrying in {wait_time:.1f}s... (Attempt {attempt+1}/{max_retries})")
                    time.sleep(wait_time)
                else:
                    # If it's a safety error that wasn't caught in the loop
                    if "finish_reason" in str(e) or "ValueError" in str(e):
                        logger.warning(f"內容被攔截或無效 (Exception): {e}")
                        yield f"\n\n> [內容被 AI 模型攔截/過濾]\n\n"
                        return
                    
                    logger.error(f"Gemini 流式轉換失敗: {e}")
                    yield self._fallback_conversion(text)
                    return

    def convert_text_to_markdown(self, text: str, metadata: Dict) -> str:
        """使用 Gemini 將文本轉換為結構化的 Markdown"""
        
        prompt = f"""請將以下文本轉換為結構化的 Markdown 格式。要求：

1. 識別並標記標題層級 (# ## ### 等)
2. 保持段落結構
3. 識別列表並使用 Markdown 列表語法
4. 識別引用並使用 > 語法
5. 識別代碼塊並使用 ``` 語法
6. 保留重要的格式信息
7. 如果是學術文本，識別引用、註釋等
8. 清理多餘的空白和格式錯誤

文檔元數據：
- 文件名: {metadata.get('filename', 'unknown')}
- 類型: {metadata.get('type', 'unknown')}

原始文本：
{text}

請直接輸出 Markdown 格式的內容，不要添加任何解釋。"""

        try:
            response = self.model.generate_content(prompt)
            markdown_text = response.text
            logger.info(f"成功轉換文本片段 ({len(text)} 字符 -> {len(markdown_text)} 字符)")
            return markdown_text
        except Exception as e:
            logger.error(f"Gemini 轉換失敗: {e}")
            return self._fallback_conversion(text)
    
    def _fallback_conversion(self, text: str) -> str:
        """備用轉換方法（簡單格式化）"""
        lines = text.split('\n')
        markdown_lines = []
        
        for line in lines:
            line = line.strip()
            if not line:
                markdown_lines.append('')
                continue
            
            if len(line) < 50 and line[0].isupper():
                markdown_lines.append(f"## {line}")
            else:
                markdown_lines.append(line)
        
        return '\n\n'.join(markdown_lines)
    
    def extract_structure(self, markdown_text: str, filename: str) -> Dict:
        """使用 Gemini 提取維根斯坦式的結構"""
        
        prompt = f"""分析以下 Markdown 文檔，提取維根斯坦式的邏輯結構。

要求輸出 JSON 格式：
{{
    "propositions": [
        {{"id": "1", "text": "主要命題", "level": 1}},
        {{"id": "1.1", "text": "子命題", "level": 2}}
    ],
    "concepts": [
        {{"name": "概念名", "frequency": 5, "context": "相關上下文"}}
    ],
    "relations": [
        {{"source": "概念A", "target": "概念B", "type": "包含/對立/推導"}}
    ],
    "hierarchy": {{
        "main_topics": ["主題1", "主題2"],
        "structure": "文檔結構描述"
    }}
}}

文檔: {filename}

內容:
{markdown_text}

請只輸出 JSON，不要添加任何解釋。"""

        max_retries = 10
        base_wait = 2

        for attempt in range(max_retries):
            try:
                response = self.model.generate_content(prompt)
                import json
                text = response.text.strip()
                if text.startswith('```json'):
                    text = text.replace('```json', '', 1)
                if text.endswith('```'):
                    text = text.replace('```', '', 1)
                structure = json.loads(text)
                logger.info(f"成功提取結構: {len(structure.get('propositions', []))} 個命題")
                return structure
            except Exception as e:
                if "429" in str(e) or "quota" in str(e).lower():
                    self._rotate_key()
                    wait_time = random.uniform(0.5, 2.0)
                    logger.warning(f"Quota exceeded (Structure). Rotated Key. Retrying in {wait_time:.1f}s... (Attempt {attempt+1}/{max_retries})")
                    time.sleep(wait_time)
                else:
                    logger.error(f"結構提取失敗: {e}")
                    # 如果不是配額問題，可能是安全問題或其他不可恢復的錯誤，直接返回基本結構，不重試
                    return self._create_basic_structure(markdown_text, filename)
        
        return self._create_basic_structure(markdown_text, filename)
    
    def _create_basic_structure(self, markdown_text: str, filename: str) -> Dict:
        """創建基本結構（備用方法）"""
        lines = markdown_text.split('\n')
        propositions = []
        concepts = set()
        
        prop_id = 1
        for line in lines:
            if line.startswith('#'):
                level = len(line) - len(line.lstrip('#'))
                text = line.lstrip('#').strip()
                propositions.append({
                    'id': str(prop_id),
                    'text': text,
                    'level': level
                })
                prop_id += 1
                
                words = text.split()
                for word in words:
                    if len(word) > 3:
                        concepts.add(word)
        
        return {
            'propositions': propositions,
            'concepts': [{'name': c, 'frequency': 1, 'context': ''} for c in list(concepts)[:50]],
            'relations': [],
            'hierarchy': {
                'main_topics': [p['text'] for p in propositions[:5]],
                'structure': f'文檔包含 {len(propositions)} 個主要命題'
            }
        }
    
    def batch_convert(self, text_chunks: List[str], metadata: Dict) -> str:
        """批量轉換文本塊"""
        markdown_parts = []
        
        for i, chunk in enumerate(text_chunks):
            logger.info(f"轉換第 {i+1}/{len(text_chunks)} 個文本塊")
            md = self.convert_text_to_markdown(chunk, metadata)
            markdown_parts.append(md)
        
        return '\n\n---\n\n'.join(markdown_parts)

if __name__ == "__main__":
    converter = GeminiConverter('fast')
    test_text = "這是一個測試文本。\n\n第一章 引言\n\n這是引言的內容。"
    result = converter.convert_text_to_markdown(test_text, {'filename': 'test.txt', 'type': 'txt'})
    print(result)
