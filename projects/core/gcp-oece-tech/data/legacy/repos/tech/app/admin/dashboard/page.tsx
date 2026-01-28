'use client'

import { useState, useEffect } from 'react'
import {
  Shield,
  Users,
  FileText,
  Activity,
  AlertTriangle,
  Lock,
  Key,
  Eye,
  Database,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  ShieldCheck,
  UserCheck,
  FileSearch,
  Terminal,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Download,
  Upload,
  BarChart3
} from 'lucide-react'

// 模拟实时数据
const REAL_TIME_STATS = {
  activeUsers: 342,
  todayRequests: 15420,
  serverLoad: 45,
  memoryUsage: 62,
  diskUsage: 38,
  bandwidth: 872,
  threats: 3,
  alerts: 7
}

// 安全事件类型
const SECURITY_EVENTS = [
  { id: 1, type: 'login_attempt', severity: 'low', user: 'user_x92k', ip: '192.168.1.1', time: '2分钟前', status: 'blocked', detail: '密码错误3次' },
  { id: 2, type: 'suspicious_activity', severity: 'medium', user: 'anon_k3j2', ip: '45.23.11.92', time: '5分钟前', status: 'monitoring', detail: '异常访问模式' },
  { id: 3, type: 'brute_force', severity: 'high', user: 'unknown', ip: '123.45.67.89', time: '12分钟前', status: 'blocked', detail: '暴力破解尝试' },
  { id: 4, type: 'sql_injection', severity: 'critical', user: 'guest_9k2m', ip: '78.90.12.34', time: '23分钟前', status: 'blocked', detail: 'SQL注入尝试' },
  { id: 5, type: 'api_abuse', severity: 'medium', user: 'api_client_23', ip: '210.34.56.78', time: '45分钟前', status: 'rate_limited', detail: 'API请求超限' }
]

// 操作日志
const AUDIT_LOGS = [
  { id: 1, admin: 'admin_root', action: 'USER_BAN', target: 'user_spam123', time: '2024-01-20 14:23:45', ip: '10.0.0.1', details: '违反社区规则' },
  { id: 2, admin: 'admin_mod1', action: 'CONTENT_DELETE', target: 'post_92834', time: '2024-01-20 14:20:12', ip: '10.0.0.2', details: '违规内容' },
  { id: 3, admin: 'admin_root', action: 'SETTINGS_CHANGE', target: 'system_config', time: '2024-01-20 14:15:33', ip: '10.0.0.1', details: '更新安全策略' },
  { id: 4, admin: 'admin_security', action: 'IP_BLOCK', target: '45.67.89.10', time: '2024-01-20 14:10:28', ip: '10.0.0.3', details: 'DDoS攻击源' },
  { id: 5, admin: 'admin_root', action: 'BACKUP_CREATE', target: 'database', time: '2024-01-20 14:00:00', ip: '10.0.0.1', details: '定期备份' }
]

