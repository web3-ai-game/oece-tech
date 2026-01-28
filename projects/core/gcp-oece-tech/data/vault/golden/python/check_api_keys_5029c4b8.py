#!/usr/bin/env python3
"""
API Keys 檢測腳本
檢測各種 AI API Keys 的有效性和餘額
"""

import requests
import json
from datetime import datetime

class KeyChecker:
    def __init__(self):
        self.results = []
    
    def check_openai_key(self, key, name="OpenAI"):
        """檢測 OpenAI/DigitalOcean API Key"""
        try:
            headers = {"Authorization": f"Bearer {key}"}
            # 嘗試列出模型
            response = requests.get(
                "https://api.openai.com/v1/models",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                models = response.json().get('data', [])
                model_names = [m['id'] for m in models[:5]]
                self.results.append({
                    'service': name,
                    'key': f"{key[:10]}...{key[-4:]}",
                    'status': '✅ 有效',
                    'info': f"可用模型: {', '.join(model_names[:3])}...",
                    'full_key': key
                })
            else:
                self.results.append({
                    'service': name,
                    'key': f"{key[:10]}...{key[-4:]}",
                    'status': '❌ 無效',
                    'info': f"錯誤: {response.status_code}",
                    'full_key': key
                })
        except Exception as e:
            self.results.append({
                'service': name,
                'key': f"{key[:10]}...{key[-4:]}",
                'status': '⚠️ 檢測失敗',
                'info': str(e),
                'full_key': key
            })
    
    def check_anthropic_key(self, key, name="Claude"):
        """檢測 Anthropic Claude API Key"""
        try:
            headers = {
                "x-api-key": key,
                "anthropic-version": "2023-06-01",
                "content-type": "application/json"
            }
            
            # 使用最小的測試請求
            payload = {
                "model": "claude-3-haiku-20240307",
                "max_tokens": 1,
                "messages": [{"role": "user", "content": "hi"}]
            }
            
            response = requests.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                self.results.append({
                    'service': name,
                    'key': f"{key[:10]}...{key[-4:]}",
                    'status': '✅ 有效',
                    'info': '可用模型: Claude 3 (Haiku/Sonnet/Opus)',
                    'full_key': key
                })
            elif response.status_code == 401:
                self.results.append({
                    'service': name,
                    'key': f"{key[:10]}...{key[-4:]}",
                    'status': '❌ 無效',
                    'info': '認證失敗',
                    'full_key': key
                })
            elif response.status_code == 429:
                self.results.append({
                    'service': name,
                    'key': f"{key[:10]}...{key[-4:]}",
                    'status': '⚠️ 配額耗盡',
                    'info': '已達到速率限制',
                    'full_key': key
                })
            else:
                self.results.append({
                    'service': name,
                    'key': f"{key[:10]}...{key[-4:]}",
                    'status': '⚠️ 未知',
                    'info': f"HTTP {response.status_code}",
                    'full_key': key
                })
        except Exception as e:
            self.results.append({
                'service': name,
                'key': f"{key[:10]}...{key[-4:]}",
                'status': '⚠️ 檢測失敗',
                'info': str(e),
                'full_key': key
            })
    
    def check_openrouter_key(self, key, name="OpenRouter"):
        """檢測 OpenRouter API Key"""
        try:
            headers = {
                "Authorization": f"Bearer {key}",
                "HTTP-Referer": "https://deepway.me",
                "X-Title": "DeepWay"
            }
            
            # 獲取賬戶信息和餘額
            response = requests.get(
                "https://openrouter.ai/api/v1/auth/key",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json().get('data', {})
                limit = data.get('limit', 0)
                usage = data.get('usage', 0)
                remaining = limit - usage if limit else "無限制"
                
                self.results.append({
                    'service': name,
                    'key': f"{key[:10]}...{key[-4:]}",
                    'status': '✅ 有效',
                    'info': f"餘額: ${remaining}" if isinstance(remaining, (int, float)) else str(remaining),
                    'full_key': key
                })
            else:
                self.results.append({
                    'service': name,
                    'key': f"{key[:10]}...{key[-4:]}",
                    'status': '❌ 無效',
                    'info': f"錯誤: {response.status_code}",
                    'full_key': key
                })
        except Exception as e:
            self.results.append({
                'service': name,
                'key': f"{key[:10]}...{key[-4:]}",
                'status': '⚠️ 檢測失敗',
                'info': str(e),
                'full_key': key
            })
    
    def check_xai_key(self, key, name="xAI (Grok)"):
        """檢測 xAI Grok API Key"""
        try:
            headers = {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json"
            }
            
            # xAI 使用 OpenAI 兼容的 API
            response = requests.get(
                "https://api.x.ai/v1/models",
                headers=headers,
                timeout=10
            )
            
            if response.status_code == 200:
                models = response.json().get('data', [])
                model_names = [m.get('id', 'unknown') for m in models]
                self.results.append({
                    'service': name,
                    'key': f"{key[:10]}...{key[-4:]}",
                    'status': '✅ 有效',
                    'info': f"可用模型: {', '.join(model_names)}",
                    'full_key': key
                })
            else:
                self.results.append({
                    'service': name,
                    'key': f"{key[:10]}...{key[-4:]}",
                    'status': '❌ 無效',
                    'info': f"錯誤: {response.status_code}",
                    'full_key': key
                })
        except Exception as e:
            self.results.append({
                'service': name,
                'key': f"{key[:10]}...{key[-4:]}",
                'status': '⚠️ 檢測失敗',
                'info': str(e),
                'full_key': key
            })
    
    def print_results(self):
        """打印檢測結果"""
        print("\n" + "="*80)
        print("API Keys 檢測結果")
        print("="*80 + "\n")
        
        for result in self.results:
            print(f"服務: {result['service']}")
            print(f"Key:  {result['key']}")
            print(f"狀態: {result['status']}")
            print(f"信息: {result['info']}")
            print("-"*80)
        
        # 統計
        valid = sum(1 for r in self.results if '✅' in r['status'])
        invalid = sum(1 for r in self.results if '❌' in r['status'])
        unknown = sum(1 for r in self.results if '⚠️' in r['status'])
        
        print(f"\n總計: {len(self.results)} 個 Keys")
        print(f"✅ 有效: {valid}")
        print(f"❌ 無效: {invalid}")
        print(f"⚠️ 未知/失敗: {unknown}\n")
    
    def save_valid_keys(self, filename="valid_keys.md"):
        """保存有效的 Keys 到文件"""
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("# 有效 API Keys\n\n")
            f.write(f"檢測時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            
            for result in self.results:
                if '✅' in result['status']:
                    f.write(f"## {result['service']}\n")
                    f.write(f"```bash\n{result['full_key']}\n```\n")
                    f.write(f"**信息**: {result['info']}\n\n")
            
            print(f"✅ 有效 Keys 已保存到: {filename}")

    def check_gemini_key(self, key, name="Google Gemini"):
        """檢測 Google Gemini API Key"""
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models?key={key}"
            response = requests.get(url, timeout=10)
            
            if response.status_code == 200:
                models = response.json().get('models', [])
                model_names = [m.get('name', '').split('/')[-1] for m in models[:5]]
                self.results.append({
                    'service': name,
                    'key': f"{key[:15]}...{key[-4:]}",
                    'status': '✅ 有效',
                    'info': f"可用模型: {', '.join(model_names)}",
                    'full_key': key
                })
            else:
                self.results.append({
                    'service': name,
                    'key': f"{key[:15]}...{key[-4:]}",
                    'status': '❌ 無效',
                    'info': f"錯誤: {response.status_code}",
                    'full_key': key
                })
        except Exception as e:
            self.results.append({
                'service': name,
                'key': f"{key[:15]}...{key[-4:]}",
                'status': '⚠️ 檢測失敗',
                'info': str(e),
                'full_key': key
            })

def main():
    checker = KeyChecker()
    
    print("開始檢測 API Keys...")
    
    # ===== 第二批 Keys (新增) =====
    
    # OpenRouter Keys (新)
    print("\n檢測新的 OpenRouter Keys...")
    checker.check_openrouter_key("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", "OpenRouter (新) #1")
    checker.check_openrouter_key("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", "OpenRouter Olion")
    
    # Claude Keys (新)
    print("檢測新的 Claude Keys...")
    checker.check_anthropic_key("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", "Claude (新)")
    
    # xAI Keys (新)
    print("檢測新的 xAI Keys...")
    checker.check_xai_key("xai-Ti8mrshAwicmmjDuPioggw2LVn0H9dLiMriXMpMHKAJgPgG0slFUW3nfL4dgF3OLtIxby8QhKse073uO", "xAI oicc")
    
    # Gemini Keys (新)
    print("檢測新的 Gemini Keys...")
    checker.check_gemini_key("AIzaSyBDXNZ-n19FGXWwwAQxtYB2H-Cs20bjkeU", "Gemini (新) #1")
    checker.check_gemini_key("AIzaSyDHafPSkd_ScIJo6s7ib-6GUM5ugagCya0", "Gemini (新) #2")
    
    # ===== 第一批 Keys (舊的) =====
    
    # DigitalOcean/OpenAI Compatible Keys
    print("\n檢測舊的 DigitalOcean Keys...")
    checker.check_openai_key("sk-do-9RnWE6NxHNU4LaMlnAq5d3APDk2TUX8HS4jlHlxG3FBAFmm8LBXaStJ2sN", "DigitalOcean")
    
    # Claude/Anthropic Keys
    print("檢測舊的 Claude Keys...")
    checker.check_anthropic_key("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", "Claude (舊)")
    
    # OpenRouter Keys
    print("檢測舊的 OpenRouter Keys...")
    checker.check_openrouter_key("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", "OpenRouter #1")
    checker.check_openrouter_key("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", "OpenRouter #2")
    checker.check_openrouter_key("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", "OpenRouter #3")
    checker.check_openrouter_key("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", "OpenRouter SARS")
    
    # xAI Keys
    print("檢測舊的 xAI (Grok) Keys...")
    checker.check_xai_key("xai-XExmJmEMTOtnKFQLknmK9ipwdfx7gHTU7eHtqYLbWnV1iUWx9KHq7QEEpjazY6Brk6gRtoQwydT33hyY", "xAI Grok")
    
    # 打印結果
    checker.print_results()
    
    # 保存有效的 Keys
    checker.save_valid_keys("/mnt/volume_sgp1_01/deepway-mcp/VALID_API_KEYS.md")
    
    # 識別未知服務
    print("\n" + "="*80)
    print("未知服務識別")
    print("="*80)
    print("\n1. Bootstrap Studio Token:")
    print("   8f219392b930844b363ffa7e3719777a5a0f8218")
    print("   網址: https://bootstrapstudio.io")
    print("   用途: Bootstrap Studio 授權碼/許可證")
    print("   建議: 添加到 Doppler (BOOTSTRAP_STUDIO_LICENSE)")
    
    print("\n2. Kilo Cloud Token:")
    print("   keyG___kWqgwmcns2GZsHn0PJxhf3NjiyZs")
    print("   JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    print("   用途: Kilo (Claude API 代理服務)")
    print("   建議: 添加到 Doppler (KILO_API_KEY + KILO_JWT_TOKEN)")
    
    print("\n3. Blockchair API Key:")
    print("   8f219392b930844b363ffa7e3719777a5a0f8218")
    print("   網址: https://blockchair.com")
    print("   用途: 區塊鏈數據 API")
    print("   建議: 已在 Doppler (BLOCKCHAIR_API_KEY)")
    print("\n")

if __name__ == "__main__":
    main()
