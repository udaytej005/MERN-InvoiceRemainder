const express = require('express');
const authMiddleware = require('../middleware/authMiddleware.js');
const { triggerReminder } = require('../services/automationService.js');

const router = express.Router();

router.post('/trigger', authMiddleware, async (req, res) => {
  try {
    const { invoiceId } = req.body;
    const result = await triggerReminder(invoiceId, req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;