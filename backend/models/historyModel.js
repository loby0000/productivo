const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userType: { type: String, required: true },
  documentNumber: { type: String, required: true },
  entryTime: { type: Date, default: Date.now },
  exitTime: { type: Date },
  equipmentSerial: { type: String },
  guardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Guard' },
  recordType: { type: String, enum: ['entrada', 'salida', 'actualización'] },
});

module.exports = mongoose.model('History', historySchema);
