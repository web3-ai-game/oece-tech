#!/usr/bin/env node

/**
 * 🌊 Windsurf MCP服务器模式
 * 监听所有对话，自动识别UI需求
 */

const NaturalLanguageUITrigger = require('./natural-language-ui-trigger.js');

class WindsurfMCPServer extends NaturalLanguageUITrigger {
  constructor() {
    super();
    this.setupMessageHandlers();
  }
  
  setupMessageHandlers() {
    // 监听stdin来处理MCP请求
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', (data) => {
      try {
        const request = JSON.parse(data);
        this.handleMCPRequest(request);
      } catch (error) {
        // 处理非JSON数据作为自然语言
        this.handleNaturalLanguage(data.toString().trim());
      }
    });
  }
  
  async handleMCPRequest(request) {
    if (request.method === 'conversation_intercept') {
      const response = await this.processConversation(request.params.message);
      if (response) {
        this.sendMCPResponse(request.id, {
          ui_suggestions: response,
          auto_triggered: true
        });
      }
    }
  }
  
  async handleNaturalLanguage(message) {
    const response = await this.processConversation(message);
    if (response) {
      console.log(JSON.stringify({
        type: 'ui_suggestion',
        message: response,
        timestamp: new Date().toISOString()
      }));
    }
  }
  
  sendMCPResponse(id, result) {
    const response = {
      jsonrpc: '2.0',
      id: id,
      result: result
    };
    console.log(JSON.stringify(response));
  }
}

// 启动MCP服务器
if (process.argv[2] === 'server') {
  const server = new WindsurfMCPServer();
  console.error('🌊 Windsurf UI资源MCP服务器已启动');
}
