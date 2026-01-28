import React, { useState } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Admin Sub-components
const Dashboard = () => {
  const stats = [
    { title: '总用户数', value: '2,847', change: '+12%', color: 'bg-blue-600' },
    { title: '课程总数', value: '156', change: '+8%', color: 'bg-green-600' },
    { title: '本月收入', value: '¥45,678', change: '+25%', color: 'bg-purple-600' },
    { title: '支持工单', value: '23', change: '-15%', color: 'bg-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">仪表板</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(stat => (
          <div key={stat.title} className={`${stat.color} p-6 rounded-lg text-white`}>
            <div className="text-3xl font-bold mb-2">{stat.value}</div>
            <div className="text-sm opacity-90 mb-1">{stat.title}</div>
            <div className="text-xs opacity-75">{stat.change} 较上月</div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">最近活动</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <span className="text-gray-300">用户 "john_doe" 购买了 "Python机器学习实战"</span>
            <span className="text-gray-400 text-sm">5分钟前</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <span className="text-gray-300">新教程 "Vue.js 3.0 进阶" 已发布</span>
            <span className="text-gray-400 text-sm">1小时前</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <span className="text-gray-300">支持工单 #1234 已解决</span>
            <span className="text-gray-400 text-sm">3小时前</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const TutorialManagement = () => {
  const [tutorials, setTutorials] = useState([
    { id: 1, title: 'React Hooks 完整指南', status: 'published', students: 1250, revenue: '¥0' },
    { id: 2, title: 'Python机器学习实战', status: 'published', students: 890, revenue: '¥266,110' },
    { id: 3, title: 'Node.js API开发', status: 'draft', students: 0, revenue: '¥0' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">教程管理</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
          创建新教程
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-white">标题</th>
              <th className="text-left p-4 text-white">状态</th>
              <th className="text-left p-4 text-white">学员数</th>
              <th className="text-left p-4 text-white">收入</th>
              <th className="text-left p-4 text-white">操作</th>
            </tr>
          </thead>
          <tbody>
            {tutorials.map(tutorial => (
              <tr key={tutorial.id} className="border-t border-gray-700">
                <td className="p-4 text-white">{tutorial.title}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    tutorial.status === 'published' ? 'bg-green-900/20 text-green-400' : 'bg-yellow-900/20 text-yellow-400'
                  }`}>
                    {tutorial.status === 'published' ? '已发布' : '草稿'}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{tutorial.students}</td>
                <td className="p-4 text-gray-300">{tutorial.revenue}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300">编辑</button>
                    <button className="text-red-400 hover:text-red-300">删除</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'active', joinDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'premium', status: 'active', joinDate: '2024-02-01' },
    { id: 3, name: 'Bob Wilson', email: 'bob@example.com', role: 'admin', status: 'active', joinDate: '2023-12-10' },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">用户管理</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="搜索用户..."
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white placeholder-gray-400"
          />
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
            导出
          </button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-white">用户名</th>
              <th className="text-left p-4 text-white">邮箱</th>
              <th className="text-left p-4 text-white">角色</th>
              <th className="text-left p-4 text-white">状态</th>
              <th className="text-left p-4 text-white">注册日期</th>
              <th className="text-left p-4 text-white">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-gray-700">
                <td className="p-4 text-white">{user.name}</td>
                <td className="p-4 text-gray-300">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.role === 'admin' ? 'bg-red-900/20 text-red-400' : 
                    user.role === 'premium' ? 'bg-yellow-900/20 text-yellow-400' : 
                    'bg-gray-900/20 text-gray-400'
                  }`}>
                    {user.role === 'admin' ? '管理员' : user.role === 'premium' ? '会员' : '普通用户'}
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-900/20 text-green-400">
                    活跃
                  </span>
                </td>
                <td className="p-4 text-gray-300">{user.joinDate}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300">编辑</button>
                    <button className="text-red-400 hover:text-red-300">禁用</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TicketManagement = () => {
  const [tickets, setTickets] = useState([
    { id: 1, title: '无法访问付费课程', user: 'John Doe', priority: 'high', status: 'open', created: '2024-03-01' },
    { id: 2, title: '视频播放问题', user: 'Jane Smith', priority: 'medium', status: 'in_progress', created: '2024-02-28' },
    { id: 3, title: '账户登录异常', user: 'Bob Wilson', priority: 'low', status: 'resolved', created: '2024-02-25' },
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-900/20 text-red-400';
      case 'medium': return 'bg-yellow-900/20 text-yellow-400';
      case 'low': return 'bg-green-900/20 text-green-400';
      default: return 'bg-gray-900/20 text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-900/20 text-red-400';
      case 'in_progress': return 'bg-blue-900/20 text-blue-400';
      case 'resolved': return 'bg-green-900/20 text-green-400';
      default: return 'bg-gray-900/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">工单管理</h2>
        <div className="flex gap-2">
          <select className="px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white">
            <option>所有状态</option>
            <option>待处理</option>
            <option>处理中</option>
            <option>已解决</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-white">工单标题</th>
              <th className="text-left p-4 text-white">用户</th>
              <th className="text-left p-4 text-white">优先级</th>
              <th className="text-left p-4 text-white">状态</th>
              <th className="text-left p-4 text-white">创建时间</th>
              <th className="text-left p-4 text-white">操作</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id} className="border-t border-gray-700">
                <td className="p-4 text-white">{ticket.title}</td>
                <td className="p-4 text-gray-300">{ticket.user}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority === 'high' ? '高' : ticket.priority === 'medium' ? '中' : '低'}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                    {ticket.status === 'open' ? '待处理' : 
                     ticket.status === 'in_progress' ? '处理中' : '已解决'}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{ticket.created}</td>
                <td className="p-4">
                  <div className="flex gap-2">
                    <button className="text-blue-400 hover:text-blue-300">查看</button>
                    <button className="text-green-400 hover:text-green-300">回复</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export const AdminPage: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin', name: '仪表板', icon: '📊' },
    { path: '/admin/tutorials', name: '教程管理', icon: '📚' },
    { path: '/admin/users', name: '用户管理', icon: '👥' },
    { path: '/admin/tickets', name: '工单管理', icon: '🎫' },
    { path: '/admin/analytics', name: '数据分析', icon: '📈' },
    { path: '/admin/settings', name: '系统设置', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white mb-8">管理面板</h1>
          <nav className="space-y-2">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="tutorials" element={<TutorialManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="tickets" element={<TicketManagement />} />
          <Route path="analytics" element={<div className="text-white">数据分析页面开发中...</div>} />
          <Route path="settings" element={<div className="text-white">系统设置页面开发中...</div>} />
        </Routes>
      </div>
    </div>
  );
};
