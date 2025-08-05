const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userType: { type: String, required: true },
  documentType: { type: String, required: true },
  documentNumber: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  deviceBrand: { type: String },
  deviceSerial: { type: String },
  deviceFeatures: { type: String },
  registerDate: { type: Date },
  hasMouse: { type: Boolean, default: false },
  hasCharger: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
