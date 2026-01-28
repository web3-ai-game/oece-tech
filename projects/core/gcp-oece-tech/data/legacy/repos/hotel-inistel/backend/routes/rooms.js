const express = require('express');
const router = express.Router();

// 获取所有房间
router.get('/', async (req, res) => {
  try {
    // 从数据库获取房间列表
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建房间
router.post('/', async (req, res) => {
  try {
    const room = req.body;
    // 保存到数据库
    res.json({ success: true, room });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
