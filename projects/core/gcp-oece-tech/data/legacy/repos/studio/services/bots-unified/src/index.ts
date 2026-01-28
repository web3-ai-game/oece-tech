import express from 'express';
import { startTelegramBot1 } from './telegram/bot1';
import { startTelegramBot2 } from './telegram/bot2';
import { startSlackBot } from './slack/bot';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'bots-unified' });
});

// Webhook endpoints
app.post('/webhook/telegram/bot1', (req, res) => {
  // Telegram Bot 1 webhook
  res.json({ received: true });
});

app.post('/webhook/telegram/bot2', (req, res) => {
  // Telegram Bot 2 webhook
  res.json({ received: true });
});

app.post('/webhook/slack', (req, res) => {
  // Slack webhook
  res.json({ received: true });
});

// Start all bots
async function startBots() {
  try {
    await startTelegramBot1();
    await startTelegramBot2();
    await startSlackBot();
    
    console.log('✅ All bots started successfully');
  } catch (error) {
    console.error('❌ Failed to start bots:', error);
  }
}

app.listen(PORT, () => {
  console.log(`🤖 Bot server running on port ${PORT}`);
  startBots();
});
