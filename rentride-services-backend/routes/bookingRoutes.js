const express = require("express");
const router = express.Router();
const Booking = require("../controllers/booking");

router.post("/createBooking", Booking.createBooking);
router.get("/fetchBooking", Booking.fetchBooking);
router.get("/fetchBookingadmin", Booking.fetchBooking);
router.patch("/cancel/:id", Booking.cancelBooking);

module.exports = router;
