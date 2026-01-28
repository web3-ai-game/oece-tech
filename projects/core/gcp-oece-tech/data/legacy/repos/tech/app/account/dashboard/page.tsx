'use client'

import { useState } from 'react'
import {
  Home,
  Key,
  Code,
  BarChart3,
  FileText,
  Settings,
  CreditCard,
  Bell,
  LogOut,
  Copy,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  Zap,
  Globe,
  Shield,
  Terminal
} from 'lucide-react'

// 模拟用户数据
const USER_DATA = {
  name: 'Anonymous User',
  email: 'user@oece.tech',
  plan: 'Pro',
  apiKeys: [
    { id: 1, name: 'Production Key', key: 'sk-oece-prod-xxxxxxxxxxxxxxxx', created: '2024-01-15', lastUsed: '2 hours ago', usage: 15420 },
    { id: 2, name: 'Development Key', key: 'sk-oece-dev-yyyyyyyyyyyyyyyy', created: '2024-01-10', lastUsed: '5 days ago', usage: 3200 }
  ],
  usage: {
    requests: 18620,
    limit: 100000,
    tokens: 2450000,
    tokenLimit: 10000000
  }
}

export default function UserDashboard() {
  const [activeSection, setActiveSection] = useState('overview')
  const [showKey, setShowKey] = useState<{ [key: number]: boolean }>({})
  const [copiedKey, setCopiedKey] = useState<number | null>(null)

  const copyToClipboard = (text: string, keyId: number) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(keyId)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'playground', label: 'Playground', icon: Code },
    { id: 'usage', label: 'Usage', icon: BarChart3 },
    { id: 'docs', label: 'Documentation', icon: FileText },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* 主容器 */}
      <div className="flex h-screen">
        {/* 左侧导航栏 */}
        <div className="w-64 bg-gray-950 border-r border-gray-800 flex flex-col">
          {/* Logo区域 */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">O</span>
              </div>
              <span className="text-xl font-semibold">OECE</span>
            </div>
          </div>

          {/* 导航菜单 */}
          <nav className="flex-1 p-4">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all mb-1 ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-white border border-purple-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-gray-900'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
                {activeSection === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            ))}
          </nav>

          {/* 用户信息 */}
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg">
              <div>
                <div className="text-sm font-medium">{USER_DATA.name}</div>
                <div className="text-xs text-gray-400">{USER_DATA.plan} Plan</div>
              </div>
              <button className="text-gray-400 hover:text-white transition">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 右侧内容区 */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900">
          {/* 顶部栏 */}
          <div className="border-b border-gray-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                  {navItems.find(item => item.id === activeSection)?.label}
                </h1>
                <p className="text-gray-500 mt-1">Manage your OECE platform resources</p>
              </div>
              <button className="p-2 text-gray-400 hover:text-white transition relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full"></span>
              </button>
            </div>
          </div>

          {/* 内容区 */}
          <div className="p-8">
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Terminal className="w-8 h-8 text-purple-400" />
                      <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">Active</span>
                    </div>
                    <div className="text-2xl font-bold">{USER_DATA.apiKeys.length}</div>
                    <div className="text-sm text-gray-400 mt-1">API Keys</div>
                  </div>

                  <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Zap className="w-8 h-8 text-blue-400" />
                      <span className="text-xs text-gray-400">This month</span>
                    </div>
                    <div className="text-2xl font-bold">{USER_DATA.usage.requests.toLocaleString()}</div>
                    <div className="text-sm text-gray-400 mt-1">API Requests</div>
                  </div>

                  <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Globe className="w-8 h-8 text-green-400" />
                      <span className="text-xs text-gray-400">99.9%</span>
                    </div>
                    <div className="text-2xl font-bold">12ms</div>
                    <div className="text-sm text-gray-400 mt-1">Avg Latency</div>
                  </div>

                  <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <Shield className="w-8 h-8 text-yellow-400" />
                      <span className="text-xs text-gray-400">Enhanced</span>
                    </div>
                    <div className="text-2xl font-bold">AES-256</div>
                    <div className="text-sm text-gray-400 mt-1">Encryption</div>
                  </div>
                </div>

                {/* 快速开始 */}
                <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8">
                  <h2 className="text-2xl font-bold mb-6">Quick Start</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-400 font-bold">1</span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Create an API Key</h3>
                        <p className="text-sm text-gray-400">Generate your first API key to start making requests</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-400 font-bold">2</span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Install SDK</h3>
                        <code className="text-sm bg-gray-800 px-2 py-1 rounded">npm install @oece/sdk</code>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-green-400 font-bold">3</span>
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Make your first request</h3>
                        <p className="text-sm text-gray-400">Check out our documentation for examples</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'api-keys' && (
              <div className="space-y-6">
                {/* 创建新密钥按钮 */}
                <div className="flex justify-between items-center">
                  <p className="text-gray-400">Manage your API keys for accessing OECE services</p>
                  <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg font-medium hover:shadow-lg transition">
                    <Plus className="w-4 h-4" />
                    Create New Key
                  </button>
                </div>

                {/* API密钥列表 */}
                <div className="space-y-4">
                  {USER_DATA.apiKeys.map(key => (
                    <div key={key.id} className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{key.name}</h3>
                          <p className="text-sm text-gray-400 mt-1">Created {key.created} • Last used {key.lastUsed}</p>
                        </div>
                        <button className="text-red-400 hover:text-red-300 transition">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="bg-gray-800/50 rounded-lg p-4 font-mono text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">
                            {showKey[key.id] ? key.key : key.key.replace(/x/g, '•')}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowKey(prev => ({ ...prev, [key.id]: !prev[key.id] }))}
                              className="text-gray-400 hover:text-white transition"
                            >
                              {showKey[key.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(key.key, key.id)}
                              className="text-gray-400 hover:text-white transition"
                            >
                              {copiedKey === key.id ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm">
                          <span className="text-gray-400">Usage: </span>
                          <span className="text-white font-medium">{key.usage.toLocaleString()} requests</span>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-xs px-2 py-1 bg-green-500/10 text-green-400 rounded">Active</span>
                          <span className="text-xs px-2 py-1 bg-blue-500/10 text-blue-400 rounded">Read/Write</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'usage' && (
              <div className="space-y-6">
                {/* 使用统计 */}
                <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8">
                  <h2 className="text-xl font-bold mb-6">Current Period Usage</h2>
                  
                  {/* API请求使用 */}
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">API Requests</span>
                      <span className="text-white font-medium">
                        {USER_DATA.usage.requests.toLocaleString()} / {USER_DATA.usage.limit.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div 
                        className="h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full transition-all"
                        style={{ width: `${(USER_DATA.usage.requests / USER_DATA.usage.limit) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {((USER_DATA.usage.requests / USER_DATA.usage.limit) * 100).toFixed(1)}% used
                    </p>
                  </div>

                  {/* Token使用 */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Tokens</span>
                      <span className="text-white font-medium">
                        {(USER_DATA.usage.tokens / 1000000).toFixed(1)}M / {(USER_DATA.usage.tokenLimit / 1000000)}M
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3">
                      <div 
                        className="h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all"
                        style={{ width: `${(USER_DATA.usage.tokens / USER_DATA.usage.tokenLimit) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {((USER_DATA.usage.tokens / USER_DATA.usage.tokenLimit) * 100).toFixed(1)}% used
                    </p>
                  </div>
                </div>

                {/* 使用图表占位 */}
                <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8">
                  <h2 className="text-xl font-bold mb-6">Usage Over Time</h2>
                  <div className="h-64 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-600" />
                      <p>Usage chart will be displayed here</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
