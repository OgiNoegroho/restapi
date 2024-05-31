const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');


// Route to get all mahasiswa
router.get('/mahasiswa', mahasiswaController.getAllMahasiswa);

// Route to get mahasiswa by NIM
router.get('/mahasiswa/:nim', mahasiswaController.getMahasiswaByNIM);

// Route to insert mahasiswa
router.post('/mahasiswa', mahasiswaController.addMahasiswa);

// Route to update mahasiswa by NIM
router.post('/mahasiswa/:nim', mahasiswaController.updateMahasiswaByNIM);

module.exports = router;