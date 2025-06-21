const express = require("express");
const router = express.Router();

const clients = require("../controllers/clientControllers");
const booking = require("../controllers/bookingController");

router.get('/mostBook', clients.mostBooking);
router.get('/review', clients.review)
router.post('/booking', booking.booking);

module.exports = router;