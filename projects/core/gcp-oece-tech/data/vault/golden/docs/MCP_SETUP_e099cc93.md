# MCP (Model Context Protocol) 配置指南

## ✅ 已安装的MCP环境

### 已安装组件

1. **Node.js v20.19.5** - MCP运行时环境
2. **npm v10.8.2** - 包管理器
3. **@modelcontextprotocol/sdk** - MCP官方SDK
4. **@modelcontextprotocol/server-filesystem** - 文件系统MCP服务器
5. **@modelcontextprotocol/inspector** - MCP调试工具

---

## 📁 配置文件

### 全局配置
位置: `/root/.config/mcp/mcp-config.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["/root"],
      "description": "File system access for VPS root directory"
    }
  }
}
```

### 项目配置
位置: `/root/once-ye-s/.mcp.json`

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "mcp-server-filesystem",
      "args": ["/root/once-ye-s"],
      "description": "File system access for once-ye-s project",
      "allowedPaths": ["/root/once-ye-s"]
    },
    "vps-root": {
      "command": "mcp-server-filesystem",
      "args": ["/root"],
      "description": "VPS root directory access",
      "allowedPaths": ["/root"]
    }
  },
  "defaults": {
    "timeout": 30000,
    "retries": 3
  }
}
```

---

## 🧪 测试MCP

### 快速测试

```bash
# 运行测试脚本
node /root/test-mcp.js
```

应该看到：
```
✅ MCP服务器已启动
📍 监控目录: /root/once-ye-s
📥 收到响应
✅ MCP服务器工作正常！
```

### 手动测试

```bash
# 启动文件系统MCP服务器
mcp-server-filesystem /root/once-ye-s

# 列出已安装的MCP包
npm list -g | grep mcp
```

---

## 🔧 MCP功能

### 文件系统操作

MCP文件系统服务器提供以下功能：

1. **读取文件** - 读取项目中的任何文件
2. **写入文件** - 创建和修改文件
3. **列出目录** - 查看目录结构
4. **搜索文件** - 在项目中搜索文件
5. **监控变化** - 实时监控文件变化

### 使用示例

在支持MCP的应用中（如Claude Desktop、Windsurf等）：

```javascript
// 使用MCP SDK
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

const transport = new StdioClientTransport({
  command: 'mcp-server-filesystem',
  args: ['/root/once-ye-s']
});

const client = new Client({
  name: 'my-client',
  version: '1.0.0'
}, {
  capabilities: {}
});

await client.connect(transport);
```

---

## 🛠️ 常用命令

### 查看MCP状态

```bash
# 检查MCP服务器是否安装
which mcp-server-filesystem

# 查看版本
npm list -g @modelcontextprotocol/server-filesystem

# 测试MCP
node /root/test-mcp.js
```

### 管理MCP服务器

```bash
# 更新MCP服务器
npm update -g @modelcontextprotocol/server-filesystem

# 重新安装
npm install -g @modelcontextprotocol/server-filesystem --force

# 卸载
npm uninstall -g @modelcontextprotocol/server-filesystem
```

---

## 🔌 集成到项目

### 在Node.js项目中使用

1. **安装依赖**
```bash
cd /root/once-ye-s
npm install @modelcontextprotocol/sdk
```

2. **创建MCP客户端**
```javascript
// src/common/mcp-client.js
const { Client } = require('@modelcontextprotocol/sdk/client/index.js');
const { StdioClientTransport } = require('@modelcontextprotocol/sdk/client/stdio.js');

class MCPFileSystem {
  constructor(rootPath) {
    this.rootPath = rootPath;
    this.client = null;
  }

  async connect() {
    const transport = new StdioClientTransport({
      command: 'mcp-server-filesystem',
      args: [this.rootPath]
    });

    this.client = new Client({
      name: 'once-ye-s',
      version: '1.0.0'
    }, {
      capabilities: {}
    });

    await this.client.connect(transport);
    console.log('✅ MCP连接成功');
  }

  async readFile(path) {
    // 使用MCP读取文件
    // 实现具体逻辑
  }

  async writeFile(path, content) {
    // 使用MCP写入文件
    // 实现具体逻辑
  }
}

module.exports = MCPFileSystem;
```

### 在Python项目中使用

```bash
pip install mcp
```

```python
# src/common/mcp_client.py
import subprocess
import json

class MCPFileSystem:
    def __init__(self, root_path):
        self.root_path = root_path
        self.process = None
    
    def start(self):
        self.process = subprocess.Popen(
            ['mcp-server-filesystem', self.root_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        print('✅ MCP连接成功')
    
    def read_file(self, path):
        # 实现文件读取
        pass
```

---

## 📚 MCP资源

### 官方文档
- [MCP官网](https://modelcontextprotocol.io/)
- [GitHub](https://github.com/modelcontextprotocol)
- [SDK文档](https://github.com/modelcontextprotocol/typescript-sdk)

### 可用的MCP服务器

```bash
# 文件系统
npm install -g @modelcontextprotocol/server-filesystem

# Git操作
npm install -g @modelcontextprotocol/server-git

# 数据库
npm install -g @modelcontextprotocol/server-postgres

# HTTP请求
npm install -g @modelcontextprotocol/server-fetch
```

---

## 🔐 安全注意事项

1. **限制访问路径**
   - 在配置中使用 `allowedPaths` 限制MCP可以访问的目录
   
2. **权限管理**
   - MCP服务器以当前用户权限运行
   - 避免给予不必要的文件系统访问权限

3. **监控日志**
   - 定期检查MCP操作日志
   - 监控异常访问

---

## 🐛 故障排除

### MCP服务器无法启动

```bash
# 检查Node.js
node --version

# 重新安装MCP
npm install -g @modelcontextprotocol/server-filesystem --force

# 测试
node /root/test-mcp.js
```

### 权限错误

```bash
# 确保目录可访问
chmod 755 /root/once-ye-s

# 检查配置文件
cat /root/once-ye-s/.mcp.json
```

### 连接超时

```bash
# 增加超时时间
# 编辑 .mcp.json
{
  "defaults": {
    "timeout": 60000  // 60秒
  }
}
```

---

## ✅ 验证清单

- [x] Node.js v20+ 已安装
- [x] npm v10+ 已安装
- [x] MCP SDK 已安装
- [x] 文件系统MCP服务器已安装
- [x] 配置文件已创建
- [x] 测试脚本运行成功

---

## 🚀 下一步

1. **集成到Bot** - 在Telegram Bot中使用MCP读写配置
2. **文件监控** - 监控项目文件变化
3. **自动化操作** - 使用MCP实现自动化任务
4. **扩展功能** - 添加更多MCP服务器

---

**MCP环境已完全配置！** 🎉

现在你可以在项目中使用MCP进行文件操作和其他功能。
