const express = require('express');
const { handleBarcodeScan } = require('../controllers/barcodeController'); // Importar el controlador
const router = express.Router();

// Ruta para manejar el escaneo de códigos de barras
router.post('/scan', handleBarcodeScan);

module.exports = router;