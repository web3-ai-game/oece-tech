# GitHub 登录无响应/无法回到编辑器的排查指南

适用场景：在浏览器完成 GitHub 登录后，点击“回到编辑器/在应用中打开”等按钮没有反应，浏览器和编辑器之间像是“没有打通”。

在我们的项目中，GitHub 仅用于可选的 UI 资源自动同步与一些 IDE 集成。你可以：
- 完全跳过 GitHub（推荐，默认即为关闭）
- 或按下文排查本机的“浏览器 → 编辑器”回传链路

---

## 一、最快捷的解决方案：切换到 GitLab-only 模式（无需 GitHub）

1) 一键禁用所有 GitHub 集成：

```bash
bash scripts/disable-github-integrations.sh
```

执行后会在 .cache/ 目录生成 GITHUB_DISABLED 标记，所有 GitHub 相关脚本将自动跳过（我们已在代码中做了守护）。

如需恢复：删除 .cache/GITHUB_DISABLED 或导出环境变量

```bash
export GITHUB_INTEGRATIONS_ENABLED=true
```

然后再运行相关脚本即可。

---

## 二、本机回传链路排查（可选）
若你确实需要 GitHub 登录/深度链接到编辑器，按照以下步骤排查：

1) 检查默认浏览器是否拦截了“在应用中打开”的深度链接（例如 jetbrains://、vscode://）。
   - Safari: 偏好设置 → 网站 → 允许弹出式窗口/允许打开外部应用
   - Chrome/Edge: 地址栏右侧提示是否阻止了打开外部应用；点“始终允许”

2) 重新授权时，确保在同一用户会话/同一浏览器中完成全流程，避免被隐私模式或容器标签隔离。

3) 在 IDE 中确认仍处于“等待授权”状态。
   - JetBrains: Settings → Tools → 登录/Authorization 面板，是否仍在等待回调
   - 如果使用代理/系统代理，确保 127.0.0.1 回环地址未被代理劫持

4) 运行项目提供的检查脚本，验证 URL Scheme 能否被系统接管：

```bash
bash scripts/check-editor-link.sh
```

脚本会给出如何在系统设置中恢复“外部应用打开”能力的提示。

5) 若公司网络或安全软件拦截回调：
   - 临时关闭网络杀毒/安全策略，或切换到移动热点测试
   - 确保以下域名可访问：github.com、api.github.com、相关 OAuth 回调域

---

## 三、IDE 无法收到授权回调时的替代方案
- 采用“设备码/Device Code”授权（如果你的工具支持），无需深度链接
- 直接使用 Personal Access Token（PAT）方式，在工具的“输入 Token”处粘贴；注意最小必要权限且妥善保管

---

## 四、项目内的安全开关（已默认关闭）
- 环境变量：`GITHUB_INTEGRATIONS_ENABLED=false`（默认）
- 标记文件：`.cache/GITHUB_DISABLED`

只要任意一项生效，所有 GitHub 自动索引/同步逻辑都会成为空操作（no-op），不会影响项目启动与开发。

---

## 五、仍有问题？
请在 Issue 中附带：
- 操作系统、默认浏览器及版本
- IDE 名称与版本
- 代理/网络环境说明
- `bash scripts/check-editor-link.sh` 的输出

我们会根据信息给出更进一步的定向建议。