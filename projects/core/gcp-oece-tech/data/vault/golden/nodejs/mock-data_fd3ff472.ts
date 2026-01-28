// 主站Mock数据 - 快速原型开发

export const mockArticles = [
  {
    id: '1',
    title: '数字游民的泰国生存指南',
    slug: 'thailand-digital-nomad-guide',
    excerpt: '从签证到生活成本，手把手教你在泰国开启数字游民生活...',
    content: '# 泰国数字游民完整指南\n\n## 签证选项\n\n泰国提供多种签证...',
    author: 'DeepDiver',
    publishedAt: '2024-11-01',
    isPro: false,
  },
  {
    id: '2',
    title: '葡萄牙D7签证申请全攻略',
    slug: 'portugal-d7-visa-guide',
    excerpt: '欧盟数字游民签证的最佳选择，详解D7签证申请流程...',
    content: '# 葡萄牙D7签证\n\n## 为什么选择D7\n\n性价比高...',
    author: 'UrbanDiver',
    publishedAt: '2024-10-28',
    isPro: false,
  },
  // ... 更多假数据
];

export const mockUser = {
  id: 'mock-user-123',
  email: 'demo@deepweay.me',
  displayName: '深潜者Demo',
  role: 'free',
  invitesRemaining: 2,
  createdAt: '2024-10-01',
};

export const mockInviteCodes = [
  {
    code: 'DEMO2024A',
    createdAt: '2024-11-01',
    isUsed: false,
  },
  {
    code: 'DEMO2024B',
    createdAt: '2024-11-02',
    isUsed: true,
    usedBy: 'friend@example.com',
    usedAt: '2024-11-03',
  },
];
