#!/usr/bin/env python3
import os
import logging
import time
from typing import Optional
from pathlib import Path
import google.generativeai as genai
from config import GEMINI_API_KEYS, GEMINI_MODELS

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class MarkdownBeautifier:
    def __init__(self, model_type: str = 'fast'):
        self.api_keys = GEMINI_API_KEYS
        self.current_key_index = 0
        self._setup_client()
        
        self.model_name = GEMINI_MODELS.get(model_type, GEMINI_MODELS['default'])
        self.model = genai.GenerativeModel(self.model_name)
        logger.info(f"MarkdownBeautifier initialized with model: {self.model_name}")

    def _setup_client(self):
        genai.configure(api_key=self.api_keys[self.current_key_index])

    def _rotate_key(self):
        self.current_key_index = (self.current_key_index + 1) % len(self.api_keys)
        logger.info(f"Rotating API Key to index {self.current_key_index}")
        self._setup_client()

    def beautify_novel(self, markdown_content: str, filename: str = "") -> str:
        """
        Beautify novel markdown content:
        1. Fix paragraph indentation (Chinese standard: 2 spaces).
        2. Highlight/Format dialogue.
        3. Ensure proper header hierarchy.
        4. Clean up OCR artifacts in text.
        """
        
        # If content is too long, we might need to chunk it, 
        # but for now let's assume chapter-level or reasonable size, 
        # or rely on the model's large context window (Flash has 1M context).
        
        prompt = f"""You are a professional typesetter and editor for Chinese novels.
Your task is to "beautify" the following Markdown content.

**Strict Requirements:**

1.  **Indentation:** Ensure every paragraph (that is not a header) starts with a Chinese full-width space or equivalent indentation (2 em spaces) if appropriate for the style, BUT for Markdown standard, usually 2 full-width spaces (`　　`) or no indentation with blank lines between paragraphs is preferred. **Action:** Use standard Markdown paragraph style: No indentation for the first line, but ensure there is a blank line between paragraphs.
2.  **Dialogue:** Identify dialogue. Ensure quotes are using consistent Chinese brackets (`「...」` or `“...”`).
3.  **Headers:** Ensure headers (#, ##, ###) are correctly formatted and hierarchical.
4.  **OCR Cleanup:** Fix obvious OCR errors (e.g., broken lines, weird symbols, "l" vs "1" confusion in numbers if obvious).
5.  **Formatting:**
    *   Bold (**text**) significant sound effects or emphasis if appropriate.
    *   Fix broken line breaks within paragraphs.
6.  **Output:** Return ONLY the beautified Markdown content. Do not include any "Here is the result" text.

**Metadata:**
Filename: {filename}

**Content to Beautify:**
{markdown_content}
"""
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                # Flash model supports large context, but let's be safe with timeouts
                response = self.model.generate_content(prompt)
                
                if response.text:
                    return response.text
                
            except Exception as e:
                if "429" in str(e) or "quota" in str(e).lower():
                    logger.warning(f"Quota exceeded. Rotating key and retrying... (Attempt {attempt+1})")
                    self._rotate_key()
                    time.sleep(2)
                else:
                    logger.error(f"Beautification failed: {e}")
                    # If safety filter triggered, try to return original or partial
                    if "finish_reason" in str(e):
                        logger.warning("Safety filter triggered. Returning original content.")
                        return markdown_content
                    time.sleep(1)

        logger.error("All retries failed. Returning original content.")
        return markdown_content

    def process_file(self, file_path: str, output_path: Optional[str] = None):
        path = Path(file_path)
        if not path.exists():
            logger.error(f"File not found: {file_path}")
            return

        logger.info(f"Beautifying: {path.name}")
        
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            beautified = self.beautify_novel(content, path.name)
            
            out_p = Path(output_path) if output_path else path
            
            with open(out_p, 'w', encoding='utf-8') as f:
                f.write(beautified)
                
            logger.info(f"Saved to: {out_p}")
            
        except Exception as e:
            logger.error(f"Failed to process file {file_path}: {e}")

    def process_directory(self, input_dir: str, recursive: bool = True):
        """Batch process all Markdown files in a directory"""
        p = Path(input_dir)
        if not p.exists():
            logger.error(f"Directory not found: {input_dir}")
            return

        files = list(p.rglob("*.md")) if recursive else list(p.glob("*.md"))
        logger.info(f"Found {len(files)} Markdown files to process.")
        
        for file_path in files:
            if file_path.name in ["CATALOG.md", "SUMMARY.md"]:
                continue
            self.process_file(str(file_path))

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description="Beautify Markdown files using Gemini.")
    parser.add_argument("--dir", type=str, help="Directory to process")
    parser.add_argument("--file", type=str, help="Single file to process")
    
    args = parser.parse_args()
    
    beautifier = MarkdownBeautifier()
    
    if args.dir:
        beautifier.process_directory(args.dir)
    elif args.file:
        beautifier.process_file(args.file)
    else:
        # Test run
        test_content = """
        第一章   开始
        他说道:“你好啊”.
        这就 是  测试文本
        """
        print(beautifier.beautify_novel(test_content, "test.md"))
