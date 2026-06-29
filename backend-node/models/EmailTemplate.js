const mongoose = require('mongoose');

const emailTemplateSchema = new mongoose.Schema({
  occasion:     { type: String, required: true, enum: ['BIRTHDAY', 'ANNIVERSARY', 'FESTIVAL'] },
  festivalName: { type: String },
  subject:      { type: String, required: true },
  body:         { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('EmailTemplate', emailTemplateSchema);
