const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  serialNumber: {
    type: String,
    required: true,
    unique: true
  },
  brand: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  accessories: {
    mouse: {
      type: Boolean,
      required: true
    },
    charger: {
      type: Boolean,
      required: true
    }
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

const Equipment = mongoose.model('Equipment', equipmentSchema);

module.exports = Equipment;