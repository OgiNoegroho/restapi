const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authmiddleware = require('../middlewares/authmiddleware'); // Tambahkan middleware 


router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected route
router.get('/protected', authmiddleware, userController.protectedRoute); // Tambahkan rute terlindungi

module.exports = router;