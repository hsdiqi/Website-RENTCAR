const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const upload = require('../utils/uploads');


router.get("/pelanggan", adminController.showAllPelanggan);
router.put("/pelanggan/update/:id", adminController.updatePelanggan);
router.put("/pelanggan/del/:id", adminController.deletePelanggan);

router.get('/karyawan', adminController.showAllKaryawan);
router.put('/karyawan/update/:id', adminController.updateKaryawan);
router.put('/karyawan/:id', adminController.deleteKaryawan);

router.get("/mobil", adminController.showAllCar);
router.put("/mobil/update/:id", upload.single('image'), adminController.updateCar);
router.put("/mobil/del/:id", adminController.deleteCar);

router.get('/pesanan', adminController.showAllPesanan);
router.put('/pesanan/update/:id', adminController.updatePesanan);
router.put('/pesanan/del/:id', adminController.deletePesanan);

router.get('/dashboard', adminController.dashboard);

module.exports = router;