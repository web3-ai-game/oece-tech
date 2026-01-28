import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import winston from 'winston';
import NodeCache from 'node-cache';
import rateLimit from 'express-rate-limit';

dotenv.config();

const app = express();
const PORT = process.env.AI_TOOLS_PORT || 3003;

// Cache setup
const cache = new NodeCache({
  stdTTL: parseInt(process.env.TOOLS_CACHE_TTL || '3600'),
  checkperiod: 120,
});

// Logger setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/ai-tools-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/ai-tools-combined.log' }),
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

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'ai-tools',
    timestamp: new Date().toISOString(),
    cacheStats: cache.getStats(),
  });
});

// Text analysis tool
app.post('/api/tools/analyze', (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid text input' });
    }

    const words = text.trim().split(/\s+/);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;

    const analysis = {
      wordCount: words.length,
      sentenceCount: sentences.length,
      characterCount: characters,
      characterCountNoSpaces: charactersNoSpaces,
      averageWordLength: charactersNoSpaces / words.length,
      averageSentenceLength: words.length / sentences.length,
      readingTime: Math.ceil(words.length / 200), // minutes at 200 wpm
    };

    logger.info('Text analysis performed', { wordCount: analysis.wordCount });
    res.json(analysis);
  } catch (error) {
    logger.error('Text analysis error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Text summarization (basic extractive method)
app.post('/api/tools/summarize', (req, res) => {
  try {
    const { text, sentences = 3 } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid text input' });
    }

    const cacheKey = `summary_${text.substring(0, 50)}_${sentences}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      logger.info('Returning cached summary');
      return res.json({ summary: cached, cached: true });
    }

    // Simple sentence scoring based on word frequency
    const allSentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    
    // Calculate word frequencies
    const wordFreq = {};
    words.forEach(word => {
      if (word.length > 3) { // Ignore short words
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    // Score sentences
    const scoredSentences = allSentences.map(sentence => {
      const sentenceWords = sentence.toLowerCase().match(/\b\w+\b/g) || [];
      const score = sentenceWords.reduce((sum, word) => sum + (wordFreq[word] || 0), 0);
      return { sentence: sentence.trim(), score };
    });

    // Get top N sentences
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, Math.min(sentences, allSentences.length))
      .map(s => s.sentence);

    const summary = topSentences.join('. ') + '.';
    cache.set(cacheKey, summary);

    logger.info('Text summarization performed', { 
      originalSentences: allSentences.length,
      summarySentences: topSentences.length 
    });

    res.json({ summary, cached: false });
  } catch (error) {
    logger.error('Text summarization error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Keyword extraction
app.post('/api/tools/keywords', (req, res) => {
  try {
    const { text, count = 10 } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Invalid text input' });
    }

    const cacheKey = `keywords_${text.substring(0, 50)}_${count}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      logger.info('Returning cached keywords');
      return res.json({ keywords: cached, cached: true });
    }

    // Common stop words
    const stopWords = new Set([
      'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
      'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
      'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
      'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
    ]);

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFreq = {};

    words.forEach(word => {
      if (word.length > 3 && !stopWords.has(word)) {
        wordFreq[word] = (wordFreq[word] || 0) + 1;
      }
    });

    const keywords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([word, freq]) => ({ word, frequency: freq }));

    cache.set(cacheKey, keywords);

    logger.info('Keyword extraction performed', { keywordCount: keywords.length });
    res.json({ keywords, cached: false });
  } catch (error) {
    logger.error('Keyword extraction error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Code formatter/validator (basic)
app.post('/api/tools/format-code', (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Invalid code input' });
    }

    // Basic formatting for JavaScript
    if (language === 'javascript' || language === 'js') {
      const formatted = code
        .replace(/\s*{\s*/g, ' {\n  ')
        .replace(/\s*}\s*/g, '\n}\n')
        .replace(/;\s*/g, ';\n')
        .replace(/\n\s*\n/g, '\n');

      logger.info('Code formatting performed', { language });
      return res.json({ formatted, language });
    }

    // For other languages, return as-is
    logger.info('Code formatting skipped', { language });
    res.json({ formatted: code, language, message: 'Formatting not available for this language' });
  } catch (error) {
    logger.error('Code formatting error', { error: error.message });
    res.status(500).json({ error: error.message });
  }
});

// Cache management
app.get('/api/cache/stats', (req, res) => {
  res.json(cache.getStats());
});

app.post('/api/cache/clear', (req, res) => {
  cache.flushAll();
  logger.info('Cache cleared');
  res.json({ message: 'Cache cleared successfully' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  logger.info(`AI Tools service listening on port ${PORT}`);
});
