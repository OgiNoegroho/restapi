const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');
const authMiddleware = require('../middlewares/authmiddleware');

router.get('/mahasiswa', authMiddleware, mahasiswaController.getAllMahasiswa);
router.get('/mahasiswa/:nim', authMiddleware, mahasiswaController.getMahasiswaByNIM);
router.post('/mahasiswa', authMiddleware, mahasiswaController.addMahasiswa);
router.put('/mahasiswa/:nim', authMiddleware, mahasiswaController.updateMahasiswaByNIM);

module.exports = router;
