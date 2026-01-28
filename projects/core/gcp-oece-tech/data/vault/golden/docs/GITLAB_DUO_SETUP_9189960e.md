# 🤖 GitLab Duo 配置与使用指南

## 📋 概述

GitLab Duo 是 GitLab 的 AI 助手套件，包含代码建议、聊天助手、代码审查等功能。本指南帮助你在 Hotel Inistel 项目中启用和使用 GitLab Duo。

## 🎯 前置条件

### 订阅要求
- ✅ **GitLab Premium 或 Ultimate** 订阅
- ✅ **GitLab Duo 插件**：
  - GitLab Duo Core（包含在 Premium/Ultimate 中）
  - GitLab Duo Pro（需购买）
  - GitLab Duo Enterprise（需购买）

### 支持的 IDE
- VS Code（推荐）
- JetBrains IDEs
- Visual Studio
- Neovim
- GitLab Web IDE

## 🔧 Step 1: 检查和启用 GitLab Duo

### 在 GitLab.com 上启用

1. **访问组设置**
   ```bash
   # 访问你的项目
   https://gitlab.com/oicc1/hotel-install
   ```

2. **启用 GitLab Duo**
   - 进入项目 → Settings → GitLab Duo
   - 或访问顶级组设置： Settings → GitLab Duo
   - 点击 "Change configuration"
   - 在 "GitLab Duo availability" 选择 "Always on"
   - 勾选 "Turn on Web and IDE features"
   - 保存更改（可能需要 10 分钟生效）

3. **验证启用状态**
   - 在项目右上角查找 "GitLab Duo Chat" 按钮
   - 如果按钮可见，说明配置成功

## 🔧 Step 2: 在 Web 界面测试 GitLab Duo

### 使用 GitLab Duo Chat
```bash
# 在项目页面点击右上角的 "GitLab Duo Chat" 按钮
# 尝试以下命令：

/                          # 查看所有可用命令
/explain                   # 解释代码功能
/tests                     # 生成测试代码
/refactor                  # 重构建议
```

### 尝试其他功能
- **Root Cause Analysis**: 失败的 CI/CD 任务底部点击 "Troubleshoot"
- **Discussion Summary**: Issue 中的 Activity 区域点击 "View summary"
- **Code Review**: MR 中获得 AI 代码审查建议

## 🔧 Step 3: 配置 VS Code 插件

### 安装 GitLab Workflow 插件

1. **安装插件**
   ```bash
   # 在 VS Code 扩展市场搜索并安装：
   GitLab Workflow
   ```

2. **创建个人访问令牌**
   - 访问 GitLab → Preferences → Access Tokens
   - 或直接访问：https://gitlab.com/-/user_settings/personal_access_tokens
   - 创建新令牌，权限选择：
     - `api`
     - `read_user` 
     - `read_repository`
     - `write_repository`

3. **VS Code 中配置**
   ```bash
   # 打开 VS Code 命令面板 (Cmd+Shift+P)
   GitLab: Add Account
   
   # 输入信息：
   GitLab URL: https://gitlab.com
   Personal Access Token: [你的令牌]
   ```

### 连接项目仓库

```bash
# 在项目根目录打开 VS Code
cd /Users/svs.loline/Documents/xiangmu/hotel-inistel
code .

# 确保 VS Code 识别 GitLab 远程仓库
git remote -v
# 应该显示：origin https://gitlab.com/oicc1/hotel-install.git
```

## 🔧 Step 4: 使用 GitLab Duo 功能

### Code Suggestions（代码建议）
```javascript
// 在编写代码时，GitLab Duo 会自动提供建议
// 例如在 React 组件中：

import React, { useState } from 'react';

const HotelBooking = () => {
  const [booking, setBooking] = useState(
    // GitLab Duo 会建议完整的初始状态
  );
  
  // 开始输入函数名，会得到完整实现建议
  const handleSubmit = 
};
```

