const router = require('express').Router();
const Customer = require('../models/Customer');
const EmailDraft = require('../models/EmailDraft');
const auth = require('../middleware/auth');

// Get all MM-DD combos for the next 7 days
const getNext7DaysCombos = () => {
  const combos = [];
  for (let i = 0; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    combos.push(`-${mm}-${dd}`);
  }
  return combos;
};

const getStats = async (req, res) => {
  try {
    const combos = getNext7DaysCombos();
    const regexList = combos.map(c => new RegExp(c.replace('-', '\\-') + '$'));

    const [totalCustomers, pendingDrafts, sentEmails] = await Promise.all([
      Customer.countDocuments(),
      EmailDraft.countDocuments({ status: 'PENDING' }),
      EmailDraft.countDocuments({ status: 'SENT' })
    ]);

    const allCustomers = await Customer.find();

    const upcomingBirthdayList = allCustomers.filter(c =>
      c.birthday && combos.some(combo => c.birthday.endsWith(combo))
    );
    const upcomingAnniversaryList = allCustomers.filter(c =>
      c.anniversary && combos.some(combo => c.anniversary.endsWith(combo))
    );

    const recentSent = await EmailDraft.find({ status: 'SENT' })
      .populate('customer').sort({ sentAt: -1 }).limit(5);

    res.json({
      totalCustomers,
      pendingEmails: pendingDrafts,
      pendingDrafts,
      sentEmails,
      upcomingBirthdays: upcomingBirthdayList.length,
      upcomingAnniversaries: upcomingAnniversaryList.length,
      recentSent,
      birthdayCustomers: upcomingBirthdayList
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

router.get('/', auth, getStats);
router.get('/stats', auth, getStats);

module.exports = router;
