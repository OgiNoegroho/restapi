const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');

router.get('/mahasiswa', mahasiswaController.getAllMahasiswa);
router.get('/mahasiswa/:nim', mahasiswaController.getMahasiswaByNIM);
router.post('/mahasiswa', mahasiswaController.addMahasiswa);
router.post('/mahasiswa/:nim', mahasiswaController.updateMahasiswaByNIM);

module.exports = router;