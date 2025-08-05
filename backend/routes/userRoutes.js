const express = require('express');
const router = express.Router();
const { registerUser, getAllUsers, updateUser, deleteUser } = require('../controllers/userController');

// Obtener todos los usuarios
router.get('/', getAllUsers);

// Registrar usuario con equipo
router.post('/register', registerUser);

// Eliminar usuario por ID (usa el controlador)
router.delete('/:id', deleteUser);

// Actualizar usuario por ID (usa el controlador)
router.put('/:id', updateUser);

module.exports = router;
