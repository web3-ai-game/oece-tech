# 项目配置备份目录

> **用途**: Windsurf账户切换和VPS部署的完整配置备份  
> **创建时间**: 2025-11-06  
> **项目**: Urban Diver (DeepWeay)

---

## 📁 目录结构

```
项目配置/
├── README.md                      ← 本文档
├── vps.md                         ← VPS部署完整指南 (重要⭐⭐⭐)
├── windsurf-rules-backup.md       ← 项目规则备份
├── windsurf-global-rules.md       ← 全局规则备份
├── mcp-settings.json              ← MCP服务器配置
└── 账户切换检查清单.md             ← 交接流程清单
```

---

## 🎯 使用场景

### 1. **Windsurf账户点数用完需要切换**
- 📖 阅读: `账户切换检查清单.md`
- 🔧 导入: `windsurf-global-rules.md` + `windsurf-rules-backup.md`
- ⚙️ 配置: `mcp-settings.json`

### 2. **VPS重建或更换服务器**
- 📖 阅读: `vps.md` (外挂盘策略部分)
- 🚀 执行: 按步骤操作摧毁+重建流程
- ✅ 验证: 使用检查清单确认

### 3. **新开发者加入项目**
- 📖 先读: `vps.md` (了解架构)
- 🔧 导入: 所有Windsurf配置
- 📋 跟随: `账户切换检查清单.md`

### 4. **准备下一个项目 (oece.tech)**
- 📖 参考: `vps.md` (外挂盘隔离策略)
- 🔄 复用: MCP配置 (但规则不复用)
- 📂 新建: `/mnt/external-ssd/svs/oece.tech`

---

## ⚡ 快速开始

### 新账户5分钟快速上手

```bash
# 1. 克隆项目
git clone git@github.com:web3-ai-game/studio.git
cd studio

# 2. 安装依赖
npm install

# 3. 复制环境变量
cp .env.local.example .env.local
# 编辑填入真实token

# 4. 在Windsurf中导入配置
# - Settings → Memories → Global Rules → 粘贴 windsurf-global-rules.md
# - Settings → Memories → Project Rules → 粘贴 windsurf-rules-backup.md
# - Settings → MCP Servers → 按 mcp-settings.json 配置

# 5. 验证
npm run dev
# 访问 http://localhost:3000
```

---

## 📋 文件说明

### `vps.md` ⭐⭐⭐ (最重要)

**包含内容**:
- 当前VPS信息 (IP: 134.209.142.24)
- 外挂盘策略详解 (20GB SSD)
- VPS摧毁+重建完整流程
- Windsurf账户切换指南
- 必需Token清单
- 项目状态快照
- 常用命令速查

**何时阅读**: 
- 切换账户前必读
- VPS重建前必读
- 新开发者入职必读

---

### `windsurf-rules-backup.md`

**包含内容**:
- 项目特定配置 (Urban Diver)
- 环境变量清单
- 关键文件位置
- 用户分层系统
- 邀请码机制
- 设计Token
- 部署配置
- 品牌指南

**何时使用**: 
- 在Windsurf中设置 "Project Rules"
- 新账户首次配置时
- 项目规则需要恢复时

---

### `windsurf-global-rules.md`

**包含内容**:
- 语言策略 (English + 繁中)
- 技术栈规范
- 设计系统
- 项目结构
- 代码标准
- React模式
- 认证与安全
- 性能优化
- AI集成
- 品牌语音
- MCP工具集成
- 自动化优先原则

**何时使用**: 
- 在Windsurf中设置 "Global Rules"
- 新账户首次配置时
- 全局规则需要恢复时

---

### `mcp-settings.json`

**包含内容**:
- 5个MCP服务器完整配置
  - `filesystem` - 文件操作
  - `github-mcp-server` - Git操作
  - `memory` - 知识图谱
  - `sequential-thinking` - 复杂推理
  - `supabase-mcp-server` - 数据库操作
