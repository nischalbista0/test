const { Schema, model, default: mongoose } = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    model: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    power: {
      type: String,
      required: true,
    },
    Fuel: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    review: {
      type: [String],
    },
    price: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      required: true,
    },
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, min: 1, max: 5 },
      },
    ],
    geoLocation: {
      ll: {
        type: [Number], // [latitude, longitude]
      },
    },
  },
  { timestamps: true }
);

// Enable geospatial indexing on the location field
vehicleSchema.index({ location: "2dsphere" });

module.exports = model("Vehicle", vehicleSchema);
