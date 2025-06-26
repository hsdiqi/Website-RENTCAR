const express = require('express');
const router = express.Router();
const carController = require('../controllers/tambahController');
const admin = require('../controllers/adminController')
const mobil = require('../controllers/mobilController')

// const tambahMobil = createUploader(() => 'public/uploads/images/cars');
const upload = require('../utils/uploads');

router.get("/show", mobil.showAllCar);
router.post('/admin/addCar', upload.single('image'), carController.addCar);
router.post('/selectedCar', admin.selectedCar)
router.post("/admin/update", upload.single('image'), mobil.updateCar);
router.put("/admin/del", mobil.deleteCar);


module.exports = router;