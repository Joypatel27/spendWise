
const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  category: { type: String, default: "" },
  amount: { type: Number, required: true },
  startDay: { type: Number, default: 1 },
  type: { type: String, enum: ["spending","income","saving"], default: "spending" },
  oneMonth: { type: Boolean, default: false },
  expiresAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Budget", budgetSchema);
