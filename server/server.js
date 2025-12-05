
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db"); // ✅ make sure db.js uses module.exports
const authRoutes = require("./routes/authRoutes");
// import dashboardRoutes from "./routes/dashboard.js";
const budgetRoutes = require('./routes/budgetRoutes');


const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));

// Connect DB
connectDB();

// Routes
// app.use("/api/authRoutes", authRoutes);
app.use("/api/auth", require("./routes/authRoutes"));    
app.use("/api/transactions", require("./routes/transactionRoutes"));
// app.use("/api/dashboard", dashboardRoutes);
app.use("/api/budgets", require("./routes/budgetRoutes"));
// after existing imports and before app.listen()
app.use("/api/accounts", require("./routes/accountRoutes"));


app.get("/", (req, res) => res.send("API running..."));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
