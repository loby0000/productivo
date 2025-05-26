const express = require('express');
const router = express.Router();
const guardController = require('../controllers/guardController');
const { loginGuard } = require('../controllers/guardController');

router.post('/register', guardController.registerGuard);
router.post('/login', loginGuard);
router.put('/update/:id', guardController.updateGuard);
router.delete('/delete/:id', guardController.deleteGuard);
router.get('/all', guardController.getAllGuards);
router.get('/:id', guardController.getGuardById);

module.exports = router;
