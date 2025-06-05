const Equipment = require('../models/equipmentModel');
const { setCache, getCache } = require('../utils/cache');

// Registrar Equipo
const registerEquipment = async (req, res) => {
  const { serialNumber, brand, description, accessories } = req.body;

  try {
    const existingEquipment = await Equipment.findOne({ serialNumber });
    if (existingEquipment) {
      return res.status(400).json({ message: 'El equipo ya está registrado' });
    }

    const equipment = new Equipment({ serialNumber, brand, description, accessories });
    await equipment.save();

    // Invalidar caché cuando se crea un nuevo equipo
    await setCache('allEquipments', null);

    res.status(201).json(equipment);
  } catch (err) {
    console.error('Error en registerEquipment:', err);
    res.status(500).json({ message: 'Error al registrar equipo', error: err.message });
  }
};

// Actualizar Equipo
const updateEquipment = async (req, res) => {
  const { id } = req.params;
  const { brand, description, accessories } = req.body;

  try {
    const equipment = await Equipment.findByIdAndUpdate(id, { brand, description, accessories }, { new: true });
    if (!equipment) {
      return res.status(404).json({ message: 'Equipo no encontrado' });
    }
    res.json(equipment);
  } catch (err) {
    console.error('Error en updateEquipment:', err);
    res.status(500).json({ message: 'Error al actualizar equipo', error: err.message });
  }
};

// Eliminar Equipo
const deleteEquipment = async (req, res) => {
  const { id } = req.params;

  try {
    const equipment = await Equipment.findByIdAndDelete(id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipo no encontrado' });
    }
    res.json({ message: 'Equipo eliminado exitosamente' });
  } catch (err) {
    console.error('Error en deleteEquipment:', err);
    res.status(500).json({ message: 'Error al eliminar equipo', error: err.message });
  }
};

// Obtener todos los Equipos
const getAllEquipments = async (req, res) => {
  try {
    // Intentar obtener del caché primero
    const cachedEquipments = await getCache('allEquipments');
    if (cachedEquipments) {
      return res.json(JSON.parse(cachedEquipments));
    }

    // Si no está en caché, obtener de la base de datos
    const equipments = await Equipment.find();
    
    // Guardar en caché por 1 hora
    await setCache('allEquipments', equipments);

    res.json(equipments);
  } catch (err) {
    console.error('Error en getAllEquipments:', err);
    res.status(500).json({ message: 'Error al obtener equipos', error: err.message });
  }
};

// Obtener Equipo por ID
const getEquipmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const equipment = await Equipment.findById(id);
    if (!equipment) {
      return res.status(404).json({ message: 'Equipo no encontrado' });
    }
    res.json(equipment);
  } catch (err) {
    console.error('Error en getEquipmentById:', err);
    res.status(500).json({ message: 'Error al obtener equipo', error: err.message });
  }
};

module.exports = {
  registerEquipment,
  updateEquipment,
  deleteEquipment,
  getAllEquipments,
  getEquipmentById
};