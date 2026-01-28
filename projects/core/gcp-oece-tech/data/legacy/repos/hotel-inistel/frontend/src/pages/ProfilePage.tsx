import React, { useState, useEffect } from 'react';
import { CircularProgressAnimated, StepProgressVertical } from '../components/Progress/Progress';
import { UserBadgeIcon, PremiumIcon } from '../components/Icons';
import { profileService, UserProfile } from '../services/profileService';

interface FavoriteTutorial {
  id: string;
  title: string;
  category: string;
  addedDate: string;
  isPremium: boolean;
}

interface PurchasedTutorial {
  id: string;
  title: string;
  price: number;
  purchaseDate: string;
  progress: number;
  status: 'active' | 'completed' | 'expired';
}

const mockFavorites: FavoriteTutorial[] = [
  {
    id: '1',
    title: 'React Hooks 完整指南',
    category: 'Web开发',
    addedDate: '2024-02-10',
    isPremium: false
  },
  {
    id: '2',
    title: 'Python机器学习实战',
    category: 'AI & ML',
    addedDate: '2024-02-08',
    isPremium: true
  },
  {
    id: '3',
    title: 'Vue.js 3.0 深入解析',
    category: 'Web开发',
    addedDate: '2024-01-28',
    isPremium: false
  }
];

const mockPurchases: PurchasedTutorial[] = [
  {
    id: '1',
    title: 'Python机器学习实战',
    price: 299,
    purchaseDate: '2024-02-01',
    progress: 75,
    status: 'active'
  },
  {
    id: '2',
    title: 'TypeScript 高级特性',
    price: 199,
    purchaseDate: '2024-01-20',
    progress: 100,
    status: 'completed'
  },
  {
    id: '3',
    title: 'GraphQL API 设计',
    price: 249,
    purchaseDate: '2024-01-10',
    progress: 45,
    status: 'active'
  }
];

const learningPath = [
  { id: '1', title: 'JavaScript基础', description: '掌握JS语言核心概念', completed: true },
  { id: '2', title: 'React入门', description: '学习React组件开发', completed: true, current: true },
  { id: '3', title: 'TypeScript进阶', description: '类型系统与高级特性', completed: false },
  { id: '4', title: '全栈项目实战', description: '构建完整Web应用', completed: false }
];

