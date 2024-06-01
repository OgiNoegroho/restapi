const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authmiddleware = require('../middlewares/authmiddleware'); // Tambahkan middleware 


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/protected', authmiddleware, userController.protectedRoute);

module.exports = router;