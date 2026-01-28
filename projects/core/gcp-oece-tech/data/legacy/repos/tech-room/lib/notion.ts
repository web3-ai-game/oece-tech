// Notion API 集成 - 教程数据源

import { Client } from '@notionhq/client'

// 初始化 Notion 客户端
const notion = new Client({
  auth: process.env.NOTION_API_KEY || ''
})

const DATABASE_ID = process.env.NOTION_DATABASE_ID || ''

// 教程数据类型
export interface Tutorial {
  id: string
  notionId: string
  title: string
  titleEn: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard' | 'hell'
  tags: string[]
  description: string
  descriptionEn: string
  content: string
  contentEn: string
  author: string
  pointsRequired: number
  views: number
  likes: number
  verified: boolean
  createdAt: string
  updatedAt: string
  coverImage?: string
  estimatedTime?: string
}

// 教程分类
export const categories = [
  {
    id: 'getting-started',
    name: '出海第一步',
    nameEn: 'Getting Started',
    icon: '🚀',
    color: 'primary'
  },
  {
    id: 'vpn-tech',
    name: 'VPN/SS技術',
    nameEn: 'VPN/SS Tech',
    icon: '🔐',
    color: 'accent'
  },
  {
    id: 'social-engineering',
    name: '社會工程學',
    nameEn: 'Social Engineering',
    icon: '🕵️',
    color: 'warning'
  },
  {
    id: 'kali-linux',
    name: 'Kali實戰',
    nameEn: 'Kali Linux',
    icon: '🐧',
    color: 'secondary'
  },
  {
    id: 'anonymity',
    name: '匿名化技術',
    nameEn: 'Anonymity Tech',
    icon: '🛡️',
    color: 'primary'
  },
  {
    id: 'ssh-remote',
    name: 'SSH/遠程技巧',
    nameEn: 'SSH & Remote',
    icon: '💻',
    color: 'accent'
  },
  {
    id: 'hardware',
    name: '硬件改裝',
    nameEn: 'Hardware Mod',
    icon: '🔧',
    color: 'warning'
  },
  {
    id: 'anti-tracking',
    name: '反跟蹤反偵察',
    nameEn: 'Anti-Tracking',
    icon: '🎯',
    color: 'danger'
  },
  {
    id: 'virtual-env',
    name: '虛擬環境搭建',
    nameEn: 'Virtual Environment',
    icon: '🎮',
    color: 'primary'
  },
  {
    id: 'avoid-pitfalls',
    name: '跳坑第一站',
    nameEn: 'Avoid Pitfalls',
    icon: '🌐',
    color: 'accent'
  }
]

// 获取所有教程
export async function getTutorials(options?: {
  category?: string
  difficulty?: string
  verified?: boolean
  limit?: number
}): Promise<Tutorial[]> {
  try {
    const filters: unknown[] = [
      {
        property: 'Published',
        checkbox: {
          equals: true
        }
      }
    ]
    
    if (options?.category) {
      filters.push({
        property: 'Category',
        select: {
          equals: options.category
        }
      })
    }
    
    if (options?.difficulty) {
      filters.push({
        property: 'Difficulty',
        select: {
          equals: options.difficulty
        }
      })
    }
    
    if (options?.verified !== undefined) {
      filters.push({
        property: 'Verified',
        checkbox: {
          equals: options.verified
        }
      })
    }
    
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: filters.length > 1 ? {
        and: filters
      } : filters[0],
      sorts: [
        {
          property: 'CreatedAt',
          direction: 'descending'
        }
      ],
      page_size: options?.limit || 100
    })
    
    return response.results.map(parseTutorial)
  } catch (error) {
    console.error('Error fetching tutorials from Notion:', error)
    return []
  }
}

// 获取单个教程
export async function getTutorial(id: string): Promise<Tutorial | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id })
    const blocks = await notion.blocks.children.list({ 
      block_id: id,
      page_size: 100 
    })
    
    const tutorial = parseTutorial(page)
    tutorial.content = await parseBlocks(blocks.results)
    
    return tutorial
  } catch (error) {
    console.error('Error fetching tutorial from Notion:', error)
    return null
  }
}

