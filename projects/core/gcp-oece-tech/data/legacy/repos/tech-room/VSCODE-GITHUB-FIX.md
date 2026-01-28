# VS Code & GitHub 问题修复

## 已修复的问题

### 1. .gitignore 更新
```
✓ 保留 .vscode/settings.json
✓ 保留 .vscode/extensions.json
✓ 忽略其他VS Code临时文件
✓ 正确忽略数据库文件
✓ 忽略环境变量文件
```

### 2. VS Code配置
创建了 `.vscode/settings.json`:
- 自动格式化（Prettier）
- ESLint自动修复
- TypeScript配置
- Tailwind CSS智能提示
- Git自动操作
- Next.js优化

### 3. 推荐扩展
创建了 `.vscode/extensions.json`:
- ESLint
- Prettier
- Tailwind CSS
- React snippets
- GitLens
- Markdown工具

---

## 常见问题解决方案

### Git相关问题

#### 问题1: 大文件无法提交
```bash
# 解决方案：使用Git LFS
git lfs install
git lfs track "*.db"
git lfs track "*.zip"
git add .gitattributes
git commit -m "Add Git LFS"
```

#### 问题2: 合并冲突
```bash
# 查看冲突文件
git status

# 使用VS Code解决冲突
# VS Code会高亮显示冲突区域

# 解决后
git add .
git commit -m "Resolve conflicts"
```

#### 问题3: 撤销本地修改
```bash
# 撤销单个文件
git checkout -- filename

# 撤销所有修改
git reset --hard HEAD

# 撤销最近一次commit（保留修改）
git reset --soft HEAD^
```

#### 问题4: GitHub推送失败
```bash
# 检查远程仓库
git remote -v

# 重新设置远程仓库
git remote set-url origin https://github.com/username/repo.git

# 强制推送（谨慎使用）
git push -f origin main
```

---

### VS Code相关问题

#### 问题1: TypeScript报错
```json
// tsconfig.json确保包含
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

#### 问题2: Tailwind CSS不提示
```bash
# 安装扩展
# Tailwind CSS IntelliSense by Tailwind Labs

# 确保tailwind.config.js存在
# VS Code会自动识别
```

#### 问题3: ESLint不工作
```bash
# 安装依赖
npm install -D eslint eslint-config-next

# 创建.eslintrc.json
{
  "extends": "next/core-web-vitals"
}
```

#### 问题4: 自动格式化不生效
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}

// 安装Prettier
npm install -D prettier
```

---

## GitHub工作流

### 标准提交流程
```bash
# 1. 查看状态
git status

# 2. 添加文件
git add .

# 3. 提交（使用规范的commit message）
git commit -m "feat: add new feature"
git commit -m "fix: resolve bug"
git commit -m "docs: update README"

# 4. 推送
git push origin main
```

### Commit Message规范
```
feat:     新功能
fix:      修复bug
docs:     文档更新
style:    代码格式（不影响功能）
refactor: 重构
test:     测试
chore:    构建/工具配置
```

### 分支管理
```bash
# 创建新分支
git checkout -b feature/new-feature

# 切换分支
git checkout main

# 合并分支
git merge feature/new-feature

# 删除分支
git branch -d feature/new-feature
```

---

## 性能优化

### VS Code性能
```json
// settings.json
{
  // 禁用不需要的功能
  "extensions.autoUpdate": false,
  "git.autorefresh": false,
  
  // 减少文件监控
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/node_modules/**": true,
    "**/.next/**": true
  }
}
```

### Git性能
```bash
# 清理仓库
git gc --prune=now

# 优化性能
git config --global core.preloadindex true
git config --global core.fscache true
git config --global gc.auto 256
```

---

## 团队协作配置

### .editorconfig
```ini
# 创建 .editorconfig
root = true

[*]
charset = utf-8
end_of_line = lf
indent_style = space
indent_size = 2
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

### .prettierrc
```json
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "es5",
  "tabWidth": 2,
  "printWidth": 80
}
```

### .eslintrc.json
```json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "react/no-unescaped-entities": "off",
    "@next/next/no-page-custom-font": "off"
  }
}
```

---

## GitHub Actions (CI/CD)

### .github/workflows/ci.yml
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Lint
        run: npm run lint
        
      - name: Build
        run: npm run build
```

---

## 问题排查清单

### Git问题
```
□ 检查 .gitignore 是否正确
□ 检查远程仓库地址
□ 检查分支名称
□ 检查文件权限
□ 清理 git cache
```

### VS Code问题
```
□ 重启VS Code
□ 检查扩展是否安装
□ 检查settings.json配置
□ 清除缓存（Cmd+Shift+P → "Clear Editor History"）
□ 重新安装扩展
```

### 构建问题
```
□ 删除 node_modules 和 .next
□ 重新安装依赖（npm install）
□ 检查 package.json 版本
□ 检查环境变量
□ 查看构建日志
```

---

## 快速命令

### Git
```bash
# 查看历史
git log --oneline --graph

# 查看差异
git diff

# 暂存修改
git stash
git stash pop

# 查看远程分支
git branch -r
```

### VS Code
```
Cmd+Shift+P  - 命令面板
Cmd+P        - 快速打开文件
Cmd+Shift+F  - 全局搜索
Cmd+`        - 打开终端
Cmd+K Cmd+S  - 键盘快捷键
```

---

## 完成检查

```
✓ .gitignore 已更新
✓ .vscode/settings.json 已创建
✓ .vscode/extensions.json 已创建
✓ 常见问题解决方案已文档化
✓ 团队协作配置已就绪
```

---

**VS Code & GitHub 问题已全部修复！**

**核心改进**:
- 正确的Git配置
- VS Code自动化
- 推荐扩展列表
- 团队协作规范
- 性能优化
- 问题排查指南

**下一步**: 
1. 提交这些配置文件到Git
2. 团队成员克隆后自动应用配置
3. 享受流畅的开发体验 ✨
