#!/usr/bin/env node

// 测试自然语言触发是否正常工作
const testMessages = [
  "我想美化一下这个酒店管理界面",
  "需要添加一些现代化的按钮组件", 
  "帮我设计一个数据可视化的仪表板",
  "想要集成一些游戏娱乐功能到系统中",
  "这个页面的布局需要优化一下"
];

console.log('🧪 测试Windsurf自然语言UI触发...\n');

const NaturalLanguageUITrigger = require('./natural-language-ui-trigger.js');
const trigger = new NaturalLanguageUITrigger();

async function testAll() {
  for (let i = 0; i < testMessages.length; i++) {
    const message = testMessages[i];
    console.log(`\n📝 测试 ${i + 1}: "${message}"`);
    console.log('─'.repeat(50));
    
    const response = await trigger.processConversation(message);
    if (response) {
      console.log('✅ 自动触发成功！');
      console.log('🎨 推荐内容:');
      console.log(response.split('\n').slice(0, 5).join('\n') + '...\n');
    } else {
      console.log('❌ 未触发UI推荐\n');
    }
  }
}

testAll();
