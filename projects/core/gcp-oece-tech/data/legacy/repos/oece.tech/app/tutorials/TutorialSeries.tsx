'use client'

import Link from 'next/link'

interface Tutorial {
  slug: string
  title: string
  description: string
  date: string
  category: string
}

interface TutorialSeriesProps {
  tutorials: Tutorial[]
}

const SERIES = [
  {
    id: '01',
    title: '核心技術棧',
    icon: '🎯',
    description: '全端開發環境、CI/CD、資料庫、安全實戰',
    color: 'cyan'
  },
  {
    id: '02',
    title: 'AI工具鏈深度應用',
    icon: '🤖',
    description: 'JetBrains AI、GitLab Duo、Claude、Gemini實戰',
    color: 'pink'
  },
  {
    id: '03',
    title: '開發者轉型IP實戰',
    icon: '📱',
    description: '技術博主、YouTube、開源品牌、內容變現',
    color: 'purple'
  },
  {
    id: '04',
    title: '雲端基建與成本優化',
    icon: '☁️',
    description: 'GCP、DO、Cloudflare、監控告警、多雲架構',
    color: 'yellow'
  },
  {
    id: '05',
    title: '內容生產自動化',
    icon: '📝',
    description: 'Markdown工作流、AI寫作、SEO優化、多平台發布',
    color: 'green'
  }
]

export default function TutorialSeries({ tutorials }: TutorialSeriesProps) {
  // 按分类分组教程
  const tutorialsBySeries = SERIES.map(series => ({
    ...series,
    articles: tutorials.filter(t => 
      t.category?.includes(series.title) || 
      t.slug.startsWith(series.id.toLowerCase())
    )
  }))

  return (
    <div className="tutorial-series-container">
      {tutorialsBySeries.map(series => (
        <section key={series.id} className="series-section">
          <div className="series-header">
            <span className="series-icon">{series.icon}</span>
            <div className="series-info">
              <h2 className="series-title">
                {series.id}系列：{series.title}
              </h2>
              <p className="series-description">{series.description}</p>
            </div>
            <div className="series-count">
              <span className="count-number">{series.articles.length}</span>
              <span className="count-label">篇</span>
            </div>
          </div>

          {series.articles.length > 0 ? (
            <div className="series-grid">
              {series.articles.map((tutorial) => (
                <Link
                  href={`/tutorials/${tutorial.slug}`}
                  key={tutorial.slug}
                  className="series-card"
                >
                  <div className="card-tag">{series.id}</div>
                  <h3 className="card-title">{tutorial.title}</h3>
                  <p className="card-description">{tutorial.description}</p>
                  <div className="card-footer">
                    <span className="card-date">{tutorial.date}</span>
                    <span className="card-arrow">→</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="series-empty">
              <div className="empty-terminal">
                <p className="empty-text">$ ls {series.id}系列/</p>
                <p className="empty-hint">即將推出...</p>
              </div>
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
