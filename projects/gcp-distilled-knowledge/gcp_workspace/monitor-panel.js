#!/usr/bin/env node
/**
 * 🎯 GCP 开发环境完整监控面板
 * 监控: VPS资源、API消费、成本、服务状态
 * 刷新: 30秒自动刷新
 * 货币: 泰铢本位 (1 USD = 35 THB)
 */

const os = require('os');
const fs = require('fs');
const { exec } = require('child_process');
const util = require('util');
const execAsync = util.promisify(exec);

// 配置
const CONFIG = {
  refreshInterval: 60000, // 1分钟刷新
  usdToThb: 35, // 汇率
  logFile: '/home/svs-main-key/GCP/logs/monitor.log',
  costFile: '/home/svs-main-key/GCP/logs/costs.json',
  apiUsageFile: '/home/svs-main-key/GCP/logs/api-usage.json',
  width: 80 // 总宽度
};

// 确保日志目录存在
const logDir = '/home/svs-main-key/GCP/logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// 颜色代码
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// VPS 资源监控
class VPSMonitor {
  async getCPUUsage() {
    const cpus = os.cpus();
    const cpuCount = cpus.length;
    
    // 计算 CPU 使用率
    let totalIdle = 0;
    let totalTick = 0;
    
    cpus.forEach(cpu => {
      for (let type in cpu.times) {
        totalTick += cpu.times[type];
      }
      totalIdle += cpu.times.idle;
    });
    
    const idle = totalIdle / cpuCount;
    const total = totalTick / cpuCount;
    const usage = 100 - ~~(100 * idle / total);
    
    return {
      usage: usage,
      cores: cpuCount,
      model: cpus[0].model
    };
  }
  
  getMemoryUsage() {
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMem = totalMem - freeMem;
    const usage = (usedMem / totalMem * 100).toFixed(2);
    
    return {
      total: (totalMem / 1024 / 1024 / 1024).toFixed(2), // GB
      used: (usedMem / 1024 / 1024 / 1024).toFixed(2), // GB
      free: (freeMem / 1024 / 1024 / 1024).toFixed(2), // GB
      usage: usage
    };
  }
  
  async getDiskUsage() {
    try {
      const { stdout } = await execAsync('df -h / | tail -1');
      const parts = stdout.trim().split(/\s+/);
      
      return {
        total: parts[1],
        used: parts[2],
        free: parts[3],
        usage: parts[4]
      };
    } catch (error) {
      return { error: '无法获取磁盘信息' };
    }
  }
  
  getNetworkInfo() {
    const interfaces = os.networkInterfaces();
    const result = [];
    
    for (let name in interfaces) {
      interfaces[name].forEach(iface => {
        if (iface.family === 'IPv4' && !iface.internal) {
          result.push({
            name: name,
            ip: iface.address,
            mac: iface.mac
          });
        }
      });
    }
    
    return result;
  }
  
  getUptime() {
    const uptime = os.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    
    return `${days}天 ${hours}小时 ${minutes}分钟`;
  }
}

// API 使用监控
class APIMonitor {
  constructor() {
    this.usageData = this.loadUsageData();
  }
  
  loadUsageData() {
    try {
      if (fs.existsSync(CONFIG.apiUsageFile)) {
        return JSON.parse(fs.readFileSync(CONFIG.apiUsageFile, 'utf8'));
      }
    } catch (error) {
      console.error('加载 API 使用数据失败:', error);
    }
    
    return {
      gemini: { requests: 0, tokens: 0, cost: 0 },
      openrouter: { requests: 0, tokens: 0, cost: 0 },
      doppler: { requests: 0, cost: 0 },
      total: { requests: 0, tokens: 0, cost: 0 }
    };
  }
  
  saveUsageData() {
    try {
      fs.writeFileSync(
        CONFIG.apiUsageFile, 
        JSON.stringify(this.usageData, null, 2)
      );
    } catch (error) {
      console.error('保存 API 使用数据失败:', error);
    }
  }
  
