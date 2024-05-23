const express = require('express');
const router = express.Router();
const pendaftaranController = require('../controllers/pendaftaranController');

router.get('/dosen', pendaftaranController.getMahasiswaPDosen);
router.get('/:nim', pendaftaranController.getMahasiswaP);
router.get('/', pendaftaranController.getAllMahasiswaP);
router.post('/addpendaftaran', pendaftaranController.addPendaftaran);
router.put('/updatemahasiswa/:nim/status', pendaftaranController.updateMahasiswaPStatus);

module.exports = router;