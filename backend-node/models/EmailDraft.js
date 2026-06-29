const mongoose = require('mongoose');

const emailDraftSchema = new mongoose.Schema({
  customer:  { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  occasion:  { type: String, required: true },
  subject:   { type: String, required: true },
  body:      { type: String, required: true },
  status:    { type: String, enum: ['PENDING', 'SENT'], default: 'PENDING' },
  type:      { type: String, enum: ['DRAFT', 'BROADCAST'], default: 'DRAFT' },
  sentAt:    { type: Date },
  imagePath: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('EmailDraft', emailDraftSchema);
