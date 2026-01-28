import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface Tutorial {
  slug: string
  title: string
  description: string
  series: string
  seriesNumber: string
}

export interface Series {
  id: string
  name: string
  description: string
  icon: string
  color: string
  tutorials: Tutorial[]
}

export function getSeries(): Series[] {
  const tutorialsDirectory = path.join(process.cwd(), 'content/tutorials')

  if (!fs.existsSync(tutorialsDirectory)) {
    return []
  }

  const seriesConfig = [
    { id: '01', name: '核心技術棧', description: '全端開發環境、CI/CD、資料庫、安全實戰', icon: '🎯', color: 'cyan', folder: '01系列-核心技术栈' },
    { id: '02', name: 'AI工具鏈深度應用', description: 'JetBrains AI、GitLab Duo、Claude、Gemini實戰', icon: '🤖', color: 'pink', folder: '02系列-AI工具链深度应用' },
    { id: '03', name: '開發者轉型IP實戰', description: '技術博主、YouTube、內容變現', icon: '📱', color: 'purple', folder: '03系列-开发者转型IP实战' },
    { id: '04', name: '雲端基建與成本優化', description: 'GCP、DO、Cloudflare、監控告警', icon: '☁️', color: 'cyan', folder: '04系列-云端基建与成本优化' },
    { id: '05', name: '內容生產自動化', description: 'Markdown、AI寫作、SEO優化', icon: '📝', color: 'yellow', folder: '05系列-内容生产自动化' },
  ]

  return seriesConfig.map(config => {
    const seriesPath = path.join(tutorialsDirectory, config.folder)
    let tutorials: Tutorial[] = []

    if (fs.existsSync(seriesPath)) {
      const files = fs.readdirSync(seriesPath)
      tutorials = files
        .filter(file => file.endsWith('.md'))
        .map(file => {
          const filePath = path.join(seriesPath, file)
          const content = fs.readFileSync(filePath, 'utf8')
          const { data } = matter(content)
          
          // 从文件名提取序号和标题
          const match = file.match(/^(\d+\.\d+)[-_](.+)\.md$/)
          const seriesNumber = match ? match[1] : ''
          const title = data.title || (match ? match[2] : file.replace('.md', ''))
          
          // 提取摘要：优先用description，否则用content的第一段
          let description = data.description || data['摘要'] || ''
          if (!description) {
            const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#') && !line.startsWith('**'))
            description = lines[0] || ''
            // 限制长度
            if (description.length > 100) {
              description = description.substring(0, 100) + '...'
            }
          }

          return {
            slug: `${config.folder}/${file.replace('.md', '')}`,
            title,
            description,
            series: config.id,
            seriesNumber,
          }
        })
        .sort((a, b) => a.seriesNumber.localeCompare(b.seriesNumber))
        .slice(0, 10) // 只取前10篇
    }

    return {
      id: config.id,
      name: config.name,
      description: config.description,
      icon: config.icon,
      color: config.color,
      tutorials,
    }
  })
}
