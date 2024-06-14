const express = require('express');
const router = express.Router();
const dosenController = require('../controllers/dosenController');
const authMiddleware = require('../middlewares/authmiddleware');

router.get('/dosen', authMiddleware, dosenController.getAllDosen);
router.get('/dosen/without/:nip', authMiddleware, dosenController.getDosenWithoutNIP);
router.post('/dosen', authMiddleware, dosenController.insertDosen);
router.put('/dosen/:nip', authMiddleware, dosenController.updateDosenByNIP);
router.delete('/dosen/:nip', authMiddleware, dosenController.deleteDosenByNIP);
router.get('/dosen/pembimbing/:nip_pembimbing', authMiddleware, dosenController.getMahasiswaByDosen);
router.get('/dosen/pembimbing', authMiddleware, dosenController.getAllDosenPembimbing);
router.get('/dosen/penguji/:nip_penguji', authMiddleware, dosenController.getMahasiswaByPenguji);
router.get('/dosen/penguji', authMiddleware, dosenController.getAllDosenPenguji);

module.exports = router;
