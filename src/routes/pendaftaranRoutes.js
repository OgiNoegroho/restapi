const express = require('express');
const router = express.Router();
const pendaftaranController = require('../controllers/pendaftaranController');


router.get('/pendaftaran/:nim', pendaftaranController.getMahasiswaP);
router.get('/pendaftaran', pendaftaranController.getAllMahasiswaP);
router.post('/pendaftaran', pendaftaranController.addPendaftaran);
router.put('/pendaftaran/:nim/status', pendaftaranController.updateMahasiswaPStatus);

module.exports = router;