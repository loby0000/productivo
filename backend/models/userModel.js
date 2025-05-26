const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // Índice único
  documentNumber: { type: String, required: true, unique: true }, // Índice único
  userType: { type: String, enum: ['admin', 'guard', 'user'], required: true },
}, { timestamps: true });

// No definas índices manualmente aquí si ya están definidos en los campos

module.exports = mongoose.model('User', userSchema);
