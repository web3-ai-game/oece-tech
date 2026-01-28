import { Router } from 'express';
import { Request, Response } from 'express';

const router = Router();

// 模拟登录
router.post('/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: '邮箱和密码是必填的' });
  }
  
  // 简单的模拟验证
  if (email === 'admin@example.com' && password === 'password') {
    res.json({
      success: true,
      user: { id: 1, name: '管理员', email: 'admin@example.com' },
      token: 'mock-jwt-token'
    });
  } else {
    res.status(401).json({ error: '邮箱或密码错误' });
  }
});

// 模拟注册
router.post('/register', (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ error: '所有字段都是必填的' });
  }
  
  res.status(201).json({
    success: true,
    user: { id: Date.now(), name, email },
    token: 'mock-jwt-token'
  });
});

// 验证token
router.get('/me', (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: '未授权' });
  }
  
  res.json({
    user: { id: 1, name: '管理员', email: 'admin@example.com' }
  });
});

export default router;