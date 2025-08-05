const Admin = require('../models/adminModel');
const bcrypt = require('bcryptjs');
const generateToken = require('../config/jwtConfig');
const crypto = require('crypto');
const { registerLog } = require('./logController');
const Log = require('../models/logModel'); // Importar el modelo de logs
// Obtener datos del admin autenticado
const getMe = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }
    res.json(admin);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener datos del admin', error: err.message });
  }
};

// Registrar Admin
const registerAdmin = async (req, res) => {
  console.log('Body recibido en registerAdmin:', req.body);
  const { username, password } = req.body;

  try {
    // Validar que no se intente registrar un admin con el nombre "testAdmin123"
    if (username === 'testAdmin123') {
      return res.status(403).json({ message: 'No se puede registrar un administrador con el nombre "testAdmin123"' });
    }

    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return res.status(400).json({ message: 'El administrador ya está registrado' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const admin = new Admin({ username, password: hashedPassword });
    await admin.save();

    res.status(201).json(admin);
  } catch (err) {
    console.error('Error en registerAdmin:', err);
    res.status(500).json({ message: 'Error al registrar administrador', error: err.message });
  }
};

// Iniciar Sesión Admin
const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    // Verificar si la cuenta está bloqueada
    if (admin.isLocked && admin.lockUntil > Date.now()) {
      return res.status(403).json({ message: 'La cuenta está bloqueada. Inténtelo más tarde.' });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      // Incrementar el contador de intentos fallidos
      admin.failedLoginAttempts += 1;

      // Bloquear la cuenta si supera el límite de intentos fallidos
      if (admin.failedLoginAttempts >= 5) {
        admin.isLocked = true;
        admin.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Bloquear por 15 minutos
      }

      await admin.save();
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Restablecer el contador de intentos fallidos después de un inicio de sesión exitoso
    admin.failedLoginAttempts = 0;
    admin.isLocked = false;
    admin.lockUntil = null;
    await admin.save();

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ id: admin._id, username: admin.username, token, role: 'admin' });
  } catch (err) {
    console.error('Error en loginAdmin:', err);
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
};

// Habilitar Verificación en Dos Pasos
const enableTwoFactor = async (req, res) => {
  const { username } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    const twoFactorCode = crypto.randomBytes(3).toString('hex');
    admin.twoFactorCode = twoFactorCode;
    admin.twoFactorExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutos
    admin.twoFactorEnabled = true;
    await admin.save();

    // Aquí deberías enviar el código de verificación al administrador (por ejemplo, por correo electrónico)

    res.json({ message: 'Verificación en dos pasos habilitada', twoFactorCode });
  } catch (err) {
    console.error('Error en enableTwoFactor:', err);
    res.status(500).json({ message: 'Error al habilitar la verificación en dos pasos', error: err.message });
  }
};

// Obtener Admin actual (según token)
const getCurrentAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id).select('-password');
    res.json(admin);
  } catch (err) {
    console.error('Error en getCurrentAdmin:', err);
    res.status(500).json({ message: 'Error al obtener administrador actual', error: err });
  }
};

// Obtener logs de Admin
const getAdminLogs = async (req, res) => {
  try {
    // Lógica para obtener los logs del administrador
    res.status(200).json({ message: 'Logs obtenidos exitosamente' });
  } catch (err) {
    console.error('Error en getAdminLogs:', err);
    res.status(500).json({ message: 'Error al obtener logs', error: err });
  }
};

// Eliminar Admin
const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    // Validar que no sea el admin de emergencia
    if (admin.username === 'testAdmin123') {
      return res.status(403).json({ message: 'El administrador de emergencia no puede ser eliminado' });
    }

    await Admin.findByIdAndDelete(id);
    res.json({ message: 'Administrador eliminado' });
  } catch (err) {
    console.error('Error en deleteAdmin:', err);
    res.status(500).json({ message: 'Error al eliminar administrador', error: err.message });
  }
};

// Actualizar Admin
const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  try {
    const admin = await Admin.findById(id);

    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    // Validar que no sea el admin de emergencia
    if (admin.username === 'testAdmin123') {
      return res.status(403).json({ message: 'El administrador de emergencia no puede ser modificado' });
    }

    const updatedData = {};
    if (username) updatedData.username = username;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(password, salt);
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(id, updatedData, { new: true });

    // Registrar log
    await Log.create({
      action: 'update',
      performedBy: req.user.id, // ID del usuario que realiza la acción
      details: `Administrador actualizado: ${JSON.stringify(updatedData)}`,
    });

    res.json(updatedAdmin);
  } catch (err) {
    console.error('Error en updateAdmin:', err);
    res.status(500).json({ message: 'Error al actualizar administrador', error: err.message });
  }
};

// Desbloquear cuenta de Admin
const unlockAdminAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await Admin.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Administrador no encontrado' });
    }

    admin.isLocked = false;
    admin.failedLoginAttempts = 0;
    admin.lockUntil = null;
    await admin.save();

    res.json({ message: 'Cuenta desbloqueada exitosamente' });
  } catch (err) {
    console.error('Error en unlockAdminAccount:', err);
    res.status(500).json({ message: 'Error al desbloquear la cuenta', error: err.message });
  }
};

module.exports = { registerAdmin, loginAdmin, enableTwoFactor, getCurrentAdmin, getAdminLogs, deleteAdmin, updateAdmin, unlockAdminAccount, getMe };
