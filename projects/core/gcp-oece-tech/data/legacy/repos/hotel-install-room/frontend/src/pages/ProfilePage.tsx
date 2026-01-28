import React, { useState } from 'react';
import { CircularProgressAnimated, StepProgressVertical } from '../components/Progress';

interface UserProfile {
  name: string;
  email: string;
  role: string;
  hotel: string;
  avatar: string;
  joinDate: string;
  totalBookings: number;
  monthlyBookings: number;
  customerRating: number;
  workHours: number;
}

interface WorkSchedule {
  date: string;
  shift: string;
  hours: number;
  status: 'completed' | 'ongoing' | 'upcoming';
}

export const ProfilePage: React.FC = () => {
  const [userProfile] = useState<UserProfile>({
    name: '张小明',
    email: 'zhang.xiaoming@hotelinistel.com',
    role: '前台接待',
    hotel: 'Hotel Inistel Bangkok',
    avatar: '/api/placeholder/150/150',
    joinDate: '2023-06-15',
    totalBookings: 1250,
    monthlyBookings: 89,
    customerRating: 4.8,
    workHours: 168
  });

  const workSchedule: WorkSchedule[] = [
    { date: '2024-01-15', shift: '早班 (06:00-14:00)', hours: 8, status: 'completed' },
    { date: '2024-01-16', shift: '中班 (14:00-22:00)', hours: 8, status: 'completed' },
    { date: '2024-01-17', shift: '晚班 (22:00-06:00)', hours: 8, status: 'ongoing' },
    { date: '2024-01-18', shift: '早班 (06:00-14:00)', hours: 8, status: 'upcoming' },
  ];

  const achievements = [
    { title: '优秀员工', description: '连续3个月客户评分超过4.5分', date: '2024-01-10', icon: '🏆' },
    { title: '服务之星', description: '单月处理预订数量突破100单', date: '2024-01-05', icon: '⭐' },
    { title: '团队协作', description: '协助新员工培训，获得好评', date: '2023-12-20', icon: '🤝' },
  ];

  const performanceSteps = [
    { title: '客户服务技能', completed: true },
    { title: '系统操作熟练度', completed: true },
    { title: '多语言沟通', completed: true },
    { title: '处理投诉能力', completed: false, current: true },
    { title: '销售技巧', completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-white">{userProfile.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{userProfile.name}</h1>
              <p className="text-gray-300 mb-1">{userProfile.role} · {userProfile.hotel}</p>
              <p className="text-gray-400">{userProfile.email}</p>
              <p className="text-gray-400 text-sm">入职时间: {userProfile.joinDate}</p>
            </div>
            <div className="text-right">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                编辑资料
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{userProfile.totalBookings}</div>
            <div className="text-gray-300">总处理预订</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">{userProfile.monthlyBookings}</div>
            <div className="text-gray-300">本月预订</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-yellow-400 mb-2">{userProfile.customerRating}</div>
            <div className="text-gray-300">客户评分</div>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">{userProfile.workHours}h</div>
            <div className="text-gray-300">本月工时</div>
          </div>
        </div>

        {/* Performance & Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-6">工作表现</h3>
            <div className="flex justify-center">
              <CircularProgressAnimated 
                progress={userProfile.customerRating * 20}
                size={120}
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-gray-300">总体评分: {userProfile.customerRating}/5.0</p>
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-6">技能发展</h3>
            <StepProgressVertical steps={performanceSteps} />
          </div>
        </div>

        {/* Work Schedule */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-6">工作安排</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 text-gray-300">日期</th>
                  <th className="text-left py-3 text-gray-300">班次</th>
                  <th className="text-left py-3 text-gray-300">工时</th>
                  <th className="text-left py-3 text-gray-300">状态</th>
                </tr>
              </thead>
              <tbody>
                {workSchedule.map((schedule, index) => (
                  <tr key={index} className="border-b border-gray-700 last:border-0">
                    <td className="py-3 text-gray-300">{schedule.date}</td>
                    <td className="py-3 text-gray-300">{schedule.shift}</td>
                    <td className="py-3 text-gray-300">{schedule.hours}小时</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        schedule.status === 'completed' ? 'bg-green-600 text-white' :
                        schedule.status === 'ongoing' ? 'bg-yellow-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {schedule.status === 'completed' ? '已完成' :
                         schedule.status === 'ongoing' ? '进行中' : '待开始'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-6">成就与荣誉</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{achievement.icon}</span>
                  <h4 className="text-white font-semibold">{achievement.title}</h4>
                </div>
                <p className="text-gray-300 text-sm mb-2">{achievement.description}</p>
                <p className="text-gray-400 text-xs">{achievement.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
