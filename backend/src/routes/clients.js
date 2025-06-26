const express = require("express");
const router = express.Router();

const clients = require("../controllers/clientControllers");
const booking = require("../controllers/bookingController");
const admin = require("../controllers/adminController");

router.get('/mostBook', clients.mostBooking);
router.get('/review', clients.review)
router.post('/booking', booking.booking);
router.post('/selectedCar', admin.selectedCar);

module.exports = router;