# 🌊 SMS-Key 宇宙虚空驾驶舱 | GCP 开发环境

> **环境**: GCP 4vCPU 8GB | **域名**: deepweay.me | **核心**: 向量喷射 + 多变人格
> 
> **最后更新**: 2025-11-26

[![Node.js](https://img.shields.io/badge/Node.js-22.21.0-green.svg)](https://nodejs.org/)
[![Gemini](https://img.shields.io/badge/Gemini-3.0_Pro-blue.svg)](https://ai.google.dev/)
[![Windsurf](https://img.shields.io/badge/Windsurf-Ready-orange.svg)](https://windsurf.com/)

---

## 🎉 最新功能 (2025-11-26)

### 🎭 全能人格生成器

**12 种 AI 人格**，化繁为简，自动路由：

```bash
# 列出所有人格
node 全能人格生成器.js list

# 自动识别（智能路由）
node 全能人格生成器.js "设计一个高并发微服务架构"
→ 🏗️ 技术架构师 (T:0.3, gemini-3-pro)

# 手动指定人格
node 全能人格生成器.js creative_writer "写产品介绍文案"
→ ✍️ 创意文案 (T:0.9, gemini-2.5-flash)
```

**12 种内置人格**:
- 🏗️ 技术架构师 | 💻 全栈工程师 | 🧠 AI研究员 | 📊 产品经理
- 🚀 DevOps专家 | 📈 数据分析师 | ✍️ 创意文案 | 🔐 安全专家
- 🎨 UI设计师 | 👨‍🏫 技术导师 | 🤖 TG客服 | 👀 代码审查员

### 🌊 Windsurf 宇宙虚空驾驶舱

**登录即用**的完整配置：
- ✅ `.windsurf/settings.json` - 编辑器配置
- ✅ `.windsurf/rules.md` - 自动化规则与人格系统
- ✅ 5 种自动触发人格
- ✅ 3 个预定义工作流
- ✅ 密钥自动注入（Doppler）
- ✅ 自动化流水线 50-75% 完成

📖 **[查看完整指南](./Windsurf快速启动指南.md)**

### 📚 完整文档

- 📘 [Go并发向量调用架构](./Go并发向量调用架构.md) - Go/Python 双方案
- 🔐 [多普勒密钥管理手册](./多普勒密钥管理手册.md) - Doppler 完整教程
- 🌊 [Windsurf快速启动指南](./Windsurf快速启动指南.md) - 宇宙虚空驾驶舱

---

## 📋 目录

- [系统架构](#-系统架构)
- [快速开始](#-快速开始)
- [监控面板](#-监控面板-1-命令)
- [服务管理](#-服务管理)
- [开机自启动](#-开机自启动)
- [关机保存](#-关机保存)
- [域名访问](#-域名访问)
- [成本监控](#-成本监控泰铢本位)
- [故障排查](#-故障排查)

---

## 🏗️ 系统架构

```
GCP 开发环境
├── 📊 监控面板 (monitor-panel.js)
│   ├── VPS 资源监控 (CPU, 内存, 磁盘)
│   ├── API 使用监控 (Gemini, OpenRouter, Doppler)
│   ├── 成本监控 (泰铢本位)
│   └── PM2 进程监控
│
├── 🧹 数据清洗服务 (notion-cleaner)
│   ├── Notion 数据抓取
│   ├── Gemini 3 Pro 清洗
│   └── 向量化预处理
│
├── 🌐 Web 服务 (deepweay.me)
│   ├── 静态页面展示
│   ├── API 健康检查
│   └── 系统信息接口
│
└── 🔐 环境变量管理
    ├── sms-key 密钥库
    ├── 明文部署
    └── PM2 自动加载
```

---

## 🚀 快速开始

### 首次部署

```bash
# 1. 部署环境变量
bash /home/svs-main-key/GCP/deploy-env.sh

# 2. 启动所有服务
bash /home/svs-main-key/GCP/startup.sh

# 3. 查看监控面板
1
```

### 日常使用

```bash
# 查看监控面板（30秒自动刷新）
1

# 查看所有服务状态
pm2 list

# 查看实时日志
pm2 logs

# 停止所有服务
gcp-stop

# 重启所有服务
gcp-restart
```

---

## 📊 监控面板 (1 命令)

### 监控内容

**1. VPS 资源监控 (30秒刷新)**
- ✅ CPU 使用率 (4 核心)
- ✅ 内存使用 (8GB)
- ✅ 磁盘使用
- ✅ 网络 IP 地址
- ✅ 系统运行时间

**2. API 使用监控**
- 💎 **Gemini API**
  - 请求次数
  - Token 消耗
  - 成本 (USD + THB)
- 🚀 **OpenRouter**
  - 余额: $1,111 (38,885 THB)
  - 请求次数
- 🔐 **Doppler**
  - 额度: $100 (3,500 THB)
  - 有效期: 90 天

**3. 成本监控 (泰铢本位)**
- 🖥️ VPS 费用 (按小时计费)
- 💎 API 费用 (实时追踪)
- 📊 总计成本

**4. PM2 进程监控**
- ✅ 进程状态 (online/stopped)
- ⏱️ 运行时间
- 🔄 重启次数
- 📊 CPU 使用率
- 💾 内存使用

### 使用方法

```bash
# 查看监控面板
1

# 或使用完整命令
pm2 logs monitor-panel --lines 100

# 退出监控
Ctrl + C
```

---

## 🔥 服务管理

### 全局命令

```bash
gcp-start      # 启动所有服务
gcp-stop       # 停止所有服务
gcp-restart    # 重启所有服务
gcp-help       # 显示所有命令
```

### Notion 数据清洗

```bash
notion-start   # 启动 Notion 清洗
notion-stop    # 停止清洗
notion-restart # 重启清洗
notion-logs    # 查看清洗日志
```

### Web 服务

```bash
web-start      # 启动 Web 服务器 (端口 3000)
web-stop       # 停止 Web 服务器
web-logs       # 查看 Web 日志
```

### PM2 管理

```bash
pm2-status     # 查看进程列表
pm2-monitor    # 实时监控面板
pm2-logs       # 查看所有日志
```

---

## 🔄 开机自启动

### 配置方法

**1. PM2 开机自启动 (推荐)**

```bash
# 生成 systemd 服务
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u svs-main-key --hp /home/svs-main-key

# 保存当前进程列表
pm2 save
```

**2. 验证自启动**

```bash
# 查看 PM2 服务状态
systemctl status pm2-svs-main-key

# 重启机器测试
sudo reboot
```

### 启动顺序

1. 系统启动
2. PM2 自动启动
3. 加载环境变量 (.env.local)
4. 启动 notion-cleaner
5. 启动 monitor-panel
6. 启动 web-server (可选)

---

## 💾 关机保存

### 自动保存机制

**检测周期**: 30 秒

**关机时自动执行**:
1. 保存 PM2 进程状态
2. 备份日志文件
3. 保存成本数据
4. 保存 API 使用数据
5. 优雅停止所有进程

### 手动保存

```bash
# 执行关机脚本
bash /home/svs-main-key/GCP/shutdown.sh

# 或使用 PM2 保存
pm2 save
```

### 数据持久化位置

```
/home/svs-main-key/GCP/logs/
├── startup.log              # 启动日志
├── shutdown.log             # 关机日志
├── monitor-panel.log        # 监控面板日志
├── notion-cleaner.log       # 数据清洗日志
├── costs.json               # 成本数据
├── api-usage.json           # API 使用数据
└── backup_*.tar.gz          # 日志备份
```

---

## 🌐 域名访问

### 域名配置

**域名**: `deepweay.me`  
**DNS**: A 记录指向 GCP IP  
**服务**: Nginx 反向代理到 Node.js (端口 3000)

### 访问方式

```bash
# 浏览器访问
http://deepweay.me

# API 健康检查
curl http://deepweay.me/api/status

# 系统信息
curl http://deepweay.me/api/info
```

### 本地测试

```bash
# 启动 Web 服务
web-start

# 测试本地访问
curl http://localhost:3000
curl http://localhost:3000/api/status
```

---

## 💰 成本监控(泰铢本位)

### 汇率

**1 USD = 35 THB** (泰铢)

### VPS 成本

**GCP 4vCPU 8GB 按需实例**:
- 小时费率: ~5.25 THB/小时
- 日费率: ~126 THB/天
- 月费率: ~3,780 THB/月

**节省策略**:
- ⏸️ 开发时开机，睡觉时关机
- 📊 30 秒检测关机自动保存
- 💾 仅保留硬盘和 IP (固定费用)

### API 成本

**Gemini 3 Pro**:
- 输入: $1.25/1M tokens = 43.75 THB/1M
- 输出: $5.00/1M tokens = 175 THB/1M
- 估算: 30 页清洗 ≈ 108 THB (一顿午餐)

**OpenRouter**:
- 余额: $1,111 (38,885 THB)
- 按需扣费

**Doppler**:
- 赠金: $100 (3,500 THB)
- 有效期: 90 天

### 查看成本

```bash
# 查看总成本
cost-show

# 查看 API 使用
api-usage

# 重置成本统计
cost-reset
```

---

## 🐛 故障排查

### 问题1: PM2 进程停止

```bash
# 查看进程状态
pm2 list

# 重启停止的进程
pm2 restart all

# 查看错误日志
pm2 logs --err
```

### 问题2: 环境变量未加载

```bash
# 重新部署环境变量
env-deploy

# 手动加载
source /home/svs-main-key/GCP/.env.local

# 验证环境变量
env-show
```

### 问题3: 监控面板不显示

```bash
# 检查监控进程
pm2 show monitor-panel

# 重启监控面板
pm2 restart monitor-panel

# 查看日志
pm2 logs monitor-panel
```

### 问题4: 端口占用

```bash
# 查看端口占用
netstat -tuln | grep 3000

# 杀死占用进程
kill -9 $(lsof -t -i:3000)

# 重启服务
pm2 restart web-server
```

### 问题5: 磁盘空间不足

```bash
# 查看磁盘使用
df -h

# 清理日志
cd /home/svs-main-key/GCP/logs
rm -f *.log.old
rm -f backup_*.tar.gz

# 清理 npm 缓存
npm cache clean --force

# 清理 PM2 日志
pm2 flush
```

---

## 📚 文件结构

```
/home/svs-main-key/GCP/
├── monitor-panel.js         # 监控面板主程序
├── startup.sh               # 启动脚本
├── shutdown.sh              # 关机脚本
├── deploy-env.sh            # 环境变量部署
├── aliases.sh               # 快捷命令
├── .env.local               # 环境变量 (明文密钥)
│
├── deepweay-sms/            # 数据清洗项目
│   ├── scripts/
│   │   └── extract_core_content.js
│   ├── ecosystem.config.json
│   └── logs/
│
├── sms-key/                 # 密钥库
│   ├── .env.doppler
│   ├── README.md
│   └── AI_KEY_調用規則_v3_速率優先.md
│
├── web/                     # Web 服务
│   ├── index.html
│   ├── server.js
│   └── package.json
│
└── logs/                    # 日志目录
    ├── startup.log
    ├── shutdown.log
    ├── monitor-panel.log
    ├── costs.json
    └── api-usage.json
```

---

## 🎯 开发工作流

### 早上开机

```bash
# 1. SSH 连接到 GCP
ssh your-gcp-instance

# 2. 启动所有服务
gcp-start

# 3. 查看监控面板
1

# 4. 开始开发
cd /home/svs-main-key/GCP/deepweay-sms
```

### 晚上关机

```bash
# 1. 保存所有工作
git add . && git commit -m "今日工作" && git push

# 2. 停止所有服务（自动保存）
gcp-stop

# 3. 退出 SSH
exit

# 4. 关闭 GCP 实例（GCP Console 或 gcloud CLI）
gcloud compute instances stop your-instance-name
```

### 监控查看

```bash
# 实时监控 (30秒刷新)
1

# 查看成本
cost-show

# 查看 API 使用
api-usage

# 查看系统资源
sys-cpu
sys-mem
sys-disk
```

---

## 🔐 安全提示

1. **环境变量安全**
   - ✅ `.env.local` 权限设为 600
   - ✅ 不提交到 Git
   - ✅ 定期轮换密钥

2. **SSH 安全**
   - ✅ 使用 Ed25519 密钥
   - ✅ 禁用密码登录
   - ✅ 配置防火墙规则

3. **成本控制**
   - ✅ 不用时关机
   - ✅ 监控 API 使用
   - ✅ 设置预算警报

4. **数据备份**
   - ✅ 定期推送到 GitHub
   - ✅ 日志自动备份
   - ✅ PM2 自动保存

---

## 📞 支持

有问题或需要帮助？

- 📖 查看文档: `/home/svs-main-key/GCP/README.md`
- 💬 查看帮助: `gcp-help`
- 🔍 查看日志: `pm2 logs`

---

**项目**: SMS 数据清洗  
**环境**: GCP 4vCPU 8GB  
**域名**: deepweay.me  
**状态**: ✅ Production Ready  
**维护**: DeepWeay Labs  
**更新**: 2025-11-26
