import React, { useState } from 'react';

interface Ticket {
  id: string;
  title: string;
  description: string;
  category: 'technical' | 'billing' | 'course' | 'remote_assistance';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_for_user' | 'resolved' | 'closed';
  created: string;
  updated: string;
  assignedTo?: string;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  author: string;
  role: 'user' | 'support' | 'system';
  content: string;
  timestamp: string;
  attachments?: string[];
}

interface NewTicketForm {
  title: string;
  description: string;
  category: string;
  priority: string;
}

const mockTickets: Ticket[] = [
  {
    id: 'TK-001',
    title: '需要远程协助调试React应用',
    description: '我的React应用在部署后出现路由问题，希望能获得远程技术支持',
    category: 'remote_assistance',
    priority: 'high',
    status: 'in_progress',
    created: '2024-03-01T10:00:00Z',
    updated: '2024-03-01T14:30:00Z',
    assignedTo: '技术专家-李工',
    messages: [
      {
        id: 'msg1',
        author: 'John Doe',
        role: 'user',
        content: '我的React应用在本地运行正常，但部署到服务器后路由不工作了。',
        timestamp: '2024-03-01T10:00:00Z'
      },
      {
        id: 'msg2',
        author: '技术专家-李工',
        role: 'support',
        content: '您好！我会帮您解决这个问题。请先确认一下您使用的路由模式和服务器配置。我们可以安排远程协助吗？',
        timestamp: '2024-03-01T10:30:00Z'
      }
    ]
  },
  {
    id: 'TK-002',
    title: '课程视频无法播放',
    description: 'Python机器学习课程的第3章视频一直显示加载中',
    category: 'technical',
    priority: 'medium',
    status: 'resolved',
    created: '2024-02-28T09:15:00Z',
    updated: '2024-02-28T16:45:00Z',
    assignedTo: '客服-小王',
    messages: [
      {
        id: 'msg3',
        author: 'Jane Smith',
        role: 'user',
        content: '第3章的视频一直加载不出来，其他视频都正常。',
        timestamp: '2024-02-28T09:15:00Z'
      },
      {
        id: 'msg4',
        author: '客服-小王',
        role: 'support',
        content: '问题已修复，是CDN缓存问题。请清除浏览器缓存后重试。',
        timestamp: '2024-02-28T16:45:00Z'
      }
    ]
  }
];

