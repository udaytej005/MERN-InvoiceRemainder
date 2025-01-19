const cron = require('node-cron');
const Invoice = require('../models/invoice.js');
const { sendAutomatedReminder } = require('../services/automationService.js');

// Automated reminders using cron
cron.schedule('0 9 * * *', async () => {
  try {
    const overdueInvoices = await Invoice.find({
      status: 'due',
      dueDate: { $lt: new Date() },
      lastReminderSent: { 
        $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last reminder > 24h ago
      }
    });

    for (const invoice of overdueInvoices) {
      await sendAutomatedReminder(invoice);
    }
  } catch (error) {
    console.error('Automated reminder error:', error);
  }
});