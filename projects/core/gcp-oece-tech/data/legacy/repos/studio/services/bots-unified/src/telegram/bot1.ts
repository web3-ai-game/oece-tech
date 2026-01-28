import { Telegraf } from 'telegraf';

export async function startTelegramBot1() {
  const token = process.env.TELEGRAM_BOT_TOKEN_1;
  
  if (!token) {
    console.warn('⚠️  TELEGRAM_BOT_TOKEN_1 not configured');
    return;
  }

  const bot = new Telegraf(token);

  bot.start((ctx) => {
    ctx.reply('👋 你好！我是DeepWeay小爱同学，数字游民AI助手！\n\n输入 /help 查看我能做什么');
  });

  bot.help((ctx) => {
    ctx.reply(
      '🤖 我的功能：\n\n' +
      '/visa - 签证查询\n' +
      '/cost - 生活成本\n' +
      '/plan - 行程规划\n' +
      '/community - 找组织'
    );
  });

  bot.command('visa', (ctx) => {
    ctx.reply('📋 签证助手功能开发中...\n\n请访问 https://deepweay.me/ai-tools/visa-assistant');
  });

  bot.launch();
  console.log('✅ Telegram Bot 1 (@svsinst_bot) started');
}
