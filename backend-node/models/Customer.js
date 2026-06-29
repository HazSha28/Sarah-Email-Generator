const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  email:       { type: String, required: true, unique: true },
  phone:       { type: String },
  birthday:    { type: String }, // format: YYYY-MM-DD
  anniversary: { type: String }  // format: YYYY-MM-DD
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
