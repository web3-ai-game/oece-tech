'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Cpu, Home, Database, Brain, Image, Settings, LogOut, Menu, X,
  Zap, TrendingUp, Clock, DollarSign, Search, Plus, Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { icon: Zap, label: '今日蒸餾', value: '128', change: '+12%', color: 'cyan' },
    { icon: Database, label: '向量總數', value: '5,842', change: '+8%', color: 'purple' },
    { icon: DollarSign, label: '今日成本', value: '฿4.52', change: '-3%', color: 'green' },
    { icon: Clock, label: '平均延遲', value: '245ms', change: '-15%', color: 'yellow' },
  ];

  const recentActivities = [
    { type: 'distill', text: '蒸餾了 3 篇文檔', time: '5分鐘前', cost: '฿0.12' },
    { type: 'vector', text: '向量搜索 "AI策略"', time: '12分鐘前', cost: '免費' },
    { type: 'image', text: '生成了 1 張漫畫', time: '1小時前', cost: '฿4.69' },
    { type: 'distill', text: '批量蒸餾完成', time: '3小時前', cost: '฿2.10' },
  ];

  const menuItems = [
    { id: 'overview', icon: Home, label: '概覽' },
    { id: 'distill', icon: Brain, label: '知識蒸餾' },
    { id: 'vector', icon: Database, label: '向量庫' },
    { id: 'image', icon: Image, label: '圖片生成' },
    { id: 'settings', icon: Settings, label: '設置' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* 側邊欄 - 移動端 */}
      <div className={`fixed inset-0 bg-black/50 z-40 lg:hidden ${sidebarOpen ? '' : 'hidden'}`} onClick={() => setSidebarOpen(false)} />
      
      {/* 側邊欄 */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 glass-card border-r border-white/5 transform transition-transform lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2">
            <Cpu className="w-8 h-8 text-cyan-400" />
            <span className="text-xl font-bold gradient-text">DeepWeay</span>
          </Link>
        </div>

        <nav className="px-4 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                activeTab === item.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500" />
            <div className="flex-1">
              <div className="text-sm font-medium">用戶名</div>
              <div className="text-xs text-gray-500">Free Plan</div>
            </div>
            <button className="text-gray-500 hover:text-white">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* 主內容 */}
      <main className="flex-1 p-6 lg:p-8">
        {/* 頂部欄 */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-400">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-2xl font-bold">
              {menuItems.find(m => m.id === activeTab)?.label}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索..."
                className="pl-10 pr-4 py-2 bg-gray-900/50 border border-white/10 rounded-lg text-sm focus:border-cyan-500/50 outline-none w-64"
              />
            </div>
            <button className="cyber-btn text-sm flex items-center gap-2">
              <Plus className="w-4 h-4" /> 新建
            </button>
          </div>
        </div>

        {/* 概覽內容 */}
        {activeTab === 'overview' && (
          <>
            {/* 統計卡片 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, i) => (
                <div key={i} className="glass-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-${stat.color}-500/10 rounded-xl flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-400`} />
                    </div>
                    <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* 快速操作 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="glass-card p-6 hover:border-cyan-500/30 transition cursor-pointer" onClick={() => setActiveTab('distill')}>
                <Brain className="w-8 h-8 text-cyan-400 mb-4" />
                <h3 className="font-bold mb-2">快速蒸餾</h3>
                <p className="text-sm text-gray-400">上傳文檔，一鍵蒸餾為向量</p>
              </div>
              <div className="glass-card p-6 hover:border-purple-500/30 transition cursor-pointer" onClick={() => setActiveTab('vector')}>
                <Database className="w-8 h-8 text-purple-400 mb-4" />
                <h3 className="font-bold mb-2">向量搜索</h3>
                <p className="text-sm text-gray-400">語義搜索你的知識庫</p>
              </div>
              <div className="glass-card p-6 hover:border-pink-500/30 transition cursor-pointer" onClick={() => setActiveTab('image')}>
                <Image className="w-8 h-8 text-pink-400 mb-4" />
                <h3 className="font-bold mb-2">小愛同學</h3>
                <p className="text-sm text-gray-400">AI 漫畫生成 ฿4.69/張</p>
              </div>
            </div>

            {/* 最近活動 */}
            <div className="glass-card p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                最近活動
              </h3>
              <div className="space-y-4">
                {recentActivities.map((activity, i) => (
                  <div key={i} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                      <span>{activity.text}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-500">{activity.time}</span>
                      <span className={activity.cost === '免費' ? 'text-green-400' : 'text-yellow-400'}>
                        {activity.cost}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* 蒸餾頁面 */}
        {activeTab === 'distill' && (
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6">知識蒸餾</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">選擇模式</label>
                <select className="cyber-input">
                  <option value="cold">🧊 冷切割 (฿3.5/M) - 精確提取</option>
                  <option value="vector">🎯 向量噴射 (฿5.3/M) - 平衡模式</option>
                  <option value="hot">🔥 高溫擴散 (฿44/M) - 深度推理</option>
                  <option value="distill">💧 蒸餾提煉 (฿5.3/M) - 壓縮精華</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">輸入內容</label>
                <textarea
                  className="cyber-input h-48 resize-none"
                  placeholder="粘貼你要蒸餾的內容..."
                />
              </div>
              <button className="cyber-btn">開始蒸餾</button>
            </div>
          </div>
        )}

        {/* 其他頁面佔位 */}
        {activeTab === 'vector' && (
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6">向量搜索</h2>
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                className="cyber-input pl-12 text-lg"
                placeholder="輸入搜索內容..."
              />
            </div>
            <p className="text-gray-500 text-center py-12">輸入內容開始語義搜索</p>
          </div>
        )}

        {activeTab === 'image' && (
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6">小愛同學 - AI 漫畫生成</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">描述你想要的畫面</label>
                <textarea
                  className="cyber-input h-32 resize-none"
                  placeholder="例如：賽博朋克風格的少女，在霓虹燈下畫漫畫..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">風格</label>
                <div className="flex gap-2">
                  {['anime', 'manga', 'cyberpunk', 'cute'].map(style => (
                    <button key={style} className="px-4 py-2 border border-white/20 rounded-lg hover:border-cyan-500/50 hover:bg-cyan-500/10 transition">
                      {style}
                    </button>
                  ))}
                </div>
              </div>
              <button className="cyber-btn">生成圖片 (฿4.69)</button>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6">設置</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">API Keys</h3>
                <p className="text-sm text-gray-500">4把付費 Keys 輪換中，封頂 ฿20/會話</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">成本追蹤</h3>
                <p className="text-sm text-gray-500">本月累計: ฿45.20</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
