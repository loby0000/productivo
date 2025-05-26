const Log = require('../models/logModel');

// Registrar Log
const registerLog = async (req, res) => {
  const { action, performedBy, details } = req.body;

  try {
    const log = new Log({ action, performedBy, details });
    await log.save();

    res.status(201).json(log);
  } catch (err) {
    console.error('Error en registerLog:', err);
    res.status(500).json({ message: 'Error al registrar log', error: err });
  }
};

// Obtener Logs
const getLogs = async (req, res) => {
  try {
    const logs = await Log.find({});
    res.json(logs);
  } catch (err) {
    console.error('Error en getLogs:', err);
    res.status(500).json({ message: 'Error al obtener logs', error: err });
  }
};

// Obtener todos los logs
const getAllLogs = async (req, res) => {
  try {
    const logs = await Log.find({});
    res.json(logs);
  } catch (err) {
    console.error('Error en getAllLogs:', err);
    res.status(500).json({ message: 'Error al obtener logs', error: err });
  }
};

// Filtrar logs
const filterLogs = async (req, res) => {
  const { action, performedBy } = req.query;

  try {
    const filters = {};
    if (action) filters.action = action;
    if (performedBy) filters.performedBy = performedBy;

    const filteredLogs = await Log.find(filters);
    res.status(200).json(filteredLogs);
  } catch (err) {
    console.error('Error en filterLogs:', err);
    res.status(500).json({ message: 'Error al filtrar logs', error: err });
  }
};

module.exports = { registerLog, getLogs, getAllLogs, filterLogs };
