const express = require('express');
const router = express.Router();

// 获取所有预订
router.get('/', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 创建预订
router.post('/', async (req, res) => {
  try {
    const booking = req.body;
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