// 解析 Notion 页面为教程对象
function parseTutorial(page: unknown): Tutorial {
  const props = page.properties
  
  return {
    id: page.id,
    notionId: page.id,
    title: getPlainText(props.Title || props.Name),
    titleEn: getPlainText(props.TitleEN),
    category: getSelect(props.Category),
    difficulty: getSelect(props.Difficulty) as any || 'medium',
    tags: getMultiSelect(props.Tags),
    description: getPlainText(props.Description),
    descriptionEn: getPlainText(props.DescriptionEN),
    content: '',
    contentEn: '',
    author: getPlainText(props.Author) || 'Anonymous',
    pointsRequired: getNumber(props.Points) || 0,
    views: getNumber(props.Views) || 0,
    likes: getNumber(props.Likes) || 0,
    verified: getCheckbox(props.Verified),
    createdAt: props.CreatedAt?.date?.start || page.created_time,
    updatedAt: props.UpdatedAt?.date?.start || page.last_edited_time,
    coverImage: page.cover?.external?.url || page.cover?.file?.url,
    estimatedTime: getPlainText(props.EstimatedTime)
  }
}

// 解析 Notion blocks 为 Markdown
async function parseBlocks(blocks: unknown[]): Promise<string> {
  let markdown = ''
  
  for (const block of blocks) {
    switch (block.type) {
      case 'paragraph':
        markdown += getRichText(block.paragraph.rich_text) + '\n\n'
        break
      case 'heading_1':
        markdown += '# ' + getRichText(block.heading_1.rich_text) + '\n\n'
        break
      case 'heading_2':
        markdown += '## ' + getRichText(block.heading_2.rich_text) + '\n\n'
        break
      case 'heading_3':
        markdown += '### ' + getRichText(block.heading_3.rich_text) + '\n\n'
        break
      case 'bulleted_list_item':
        markdown += '- ' + getRichText(block.bulleted_list_item.rich_text) + '\n'
        break
      case 'numbered_list_item':
        markdown += '1. ' + getRichText(block.numbered_list_item.rich_text) + '\n'
        break
      case 'code':
        markdown += '```' + (block.code.language || '') + '\n'
        markdown += getRichText(block.code.rich_text) + '\n'
        markdown += '```\n\n'
        break
      case 'quote':
        markdown += '> ' + getRichText(block.quote.rich_text) + '\n\n'
        break
      case 'divider':
        markdown += '---\n\n'
        break
      case 'image':
        const imageUrl = block.image.external?.url || block.image.file?.url
        markdown += `![${block.image.caption || ''}](${imageUrl})\n\n`
        break
    }
    
    // 递归处理子块
    if (block.has_children) {
      const children = await notion.blocks.children.list({ block_id: block.id })
      markdown += await parseBlocks(children.results)
    }
  }
  
  return markdown
}

// 辅助函数：获取纯文本
function getPlainText(property: unknown): string {
  if (!property) return ''
  if (property.title) return property.title.map((t: unknown) => t.plain_text).join('')
  if (property.rich_text) return property.rich_text.map((t: unknown) => t.plain_text).join('')
  return ''
}

// 辅助函数：获取富文本
function getRichText(richText: unknown[]): string {
  if (!richText) return ''
  return richText.map(text => {
    let str = text.plain_text
    if (text.annotations.bold) str = `**${str}**`
    if (text.annotations.italic) str = `*${str}*`
    if (text.annotations.code) str = `\`${str}\``
    if (text.href) str = `[${str}](${text.href})`
    return str
  }).join('')
}

// 辅助函数：获取选择项
function getSelect(property: unknown): string {
  if (!property?.select) return ''
  return property.select.name
}

// 辅助函数：获取多选项
function getMultiSelect(property: unknown): string[] {
  if (!property?.multi_select) return []
  return property.multi_select.map((item: unknown) => item.name)
}

// 辅助函数：获取数字
function getNumber(property: unknown): number {
  if (!property?.number) return 0
  return property.number
}

// 辅助函数：获取复选框
function getCheckbox(property: unknown): boolean {
  if (!property?.checkbox) return false
  return property.checkbox
}

// 增加浏览量
export async function incrementViews(tutorialId: string): Promise<void> {
  try {
    const page = await notion.pages.retrieve({ page_id: tutorialId })
    const currentViews = getNumber(page.properties.Views) || 0
    
    await notion.pages.update({
      page_id: tutorialId,
      properties: {
        Views: {
          number: currentViews + 1
        }
      }
    })
  } catch (error) {
    console.error('Error incrementing views:', error)
  }
}

// 增加点赞
export async function incrementLikes(tutorialId: string): Promise<void> {
  try {
    const page = await notion.pages.retrieve({ page_id: tutorialId })
    const currentLikes = getNumber(page.properties.Likes) || 0
    
    await notion.pages.update({
      page_id: tutorialId,
      properties: {
        Likes: {
          number: currentLikes + 1
        }
      }
    })
  } catch (error) {
    console.error('Error incrementing likes:', error)
  }
}
