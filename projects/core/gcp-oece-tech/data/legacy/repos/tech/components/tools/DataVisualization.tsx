'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Bitcoin, Cloud, Newspaper, RefreshCw } from 'lucide-react'

// 假数据 - 等API申请好后替换
const MOCK_DATA = {
  stocks: [
    { symbol: '^SET.BK', name: '泰國SET指數', price: 1420.50, change: 12.30, changePercent: 0.87 },
    { symbol: '^STI', name: '新加坡STI', price: 3245.80, change: -5.20, changePercent: -0.16 },
    { symbol: '^KLSE', name: '馬來西亞KLSE', price: 1505.40, change: 8.60, changePercent: 0.57 },
    { symbol: '^JKSE', name: '印尼JCI', price: 7125.30, change: 45.20, changePercent: 0.64 },
    { symbol: '^PSEI', name: '菲律賓PSE', price: 6890.10, change: -12.40, changePercent: -0.18 },
    { symbol: '^VN30', name: '越南VN30', price: 1245.60, change: 3.80, changePercent: 0.31 }
  ],
  forex: [
    { pair: 'USD/THB', rate: 35.42, change: 0.05, changePercent: 0.14 },
    { pair: 'USD/SGD', rate: 1.34, change: -0.01, changePercent: -0.75 },
    { pair: 'USD/MYR', rate: 4.68, change: 0.02, changePercent: 0.43 },
    { pair: 'USD/IDR', rate: 15420.50, change: 15.30, changePercent: 0.10 },
    { pair: 'USD/PHP', rate: 56.25, change: -0.10, changePercent: -0.18 },
    { pair: 'USD/VND', rate: 24350.00, change: 20.00, changePercent: 0.08 }
  ],
  crypto: [
    { symbol: 'BTC', name: 'Bitcoin', price: 67234.50, change: 1234.20, changePercent: 1.87 },
    { symbol: 'ETH', name: 'Ethereum', price: 3542.80, change: -45.30, changePercent: -1.26 },
    { symbol: 'BNB', name: 'Binance Coin', price: 584.30, change: 12.50, changePercent: 2.19 },
    { symbol: 'XRP', name: 'Ripple', price: 0.5234, change: 0.0123, changePercent: 2.41 },
    { symbol: 'ADA', name: 'Cardano', price: 0.3456, change: -0.0089, changePercent: -2.51 }
  ],
  weather: [
    { city: 'Bangkok', temp: 32, condition: '☀️', humidity: 65 },
    { city: 'Singapore', temp: 30, condition: '🌧️', humidity: 80 },
    { city: 'Kuala Lumpur', temp: 29, condition: '⛅', humidity: 75 },
    { city: 'Jakarta', temp: 31, condition: '☀️', humidity: 70 },
    { city: 'Manila', temp: 33, condition: '🌤️', humidity: 68 },
    { city: 'Hanoi', temp: 28, condition: '⛅', humidity: 72 }
  ]
}

