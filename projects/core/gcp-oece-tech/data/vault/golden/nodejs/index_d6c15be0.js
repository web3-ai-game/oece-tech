import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import winston from 'winston';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.AIBOT_PORT || 3002;

// Logger setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/aibot-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/aibot-combined.log' }),
  ],
});

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// AI clients
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const anthropic = process.env.ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  : null;

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'aibot',
    timestamp: new Date().toISOString(),
    openai: !!openai,
    anthropic: !!anthropic,
  });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model, provider = 'openai', temperature, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    logger.info('Chat request', { provider, model, messageCount: messages.length });

    let response;

    if (provider === 'openai' && openai) {
      const completion = await openai.chat.completions.create({
        model: model || process.env.AI_MODEL || 'gpt-4o-mini',
        messages,
        temperature: temperature || parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        max_tokens: max_tokens || parseInt(process.env.AI_MAX_TOKENS || '2000'),
      });

      response = {
        content: completion.choices[0].message.content,
        model: completion.model,
        usage: completion.usage,
        provider: 'openai',
      };
    } else if (provider === 'anthropic' && anthropic) {
      const completion = await anthropic.messages.create({
        model: model || 'claude-3-5-sonnet-20241022',
        max_tokens: max_tokens || parseInt(process.env.AI_MAX_TOKENS || '2000'),
        temperature: temperature || parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        messages,
      });

      response = {
        content: completion.content[0].text,
        model: completion.model,
        usage: completion.usage,
        provider: 'anthropic',
      };
    } else {
      return res.status(400).json({ error: 'Provider not configured or invalid' });
    }

    logger.info('Chat response', { provider, tokensUsed: response.usage });
    res.json(response);
  } catch (error) {
    logger.error('Chat error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: error.message });
  }
});

// Streaming chat endpoint
app.post('/api/chat/stream', async (req, res) => {
  try {
    const { messages, model, provider = 'openai', temperature, max_tokens } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    logger.info('Streaming chat request', { provider, model });

    if (provider === 'openai' && openai) {
      const stream = await openai.chat.completions.create({
        model: model || process.env.AI_MODEL || 'gpt-4o-mini',
        messages,
        temperature: temperature || parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        max_tokens: max_tokens || parseInt(process.env.AI_MAX_TOKENS || '2000'),
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          res.write(`data: ${JSON.stringify({ content })}\n\n`);
        }
      }
    } else if (provider === 'anthropic' && anthropic) {
      const stream = await anthropic.messages.create({
        model: model || 'claude-3-5-sonnet-20241022',
        max_tokens: max_tokens || parseInt(process.env.AI_MAX_TOKENS || '2000'),
        temperature: temperature || parseFloat(process.env.AI_TEMPERATURE || '0.7'),
        messages,
        stream: true,
      });

      for await (const event of stream) {
        if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
          res.write(`data: ${JSON.stringify({ content: event.delta.text })}\n\n`);
        }
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    logger.error('Streaming chat error', { error: error.message });
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// Models list
app.get('/api/models', (req, res) => {
  const models = {
    openai: openai ? ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'] : [],
    anthropic: anthropic
      ? ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229']
      : [],
  };

  res.json(models);
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`AI Bot service listening on port ${PORT}`);
  logger.info(`OpenAI configured: ${!!openai}`);
  logger.info(`Anthropic configured: ${!!anthropic}`);
});