  getGeminiUsage() {
    // 从日志文件读取 Gemini 使用情况
    const geminiLog = '/home/svs-main-key/GCP/logs/gemini-usage.log';
    if (!fs.existsSync(geminiLog)) {
      return this.usageData.gemini;
    }
    
    try {
      const logs = fs.readFileSync(geminiLog, 'utf8').split('\n').filter(Boolean);
      let requests = 0;
      let tokens = 0;
      let cost = 0;
      
      logs.forEach(line => {
        try {
          const data = JSON.parse(line);
          requests += 1;
          tokens += (data.inputTokens || 0) + (data.outputTokens || 0);
          cost += data.cost || 0;
        } catch (e) {
          // 忽略无效行
        }
      });
      
      return { requests, tokens, cost };
    } catch (error) {
      return this.usageData.gemini;
    }
  }
  
  getOpenRouterUsage() {
    // OpenRouter 余额: $1,111
    const balance = 1111;
    return {
      balance: balance,
      balanceThb: balance * CONFIG.usdToThb,
      requests: this.usageData.openrouter.requests || 0
    };
  }
  
  getDopplerUsage() {
    // Doppler 剩余额度
    const credit = 100; // $100 赠金
    const validDays = 90;
    
    return {
      credit: credit,
      creditThb: credit * CONFIG.usdToThb,
      validDays: validDays,
      requests: this.usageData.doppler.requests || 0
    };
  }
}

// 成本监控
class CostMonitor {
  constructor() {
    this.costs = this.loadCosts();
  }
  
  loadCosts() {
    try {
      if (fs.existsSync(CONFIG.costFile)) {
        return JSON.parse(fs.readFileSync(CONFIG.costFile, 'utf8'));
      }
    } catch (error) {
      console.error('加载成本数据失败:', error);
    }
    
    return {
      daily: { usd: 0, thb: 0 },
      monthly: { usd: 0, thb: 0 },
      total: { usd: 0, thb: 0 }
    };
  }
  
  saveCosts() {
    try {
      fs.writeFileSync(
        CONFIG.costFile, 
        JSON.stringify(this.costs, null, 2)
      );
    } catch (error) {
      console.error('保存成本数据失败:', error);
    }
  }
  
  calculateVPSCost() {
    // GCP 4vCPU 8GB 按需实例成本估算
    // 假设 $0.15/hour = 5.25 THB/hour
    const hourlyRate = 0.15;
    const hourlyRateThb = hourlyRate * CONFIG.usdToThb;
    
    const uptime = os.uptime() / 3600; // 小时
    const currentCost = uptime * hourlyRate;
    const currentCostThb = uptime * hourlyRateThb;
    
    return {
      hourlyRate: hourlyRateThb.toFixed(2),
      uptime: uptime.toFixed(2),
      current: currentCost.toFixed(4),
      currentThb: currentCostThb.toFixed(2)
    };
  }
  
  getTotalCost() {
    const vpsCost = this.calculateVPSCost();
    const geminiCost = 0; // 从 API 监控获取
    
    return {
      vps: parseFloat(vpsCost.currentThb),
      gemini: geminiCost,
      total: parseFloat(vpsCost.currentThb) + geminiCost
    };
  }
}

// PM2 进程监控
class PM2Monitor {
  async getProcesses() {
    try {
      const { stdout } = await execAsync('pm2 jlist');
      const processes = JSON.parse(stdout);
      
      return processes.map(proc => ({
        name: proc.name,
        status: proc.pm2_env.status,
        uptime: this.formatUptime(proc.pm2_env.pm_uptime),
        cpu: proc.monit.cpu + '%',
        memory: this.formatMemory(proc.monit.memory),
        restarts: proc.pm2_env.restart_time
      }));
    } catch (error) {
      return [];
    }
  }
  
