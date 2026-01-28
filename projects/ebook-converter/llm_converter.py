#!/usr/bin/env python3
import os
import time
import logging
import json
import random
from typing import List, Dict, Optional, Union
import google.generativeai as genai
from openai import OpenAI
from config import (
    GEMINI_API_KEYS, GEMINI_MODELS, 
    XAI_API_KEYS, XAI_MODEL
)
from PIL import Image
import io

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class LLMConverter:
    def __init__(self, model_type: str = 'fast'):
        # Initialize X.AI Clients
        self.xai_clients = []
        for key in XAI_API_KEYS:
            try:
                client = OpenAI(
                    api_key=key,
                    base_url="https://api.x.ai/v1",
                )
                self.xai_clients.append(client)
            except Exception as e:
                logger.error(f"Failed to init X.AI client with key {key[:10]}...: {e}")
        
        self.current_xai_index = 0
        self.xai_model = XAI_MODEL

        # Initialize Gemini
        self.gemini_keys = GEMINI_API_KEYS
        self.current_gemini_index = 0
        self._setup_gemini()
        self.gemini_model_name = GEMINI_MODELS.get(model_type, GEMINI_MODELS['default'])
        self.gemini_model = genai.GenerativeModel(self.gemini_model_name)
        
        logger.info(f"LLM Converter initialized. X.AI Clients: {len(self.xai_clients)}, Gemini Model: {self.gemini_model_name}")

    def _setup_gemini(self):
        genai.configure(api_key=self.gemini_keys[self.current_gemini_index])

    def _rotate_gemini_key(self):
        self.current_gemini_index = (self.current_gemini_index + 1) % len(self.gemini_keys)
        logger.info(f"Rotating Gemini Key to index {self.current_gemini_index}")
        self._setup_gemini()

    def _get_xai_client(self):
        if not self.xai_clients:
            return None
        # Random selection for thread safety
        return random.choice(self.xai_clients)

    def convert_text_to_markdown(self, text: str, metadata: Dict) -> str:
        """Convert text to Markdown using Gemini (primary) - X.AI quota exhausted"""
        
        prompt_content = f"""You are a professional academic editor and formatting expert.
Task: Convert the following raw text into structured, high-quality Markdown.

Requirements:
1. Identify and format headings (#, ##, ###) based on logical structure.
2. Preserve and format paragraphs correctly.
3. Format lists (bullet points and numbered lists).
4. Format blockquotes using >.
5. Format code blocks using ```language.
6. Identify and preserve academic citations, footnotes, and references.
7. Clean up OCR errors, excessive whitespace, and broken lines.
8. Output ONLY the Markdown content. Do not include introductory or concluding remarks.

Metadata:
- Filename: {metadata.get('filename', 'unknown')}
- Type: {metadata.get('type', 'unknown')}

Raw Text:
{text}
"""

        # Use Gemini directly (X.AI quota exhausted)
        return self._try_gemini_conversion(prompt_content, text)

    def _try_xai_conversion(self, prompt: str) -> Optional[str]:
        if not self.xai_clients:
            return None

        max_retries = 3
        for attempt in range(max_retries):
            client = self._get_xai_client()
            try:
                response = client.chat.completions.create(
                    model=self.xai_model,
                    messages=[
                        {"role": "system", "content": "You are a helpful assistant that converts text to markdown."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3,
                    max_tokens=8192 if "grok" in self.xai_model else 4096
                )
                content = response.choices[0].message.content
                if content:
                    logger.info(f"X.AI ({self.xai_model}) conversion successful")
                    return content
            except Exception as e:
                logger.warning(f"X.AI conversion failed (Attempt {attempt+1}/{max_retries}): {e}")
                time.sleep(1)
        
        return None

    def _try_gemini_conversion(self, prompt: str, original_text: str) -> str:
        max_retries = 5
        base_wait = 2

        for attempt in range(max_retries):
            try:
                response = self.gemini_model.generate_content(prompt)
                logger.info(f"Gemini conversion successful")
                return response.text
            except Exception as e:
                if "429" in str(e) or "quota" in str(e).lower():
                    self._rotate_gemini_key()
                    wait_time = base_wait * (1.5 ** attempt) + (attempt * 0.5)
                    logger.warning(f"Gemini Quota exceeded. Retrying in {wait_time:.1f}s...")
                    time.sleep(wait_time)
                else:
                    logger.error(f"Gemini conversion failed: {e}")
                    # If safety filter triggered
                    if "finish_reason" in str(e):
                        return self._fallback_simple_formatting(original_text)
                    return self._fallback_simple_formatting(original_text)
        
        return self._fallback_simple_formatting(original_text)

    def _fallback_simple_formatting(self, text: str) -> str:
        """Smart rule-based formatting fallback for Chinese/English text"""
        import re
        
        lines = text.split('\n')
        markdown_lines = []
        
        # Common Chinese chapter/section patterns
        chapter_patterns = [
            r'^第[一二三四五六七八九十百千\d]+[章节回卷部篇]',  # 第X章/节/回/卷/部/篇
            r'^[一二三四五六七八九十]+[、\.]',  # 一、二、三、
            r'^\d+[、\.\s]',  # 1、2、3、
            r'^[（\(][一二三四五六七八九十\d]+[）\)]',  # (一) (二)
            r'^序$|^序言$|^前言$|^后记$|^跋$|^引言$|^目录$',  # 序/序言/前言/后记
            r'^简介$|^作者简介$|^内容简介$|^出版说明$',  # 简介类
            r'^Chapter\s+\d+|^CHAPTER\s+\d+',  # English chapters
        ]
        
        # Compile patterns
        compiled_patterns = [re.compile(p) for p in chapter_patterns]
        
        # Track if we've added a title
        has_title = False
        
        for i, line in enumerate(lines):
            line = line.strip()
            if not line:
                markdown_lines.append('')
                continue
            
            # Check if this looks like a title (first non-empty short line)
            if not has_title and i < 10 and len(line) < 30 and not any(c in line for c in '。，、；：'):
                markdown_lines.append(f"# {line}")
                has_title = True
                continue
            
            # Check for chapter/section headers
            is_header = False
            for pattern in compiled_patterns:
                if pattern.match(line):
                    is_header = True
                    break
            
            # Also check for short lines that look like headers
            if not is_header and len(line) < 50:
                # Short line without ending punctuation might be a header
                if not line.endswith(('。', '，', '、', '；', '：', '.', ',', '!', '?', '！', '？')):
                    # Check if it's likely a section header
                    if len(line) < 20 or line[0].isupper():
                        is_header = True
            
            if is_header:
                # Determine header level based on pattern
                if any(re.match(r'^第[一二三四五六七八九十百千\d]+[章卷部]', line) for _ in [1]):
                    markdown_lines.append(f"## {line}")
                elif any(re.match(r'^第[一二三四五六七八九十百千\d]+[节回篇]', line) for _ in [1]):
                    markdown_lines.append(f"### {line}")
                else:
                    markdown_lines.append(f"## {line}")
            else:
                markdown_lines.append(line)
        
        return '\n\n'.join(markdown_lines)

    def extract_structure(self, markdown_text: str, filename: str) -> Dict:
        """Extract Wittgensteinian structure using Gemini (X.AI quota exhausted)"""
        
        # Limit content to avoid overly long JSON responses that get truncated
        content_preview = markdown_text[:8000]
        
        prompt = f"""Analyze the following Markdown document and extract its logical structure.

IMPORTANT: Keep your response concise. Limit propositions to max 10 items, concepts to max 15 items.

Output JSON ONLY with this schema:
{{
    "propositions": [
        {{"id": "1", "text": "Main proposition (max 100 chars)", "level": 1}}
    ],
    "concepts": [
        {{"name": "Concept", "frequency": 5, "context": "Brief context (max 50 chars)"}}
    ],
    "relations": [
        {{"source": "A", "target": "B", "type": "relation_type"}}
    ],
    "hierarchy": {{
        "main_topics": ["Topic 1", "Topic 2"],
        "structure": "Brief description (max 200 chars)"
    }}
}}

Document: {filename}
Content Preview:
{content_preview}
"""

        # Use Gemini directly (X.AI quota exhausted)
        return self._try_gemini_structure(prompt, markdown_text, filename)

    def _try_xai_structure(self, prompt: str) -> Optional[Dict]:
        if not self.xai_clients:
            return None
            
        client = self._get_xai_client()
        try:
            response = client.chat.completions.create(
                model=self.xai_model,
                messages=[
                    {"role": "system", "content": "You are a logical structure analyzer. Output JSON only."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                response_format={"type": "json_object"}
            )
            content = response.choices[0].message.content
            return self._robust_json_parse(content)
        except Exception as e:
            logger.warning(f"X.AI structure extraction failed: {e}")
            return None

    def _try_gemini_structure(self, prompt: str, markdown_text: str, filename: str) -> Dict:
        try:
            response = self.gemini_model.generate_content(prompt)
            content = response.text
            return self._robust_json_parse(content)
        except Exception as e:
            logger.error(f"Gemini structure extraction failed: {e}")
            return self._create_basic_structure(markdown_text, filename)

    def _robust_json_parse(self, content: str) -> Dict:
        """Robustly extract and parse JSON from string using raw_decode"""
        try:
            # Clean up markdown code blocks
            text = content.strip()
            if text.startswith('```json'):
                text = text.replace('```json', '', 1)
            if text.startswith('```'):
                text = text.replace('```', '', 1)
            if text.endswith('```'):
                text = text.replace('```', '', 1)
            text = text.strip()
            
            # Find the first opening brace
            start_idx = text.find('{')
            if start_idx == -1:
                 raise ValueError("No JSON object found (no opening brace)")
            
            text = text[start_idx:]
            
            # Use raw_decode to parse just the first object and ignore trailing data
            decoder = json.JSONDecoder()
            obj, _ = decoder.raw_decode(text)
            return obj
            
        except Exception as e:
            logger.error(f"JSON parsing failed. Raw content start: {content[:100]}... Error: {e}")
            raise e

    def _create_basic_structure(self, markdown_text: str, filename: str) -> Dict:
        return {
            "propositions": [{"id": "1", "text": f"Document: {filename}", "level": 1}],
            "concepts": [],
            "relations": [],
            "hierarchy": {"main_topics": [], "structure": "Basic structure (extraction failed)"}
        }
