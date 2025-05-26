const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true
  },
  performedBy: {
    type: String,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Log = mongoose.model('Log', logSchema);

module.exports = Log;

