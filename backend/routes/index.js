const express = require('express');
const userRoutes = require('./userRoutes');
const guardRoutes = require('./guardRoutes');
const adminRoutes = require('./adminRoutes');
const historyRoutes = require('./historyRoutes');
const logRoutes = require('./logRoutes');
const equipmentRoutes = require('./equipmentRoutes');
const barcodeRoutes = require('./barcodeRoutes'); // Importar las rutas de códigos de barras

const router = express.Router();

// Montar las rutas en el enrutador principal
router.use('/users', userRoutes);
router.use('/guards', guardRoutes);
router.use('/admins', adminRoutes);
router.use('/history', historyRoutes);
router.use('/logs', logRoutes);
router.use('/equipments', equipmentRoutes);
router.use('/barcode', barcodeRoutes); // Montar las rutas de códigos de barras

module.exports = router;
