#!/usr/bin/env python3
"""
🏯 諸葛亮·賽博蒸餾塔 V2.0 ULTIMATE
代號: PROJECT_GOLDEN_ALCHEMY
核心: Gemini 3.0 Pro Deep Thinking × 4 Key 併發矩陣
"""

import os
import json
import time
import hashlib
from pathlib import Path
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor, as_completed
import google.generativeai as genai
from tqdm import tqdm

# 🔥 4個收費Key矩陣 - 全火力覆蓋
GEMINI_KEYS = [
    "AIzaSyA3ikY04T94AoAwndr20QxV9nl4w_NF_u4",
    "AIzaSyAj08QZ4B8CMU_CTG-QtGUEv0gBHZbM_cQ", 
    "AQ.Ab8RN6LioS7k0Ipycl6oKXFuhww6VTXuosXwgeS8VMpTyZUFcw",
    "AQ.Ab8RN6LlrNEKtXonwqhBKhVRziaoBgHiUwE6CpdSv5Ttil4JgA"
]

# 配置
MODEL_NAME = 'gemini-3-pro-preview'  # 💎 深度思考模式
BUDGET_LIMIT = 10.0  # USD per key
EXCHANGE_RATE = 35.5  # THB/USD
MAX_WORKERS = 4  # 4個容器併發

# 目錄
INPUT_DIR = Path(os.getenv('INPUT_DIR', './input'))
OUTPUT_DIR = Path(os.getenv('OUTPUT_DIR', './output'))
CHECKPOINT_DIR = Path('./checkpoints')

