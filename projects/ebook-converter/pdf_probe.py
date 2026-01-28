import json
import random
import pdfplumber
from pathlib import Path
import logging
import concurrent.futures

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("PDFProbe")

def probe_pdf(file_path):
    """
    Probe a single PDF to determine if it's Text-based or Scanned.
    Returns: 'text', 'scan', or 'error'
    """
    try:
        with pdfplumber.open(file_path) as pdf:
            if not pdf.pages:
                return 'error'
            
            # Check first 3 pages (or less if fewer pages)
            check_pages = pdf.pages[:3]
            text_content = ""
            for page in check_pages:
                text = page.extract_text()
                if text:
                    text_content += text
            
            # Simple heuristic: if we got meaningful text, it's a text PDF
            # A scanned PDF might return empty string or very little garbage
            if len(text_content.strip()) > 50:
                return 'text'
            else:
                return 'scan'
    except Exception as e:
        return 'error'

def main():
    print("🔍 啟動 PDF 類型抽樣探測...")
    
    categories_file = Path("/home/sms/ebook-converter/data/baidu-analysis/file_categories.json")
    if not categories_file.exists():
        print("❌ 找不到文件分類數據")
        return

    with open(categories_file, 'r') as f:
        data = json.load(f)
    
    pdf_files = data.get('pdf_text', []) # Currently all PDFs might be here
    total_pdfs = len(pdf_files)
    
    if total_pdfs == 0:
        print("沒有發現 PDF 文件")
        return

    # Sample size
    sample_size = min(100, total_pdfs)
    print(f"總 PDF 數量: {total_pdfs}")
    print(f"抽樣數量: {sample_size}")
    
    samples = random.sample(pdf_files, sample_size)
    
    results = {'text': 0, 'scan': 0, 'error': 0}
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=10) as executor:
        future_to_file = {
            executor.submit(probe_pdf, f['full_path']): f 
            for f in samples
        }
        
        processed = 0
        for future in concurrent.futures.as_completed(future_to_file):
            file_info = future_to_file[future]
            try:
                res = future.result()
                results[res] += 1
                # print(f"[{res.upper()}] {file_info['name']}")
            except Exception:
                results['error'] += 1
            
            processed += 1
            if processed % 10 == 0:
                print(f"進度: {processed}/{sample_size}...")

    print("\n📊 探測結果:")
    print(f"✅ 文字版 PDF (可快速處理): {results['text']} ({results['text']/sample_size*100:.1f}%)")
    print(f"📸 掃描版 PDF (需 OCR): {results['scan']} ({results['scan']/sample_size*100:.1f}%)")
    print(f"⚠️ 損壞/無法讀取: {results['error']} ({results['error']/sample_size*100:.1f}%)")
    
    # Estimate total size requiring OCR
    scan_ratio = results['scan'] / sample_size
    text_ratio = results['text'] / sample_size
    
    print(f"\n💡 推算全庫情況:")
    print(f"- 預計文字版 PDF: ~{int(total_pdfs * text_ratio)} 個")
    print(f"- 預計掃描版 PDF: ~{int(total_pdfs * scan_ratio)} 個 (這是硬骨頭)")

if __name__ == "__main__":
    main()
