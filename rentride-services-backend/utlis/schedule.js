//scheduledTasks.js - Scheduled task to update room availability

const schedule = require("node-schedule");
const Booking = require("../models/bookingModel");
const Vehicle = require("../models/vehicleModel");

const availabilityUpdate = schedule.scheduleJob("06 23 * * *", async () => {
  try {
    const date = new Date();
    const currentDate = date.toISOString().split("T")[0];

    // Find reservations where checkoutDate is in the past
    const pastReservations = await Booking.find({
      checkOutDate: { $lt: currentDate },
    });

    console.log(pastReservations, "resr");
    // Update vehicle availability to true for each reservation
    for (const Booking of pastReservations) {
      await Vehicle.updateOne(
        { _id: Booking.vehicleId },
        { $set: { availability: true } }
      );
    }
  } catch (error) {
    console.error("Error updating availability:", error);
  }
});

module.exports = availabilityUpdate;
