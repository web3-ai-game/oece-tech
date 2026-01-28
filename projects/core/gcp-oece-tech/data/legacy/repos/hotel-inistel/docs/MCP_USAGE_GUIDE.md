# Hotel Inistel MCP使用指南 🚀

## 概述
Model Context Protocol (MCP) 已成功配置并集成到Hotel Inistel项目中。本指南将帮助您充分利用MCP的强大功能来提升开发效率。

## 🛠️ 已配置的MCP服务器

### 核心服务器 (已启用)

#### 1. 文件系统服务器 (`filesystem`)
- **功能**: 读写项目文件，管理目录结构
- **允许访问路径**: 
  - `/Users/svs.loline/Documents/xiangmu/hotel-inistel/`
  - `/Users/svs.loline/Documents/xiangmu/hotel-inistel/hotel-ui/`
  - `/Volumes/128`
- **使用场景**: 代码编辑、文件管理、项目结构调整

#### 2. 内存服务器 (`memory`)
- **功能**: 存储项目知识图谱和重要信息
- **存储位置**: `.windsurf/memory.json`
- **使用场景**: 项目文档、开发记录、架构决策存储

#### 3. SQLite服务器 (`sqlite`)
- **功能**: 管理本地SQLite数据库
- **数据库路径**: `database/hotel.db`
- **使用场景**: 开发环境数据管理、测试数据操作

#### 4. Git服务器 (`git`)
- **功能**: 版本控制管理
- **仓库路径**: 项目根目录
- **使用场景**: 代码提交、分支管理、版本历史

#### 5. Notion服务器 (`notion`)
- **功能**: 项目文档和任务管理
- **API密钥**: 已配置（需要有效的Notion API密钥）
- **使用场景**: 项目规划、文档同步、任务跟踪

#### 6. Firebase服务器 (`firebase`)
- **功能**: 实时数据库和认证服务
- **项目ID**: `hotel-inistel`
- **使用场景**: 用户认证、实时数据同步

### 开发工具服务器

#### 7. Puppeteer服务器 (`puppeteer`)
- **功能**: 浏览器自动化测试
- **使用场景**: UI测试、网页抓取、自动化测试

#### 8. Playwright服务器 (`playwright`)
- **功能**: 端到端测试
- **使用场景**: 跨浏览器测试、UI自动化

#### 9. Docker服务器 (`docker`)
- **功能**: 容器管理和部署
- **使用场景**: 应用容器化、部署管理

#### 10. Fetch服务器 (`fetch`)
- **功能**: HTTP请求和API测试
- **使用场景**: API测试、外部服务集成

## 🎯 MCP使用最佳实践

### 1. 文件操作
```bash
# 使用文件系统MCP服务器进行文件操作
- 读取文件: 直接请求查看文件内容
- 创建文件: 请求创建新的组件或配置文件
- 编辑文件: 请求修改现有代码
- 目录管理: 创建新的文件夹结构
```

### 2. 数据库管理
```sql
-- 使用SQLite MCP服务器执行数据库操作
SELECT * FROM tenants;
INSERT INTO customers (tenant_id, first_name, last_name, email) 
VALUES (1, '测试', '用户', 'test@example.com');
```

### 3. 项目记忆管理
```javascript
// 使用内存MCP服务器存储项目信息
- 记录重要的架构决策
- 存储开发进度和里程碑
- 保存问题解决方案
- 维护项目知识库
```

### 4. 版本控制
```bash
# 使用Git MCP服务器管理代码
- 查看提交历史
- 创建新分支
- 合并代码
- 查看文件变更
```

## 🚀 快速开始示例

### 示例1: 创建新的React组件
```
请求: "创建一个新的酒店房间卡片组件"
MCP将会:
1. 使用文件系统服务器创建组件文件
2. 使用内存服务器记录组件信息
3. 使用Git服务器跟踪文件变更
```

### 示例2: 数据库查询和分析
```
请求: "查询所有可用房间并分析入住率"
MCP将会:
1. 使用SQLite服务器执行查询
2. 分析数据并生成报告
3. 使用内存服务器记录分析结果
```

### 示例3: 部署和测试
```
请求: "构建Docker镜像并运行测试"
MCP将会:
1. 使用Docker服务器构建镜像
2. 使用Playwright服务器运行测试
3. 使用Git服务器提交变更
```

## 🔧 配置管理

### 环境变量配置
MCP服务器的配置存储在以下文件中:
- `.windsurf/mcp-enhanced.json` - 主要MCP配置
- `.windsurf/.env.mcp` - MCP环境变量
- `.env` - 应用程序环境变量

### 启用/禁用服务器
在 `mcp-enhanced.json` 中设置 `"disabled": true/false` 来控制服务器状态。

## 📊 监控和调试

### 测试MCP功能
运行测试脚本检查MCP服务器状态:
```bash
node scripts/test-mcp.js
```

### 常见问题排查
1. **服务器无响应**: 检查网络连接和API密钥
2. **权限错误**: 确认文件路径权限
3. **数据库连接失败**: 检查数据库文件是否存在

## 🎉 高级功能

### 1. 多服务器协作
MCP支持多个服务器同时工作，例如:
- 文件系统 + Git: 代码编辑和版本控制
- SQLite + 内存: 数据分析和结果记录
- Docker + Playwright: 部署和测试

### 2. 自动化工作流
通过MCP可以创建复杂的自动化工作流:
```
开发流程: 编码 → 测试 → 提交 → 部署
MCP支持: filesystem → playwright → git → docker
```

## 📚 参考资源

- [MCP官方文档](https://modelcontextprotocol.io/)
- [Hotel Inistel项目文档](./PROJECT_SUMMARY.md)
- [数据库架构](../database/init.sql)
- [Docker配置](../docker-compose.yml)

---

**🎯 提示**: MCP的真正威力在于多个服务器的协同工作。尝试组合使用不同的服务器来完成复杂的开发任务！