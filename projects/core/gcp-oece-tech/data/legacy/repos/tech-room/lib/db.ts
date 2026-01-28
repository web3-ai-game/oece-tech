import Database from 'better-sqlite3'
import path from 'path'

// 數據庫路徑
const dbPath = path.join(process.cwd(), 'database', 'geeksea.db')

// 創建數據庫連接
let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    initDatabase()
  }
  return db
}

// 初始化數據庫表
function initDatabase() {
  const db = getDb()

  // Users 表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT,
      avatar_url TEXT,
      bio TEXT,
      role TEXT DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Tutorials 表
  db.exec(`
    CREATE TABLE IF NOT EXISTS tutorials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      title_en TEXT NOT NULL,
      description TEXT,
      content TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      duration INTEGER,
      author_id INTEGER,
      view_count INTEGER DEFAULT 0,
      like_count INTEGER DEFAULT 0,
      published BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    )
  `)

  // Tutorial Tags 表
  db.exec(`
    CREATE TABLE IF NOT EXISTS tutorial_tags (
      tutorial_id INTEGER,
      tag TEXT NOT NULL,
      FOREIGN KEY (tutorial_id) REFERENCES tutorials(id) ON DELETE CASCADE
    )
  `)

  // User Progress 表
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tutorial_id INTEGER NOT NULL,
      progress INTEGER DEFAULT 0,
      completed BOOLEAN DEFAULT 0,
      last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tutorial_id) REFERENCES tutorials(id) ON DELETE CASCADE,
      UNIQUE(user_id, tutorial_id)
    )
  `)

  // Comments 表
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tutorial_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      parent_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (tutorial_id) REFERENCES tutorials(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
    )
  `)

  // Likes 表
  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      tutorial_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (tutorial_id) REFERENCES tutorials(id) ON DELETE CASCADE,
      UNIQUE(user_id, tutorial_id)
    )
  `)

  console.log('✅ Database initialized successfully')
}

// User 相關操作
export const userQueries = {
  create: (username: string, email: string, passwordHash: string) => {
    const db = getDb()
    const stmt = db.prepare(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)'
    )
    return stmt.run(username, email, passwordHash)
  },

  findByEmail: (email: string) => {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
    return stmt.get(email) as any
  },

  findByUsername: (username: string) => {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM users WHERE username = ?')
    return stmt.get(username) as any
  },

  findById: (id: number) => {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
    return stmt.get(id) as any
  },

  update: (id: number, data: unknown) => {
    const db = getDb()
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ')
    const values = [...Object.values(data), id]
    const stmt = db.prepare(`UPDATE users SET ${fields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    return stmt.run(...values)
  },
}

// Tutorial 相關操作
export const tutorialQueries = {
  create: (data: unknown) => {
    const db = getDb()
    const stmt = db.prepare(`
      INSERT INTO tutorials (slug, title, title_en, description, content, category, difficulty, duration, author_id, published)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)
    return stmt.run(
      data.slug,
      data.title,
      data.titleEn,
      data.description,
      data.content,
      data.category,
      data.difficulty,
      data.duration,
      data.authorId,
      data.published ? 1 : 0
    )
  },

  findAll: (filters?: { category?: string; difficulty?: string; published?: boolean }) => {
    const db = getDb()
    let query = 'SELECT * FROM tutorials WHERE 1=1'
    const params: unknown[] = []

    if (filters?.category) {
      query += ' AND category = ?'
      params.push(filters.category)
    }

    if (filters?.difficulty) {
      query += ' AND difficulty = ?'
      params.push(filters.difficulty)
    }

    if (filters?.published !== undefined) {
      query += ' AND published = ?'
      params.push(filters.published ? 1 : 0)
    }

    query += ' ORDER BY created_at DESC'

    const stmt = db.prepare(query)
    return stmt.all(...params)
  },

  findBySlug: (slug: string) => {
    const db = getDb()
    const stmt = db.prepare('SELECT * FROM tutorials WHERE slug = ?')
    return stmt.get(slug) as any
  },

  incrementViewCount: (id: number) => {
    const db = getDb()
    const stmt = db.prepare('UPDATE tutorials SET view_count = view_count + 1 WHERE id = ?')
    return stmt.run(id)
  },

  addTag: (tutorialId: number, tag: string) => {
    const db = getDb()
    const stmt = db.prepare('INSERT INTO tutorial_tags (tutorial_id, tag) VALUES (?, ?)')
    return stmt.run(tutorialId, tag)
  },

  getTags: (tutorialId: number) => {
    const db = getDb()
    const stmt = db.prepare('SELECT tag FROM tutorial_tags WHERE tutorial_id = ?')
    return stmt.all(tutorialId).map((row: unknown) => row.tag)
  },
}

// 關閉數據庫連接（應用程序退出時）
export function closeDb() {
  if (db) {
    db.close()
  }
}

// 類型定義
export interface User {
  id: number
  username: string
  email: string
  password_hash: string
  display_name?: string
  avatar_url?: string
  bio?: string
  role: string
  created_at: string
  updated_at: string
}

export interface Tutorial {
  id: number
  slug: string
  title: string
  title_en: string
  description?: string
  content: string
  category: string
  difficulty: string
  duration?: number
  author_id?: number
  view_count: number
  like_count: number
  published: boolean
  created_at: string
  updated_at: string
}
