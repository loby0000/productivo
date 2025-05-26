const express = require('express');
const router = express.Router();
const logController = require('../controllers/logController');

router.post('/register', logController.registerLog);

module.exports = router;
