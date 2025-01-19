const Invoice = require('../models/invoice');

const triggerReminder = async (invoiceId, userId) => {
  const invoice = await Invoice.findOne({ _id: invoiceId, userId });
  
  if (!invoice) {
    throw new Error('Invoice not found');
  }

  // Send to Zapier webhook
  const response = await fetch(process.env.ZAPIER_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invoiceId: invoice._id,
      recipient: invoice.recipient,
      amount: invoice.amount,
      dueDate: invoice.dueDate
    })
  });

  if (!response.ok) {
    throw new Error('Failed to trigger automation');
  }

  // Update reminder count and last sent date
  invoice.reminderCount += 1;
  invoice.lastReminderSent = new Date();
  await invoice.save();

  return { message: 'Automation triggered successfully' };
};

const sendAutomatedReminder = async (invoice) => {
  await fetch(process.env.ZAPIER_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invoiceId: invoice._id,
      recipient: invoice.recipient,
      amount: invoice.amount,
      dueDate: invoice.dueDate,
      isAutomated: true
    })
  });

  invoice.reminderCount += 1;
  invoice.lastReminderSent = new Date();
  await invoice.save();
};

// Export the functions using CommonJS syntax
module.exports = {
  triggerReminder,
  sendAutomatedReminder
};