- Token占位符
- 设置说明
- 验证命令

**何时使用**: 
- 在Windsurf中配置 MCP Servers
- 需要重新设置MCP工具时

**注意**: 
- 替换 `YOUR_TOKEN_HERE` 为真实token
- GitHub PAT需要 `repo` + `workflow` 权限
- Supabase token从项目设置获取

---

### `账户切换检查清单.md`

**包含内容**:
- 切换前准备 (14项检查)
- 新账户设置 (8大步骤)
- 常见问题解决 (5个Q&A)
- 切换完成验证清单
- 继续开发建议

**何时使用**: 
- 当前账户点数即将用完
- 切换新账户前按清单执行
- 作为交接文档给下一个开发者

---

## 🔐 安全提示

### ⚠️ 不要提交的文件

```bash
# 已在 .gitignore 中
.env.local           # 包含真实API keys
.env.production      # 生产环境密钥
mcp_*.json          # 本地MCP配置（含真实token）
```

### ✅ 已安全备份的配置

- ✅ 项目规则 (无敏感信息)
- ✅ 全局规则 (无敏感信息)
- ✅ MCP配置模板 (占位符)
- ✅ VPS流程文档 (无密钥)

### 🔑 Token管理建议

1. **使用密码管理器** (如1Password, Bitwarden)
2. **定期轮换Token** (3-6个月)
3. **最小权限原则** (只给需要的权限)
4. **不同项目用不同Token**
5. **泄露立即撤销并重新生成**

---

## 🚨 紧急情况处理

### 场景1: VPS突然无法访问
```bash
# 检查DO控制台Droplet状态
# 如果需要重建，外挂盘数据安全
# 参考 vps.md 的重建流程
```

### 场景2: GitHub token失效
```bash
# 重新生成PAT
# 更新 mcp-settings.json
# 在Windsurf中重新配置GitHub MCP
```

### 场景3: Windsurf配置丢失
```bash
# 所有配置都在此目录
# 按 账户切换检查清单.md 重新导入
```

### 场景4: 代码误删
```bash
# Git历史完整保留
git log --oneline
git checkout <commit-hash> -- <file>
```

---

## 📊 维护计划

### 定期更新 (建议)

- **每周**: 无需更新（配置稳定）
- **功能完成时**: 更新项目状态快照
- **VPS变更时**: 更新vps.md的IP和配置
- **规则调整时**: 更新对应的rules文件
- **账户切换后**: 验证所有配置可用性

### 更新检查清单

- [ ] `vps.md` 的VPS信息准确
- [ ] `windsurf-rules-backup.md` 的环境变量完整
- [ ] `windsurf-global-rules.md` 的技术栈版本正确
- [ ] `mcp-settings.json` 的工具列表完整
- [ ] `账户切换检查清单.md` 的步骤可操作

---

## 🔗 相关资源

- **GitHub仓库**: https://github.com/web3-ai-game/studio
- **Supabase项目**: https://supabase.com/dashboard/project/qhgdymgxcbyhtxezvoqt
- **DigitalOcean**: https://cloud.digitalocean.com
- **Windsurf下载**: https://www.codeium.com/windsurf
- **域名管理**: deepweay.me DNS控制台

---

## 💡 最佳实践

1. **账户切换前**: 
   - ✅ 完成所有功能开发
   - ✅ Push所有代码
   - ✅ 备份数据库
   - ✅ 记录开发进度

2. **新账户首日**:
   - ✅ 验证所有MCP工具
   - ✅ 测试完整开发流程
   - ✅ 确认VPS连接
   - ✅ 运行一次完整测试

3. **日常开发**:
   - ✅ 每天结束前push代码
   - ✅ 重要功能完成立即备份
   - ✅ 定期检查外挂盘可用性
   - ✅ 保持配置文件更新

---

**文档维护者**: Cascade AI  
**最后更新**: 2025-11-06  
**下次检查**: 账户切换时或重大变更时
