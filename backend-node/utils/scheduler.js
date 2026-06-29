const Customer = require('../models/Customer');
const EmailDraft = require('../models/EmailDraft');
const EmailTemplate = require('../models/EmailTemplate');

const generateDailyDrafts = async () => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');

  // Birthdays
  const birthdayCustomers = await Customer.find({ birthday: { $regex: `-${mm}-${dd}$` } });
  const birthdayTemplate = await EmailTemplate.findOne({ occasion: 'BIRTHDAY' });
  for (const c of birthdayCustomers) {
    const exists = await EmailDraft.findOne({ customer: c._id, occasion: 'BIRTHDAY', status: 'PENDING' });
    if (exists) continue;
    const subject = birthdayTemplate
      ? birthdayTemplate.subject.replace(/{CustomerName}/g, c.name)
      : `Happy Birthday, ${c.name}!`;
    const body = birthdayTemplate
      ? birthdayTemplate.body.replace(/{CustomerName}/g, c.name).replace(/{Offer}/g, '10% OFF')
      : `<p>Happy Birthday, ${c.name}! Wishing you a wonderful day.</p>`;
    await EmailDraft.create({ customer: c._id, occasion: 'BIRTHDAY', subject, body });
  }

  // Anniversaries
  const anniversaryCustomers = await Customer.find({ anniversary: { $regex: `-${mm}-${dd}$` } });
  const anniversaryTemplate = await EmailTemplate.findOne({ occasion: 'ANNIVERSARY' });
  for (const c of anniversaryCustomers) {
    const exists = await EmailDraft.findOne({ customer: c._id, occasion: 'ANNIVERSARY', status: 'PENDING' });
    if (exists) continue;
    const subject = anniversaryTemplate
      ? anniversaryTemplate.subject.replace(/{CustomerName}/g, c.name)
      : `Happy Anniversary, ${c.name}!`;
    const body = anniversaryTemplate
      ? anniversaryTemplate.body.replace(/{CustomerName}/g, c.name).replace(/{Offer}/g, '10% OFF')
      : `<p>Happy Anniversary, ${c.name}! Wishing you many more wonderful years.</p>`;
    await EmailDraft.create({ customer: c._id, occasion: 'ANNIVERSARY', subject, body });
  }

  console.log(`Daily drafts generated for ${birthdayCustomers.length} birthdays, ${anniversaryCustomers.length} anniversaries`);
};

module.exports = { generateDailyDrafts };
