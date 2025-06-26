const express = require('express');
const router = express.Router();

const tes = require('./tes.js');
const auth = require('./auth.js');
const cars = require('./cars.js');
const imagesRoute = require('./images.js');

router.use('/tes', tes);
router.use('/auth', auth);
router.use('/cars', cars);
router.use('/images', imagesRoute);
router.use('/clients', require('./clients.js'));
router.use('/admin', require('./admin.js'));
router.use('/karyawan', require('./karyawan.js'))
router.use('/pesanan', require('./pesanan.js'));
router.use('/pelanggan', require('./pelanggan.js'))

module.exports = router;