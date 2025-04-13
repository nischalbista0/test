const Vehicle = require("../models/vehicleModel");
const errorHandler = require("../middlewares/error-handler");
const jwt = require("jsonwebtoken");

let uploadedFilename;

exports.uploadVehicleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a file" });
    }

    const filename = req.file.filename;

    uploadedFilename = filename;

    res.status(200).json({ success: true, data: filename });
  } catch (error) {
    next(error);
  }
};

exports.createVehicle = async (req, res, next) => {
  const { brand, model, power, Fuel, price, type, description } = req.body;

  const image = uploadedFilename || "";

  const accessTokenCookie = req.cookies["access_Token"];

  let decodedToken;

  try {
    if (accessTokenCookie) {
      decodedToken = jwt.verify(accessTokenCookie, process.env.JWT_SECRET);
    } else {
      return res.status(401).json({ message: "Authentication required." });
    }

    if (
      !brand ||
      !model ||
      !power ||
      !Fuel ||
      !price ||
      !type ||
      !description
    ) {
      return res.status(400).json({ error: "Please fill in all fields" });
    }

    const userId = decodedToken.id;

    // Parse latitude and longitude from request
    const latitude = parseFloat(req.body.latitude);
    const longitude = parseFloat(req.body.longitude);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: "Invalid location coordinates." });
    }

    const vehicleData = {
      brand,
      model,
      power,
      Fuel,
      price,
      type,
      description,
      image,
      userId,
      geoLocation: {
        ll: [latitude, longitude], // Store parsed latitude and longitude
      },
    };

    const vechicle = await Vehicle.create(vehicleData);
    res.status(201).json(vechicle);
  } catch (error) {
    next(error);
  } finally {
    uploadedFilename = undefined;
  }
};

exports.getVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.find();

    if (!vehicle) {
      return errorHandler("No Vehicle added yet.", 404);
    }
    // Send response
    res.status(200).json({
      message: "Vehicle fetched successfully.",
      vehicle: vehicle,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteVehicle = async (req, res, next) => {
  try {
    // Fetch the vehicle
    const vehicleId = req.params.vehicleId;
    const vehicle = await Vehicle.findById(vehicleId);

    if (!vehicle) {
      // If vehicle not found, send a 404 response
      return res.status(404).json({ message: "Could not find vehicle." });
    }

    // Remove the vehicle
    await Vehicle.findOneAndDelete({ _id: vehicleId });

    // Send response
    res.status(200).json({ message: "Vehicle deleted." });
  } catch (err) {
    // Handle other errors
    console.error("Error deleting vehicle:", err);
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Update a Vehicle
exports.updateVehicle = async (req, res, next) => {
  try {
    const vehicleIdToUpdate = req.params.vehicleId;
    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { _id: vehicleIdToUpdate },
      req.body,
      { new: true }
    );

    if (!updatedVehicle)
      return res.status(404).json({ error: "Vehicle not found" });

    return res.status(201).json(updatedVehicle);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

//Review
exports.addReview = async (req, res, next) => {
  try {
    const vehicleExists = await Vehicle.findById(req.body.vehicleId);
    if (!vehicleExists) {
      const error = new Error("Vehicle not found");
      error.statusCode = 404;
      throw error;
    }

    await Vehicle.updateOne(
      { _id: req.body.vehicleId },
      { $push: { review: req.body.review } }
    );
    res.status(200).json({
      message: "Review has been set.",
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

// Add Rating to Vehicle
exports.addRating = async (req, res, next) => {
  try {
    const { vehicleId, rating, userId } = req.body;

    // Validate the rating (it must be a number between 1 and 5)
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    // Find the vehicle by its ID
    const vehicle = await Vehicle.findById(vehicleId);
    console.log(vehicle);
    if (!vehicle) {
      const error = new Error("Vehicle not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if the user has already rated this vehicle
    const existingRating = vehicle.ratings.find(
      (r) => r._id.toString() === userId
    );
    if (existingRating) {
      // If user already rated, update their rating
      existingRating.rating = rating;
    } else {
      // If user hasn't rated, add new rating
      vehicle.ratings.push({ userId, rating });
    }

    // Recalculate the average rating
    const totalRatings = vehicle.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRatings / vehicle.ratings.length;

    // Save the updated vehicle
    vehicle.rating = averageRating; // Store the average rating
    await vehicle.save();

    // Send response
    res.status(200).json({
      message: "Vehicle rating has been updated.",
      averageRating: vehicle.rating,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