export function DataVisualization() {
  const [activeTab, setActiveTab] = useState<'stocks' | 'forex' | 'crypto' | 'weather'>('stocks')
  const [loading, setLoading] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  
  const handleRefresh = () => {
    setLoading(true)
    // 模拟API请求
    setTimeout(() => {
      setLoading(false)
      setLastUpdate(new Date())
    }, 1000)
  }
  
  return (
    <div className="space-y-6">
      {/* 标题和刷新 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-mono text-neon mb-2">
            全球數據監控面板
          </h2>
          <p className="text-sm text-pixel-light/60 font-mono">
            最後更新: {lastUpdate.toLocaleTimeString('zh-TW&apos;)}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="btn-pixel-outline flex items-center gap-2"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>刷新數據</span>
        </button>
      </div>
      
      {/* 标签切换 */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <TabButton
          active={activeTab === 'stocks'}
          onClick={() => setActiveTab('stocks')}
          icon={TrendingUp}
          label="股票指數"
        />
        <TabButton
          active={activeTab === 'forex'}
          onClick={() => setActiveTab('forex')}
          icon={DollarSign}
          label="外匯匯率"
        />
        <TabButton
          active={activeTab === 'crypto'}
          onClick={() => setActiveTab('crypto')}
          icon={Bitcoin}
          label="加密貨幣"
        />
        <TabButton
          active={activeTab === 'weather'}
          onClick={() => setActiveTab('weather&apos;)}
          icon={Cloud}
          label="天氣數據"
        />
      </div>
      
      {/* 数据展示 */}
      <div className="grid gap-4">
        {activeTab === 'stocks' && <StocksPanel data={MOCK_DATA.stocks} />}
        {activeTab === 'forex' && <ForexPanel data={MOCK_DATA.forex} />}
        {activeTab === 'crypto' && <CryptoPanel data={MOCK_DATA.crypto} />}
        {activeTab === 'weather' && <WeatherPanel data={MOCK_DATA.weather} />}
      </div>
      
      {/* API状态提示 */}
      <div className="card-pixel border-pixel-warning bg-pixel-warning/5 p-4">
        <div className="flex items-start gap-3">
          <div className="w-2 h-2 bg-pixel-warning rounded-full animate-pulse mt-2" />
          <div className="flex-1">
            <div className="text-sm font-mono text-pixel-warning mb-1">
              當前使用模擬數據
            </div>
            <div className="text-xs text-pixel-light/60">
              申請API Key後，在 <code className="px-1 py-0.5 bg-pixel-grid rounded">.env.local</code> 中配置即可使用真實數據
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// 标签按钮
function TabButton({ active, onClick, icon: Icon, label }: unknown) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm whitespace-nowrap transition-colors ${
        active
          ? 'bg-pixel-primary text-pixel-darker'
          : 'bg-pixel-grid text-pixel-light/70 hover:bg-pixel-grid/80'
      }`}
    >
      <Icon size={16} />
      <span>{label}</span>
    </button>
  )
}

// 股票面板
function StocksPanel({ data }: { data: unknown[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((stock) => (
        <div key={stock.symbol} className="card-pixel-glow p-4 hover:border-pixel-primary transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-pixel-light/50 font-mono mb-1">{stock.symbol}</div>
              <div className="text-base font-bold text-pixel-light">{stock.name}</div>
            </div>
            {stock.changePercent > 0 ? (
              <TrendingUp size={20} className="text-pixel-primary" />
            ) : (
              <TrendingDown size={20} className="text-pixel-danger" />
            )}
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold font-mono text-pixel-light mb-1">
                {stock.price.toLocaleString('en-US&apos;, { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-sm font-mono ${stock.changePercent > 0 ? 'text-pixel-primary' : 'text-pixel-danger'}`}>
                {stock.changePercent > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent > 0 ? '+' : ''{stock.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 外汇面板
function ForexPanel({ data }: { data: unknown[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((forex) => (
        <div key={forex.pair} className="card-pixel-glow p-4 hover:border-pixel-accent transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-base font-bold text-pixel-accent font-mono">{forex.pair}</div>
            </div>
            <DollarSign size={20} className="text-pixel-accent" />
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold font-mono text-pixel-light mb-1">
                {forex.rate.toLocaleString('en-US&apos;, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </div>
              <div className={`text-sm font-mono ${forex.changePercent > 0 ? 'text-pixel-primary' : 'text-pixel-danger'}`}>
                {forex.changePercent > 0 ? '+' : ''}{forex.change.toFixed(4)} ({forex.changePercent > 0 ? '+' : ''{forex.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 加密货币面板
function CryptoPanel({ data }: { data: unknown[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((crypto) => (
        <div key={crypto.symbol} className="card-pixel-glow p-4 hover:border-pixel-warning transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-xs text-pixel-light/50 font-mono mb-1">{crypto.symbol}</div>
              <div className="text-base font-bold text-pixel-warning">{crypto.name}</div>
            </div>
            <Bitcoin size={20} className="text-pixel-warning" />
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-2xl font-bold font-mono text-pixel-light mb-1">
                ${crypto.price.toLocaleString('en-US&apos;, { minimumFractionDigits: 2 })}
              </div>
              <div className={`text-sm font-mono ${crypto.changePercent > 0 ? 'text-pixel-primary' : 'text-pixel-danger'}`}>
                {crypto.changePercent > 0 ? '+' : ''}${Math.abs(crypto.change).toFixed(2)} ({crypto.changePercent > 0 ? '+' : ''{crypto.changePercent.toFixed(2)}%)
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// 天气面板
function WeatherPanel({ data }: { data: unknown[] }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map((weather) => (
        <div key={weather.city} className="card-pixel-glow p-4 hover:border-pixel-secondary transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="text-base font-bold text-pixel-light">{weather.city}</div>
            </div>
            <div className="text-3xl">{weather.condition}</div>
          </div>
          
          <div className="flex items-end justify-between">
            <div>
              <div className="text-3xl font-bold font-mono text-pixel-secondary mb-1">
                {weather.temp}°C
              </div>
              <div className="text-sm font-mono text-pixel-light/60">
                濕度 {weather.humidity}%
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
