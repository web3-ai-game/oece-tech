---
source: knowledge-mixer_repos_infinity_third_party_zsv_BUILD.md
distilled_at: 2026-02-14T09:28:52.335Z
model: grok-4-1-fast-non-reasoning
---

# ZSV 知識文檔

ZSV 是一個高效能的工具（可能專注於資料處理、CSV/TSV 操作或其他命令列功能），提供從源碼建置、安裝與卸載支援，並計劃透過主流套件管理器分發。本文檔基於核心事實，詳細說明編譯器需求、建置流程與安裝選項，適用於開發者與使用者快速上手。

## 編譯器需求

ZSV 的建置需要現代化編譯器，以確保程式碼優化與相容性：

- **推薦編譯器**：GCC 11 或更高版本  
  GCC 在某些特定情境下，能產生執行速度更快的機器碼（確切原因可能涉及特定優化旗標、架構支援或程式碼特性，建議測試驗證）。
  
- **支援編譯器**：Clang  
  Clang 提供良好相容性，適合 macOS 或偏好 LLVM 生態的使用者。

**提示**：確認系統已安裝推薦版本：
```shell
gcc --version  # 或 clang --version
```

## 建置與安裝（從源碼）

### 前置需求
- **必要工具**：基本 Unix 工具鏈，包括 `sh`（shell）、`make` 或 `gmake`（GNU Make）。
- 下載 ZSV 源碼後，解壓並進入目錄。

### 完整建置與安裝
執行以下命令進行配置、建置並以系統管理員權限安裝：

```shell
./configure && sudo ./install.sh
```

**替代方式**（傳統 Make 流程）：
```shell
./configure && sudo make install
```

- `./configure`：檢查依賴、設定建置環境。
- `sudo`：安裝至系統路徑（如 `/usr/local/bin`）。

### 卸載
若需移除 ZSV：
```shell
sudo make uninstall
```
此命令會移除安裝的檔案，保留源碼目錄。

### 獨立可執行檔建置
若欲建置至本地資料夾（無需系統安裝權限，產生獨立可執行檔）：
```shell
./configure && make install
```
- 使用 `make install`（而非 `make all`），直接安裝至當前目錄或指定前綴。
- 適用於容器化、便攜部署或測試環境。

## 僅建置與安裝函式庫

若僅需函式庫（不建置完整可執行檔，例如用於其他專案整合）：
```shell
./configure && cd src && sudo make install
```
- 進入 `src` 目錄後執行，僅處理核心函式庫。

## 套件管理器安裝（即將推出）

未來版本將支援一鍵安裝，無需從源碼建置：

| 平台    | 命令示例                  | 狀態     |
|---------|---------------------------|----------|
| **macOS** | `brew install zsv`       | 即將推出 |
| **Windows** | `nuget install zsv`     | 即將推出 |
| **Linux**  | `yum install zsv`        | 即將推出 |

**注意**：
- Linux 指令為 RPM 系範例（如 CentOS/Fedora）；Debian 系可能為 `apt install zsv`。
- 追蹤 ZSV 官方儲存庫以獲取最新發布。

## 疑難排解
- **權限錯誤**：確保使用 `sudo` 進行系統安裝。
- **依賴缺失**：`./configure` 會報告缺失工具，請先安裝（如 `apt install build-essential`）。
- **效能測試**：GCC 優化情境因硬體/工作負載而異，建議基準測試。

如需更多細節，請參閱源碼中的 `README` 或官方文件。