const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

// 注册
router.post('/register', [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
  body('hotelName').notEmpty(),
  body('hotelAddress').notEmpty(),
  body('adminName').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password, hotelName, hotelAddress, hotelPhone, roomCount, adminName, adminPhone } = req.body;
    
    // 这里应该调用数据库创建租户和用户
    // 简化示例
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const token = jwt.sign(
      { userId: Date.now(), email },
      process.env.JWT_SECRET || 'hotel_jwt_secret_2024',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: {
        email,
        hotelName,
        subscription: 'trial'
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 登录
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    
    // 这里应该查询数据库验证用户
    // 简化示例
    const token = jwt.sign(
      { userId: Date.now(), email },
      process.env.JWT_SECRET || 'hotel_jwt_secret_2024',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
