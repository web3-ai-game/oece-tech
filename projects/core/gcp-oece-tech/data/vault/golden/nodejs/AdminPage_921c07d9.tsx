import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// Admin Sub-components
const Dashboard = () => {
  const stats = [
    { title: '酒店总数', value: '12', change: '+2', color: 'bg-blue-600' },
    { title: '房间总数', value: '856', change: '+45', color: 'bg-green-600' },
    { title: '本月营收', value: '¥485,678', change: '+25%', color: 'bg-purple-600' },
    { title: '活跃用户', value: '156', change: '+18', color: 'bg-orange-600' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">系统仪表板</h2>
      
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
            <span className="text-gray-300">酒店 "Bangkok Downtown" 新增 5 间房</span>
            <span className="text-gray-400 text-sm">5分钟前</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <span className="text-gray-300">用户 "manager_01" 完成了今日房态更新</span>
            <span className="text-gray-400 text-sm">1小时前</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
            <span className="text-gray-300">系统维护计划已完成</span>
            <span className="text-gray-400 text-sm">3小时前</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HotelManagement = () => {
  const hotels = [
    { id: 1, name: 'Hotel Inistel Bangkok', rooms: 120, occupancy: 85, status: 'active', revenue: '¥45,600' },
    { id: 2, name: 'Hotel Inistel Phuket', rooms: 89, occupancy: 92, status: 'active', revenue: '¥38,900' },
    { id: 3, name: 'Hotel Inistel Chiang Mai', rooms: 156, occupancy: 78, status: 'active', revenue: '¥52,300' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">酒店管理</h2>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
          添加新酒店
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-white">酒店名称</th>
              <th className="text-left p-4 text-white">房间数</th>
              <th className="text-left p-4 text-white">入住率</th>
              <th className="text-left p-4 text-white">状态</th>
              <th className="text-left p-4 text-white">月收入</th>
              <th className="text-left p-4 text-white">操作</th>
            </tr>
          </thead>
          <tbody>
            {hotels.map(hotel => (
              <tr key={hotel.id} className="border-t border-gray-700">
                <td className="p-4 text-gray-300">{hotel.name}</td>
                <td className="p-4 text-gray-300">{hotel.rooms}</td>
                <td className="p-4 text-gray-300">{hotel.occupancy}%</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    hotel.status === 'active' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {hotel.status === 'active' ? '运营中' : '维护中'}
                  </span>
                </td>
                <td className="p-4 text-gray-300">{hotel.revenue}</td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">编辑</button>
                    <button className="text-red-400 hover:text-red-300 text-sm">删除</button>
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
  const users = [
    { id: 1, name: '张经理', email: 'zhang@hotel.com', role: 'manager', hotel: 'Bangkok', status: 'active' },
    { id: 2, name: '李前台', email: 'li@hotel.com', role: 'receptionist', hotel: 'Phuket', status: 'active' },
    { id: 3, name: '王主管', email: 'wang@hotel.com', role: 'supervisor', hotel: 'Chiang Mai', status: 'inactive' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">用户管理</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors">
          添加用户
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-700">
            <tr>
              <th className="text-left p-4 text-white">姓名</th>
              <th className="text-left p-4 text-white">邮箱</th>
              <th className="text-left p-4 text-white">角色</th>
              <th className="text-left p-4 text-white">所属酒店</th>
              <th className="text-left p-4 text-white">状态</th>
              <th className="text-left p-4 text-white">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="border-t border-gray-700">
                <td className="p-4 text-gray-300">{user.name}</td>
                <td className="p-4 text-gray-300">{user.email}</td>
                <td className="p-4 text-gray-300">
                  {user.role === 'manager' ? '经理' : user.role === 'receptionist' ? '前台' : '主管'}
                </td>
                <td className="p-4 text-gray-300">{user.hotel}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
                  }`}>
                    {user.status === 'active' ? '活跃' : '禁用'}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-400 hover:text-blue-300 text-sm">编辑</button>
                    <button className="text-red-400 hover:text-red-300 text-sm">禁用</button>
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

const SystemSettings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">系统设置</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">基础设置</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">系统名称</label>
              <input 
                type="text" 
                defaultValue="Hotel Inistel Management"
                className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">默认时区</label>
              <select className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600">
                <option>Asia/Bangkok</option>
                <option>Asia/Shanghai</option>
                <option>UTC</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-4">安全设置</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">启用双重认证</span>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">已启用</button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">密码复杂度检查</span>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">已启用</button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-300">登录日志记录</span>
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">已启用</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Admin Component
export const AdminPage: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname.split('/admin/')[1] || '';

  const menuItems = [
    { path: '', label: '仪表板', icon: '📊' },
    { path: 'hotels', label: '酒店管理', icon: '🏨' },
    { path: 'users', label: '用户管理', icon: '👥' },
    { path: 'settings', label: '系统设置', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-gray-800 min-h-screen p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">管理后台</h1>
            <p className="text-gray-400 text-sm">Hotel Inistel</p>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map(item => (
              <Link
                key={item.path}
                to={`/admin/${item.path}`}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  currentPath === item.path
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hotels" element={<HotelManagement />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/settings" element={<SystemSettings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};
