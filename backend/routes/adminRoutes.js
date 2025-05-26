const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.post('/enable-two-factor', adminController.enableTwoFactor);
router.post('/login', adminController.loginAdmin);

module.exports = router;

