import React, { useState } from 'react';
import { WebDevelopmentIcon, AIIcon, UserBadgeIcon, PremiumIcon } from '../components/Icons';
import { CodeDisplayMinimal } from '../components/CodeDisplay/CodeDisplay';
import { CircularProgressGradient } from '../components/Progress/Progress';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: 'web' | 'ai' | 'mobile' | 'backend';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  isPremium: boolean;
  progress?: number;
  thumbnail: string;
  author: string;
  rating: number;
  students: number;
  tags: string[];
  codePreview?: string;
}

const mockTutorials: Tutorial[] = [
  {
    id: '1',
    title: 'React Hooks 完整指南',
    description: '深入学习React Hooks，掌握现代React开发模式',
    category: 'web',
    level: 'intermediate',
    duration: '4小时',
    isPremium: false,
    progress: 65,
    thumbnail: '/api/placeholder/300/200',
    author: 'React专家',
    rating: 4.8,
    students: 1250,
    tags: ['React', 'Hooks', 'JavaScript'],
    codePreview: `const [count, setCount] = useState(0);

useEffect(() => {
  document.title = \`点击了 \${count} 次\`;
}, [count]);`
  },
  {
    id: '2',
    title: 'Python机器学习实战',
    description: '从零开始学习机器学习，构建你的第一个AI模型',
    category: 'ai',
    level: 'beginner',
    duration: '8小时',
    isPremium: true,
    thumbnail: '/api/placeholder/300/200',
    author: 'AI研究员',
    rating: 4.9,
    students: 890,
    tags: ['Python', 'ML', 'AI', 'Scikit-learn'],
    codePreview: `from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# 训练模型
model = LinearRegression()
model.fit(X_train, y_train)`
  },
  {
    id: '3',
    title: 'Node.js API开发',
    description: '构建高性能的RESTful API和GraphQL服务',
    category: 'backend',
    level: 'intermediate',
    duration: '6小时',
    isPremium: false,
    progress: 20,
    thumbnail: '/api/placeholder/300/200',
    author: '后端工程师',
    rating: 4.7,
    students: 670,
    tags: ['Node.js', 'Express', 'API', 'GraphQL'],
    codePreview: `app.get('/api/users', async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`
  },
];

export const TutorialsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', name: '全部', icon: null },
    { id: 'web', name: 'Web开发', icon: WebDevelopmentIcon },
    { id: 'ai', name: 'AI & ML', icon: AIIcon },
    { id: 'mobile', name: '移动开发', icon: UserBadgeIcon },
    { id: 'backend', name: '后端开发', icon: WebDevelopmentIcon },
  ];

  const levels = [
    { id: 'all', name: '全部等级' },
    { id: 'beginner', name: '初学者' },
    { id: 'intermediate', name: '中级' },
    { id: 'advanced', name: '高级' },
  ];

  const filteredTutorials = mockTutorials.filter(tutorial => {
    if (selectedCategory !== 'all' && tutorial.category !== selectedCategory) return false;
    if (selectedLevel !== 'all' && tutorial.level !== selectedLevel) return false;
    if (showPremiumOnly && !tutorial.isPremium) return false;
    if (searchQuery && !tutorial.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'web': return <WebDevelopmentIcon className="w-5 h-5" />;
      case 'ai': return <AIIcon className="w-5 h-5" />;
      case 'backend': return <WebDevelopmentIcon className="w-5 h-5" />;
      default: return <UserBadgeIcon className="w-5 h-5" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'text-green-400 bg-green-900/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-900/20';
      case 'advanced': return 'text-red-400 bg-red-900/20';
      default: return 'text-gray-400 bg-gray-900/20';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            教程中心
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            探索我们精心整理的技术教程，提升你的编程技能
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="搜索教程..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const IconComponent = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    {category.name}
                  </button>
                );
              })}
            </div>

            {/* Level Filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {levels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name}
                </option>
              ))}
            </select>

            {/* Premium Filter */}
            <label className="flex items-center gap-2 px-4 py-2 bg-gray-700 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showPremiumOnly}
                onChange={(e) => setShowPremiumOnly(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-600 border-gray-500 rounded focus:ring-purple-500"
              />
              <PremiumIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-gray-300">仅付费</span>
            </label>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            找到 {filteredTutorials.length} 个教程
          </p>
        </div>

        {/* Tutorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredTutorials.map(tutorial => (
            <div
              key={tutorial.id}
              className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-750 transition-colors group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                {getCategoryIcon(tutorial.category)}
                {tutorial.isPremium && (
                  <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <PremiumIcon className="w-3 h-3" />
                    付费
                  </div>
                )}
                {tutorial.progress !== undefined && (
                  <div className="absolute bottom-3 right-3">
                    <CircularProgressGradient
                      percentage={tutorial.progress}
                      size="small"
                      showLabel={false}
                    />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(tutorial.level)}`}>
                    {tutorial.level === 'beginner' ? '初学者' : 
                     tutorial.level === 'intermediate' ? '中级' : '高级'}
                  </span>
                  <span className="text-gray-400 text-sm">{tutorial.duration}</span>
                </div>

                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  {tutorial.title}
                </h3>

                <p className="text-gray-400 mb-4 line-clamp-2">
                  {tutorial.description}
                </p>

                {/* Code Preview */}
                {tutorial.codePreview && (
                  <div className="mb-4">
                    <CodeDisplayMinimal
                      code={tutorial.codePreview}
                      language="javascript"
                      theme="dark"
                      showCopy={false}
                    />
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {tutorial.tags.map(tag => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <span>{tutorial.author}</span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      ⭐ {tutorial.rating}
                    </span>
                    <span>{tutorial.students} 学员</span>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg transition-all font-medium">
                  {tutorial.progress !== undefined ? '继续学习' : 
                   tutorial.isPremium ? '立即购买' : '开始学习'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTutorials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              没有找到匹配的教程
            </h3>
            <p className="text-gray-500">
              尝试调整筛选条件或搜索关键词
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
