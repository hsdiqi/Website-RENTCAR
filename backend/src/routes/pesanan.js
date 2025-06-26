const express = require('express');
const router = express.Router();

const pesanan = require('../controllers/pesananController')

router.get('/show', pesanan.showAllPesanan);
router.post('/admin/update', pesanan.updatePesanan);
router.put('/admin/del', pesanan.deletePesanan);

module.exports = router;