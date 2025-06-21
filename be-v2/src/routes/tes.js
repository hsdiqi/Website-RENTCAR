const express = require('express');
const router = express.Router();
// const tesController = require('../controllers/tesController');
// const auth = require('./auth.js');

const tesCarController = require('../controllers/adminController')

router.get('/getCar', tesCarController.showAllCar)
router.get('/getPelanggan', tesCarController.showAllPelanggan)
router.get('/getKaryawan', tesCarController.showAllKaryawan)
router.get('/getPesanan', tesCarController.showAllPesanan)
// router.use('/', tesController.tes);


module.exports = router;