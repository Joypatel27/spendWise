// server/models/Account.js
const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // owner
  name: { type: String, required: true },
  type: { type: String, enum: ["Bank", "Credit Card", "Cash", "Other"], default: "Bank" },
  balance: { type: Number, default: 0 }, // positive for asset, negative for credit card
  currency: { type: String, default: "INR ₹" },
}, { timestamps: true });

module.exports = mongoose.model("Account", accountSchema);