class ZhugeDistillationTower:
    """諸葛亮·賽博蒸餾塔"""
    
    def __init__(self):
        self.models = []
        self.costs = [0.0] * len(GEMINI_KEYS)
        self.processed = 0
        self.total_tokens = {'input': 0, 'output': 0}
        
        # 初始化4個模型實例
        for idx, key in enumerate(GEMINI_KEYS):
            genai.configure(api_key=key)
            model = genai.GenerativeModel(MODEL_NAME)
            self.models.append({
                'id': idx + 1,
                'model': model,
                'cost': 0.0,
                'docs': 0
            })
        
        self.checkpoint = self.load_checkpoint()
        
        print("\n╔══════════════════════════════════════════════════════════════════╗")
        print("║       🏯 諸葛亮·賽博蒸餾塔 V2.0 ULTIMATE                        ║")
        print("║          PROJECT_GOLDEN_ALCHEMY                                 ║")
        print("╚══════════════════════════════════════════════════════════════════╝")
        print(f"\n💎 模型: {MODEL_NAME}")
        print(f"🔥 火力: {len(GEMINI_KEYS)} Keys × 併發矩陣")
        print(f"💰 預算: ${BUDGET_LIMIT} USD × {len(GEMINI_KEYS)} = ${BUDGET_LIMIT * len(GEMINI_KEYS)} (฿{BUDGET_LIMIT * len(GEMINI_KEYS) * EXCHANGE_RATE:.0f} THB)")
        print(f"📂 輸入: {INPUT_DIR}")
        print(f"📂 輸出: {OUTPUT_DIR}\n")
    
    def load_checkpoint(self):
        """加載檢查點"""
        checkpoint_file = CHECKPOINT_DIR / 'master_checkpoint.json'
        if checkpoint_file.exists():
            with open(checkpoint_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                self.processed = data.get('processed_docs', 0)
                print(f"📍 從檢查點恢復: 已處理 {self.processed} 個文檔")
                return set(data.get('processed_hashes', []))
        return set()
    
    def save_checkpoint(self):
        """保存檢查點"""
        CHECKPOINT_DIR.mkdir(parents=True, exist_ok=True)
        checkpoint_file = CHECKPOINT_DIR / 'master_checkpoint.json'
        
        data = {
            'processed_hashes': list(self.checkpoint),
            'processed_docs': self.processed,
            'costs': self.costs,
            'total_tokens': self.total_tokens,
            'timestamp': datetime.now().isoformat()
        }
        
        with open(checkpoint_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
    
    def get_file_hash(self, filepath):
        """計算文件哈希"""
        with open(filepath, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    
    def estimate_cost(self, input_text, output_text, key_idx):
        """估算成本（Gemini Pro定價）"""
        input_tokens = len(input_text) // 4
        output_tokens = len(output_text) // 4
        
        # Gemini Pro: $0.0005/1K in, $0.0015/1K out
        cost = (input_tokens / 1000 * 0.0005) + (output_tokens / 1000 * 0.0015)
        
        self.costs[key_idx] += cost
        self.models[key_idx]['cost'] += cost
        self.total_tokens['input'] += input_tokens
        self.total_tokens['output'] += output_tokens
        
        return cost, input_tokens, output_tokens
    
    def distill_with_deep_thinking(self, doc_path, key_idx):
        """
        🧠 Gemini 3.0 Pro 深度思考 - 4階段蒸餾
        階段1: 低溫去重檢測 (temp=0.3)
        階段2: 精華提取 (temp=0.3)
        階段3: 邏輯重構 (temp=0.5)
        階段4: 創意渲染 (temp=0.8)
        """
        try:
            with open(doc_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            doc_name = doc_path.name
            model_info = self.models[key_idx]
            model = model_info['model']
            
            # 🔍 階段1: 低溫去重檢測 (temperature=0.3)
            stage1_prompt = f"""你是數字資產蒸餾大師。用低溫精確模式分析這份文檔的獨特價值：

文檔: {doc_name}
內容前3000字: {content[:3000]}

請嚴格評估：
1. 核心價值是什麼？（技術深度/實用性/獨特性）
2. 是否包含罕見知識或獨特見解？
3. 與常見文檔的差異化程度？
4. 給出價值評分（0-10分，8分以上才是黃金）

輸出格式：
評分: X/10
理由: [簡潔說明]
"""
            
            response1 = model.generate_content(
                stage1_prompt,
                generation_config={'temperature': 0.3, 'top_p': 0.9}
            )
            value_analysis = response1.text
            
            # 提取評分
            score = 0
            for line in value_analysis.split('\n'):
                if '評分' in line or 'score' in line.lower():
                    try:
                        score = float(''.join(c for c in line if c.isdigit() or c == '.'))
                        break
                    except:
                        pass
            
            # 低於8分跳過（提高門檻）
            if score < 8:
                print(f"⏭️  [Key-{key_idx+1}] 跳過低價值文檔: {doc_name} (評分: {score}/10)")
                return None
            
            print(f"✨ [Key-{key_idx+1}] 發現數字黃金: {doc_name} (評分: {score}/10)")
            
            # 📖 階段2: 精華提取 (temperature=0.3)
            stage2_prompt = f"""提取這份數字黃金的核心精華，保持低溫精確：

完整內容:
{content}

請提取：
- 核心技術要點（具體的代碼/配置/命令）
- 實用技巧和最佳實踐
- 獨特見解和經驗總結
- 關鍵概念和原理

要求：精確、去水分、保留所有技術細節
"""
            
            response2 = model.generate_content(
                stage2_prompt,
                generation_config={'temperature': 0.3, 'top_p': 0.9}
            )
            essence = response2.text
            
            # 🏗️ 階段3: 邏輯重構 (temperature=0.5)
            stage3_prompt = f"""將提取的精華進行結構化重構，平衡邏輯與可讀性：

提取的精華:
{essence}

重構要求：
1. 使用清晰的Markdown結構
2. 按邏輯層次組織（概念→實現→實踐）
3. 保留所有技術細節
4. 添加合適的代碼塊和示例
5. 使用emoji增強可讀性

輸出完整的重構文檔。
"""
            
            response3 = model.generate_content(
                stage3_prompt,
                generation_config={'temperature': 0.5, 'top_p': 0.95}
            )
            structured = response3.text
            
            # 🎨 階段4: 創意渲染 (temperature=0.8)
            stage4_prompt = f"""基於重構的知識，進行創意性擴展和實踐建議：

重構後的文檔:
{structured}

創意擴展：
1. 實際應用場景（3-5個具體案例）
2. 進階實踐建議（如何深入掌握）
3. 常見陷阱與解決方案
4. 與其他技術的協同使用
5. 未來發展方向

保持創意但要實用，不要空泛。
"""
            
            response4 = model.generate_content(
                stage4_prompt,
                generation_config={'temperature': 0.8, 'top_p': 0.95}
            )
            creative = response4.text
            
            # 💰 計算成本
            total_input = stage1_prompt + stage2_prompt + stage3_prompt + stage4_prompt
            total_output = value_analysis + essence + structured + creative
            cost, in_tok, out_tok = self.estimate_cost(total_input, total_output, key_idx)
            
            # 💾 保存蒸餾結果
            output_file = OUTPUT_DIR / f"distilled_{doc_name}"
            OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(f"# 🏯 諸葛蒸餾報告: {doc_name}\n\n")
                f.write(f"> 蒸餾時間: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
                f.write(f"> 執行容器: Key-{key_idx+1}\n")
                f.write(f"> 價值評分: {score}/10 ⭐\n\n")
                f.write(f"---\n\n")
                f.write(f"## 🔍 階段1: 低溫去重檢測\n\n{value_analysis}\n\n")
                f.write(f"---\n\n")
                f.write(f"## 📖 階段2: 精華提取\n\n{essence}\n\n")
                f.write(f"---\n\n")
                f.write(f"## 🏗️ 階段3: 邏輯重構\n\n{structured}\n\n")
                f.write(f"---\n\n")
                f.write(f"## 🎨 階段4: 創意渲染\n\n{creative}\n\n")
                f.write(f"---\n\n")
                f.write(f"## 📊 蒸餾元數據\n\n")
                f.write(f"- 💰 成本: ${cost:.4f} USD (฿{cost * EXCHANGE_RATE:.2f} THB)\n")
                f.write(f"- 📈 Tokens: {in_tok:,} in / {out_tok:,} out\n")
                f.write(f"- 🔥 執行Key: Key-{key_idx+1}\n")
                f.write(f"- ⏱️ 蒸餾時間: {datetime.now().isoformat()}\n")
            
            model_info['docs'] += 1
            
            return {
                'file': doc_name,
                'score': score,
                'cost': cost,
                'key': key_idx + 1
            }
            
        except Exception as e:
            print(f"❌ [Key-{key_idx+1}] 蒸餾失敗: {doc_path.name} - {e}")
            return None
    
    def run_concurrent_distillation(self):
        """並發蒸餾主流程"""
        # 獲取所有待處理文檔
        all_docs = list(INPUT_DIR.glob('**/*.md'))
        all_docs = [d for d in all_docs if self.get_file_hash(d) not in self.checkpoint]
        
        if not all_docs:
            print("📭 沒有待處理文檔")
            return
        
        print(f"📚 找到 {len(all_docs)} 個待蒸餾文檔")
        print(f"🔥 啟動 {MAX_WORKERS} 個併發容器...\n")
        
        results = []
        
        with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
            # 提交所有任務
            futures = {}
            for idx, doc in enumerate(all_docs):
                key_idx = idx % len(GEMINI_KEYS)  # 輪詢分配key
                
                # 檢查該key是否超預算
                if self.costs[key_idx] >= BUDGET_LIMIT:
                    print(f"⚠️  Key-{key_idx+1} 已達預算上限，跳過")
                    continue
                
                future = executor.submit(self.distill_with_deep_thinking, doc, key_idx)
                futures[future] = (doc, key_idx)
            
            # 進度條
            with tqdm(total=len(futures), desc="🏯 蒸餾進度") as pbar:
                for future in as_completed(futures):
                    doc, key_idx = futures[future]
                    
                    try:
                        result = future.result()
                        if result:
                            results.append(result)
                            self.processed += 1
                            self.checkpoint.add(self.get_file_hash(doc))
                            self.save_checkpoint()
                            
                            pbar.set_postfix({
                                'processed': self.processed,
                                'cost': f"${sum(self.costs):.2f}",
                                'last_key': f"K{result['key']}"
                            })
                    except Exception as e:
                        print(f"❌ 任務失敗: {doc.name} - {e}")
                    
                    pbar.update(1)
                    time.sleep(0.5)  # 防止API限流
        
        # 最終報告
        self.print_final_report(results)
    
    def print_final_report(self, results):
        """打印最終報告"""
        print("\n╔══════════════════════════════════════════════════════════════════╗")
        print("║            🏯 諸葛亮·賽博蒸餾塔 - 戰報                          ║")
        print("╚══════════════════════════════════════════════════════════════════╝\n")
        
        total_cost = sum(self.costs)
        
        print(f"📊 蒸餾統計:")
        print(f"   ✅ 成功蒸餾: {len(results)} 個數字黃金")
        print(f"   📚 總處理: {self.processed} 文檔")
        print(f"   💰 總成本: ${total_cost:.4f} USD (฿{total_cost * EXCHANGE_RATE:.2f} THB)")
        print(f"   📈 總Tokens: {self.total_tokens['input']:,} in / {self.total_tokens['output']:,} out\n")
        
        print("🔥 各Key戰績:")
        for model in self.models:
            print(f"   Key-{model['id']}: {model['docs']} 文檔 | ${model['cost']:.4f} USD (฿{model['cost'] * EXCHANGE_RATE:.2f} THB)")
        
        # 高分文檔
        high_scores = [r for r in results if r.get('score', 0) >= 9]
        if high_scores:
            print(f"\n💎 極品黃金 (9分以上): {len(high_scores)} 個")
            for r in high_scores[:5]:
                print(f"   ⭐ {r['file']} - {r['score']}/10")
        
        print(f"\n📁 蒸餾結果: {OUTPUT_DIR}")
        print("✅ 諸葛蒸餾塔任務完成！\n")

if __name__ == '__main__':
    tower = ZhugeDistillationTower()
    tower.run_concurrent_distillation()
