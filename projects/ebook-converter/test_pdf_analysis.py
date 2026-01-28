#!/usr/bin/env python3
import sys
import fitz  # PyMuPDF
from pathlib import Path
from gemini_converter import GeminiConverter
from PIL import Image
import io

def analyze_pdf_page(pdf_path, page_num=0):
    print(f"正在打開 PDF: {pdf_path}")
    try:
        doc = fitz.open(pdf_path)
        if page_num >= len(doc):
            print(f"錯誤: 頁碼 {page_num} 超出範圍 (總頁數: {len(doc)})")
            return

        page = doc[page_num]
        print(f"正在處理第 {page_num + 1} 頁...")
        
        # 獲取頁面圖像
        pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) # 2x zoom for better quality
        img_data = pix.tobytes("png")
        img = Image.open(io.BytesIO(img_data))
        
        # 初始化轉換器
        converter = GeminiConverter()
        
        # 分析
        print("正在發送至 Gemini 進行分析...")
        prompt = """
        請分析這張 PDF 頁面。
        1. 識別頁面類型（封面、目錄、正文、圖表等）。
        2. 提取主要標題和關鍵內容。
        3. 如果有圖片或圖表，請描述其內容。
        4. 總結這一頁的核心信息。
        """
        
        result = converter.analyze_image(img, prompt)
        
        print("\n" + "="*50)
        print("Gemini 分析結果:")
        print("="*50)
        print(result)
        print("="*50)
        
        doc.close()
        
    except Exception as e:
        print(f"發生錯誤: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        # 默認測試文件
        pdf_path = "/home/sms/ebook-converter/data/baidu-cache/非暴力沟通.pdf"
    else:
        pdf_path = sys.argv[1]
        
    if not Path(pdf_path).exists():
        print(f"文件不存在: {pdf_path}")
        # 嘗試找一個存在的 PDF
        import glob
        pdfs = glob.glob("/home/sms/ebook-converter/data/baidu-cache/*.pdf")
        if pdfs:
            pdf_path = pdfs[0]
            print(f"使用替代文件: {pdf_path}")
        else:
            sys.exit(1)
            
    analyze_pdf_page(pdf_path)
