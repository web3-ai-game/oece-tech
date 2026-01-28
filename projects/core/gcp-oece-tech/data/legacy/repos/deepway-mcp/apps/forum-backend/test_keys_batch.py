#!/usr/bin/env python3
"""
批量测试Gemini API Keys
"""

import google.generativeai as genai
import time

# 待测试的keys
TEST_KEYS = {
    'Key1': 'AIzaSyAQzAb8RN6IRT0C_jJd37bgyM91WLTmyZKC8KNHe1kNZrja54cGilQ',
    'Key2': 'AIzaSyCFsMpRhiwm_SMgsJNODRAR86NKDxM6M8c',
    'Key3': 'AIzaSyAt0PUYuIrHN898bGAE1amOsUjP3ogrXiQ'
}

def test_key(key_name, api_key):
    """测试单个key"""
    print(f"\n{'='*60}")
    print(f"🔑 测试 {key_name}")
    print(f"Key: {api_key[:20]}...{api_key[-10:]}")
    print(f"{'='*60}")
    
    try:
        # 配置API
        genai.configure(api_key=api_key)
        
        # 测试flash-lite模型
        print("\n📊 测试 gemini-2.0-flash-lite...")
        model_lite = genai.GenerativeModel('gemini-2.0-flash-lite')
        
        start_time = time.time()
        response = model_lite.generate_content("Say hello in one word")
        lite_time = time.time() - start_time
        
        print(f"✅ flash-lite 可用!")
        print(f"   响应时间: {lite_time:.2f}秒")
        print(f"   回复: {response.text}")
        
        # 测试flash模型
        print("\n📊 测试 gemini-2.0-flash...")
        model_flash = genai.GenerativeModel('gemini-2.0-flash')
        
        start_time = time.time()
        response = model_flash.generate_content("Say hello in one word")
        flash_time = time.time() - start_time
        
        print(f"✅ flash 可用!")
        print(f"   响应时间: {flash_time:.2f}秒")
        print(f"   回复: {response.text}")
        
        # 检查配额信息
        print("\n💰 配额信息:")
        try:
            # 尝试获取模型列表（需要API权限）
            models = genai.list_models()
            print("   ✅ API有效，可列出模型")
            
            # 检查是否为免费层
            print("   📝 检查免费层状态...")
            # Gemini API免费层特征：
            # - 可以访问所有公开模型
            # - 有速率限制 (RPM/RPD)
            # - 无需付费信息
            
            print("   💡 建议: 在Gemini AI Studio查看详细配额")
            print("   🔗 https://aistudio.google.com/app/apikey")
            
        except Exception as e:
            print(f"   ⚠️  无法获取配额详情: {e}")
        
        return {
            'status': 'success',
            'lite_available': True,
            'flash_available': True,
            'lite_speed': lite_time,
            'flash_speed': flash_time
        }
        
    except Exception as e:
        error_msg = str(e)
        print(f"\n❌ 测试失败!")
        print(f"   错误: {error_msg}")
        
        # 分析错误类型
        if '400' in error_msg or 'invalid' in error_msg.lower():
            print("   原因: API Key无效或格式错误")
            status = 'invalid_key'
        elif '403' in error_msg or 'permission' in error_msg.lower():
            print("   原因: 权限不足或API未启用")
            status = 'permission_denied'
        elif '429' in error_msg or 'quota' in error_msg.lower():
            print("   原因: 配额已用尽或速率限制")
            status = 'quota_exceeded'
        else:
            print("   原因: 未知错误")
            status = 'unknown_error'
        
        return {
            'status': status,
            'error': error_msg
        }

def main():
    """主函数"""
    print("🚀 开始批量测试Gemini API Keys")
    print(f"📅 测试时间: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {}
    
    for key_name, api_key in TEST_KEYS.items():
        result = test_key(key_name, api_key)
        results[key_name] = result
        time.sleep(2)  # 避免速率限制
    
    # 汇总结果
    print("\n" + "="*60)
    print("📊 测试结果汇总")
    print("="*60)
    
    available_keys = []
    
    for key_name, result in results.items():
        print(f"\n🔑 {key_name}:")
        if result['status'] == 'success':
            print(f"   ✅ 可用")
            print(f"   📊 flash-lite: {result['lite_speed']:.2f}秒")
            print(f"   📊 flash: {result['flash_speed']:.2f}秒")
            available_keys.append(key_name)
        else:
            print(f"   ❌ 不可用")
            print(f"   状态: {result['status']}")
    
    print("\n" + "="*60)
    print(f"✅ 可用Keys: {len(available_keys)}/{len(TEST_KEYS)}")
    print(f"📝 可用列表: {', '.join(available_keys)}")
    print("="*60)
    
    # Doppler配置建议
    print("\n📝 Doppler配置建议:")
    print("="*60)
    
    if available_keys:
        for i, key_name in enumerate(available_keys, 1):
            key_value = TEST_KEYS[key_name]
            print(f"\nGEMINI_KEY_{i}={key_value}")
            if i == 1:
                print(f"GEMINI_KEY_PRIMARY={key_value}  # 主Key")
            elif i == 2:
                print(f"GEMINI_KEY_BACKUP={key_value}   # 备用Key")
            else:
                print(f"GEMINI_KEY_RESERVE_{i-2}={key_value}  # 储备Key")
    
    print("\n🗑️  删除不可用的Keys:")
    unavailable = [k for k in TEST_KEYS.keys() if k not in available_keys]
    if unavailable:
        for key_name in unavailable:
            print(f"   ❌ 删除 {key_name}")
    else:
        print("   ✅ 所有Keys都可用!")

if __name__ == "__main__":
    main()
