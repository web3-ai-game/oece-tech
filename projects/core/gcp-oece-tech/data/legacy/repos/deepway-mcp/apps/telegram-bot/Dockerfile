# =====================================================
# 🧠 SVS高情商智能体Docker镜像
# 多阶段构建，优化体积
# =====================================================

# 阶段1: 构建环境
FROM python:3.11-slim as builder

WORKDIR /build

# 安装构建依赖
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 安装Python依赖
RUN pip install --no-cache-dir --user -r requirements.txt

# 阶段2: 运行环境
FROM python:3.11-slim

# 创建非root用户
RUN useradd -m -u 1000 svs && \
    mkdir -p /app/data /app/logs && \
    chown -R svs:svs /app

WORKDIR /app

# 从构建阶段复制依赖
COPY --from=builder /root/.local /home/svs/.local
COPY --chown=svs:svs . .

# 安装Doppler CLI
RUN apt-get update && \
    apt-get install -y curl gnupg && \
    curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh | sh && \
    apt-get remove -y curl gnupg && \
    apt-get autoremove -y && \
    rm -rf /var/lib/apt/lists/*

# 切换到非root用户
USER svs

# 环境变量
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH=/home/svs/.local/bin:$PATH \
    PYTHONPATH=/app

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD python -c "import sys; import telegram; sys.exit(0)"

# 暴露端口(如果需要webhook)
EXPOSE 8080

# 启动命令
CMD ["python", "-u", "high_eq_bot.py"]