export const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'purchases' | 'settings'>('overview');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profile = await profileService.getProfile();
      setUserProfile(profile);
    } catch (err) {
      setError('无法加载用户信息');
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (data: { username: string }) => {
    try {
      await profileService.updateProfile(data);
      await loadProfile(); // Reload profile after update
      setIsEditingProfile(false);
    } catch (err) {
      setError('更新失败');
      console.error('Profile update error:', err);
    }
  };

  // 早期返回条件检查
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-white text-xl">加载中...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-red-400 text-xl">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  const tabs = [
    { id: 'overview', name: '概览', icon: '📊' },
    { id: 'favorites', name: '收藏', icon: '❤️' },
    { id: 'purchases', name: '已购买', icon: '💰' },
    { id: 'settings', name: '设置', icon: '⚙️' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-900/20';
      case 'completed': return 'text-blue-400 bg-blue-900/20';
      case 'expired': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  const renderOverview = () => {
    return (
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 p-6 rounded-lg text-white">
            <div className="text-3xl font-bold">{userProfile.completedCourses}</div>
            <div className="text-purple-200">已完成课程</div>
          </div>
          <div className="bg-gradient-to-br from-pink-600 to-pink-800 p-6 rounded-lg text-white">
            <div className="text-3xl font-bold">{userProfile.totalHours}</div>
            <div className="text-pink-200">学习时长(小时)</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-6 rounded-lg text-white">
            <div className="text-3xl font-bold">{userProfile.totalCourses}</div>
            <div className="text-blue-200">总课程数</div>
          </div>
          <div className="bg-gradient-to-br from-green-600 to-green-800 p-6 rounded-lg text-white">
            <div className="text-3xl font-bold">{userProfile.rank}</div>
            <div className="text-green-200">学员等级</div>
          </div>
        </div>

        {/* Progress & Learning Path */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-6">整体学习进度</h3>
            <div className="flex justify-center">
              <CircularProgressAnimated 
                percentage={(userProfile.completedCourses / userProfile.totalCourses) * 100}
                size="large"
              />
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-6">学习路径</h3>
            <StepProgressVertical steps={userProfile.learningPath || learningPath} />
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-6">最近活动</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-white font-medium">完成了"React Hooks 完整指南"</div>
                <div className="text-gray-400 text-sm">2小时前</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-white font-medium">购买了"Python机器学习实战"</div>
                <div className="text-gray-400 text-sm">1天前</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 bg-gray-700 rounded-lg">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <div className="flex-1">
                <div className="text-white font-medium">收藏了"Vue.js 3.0 深入解析"</div>
                <div className="text-gray-400 text-sm">3天前</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFavorites = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">我的收藏 ({mockFavorites.length})</h3>
        <button className="text-purple-400 hover:text-purple-300">
          清空收藏
        </button>
      </div>
      
      <div className="grid gap-4">
        {mockFavorites.map(fav => (
          <div key={fav.id} className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h4 className="text-lg font-medium text-white">{fav.title}</h4>
                  {fav.isPremium && <PremiumIcon className="w-5 h-5 text-yellow-400" />}
                </div>
                <p className="text-gray-400 mb-2">{fav.category}</p>
                <p className="text-sm text-gray-500">添加于 {fav.addedDate}</p>
              </div>
              <div className="flex gap-2">
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
                  开始学习
                </button>
                <button className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors">
                  移除
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPurchases = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">已购买课程 ({mockPurchases.length})</h3>
        <div className="text-gray-400">
          总消费: ¥{mockPurchases.reduce((sum, p) => sum + p.price, 0)}
        </div>
      </div>
      
      <div className="grid gap-4">
        {mockPurchases.map(purchase => (
          <div key={purchase.id} className="bg-gray-800 p-6 rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-white mb-2">{purchase.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>购买日期: {purchase.purchaseDate}</span>
                  <span>价格: ¥{purchase.price}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(purchase.status)}`}>
                    {purchase.status === 'active' ? '学习中' : 
                     purchase.status === 'completed' ? '已完成' : '已过期'}
                  </span>
                </div>
              </div>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors">
                {purchase.status === 'completed' ? '重新学习' : '继续学习'}
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${purchase.progress}%` }}
              />
            </div>
            <div className="text-right text-sm text-gray-400 mt-1">
              {purchase.progress}% 完成
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-6">个人信息</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">用户名</label>
            <input
              type="text"
              value={userProfile?.username || ''}
              onChange={(e) => userProfile && setUserProfile({...userProfile, username: e.target.value})}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={!isEditingProfile}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">邮箱地址</label>
            <input
              type="email"
              value={userProfile?.email || ''}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={true}
            />
          </div>
          <div className="flex gap-4">
            {isEditingProfile ? (
              <>
                <button 
                  onClick={() => handleUpdateProfile({ username: userProfile?.username || '' })}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
                >
                  保存修改
                </button>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded transition-colors"
                >
                  取消
                </button>
              </>
            ) : (
              <button 
                onClick={() => setIsEditingProfile(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded transition-colors"
              >
                编辑信息
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-6">通知设置</h3>
        <div className="space-y-4">
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span className="text-gray-300">课程更新通知</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" defaultChecked />
            <span className="text-gray-300">学习提醒</span>
          </label>
          <label className="flex items-center">
            <input type="checkbox" className="mr-3" />
            <span className="text-gray-300">营销邮件</span>
          </label>
        </div>
      </div>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-6">账户安全</h3>
        <div className="space-y-4">
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition-colors">
            修改密码
          </button>
          <button className="w-full bg-gray-600 hover:bg-gray-500 text-white py-2 rounded transition-colors">
            启用两步验证
          </button>
          <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded transition-colors">
            删除账户
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-purple-900 to-pink-900 p-8 rounded-lg mb-8">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
              <UserBadgeIcon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{userProfile.username}</h1>
              <p className="text-purple-200 mb-1">{userProfile.email}</p>
              <p className="text-purple-300 text-sm">加入时间: {userProfile.joinDate}</p>
            </div>
            <div className="text-right text-white">
              <div className="text-2xl font-bold">{userProfile.rank}</div>
              <div className="text-purple-200">学员等级</div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-lg p-6">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'favorites' && renderFavorites()}
          {activeTab === 'purchases' && renderPurchases()}
          {activeTab === 'settings' && renderSettings()}
        </div>
      </div>
    </div>
  );
};
