const express = require('express');
const router = express.Router();
const equipmentController = require('../controllers/equipmentController');

router.post('/register', equipmentController.registerEquipment);
router.put('/update/:id', equipmentController.updateEquipment);
router.delete('/delete/:id', equipmentController.deleteEquipment);
router.get('/all', equipmentController.getAllEquipments);
router.get('/:id', equipmentController.getEquipmentById);

module.exports = router;