export default function AdminDashboard() {
  const [stats, setStats] = useState(REAL_TIME_STATS)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [twoFactorCode, setTwoFactorCode] = useState('')
  const [selectedTab, setSelectedTab] = useState('overview')
  const [refreshing, setRefreshing] = useState(false)

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        todayRequests: prev.todayRequests + Math.floor(Math.random() * 100),
        serverLoad: Math.min(100, Math.max(0, prev.serverLoad + Math.random() * 10 - 5)),
        bandwidth: prev.bandwidth + Math.floor(Math.random() * 50 - 25)
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  // 二次验证界面
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full border border-red-500/30">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-red-500" />
            <h1 className="text-2xl font-bold text-white">管理员安全验证</h1>
          </div>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-400">
              ⚠️ 此区域仅限授权管理员访问
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">管理员令牌</label>
              <input
                type="password"
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                placeholder="输入管理员令牌"
              />
            </div>
            
            <div>
              <label className="text-sm text-gray-400 mb-2 block">两步验证码</label>
              <input
                type="text"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white font-mono"
                placeholder="6位验证码"
                maxLength={6}
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 mb-2 block">硬件密钥</label>
              <button className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-gray-400 hover:text-white transition flex items-center justify-center gap-2">
                <Key className="w-4 h-4" />
                插入安全密钥
              </button>
            </div>

            <button
              onClick={() => setIsAuthenticated(true)}
              className="w-full bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-3 font-medium transition"
            >
              验证身份
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-500 text-center">
              所有登录尝试都会被记录 | IP: 192.168.1.1 | 时间: {new Date().toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 顶部安全提示 */}
      <div className="bg-red-900/20 border-b border-red-500/30 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <ShieldCheck className="w-4 h-4" />
            <span>安全模式已启用 | 管理员: admin_root | IP: 10.0.0.1 | 会话剩余: 28:34</span>
          </div>
          <button className="text-red-400 hover:text-red-300 text-sm">
            紧急锁定
          </button>
        </div>
      </div>

      {/* 主导航 */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Shield className="w-8 h-8 text-red-500" />
              管理控制台
            </h1>
            
            <nav className="flex gap-4">
              {[
                { id: 'overview', label: '总览', icon: BarChart3 },
                { id: 'security', label: '安全', icon: Shield },
                { id: 'users', label: '用户', icon: Users },
                { id: 'content', label: '内容', icon: FileText },
                { id: 'system', label: '系统', icon: Server },
                { id: 'logs', label: '日志', icon: Terminal }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                    selectedTab === tab.id 
                      ? 'bg-gray-700 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <button
            onClick={() => {
              setRefreshing(true)
              setTimeout(() => setRefreshing(false), 1000)
            }}
            className="p-2 text-gray-400 hover:text-white transition"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* 实时统计 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">在线用户</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.activeUsers}</div>
            <div className="text-xs text-green-400 mt-1">↑ 12% vs 昨天</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">今日请求</span>
              <Activity className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.todayRequests.toLocaleString()}</div>
            <div className="text-xs text-gray-400 mt-1">平均响应: 45ms</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">威胁检测</span>
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="text-2xl font-bold text-white">{stats.threats}</div>
            <div className="text-xs text-yellow-400 mt-1">3个活跃威胁</div>
          </div>

          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">系统健康</span>
              <Shield className="w-4 h-4 text-green-400" />
            </div>
            <div className="text-2xl font-bold text-white">98.5%</div>
            <div className="text-xs text-green-400 mt-1">运行正常</div>
          </div>
        </div>

        {/* 系统资源监控 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              服务器负载
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">CPU使用率</span>
                  <span className="text-white">{stats.serverLoad}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      stats.serverLoad > 80 ? 'bg-red-500' : 
                      stats.serverLoad > 60 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${stats.serverLoad}%` }}
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">内存使用</span>
                  <span className="text-white">{stats.memoryUsage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats.memoryUsage}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">磁盘使用</span>
                  <span className="text-white">{stats.diskUsage}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${stats.diskUsage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 安全事件 */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 lg:col-span-2">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                最近安全事件
              </span>
              <span className="text-sm text-gray-400">实时监控中</span>
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {SECURITY_EVENTS.map(event => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      event.severity === 'critical' ? 'bg-red-500' :
                      event.severity === 'high' ? 'bg-orange-500' :
                      event.severity === 'medium' ? 'bg-yellow-500' :
                      'bg-blue-500'
                    }`} />
                    <div>
                      <div className="text-sm text-white">{event.detail}</div>
                      <div className="text-xs text-gray-400">
                        {event.ip} • {event.time}
                      </div>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    event.status === 'blocked' ? 'bg-red-500/20 text-red-400' :
                    event.status === 'monitoring' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 操作审计日志 */}
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h3 className="text-lg font-semibold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-green-400" />
                管理员操作日志
              </span>
              <div className="flex gap-2">
                <button className="text-sm px-3 py-1 bg-gray-700 rounded text-gray-400 hover:text-white transition">
                  导出日志
                </button>
                <button className="text-sm px-3 py-1 bg-gray-700 rounded text-gray-400 hover:text-white transition">
                  筛选
                </button>
              </div>
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700/50">
                <tr className="text-left text-sm text-gray-400">
                  <th className="px-6 py-3">时间</th>
                  <th className="px-6 py-3">管理员</th>
                  <th className="px-6 py-3">操作</th>
                  <th className="px-6 py-3">目标</th>
                  <th className="px-6 py-3">IP地址</th>
                  <th className="px-6 py-3">详情</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {AUDIT_LOGS.map(log => (
                  <tr key={log.id} className="text-sm hover:bg-gray-700/30 transition">
                    <td className="px-6 py-3 text-gray-400 font-mono">{log.time}</td>
                    <td className="px-6 py-3 text-white">{log.admin}</td>
                    <td className="px-6 py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        log.action.includes('BAN') || log.action.includes('BLOCK') 
                          ? 'bg-red-500/20 text-red-400'
                          : log.action.includes('DELETE') 
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-gray-300">{log.target}</td>
                    <td className="px-6 py-3 text-gray-400 font-mono">{log.ip}</td>
                    <td className="px-6 py-3 text-gray-400">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 快速操作 */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-3 font-medium transition flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            紧急锁定
          </button>
          <button className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg px-4 py-3 font-medium transition flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4" />
            威胁扫描
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-3 font-medium transition flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            备份数据
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white rounded-lg px-4 py-3 font-medium transition flex items-center justify-center gap-2">
            <CheckCircle className="w-4 h-4" />
            健康检查
          </button>
        </div>
      </div>
    </div>
  )
}
