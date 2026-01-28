import { Telegraf } from 'telegraf';

export async function startTelegramBot2() {
  const token = process.env.TELEGRAM_BOT_TOKEN_2;
  
  if (!token) {
    console.warn('⚠️  TELEGRAM_BOT_TOKEN_2 not configured');
    return;
  }

  const bot = new Telegraf(token);

  bot.start((ctx) => {
    ctx.reply('👋 备用Bot已启动！');
  });

  bot.launch();
  console.log('✅ Telegram Bot 2 (@svslovea_bot) started');
}
