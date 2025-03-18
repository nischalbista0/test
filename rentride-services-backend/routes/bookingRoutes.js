const express = require("express");
const router = express.Router();
const Booking = require("../controllers/booking"); // Import the booking controller
const validateToken = require("../middlewares/validateToken");

// Example route definition
router.post("/createBooking", Booking.createBooking);
router.get("/fetchBooking", Booking.fetchBooking);
router.get("/fetchBookingadmin", Booking.fetchBooking);

module.exports = router;
