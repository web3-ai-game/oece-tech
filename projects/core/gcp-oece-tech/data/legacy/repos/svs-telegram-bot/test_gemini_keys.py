#!/usr/bin/env python3
"""
测试 Gemini API Keys 的可用性
"""

import os
import sys
import json
from datetime import datetime
import google.generativeai as genai

# 从环境变量读取 keys
keys_to_test = {
    'GEMINI_KEY_1': os.getenv('GEMINI_API_KEY'),
    'GEMINI_KEY_2': os.getenv('GEMINI_API_KEY_2'),
    'GEMINI_KEY_3': os.getenv('GEMINI_API_KEY_3'),
}

def test_gemini_key(key_name, api_key):
    """测试单个 Gemini API Key"""
    if not api_key:
        return {
            'key_name': key_name,
            'status': 'MISSING',
            'error': 'Key not found in environment',
            'models': []
        }
    
    try:
        # 配置 API
        genai.configure(api_key=api_key)
        
        # 尝试列出可用模型
        models = []
        try:
            for m in genai.list_models():
                if 'generateContent' in m.supported_generation_methods:
                    models.append(m.name)
        except Exception as e:
            pass
        
        # 测试简单生成
        model = genai.GenerativeModel('gemini-2.0-flash-exp')
        response = model.generate_content("Say 'OK' if you can read this.")
        
        return {
            'key_name': key_name,
            'status': 'WORKING',
            'response': response.text[:50],
            'models_count': len(models),
            'test_time': datetime.now().isoformat()
        }
        
    except Exception as e:
        return {
            'key_name': key_name,
            'status': 'FAILED',
            'error': str(e)[:100],
            'error_type': type(e).__name__
        }

def main():
    print("🔍 测试 Gemini API Keys...\n")
    
    results = []
    working_keys = []
    
    for key_name, api_key in keys_to_test.items():
        print(f"测试 {key_name}...", end=' ')
        result = test_gemini_key(key_name, api_key)
        results.append(result)
        
        if result['status'] == 'WORKING':
            print(f"✅ 可用")
            working_keys.append(key_name)
        elif result['status'] == 'MISSING':
            print(f"⚠️  未找到")
        else:
            print(f"❌ 失败: {result.get('error', 'Unknown error')}")
    
    print(f"\n{'='*60}")
    print(f"测试结果摘要:")
    print(f"{'='*60}")
    print(f"总计: {len(results)} 个 keys")
    print(f"可用: {len(working_keys)} 个")
    print(f"失败: {len([r for r in results if r['status'] == 'FAILED'])} 个")
    print(f"\n可用的 Keys: {', '.join(working_keys) if working_keys else '无'}")
    
    # 输出 JSON 结果
    print(f"\n{'='*60}")
    print("详细结果 (JSON):")
    print(json.dumps(results, indent=2, ensure_ascii=False))
    
    return len(working_keys)

if __name__ == '__main__':
    working_count = main()
    sys.exit(0 if working_count > 0 else 1)
