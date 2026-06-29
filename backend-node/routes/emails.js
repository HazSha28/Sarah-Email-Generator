const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const EmailDraft = require('../models/EmailDraft');
const Customer = require('../models/Customer');
const EmailTemplate = require('../models/EmailTemplate');
const auth = require('../middleware/auth');
const { sendEmail } = require('../utils/mailer');

// Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

// GET all pending drafts
router.get('/drafts', auth, async (req, res) => {
  try {
    const drafts = await EmailDraft.find({ status: 'PENDING' })
      .populate('customer')
      .sort({ createdAt: -1 });
    res.json(drafts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET sent emails
router.get('/sent', auth, async (req, res) => {
  try {
    const sent = await EmailDraft.find({ status: 'SENT' })
      .populate('customer')
      .sort({ sentAt: -1 });
    res.json(sent);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST generate birthday drafts
router.post('/generate/birthdays', auth, async (req, res) => {
  try {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const customers = await Customer.find({ birthday: { $regex: `-${mm}-${dd}$` } });
    const template = await EmailTemplate.findOne({ occasion: 'BIRTHDAY' });

    let count = 0;
    for (const c of customers) {
      const existing = await EmailDraft.findOne({ customer: c._id, occasion: 'BIRTHDAY', status: 'PENDING' });
      if (existing) continue;
      const subject = template ? template.subject.replace('{CustomerName}', c.name) : `Happy Birthday, ${c.name}!`;
      const body = template ? template.body.replace(/{CustomerName}/g, c.name).replace(/{Offer}/g, '10% OFF') : `<p>Happy Birthday, ${c.name}!</p>`;
      await EmailDraft.create({ customer: c._id, occasion: 'BIRTHDAY', subject, body });
      count++;
    }
    res.json({ message: `Generated ${count} birthday drafts` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST generate anniversary drafts
router.post('/generate/anniversaries', auth, async (req, res) => {
  try {
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const customers = await Customer.find({ anniversary: { $regex: `-${mm}-${dd}$` } });
    const template = await EmailTemplate.findOne({ occasion: 'ANNIVERSARY' });

    let count = 0;
    for (const c of customers) {
      const existing = await EmailDraft.findOne({ customer: c._id, occasion: 'ANNIVERSARY', status: 'PENDING' });
      if (existing) continue;
      const subject = template ? template.subject.replace('{CustomerName}', c.name) : `Happy Anniversary, ${c.name}!`;
      const body = template ? template.body.replace(/{CustomerName}/g, c.name).replace(/{Offer}/g, '10% OFF') : `<p>Happy Anniversary, ${c.name}!</p>`;
      await EmailDraft.create({ customer: c._id, occasion: 'ANNIVERSARY', subject, body });
      count++;
    }
    res.json({ message: `Generated ${count} anniversary drafts` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update draft
router.put('/drafts/:id', auth, async (req, res) => {
  try {
    const draft = await EmailDraft.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('customer');
    res.json(draft);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// POST send draft
router.post('/drafts/:id/send', auth, async (req, res) => {
  try {
    const draft = await EmailDraft.findById(req.params.id).populate('customer');
    if (!draft) return res.status(404).json({ error: 'Draft not found' });

    await sendEmail({ to: draft.customer.email, subject: draft.subject, html: draft.body });
    draft.status = 'SENT';
    draft.sentAt = new Date();
    await draft.save();
    res.json({ message: 'Email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE draft
router.delete('/drafts/:id', auth, async (req, res) => {
  try {
    await EmailDraft.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST broadcast to all customers
router.post('/broadcast', auth, async (req, res) => {
  try {
    const { subject, body } = req.body;
    const customers = await Customer.find({ email: { $exists: true, $ne: '' } });

    // Send in parallel batches of 5
    let sent = 0;
    const batchSize = 5;
    for (let i = 0; i < customers.length; i += batchSize) {
      const batch = customers.slice(i, i + batchSize);
      await Promise.all(batch.map(async (c) => {
        try {
          const personalizedBody = body.replace(/{CustomerName}/g, c.name).replace(/{Offer}/g, '15% OFF');
          const personalizedSubject = subject.replace(/{CustomerName}/g, c.name);
          await sendEmail({ to: c.email, subject: personalizedSubject, html: personalizedBody });
          sent++;
        } catch { /* skip failed */ }
      }));
    }
    res.json({ message: `Broadcast sent to ${sent} customers` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST upload image
router.post('/upload-image', auth, upload.single('file'), async (req, res) => {
  try {
    res.json({ url: `/uploads/${req.file.filename}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
