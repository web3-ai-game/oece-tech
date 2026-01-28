const functions = require('@google-cloud/functions-framework');
const { Client } = require('@notionhq/client');
const cors = require('cors');

// 初始化Notion客户端
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// CORS中间件
const corsHandler = cors({ origin: true });

functions.http('handleNotionWebhook', async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      console.log('Received webhook:', req.body);
      
      // 处理不同类型的Notion事件
      switch (req.body.event_type) {
        case 'page_created':
          await handlePageCreated(req.body.page);
          break;
        case 'page_updated': 
          await handlePageUpdated(req.body.page);
          break;
        case 'database_updated':
          await handleDatabaseUpdated(req.body.database);
          break;
        default:
          console.log('Unhandled event type:', req.body.event_type);
      }
      
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error processing webhook:', error);
      res.status(500).json({ error: error.message });
    }
  });
});

async function handlePageCreated(page) {
  // 任务创建逻辑
  console.log('New task created:', page.id);
  
  // 获取页面属性
  const response = await notion.pages.retrieve({ page_id: page.id });
  const properties = response.properties;
  
  // 根据任务类型触发相应操作
  const taskType = properties.Type?.select?.name;
  if (taskType === 'Code Generation') {
    await triggerCodeGeneration(page);
  }
}

async function handlePageUpdated(page) {
  // 任务更新逻辑
  console.log('Task updated:', page.id);
}

async function handleDatabaseUpdated(database) {
  // 数据库更新逻辑
  console.log('Database updated:', database.id);
}

async function triggerCodeGeneration(page) {
  // 触发代码生成的逻辑
  // 可以调用其他服务或发送通知
  console.log('Triggering code generation for:', page.id);
}

module.exports = { handleNotionWebhook };
