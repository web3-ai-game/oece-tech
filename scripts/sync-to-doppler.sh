#!/bin/bash
# 📤 将本地环境变量同步到 Doppler
# 用法: DOPPLER_TOKEN=dp.sa.xxx ./scripts/sync-to-doppler.sh

set -e

# 从环境变量读取 Doppler Token（不硬编码）
if [ -z "$DOPPLER_TOKEN" ]; then
    echo "❌ 错误: 需要设置 DOPPLER_TOKEN 环境变量"
    echo "用法: DOPPLER_TOKEN=dp.sa.xxx ./scripts/sync-to-doppler.sh"
    exit 1
fi

echo "📤 正在同步环境变量到 Doppler..."

# 检查 .env.local 是否存在
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local 不存在"
    exit 1
fi

# 使用 Doppler API 上传环境变量
echo "🔄 上传中..."

# 读取 .env.local 并上传到 Doppler
while IFS='=' read -r key value; do
    # 跳过注释和空行
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue

    # 移除引号
    value=$(echo "$value" | sed 's/^"//;s/"$//')

    # 上传到 Doppler
    curl -s -X POST "https://api.doppler.com/v3/configs/config/secrets" \
      -H "Authorization: Bearer $DOPPLER_TOKEN" \
      -H "Content-Type: application/json" \
      -d "{
        \"project\": \"oece-tech\",
        \"config\": \"dev\",
        \"secrets\": {
          \"$key\": \"$value\"
        }
      }" > /dev/null

    echo "✅ 已上传: $key"
done < .env.local

echo ""
echo "🎉 所有环境变量已同步到 Doppler！"
