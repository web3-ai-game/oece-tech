import json
import random
import pdfplumber
from pathlib import Path
import logging
import os
from multi_cloud_downloader import MultiCloudDownloader

logging.basicConfig(level=logging.INFO, format='%(message)s')
logger = logging.getLogger("PDFSampler")

def probe_local_pdf(file_path):
    """
    Probe a single LOCAL PDF to determine if it's Text-based or Scanned.
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
            if len(text_content.strip()) > 50:
                return 'text'
            else:
                return 'scan'
    except Exception as e:
        logger.error(f"Error probing {file_path}: {e}")
        return 'error'

def main():
    print("🔍 啟動 PDF 抽樣下載與探測...")
    
    # 1. Setup
    cache_dir = Path("/home/sms/ebook-converter/data/pdf-sample-cache")
    cache_dir.mkdir(parents=True, exist_ok=True)
    
    downloader = MultiCloudDownloader(cache_dir=str(cache_dir))
    
    categories_file = Path("/home/sms/ebook-converter/data/baidu-analysis/file_categories.json")
    if not categories_file.exists():
        print("❌ 找不到文件分類數據")
        return

    with open(categories_file, 'r') as f:
        data = json.load(f)
    
    pdf_files = data.get('pdf_text', [])
    total_pdfs = len(pdf_files)
    
    if total_pdfs == 0:
        print("沒有發現 PDF 文件")
        return

    # 2. Sample
    sample_size = 5  # Download 5 files to test
    print(f"總 PDF 數量: {total_pdfs}")
    print(f"計劃下載抽樣: {sample_size} 個")
    
    samples = random.sample(pdf_files, sample_size)
    
    results = {'text': 0, 'scan': 0, 'error': 0}
    
    # 3. Download and Probe
    for i, file_info in enumerate(samples, 1):
        print(f"\n[{i}/{sample_size}] 正在處理: {file_info['name']}")
        
        # Ensure 'source' is set (default to baidu if missing)
        if 'source' not in file_info:
            file_info['source'] = 'baidu'
            
        # Download
        local_path = downloader.download_file(file_info)
        
        if not local_path:
            print(f"  ❌ 下載失敗")
            results['error'] += 1
            continue
            
        # Probe
        pdf_type = probe_local_pdf(local_path)
        print(f"  ✅ 檢測結果: {pdf_type.upper()}")
        results[pdf_type] += 1
        
        # Cleanup
        try:
            os.remove(local_path)
        except:
            pass

    # 4. Report
    print("\n" + "="*50)
    print("📊 PDF 抽樣探測報告")
    print("="*50)
    
    valid_samples = results['text'] + results['scan']
    if valid_samples > 0:
        text_ratio = results['text'] / valid_samples
        scan_ratio = results['scan'] / valid_samples
        
        print(f"有效樣本數: {valid_samples}")
        print(f"📝 文字版 PDF (Text-based): {results['text']} ({text_ratio*100:.1f}%)")
        print(f"📸 掃描版 PDF (Scanned):    {results['scan']} ({scan_ratio*100:.1f}%)")
        
        est_text = int(total_pdfs * text_ratio)
        est_scan = int(total_pdfs * scan_ratio)
        
        print(f"\n💡 全庫推算:")
        print(f"- 預計文字版: ~{est_text} 個")
        print(f"- 預計掃描版: ~{est_scan} 個")
    else:
        print("❌ 無法獲取有效樣本 (下載失敗或文件損壞)")

if __name__ == "__main__":
    main()
