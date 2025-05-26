const mongoose = require('mongoose');

const guardSchema = new mongoose.Schema({
  document: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  shift: {
    type: String,
    enum: ['mañana', 'tarde', 'noche'],
    required: true
  },
  status: {
    type: String,
    enum: ['activo', 'inactivo'],
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const Guard = mongoose.model('Guard', guardSchema);

module.exports = Guard;
