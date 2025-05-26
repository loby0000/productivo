const History = require('../models/historyModel');
const XLSX = require('xlsx');
const fs = require('fs');
const PDFDocument = require('pdfkit');

// Registrar entrada de usuario y equipo
const registerEntry = async (req, res) => {
  const { userType, documentNumber, equipmentSerial, guardId } = req.body;

  try {
    const newEntry = new History({
      userType,
      documentNumber,
      equipmentSerial,
      entryTime: new Date(),
      registeredBy: guardId,
      status: 'entry',
    });

    await newEntry.save();
    res.status(201).json({ message: 'Entrada registrada exitosamente', entry: newEntry });
  } catch (err) {
    console.error('Error en registerEntry:', err);
    res.status(500).json({ message: 'Error al registrar entrada', error: err });
  }
};

// Registrar salida de usuario y equipo
const registerExit = async (req, res) => {
  const { documentNumber, guardId } = req.body;

  try {
    const latestEntry = await History.findOne({ documentNumber, status: 'entry' }).sort({ entryTime: -1 });

    if (!latestEntry) {
      return res.status(404).json({ message: 'No se encontró una entrada activa para este usuario' });
    }

    latestEntry.exitTime = new Date();
    latestEntry.status = 'exit';
    latestEntry.registeredBy = guardId;

    await latestEntry.save();
    res.status(200).json({ message: 'Salida registrada exitosamente', exit: latestEntry });
  } catch (err) {
    console.error('Error en registerExit:', err);
    res.status(500).json({ message: 'Error al registrar salida', error: err });
  }
};

// Obtener todo el historial
const getAllHistory = async (req, res) => {
  try {
    const historyRecords = await History.find({}).populate('registeredBy', 'name shift');
    res.status(200).json(historyRecords);
  } catch (err) {
    console.error('Error en getAllHistory:', err);
    res.status(500).json({ message: 'Error al obtener el historial', error: err });
  }
};

// Filtrar historial por fecha, usuario o equipo
const filterHistory = async (req, res) => {
  const { date, documentNumber, equipmentSerial } = req.query;

  try {
    const filters = {};
    if (date) filters.entryTime = { $gte: new Date(`${date}T00:00:00Z`), $lte: new Date(`${date}T23:59:59Z`) };
    if (documentNumber) filters.documentNumber = documentNumber;
    if (equipmentSerial) filters.equipmentSerial = equipmentSerial;

    const filteredHistory = await History.find(filters).populate('registeredBy', 'name shift');
    res.status(200).json(filteredHistory);
  } catch (err) {
    console.error('Error en filterHistory:', err);
    res.status(500).json({ message: 'Error al filtrar el historial', error: err });
  }
};

// Exportar historial (esto puede generar un archivo en el futuro)
const exportHistory = async (req, res) => {
  try {
    const historyRecords = await History.find({});
    // Aquí podrías implementar la lógica de exportación en PDF o Excel
    res.status(200).json({ message: 'Exportación simulada', records: historyRecords });
  } catch (err) {
    console.error('Error en exportHistory:', err);
    res.status(500).json({ message: 'Error al exportar historial', error: err });
  }
};

const exportHistoryToExcel = async (req, res) => {
  try {
    const history = await History.find();

    // Convertir los datos a un formato compatible con Excel
    const worksheet = XLSX.utils.json_to_sheet(history.map((entry) => entry.toObject()));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Historial');

    // Guardar el archivo temporalmente
    const filePath = './exports/historial.xlsx';
    XLSX.writeFile(workbook, filePath);

    // Enviar el archivo al cliente
    res.download(filePath, 'historial.xlsx', (err) => {
      if (err) {
        console.error('Error al enviar el archivo:', err);
      }

      // Eliminar el archivo temporal después de enviarlo
      fs.unlinkSync(filePath);
    });
  } catch (err) {
    console.error('Error en exportHistoryToExcel:', err);
    res.status(500).json({ message: 'Error al exportar historial a Excel', error: err.message });
  }
};

const exportHistoryToPDF = async (req, res) => {
  try {
    const history = await History.find();

    // Crear un nuevo documento PDF
    const doc = new PDFDocument();
    const filePath = './exports/historial.pdf';

    // Guardar el PDF en un archivo temporal
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Agregar contenido al PDF
    doc.fontSize(16).text('Historial de Entradas y Salidas', { align: 'center' });
    doc.moveDown();

    history.forEach((entry) => {
      doc.fontSize(12).text(`Usuario: ${entry.user}`);
      doc.text(`Fecha de Entrada: ${entry.entryDate}`);
      doc.text(`Fecha de Salida: ${entry.exitDate}`);
      doc.text(`Guardia: ${entry.guard}`);
      doc.moveDown();
    });

    doc.end();

    // Enviar el archivo al cliente después de que se haya generado
    writeStream.on('finish', () => {
      res.download(filePath, 'historial.pdf', (err) => {
        if (err) {
          console.error('Error al enviar el archivo:', err);
        }

        // Eliminar el archivo temporal después de enviarlo
        fs.unlinkSync(filePath);
      });
    });
  } catch (err) {
    console.error('Error en exportHistoryToPDF:', err);
    res.status(500).json({ message: 'Error al exportar historial a PDF', error: err.message });
  }
};

module.exports = {
  registerEntry,
  registerExit,
  getAllHistory,
  filterHistory,
  exportHistory,
  exportHistoryToExcel,
  exportHistoryToPDF,
};
