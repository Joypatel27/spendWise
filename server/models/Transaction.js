
const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  account: { type: mongoose.Types.ObjectId, ref: "Account", required: false },
  category: { type: String, required: true },
  method: { type: String, enum: ["Cash", "Online"], required: true },
  amount: { type: Number, required: true }, // negative for spending, positive for income
  currency: { type: String, default: "₹" },
  date: { type: Date, required: true },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