### GitLab Duo Chat 在 VS Code
```bash
# 使用快捷键或命令面板启动聊天
Cmd+Shift+P → GitLab Duo Chat

# 例子对话：
"帮我优化这个 React 组件的性能"
"为这个函数写单元测试"
"解释这段代码的作用"
"重构这个组件使其更模块化"
```

### 支持的语言
- ✅ JavaScript/TypeScript（完整支持）
- ✅ React/JSX
- ✅ Node.js
- ✅ SQL
- ✅ Docker
- ✅ YAML
- ✅ Markdown

## 🎨 针对 Hotel Inistel 项目的使用技巧

### 前端开发建议
```javascript
// 询问 GitLab Duo 关于酒店管理 UI 的建议
"为酒店预订表单创建验证逻辑"
"优化房间状态显示组件"
"生成客户评价展示组件"
```

### 后端 API 优化
```javascript
// 让 GitLab Duo 帮助 API 开发
"为酒店预订 API 添加错误处理"
"优化数据库查询性能"
"实现 JWT 认证中间件"
```

### 数据库设计
```sql
-- 询问数据库优化建议
"优化酒店预订表的索引设计"
"为多租户架构设计权限表"
```

## 🔧 Step 5: 高级配置

### 配置文件 (.vscode/settings.json)
```json
{
  "gitlab.instanceUrl": "https://gitlab.com",
  "gitlab.duo.enabled": true,
  "gitlab.duo.codeGeneration": true,
  "gitlab.duo.chatAssistant": true,
  "editor.inlineSuggest.enabled": true,
  "editor.suggest.preview": true
}
```

### 项目级别配置 (.gitlab-ci.yml)
```yaml
# 在 CI/CD 中使用 GitLab Duo 进行代码质量检查
duo_code_review:
  stage: test
  script:
    - echo "GitLab Duo 自动代码审查"
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
```

## 🐛 故障排除

### 常见问题

1. **GitLab Duo Chat 按钮不显示**
   - 检查订阅状态和插件启用
   - 确认组织管理员已启用功能
   - 等待最多 10 分钟配置生效

2. **VS Code 插件连接失败**
   - 重新生成个人访问令牌
   - 检查令牌权限设置
   - 重启 VS Code

3. **代码建议不工作**
   - 检查 `editor.inlineSuggest.enabled` 设置
   - 确认语言支持列表
   - 重新加载 VS Code 窗口

4. **性能问题**
   ```bash
   # 调整 VS Code 设置
   "gitlab.duo.codeGeneration.maxTokens": 100
   "gitlab.duo.codeGeneration.temperature": 0.3
   ```

## 📊 使用统计和监控

### 查看使用统计
- GitLab 项目 → Analytics → Usage Quotas
- 查看 GitLab Duo 使用量和限制

### 最佳实践
- 🎯 针对性提问，获得更好建议
- 🔄 定期更新插件到最新版本
- 📝 结合代码审查使用 AI 建议
- 🚀 利用 Chat 学习新技术和最佳实践

## 🎉 Hotel Inistel 项目特定用例

### 酒店管理系统开发
```bash
# 常用的 GitLab Duo 查询示例：

"帮我设计酒店房间状态管理的 React 组件"
"优化预订系统的数据库查询"
"为客户评价功能添加情感分析"
"实现多语言支持的最佳实践"
"设计响应式的酒店仪表板布局"
```

---

**💡 提示**: GitLab Duo 会不断学习和改进，定期查看 [GitLab Duo 更新日志](https://docs.gitlab.com/user/gitlab_duo/) 获取新功能信息。

**🔗 相关链接**:
- [GitLab Duo 官方文档](https://docs.gitlab.com/user/gitlab_duo/)
- [VS Code 插件文档](https://docs.gitlab.com/editor_extensions/visual_studio_code/)
- [Hotel Inistel 项目仓库](https://gitlab.com/oicc1/hotel-install)
