const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  contactNumber: { type: String },

    // Password reset fields:
  resetOTP: { type: String, default: null }, // store OTP as string
  resetOTPExpires: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
