const express = require('express');
const router = express.Router();
const mahasiswaController = require('../controllers/mahasiswaController');

// Route to get all mahasiswa
router.get('/allmahasiswa', mahasiswaController.getAllMahasiswa);

// Route to get mahasiswa by NIM
router.get('/bynim', mahasiswaController.getMahasiswaByNIM);

// Route to insert mahasiswa
router.post('/addmahasiswa', mahasiswaController.addMahasiswa);

// Route to update mahasiswa by NIM
router.post('/updatemahasiswabynim/:nim', mahasiswaController.updateMahasiswaByNIM);

module.exports = router;
