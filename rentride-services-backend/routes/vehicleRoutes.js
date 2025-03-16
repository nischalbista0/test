const Vehicle = require("../controllers/vehicle");
const upload = require("../middlewares/multer");
const uploads = require("../middlewares/uploads");
const express = require("express");
const validateToken = require("../middlewares/validateToken");
const router = express.Router();

// ADD
router.post("/createVehicle", validateToken("admin"), Vehicle.createVehicle);
router.post("/uploadVehicleImage", uploads, Vehicle.uploadVehicleImage);
router.post("/addReviewV", Vehicle.addReview);

// Fetch all Vehicle
router.get("/admin/getVehicle", validateToken("admin"), Vehicle.getVehicle);
router.get("/getVehicle", Vehicle.getVehicle);

// Update a product
router.put(
  "/admin/vehicle/:vehicleId",
  validateToken("admin"),

  upload.single("vehicleImage"),
  Vehicle.updateVehicle
);

// Remove a product
router.delete(
  "/Vehicle/:vehicleId",
  validateToken("admin"),

  //isAuth(["admin"]), // Ensure this middleware is properly implemented and imported
  Vehicle.deleteVehicle
);

module.exports = router;
