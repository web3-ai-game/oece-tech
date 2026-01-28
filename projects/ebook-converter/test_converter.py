#!/usr/bin/env python3
"""測試轉換器的各個組件"""
import os
import sys
from pathlib import Path

def test_gemini_api():
    """測試 Gemini API 連接"""
    print("測試 1: Gemini API 連接")
    print("-" * 50)
    
    try:
        from gemini_converter import GeminiConverter
        converter = GeminiConverter('fast')
        
        test_text = """
        第一章 引言
        
        這是一個測試文檔。本章將介紹基本概念。
        
        1.1 背景
        
        維根斯坦認為，世界是事實的總和。
        """
        
        result = converter.convert_text_to_markdown(
            test_text,
            {'filename': 'test.txt', 'type': 'txt'}
        )
        
        print("✓ Gemini API 正常工作")
        print(f"輸入: {len(test_text)} 字符")
        print(f"輸出: {len(result)} 字符")
        print("\n轉換結果預覽:")
        print(result[:200])
        return True
        
    except Exception as e:
        print(f"✗ Gemini API 測試失敗: {e}")
        return False

def test_extractor():
    """測試文本提取器"""
    print("\n\n測試 2: 文本提取器")
    print("-" * 50)
    
    try:
        from ebook_extractor import EbookExtractor
        extractor = EbookExtractor()
        
        print(f"✓ 提取器初始化成功")
        print(f"支援格式: {list(extractor.supported_formats.keys())}")
        return True
        
    except Exception as e:
        print(f"✗ 提取器測試失敗: {e}")
        return False

def test_indexer():
    """測試索引器"""
    print("\n\n測試 3: 維根斯坦索引器")
    print("-" * 50)
    
    try:
        from wittgenstein_indexer import WittgensteinIndexer
        indexer = WittgensteinIndexer('/tmp/test-index')
        
        test_structure = {
            'propositions': [
                {'id': '1', 'text': '世界是所有發生的事情', 'level': 1},
                {'id': '1.1', 'text': '世界是事實的總和', 'level': 2}
            ],
            'concepts': [
                {'name': '世界', 'frequency': 2, 'context': '形而上學'}
            ],
            'relations': [
                {'source': '世界', 'target': '事實', 'type': '包含'}
            ],
            'hierarchy': {
                'main_topics': ['形而上學'],
                'structure': '測試結構'
            }
        }
        
        doc_id = indexer.add_document(
            '/tmp/test.txt',
            '/tmp/test.md',
            test_structure
        )
        
        indexer.save_index()
        stats = indexer.get_stats()
        
        print(f"✓ 索引器正常工作")
        print(f"文檔 ID: {doc_id}")
        print(f"統計: {stats}")
        return True
        
    except Exception as e:
        print(f"✗ 索引器測試失敗: {e}")
        return False

def test_s3():
    """測試 S3 上傳器"""
    print("\n\n測試 4: S3 上傳器")
    print("-" * 50)
    
    try:
        from s3_uploader import S3Uploader
        uploader = S3Uploader()
        
        print(f"✓ S3 上傳器初始化成功")
        print(f"目標 Bucket: {uploader.bucket_name}")
        
        # 嘗試列出文件
        files = uploader.list_files('index/')
        print(f"找到 {len(files)} 個索引文件")
        
        return True
        
    except Exception as e:
        print(f"✗ S3 上傳器測試失敗: {e}")
        print("提示: 請確保已配置 AWS 憑證或 GCS 訪問權限")
        return False

def test_downloader():
    """測試多雲盤下載器"""
    print("\n\n測試 5: 多雲盤下載器")
    print("-" * 50)
    
    try:
        from multi_cloud_downloader import MultiCloudDownloader
        downloader = MultiCloudDownloader()
        
        print(f"✓ 下載器初始化成功")
        print(f"緩存目錄: {downloader.cache_dir}")
        print(f"支援格式: {downloader.ebook_formats}")
        
        return True
        
    except Exception as e:
        print(f"✗ 下載器測試失敗: {e}")
        return False

def main():
    print("=" * 60)
    print("電子書轉換器組件測試")
    print("=" * 60)
    
    results = []
    
    results.append(("Gemini API", test_gemini_api()))
    results.append(("文本提取器", test_extractor()))
    results.append(("索引器", test_indexer()))
    results.append(("S3 上傳器", test_s3()))
    results.append(("多雲盤下載器", test_downloader()))
    
    print("\n\n" + "=" * 60)
    print("測試結果總結")
    print("=" * 60)
    
    for name, passed in results:
        status = "✓ 通過" if passed else "✗ 失敗"
        print(f"{name:20s} {status}")
    
    passed_count = sum(1 for _, p in results if p)
    print(f"\n總計: {passed_count}/{len(results)} 通過")
    
    if passed_count == len(results):
        print("\n🎉 所有測試通過！系統已就緒。")
        return 0
    else:
        print("\n⚠️  部分測試失敗，請檢查配置。")
        return 1

if __name__ == "__main__":
    sys.exit(main())
