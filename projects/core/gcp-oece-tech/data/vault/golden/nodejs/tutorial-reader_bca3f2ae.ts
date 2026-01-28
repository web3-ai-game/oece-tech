import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { marked } from 'marked'

export interface Tutorial {
  slug: string
  title: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'hell'
  tags: string[]
  author: string
  points: number
  content: string
  htmlContent: string
  description?: string
  created: string
  updated: string
  views?: number
  likes?: number
}

// 教程目录路径
const TUTORIALS_DIR = path.join(process.cwd(), 'tutorials')

// 读取单个教程
export async function getTutorial(category: string, slug: string): Promise<Tutorial | null> {
  try {
    const filePath = path.join(TUTORIALS_DIR, category, `${slug}.md`)
    
    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      return null
    }
    
    const fileContent = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(fileContent)
    
    // 配置marked选项
    marked.setOptions({
      gfm: true,
      breaks: true
    })
    
    const htmlContent = marked(content)
    
    return {
      slug,
      title: data.title || 'Untitled',
      category: data.category || category,
      difficulty: data.difficulty || 'medium',
      tags: data.tags || [],
      author: data.author || 'anonymous',
      points: data.points || 0,
      content,
      htmlContent,
      description: data.description,
      created: data.created || new Date().toISOString().split('T')[0],
      updated: data.updated || new Date().toISOString().split('T')[0],
      views: data.views || 0,
      likes: data.likes || 0
    }
  } catch (error) {
    console.error('读取教程失败:', error)
    return null
  }
}

// 获取所有教程
export async function getAllTutorials(): Promise<Tutorial[]> {
  try {
    // 检查tutorials目录是否存在
    if (!fs.existsSync(TUTORIALS_DIR)) {
      return []
    }
    
    const categories = fs.readdirSync(TUTORIALS_DIR).filter(item => {
      const itemPath = path.join(TUTORIALS_DIR, item)
      return fs.statSync(itemPath).isDirectory()
    })
    
    const tutorials: Tutorial[] = []
    
    for (const category of categories) {
      const categoryPath = path.join(TUTORIALS_DIR, category)
      const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'))
      
      for (const file of files) {
        const slug = file.replace('.md', '')
        const tutorial = await getTutorial(category, slug)
        if (tutorial) {
          tutorials.push(tutorial)
        }
      }
    }
    
    return tutorials
  } catch (error) {
    console.error('获取所有教程失败:', error)
    return []
  }
}

// 按分类获取教程
export async function getTutorialsByCategory(category: string): Promise<Tutorial[]> {
  try {
    const categoryPath = path.join(TUTORIALS_DIR, category)
    
    if (!fs.existsSync(categoryPath)) {
      return []
    }
    
    const files = fs.readdirSync(categoryPath).filter(f => f.endsWith('.md'))
    const tutorials: Tutorial[] = []
    
    for (const file of files) {
      const slug = file.replace('.md', '')
      const tutorial = await getTutorial(category, slug)
      if (tutorial) {
        tutorials.push(tutorial)
      }
    }
    
    return tutorials
  } catch (error) {
    console.error('按分类获取教程失败:', error)
    return []
  }
}

// 搜索教程
export async function searchTutorials(query: string): Promise<Tutorial[]> {
  try {
    const allTutorials = await getAllTutorials()
    
    const lowerQuery = query.toLowerCase()
    
    return allTutorials.filter(tutorial => 
      tutorial.title.toLowerCase().includes(lowerQuery) ||
      tutorial.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      (tutorial.description && tutorial.description.toLowerCase().includes(lowerQuery))
    )
  } catch (error) {
    console.error('搜索教程失败:', error)
    return []
  }
}

// 获取相关教程
export async function getRelatedTutorials(tutorial: Tutorial, limit: number = 3): Promise<Tutorial[]> {
  try {
    const categoryTutorials = await getTutorialsByCategory(tutorial.category)
    
    // 过滤掉当前教程
    const others = categoryTutorials.filter(t => t.slug !== tutorial.slug)
    
    // 返回前N个
    return others.slice(0, limit)
  } catch (error) {
    console.error('获取相关教程失败:', error)
    return []
  }
}

// 获取教程统计
export async function getTutorialStats() {
  try {
    const allTutorials = await getAllTutorials()
    
    const stats = {
      total: allTutorials.length,
      byCategory: {} as Record<string, number>,
      byDifficulty: {
        easy: 0,
        medium: 0,
        hard: 0,
        hell: 0
      },
      totalViews: 0,
      totalLikes: 0
    }
    
    allTutorials.forEach(tutorial => {
      // 按分类统计
      stats.byCategory[tutorial.category] = (stats.byCategory[tutorial.category] || 0) + 1
      
      // 按难度统计
      stats.byDifficulty[tutorial.difficulty]++
      
      // 总浏览和点赞
      stats.totalViews += tutorial.views || 0
      stats.totalLikes += tutorial.likes || 0
    })
    
    return stats
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return null
  }
}
