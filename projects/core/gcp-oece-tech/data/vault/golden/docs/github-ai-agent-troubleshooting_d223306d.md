# GitHub AI 代理（Copilot/Agents）登录与常见问题排查指南

本指南帮助你解决“弹窗后输入随机密码没有反应”“无法登录 GitHub AI 代理/机器人”等问题。

## 1. 正确的登录方式（不要输入随机密码）
- JetBrains 弹窗要求登录时，应使用 GitHub 账号认证流程（通常是浏览器设备码登录），而不是随意输入密码。
- 流程一般是：
  1) 弹出设备授权窗口 → 点击“在浏览器中打开”。
  2) 在 GitHub 网页完成授权（确认账号、授权 Copilot/插件等）。
  3) 回到 IDE，等待几秒完成登录。
- 如果仍旧要求输入密码，可能是插件或网络拦截问题，见下文排查。

## 2. 先确认基础条件
- 你已在 JetBrains IDE 中登录 GitHub 账号（Settings/Preferences → Version Control → GitHub）。
- 已安装并启用 GitHub Copilot 插件（或你使用的 AI Agent 插件）。
- GitHub 账号具备 Copilot 订阅或相应的访问权限。

## 3. MCP 配置（本仓库已提供快速修复脚本）
- 运行：
  - bash scripts/fix-copilot-mcp.sh
- 作用：写入最小可用的 MCP 配置到 ~/.config/github-copilot/intellij/mcp.json
- 重要：将生成的 mcp.json 中的占位符替换成你的真实密钥：
  - NOTION_API_KEY
  - GITHUB_TOKEN（建议使用 Fine-grained personal access token，至少给 repo:read 权限；若使用 mcp-server-github 需要有效 token）

## 4. 一键自检脚本
- 运行：
  - bash scripts/verify-copilot-env.sh
- 功能：
  - 检查 mcp.json 是否存在且为有效 JSON；
  - 检测是否仍旧使用占位符密钥；
  - 检查是否安装 gh CLI 并查看登录状态；
  - 给出具体修复建议。

## 5. 首次推送仓库到 GitHub（避免“无仓库上下文”）
如果你“从未在这里推送过任何文件”，AI 代理有时无法获取仓库上下文，可能导致无响应或能力受限：
- 初始化并推送：
  - git init
  - git remote add origin git@github.com:YOUR_USER/hotel-inistel.git  或 https://github.com/YOUR_USER/hotel-inistel.git
  - git add . && git commit -m "chore: init project"
  - git push -u origin main
- 在 IDE 中确保 VCS 映射正常（File → New → Project from Existing Sources 或 VCS → Enable Version Control Integration）。

## 6. 常见网络/系统问题
- 代理/防火墙：确保 IDE 能访问 github.com、api.github.com 和 GitHub OAuth 域名。
- 系统时间：确保系统时间正确，否则 OAuth 可能失败。
- 清理缓存：
  - 退出 IDE；
  - 删除（或重命名）目录：
    - macOS: ~/Library/Application Support/JetBrains/<产品版本>/copilot 或相关缓存
    - Linux: ~/.config/JetBrains/<产品版本>/copilot
  - 重启 IDE 重试登录。

## 7. 冲突的本地 MCP 配置
你的系统可能存在多个 MCP 配置文件（例如 .kilocode/mcp.json、.windsurf/mcp_config_backup.json）。这些是其他工具的备份/示例，不会被 Copilot 插件读取。Copilot（JetBrains）只读取：
- ~/.config/github-copilot/intellij/mcp.json
请以该路径为准。

## 8. 使用 gh CLI 辅助登录（可选）
- 安装 gh：见 https://github.com/cli/cli#installation
- 登录：
  - gh auth login
- 查看状态：
  - gh auth status

## 9. 仍无法登录？
- 截图报错/日志信息（IDE Event Log、Copilot 面板）。
- 记录网络环境（是否需要代理）。
- 提供 verify-copilot-env.sh 的输出结果。
- 联系支持或在 issue 中附上上述信息，我们将进一步协助排查。

祝使用顺利！