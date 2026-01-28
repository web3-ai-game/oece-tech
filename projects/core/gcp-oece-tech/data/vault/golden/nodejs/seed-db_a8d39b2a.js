#!/usr/bin/env node

const Database = require('better-sqlite3')
const path = require('path')
const bcrypt = require('bcryptjs')

const dbPath = path.join(__dirname, '..', 'database', 'geeksea.db')
const db = new Database(dbPath)

console.log('🌱 開始填充示例數據...')

// 創建示例用戶
console.log('👤 創建示例用戶...')

const users = [
  {
    username: 'web3_master',
    email: 'web3@geeksea.com',
    password: bcrypt.hashSync('Password123', 10),
    display_name: 'Web3 大師',
    bio: '專注於區塊鏈和 Web3 技術',
  },
  {
    username: 'frontend_pro',
    email: 'frontend@geeksea.com',
    password: bcrypt.hashSync('Password123', 10),
    display_name: '前端專家',
    bio: 'React 和 Next.js 開發專家',
  },
  {
    username: 'defi_expert',
    email: 'defi@geeksea.com',
    password: bcrypt.hashSync('Password123', 10),
    display_name: 'DeFi 專家',
    bio: '去中心化金融協議開發',
  },
]

const userStmt = db.prepare(`
  INSERT INTO users (username, email, password_hash, display_name, bio)
  VALUES (?, ?, ?, ?, ?)
`)

users.forEach(user => {
  try {
    userStmt.run(user.username, user.email, user.password, user.display_name, user.bio)
    console.log(`✅ 創建用戶: ${user.username}`)
  } catch (err) {
    console.log(`⚠️  用戶已存在: ${user.username}`)
  }
})

// 創建示例教程
console.log('\n📚 創建示例教程...')

const tutorials = [
  {
    slug: 'solidity-smart-contracts-basics',
    title: 'Solidity 智能合約基礎',
    title_en: 'Solidity Smart Contracts Basics',
    description: '從零開始學習 Solidity，掌握智能合約開發的核心概念和最佳實踐',
    content: '# Solidity 智能合約基礎\n\n本教程將帶你深入學習 Solidity...',
    category: 'web3',
    difficulty: 'beginner',
    duration: 120,
    author_id: 1,
    published: 1,
    tags: ['Solidity', 'Ethereum', 'Smart Contracts'],
  },
  {
    slug: 'nextjs-14-app-router',
    title: 'Next.js 14 App Router 完全指南',
    title_en: 'Complete Guide to Next.js 14 App Router',
    description: '深入了解 Next.js 14 的 App Router，構建現代化的 React 應用',
    content: '# Next.js 14 App Router\n\n全新的路由系統...',
    category: 'frontend',
    difficulty: 'intermediate',
    duration: 180,
    author_id: 2,
    published: 1,
    tags: ['Next.js', 'React', 'TypeScript'],
  },
  {
    slug: 'defi-protocol-development',
    title: 'DeFi 協議開發實戰',
    title_en: 'DeFi Protocol Development',
    description: '學習如何構建去中心化金融協議，包括借貸、DEX、流動性挖礦',
    content: '# DeFi 協議開發\n\n構建自己的 DeFi 協議...',
    category: 'web3',
    difficulty: 'advanced',
    duration: 240,
    author_id: 3,
    published: 1,
    tags: ['DeFi', 'Solidity', 'Web3'],
  },
  {
    slug: 'pixel-art-css',
    title: '像素藝術與 CSS',
    title_en: 'Pixel Art with CSS',
    description: '使用 CSS 創建復古像素藝術風格，打造獨特的視覺效果',
    content: '# 像素藝術與 CSS\n\n創建復古風格...',
    category: 'design',
    difficulty: 'beginner',
    duration: 90,
    author_id: 2,
    published: 1,
    tags: ['CSS', 'Pixel Art', 'Design'],
  },
  {
    slug: 'nodejs-api-development',
    title: 'Node.js RESTful API 開發',
    title_en: 'Node.js RESTful API Development',
    description: '構建可擴展的 RESTful API，學習 Express、中間件、認證等',
    content: '# Node.js API 開發\n\n構建專業的 API...',
    category: 'backend',
    difficulty: 'intermediate',
    duration: 150,
    author_id: 2,
    published: 1,
    tags: ['Node.js', 'Express', 'API'],
  },
  {
    slug: 'docker-kubernetes-basics',
    title: 'Docker 與 Kubernetes 入門',
    title_en: 'Docker & Kubernetes Basics',
    description: '學習容器化部署和容器編排，掌握現代化的 DevOps 技能',
    content: '# Docker 與 Kubernetes\n\n容器化部署...',
    category: 'tools',
    difficulty: 'intermediate',
    duration: 200,
    author_id: 1,
    published: 1,
    tags: ['Docker', 'Kubernetes', 'DevOps'],
  },
]

const tutorialStmt = db.prepare(`
  INSERT INTO tutorials (slug, title, title_en, description, content, category, difficulty, duration, author_id, published)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`)

const tagStmt = db.prepare(`
  INSERT INTO tutorial_tags (tutorial_id, tag)
  VALUES (?, ?)
`)

tutorials.forEach(tutorial => {
  try {
    const result = tutorialStmt.run(
      tutorial.slug,
      tutorial.title,
      tutorial.title_en,
      tutorial.description,
      tutorial.content,
      tutorial.category,
      tutorial.difficulty,
      tutorial.duration,
      tutorial.author_id,
      tutorial.published
    )
    
    const tutorialId = result.lastInsertRowid
    
    // 添加標籤
    tutorial.tags.forEach(tag => {
      tagStmt.run(tutorialId, tag)
    })
    
    console.log(`✅ 創建教程: ${tutorial.title}`)
  } catch (err) {
    console.log(`⚠️  教程已存在: ${tutorial.slug}`)
  }
})

// 更新統計數據
console.log('\n📊 更新統計數據...')

const updateViewsStmt = db.prepare(`
  UPDATE tutorials SET view_count = ? WHERE slug = ?
`)

const updateLikesStmt = db.prepare(`
  UPDATE tutorials SET like_count = ? WHERE slug = ?
`)

const stats = {
  'solidity-smart-contracts-basics': { views: 1250, likes: 89 },
  'nextjs-14-app-router': { views: 2340, likes: 156 },
  'defi-protocol-development': { views: 980, likes: 72 },
  'pixel-art-css': { views: 1560, likes: 123 },
  'nodejs-api-development': { views: 1890, likes: 134 },
  'docker-kubernetes-basics': { views: 2100, likes: 167 },
}

Object.entries(stats).forEach(([slug, data]) => {
  updateViewsStmt.run(data.views, slug)
  updateLikesStmt.run(data.likes, slug)
})

console.log('✅ 統計數據更新完成')

db.close()

console.log('\n🎉 示例數據填充完成！')
console.log('\n📝 測試帳號:')
console.log('   郵箱: web3@geeksea.com')
console.log('   密碼: Password123')
console.log('\n🚀 運行 npm run dev 啟動應用')
