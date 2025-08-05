
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.post('/enable-two-factor', adminController.enableTwoFactor);
router.post('/login', adminController.loginAdmin);
// Endpoint para registrar un nuevo admin
router.post('/register', adminController.registerAdmin);
// Nuevo endpoint para obtener datos del admin autenticado
router.get('/me', protect, adminController.getMe);

module.exports = router;

