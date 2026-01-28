#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const Database = require('better-sqlite3')

// 確保 database 目錄存在
const dbDir = path.join(__dirname, '..', 'database')
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
  console.log('✅ 創建 database 目錄')
}

// 數據庫路徑
const dbPath = path.join(dbDir, 'geeksea.db')

// 如果數據庫已存在，先備份
if (fs.existsSync(dbPath)) {
  const backupPath = path.join(dbDir, `geeksea-backup-${Date.now()}.db`)
  fs.copyFileSync(dbPath, backupPath)
  console.log(`📦 已備份現有數據庫到: ${backupPath}`)
}

// 創建數據庫連接
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')

console.log('🚀 開始初始化數據庫...')

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
console.log('✅ Users 表創建成功')

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
console.log('✅ Tutorials 表創建成功')

// Tutorial Tags 表
db.exec(`
  CREATE TABLE IF NOT EXISTS tutorial_tags (
    tutorial_id INTEGER,
    tag TEXT NOT NULL,
    FOREIGN KEY (tutorial_id) REFERENCES tutorials(id) ON DELETE CASCADE
  )
`)
console.log('✅ Tutorial Tags 表創建成功')

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
console.log('✅ User Progress 表創建成功')

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
console.log('✅ Comments 表創建成功')

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
console.log('✅ Likes 表創建成功')

db.close()

console.log('\n🎉 數據庫初始化完成！')
console.log(`📍 數據庫位置: ${dbPath}`)
console.log('\n下一步: 運行 npm run db:seed 來填充示例數據')
