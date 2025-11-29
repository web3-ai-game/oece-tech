#!/bin/bash
# 🔐 安全环境变量设置脚本 - 从 Doppler 拉取
# 用法: ./scripts/setup-env.sh

set -e

echo "🔐 正在从 Doppler 拉取环境变量..."

# 检查 Doppler CLI 是否安装
if ! command -v doppler &> /dev/null; then
    echo "❌ Doppler CLI 未安装"
    echo "📦 安装方法："
    echo "   macOS: brew install dopplerhq/cli/doppler"
    echo "   Linux: curl -Ls https://cli.doppler.com/install.sh | sh"
    exit 1
fi

# 检查是否已登录
if ! doppler --version &> /dev/null; then
    echo "❌ Doppler 未配置"
    echo "🔑 请先运行: doppler login"
    exit 1
fi

# 拉取环境变量
echo "📥 拉取环境变量到 .env.local..."
doppler secrets download --no-file --format env > .env.local

# 设置文件权限
chmod 600 .env.local

echo "✅ 环境变量已安全配置！"
echo "📝 文件: .env.local (已忽略Git)"
echo "🔒 权限: 600 (仅所有者可读写)"
echo ""
echo "🚀 下一步："
echo "   npm install"
echo "   npm run dev"
