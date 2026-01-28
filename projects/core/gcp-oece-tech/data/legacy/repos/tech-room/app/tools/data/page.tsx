import { DataVisualization } from '@/components/tools/DataVisualization'
import { LineChart, BarChart3, PieChart, Activity } from 'lucide-react'
import Link from 'next/link'

export default function DataVisualizationPage() {
  return (
    <div className="min-h-screen bg-pixel-darker">
      <div className="container mx-auto px-4 py-12">
        
        {/* 面包屑 */}
        <div className="mb-8 flex items-center gap-2 text-sm font-mono text-pixel-light/60">
          <Link href="/" className="hover:text-pixel-primary transition-colors">首頁</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-pixel-primary transition-colors">工具</Link>
          <span>/</span>
          <span className="text-pixel-primary">數據監控</span>
        </div>
        
        {/* 主标题 */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-pixel-primary/10 border border-pixel-primary rounded-lg mb-4">
            <Activity size={16} className="text-pixel-primary" />
            <span className="text-sm font-mono text-pixel-primary">REAL-TIME DATA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono text-neon">
            全球數據監控中心
          </h1>
          <p className="text-pixel-light/70 font-mono max-w-2xl mx-auto">
            整合50+免費API · 實時監控全球股市 · 外匯 · 加密貨幣 · 天氣等數據
          </p>
        </div>
        
        {/* 数据可视化面板 */}
        <DataVisualization />
        
        {/* API信息卡片 */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold mb-6 font-mono text-neon text-center">
            📡 已整合的數據源
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Alpha Vantage */}
            <div className="card-pixel p-6">
              <div className="w-12 h-12 rounded-lg bg-pixel-primary/20 flex items-center justify-center mb-4">
                <LineChart className="text-pixel-primary" size={24} />
              </div>
              <h3 className="text-lg font-bold font-mono text-pixel-primary mb-2">
                Alpha Vantage
              </h3>
              <p className="text-sm text-pixel-light/70 mb-3">
                全球股票、外匯、技術指標
              </p>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 bg-pixel-warning rounded-full" />
                <span className="text-pixel-light/50">需要API Key</span>
              </div>
            </div>
            
            {/* CoinGecko */}
            <div className="card-pixel p-6">
              <div className="w-12 h-12 rounded-lg bg-pixel-warning/20 flex items-center justify-center mb-4">
                <PieChart className="text-pixel-warning" size={24} />
              </div>
              <h3 className="text-lg font-bold font-mono text-pixel-warning mb-2">
                CoinGecko
              </h3>
              <p className="text-sm text-pixel-light/70 mb-3">
                10000+ 加密貨幣實時數據
              </p>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 bg-pixel-primary rounded-full" />
                <span className="text-pixel-light/50">完全免費</span>
              </div>
            </div>
            
            {/* ExchangeRate-API */}
            <div className="card-pixel p-6">
              <div className="w-12 h-12 rounded-lg bg-pixel-accent/20 flex items-center justify-center mb-4">
                <BarChart3 className="text-pixel-accent" size={24} />
              </div>
              <h3 className="text-lg font-bold font-mono text-pixel-accent mb-2">
                ExchangeRate
              </h3>
              <p className="text-sm text-pixel-light/70 mb-3">
                161種貨幣實時匯率
              </p>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 bg-pixel-warning rounded-full" />
                <span className="text-pixel-light/50">需要API Key</span>
              </div>
            </div>
            
            {/* OpenWeatherMap */}
            <div className="card-pixel p-6">
              <div className="w-12 h-12 rounded-lg bg-pixel-secondary/20 flex items-center justify-center mb-4">
                <Activity className="text-pixel-secondary" size={24} />
              </div>
              <h3 className="text-lg font-bold font-mono text-pixel-secondary mb-2">
                OpenWeather
              </h3>
              <p className="text-sm text-pixel-light/70 mb-3">
                全球天氣數據和預報
              </p>
              <div className="flex items-center gap-2 text-xs font-mono">
                <div className="w-2 h-2 bg-pixel-warning rounded-full" />
                <span className="text-pixel-light/50">需要API Key</span>
              </div>
            </div>
          </div>
        </section>
        
        {/* 快速申请指南 */}
        <section className="mt-16 card-pixel-glow p-8 bg-pixel-darker/50">
          <h2 className="text-2xl font-bold mb-6 font-mono text-neon text-center">
            🚀 快速申請API指南
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold font-mono text-pixel-primary mb-4">
                1. Alpha Vantage 申請
              </h3>
              <ol className="space-y-2 text-sm text-pixel-light/80">
                <li className="flex gap-2">
                  <span className="text-pixel-primary font-mono">①</span>
                  <span>訪問 <a href="https://www.alphavantage.co/support/#api-key" target="_blank" className="text-pixel-accent hover:underline">alphavantage.co</a></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pixel-primary font-mono">②</span>
                  <span>填寫郵箱地址</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pixel-primary font-mono">③</span>
                  <span>立即獲得API Key</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pixel-primary font-mono">④</span>
                  <span>配置到 .env.local</span>
                </li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-bold font-mono text-pixel-accent mb-4">
                2. ExchangeRate-API 申請
              </h3>
              <ol className="space-y-2 text-sm text-pixel-light/80">
                <li className="flex gap-2">
                  <span className="text-pixel-accent font-mono">①</span>
                  <span>訪問 <a href="https://www.exchangerate-api.com" target="_blank" className="text-pixel-accent hover:underline">exchangerate-api.com</a></span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pixel-accent font-mono">②</span>
                  <span>點擊 "Get Free Key"</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pixel-accent font-mono">③</span>
                  <span>郵箱確認後獲得Key</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pixel-accent font-mono">④</span>
                  <span>每月1500次免費請求</span>
                </li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-bold font-mono text-pixel-warning mb-4">
                3. CoinGecko（無需Key）
              </h3>
              <ol className="space-y-2 text-sm text-pixel-light/80">
                <li className="flex gap-2">
                  <span className="text-pixel-warning font-mono">①</span>
                  <span>完全免費，無需註冊</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pixel-warning font-mono">②</span>
                  <span>直接調用API即可</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pixel-warning font-mono">③</span>
                  <span>50 calls/分鐘</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pixel-warning font-mono">④</span>
                  <span>10000+ 加密貨幣數據</span>
                </li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-lg font-bold font-mono text-pixel-secondary mb-4">
                4. OpenWeatherMap 申請
              </h3>
              <ol className="space-y-2 text-sm text-pixel-light/80">
                <li className="flex gap-2">
                  <span className="text-pixel-secondary font-mono">①</span>
                  <span>註冊 <a href="https://openweathermap.org/api" target="_blank" className="text-pixel-accent hover:underline">OpenWeatherMap</a> 賬號</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pixel-secondary font-mono">②</span>
                  <span>API Keys 頁面獲取Key</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pixel-secondary font-mono">③</span>
                  <span>2小時後激活</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pixel-secondary font-mono">④</span>
                  <span>每天1000次免費請求</span>
                </li>
              </ol>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link 
              href="/FREE-API-SOURCES.md"
              target="_blank"
              className="btn-pixel inline-flex items-center gap-2"
            >
              <span>查看完整API清單（50+）</span>
            </Link>
          </div>
        </section>
        
        {/* 环境变量配置 */}
        <section className="mt-16 card-pixel p-8 bg-pixel-darker/50">
          <h2 className="text-2xl font-bold mb-6 font-mono text-neon text-center">
            ⚙️ 環境變量配置
          </h2>
          
          <p className="text-center text-pixel-light/70 mb-6 font-mono text-sm">
            在項目根目錄創建 <code className="px-2 py-1 bg-pixel-grid rounded">.env.local</code> 文件，添加以下配置：
          </p>
          
          <div className="bg-pixel-darker border border-pixel-grid rounded-lg p-6 font-mono text-sm">
            <pre className="text-pixel-light/80">
{`# Alpha Vantage - 股票/外匯數據
NEXT_PUBLIC_ALPHA_VANTAGE_KEY=your_api_key_here

# ExchangeRate-API - 外匯匯率
NEXT_PUBLIC_EXCHANGE_RATE_KEY=your_api_key_here

# OpenWeatherMap - 天氣數據
NEXT_PUBLIC_OPENWEATHER_KEY=your_api_key_here

# CoinGecko - 加密貨幣（無需Key）
# 直接調用 API 即可

# NewsAPI - 新聞數據
NEXT_PUBLIC_NEWS_API_KEY=your_api_key_here`}
            </pre>
          </div>
          
          <div className="mt-4 card-pixel border-pixel-warning bg-pixel-warning/5 p-4">
            <p className="text-xs text-pixel-warning font-mono">
              ⚠️ 注意：不要將 .env.local 提交到 Git！已在 .gitignore 中排除
            </p>
          </div>
        </section>
        
      </div>
    </div>
  )
}
