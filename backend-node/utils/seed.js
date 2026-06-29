const AdminUser = require('../models/AdminUser');
const EmailTemplate = require('../models/EmailTemplate');

module.exports = async function seed() {
  // Seed admin user
  const adminExists = await AdminUser.findOne({ username: 'admin' });
  if (!adminExists) {
    await AdminUser.create({ username: 'admin', password: 'admin123' });
    console.log('Admin user created: admin / admin123');
  }

  // Seed default templates
  const count = await EmailTemplate.countDocuments();
  if (count === 0) {
    await EmailTemplate.insertMany([
      {
        occasion: 'BIRTHDAY',
        subject: 'Happy Birthday, {CustomerName}! A Special Gift from Sarah Jewellers',
        body: `<div style="font-family:Georgia,serif;max-width:600px;margin:auto;padding:30px;border:1px solid #e8ddd0;border-radius:12px;background:#fffdf9;">
  <h2 style="color:#6b0f1a;text-align:center;font-family:Georgia,serif;">Happy Birthday, {CustomerName}!</h2>
  <p style="color:#555;line-height:1.8;">Wishing you a wonderful birthday filled with joy and sparkle!</p>
  <p style="color:#555;line-height:1.8;">As a special birthday gift, enjoy <strong style="color:#6b0f1a;">{Offer}</strong> on all our jewellery collections today.</p>
  <div style="text-align:center;margin:24px 0;">
    <a href="#" style="background:#6b0f1a;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Shop Now</a>
  </div>
  <p style="color:#888;font-size:13px;">With love,<br/>The Sarah Jewellers Team</p>
</div>`
      },
      {
        occasion: 'ANNIVERSARY',
        subject: 'Happy Anniversary, {CustomerName}! Celebrate with Sarah Jewellers',
        body: `<div style="font-family:Georgia,serif;max-width:600px;margin:auto;padding:30px;border:1px solid #e8ddd0;border-radius:12px;background:#fffdf9;">
  <h2 style="color:#6b0f1a;text-align:center;font-family:Georgia,serif;">Happy Anniversary, {CustomerName}!</h2>
  <p style="color:#555;line-height:1.8;">Congratulations on this beautiful milestone! May your love shine like our finest jewellery.</p>
  <p style="color:#555;line-height:1.8;">Celebrate this special day with <strong style="color:#6b0f1a;">{Offer}</strong> on our anniversary collection.</p>
  <div style="text-align:center;margin:24px 0;">
    <a href="#" style="background:#6b0f1a;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Explore Collection</a>
  </div>
  <p style="color:#888;font-size:13px;">With warm wishes,<br/>The Sarah Jewellers Team</p>
</div>`
      },
      {
        occasion: 'FESTIVAL',
        festivalName: 'Diwali',
        subject: 'Happy Diwali, {CustomerName}! Sparkle this Festive Season',
        body: `<div style="font-family:Georgia,serif;max-width:600px;margin:auto;padding:30px;border:1px solid #f0c040;border-radius:12px;background:#fffef0;">
  <h2 style="color:#c8a415;text-align:center;font-family:Georgia,serif;">Happy Diwali, {CustomerName}!</h2>
  <p style="color:#555;line-height:1.8;">May this festival of lights bring joy, prosperity and sparkle to your life!</p>
  <p style="color:#555;line-height:1.8;">Celebrate Diwali with our exclusive jewellery collection. Enjoy <strong style="color:#c8a415;">{Offer}</strong> this festive season.</p>
  <div style="text-align:center;margin:24px 0;">
    <a href="#" style="background:#c8a415;color:white;padding:12px 28px;border-radius:6px;text-decoration:none;font-weight:bold;">Shop Festive Collection</a>
  </div>
  <p style="color:#888;font-size:13px;">With warm Diwali wishes,<br/>The Sarah Jewellers Team</p>
</div>`
      }
    ]);
    console.log('Default templates seeded');
  }
};
