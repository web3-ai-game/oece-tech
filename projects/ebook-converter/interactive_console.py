#!/usr/bin/env python3
import sys
import os
import time
import threading
from rich.console import Console
from rich.panel import Panel
from rich.prompt import Prompt

console = Console()

def show_menu():
    console.clear()
    console.print(Panel.fit("📚 電子書煉金術士 - 控制台", style="bold blue"))
    console.print("1. 📊 顯示 PDF 轉錄進度 (懸浮窗口)")
    console.print("2. 🚀 開始處理所有電子書")
    console.print("3. 🔍 掃描並分析 PDF 結構")
    console.print("q. 退出")
    
    return Prompt.ask("請選擇操作", choices=["1", "2", "3", "q"], default="1")

def launch_monitor():
    console.print("[green]正在啟動監控面板...[/]")
    # 這裡調用 monitor_dashboard.py
    os.system("python3 /home/sms/ebook-converter/monitor_dashboard.py")

def main():
    while True:
        choice = show_menu()
        
        if choice == "1":
            launch_monitor()
        elif choice == "2":
            console.print("[yellow]功能開發中...[/]")
            time.sleep(1)
        elif choice == "3":
            console.print("[yellow]功能開發中...[/]")
            time.sleep(1)
        elif choice == "q":
            console.print("再見！")
            sys.exit(0)

if __name__ == "__main__":
    main()
