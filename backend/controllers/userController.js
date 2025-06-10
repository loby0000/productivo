const User = require('../models/userModel');
const { setCache, getCache, deleteCache } = require('../utils/cache');
const Joi = require('joi');
const Log = require('../models/logModel'); // Importar el modelo de logs

// Esquema de validación para usuarios
const userSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  documentNumber: Joi.string().min(5).max(20).required(),
  documentType: Joi.string().required(),
  userType: Joi.string().valid('admin', 'guard', 'user').required(),
  password: Joi.string().min(6).required()
});

// Registrar Usuario
const registerUser = async (req, res) => {
  try {
    const { username, password, email, documentNumber, documentType, userType } = req.body;
    console.log('Received registration request:', { username, email, documentNumber, documentType, userType });

    if (!username || !password || !email || !documentNumber || !documentType || !userType) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const existingUser = await User.findOne({ $or: [{ username }, { email }, { documentNumber }] });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    const newUser = new User({
      username,
      password,
      email,
      documentNumber,
      documentType,
      userType
    });

    await newUser.save();
    
    // Invalidate cache
    await deleteCache('all_users');

    // Log the creation
    await new Log({
      action: 'CREATE_USER',
      description: `Usuario creado: ${username}`,
      userId: newUser._id
    }).save();

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        documentNumber: newUser.documentNumber,
        documentType: newUser.documentType,
        userType: newUser.userType
      }
    });
  } catch (err) {
    console.error('Error en registerUser:', err);
    res.status(500).json({ message: 'Error al registrar el usuario', error: err.message });
  }
};

// Obtener todos los usuarios (con cacheo)
const getAllUsers = async (req, res) => {
  try {
    // Verificar si los datos están en caché
    const cachedUsers = await getCache('all_users');
    if (cachedUsers) {
      console.log('Datos obtenidos del caché');
      return res.json(JSON.parse(cachedUsers));
    }

    // Si no están en caché, consultar la base de datos
    const users = await User.find().select('-password');
    console.log('Datos obtenidos de la base de datos');

    // Guardar los datos en caché
    await setCache('all_users', JSON.stringify(users));
    
    res.json(users);
  } catch (err) {
    console.error('Error en getAllUsers:', err);
    res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
  }
};

// Crear usuario con validación
const createUser = async (req, res) => {
  const { name, email, document } = req.body;

  // Validar los datos enviados
  const { error } = userSchema.validate({ name, email, document });
  if (error) {
    return res.status(400).json({ message: 'Datos inválidos', error: error.details[0].message });
  }

  try {
    const user = new User({ name, email, document });
    await user.save();

    // Invalidar el caché
    await deleteCache('all_users');

    res.status(201).json(user);
  } catch (err) {
    console.error('Error en createUser:', err);
    res.status(500).json({ message: 'Error al crear usuario', error: err.message });
  }
};

// Obtener usuarios con paginación
const getUsersWithPagination = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments();

    res.json({
      total: totalUsers,
      page: parseInt(page),
      limit: parseInt(limit),
      users,
    });
  } catch (err) {
    console.error('Error en getUsersWithPagination:', err);
    res.status(500).json({ message: 'Error al obtener usuarios con paginación', error: err.message });
  }
};

// Obtener usuario por ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error en getUserById:', err);
    res.status(500).json({ message: 'Error al obtener el usuario', error: err.message });
  }
};

// Actualizar Usuario
const updateUser = async (req, res) => {
  try {
    const { username, email, documentNumber, documentType, userType } = req.body;
    
    // Verificar si el usuario existe
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si el nuevo email o número de documento ya están en uso por otros usuarios
    const existingUser = await User.findOne({
      $and: [
        { _id: { $ne: req.params.id } },
        { $or: [{ email }, { documentNumber }] }
      ]
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email o número de documento ya está en uso' });
    }

    // Actualizar usuario
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { 
        username,
        email,
        documentNumber,
        documentType,
        userType,
        updatedAt: Date.now()
      },
      { new: true }
    );

    // Limpiar caché ya que los datos han cambiado
    await deleteCache('all_users');

    res.json({ message: 'Usuario actualizado exitosamente', user: updatedUser });
  } catch (err) {
    console.error('Error en updateUser:', err);
    res.status(500).json({ message: 'Error al actualizar el usuario', error: err.message });
  }
};

// Eliminar Usuario
const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Limpiar caché ya que los datos han cambiado
    await deleteCache('all_users');

    // Registrar la eliminación
    await new Log({
      action: 'DELETE_USER',
      description: `Usuario eliminado: ${user.username}`,
      userId: req.params.id
    }).save();

    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (err) {
    console.error('Error en deleteUser:', err);
    res.status(500).json({ message: 'Error al eliminar el usuario', error: err.message });
  }
};

// Filtrar usuarios
const filterUsers = async (req, res) => {
  const { document, name, userType } = req.query;

  try {
    const query = {};
    if (document) query.documentNumber = document;
    if (name) query.username = { $regex: name, $options: 'i' };
    if (userType) query.userType = userType;

    const users = await User.find(query);
    res.status(200).json({ message: 'Usuarios filtrados', users });
  } catch (err) {
    console.error('Error en filterUsers:', err);
    res.status(500).json({ message: 'Error al filtrar usuarios', error: err.message });
  }
};

// Exportar todas las funciones del controlador
module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  filterUsers
};
