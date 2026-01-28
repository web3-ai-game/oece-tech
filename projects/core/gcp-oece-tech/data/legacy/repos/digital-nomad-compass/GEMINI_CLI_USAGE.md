# 🤖 Gemini CLI 使用指南

## 安装完成 ✅

Gemini CLI 已经成功安装在你的系统中，现在可以全局使用了！

## 快速开始

### 1. 设置 API Key
首先你需要设置 Gemini API Key：

```bash
# 使用命令设置 API Key
gemini-cli config set-key YOUR_GEMINI_API_KEY

# 或者设置环境变量
export GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 2. 开始使用

```bash
# 向 Gemini 提问
gemini-cli "解释什么是量子计算"

# 获取编程帮助
gemini-cli "帮我写一个 Python 的快速排序算法"

# 获取创意建议
gemini-cli "给我一些 Next.js 项目的创意"
```

## 命令列表

| 命令 | 描述 |
|------|------|
| `gemini-cli "你的问题"` | 向 Gemini 提问 |
| `gemini-cli config set-key <key>` | 设置 API Key |
| `gemini-cli config get-key` | 查看已保存的 API Key |
| `gemini-cli history` | 查看对话历史 |
| `gemini-cli clear-history` | 清除对话历史 |
| `gemini-cli help` | 显示帮助信息 |

## 功能特性

- 🚀 **快速响应** - 直接与 Google Gemini Pro 模型对话
- 💾 **历史记录** - 自动保存对话历史，方便查看
- 🔐 **安全配置** - API Key 安全存储在用户目录
- 📝 **多语言支持** - 支持中文和英文提问
- 🎯 **编程助手** - 获取代码示例和技术解释

## 使用示例

### 编程帮助
```bash
gemini-cli "如何在 React 中实现自定义 Hook？"
gemini-cli "解释 JavaScript 中的闭包概念"
gemini-cli "帮我优化这个 SQL 查询语句"
```

### 技术概念
```bash
gemini-cli "什么是微服务架构？"
gemini-cli "解释 Docker 容器化的优势"
gemini-cli "如何设计高可用的系统架构？"
```

### 创意和写作
```bash
gemini-cli "帮我写一段关于 AI 的简介"
gemini-cli "给我一些创业项目的想法"
gemini-cli "如何写一份优秀的技术简历？"
```

## 配置文件

配置文件位于：`~/.gemini-cli-config.json`

包含：
- API Key
- 对话历史记录
- 用户偏好设置

## 注意事项

1. **API Key 安全** - 不要将你的 API Key 提交到代码仓库
2. **网络连接** - 需要稳定的网络连接才能使用
3. **使用限制** - 注意 Google Gemini API 的使用限额
4. **隐私保护** - 避免在问题中包含敏感个人信息

## 故障排除

### 如果命令未找到
确保全局 npm 包路径在你的 PATH 中：
```bash
# 检查 npm 全局路径
npm config get prefix

# 添加到 PATH（如果需要）
export PATH=$PATH:$(npm config get prefix)/bin
```

### 如果 API 调用失败
1. 检查 API Key 是否正确
2. 确认网络连接正常
3. 检查是否超出 API 使用限额

### 重置配置
```bash
# 删除配置文件
rm ~/.gemini-cli-config.json

# 重新设置 API Key
gemini-cli config set-key YOUR_NEW_API_KEY
```

## 更新工具

要更新 Gemini CLI 到最新版本，可以重新运行安装脚本：

```bash
./install-gemini-cli.sh
```

## 集成到开发环境

你可以将 Gemini CLI 集成到你的开发工作流中：

```bash
# 在 VS Code 中设置快捷键
# 在终端中快速提问
gemini-cli "解释这个错误信息：$(pbpaste)"

# 作为构建脚本的一部分
gemini-cli "检查这段代码是否有潜在问题"
```

享受你的 AI 编程助手吧！🎉