import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import winston from 'winston';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

dotenv.config();

const { Pool } = pg;
const app = express();
const PORT = process.env.FORUM_PORT || 3004;

// Logger setup
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/forum-error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/forum-combined.log' }),
  ],
});

// Database connection
const pool = new Pool({
  host: process.env.FORUM_DB_HOST || 'localhost',
  port: parseInt(process.env.FORUM_DB_PORT || '5432'),
  database: process.env.FORUM_DB_NAME || 'forum',
  user: process.env.FORUM_DB_USER || 'forum_user',
  password: process.env.FORUM_DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Initialize database schema
async function initDatabase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS topics (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_locked BOOLEAN DEFAULT FALSE,
        is_pinned BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        topic_id INTEGER REFERENCES topics(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        content TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_deleted BOOLEAN DEFAULT FALSE
      );

      CREATE INDEX IF NOT EXISTS idx_topics_user ON topics(user_id);
      CREATE INDEX IF NOT EXISTS idx_posts_topic ON posts(topic_id);
      CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
    `);
    logger.info('Database schema initialized');
  } catch (error) {
    logger.error('Database initialization error', { error: error.message });
    throw error;
  }
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Auth middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Health check
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({
      status: 'healthy',
      service: 'forum',
      timestamp: new Date().toISOString(),
      database: 'connected',
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      service: 'forum',
      database: 'disconnected',
      error: error.message,
    });
  }
});

// User registration
app.post('/api/auth/register', [
  body('username').isLength({ min: 3, max: 50 }).trim(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, email, passwordHash]
    );

    logger.info('User registered', { userId: result.rows[0].id, username });
    res.status(201).json({ user: result.rows[0] });
  } catch (error) {
    logger.error('Registration error', { error: error.message });
    if (error.code === '23505') { // Unique violation
      res.status(400).json({ error: 'Username or email already exists' });
    } else {
      res.status(500).json({ error: 'Registration failed' });
    }
  }
});

// User login
app.post('/api/auth/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info('User logged in', { userId: user.id, username: user.username });
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    logger.error('Login error', { error: error.message });
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get topics
app.get('/api/topics', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT t.*, u.username, 
        (SELECT COUNT(*) FROM posts p WHERE p.topic_id = t.id) as post_count
       FROM topics t
       JOIN users u ON t.user_id = u.id
       ORDER BY t.is_pinned DESC, t.updated_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countResult = await pool.query('SELECT COUNT(*) FROM topics');

    res.json({
      topics: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    logger.error('Get topics error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Create topic
app.post('/api/topics', authenticate, [
  body('title').isLength({ min: 5, max: 255 }).trim(),
  body('description').optional().trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description } = req.body;
    const result = await pool.query(
      'INSERT INTO topics (title, description, user_id) VALUES ($1, $2, $3) RETURNING *',
      [title, description, req.userId]
    );

    logger.info('Topic created', { topicId: result.rows[0].id, userId: req.userId });
    res.status(201).json({ topic: result.rows[0] });
  } catch (error) {
    logger.error('Create topic error', { error: error.message });
    res.status(500).json({ error: 'Failed to create topic' });
  }
});

// Get posts for a topic
app.get('/api/topics/:topicId/posts', async (req, res) => {
  try {
    const { topicId } = req.params;
    const { page = 1, limit = 50 } = req.query;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      `SELECT p.*, u.username
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.topic_id = $1 AND p.is_deleted = FALSE
       ORDER BY p.created_at ASC
       LIMIT $2 OFFSET $3`,
      [topicId, limit, offset]
    );

    const countResult = await pool.query(
      'SELECT COUNT(*) FROM posts WHERE topic_id = $1 AND is_deleted = FALSE',
      [topicId]
    );

    res.json({
      posts: result.rows,
      total: parseInt(countResult.rows[0].count),
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    logger.error('Get posts error', { error: error.message });
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Create post
app.post('/api/topics/:topicId/posts', authenticate, [
  body('content').isLength({ min: 1, max: 10000 }).trim(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { topicId } = req.params;
    const { content } = req.body;

    // Check if topic exists and is not locked
    const topicResult = await pool.query(
      'SELECT is_locked FROM topics WHERE id = $1',
      [topicId]
    );

    if (topicResult.rows.length === 0) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    if (topicResult.rows[0].is_locked) {
      return res.status(403).json({ error: 'Topic is locked' });
    }

    const result = await pool.query(
      'INSERT INTO posts (topic_id, user_id, content) VALUES ($1, $2, $3) RETURNING *',
      [topicId, req.userId, content]
    );

    // Update topic updated_at
    await pool.query('UPDATE topics SET updated_at = CURRENT_TIMESTAMP WHERE id = $1', [topicId]);

    logger.info('Post created', { postId: result.rows[0].id, topicId, userId: req.userId });
    res.status(201).json({ post: result.rows[0] });
  } catch (error) {
    logger.error('Create post error', { error: error.message });
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error', { error: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
async function start() {
  try {
    await initDatabase();
    app.listen(PORT, () => {
      logger.info(`Forum service listening on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start forum service', { error: error.message });
    process.exit(1);
  }
}

start();
