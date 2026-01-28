import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// 模拟用户数据
const mockUsers = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' },
  { id: 3, name: '王五', email: 'wangwu@example.com' },
];

// 获取所有用户
router.get('/', (req: Request, res: Response) => {
  res.json(mockUsers);
});

// 获取单个用户
router.get('/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const user = mockUsers.find(u => u.id === userId);
  
  if (!user) {
    return res.status(404).json({ error: '用户不存在' });
  }
  
  res.json(user);
});

// 创建用户
router.post('/', (req: Request, res: Response) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ error: '姓名和邮箱是必填的' });
  }
  
  const newUser = {
    id: mockUsers.length + 1,
    name,
    email
  };
  
  mockUsers.push(newUser);
  res.status(201).json(newUser);
});

// 更新用户
router.put('/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }
  
  const { name, email } = req.body;
  
  if (name) mockUsers[userIndex].name = name;
  if (email) mockUsers[userIndex].email = email;
  
  res.json(mockUsers[userIndex]);
});

// 删除用户
router.delete('/:id', (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);
  const userIndex = mockUsers.findIndex(u => u.id === userId);
  
  if (userIndex === -1) {
    return res.status(404).json({ error: '用户不存在' });
  }
  
  mockUsers.splice(userIndex, 1);
  res.json({ message: '用户已删除' });
});

export default router;