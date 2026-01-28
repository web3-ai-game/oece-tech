#!/usr/bin/env python3
"""
🏆 數字資產蒸餾器 V2 - Gemini 2.5 Pro
💎 Digital Gold Distiller - 4-Stage AI Processing
"""
import os, json, time
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
import google.generativeai as genai
from datetime import datetime

# === 配置 ===
USD_TO_THB = 35.5
FUSE_LIMIT_USD = 10
FUSE_LIMIT_THB = FUSE_LIMIT_USD * USD_TO_THB

# Gemini 2.5 Pro 定價 (USD per 1M tokens)
PRICING = {
    'input_per_1k': 0.05,    # $0.05 per 1K input
    'output_per_1k': 0.15,   # $0.15 per 1K output
}

# 收費 Keys - Gemini 2.5 Pro
PAID_KEYS = [
    os.getenv('GEMINI_PAID_KEY_1', 'AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4'),
    os.getenv('GEMINI_PAID_KEY_2', 'AIzaSyAj08QZ4B8CMU_CTG-QtGUEv0gBHZbM_cQ'),
    os.getenv('GEMINI_PAID_KEY_3', 'AQ.Ab8RN6LioS7k0Ipycl6oKXFuhww6VTXuosXwgeS8VMpTyZUFcw'),
]

# 容器編號 (環境變量)
API_KEY_INDEX = int(os.getenv('API_KEY_INDEX', 0))
key_idx = API_KEY_INDEX

class DigitalGoldDistiller:
    def __init__(self, docs_dir, container_id=0):
        self.container_id = container_id
        self.docs = list(Path(docs_dir).rglob('*.md'))
        self.stats = {
            'start_time': time.time(),
            'container_id': container_id,
            'processed': 0,
            'total': len(self.docs),
            'tokens_input': 0,
            'tokens_output': 0,
            'cost_usd': 0,
            'cost_thb': 0
        }
        self.load_checkpoint()

    def load_checkpoint(self):
        """載入檢查點"""
        checkpoint_file = f'checkpoint_container_{self.container_id}.json'
        try:
            with open(checkpoint_file, 'r') as f:
                chk = json.load(f)
                self.stats.update(chk)
                print(f"📍 容器 {self.container_id} 從檢查點恢復")
                print(f"   已處理: {self.stats['processed']}/{self.stats['total']}")
                print(f"   已消耗: ${self.stats['cost_usd']:.4f} (฿{self.stats['cost_thb']:.2f})\n")
        except:
            print(f"🆕 容器 {self.container_id} 開始新任務\n")

    def save_checkpoint(self):
        """保存檢查點"""
        checkpoint_file = f'checkpoint_container_{self.container_id}.json'
        with open(checkpoint_file, 'w') as f:
            json.dump(self.stats, f, indent=2)

    def get_model(self, temperature=0.7):
        """獲取 Gemini 2.5 Pro 模型"""
        global key_idx
        api_key = PAID_KEYS[key_idx % len(PAID_KEYS)]
        key_idx += 1
        genai.configure(api_key=api_key)
        return genai.GenerativeModel(
            'gemini-2.5-pro',  # Gemini 2.5 Pro 穩定版
            generation_config={
                'temperature': temperature,
                'max_output_tokens': 500
            }
        )

    def estimate_tokens(self, text):
        """估算 token 數量"""
        return len(text) // 4

    def check_fuse(self):
        """檢查熔斷"""
        if self.stats['cost_usd'] >= FUSE_LIMIT_USD:
            print(f"\n{'='*70}")
            print(f"🔴 容器 {self.container_id} 熔斷觸發！")
            print(f"💰 成本: ${self.stats['cost_usd']:.4f} (฿{self.stats['cost_thb']:.2f})")
            print(f"📍 進度: {self.stats['processed']}/{self.stats['total']}")
            print(f"{'='*70}")
            self.save_checkpoint()
            return True
        return False

    def process_stage1_dedup(self, doc):
        """階段1: 去重 (溫度 0.5)"""
        try:
            model = self.get_model(temperature=0.5)
            content = doc.read_text(errors='ignore')[:1500]

            prompt = f"""分析文檔去重價值（這是珍貴的數字黃金！）:
檔名: {doc.name}
內容: {content}

返回JSON: {{"is_unique": true/false, "duplicate_of": "", "uniqueness_score": 0-10}}"""

            input_tokens = self.estimate_tokens(prompt)
            response = model.generate_content(prompt)
            output_tokens = self.estimate_tokens(response.text)

            # 更新統計
            self.stats['tokens_input'] += input_tokens
            self.stats['tokens_output'] += output_tokens
            self.stats['cost_usd'] = (
                (self.stats['tokens_input'] / 1000) * PRICING['input_per_1k'] +
                (self.stats['tokens_output'] / 1000) * PRICING['output_per_1k']
            )
            self.stats['cost_thb'] = self.stats['cost_usd'] * USD_TO_THB
            self.stats['processed'] += 1

            result = json.loads(response.text.strip().replace('```json','').replace('```',''))
            result['file'] = doc.name
            result['container_id'] = self.container_id

            print(f"✓ [容器{self.container_id}] [{self.stats['processed']}/{self.stats['total']}] {doc.name[:35]:35} | 獨特性: {result.get('uniqueness_score', 0)}/10 | ${self.stats['cost_usd']:.4f}")

            # 每 5 個保存
            if self.stats['processed'] % 5 == 0:
                self.save_checkpoint()

            return result

        except Exception as e:
            error = str(e)[:60]
            print(f"✗ [容器{self.container_id}] {doc.name[:35]:35} | {error}")
            return {'file': doc.name, 'error': error, 'container_id': self.container_id}

    def run_stage1(self, max_workers=1):
        """運行階段1: 去重"""
        print(f"{'='*70}")
        print(f"🏆 容器 {self.container_id} - 數字資產蒸餾器 V2")
        print(f"{'='*70}")
        print(f"💎 模型: Gemini 2.5 Pro")
        print(f"📊 文檔: {len(self.docs)} 個")
        print(f"💰 預算: ${FUSE_LIMIT_USD} USD (฿{FUSE_LIMIT_THB} THB)")
        print(f"🧵 並發: {max_workers}")
        print(f"{'='*70}\n")

        results = []
        with ThreadPoolExecutor(max_workers=max_workers) as executor:
            # 分配文檔給容器
            container_docs = [d for i, d in enumerate(self.docs) if i % 3 == self.container_id]

            futures = {executor.submit(self.process_stage1_dedup, doc): doc for doc in container_docs}

            for future in as_completed(futures):
                if self.check_fuse():
                    for f in futures:
                        f.cancel()
                    break
                results.append(future.result())

        # 保存結果
        output_file = Path(f'distilled_stage1_container_{self.container_id}.json')
        output_file.write_text(json.dumps(results, ensure_ascii=False, indent=2))

        success = len([r for r in results if 'error' not in r])

        print(f"\n{'='*70}")
        print(f"✅ 容器 {self.container_id} 階段1 完成！")
        print(f"📊 成功: {success}/{len(results)}")
        print(f"💰 成本: ${self.stats['cost_usd']:.4f} (฿{self.stats['cost_thb']:.2f})")
        print(f"💾 輸出: {output_file}")
        print(f"{'='*70}\n")

        self.save_checkpoint()
        return results

if __name__ == '__main__':
    distiller = DigitalGoldDistiller(
        'organized_docs',
        container_id=API_KEY_INDEX
    )
    distiller.run_stage1(max_workers=1)
