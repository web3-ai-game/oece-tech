FROM python:3.11-slim

WORKDIR /app

# 安裝系統依賴
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# 複製依賴文件
COPY requirements.txt .

# 安裝 Python 依賴
RUN pip install --no-cache-dir -r requirements.txt

# 複製源代碼
COPY src/ ./src/
COPY urls.txt .

# 設置環境變量
ENV PYTHONPATH=/app/src

# 運行命令
CMD ["python", "src/knowledge_builder.py"]
