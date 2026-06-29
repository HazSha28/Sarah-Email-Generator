require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const cron = require('node-cron');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/emails', require('./routes/emails'));
app.use('/api/templates', require('./routes/templates'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check
app.get('/', (req, res) => res.json({ status: 'Sarah Jewellers API running' }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    // Seed default data
    require('./utils/seed')();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Daily scheduler — runs at midnight every day
cron.schedule('0 0 * * *', async () => {
  console.log('Running daily draft generation...');
  const { generateDailyDrafts } = require('./utils/scheduler');
  await generateDailyDrafts();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
