const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Guard = require('../models/guardModel');
const Log = require('../models/logModel'); // Importar el modelo de logs

// Registrar Guardias
const registerGuard = async (req, res) => {
  const { document, name, shift, status, password } = req.body;

  try {
    const existingGuard = await Guard.findOne({ document });
    if (existingGuard) {
      return res.status(400).json({ message: 'El guardia ya está registrado' });
    }

    // Hashear la contraseña antes de guardar
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const guard = new Guard({ document, name, shift, status, password: hashedPassword });
    await guard.save();

    res.status(201).json(guard);
  } catch (err) {
    console.error('Error en registerGuard:', err); // <-- log explícito
    res.status(500).json({ message: 'Error al registrar guardia', error: err.message });
  }
};

// Actualizar Guardias
const updateGuard = async (req, res) => {
  const { id } = req.params;
  const { name, shift, status } = req.body;

  try {
    const guard = await Guard.findByIdAndUpdate(id, { name, shift, status }, { new: true });
    if (!guard) {
      return res.status(404).json({ message: 'Guardia no encontrado' });
    }

    // Registrar log
    await Log.create({
      action: 'update',
      performedBy: req.user.id,
      details: `Guardia actualizado: ${JSON.stringify({ name, shift, status })}`,
    });

    res.json(guard);
  } catch (err) {
    console.error('Error en updateGuard:', err); // <-- log explícito
    res.status(500).json({ message: 'Error al actualizar guardia', error: err.message });
  }
};

// Eliminar Guardias
const deleteGuard = async (req, res) => {
  const { id } = req.params;

  try {
    const guard = await Guard.findByIdAndDelete(id);
    if (!guard) {
      return res.status(404).json({ message: 'Guardia no encontrado' });
    }
    res.json({ message: 'Guardia eliminado exitosamente' });
  } catch (err) {
    console.error('Error en deleteGuard:', err); // <-- log explícito
    res.status(500).json({ message: 'Error al eliminar guardia', error: err.message });
  }
};

// Obtener todos los Guardias
const getAllGuards = async (req, res) => {
  try {
    const guards = await Guard.find({});
    res.json(guards);
  } catch (err) {
    console.error('Error en getAllGuards:', err); // <-- log explícito
    res.status(500).json({ message: 'Error al obtener guardias', error: err.message });
  }
};

// Obtener Guardia por ID
const getGuardById = async (req, res) => {
  const { id } = req.params;

  try {
    const guard = await Guard.findById(id);
    if (!guard) {
      return res.status(404).json({ message: 'Guardia no encontrado' });
    }
    res.json(guard);
  } catch (err) {
    console.error('Error en getGuardById:', err); // <-- log explícito
    res.status(500).json({ message: 'Error al obtener guardia', error: err.message });
  }
};

// Iniciar sesión Guardia
const loginGuard = async (req, res) => {
  const { document, password } = req.body;

  try {
    const guard = await Guard.findOne({ document });
    if (!guard) {
      return res.status(404).json({ message: 'Guardia no encontrado' });
    }

    const isMatch = await bcrypt.compare(password, guard.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: guard._id, role: 'guard' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Inicio de sesión exitoso', token, user: guard });
  } catch (err) {
    console.error('Error en loginGuard:', err); // <-- log explícito
    res.status(500).json({ message: 'Error al iniciar sesión', error: err.message });
  }
};

module.exports = {
  registerGuard,
  updateGuard,
  deleteGuard,
  getAllGuards,
  getGuardById,
  loginGuard
};
