const express = require('express');
const router = express.Router();
const dosenController = require('../controllers/dosenController');

router.get('/dosen', dosenController.getAllDosen);
router.get('/dosen', dosenController.getMahasiswaPDosen);
router.post('/dosen', dosenController.insertDosen);
router.put('/dosen/:nip', dosenController.updateDosenByNIP);
router.delete('/dosen/:nip', dosenController.deleteDosenByNIP);
router.get('/dosen/pembimbing/:nip_pembimbing', dosenController.getMahasiswaByDosen);
router.get('/dosen/pembimbing', dosenController.getAllDosenPembimbing);
router.get('/dosen/penguji/:nip_penguji', dosenController.getMahasiswaByPenguji);
router.get('/dosen/penguji', dosenController.getAllDosenPenguji);




module.exports = router;