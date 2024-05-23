const express = require('express');
const router = express.Router();
const dosenController = require('../controllers/dosenController');

// New routes for additional functionalities
router.get('/alldosen', dosenController.getAllDosen);
router.post('/insertdosen', dosenController.insertDosen);
router.put('/updatedosen/:nip', dosenController.updateDosenByNIP);
router.delete('/deletedosen/:nip', dosenController.deleteDosenByNIP);
// Existing routes
router.get('/pembimbing/:nip_pembimbing', dosenController.getMahasiswaByDosen);
router.get('/pembimbing', dosenController.getAllDosenPembimbing);
router.get('/penguji/:nip_penguji', dosenController.getMahasiswaByPenguji);
router.get('/penguji', dosenController.getAllDosenPenguji);

module.exports = router;