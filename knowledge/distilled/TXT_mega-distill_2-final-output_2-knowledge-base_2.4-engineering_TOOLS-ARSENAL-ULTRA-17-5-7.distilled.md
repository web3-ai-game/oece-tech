---
source: TXT_mega-distill_2-final-output_2-knowledge-base_2.4-engineering_TOOLS-ARSENAL-ULTRA-17-5-7.md
distilled_at: 2026-02-14T09:17:19.022Z
model: grok-4-1-fast-non-reasoning
---

# 🛠️ 工具武器庫 | TOOL ARSENAL

**類別**: 2-knowledge-base/2.4-engineering  
**來源**: docs/05-資源與工具/TOOLS-ARSENAL-ULTRA.md  
**蒸餾者**: grok-4-0709  
**模式**: B  
**部分**: 17  

## 5.7 Telegram Bot 簡單實現

### 介紹
本節介紹如何使用 Python 的 `telebot` 庫快速實現一個 Telegram Bot。這是 **TOOL ARSENAL** 工具武器庫中的基礎自動化組件，適用於訊息處理、命令回應和持續監聽。Telegram Bot 是基於 Telegram Bot API 的輕量級應用，可用於通知、互動介面或自動化任務。透過簡單的輪詢機制（polling），Bot 可以即時回應用戶訊息。

**先決條件**：
- Python 3.6+ 環境
- 安裝 `telebot` 庫：`pip install pyTelegramBotAPI`
- Telegram Bot Token：透過 [@BotFather](https://t.me/BotFather) 創建 Bot 並獲取 Token（格式如 `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`）

### 核心概念
- **Bot Token**：唯一識別你的 Bot，必須保密。
- **消息處理器（Handler）**：使用裝飾器 `@bot.message_handler` 註冊回調函數，根據命令、內容或類型過濾訊息。
- **Polling 模式**：`bot.polling()` 持續從 Telegram 伺服器拉取更新，適合開發和小型部署（無需 webhook）。
- **回覆機制**：`bot.reply_to(message, text)` 直接回應用戶訊息，保留上下文。

### 完整代碼實現
以下是最小可運行範例，處理 `/start` 命令並歡迎用戶：

```python
import telebot

# 初始化 Bot（替換為你的實際 Token）
bot = telebot.TeleBot("your-token-here")

# 處理 /start 命令
@bot.message_handler(commands=['start'])
def send_welcome(message):
    bot.reply_to(message, "Welcome to TOOL ARSENAL Bot! 🚀\n使用 /help 查看更多命令。")

# 啟動 Bot：持續輪詢訊息
if __name__ == "__main__":
    print("TOOL ARSENAL Bot 啟動中...")
    bot.polling(none_stop=True)  # none_stop=True 確保異常後自動重連
```

#### 執行步驟
1. 將 `"your-token-here"` 替換為 BotFather 提供的 Token。
2. 運行腳本：`python your_bot.py`。
3. 在 Telegram 中搜尋你的 Bot，發送 `/start` 即可看到回應。
4. Bot 將持續運行，按 `Ctrl+C` 停止。

### 擴展範例
#### 添加多命令處理
```python
@bot.message_handler(commands=['help'])
def send_help(message):
    help_text = """
🛠️ TOOL ARSENAL Bot 指令：
/start - 歡迎訊息
/help - 此幫助
/status - 系統狀態
    """
    bot.reply_to(message, help_text)

@bot.message_handler(commands=['status'])
def send_status(message):
    bot.reply_to(message, "✅ TOOL ARSENAL 系統正常運行中！")

# 處理純文字訊息（非命令）
@bot.message_handler(func=lambda message: True)
def echo_all(message):
    bot.reply_to(message, f"你說：{message.text}\nTOOL ARSENAL 已收到！")
```

#### 錯誤處理與日誌
```python
import logging
logging.basicConfig(level=logging.INFO)

# 在 polling 前添加
try:
    bot.polling(none_stop=True)
except Exception as e:
    print(f"Bot 錯誤：{e}")
```

### 進階提示
- **非阻塞 Polling**：使用 `bot.infinity_polling()` 支援多線程。
- **Webhook 模式**：生產環境改用 `bot.remove_webhook()` + `bot.set_webhook(url)`，需公網伺服器。
- **安全**：永遠不要硬編碼 Token，使用環境變數：`bot = telebot.TeleBot(os.getenv('BOT_TOKEN'))`。
- **限制**：免費 Bot 每秒最多 30 訊息，群組廣播限 20/分。
- **資源**：官方文件 [pyTelegramBotAPI](https://github.com/eternnoir/pyTelegramBotAPI)，Telegram Bot API [docs](https://core.telegram.org/bots/api)。

此實現是 **TOOL ARSENAL** 的入門模組，可擴展為完整自動化工具（如整合其他 API）。測試後，Bot 即成為你的個人助手！