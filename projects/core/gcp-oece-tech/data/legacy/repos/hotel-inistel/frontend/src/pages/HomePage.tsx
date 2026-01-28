import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  const content = {
    zh: {
      nav: {
        dashboard: '仪表板',
        rooms: '房间管理',
        bookings: '预订管理',
        customers: '客户管理',
        reports: '报表分析',
        settings: '系统设置',
        login: '登录',
        register: '注册'
      },
      hero: {
        title: '🏨 Hotel Inistel',
        subtitle: '智能酒店管理系统',
        description: '专为东南亚酒店打造的现代化管理平台',
        quickActions: '快速操作'
      },
      stats: {
        totalRooms: '总房间数',
        occupied: '已入住',
        available: '可预订',
        maintenance: '维护中'
      },
      quickActions: {
        checkIn: '入住登记',
        checkOut: '退房办理',
        newBooking: '新预订',
        roomStatus: '房态查看',
        dailyReport: '日报表',
        customerSearch: '客户查询'
      },
      features: {
        title: '核心功能',
        subtitle: '专注酒店管理的实用工具',
        items: [
          {
            icon: '🛏️',
            title: '房间管理',
            description: '实时房态监控，智能分配，最大化收益'
          },
          {
            icon: '📅',
            title: '预订系统',
            description: '在线预订，OTA对接，渠道管理'
          },
          {
            icon: '👥',
            title: '客户管理',
            description: '会员系统，历史记录，积分管理'
          },
          {
            icon: '📊',
            title: '数据报表',
            description: '经营分析，趋势预测，决策支持'
          },
          {
            icon: '⚙️',
            title: '系统设置',
            description: '权限管理，配置调优，数据安全'
          },
          {
            icon: '📱',
            title: '移动办公',
            description: '随时随地管理酒店业务'
          }
        ]
      }
    },
    en: {
      nav: {
        dashboard: 'Dashboard',
        rooms: 'Room Mgmt',
        bookings: 'Bookings',
        customers: 'Customers',
        reports: 'Reports',
        settings: 'Settings',
        login: 'Login',
        register: 'Register'
      },
      hero: {
        title: '🏨 Hotel Inistel',
        subtitle: 'Smart Hotel Management System',
        description: 'Modern management platform designed for Southeast Asian hotels',
        quickActions: 'Quick Actions'
      },
      stats: {
        totalRooms: 'Total Rooms',
        occupied: 'Occupied',
        available: 'Available',
        maintenance: 'Maintenance'
      },
      quickActions: {
        checkIn: 'Check In',
        checkOut: 'Check Out',
        newBooking: 'New Booking',
        roomStatus: 'Room Status',
        dailyReport: 'Daily Report',
        customerSearch: 'Customer Search'
      },
      features: {
        title: 'Core Features',
        subtitle: 'Practical tools focused on hotel management',
        items: [
          {
            icon: '🛏️',
            title: 'Room Management',
            description: 'Real-time monitoring, smart allocation, maximize revenue'
          },
          {
            icon: '📅',
            title: 'Booking System',
            description: 'Online booking, OTA integration, channel management'
          },
          {
            icon: '👥',
            title: 'Customer Management',
            description: 'Membership system, history records, points management'
          },
          {
            icon: '📊',
            title: 'Data Reports',
            description: 'Business analysis, trend prediction, decision support'
          },
          {
            icon: '⚙️',
            title: 'System Settings',
            description: 'Permission management, configuration tuning, data security'
          },
          {
            icon: '📱',
            title: 'Mobile Office',
            description: 'Manage hotel business anytime, anywhere'
          }
        ]
      }
    }
  };

  const t = content[language];

  // Mock data for demonstration
  const mockStats = {
    totalRooms: 50,
    occupied: 38,
    available: 10,
    maintenance: 2
  };

  return (
    <div className="min-h-screen bg-warm">
      {/* Navigation */}
      <nav className="bg-white border-b border-warm-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-warm-800">{t.hero.title}</h1>
                <p className="text-sm text-warm-500">{t.hero.subtitle}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/dashboard" className="text-warm-600 hover:text-primary-600 font-medium">
                {t.nav.dashboard}
              </Link>
              <Link to="/rooms" className="text-warm-600 hover:text-primary-600 font-medium">
                {t.nav.rooms}
              </Link>
              <Link to="/bookings" className="text-warm-600 hover:text-primary-600 font-medium">
                {t.nav.bookings}
              </Link>
              <Link to="/customers" className="text-warm-600 hover:text-primary-600 font-medium">
                {t.nav.customers}
              </Link>
              <Link to="/reports" className="text-warm-600 hover:text-primary-600 font-medium">
                {t.nav.reports}
              </Link>
            </div>

            {/* Language Switcher & Auth */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage('zh')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  language === 'zh' ? 'bg-primary-100 text-primary-700' : 'text-warm-500 hover:text-primary-600'
                }`}
              >
                中文
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  language === 'en' ? 'bg-primary-100 text-primary-700' : 'text-warm-500 hover:text-primary-600'
                }`}
              >
                EN
              </button>
              <Link
                to="/login"
                className="bg-primary-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-600 transition-colors"
              >
                {t.nav.login}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-warm-800 mb-2">
            欢迎使用 Hotel Inistel
          </h2>
          <p className="text-warm-600">
            {t.hero.description}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-warm-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-warm-500 text-sm">{t.stats.totalRooms}</p>
                <p className="text-2xl font-bold text-warm-800">{mockStats.totalRooms}</p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🏨</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-warm-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-warm-500 text-sm">{t.stats.occupied}</p>
                <p className="text-2xl font-bold text-error">{mockStats.occupied}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-warm-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-warm-500 text-sm">{t.stats.available}</p>
                <p className="text-2xl font-bold text-success">{mockStats.available}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🟢</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-warm-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-warm-500 text-sm">{t.stats.maintenance}</p>
                <p className="text-2xl font-bold text-warning">{mockStats.maintenance}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🔧</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-warm-200 mb-8">
          <div className="p-6 border-b border-warm-200">
            <h3 className="text-lg font-semibold text-warm-800">{t.hero.quickActions}</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <button className="flex flex-col items-center p-4 rounded-lg hover:bg-warm-50 transition-colors">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">🛎️</span>
                </div>
                <span className="text-sm text-warm-700">{t.quickActions.checkIn}</span>
              </button>

              <button className="flex flex-col items-center p-4 rounded-lg hover:bg-warm-50 transition-colors">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">🚪</span>
                </div>
                <span className="text-sm text-warm-700">{t.quickActions.checkOut}</span>
              </button>

              <button className="flex flex-col items-center p-4 rounded-lg hover:bg-warm-50 transition-colors">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">📝</span>
                </div>
                <span className="text-sm text-warm-700">{t.quickActions.newBooking}</span>
              </button>

              <button className="flex flex-col items-center p-4 rounded-lg hover:bg-warm-50 transition-colors">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">🔍</span>
                </div>
                <span className="text-sm text-warm-700">{t.quickActions.roomStatus}</span>
              </button>

              <button className="flex flex-col items-center p-4 rounded-lg hover:bg-warm-50 transition-colors">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">📊</span>
                </div>
                <span className="text-sm text-warm-700">{t.quickActions.dailyReport}</span>
              </button>

              <button className="flex flex-col items-center p-4 rounded-lg hover:bg-warm-50 transition-colors">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-2">
                  <span className="text-xl">👤</span>
                </div>
                <span className="text-sm text-warm-700">{t.quickActions.customerSearch}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-warm-200">
          <div className="p-6 border-b border-warm-200">
            <h3 className="text-lg font-semibold text-warm-800">{t.features.title}</h3>
            <p className="text-warm-600 mt-1">{t.features.subtitle}</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {t.features.items.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg hover:bg-warm-50 transition-colors">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-warm-800 mb-1">{feature.title}</h4>
                    <p className="text-sm text-warm-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-warm-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
                <span className="text-lg font-bold">Hotel Inistel</span>
              </div>
              <p className="text-warm-300 text-sm">
                智能酒店管理系统的领先解决方案提供商
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">产品功能</h4>
              <ul className="space-y-2 text-sm text-warm-300">
                <li><Link to="/rooms" className="hover:text-white">房间管理</Link></li>
                <li><Link to="/bookings" className="hover:text-white">预订系统</Link></li>
                <li><Link to="/customers" className="hover:text-white">客户管理</Link></li>
                <li><Link to="/reports" className="hover:text-white">数据报表</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">支持服务</h4>
              <ul className="space-y-2 text-sm text-warm-300">
                <li><a href="#" className="hover:text-white">技术支持</a></li>
                <li><a href="#" className="hover:text-white">文档中心</a></li>
                <li><a href="#" className="hover:text-white">培训服务</a></li>
                <li><a href="#" className="hover:text-white">API文档</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">关于我们</h4>
              <ul className="space-y-2 text-sm text-warm-300">
                <li><a href="#" className="hover:text-white">公司介绍</a></li>
                <li><a href="#" className="hover:text-white">联系我们</a></li>
                <li><a href="#" className="hover:text-white">隐私政策</a></li>
                <li><a href="#" className="hover:text-white">服务条款</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-warm-700 mt-8 pt-8 text-center text-sm text-warm-300">
            <p>&copy; 2024 Hotel Inistel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
