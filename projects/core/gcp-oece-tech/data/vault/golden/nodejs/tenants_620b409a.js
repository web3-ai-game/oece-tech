const express = require('express');
const router = express.Router();

// 获取租户信息
router.get('/:tenantId', async (req, res) => {
  try {
    // 从数据库获取租户信息
    res.json({
      id: req.params.tenantId,
      name: 'Demo Hotel',
      subscription: 'trial',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
