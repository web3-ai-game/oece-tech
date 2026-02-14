---
source: knowledge-mixer_repos_infinity_python_test_cluster_README.md
distilled_at: 2026-02-14T09:16:10.916Z
model: grok-4-1-fast-non-reasoning
---

# Infinity 叢集測試指南

本文檔提供 Infinity 叢集測試的完整操作指南，包括先決條件安裝、執行全量測試以及特定測試案例的詳細步驟。Infinity 是一個分散式系統，`tools/run_cluster_test.py` 是專用的測試自動化工具，用於驗證叢集功能。

## 先決條件 (Prerequisites)

在執行任何測試前，必須確保系統環境已正確配置：

```bash
sudo apt install bridge-utils
```

**說明**：`bridge-utils` 提供網路橋接功能，是 Infinity 叢集測試的必要依賴，用於模擬叢集節點間的網路通訊。

## 核心概念

- **`tools/run_cluster_test.py`**：Infinity 官方提供的 Python 測試腳本，負責啟動叢集環境、執行測試案例並清理資源。
- **`Infinity`**：被測試的分散式資料庫系統，需要指定：
  - `--infinity_path`：Infinity 可執行檔的絕對路徑（通常位於編譯輸出目錄）。
  - `--infinity_dir`：Infinity 的工作目錄，用於存放資料、配置和日誌（預設為 `/var/infinity`）。
- **測試範圍**：
  - 全量測試：執行所有叢集相關測試案例。
  - 單一測試：透過 `--test_case` 參數指定特定測試函數，提高調試效率。

## 執行全量叢集測試 (Run All Cluster Test Cases)

執行所有叢集測試案例的完整命令：

```bash
python3 tools/run_cluster_test.py --infinity_path=cmake-build-debug/src/infinity --infinity_dir=/var/infinity
```

**執行流程**：
1. 自動建立叢集拓撲（多節點模擬）。
2. 啟動 Infinity 實例。
3. 依序執行所有測試案例。
4. 驗證結果並清理環境。

**預期輸出**：測試摘要報告，包括通過/失敗統計。

## 執行特定測試案例 (Run Specific Test Case)

指定單一測試案例的命令範例：

```bash
python3 tools/run_cluster_test.py --test_case=test_basic.py::test_admin --infinity_path=cmake-build-debug/src/infinity --infinity_dir=/var/infinity
```

### 參數說明

| 參數            | 值                          | 描述                                                                 |
|-----------------|-----------------------------|----------------------------------------------------------------------|
| `--test_case`  | `test_basic.py::test_admin` | 指定測試檔案與測試函數（格式：`檔案名::函數名`），支援精準執行單一案例 |
| `--infinity_path` | `cmake-build-debug/src/infinity` | Infinity 可執行檔路徑（CMake 編譯後的預設位置）                      |
| `--infinity_dir` | `/var/infinity`            | Infinity 工作目錄，存放叢集資料、配置檔和日誌                        |

**使用情境**：
- 開發調試：快速驗證特定功能（如 `test_admin` 測試管理介面）。
- CI/CD 整合：針對失敗案例重跑。

## 常見路徑說明

| 路徑位置                  | 用途                          | 預設值/範例                  |
|---------------------------|-------------------------------|------------------------------|
| `cmake-build-debug/src/infinity` | Infinity 二進位檔            | 來自 CMake 編譯輸出         |
| `/var/infinity`           | 叢集工作目錄                 | 可自訂，但需確保權限正確    |
| `tools/run_cluster_test.py` | 測試腳本入口                 | 位於 Infinity 專案根目錄    |

## 注意事項

1. **權限要求**：確保 `/var/infinity` 目錄存在且有寫入權限（`sudo mkdir -p /var/infinity && sudo chown $USER:$USER /var/infinity`）。
2. **依賴檢查**：執行前確認 `bridge-utils` 已安裝，且 Python 3 環境完整。
3. **資源需求**：叢集測試需多核心 CPU 和足夠磁碟空間。
4. **日誌位置**：測試日誌預設儲存於 `--infinity_dir/logs/` 下，便於故障排除。
5. **自訂參數**：腳本支援額外選項（如 `--nodes=3` 指定節點數），請參考 `python3 tools/run_cluster_test.py --help`。

透過此工具，您可以高效驗證 Infinity 叢集的高可用性、分片、複製等核心功能。