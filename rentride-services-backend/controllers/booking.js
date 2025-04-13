const Booking = require("../models/bookingModel");
const errorHandler = require("../middlewares/error-handler");
const Vehicle = require("../models/vehicleModel");
const jwt = require("jsonwebtoken");

const sendBookingMail = require("../utlis/mail");

exports.createBooking = async (req, res, next) => {
  const accessTokenCookie = req.cookies["access_Token"];

  let decodedToken;
  try {
    if (accessTokenCookie) {
      decodedToken = jwt.verify(accessTokenCookie, process.env.JWT_SECRET);
    } else {
      return res.status(401).json({ message: "Authentication required." });
    }

    const userEmail = decodedToken.email;
    const userId = decodedToken.id;

    const bookingData = {
      ...req.body,
      email: userEmail,
      userId,
    };

    const booking = await Booking.create(bookingData);

    await Vehicle.updateOne(
      { _id: req.body.vehicleId },
      { $set: { availability: false } }
    );

    sendBookingMail(userEmail, req.body);

    return res.status(201).json({ message: "Booking Created", booking });
  } catch (error) {
    next(error);
  }
};

exports.fetchBooking = async (req, res, next) => {
  try {
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

exports.cancelBooking = async (req, res, next) => {
  const { id } = req.params;

  console.log(id);

  try {
    const booking = await Booking.findById(id);

    console.log(booking);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    // Mark booking as canceled
    booking.status = "cancelled"; // Update status to 'Canceled'
    await booking.save();

    // Update vehicle availability back to true
    await Vehicle.updateOne(
      { _id: booking.vehicleId },
      { $set: { availability: true } }
    );

    res.status(200).json({ message: "Booking canceled successfully." });
  } catch (error) {
    next(error);
  }
};
