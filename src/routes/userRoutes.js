const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ensure correct casing
const authmiddleware = require('../middlewares/authmiddleware'); // Ensure correct casing

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/protected', authmiddleware, userController.protectedRoute);

module.exports = router;
