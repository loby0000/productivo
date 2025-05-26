const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0, // Contador de intentos fallidos
  },
  isLocked: {
    type: Boolean,
    default: false, // Estado de bloqueo de la cuenta
  },
  lockUntil: {
    type: Date, // Fecha y hora hasta la cual la cuenta estará bloqueada
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorCode: {
    type: String
  },
  twoFactorExpiry: {
    type: Date
  },
  createdAt: { type: Date, default: Date.now }
});

adminSchema.pre('findOneAndDelete', function (next) {
  if (this.getQuery().username === 'testAdmin123') {
    const err = new Error('El administrador de emergencia no puede ser eliminado');
    err.status = 403;
    return next(err);
  }
  next();
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
