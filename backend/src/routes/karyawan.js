const express = require('express');
const router = express.Router();

const karyawan = require('../controllers/karyawanController');


router.get('/show', karyawan.showAllKaryawan);
router.put('/hrd/update', karyawan.updateKaryawan);
router.put('/hrd/del', karyawan.deleteKaryawan);

module.exports = router