#!/usr/bin/env python3
"""
PM2監控腳本 - 實時顯示3個容器的蒸餾狀態
"""

import json
import time
import psutil
import subprocess
from pathlib import Path
from datetime import datetime

CHECKPOINT_DIR = Path('/app/checkpoints')
EXCHANGE_RATE = 35.5

def get_container_stats(container_name):
    """獲取容器統計信息"""
    try:
        result = subprocess.run(
            ['docker', 'stats', container_name, '--no-stream', '--format', '{{json .}}'],
            capture_output=True,
            text=True
        )
        if result.returncode == 0:
            return json.loads(result.stdout)
    except:
        pass
    return None

def load_checkpoint(wave_id):
    """加載檢查點數據"""
    checkpoint_file = CHECKPOINT_DIR / f'wave{wave_id}.json'
    if checkpoint_file.exists():
        with open(checkpoint_file, 'r') as f:
            return json.load(f)
    return None

def display_dashboard():
    """顯示監控面板"""
    while True:
        # 清屏
        print('\033[2J\033[H')
        
        print("╔══════════════════════════════════════════════════════════════════╗")
        print("║       🔥 Digital Assets Distiller V2.0 - 實時監控面板           ║")
        print("╚══════════════════════════════════════════════════════════════════╝")
        print(f"\n⏰ {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n")
        
        total_cost = 0
        total_docs = 0
        
        for wave_id in [1, 2, 3]:
            checkpoint = load_checkpoint(wave_id)
            container_name = f'distiller-wave{wave_id}'
            stats = get_container_stats(container_name)
            
            print(f"┌─ Wave {wave_id} ──────────────────────────────────────────┐")
            
            if checkpoint:
                cost = checkpoint.get('total_cost_usd', 0)
                docs = checkpoint.get('processed_docs', 0)
                in_tokens = checkpoint.get('input_tokens', 0)
                out_tokens = checkpoint.get('output_tokens', 0)
                
                total_cost += cost
                total_docs += docs
                
                print(f"│ 📊 進度: {docs} 文檔")
                print(f"│ 💰 成本: ${cost:.4f} USD (฿{cost * EXCHANGE_RATE:.2f} THB)")
                print(f"│ 📈 Tokens: {in_tokens:,} in / {out_tokens:,} out")
            else:
                print(f"│ ⏸️  等待啟動...")
            
            if stats:
                print(f"│ 🐳 容器: {stats.get('CPUPerc', 'N/A')} CPU / {stats.get('MemUsage', 'N/A')}")
            else:
                print(f"│ 🐳 容器: 未運行")
            
            print(f"└────────────────────────────────────────────────────┘\n")
        
        # 總計
        print("╔════════════════════════════════════════════════════════╗")
        print(f"║ 🎯 總計")
        print(f"║   📊 總處理: {total_docs} 文檔")
        print(f"║   💰 總成本: ${total_cost:.4f} USD (฿{total_cost * EXCHANGE_RATE:.2f} THB)")
        print(f"║   📈 預算: ${total_cost:.2f} / $30.00 ({total_cost/30*100:.1f}%)")
        print("╚════════════════════════════════════════════════════════╝")
        
        # 系統資源
        cpu = psutil.cpu_percent()
        mem = psutil.virtual_memory()
        print(f"\n💻 系統: CPU {cpu}% | 內存 {mem.percent}% ({mem.used//1024//1024}MB/{mem.total//1024//1024}MB)")
        
        time.sleep(5)

if __name__ == '__main__':
    try:
        display_dashboard()
    except KeyboardInterrupt:
        print("\n\n👋 監控已停止")
