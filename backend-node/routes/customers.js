const router = require('express').Router();
const multer = require('multer');
const xlsx = require('xlsx');
const Customer = require('../models/Customer');
const auth = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// Helper — get MM-DD combos for next 7 days
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

// GET upcoming birthdays next 7 days
router.get('/upcoming/birthdays', auth, async (req, res) => {
  try {
    const combos = getNext7DaysCombos();
    const customers = await Customer.find();
    const upcoming = customers.filter(c => c.birthday && combos.some(combo => c.birthday.endsWith(combo)));
    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET upcoming anniversaries next 7 days
router.get('/upcoming/anniversaries', auth, async (req, res) => {
  try {
    const combos = getNext7DaysCombos();
    const customers = await Customer.find();
    const upcoming = customers.filter(c => c.anniversary && combos.some(combo => c.anniversary.endsWith(combo)));
    res.json(upcoming);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all customers
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create customer
router.post('/', auth, async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update customer
router.put('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: false }
    );
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE customer
router.delete('/:id', auth, async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST import Excel
router.post('/import', auth, upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = xlsx.utils.sheet_to_json(sheet);

    let imported = 0, skipped = 0;
    for (const row of rows) {
      try {
        const customer = {
          name:        row['Name'] || row['name'] || '',
          email:       row['Email'] || row['email'] || '',
          phone:       String(row['Phone'] || row['phone'] || ''),
          birthday:    row['Birthday'] || row['birthday'] || '',
          anniversary: row['Anniversary'] || row['anniversary'] || ''
        };
        if (!customer.name || !customer.email) { skipped++; continue; }
        await Customer.findOneAndUpdate(
          { email: customer.email },
          customer,
          { upsert: true, new: true }
        );
        imported++;
      } catch { skipped++; }
    }
    res.json({ imported, skipped });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
