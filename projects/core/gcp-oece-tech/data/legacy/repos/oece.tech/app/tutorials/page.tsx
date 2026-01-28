import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import Link from 'next/link'
import TutorialSeries from './TutorialSeries'
import './series.css'

interface Tutorial {
  slug: string
  title: string
  description: string
  series: string
  seriesNumber: string
}

interface Series {
  id: string
  name: string
  description: string
  icon: string
  tutorials: Tutorial[]
}

function getSeries(): Series[] {
  const tutorialsDirectory = path.join(process.cwd(), 'content/tutorials')

  if (!fs.existsSync(tutorialsDirectory)) {
    return []
  }

  const seriesConfig = [
    { id: '01', name: '核心技術棧', description: '全端開發環境、CI/CD、資料庫、安全實戰', icon: '🎯', folder: '01系列-核心技术栈' },
    { id: '02', name: 'AI工具鏈深度應用', description: 'JetBrains AI、GitLab Duo、Claude、Gemini實戰', icon: '🤖', folder: '02系列-AI工具链深度应用' },
    { id: '03', name: '開發者轉型IP實戰', description: '技術博主、YouTube、內容變現', icon: '📱', folder: '03系列-开发者转型IP实战' },
    { id: '04', name: '雲端基建與成本優化', description: 'GCP、DO、Cloudflare、監控告警', icon: '☁️', folder: '04系列-云端基建与成本优化' },
    { id: '05', name: '內容生產自動化', description: 'Markdown、AI寫作、SEO優化', icon: '📝', folder: '05系列-内容生产自动化' },
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
          const { data, content: markdownContent } = matter(content)
          
          // 从文件名提取序号
          const match = file.match(/^(\d+\.\d+)[-_](.+)\.md$/)
          const seriesNumber = match ? match[1] : ''
          
          // 提取标题：优先使用 frontmatter，其次从内容第一行，最后从文件名
          let title = data.title
          if (!title) {
            const titleMatch = markdownContent.match(/^#\s+(.+)$/m)
            if (titleMatch) {
              title = titleMatch[1].trim()
            } else if (match) {
              title = match[2].replace(/[-_]/g, ' ')
            } else {
              title = file.replace('.md', '')
            }
          }

          return {
            slug: `${config.folder}/${file.replace('.md', '')}`,
            title,
            description: data.description || '',
            series: config.id,
            seriesNumber,
          }
        })
        .sort((a, b) => a.seriesNumber.localeCompare(b.seriesNumber))
    }

    return {
      id: config.id,
      name: config.name,
      description: config.description,
      icon: config.icon,
      tutorials,
    }
  })
}

export default function TutorialsPage() {
  const series = getSeries()

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
            <Link href="/toolkits">工具包</Link>
          </nav>
        </div>
      </header>

      <main className="main">
        <div className="page-header">
          <h1 className="page-title">📚 教學</h1>
          <p className="page-subtitle">
            來自實戰開發經驗的技術指南和教學
          </p>
        </div>

        {series.every(s => s.tutorials.length === 0) ? (
          <div className="empty-state">
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="terminal-dot red"></span>
                <span className="terminal-dot yellow"></span>
                <span className="terminal-dot green"></span>
                <span className="terminal-title">tutorials.sh</span>
              </div>
              <div className="terminal-body">
                <p><span className="prompt">$</span> ls content/tutorials/</p>
                <p className="terminal-text">未找到教學。</p>
                <p className="terminal-text">
                  在 content/tutorials/ 目錄新增 .md 檔案來創建第一篇教學
                </p>
                <p><span className="prompt">$</span> <span className="cursor">_</span></p>
              </div>
            </div>
          </div>
        ) : (
          <div className="tutorial-series-container">
            {series.map(s => (
              <section key={s.id} className="series-section">
                <div className="series-header">
                  <span className="series-icon">{s.icon}</span>
                  <div className="series-info">
                    <h2 className="series-title">{s.id}系列：{s.name}</h2>
                    <p className="series-description">{s.description}</p>
                  </div>
                  <div className="series-count">
                    <span className="count-number">{s.tutorials.length}</span>
                    <span className="count-label">篇</span>
                  </div>
                </div>
                {s.tutorials.length === 0 ? (
                  <div className="series-empty">
                    <div className="empty-terminal">
                      <p className="empty-text">$ ls {s.id}系列/</p>
                      <p className="empty-hint">即將推出...</p>
                    </div>
                  </div>
                ) : (
                  <div className="series-grid">
                    {s.tutorials.map(tutorial => (
                      <Link
                        key={tutorial.slug}
                        href={`/tutorials/${tutorial.slug}`}
                        className="tutorial-card"
                      >
                        <div className="tutorial-number">{tutorial.seriesNumber}</div>
                        <h3 className="tutorial-title">{tutorial.title}</h3>
                        {tutorial.description && (
                          <p className="tutorial-description">{tutorial.description}</p>
                        )}
                        <span className="tutorial-arrow">→</span>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            ))}
          </div>
        )}
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
