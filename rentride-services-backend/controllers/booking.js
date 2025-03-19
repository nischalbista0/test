const Booking = require("../models/bookingModel");
const errorHandler = require("../middlewares/error-handler");
const multer = require("multer");
const Vehicle = require("../models/vehicleModel");

const sendBookingMail = require("../utlis/mail");

exports.createBooking = async (req, res, next) => {
  try {
    const booking = await Booking.create(req.body);
    await Vehicle.updateOne(
      {
        _id: req.body.vehicleId,
      },
      {
        $set: { availability: false },
      }
    );
    sendBookingMail(req.body);

    return res.status(201).json({ message: "Booking Created", booking });
  } catch (error) {
    next(error);
  }
};

exports.fetchBooking = async (req, res, next) => {
  try {
    //Fetch all products
    const Bookings = await Booking.find();

    if (!Bookings) {
      return errorHandler("No booking done yet.", 404);
    }
    // Send response
    res.status(200).json({
      message: "Booking fetched successfully.",
      Bookings: Bookings,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
