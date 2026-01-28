#!/usr/bin/env python3
"""
🔥 Digital Assets Distiller V2.0 - 核心蒸餾引擎
數字黃金提煉器 - Gemini 3 Pro驅動
"""

import os
import json
import time
import hashlib
from pathlib import Path
from datetime import datetime
import google.generativeai as genai
from tqdm import tqdm
import sys

# 配置
API_KEY = os.getenv('API_KEY')
WAVE_ID = os.getenv('WAVE_ID', '1')
MODEL_NAME = os.getenv('MODEL_NAME', 'gemini-3-pro-preview')
BUDGET_LIMIT = float(os.getenv('BUDGET_LIMIT', '10'))
EXCHANGE_RATE = 35.5  # THB/USD

# 目錄設置
INPUT_DIR = Path('/app/input')
OUTPUT_DIR = Path('/app/output')
CHECKPOINT_FILE = Path(f'/app/checkpoints/wave{WAVE_ID}.json')

class DigitalAssetsDistiller:
    def __init__(self):
        if not API_KEY:
            raise ValueError("❌ API_KEY環境變量未設置！")
        
        genai.configure(api_key=API_KEY)
        self.model = genai.GenerativeModel(MODEL_NAME)
        
        self.total_cost_usd = 0
        self.input_tokens = 0
        self.output_tokens = 0
        self.processed_docs = 0
        
        # 加載檢查點
        self.checkpoint = self.load_checkpoint()
        
        print(f"\n🔥 啟動數字黃金蒸餾器 - Wave {WAVE_ID}")
        print(f"💎 模型: {MODEL_NAME}")
        print(f"💰 預算: ${BUDGET_LIMIT} USD (฿{BUDGET_LIMIT * EXCHANGE_RATE:.0f} THB)")
        print(f"📂 輸入: {INPUT_DIR}")
        print(f"📂 輸出: {OUTPUT_DIR}\n")
    
    def load_checkpoint(self):
        """加載檢查點"""
        if CHECKPOINT_FILE.exists():
            with open(CHECKPOINT_FILE, 'r') as f:
                data = json.load(f)
                self.total_cost_usd = data.get('total_cost_usd', 0)
                self.input_tokens = data.get('input_tokens', 0)
                self.output_tokens = data.get('output_tokens', 0)
                self.processed_docs = data.get('processed_docs', 0)
                print(f"📍 從檢查點恢復: 已處理 {self.processed_docs} 個文檔")
                return data.get('processed_files', [])
        return []
    
    def save_checkpoint(self):
        """保存檢查點"""
        CHECKPOINT_FILE.parent.mkdir(parents=True, exist_ok=True)
        checkpoint_data = {
            'wave_id': WAVE_ID,
            'processed_files': self.checkpoint,
            'total_cost_usd': self.total_cost_usd,
            'input_tokens': self.input_tokens,
            'output_tokens': self.output_tokens,
            'processed_docs': self.processed_docs,
            'timestamp': datetime.now().isoformat()
        }
        with open(CHECKPOINT_FILE, 'w') as f:
            json.dump(checkpoint_data, f, indent=2)
    
    def get_file_hash(self, filepath):
        """計算文件哈希"""
        with open(filepath, 'rb') as f:
            return hashlib.md5(f.read()).hexdigest()
    
    def estimate_cost(self, input_text, output_text):
        """估算成本（基於Gemini定價）"""
        # Gemini Pro定價（估算）：輸入$0.0005/1K tokens，輸出$0.0015/1K tokens
        input_tokens = len(input_text) // 4
        output_tokens = len(output_text) // 4
        
        cost = (input_tokens / 1000 * 0.0005) + (output_tokens / 1000 * 0.0015)
        
        self.input_tokens += input_tokens
        self.output_tokens += output_tokens
        self.total_cost_usd += cost
        
        return cost, input_tokens, output_tokens
    
    def distill_document(self, doc_path):
        """蒸餾單個文檔 - 4階段提煉"""
        try:
            with open(doc_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            doc_name = doc_path.name
            
            # 階段1: 去重分析
            stage1_prompt = f"""
            你是數字資產蒸餾大師。分析這份珍貴的數字黃金文檔，判斷其獨特價值：
            
            文檔: {doc_name}
            內容: {content[:3000]}
            
            請評估：
            1. 這份文檔的核心價值是什麼？
            2. 是否包含獨特見解或罕見知識？
            3. 給出價值評分（0-10分）
            """
            
            response1 = self.model.generate_content(
                stage1_prompt,
                generation_config={'temperature': 0.7}
            )
            value_analysis = response1.text
            
            # 如果價值低於5分，跳過
            if '評分' in value_analysis or '分數' in value_analysis:
                try:
                    score = float([s for s in value_analysis.split() if s.isdigit()][0])
                    if score < 5:
                        print(f"⏭️  跳過低價值文檔: {doc_name} (評分: {score})")
                        return None
                except:
                    pass
            
            # 階段2: 精華提取
            stage2_prompt = f"""
            提取這份數字黃金的核心精華：
            
            {content}
            
            請提取：
            - 關鍵知識點
            - 實用技巧
            - 珍貴經驗
            - 獨特見解
            """
            
            response2 = self.model.generate_content(
                stage2_prompt,
                generation_config={'temperature': 0.3}
            )
            essence = response2.text
            
            # 階段3: 邏輯整合
            stage3_prompt = f"""
            將提取的精華進行結構化整理：
            
            {essence}
            
            輸出格式化的Markdown文檔。
            """
            
            response3 = self.model.generate_content(
                stage3_prompt,
                generation_config={'temperature': 0.3}
            )
            structured = response3.text
            
            # 階段4: 創意擴展
            stage4_prompt = f"""
            基於這些珍貴知識，生成創新性擴展：
            
            {structured}
            
            添加：
            - 實踐建議
            - 最佳實踐
            - 潛在應用場景
            """
            
            response4 = self.model.generate_content(
                stage4_prompt,
                generation_config={'temperature': 0.9}
            )
            final = response4.text
            
            # 計算成本
            total_input = stage1_prompt + stage2_prompt + stage3_prompt + stage4_prompt
            total_output = value_analysis + essence + structured + final
            cost, in_tokens, out_tokens = self.estimate_cost(total_input, total_output)
            
            # 保存結果
            output_file = OUTPUT_DIR / f"distilled_{doc_name}"
            output_file.parent.mkdir(parents=True, exist_ok=True)
            
            with open(output_file, 'w', encoding='utf-8') as f:
                f.write(f"# 蒸餾報告: {doc_name}\n\n")
                f.write(f"## 價值分析\n{value_analysis}\n\n")
                f.write(f"## 精華提取\n{essence}\n\n")
                f.write(f"## 結構化內容\n{structured}\n\n")
                f.write(f"## 創意擴展\n{final}\n\n")
                f.write(f"\n---\n")
                f.write(f"💰 成本: ${cost:.4f} USD (฿{cost * EXCHANGE_RATE:.2f} THB)\n")
                f.write(f"📊 Tokens: {in_tokens} in / {out_tokens} out\n")
            
            return {
                'file': doc_name,
                'cost_usd': cost,
                'tokens': {'input': in_tokens, 'output': out_tokens}
            }
            
        except Exception as e:
            print(f"❌ 蒸餾失敗: {doc_name} - {e}")
            return None
    
    def run(self):
        """運行蒸餾流程"""
        # 獲取所有待處理文檔
        docs = list(INPUT_DIR.glob('**/*.md'))
        docs = [d for d in docs if self.get_file_hash(d) not in self.checkpoint]
        
        print(f"📚 找到 {len(docs)} 個待蒸餾文檔\n")
        
        with tqdm(total=len(docs), desc=f"Wave {WAVE_ID} 蒸餾中") as pbar:
            for doc in docs:
                # 檢查預算
                if self.total_cost_usd >= BUDGET_LIMIT:
                    print(f"\n💰 達到預算上限 ${BUDGET_LIMIT}，暫停蒸餾")
                    break
                
                result = self.distill_document(doc)
                
                if result:
                    self.processed_docs += 1
                    self.checkpoint.append(self.get_file_hash(doc))
                    self.save_checkpoint()
                    
                    pbar.set_postfix({
                        'cost': f'${self.total_cost_usd:.2f}',
                        'docs': self.processed_docs
                    })
                
                pbar.update(1)
                time.sleep(1)  # 避免API限流
        
        # 最終報告
        print(f"\n✅ Wave {WAVE_ID} 蒸餾完成！")
        print(f"📊 處理文檔: {self.processed_docs}")
        print(f"💰 總成本: ${self.total_cost_usd:.4f} USD (฿{self.total_cost_usd * EXCHANGE_RATE:.2f} THB)")
        print(f"📈 Tokens: {self.input_tokens} in / {self.output_tokens} out\n")

if __name__ == '__main__':
    distiller = DigitalAssetsDistiller()
    distiller.run()