export const TicketPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [newTicketForm, setNewTicketForm] = useState<NewTicketForm>({
    title: '',
    description: '',
    category: 'technical',
    priority: 'medium'
  });

  const categories = [
    { id: 'technical', name: '技术支持', color: 'bg-blue-600' },
    { id: 'billing', name: '账单问题', color: 'bg-green-600' },
    { id: 'course', name: '课程相关', color: 'bg-purple-600' },
    { id: 'remote_assistance', name: '远程协助', color: 'bg-red-600' }
  ];

  const priorities = [
    { id: 'low', name: '低', color: 'text-green-400 bg-green-900/20' },
    { id: 'medium', name: '中', color: 'text-yellow-400 bg-yellow-900/20' },
    { id: 'high', name: '高', color: 'text-orange-400 bg-orange-900/20' },
    { id: 'urgent', name: '紧急', color: 'text-red-400 bg-red-900/20' }
  ];

  const statuses = [
    { id: 'open', name: '待处理', color: 'text-red-400 bg-red-900/20' },
    { id: 'in_progress', name: '处理中', color: 'text-blue-400 bg-blue-900/20' },
    { id: 'waiting_for_user', name: '等待用户', color: 'text-yellow-400 bg-yellow-900/20' },
    { id: 'resolved', name: '已解决', color: 'text-green-400 bg-green-900/20' },
    { id: 'closed', name: '已关闭', color: 'text-gray-400 bg-gray-900/20' }
  ];

  const getCategoryInfo = (category: string) => {
    return categories.find(c => c.id === category) || categories[0];
  };

  const getPriorityInfo = (priority: string) => {
    return priorities.find(p => p.id === priority) || priorities[1];
  };

  const getStatusInfo = (status: string) => {
    return statuses.find(s => s.id === status) || statuses[0];
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: Ticket = {
      id: `TK-${String(tickets.length + 1).padStart(3, '0')}`,
      ...newTicketForm,
      category: newTicketForm.category as 'technical' | 'billing' | 'course' | 'remote_assistance',
      priority: newTicketForm.priority as 'low' | 'medium' | 'high' | 'urgent',
      status: 'open',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      messages: []
    };
    setTickets([newTicket, ...tickets]);
    setNewTicketForm({ title: '', description: '', category: 'technical', priority: 'medium' });
    setShowCreateForm(false);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim()) return;

    const newMsg: TicketMessage = {
      id: `msg${Date.now()}`,
      author: 'John Doe', // 当前用户
      role: 'user',
      content: newMessage,
      timestamp: new Date().toISOString()
    };

    const updatedTicket = {
      ...selectedTicket,
      messages: [...selectedTicket.messages, newMsg],
      updated: new Date().toISOString()
    };

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t));
    setSelectedTicket(updatedTicket);
    setNewMessage('');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN');
  };

  if (selectedTicket) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setSelectedTicket(null)}
              className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
            >
              ← 返回工单列表
            </button>
          </div>

          {/* Ticket Details */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">
                  {selectedTicket.title}
                </h1>
                <p className="text-gray-400 mb-4">{selectedTicket.description}</p>
                
                <div className="flex flex-wrap gap-3">
                  <span className="text-gray-500 text-sm">工单号: {selectedTicket.id}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryInfo(selectedTicket.category).color} text-white`}>
                    {getCategoryInfo(selectedTicket.category).name}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getPriorityInfo(selectedTicket.priority).color}`}>
                    优先级: {getPriorityInfo(selectedTicket.priority).name}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusInfo(selectedTicket.status).color}`}>
                    {getStatusInfo(selectedTicket.status).name}
                  </span>
                </div>
              </div>

              <div className="text-right text-sm text-gray-400">
                <div>创建时间: {formatDate(selectedTicket.created)}</div>
                <div>更新时间: {formatDate(selectedTicket.updated)}</div>
                {selectedTicket.assignedTo && (
                  <div>负责人: {selectedTicket.assignedTo}</div>
                )}
              </div>
            </div>

            {/* Remote Assistance Button */}
            {selectedTicket.category === 'remote_assistance' && (
              <div className="border-t border-gray-700 pt-4">
                <div className="bg-gradient-to-r from-red-900/20 to-pink-900/20 border border-red-500/30 p-4 rounded-lg">
                  <h3 className="text-red-400 font-semibold mb-2 flex items-center gap-2">
                    🔧 远程协助服务
                  </h3>
                  <p className="text-gray-300 text-sm mb-4">
                    我们的技术专家将通过安全的远程连接为您提供实时技术支持
                  </p>
                  <div className="flex gap-3">
                    <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors font-medium">
                      开始远程协助 (¥199/小时)
                    </button>
                    <button className="border border-red-500 text-red-400 hover:bg-red-500 hover:text-white px-6 py-2 rounded-lg transition-colors">
                      预约时间
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-6">对话记录</h2>
            
            <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
              {selectedTicket.messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-purple-600 text-white'
                      : message.role === 'support'
                      ? 'bg-gray-700 text-gray-100'
                      : 'bg-blue-600 text-white'
                  }`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{message.author}</span>
                      <span className="text-xs opacity-75">
                        {formatDate(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="输入您的消息..."
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                disabled={selectedTicket.status === 'closed'}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || selectedTicket.status === 'closed'}
                className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg transition-colors"
              >
                发送
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">支持工单</h1>
            <p className="text-gray-400">获取技术支持和远程协助服务</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all font-medium"
          >
            创建工单
          </button>
        </div>

        {/* Create Ticket Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-white mb-6">创建新工单</h2>
              
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    工单标题 *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTicketForm.title}
                    onChange={(e) => setNewTicketForm({...newTicketForm, title: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="简要描述您的问题"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    详细描述 *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newTicketForm.description}
                    onChange={(e) => setNewTicketForm({...newTicketForm, description: e.target.value})}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="详细描述您遇到的问题，包括操作步骤、错误信息等"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      问题分类
                    </label>
                    <select
                      value={newTicketForm.category}
                      onChange={(e) => setNewTicketForm({...newTicketForm, category: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      优先级
                    </label>
                    <select
                      value={newTicketForm.priority}
                      onChange={(e) => setNewTicketForm({...newTicketForm, priority: e.target.value})}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      {priorities.map(priority => (
                        <option key={priority.id} value={priority.id}>
                          {priority.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {newTicketForm.category === 'remote_assistance' && (
                  <div className="bg-red-900/20 border border-red-500/30 p-4 rounded-lg">
                    <h4 className="text-red-400 font-semibold mb-2">远程协助服务说明</h4>
                    <ul className="text-gray-300 text-sm space-y-1">
                      <li>• 专业技术专家一对一服务</li>
                      <li>• 安全加密的远程连接</li>
                      <li>• 实时解决技术问题</li>
                      <li>• 收费标准：¥199/小时，按实际时长计费</li>
                    </ul>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    创建工单
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tickets List */}
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              onClick={() => setSelectedTicket(ticket)}
              className="bg-gray-800 p-6 rounded-lg hover:bg-gray-750 cursor-pointer transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{ticket.title}</h3>
                    <span className="text-gray-500 text-sm">#{ticket.id}</span>
                    {ticket.category === 'remote_assistance' && (
                      <span className="bg-red-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                        🔧 远程协助
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 mb-3 line-clamp-2">{ticket.description}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryInfo(ticket.category).color} text-white`}>
                      {getCategoryInfo(ticket.category).name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getPriorityInfo(ticket.priority).color}`}>
                      {getPriorityInfo(ticket.priority).name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusInfo(ticket.status).color}`}>
                      {getStatusInfo(ticket.status).name}
                    </span>
                  </div>
                </div>
                <div className="text-right text-sm text-gray-400">
                  <div>创建: {formatDate(ticket.created)}</div>
                  <div>更新: {formatDate(ticket.updated)}</div>
                  {ticket.assignedTo && <div>负责人: {ticket.assignedTo}</div>}
                  <div className="mt-2 text-purple-400">
                    {ticket.messages.length} 条消息 →
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {tickets.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-6xl mb-4">🎫</div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              暂无工单
            </h3>
            <p className="text-gray-500 mb-6">
              遇到问题或需要远程协助？创建您的第一个工单
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              创建工单
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
