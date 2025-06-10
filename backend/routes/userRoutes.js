const express = require('express');
const { 
  filterUsers, 
  registerUser, 
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/userController');
const router = express.Router();

// Base user routes
router.get('/', getAllUsers);
router.post('/', registerUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

// Additional routes
router.get('/filter', filterUsers);
router.post('/register', registerUser); // Keep for backward compatibility

module.exports = router;
