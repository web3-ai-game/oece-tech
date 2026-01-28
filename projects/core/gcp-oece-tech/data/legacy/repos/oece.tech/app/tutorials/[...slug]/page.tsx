import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import CodeBlock from '../../components/CodeBlock'
import './markdown.css'

interface TutorialPageProps {
  params: {
    slug: string[]
  }
}

function getTutorialContent(slug: string) {
  const tutorialsDirectory = path.join(process.cwd(), 'content/tutorials')
  const fullPath = path.join(tutorialsDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  // 如果沒有 frontmatter title，從內容第一行提取
  let title = data.title
  if (!title) {
    const titleMatch = content.match(/^#\s+(.+)$/m)
    if (titleMatch) {
      title = titleMatch[1].trim()
    } else {
      // 從文件名提取
      const fileNameMatch = slug.split('/').pop()?.match(/^\d+\.\d+[-_](.+)$/)
      title = fileNameMatch ? fileNameMatch[1].replace(/[-_]/g, ' ') : slug
    }
  }

  return {
    slug,
    content,
    title,
    description: data.description || '',
    date: data.date || '',
    category: data.category || '教學',
  }
}

export async function generateStaticParams() {
  const tutorialsDirectory = path.join(process.cwd(), 'content/tutorials')

  if (!fs.existsSync(tutorialsDirectory)) {
    return []
  }

  const getAllMarkdownFiles = (dir: string, baseDir: string = dir): string[] => {
    const files: string[] = []
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        files.push(...getAllMarkdownFiles(fullPath, baseDir))
      } else if (item.endsWith('.md')) {
        const relativePath = path.relative(baseDir, fullPath)
        files.push(relativePath.replace(/\.md$/, ''))
      }
    }
    
    return files
  }

  const markdownFiles = getAllMarkdownFiles(tutorialsDirectory)
  
  return markdownFiles.map(file => ({
    slug: file.split(path.sep),
  }))
}

export default async function TutorialPage({ params }: TutorialPageProps) {
  const slug = params.slug.join('/')
  const tutorial = getTutorialContent(slug)

  if (!tutorial) {
    return (
      <div className="container">
        <main className="main">
          <div className="error-message">
            <h1>教學未找到</h1>
            <Link href="/tutorials">← 返回教學列表</Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="container">
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <Link href="/" className="pixel-logo">OECE.TECH</Link>
            <div className="tagline">// 數位游牧開發者日誌</div>
          </div>
          <nav className="nav">
            <Link href="/">首頁</Link>
            <Link href="/tutorials">教學</Link>
            <Link href="/journey">旅程</Link>
            <Link href="https://youtube.com/@yourchannel" target="_blank" rel="noopener">YouTube</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <article className="tutorial-article">
          <div className="tutorial-meta">
            <Link href="/tutorials" className="back-link">← 返回教學列表</Link>
            <div className="meta-info">
              <span className="category-badge">{tutorial.category}</span>
              <span className="date-badge">{tutorial.date}</span>
            </div>
          </div>

          <header className="article-header">
            <h1 className="article-title">{tutorial.title}</h1>
            {tutorial.description && (
              <p className="article-description">{tutorial.description}</p>
            )}
          </header>

          <div className="markdown-content">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                code({ node, inline, className, children, ...props }: any) {
                  return !inline ? (
                    <div className="code-block-wrapper">
                      <CodeBlock className={className}>
                        {children}
                      </CodeBlock>
                    </div>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  )
                }
              }}
            >
              {tutorial.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>聯絡方式</h3>
            <div className="social-links">
              <a href="https://twitter.com/youraccount" target="_blank" rel="noopener">X/Twitter</a>
              <a href="https://youtube.com/@yourchannel" target="_blank" rel="noopener">YouTube</a>
              <a href="https://github.com/youraccount" target="_blank" rel="noopener">GitHub</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 OECE.TECH | Coded with ☕ from various corners of the world</p>
        </div>
      </footer>
    </div>
  )
}