  formatUptime(timestamp) {
    if (!timestamp) return 'N/A';
    const uptime = Date.now() - timestamp;
    const hours = Math.floor(uptime / 3600000);
    const minutes = Math.floor((uptime % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  }
  
  formatMemory(bytes) {
    return (bytes / 1024 / 1024).toFixed(2) + ' MB';
  }
}

// 主监控面板
class MonitorPanel {
  constructor() {
    this.vpsMonitor = new VPSMonitor();
    this.apiMonitor = new APIMonitor();
    this.costMonitor = new CostMonitor();
    this.pm2Monitor = new PM2Monitor();
  }
  
  clearScreen() {
    console.clear();
  }
  
  printHeader() {
    const now = new Date().toLocaleString('zh-CN', { 
      timeZone: 'Asia/Bangkok',
      hour12: false 
    });
    
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.bright}🎯 deepweay.me${colors.reset} ${colors.dim}${now}${colors.reset}`);
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  }
  
  async printVPSStats() {
    const cpu = await this.vpsMonitor.getCPUUsage();
    const mem = this.vpsMonitor.getMemoryUsage();
    const disk = await this.vpsMonitor.getDiskUsage();
    const uptime = this.vpsMonitor.getUptime();
    const vpsCost = this.costMonitor.calculateVPSCost();
    
    const cpuBar = this.createProgressBar(cpu.usage, 100, 20);
    const memBar = this.createProgressBar(parseFloat(mem.usage), 100, 20);
    const diskBar = this.createProgressBar(parseInt(disk.usage), 100, 20);
    
    console.log(`${colors.yellow}💻 VPS 资源${colors.reset}`);
    console.log(`CPU  ${cpuBar} ${cpu.usage}%`);
    console.log(`内存 ${memBar} ${mem.usage}%`);
    console.log(`磁盘 ${diskBar} ${disk.usage}`);
    console.log(`运行 ${uptime} | 成本 ${colors.yellow}${vpsCost.currentThb} THB${colors.reset}`);
    console.log();
  }
  
  createProgressBar(current, max, width = 15) {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    
    let color = colors.green;
    if (percentage > 80) color = colors.red;
    else if (percentage > 60) color = colors.yellow;
    
    return `${color}${'█'.repeat(filled)}${colors.reset}${'░'.repeat(empty)}`;
  }
  
  async printAPIStats() {
    const gemini = this.apiMonitor.getGeminiUsage();
    const openrouter = this.apiMonitor.getOpenRouterUsage();
    const doppler = this.apiMonitor.getDopplerUsage();
    
    console.log(`${colors.green}🔑 API 余额${colors.reset}`);
    console.log(`💎 Gemini      ${gemini.requests} 次  ${gemini.tokens.toLocaleString()} tokens  ${gemini.cost.toFixed(2)} USD`);
    console.log(`🚀 OpenRouter  ${colors.green}$${openrouter.balance}${colors.reset} 余额  ${openrouter.balanceThb.toFixed(0)} THB`);
    console.log(`🔐 Doppler     ${colors.green}$${doppler.credit}${colors.reset} 额度  ${doppler.validDays} 天有效`);
    console.log();
  }
  
  async printCostStats() {
    // 成本已在 VPS 栏显示，此函数留空
  }
  
  async printPM2Stats() {
    const processes = await this.pm2Monitor.getProcesses();
    
    console.log(`${colors.blue}🔥 PM2 进程${colors.reset}`);
    
    if (processes.length === 0) {
      console.log(`${colors.red}❌ 没有运行的进程${colors.reset}`);
    } else {
      processes.forEach((proc) => {
        const statusIcon = proc.status === 'online' ? '✅' : '❌';
        const statusColor = proc.status === 'online' ? colors.green : colors.red;
        
        console.log(`${statusIcon} ${proc.name.padEnd(15)} ${statusColor}${proc.status.toUpperCase()}${colors.reset} ${proc.uptime} CPU${proc.cpu} MEM${proc.memory}`);
      });
    }
    console.log();
  }
  
  printFooter() {
    console.log(`${colors.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
    console.log(`${colors.dim}🔄 1分钟刷新 | ⚡ Termius优化 | Ctrl+C退出${colors.reset}`);
    console.log();
  }
  
  async display() {
    this.clearScreen();
    this.printHeader();
    await this.printVPSStats();
    await this.printAPIStats();
    await this.printPM2Stats();
    this.printFooter();
  }
  
  async start() {
    // 首次显示
    await this.display();
    
    // 定时刷新
    setInterval(async () => {
      await this.display();
    }, CONFIG.refreshInterval);
  }
}

// 启动监控面板
if (require.main === module) {
  const panel = new MonitorPanel();
  panel.start();
  
  // 优雅退出
  process.on('SIGINT', () => {
    console.log('\n\n👋 监控面板已停止\n');
    process.exit(0);
  });
}

module.exports = MonitorPanel;
