const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const upload = require('../utils/uploads');


router.get("/pelanggan", adminController.showAllPelanggan);
router.put("/pelanggan/update", adminController.updatePelanggan);
router.put("/pelanggan/del", adminController.deletePelanggan);

router.get('/karyawan', adminController.showAllKaryawan);
router.put('/karyawan/update', adminController.updateKaryawan);
router.put('/karyawan', adminController.deleteKaryawan);

router.get("/mobil", adminController.showAllCar);
router.post("/mobil/update", upload.single('image'), adminController.updateCar);
router.put("/mobil/del", adminController.deleteCar);

router.get('/pesanan', adminController.showAllPesanan);
router.post('/pesanan/update', adminController.updatePesanan);
router.put('/pesanan/del', adminController.deletePesanan);

router.get('/dashboard', adminController.dashboard);

module.exports = router;