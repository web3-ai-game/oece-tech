# MCP优化配置指南

## 🎯 优化策略

### 核心原则：适度平衡
- **不要太多**：避免内存占用过高，降低响应速度
- **不要太少**：保证必要功能，提高输出精确度
- **选择6个核心MCP服务器**

## 📦 已启用的MCP服务器（7个）

### 1. **Sequential-thinking** ⭐
- **作用**：提高输出精确度，分步骤思考
- **内存**：低占用
- **重要性**：高

### 2. **Memory** 💾
- **作用**：知识持久化，跨会话记忆
- **存储**：`/Volumes/128/mcp-memory/windsurf-memory.json`
- **内存**：外置存储，极低占用

### 3. **Filesystem** 📁
- **作用**：文件系统访问
- **路径**：项目目录 + 外置SSD
- **内存**：低占用

### 4. **GitHub** 🐙 (新增)
- **作用**：代码仓库管理，提高代码相关精确度
- **Token**：7天有效期
- **功能**：
  - 仓库管理
  - Issue/PR操作
  - 代码搜索
  - Gist管理

### 5. **Git** 🔀
- **作用**：本地Git操作
- **配置**：用户信息已设置
- **内存**：低占用

### 6. **Notion** 📚
- **作用**：知识库管理
- **数据库**：4个（Tasks/Code/Docs/Scripts）
- **内存**：中等占用

### 7. **Puppeteer** 🌐 (已启用)
- **作用**：网页自动化测试和爬取
- **缓存**：`/Volumes/128/puppeteer-cache`
- **内存**：中高占用（用户内存充足）

## 🔑 GitHub Token管理

```bash
# Token信息
有效期：7天（2025-09-22到期）
权限：repo, gist, user

# 更新Token
编辑 ~/.codeium/windsurf/mcp_config.json
找到 "GITHUB_PERSONAL_ACCESS_TOKEN" 并替换
```

## 💾 内存优化措施

1. **外置SSD存储**
   - Memory数据：`/Volumes/128/mcp-memory/`
   - Puppeteer缓存：`/Volumes/128/puppeteer-cache/`
   - GitHub缓存：`/Volumes/128/github-cache/`

2. **精简选择**
   - 只启用必要服务
   - 禁用高内存占用服务

3. **缓存策略**
   - 使用外置存储缓存
   - 定期清理无用缓存

## 📊 性能提升

### 输出精确度提升
- **Sequential-thinking**：逐步推理
- **GitHub集成**：代码上下文理解
- **Memory持久化**：知识积累

### 内存占用优化
- 7个核心服务器（含Puppeteer）
- 使用外置SSD存储缓存
- 内存压力可控（用户63%）

## 🔧 维护指南

```bash
# 部署配置
./scripts/deploy-mcp-config.sh

# 备份配置
cp ~/.codeium/windsurf/mcp_config.json backup.json

# 测试GitHub连接
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/user

# 清理缓存
rm -rf /Volumes/128/puppeteer-cache/*
```

## ⚠️ 注意事项

1. GitHub token 7天后过期，需及时更新
2. 重启Windsurf后配置生效
3. 定期检查外置SSD可用空间
4. Memory文件会逐渐增大，定期备份
