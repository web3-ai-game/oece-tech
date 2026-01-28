#!/usr/bin/env node

const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const os = require('os');

// 配置文件路径
const configPath = path.join(os.homedir(), '.gemini-cli-config.json');

// 加载配置
function loadConfig() {
  try {
    if (fs.existsSync(configPath)) {
      return JSON.parse(fs.readFileSync(configPath, 'utf8'));
    }
  } catch (error) {
    console.error('加载配置失败:', error.message);
  }
  return {};
}

// 保存配置
function saveConfig(config) {
  try {
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('保存配置失败:', error.message);
  }
}

// 获取 API Key
function getApiKey() {
  const config = loadConfig();
  
  // 从环境变量获取
  if (process.env.GEMINI_API_KEY) {
    return process.env.GEMINI_API_KEY;
  }
  
  // 从配置文件获取
  if (config.apiKey) {
    return config.apiKey;
  }
  
  console.error('❌ 未找到 Gemini API Key');
  console.log('请设置环境变量 GEMINI_API_KEY 或运行: gemini-cli config set-key <your-api-key>');
  process.exit(1);
}

// 初始化 Gemini
function initGemini() {
  const apiKey = getApiKey();
  return new GoogleGenerativeAI(apiKey);
}

// 生成内容
async function generateContent(prompt, options = {}) {
  try {
    const genAI = initGemini();
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    console.log('🤖 Gemini 正在思考...\n');
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('💡 回复:');
    console.log(text);
    
    // 保存对话历史
    if (options.saveHistory) {
      saveConversation(prompt, text);
    }
    
  } catch (error) {
    console.error('❌ 生成内容失败:', error.message);
    process.exit(1);
  }
}

// 保存对话历史
function saveConversation(prompt, response) {
  const config = loadConfig();
  const history = config.history || [];
  
  history.push({
    timestamp: new Date().toISOString(),
    prompt: prompt,
    response: response
  });
  
  // 限制历史记录数量
  if (history.length > 100) {
    history.shift();
  }
  
  config.history = history;
  saveConfig(config);
}

// 显示帮助信息
function showHelp() {
  console.log(`
🤖 Gemini CLI - 命令行 AI 助手

使用方法:
  gemini-cli <prompt>           # 直接提问
  gemini-cli config set-key <key> # 设置 API Key
  gemini-cli config get-key       # 获取 API Key
  gemini-cli history             # 查看对话历史
  gemini-cli clear-history       # 清除对话历史
  gemini-cli help                # 显示帮助信息

环境变量:
  GEMINI_API_KEY                 # Gemini API Key

示例:
  gemini-cli "解释量子计算"
  gemini-cli "帮我写一个 Python 脚本"
  gemini-cli config set-key YOUR_API_KEY
`);
}

// 配置管理
async function handleConfig(args) {
  const action = args[0];
  
  switch (action) {
    case 'set-key':
      const apiKey = args[1];
      if (!apiKey) {
        console.error('❌ 请提供 API Key');
        process.exit(1);
      }
      
      const config = loadConfig();
      config.apiKey = apiKey;
      saveConfig(config);
      console.log('✅ API Key 已保存');
      break;
      
    case 'get-key':
      const currentConfig = loadConfig();
      if (currentConfig.apiKey) {
        console.log('🔑 API Key:', currentConfig.apiKey.substring(0, 10) + '...');
      } else {
        console.log('❌ 未找到 API Key');
      }
      break;
      
    default:
      console.error('❌ 未知的配置命令');
      process.exit(1);
  }
}

// 显示历史记录
function showHistory() {
  const config = loadConfig();
  const history = config.history || [];
  
  if (history.length === 0) {
    console.log('📚 暂无对话历史');
    return;
  }
  
  console.log('📚 最近对话历史:\n');
  history.slice(-10).reverse().forEach((item, index) => {
    console.log(`--- 对话 ${index + 1} ---`);
    console.log(`时间: ${new Date(item.timestamp).toLocaleString()}`);
    console.log(`问题: ${item.prompt}`);
    console.log(`回复: ${item.response.substring(0, 200)}${item.response.length > 200 ? '...' : ''}`);
    console.log('');
  });
}

// 清除历史记录
function clearHistory() {
  const config = loadConfig();
  config.history = [];
  saveConfig(config);
  console.log('✅ 对话历史已清除');
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return;
  }
  
  switch (args[0]) {
    case 'config':
      await handleConfig(args.slice(1));
      break;
      
    case 'history':
      showHistory();
      break;
      
    case 'clear-history':
      clearHistory();
      break;
      
    default:
      // 处理普通提问
      const prompt = args.join(' ');
      await generateContent(prompt, { saveHistory: true });
      break;
  }
}

// 运行主函数
main().catch(error => {
  console.error('❌ 程序错误:', error);
  process.exit(1);
});