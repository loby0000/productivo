const express = require('express');
const router = express.Router();
const historyController = require('../controllers/historyController');

router.post('/entry', historyController.registerEntry);
router.post('/exit', historyController.registerExit);
router.get('/', historyController.getAllHistory);
router.get('/filter', historyController.filterHistory);
router.get('/export', historyController.exportHistory);
router.get('/export/excel', historyController.exportHistoryToExcel);
router.get('/export/pdf', historyController.exportHistoryToPDF);

module.exports = router;
