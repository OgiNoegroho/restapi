const express = require('express');
const router = express.Router();
const pendaftaranController = require('../controllers/pendaftaranController');
const authMiddleware = require('../middlewares/authmiddleware');

router.get('/pendaftaran/:nim', authMiddleware, pendaftaranController.getMahasiswaP);
router.get('/pendaftaran', authMiddleware, pendaftaranController.getAllMahasiswaP);
router.post('/pendaftaran', authMiddleware, pendaftaranController.addPendaftaran);
router.put('/pendaftaran/:nim/status', authMiddleware, pendaftaranController.updateMahasiswaPStatus);
router.post('/pendaftaran/:nim', authMiddleware, pendaftaranController.updatePenguji);

module.exports = router;
