// import express from "express";
// import Transaction from "../models/Transaction.js"; // Mongoose model

// const router = express.Router();

// // Dashboard Summary
// router.get("/summary", async (req, res) => {
//   try {
//     const today = new Date();
//     const startOfDay = new Date(today.setHours(0, 0, 0, 0));
//     const endOfDay = new Date(today.setHours(23, 59, 59, 999));

//     // Today
//     const todaySpend = await Transaction.aggregate([
//       { $match: { date: { $gte: startOfDay, $lte: endOfDay } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     // This Week
//     const startOfWeek = new Date();
//     startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday
//     startOfWeek.setHours(0, 0, 0, 0);

//     const endOfWeek = new Date();
//     endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
//     endOfWeek.setHours(23, 59, 59, 999);

//     const weekSpend = await Transaction.aggregate([
//       { $match: { date: { $gte: startOfWeek, $lte: endOfWeek } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     // This Month
//     const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
//     const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

//     const monthSpend = await Transaction.aggregate([
//       { $match: { date: { $gte: startOfMonth, $lte: endOfMonth } } },
//       { $group: { _id: null, total: { $sum: "$amount" } } },
//     ]);

//     // Recent 5 Transactions
//     const recentTransactions = await Transaction.find()
//       .sort({ date: -1 })
//       .limit(5);

//     res.json({
//       today: todaySpend[0]?.total || 0,
//       week: weekSpend[0]?.total || 0,
//       month: monthSpend[0]?.total || 0,
//       recent: recentTransactions,
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;
import React from "react"; import { Card, Row, Col } from "react-bootstrap"; 
const Dashboard = () => { return ( <div style={{ padding: "20px" }}> <h2>Dashboard</h2>
 {/* Top Summary Cards */} <Row className="mb-4"> <Col> <Card className="p-3 text-center shadow-sm">
   <h6>Today's Spend</h6> <h4>₹500</h4> </Card> </Col> <Col> <Card className="p-3 text-center shadow-sm"> <h6>This Week</h6>
    <h4>₹2,300</h4> </Card> </Col> <Col> <Card className="p-3 text-center shadow-sm"> <h6>This Month</h6> 
    <h4>₹12,500</h4> </Card> </Col> </Row> {/* Recent Transactions */} 
    <Card className="p-3 shadow-sm"> <h6>Recent Transactions</h6> <ul> <li>🛒 Groceries - ₹250 (Cash)</li> <li>🍔 Restaurant - ₹500 (Online)</li> <li>🚗 Transport - ₹200 (Cash)</li> </ul> <a href="/spendwise/transactions">View All</a> </Card> </div> ); }; export default Dashboard;