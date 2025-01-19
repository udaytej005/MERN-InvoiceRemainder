const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Invoice = require('../models/invoice');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const invoices = await Invoice.find({ userId: req.user.id });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const invoice = new Invoice({
      ...req.body,
      userId: req.user.id
    });
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;