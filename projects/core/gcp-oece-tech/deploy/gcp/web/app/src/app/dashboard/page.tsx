'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { auth, logout } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.push('/login');
      } else {
        setUser(currentUser);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const stats = [
    { label: '知識庫文檔', value: '14', icon: '📚', change: '+2' },
    { label: '向量查詢', value: '156', icon: '🔍', change: '+23' },
    { label: 'API 調用', value: '1,234', icon: '⚡', change: '+89' },
    { label: '存儲使用', value: '2.3GB', icon: '💾', change: '' },
  ];

  const knowledgeBases = [
    { name: 'AI戰略核心', docs: 2, size: '40KB', icon: '🧠' },
    { name: 'DeepWeay產品矩陣', docs: 3, size: '27KB', icon: '🚀' },
    { name: '賽博宇宙觀', docs: 2, size: '21KB', icon: '🌌' },
    { name: 'OECE工程體系', docs: 3, size: '28KB', icon: '⚙️' },
    { name: '資源與工具', docs: 2, size: '2.5KB', icon: '🛠️' },
    { name: '敏感數據', docs: 2, size: '2.5KB', icon: '🔒' },
  ];

  const recentActivities = [
    { action: '向量搜索', query: 'AI蒸餾策略', time: '5分鐘前' },
    { action: '文檔訪問', query: 'OECE工程體系', time: '12分鐘前' },
    { action: 'API調用', query: 'vector-jet/hot', time: '1小時前' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">載入中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-slate-700 fixed h-full">
        <div className="p-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌌</span>
            <span className="text-xl font-bold cyber-text">DeepWeay</span>
          </Link>
        </div>

        <nav className="px-4 space-y-2">
          {[
            { id: 'overview', label: '總覽', icon: '📊' },
            { id: 'knowledge', label: '知識庫', icon: '📚' },
            { id: 'vector', label: '向量搜索', icon: '🔍' },
            { id: 'api', label: 'API 管理', icon: '⚡' },
            { id: 'settings', label: '設置', icon: '⚙️' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={user?.photoURL || '/default-avatar.png'}
              alt="avatar"
              className="w-10 h-10 rounded-full border-2 border-purple-500"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.displayName || 'User'}
              </p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full btn-secondary text-sm"
          >
            登出
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {activeTab === 'overview' && '控制台總覽'}
              {activeTab === 'knowledge' && '知識庫管理'}
              {activeTab === 'vector' && '向量搜索'}
              {activeTab === 'api' && 'API 管理'}
              {activeTab === 'settings' && '設置'}
            </h1>
            <p className="text-slate-400">歡迎回來，{user?.displayName || '用戶'}！</p>
          </div>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="搜索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-cyber w-64"
            />
          </div>
        </header>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="card-cyber">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{stat.icon}</span>
                    {stat.change && (
                      <span className="text-green-400 text-sm">
                        {stat.change}
                      </span>
                    )}
                  </div>
                  <p className="text-3xl font-bold text-white">{stat.value}</p>
                  <p className="text-slate-400">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Knowledge Bases */}
              <div className="card-cyber">
                <h2 className="text-xl font-semibold text-white mb-4">
                  知識庫
                </h2>
                <div className="space-y-3">
                  {knowledgeBases.map((kb, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{kb.icon}</span>
                        <div>
                          <p className="text-white font-medium">{kb.name}</p>
                          <p className="text-slate-400 text-sm">
                            {kb.docs} 篇文檔 · {kb.size}
                          </p>
                        </div>
                      </div>
                      <span className="text-slate-400">→</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="card-cyber">
                <h2 className="text-xl font-semibold text-white mb-4">
                  最近活動
                </h2>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border-b border-slate-700 last:border-0"
                    >
                      <div>
                        <p className="text-white">{activity.action}</p>
                        <p className="text-slate-400 text-sm">
                          {activity.query}
                        </p>
                      </div>
                      <span className="text-slate-500 text-sm">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Vector Search Tab */}
        {activeTab === 'vector' && (
          <div className="space-y-6">
            <div className="card-cyber">
              <h2 className="text-xl font-semibold text-white mb-4">
                🔍 向量語義搜索
              </h2>
              <div className="flex space-x-4">
                <input
                  type="text"
                  placeholder="輸入查詢內容，例如：AI蒸餾策略..."
                  className="input-cyber flex-1"
                />
                <button className="btn-primary">搜索</button>
              </div>
              <div className="mt-4 flex space-x-2">
                <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                  向量噴射
                </span>
                <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                  知識蒸餾
                </span>
                <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-slate-300">
                  賽博宇宙
                </span>
              </div>
            </div>

            <div className="card-cyber">
              <h3 className="text-lg font-semibold text-white mb-4">
                溫度模式選擇
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: '❄️ 冷切割', temp: '0.1', desc: '精確答案' },
                  { name: '🎯 向量噴射', temp: '0.7', desc: '平衡輸出' },
                  { name: '🔥 高溫擴散', temp: '1.2', desc: '創意發散' },
                  { name: '💧 蒸餾提煉', temp: '0.5', desc: '核心提煉' },
                ].map((mode, index) => (
                  <div
                    key={index}
                    className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 hover:border-purple-500 cursor-pointer transition-all"
                  >
                    <p className="font-medium text-white">{mode.name}</p>
                    <p className="text-purple-400">T={mode.temp}</p>
                    <p className="text-slate-400 text-sm">{mode.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Knowledge Tab */}
        {activeTab === 'knowledge' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button className="btn-primary">
                  📥 導入 Notion
                </button>
                <button className="btn-secondary">
                  ➕ 新增文檔
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {knowledgeBases.map((kb, index) => (
                <div key={index} className="card-cyber cursor-pointer hover:cyber-glow">
                  <div className="text-4xl mb-4">{kb.icon}</div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {kb.name}
                  </h3>
                  <p className="text-slate-400 mb-4">
                    {kb.docs} 篇文檔 · {kb.size}
                  </p>
                  <div className="flex space-x-2">
                    <button className="btn-secondary text-sm flex-1">查看</button>
                    <button className="btn-secondary text-sm flex-1">編輯</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl space-y-6">
            <div className="card-cyber">
              <h2 className="text-xl font-semibold text-white mb-4">
                個人資料
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    顯示名稱
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.displayName || ''}
                    className="input-cyber"
                  />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    電子郵件
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="input-cyber"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="card-cyber">
              <h2 className="text-xl font-semibold text-white mb-4">
                API 設置
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-2">
                    API 密鑰
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="password"
                      defaultValue="sk-deepweay-xxxxx"
                      className="input-cyber flex-1"
                      disabled
                    />
                    <button className="btn-secondary">重新生成</button>
                  </div>
                </div>
              </div>
            </div>

            <button className="btn-primary w-full">保存更改</button>
          </div>
        )}
      </main>
    </div>
  );
}
