// const mongoose = require("mongoose");

// const transactionSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   category: { type: String, required: true },
//   method: { type: String, enum: ["Cash", "Online"], required: true },
//   amount: { type: Number, required: true },
//   currency: { type: String, default: "₹" },
//   date: { type: String, required: true },
//    notes: { type: String },
// },
// { timestamps: true });

// module.exports = mongoose.model("Transaction", transactionSchema);
// // 
// server/models/Transaction.js
// const mongoose = require("mongoose");

// const transactionSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // owner
//   account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" }, // optional
//   category: { type: String, required: true },
//   method: { type: String, enum: ["Cash", "Online"], required: true },
//   amount: { type: Number, required: true }, // negative = expense, positive = income
//   currency: { type: String, default: "₹" },
//   date: { type: String, required: true },
// }, { timestamps: true });

// module.exports = mongoose.model("Transaction", transactionSchema);
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
