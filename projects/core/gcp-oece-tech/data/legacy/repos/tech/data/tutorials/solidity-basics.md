# Solidity 智能合約基礎

## 課程簡介

歡迎來到 Solidity 智能合約開發課程！本課程將帶你從零開始，深入學習 Solidity 編程語言。

## 什麼是 Solidity？

Solidity 是一種**面向對象**的高級編程語言，專門用於在以太坊虛擬機（EVM）上編寫智能合約。

### 主要特點

- 📝 **靜態類型** - 在編譯時檢查類型
- 🔐 **安全性優先** - 內置安全特性
- ⛓️ **區塊鏈原生** - 專為區塊鏈設計
- 🚀 **高性能** - 編譯為字節碼執行

## 第一個智能合約

讓我們創建一個簡單的 "Hello World" 合約：

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HelloWorld {
    string public message;
    
    constructor() {
        message = "Hello, Web3!";
    }
    
    function setMessage(string memory newMessage) public {
        message = newMessage;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
}
```

### 代碼解析

1. **License 標識符**: 指定開源許可證
2. **Pragma 指令**: 指定 Solidity 版本
3. **合約聲明**: 使用 `contract` 關鍵字
4. **狀態變量**: `message` 存儲在區塊鏈上
5. **構造函數**: 部署時執行一次
6. **函數**: 修改和讀取狀態

## 數據類型

### 值類型

```solidity
// 布爾型
bool public isActive = true;

// 整數型
uint256 public count = 100;
int256 public temperature = -10;

// 地址型
address public owner = 0x1234...;
```

## 總結

恭喜！你已經掌握了 Solidity 的基礎知識。繼續學習更高級的主題吧！🚀
