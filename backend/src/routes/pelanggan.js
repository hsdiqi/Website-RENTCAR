const express = require('express');
const router = express.Router();

const pelanggan = require('../controllers/pelangganController');
const upload = require('../utils/uploads');

router.get("/show", pelanggan.showAllPelanggan);
router.put("/admin/update", upload.single('image'),pelanggan.updatePelanggan);
router.put("/admin/del", pelanggan.deletePelanggan);

module.exports = router;