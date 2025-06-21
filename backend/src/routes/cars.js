const express = require('express');
const router = express.Router();
const carController = require('../controllers/tambahController');

// const tambahMobil = createUploader(() => 'public/uploads/images/cars');
const upload = require('../utils/uploads');

router.post('/admin/addCar', upload.single('image'), carController.addCar);

module.exports = router;