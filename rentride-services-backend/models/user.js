const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the Session schema
const Session = new Schema({
  refreshToken: {
    type: String,
    default: "",
  },
});

// Define the User schema
const User = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    },
    userName: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: [Session],
    },
    // 👉 GeoIP-based location fields
    geoLocation: {
      ll: {
        type: [Number], // [latitude, longitude]
      },
    },
    approved: {
      type: String,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the User model
const UserModel = model("User", User);

// Function to create an initial admin user
const createAdminUser = async () => {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin";
  const adminUserName = process.env.ADMIN_USER_NAME || "Admin";

  const adminExists = await UserModel.findOne({ email: adminEmail });

  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync(adminPassword, 10);

    const newAdmin = new UserModel({
      email: adminEmail,
      userName: adminUserName,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    console.log("Admin user created!");
  } else {
    console.log("Admin user already exists.");
  }
};

createAdminUser();

module.exports = UserModel;
