const express = require('express');
const router = express.Router();

// 获取所有客户
router.get('/', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建客户
router.post('/', async (req, res) => {
  try {
    const customer = req.body;
    res.json({ success: true, customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
