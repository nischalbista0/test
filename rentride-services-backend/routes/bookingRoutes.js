const express = require("express");
const router = express.Router();
const Booking = require("../controllers/booking"); // Import the booking controller
const validateToken = require("../middlewares/validateToken");

// Example route definition
router.post("/createBooking", validateToken("user"), Booking.createBooking);
router.get("/fetchBooking", Booking.fetchBooking);
router.get("/fetchBookingadmin", validateToken("admin"), Booking.fetchBooking);

module.exports = router;
