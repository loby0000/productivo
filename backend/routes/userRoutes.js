const express = require('express');
const { filterUsers, registerUser } = require('../controllers/userController');
const router = express.Router();

router.post('/register', registerUser);
router.get('/filter', filterUsers);

module.exports = router;
