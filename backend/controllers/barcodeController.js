const bwipjs = require('bwip-js');
const Equipment = require('../models/equipmentModel'); // Asegúrate de que el modelo esté definido correctamente

const generateBarcode = (req, res) => {
  const { text } = req.query;

  bwipjs.toBuffer({
    bcid: 'code128',       // Barcode type
    text: text,            // Text to encode
    scale: 3,              // 3x scaling factor
    height: 10,            // Bar height, in millimeters
    includetext: true,     // Show human-readable text
    textxalign: 'center',  // Always good to set this
  }, (err, png) => {
    if (err) {
      console.error('Error en generateBarcode:', err);
      res.status(500).send('Error al generar el código de barras');
    } else {
      res.type('png');
      res.send(png);
    }
  });
};

// Controlador para manejar el escaneo de códigos de barras
const handleBarcodeScan = async (req, res) => {
    const { barcode } = req.body; // El código de barras se envía en el cuerpo de la solicitud

    try {
        // Buscar el equipo en la base de datos por el número de serie
        const equipment = await Equipment.findOne({ serialNumber: barcode });
        if (!equipment) {
            return res.status(404).json({ message: 'Equipo no encontrado' });
        }

        // Responder con los detalles del equipo encontrado
        res.status(200).json({ message: 'Equipo encontrado', equipment });
    } catch (err) {
        console.error('Error en handleBarcodeScan:', err);
        res.status(500).json({ message: 'Error al procesar el código de barras', error: err.message });
    }
};

module.exports = { handleBarcodeScan };