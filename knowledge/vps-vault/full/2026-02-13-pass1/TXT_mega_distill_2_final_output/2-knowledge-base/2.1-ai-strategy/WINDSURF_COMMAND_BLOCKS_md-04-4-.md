---
distilled_by: grok-4-0709
mode: B
---
part: 4
---

## 4. 代碼範例

以下提供 5-8 個代碼範例，均帶註釋，展示 Windsurf AI 生成的典型應用。

### 4.1 範例 1: 生成簡單 Flask API

```python
# AI 生成的 Flask API 範例，用於 Notion 整合
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/notion', methods=['POST'])
def notion_integration():
    data = request.json  # 接收 JSON 輸入
    # 假設處理 Notion API 呼叫
    response = {"status": "success", "data": data}
    return jsonify(response)

if __name__ == '__main__':
    app.run(debug=True)  # 本地調試模式
```

### 4.2 範例 2: Docker 配置檔

```dockerfile
# AI 生成的 Dockerfile for Python app
FROM python:3.9-slim  # 使用輕量基鏡像

WORKDIR /app
COPY requirements.txt .  # 複製依賴
RUN pip install --no-cache-dir -r requirements.txt  # 安裝依賴

COPY . .  # 複製應用代碼
CMD ["python", "app.py"]  # 啟動命令
```

### 4.3 範例 3: Terraform GCP 配置

```hcl
# AI 生成的 Terraform for GCP VM
provider "google" {
  project = "my-project"
  region  = "us-central1"
}

resource "google_compute_instance" "vm" {
  name         = "windsurf-vm"
  machine_type = "e2-medium"
  zone         = "us-central1-a"

  boot_disk {
    initialize_params {
      image = "debian-cloud/debian-11"
    }
  }

  network_interface {
    network = "default"
  }
}
```

### 4.4 範例 4: Git 推送腳本

```bash
# AI 生成的 Git 推送腳本
#!/bin/bash
git add .  # 添加所有變更
git commit -m "AI generated code for MVP"  # 提交訊息
git push origin main  # 推送至 main 分支
```

### 4.5 範例 5: Python 測試腳本

```python
# AI 生成的 unittest 範例
import unittest

class TestNotionAPI(unittest.TestCase):
    def test_integration(self):
        # 模擬 API 呼叫
        result = {"status": "success"}
        self.assertEqual(result["status"], "success")  # 斷言測試

if __name__ == '__main__':
    unittest.main()
```

### 4.6 範例 6: GCP Cloud Run 部署 YAML

```yaml
# AI 生成的 Cloud Run 服務 YAML
apiVersion: serving.knative.dev/v1
kind: Service
metadata:
  name: windsurf-app
spec:
  template:
    spec:
      containers:
      - image: gcr.io/my-project/app:latest  # 鏡像位置
        ports:
        - containerPort: 8080  # 暴露端口
```

### 4.7 範例 7: AI 提示範例

```text
# 用於 Windsurf Cascade 的提示
生成一個完整的 Flask API 整合 Notion，包含錯誤處理和部署配置。
```
