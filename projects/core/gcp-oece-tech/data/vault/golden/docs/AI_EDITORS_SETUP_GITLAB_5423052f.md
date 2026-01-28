# AI 编辑器代理与 GitLab 集成配置指南（无 GitHub 依赖）

本指南帮助你在完全不依赖 GitHub 的前提下，配置常用 AI 编辑器/代理：
- Windsurf（MCP 模式）
- VS Code / Cursor + Continue（开源 AI 辅助）
- GitLab Duo（可选，若有企业订阅）

并提供禁用仓库中 GitHub 相关脚本的方式，确保项目处于“GitLab-only”模式。

---

## 1. Windsurf 配置（MCP，无 GitHub）

Windsurf 支持通过 MCP（Model Context Protocol）挂载本地/远程工具。我们只启用与 GitLab/本地环境相关的服务器，不配置任何 GitHub 服务器。

1) 准备 API Key（按需）
- OpenAI/Anthropic/DeepSeek/阿里通义等任一模型提供商 Key（放入系统环境变量）

2) 建议的 MCP 服务器组合
- filesystem（本地文件系统）
- shell/terminal（可选）
- git（本地 git 仓库能力，不绑定远端提供商）
- http（可选）
- 自定义：gitlab（通过 API 调用 GitLab，若需要）

3) windsuref 配置示例（mcp.json）
路径示例（不同系统/版本略有差异）：
- macOS: ~/Library/Application Support/Windsurf/mcp/mcp.json

示例内容（不含 GitHub）：
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "node",
      "args": ["/usr/local/bin/mcp-filesystem.js"],
      "env": {}
    },
    "git": {
      "command": "node",
      "args": ["/usr/local/bin/mcp-git.js"],
      "env": {}
    },
    "http": {
      "command": "node",
      "args": ["/usr/local/bin/mcp-http.js"]
    },
    "gitlab": {
      "command": "node",
      "args": ["/usr/local/bin/mcp-gitlab.js"],
      "env": {
        "GITLAB_BASE_URL": "https://gitlab.com",
        "GITLAB_TOKEN": "${GITLAB_PRIVATE_TOKEN}"
      }
    }
  }
}
```
提示：若没有现成的 mcp-git / mcp-gitlab，可仅保留 filesystem/http，或替换为你的自建 MCP 服务。项目本身不强制这些工具存在。

---

## 2. VS Code / Cursor + Continue（无 GitHub）

如果你不使用 GitHub Copilot，可选用 Continue（开源）作为智能补全/对话代理：

1) 安装插件
- VS Code / Cursor 安装 Continue 扩展（Continue.dev）

2) 选择模型供应商
- OpenAI、Anthropic、DeepSeek、Azure OpenAI、Ollama（本地）等

3) Continue 配置示例（.continuerc.json 放在用户目录或工作区）
```json
{
  "models": [
    {
      "title": "DeepSeek R1",
      "provider": "openai",
      "model": "deepseek-reasoner",
      "apiKeyEnvVar": "DEEPSEEK_API_KEY",
      "baseUrl": "https://api.deepseek.com"
    },
    {
      "title": "Claude Sonnet",
      "provider": "anthropic",
      "model": "claude-3-7-sonnet-latest",
      "apiKeyEnvVar": "ANTHROPIC_API_KEY"
    }
  ],
  "allowAnonymousTelemetry": false
}
```
将 API Key 写入 shell 环境变量（~/.zshrc 或 ~/.bashrc）：
```bash
export DEEPSEEK_API_KEY=xxxxx
export ANTHROPIC_API_KEY=xxxxx
```

4) GitLab 代码搜索/上下文
- 直接通过本地 git 仓库（git remote 指向 GitLab），Continue 会从工作区文件构建上下文，不需要 GitHub。
- 若要远程搜索 GitLab，可安装 GitLab 官方 VS Code 扩展（可选）。

---

## 3. GitLab Duo（可选）

如果你使用 GitLab 企业/付费版，可开启 GitLab Duo Chat/Code Suggestions：
- 安装 GitLab 扩展（VS Code Marketplace）
- 登录你的 GitLab 账户与项目
- 启用 Code Suggestions（若订阅包含）

GitLab Duo 能在 MR、pipeline、代码评审中提供 AI 建议，不依赖 GitHub。

---

## 4. 在本项目中禁用 GitHub 关联

仓库里的 GitHub 相关文件主要位于 scripts/ 与 docs/，仅用于可选的自动化/索引说明。为了进入“GitLab-only”模式，你可以：

- 不运行任何包含 github 字样的脚本
- 或执行以下脚本将其隔离：

```bash
bash scripts/disable-github-integrations.sh
```

该脚本将：
- 将 scripts/*github* 相关脚本移动到 scripts/.disabled/ 目录
- 在 .cache/ 写入标记文件，提示 GitHub 集成已禁用
- 不会修改业务代码与运行逻辑

如需恢复，可手动将 .disabled/ 内文件移回 scripts/。

---

## 5. Git 远端切换到 GitLab（如未完成）

```bash
git remote -v
# 若存在 origin 指向 GitHub，改为 GitLab：
git remote set-url origin https://gitlab.com/<your-namespace>/<your-repo>.git
```

---

## 6. 常见问题

- 一定要 Copilot 吗？
  - GitHub Copilot 需要 GitHub 账号与订阅；若不使用 GitHub，建议使用 Continue 或 GitLab Duo。
- Windsurf 一定要 MCP 吗？
  - 建议启用 filesystem 至少支持本地工程上下文；其余服务按需添加。
- 项目会强依赖 GitHub 吗？
  - 不会。GitHub 仅用于可选的自动同步/索引脚本与文档示例，禁用后不影响核心功能。

---

## 7. 快速检查（GitLab-only 清单）
- [ ] scripts/.disabled/ 存在（或你未运行任何 *github* 脚本）
- [ ] README 链接到本指南
- [ ] git remote 指向 GitLab
- [ ] Windsurf/Continue 正常工作，不提示 GitHub

如需进一步定制（例如提供 mcp-gitlab.js 或 GitLab API 自动化），告诉我你的 GitLab 版本与使用场景即可。