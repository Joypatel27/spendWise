



// // server/controllers/budgetController.js
// const Budget = require("../models/Budget");
// const Transaction = require("../models/Transaction");
// const mongoose = require("mongoose");

// /** compute month window (same logic client/server) */
// function computeMonthWindowForNow(startDay = 1, refDate = new Date()) {
//   const d = new Date(refDate);
//   const day = d.getDate();

//   let start, end;

//   if (!startDay || startDay <= 1) {
//     start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
//     end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
//   } else {
//     if (day >= startDay) {
//       start = new Date(d.getFullYear(), d.getMonth(), startDay, 0, 0, 0, 0);
//       end = new Date(d.getFullYear(), d.getMonth() + 1, startDay - 1, 23, 59, 59, 999);
//     } else {
//       start = new Date(d.getFullYear(), d.getMonth() - 1, startDay, 0, 0, 0, 0);
//       end = new Date(d.getFullYear(), d.getMonth(), startDay - 1, 23, 59, 59, 999);
//     }
//   }

//   return { start, end };
// }

// exports.getBudgets = async (req, res) => {
//   try {
//     const userId = req.userId;
//     if (!userId) return res.status(401).json({ message: "Not authenticated (no userId)" });

//     const budgets = await Budget.find({ user: userId }).sort({ createdAt: -1 }).lean();

//     // If no budgets, return empty
//     if (!budgets || budgets.length === 0) return res.json([]);

//     // Convert userId to ObjectId once
//     const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;

//     const results = await Promise.all(
//       budgets.map(async (b) => {
//         const { start, end } = computeMonthWindowForNow(b.startDay || 1);

//         // Match transactions for this budget & window
//         const match = {
//           user: userObjectId,
//           date: { $gte: start, $lte: end }
//         };
//         if (b.category && b.category.trim() !== "") match.category = b.category;
//         // spending budgets count negative amounts; income count positive
//         match.amount = b.type === "income" ? { $gt: 0 } : { $lt: 0 };

//         const agg = await Transaction.aggregate([
//           { $match: match },
//           {
//             $group: {
//               _id: null,
//               total: { $sum: "$amount" },
//               items: { $push: { _id: "$_id", category: "$category", amount: "$amount", method: "$method", date: "$date", createdAt: "$createdAt" } }
//             }
//           },
//           { $project: { _id: 0, total: 1, items: { $slice: ["$items", 10] } } }
//         ]);

//         let spent = 0;
//         let matchedTxns = [];
//         if (agg.length) {
//           const total = Number(agg[0].total) || 0;
//           spent = b.type === "income" ? total : Math.abs(total);
//           matchedTxns = (agg[0].items || []).map(i => ({
//             _id: i._id,
//             category: i.category,
//             amount: i.amount,
//             method: i.method,
//             date: i.date || i.createdAt,
//           }));
//         }

//         // Return budget plus computed spent / matchedTxns
//         return {
//           ...b,
//           spent,
//           matchedTxns
//         };
//       })
//     );

//     return res.json(results);
//   } catch (err) {
//     console.error("getBudgets error:", err);
//     return res.status(500).json({ message: "Server error in getBudgets" });
//   }
// };

// exports.createBudget = async (req, res) => {
//   try {
//     const userId = req.userId;
//     if (!userId) return res.status(401).json({ message: "Not authenticated" });

//     const { name, category = "", amount, startDay = 1, oneMonth = false, type = "spending" } = req.body;

//     if (!name || typeof amount === "undefined" || Number.isNaN(Number(amount))) {
//       return res.status(400).json({ message: "Missing or invalid name/amount" });
//     }

//     const newBudget = new Budget({
//       user: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId,
//       name: String(name),
//       category: String(category || ""),
//       amount: Number(amount),
//       startDay: Number(startDay || 1),
//       type: ["spending", "income", "saving"].includes(type) ? type : "spending",
//       oneMonth: !!oneMonth,
//       expiresAt: oneMonth ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null
//     });

//     const saved = await newBudget.save();
//     return res.status(201).json(saved);
//   } catch (err) {
//     console.error("createBudget error:", err);
//     return res.status(500).json({ message: "Server error in createBudget" });
//   }
// };

// exports.deleteBudget = async (req, res) => {
//   try {
//     const userId = req.userId;
//     const id = req.params.id;
//     if (!userId) return res.status(401).json({ message: "Not authenticated" });

//     if (!id) return res.status(400).json({ message: "Missing id" });

//     const deleted = await Budget.findOneAndDelete({ _id: id, user: userId });
//     if (!deleted) return res.status(404).json({ message: "Budget not found or not authorized" });

//     return res.json({ message: "Budget deleted", id });
//   } catch (err) {
//     console.error("deleteBudget error:", err);
//     return res.status(500).json({ message: "Server error in deleteBudget" });
//   }
// };




// server/controllers/budgetController.js
const Budget = require("../models/Budget");
const Transaction = require("../models/Transaction");
const mongoose = require("mongoose");

/** escape user-provided string for use inside RegExp */
function escapeRegex(str = "") {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** compute month window (same logic client/server) */
function computeMonthWindowForNow(startDay = 1, refDate = new Date()) {
  const d = new Date(refDate);
  const day = d.getDate();

  let start, end;

  if (!startDay || startDay <= 1) {
    start = new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
    end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
  } else {
    if (day >= startDay) {
      start = new Date(d.getFullYear(), d.getMonth(), startDay, 0, 0, 0, 0);
      end = new Date(d.getFullYear(), d.getMonth() + 1, startDay - 1, 23, 59, 59, 999);
    } else {
      start = new Date(d.getFullYear(), d.getMonth() - 1, startDay, 0, 0, 0, 0);
      end = new Date(d.getFullYear(), d.getMonth(), startDay - 1, 23, 59, 59, 999);
    }
  }

  return { start, end };
}

exports.getBudgets = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated (no userId)" });

    const budgets = await Budget.find({ user: userId }).sort({ createdAt: -1 }).lean();
    if (!budgets || budgets.length === 0) return res.json([]);

    // Ensure we pass an ObjectId into aggregation match
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;

    const results = await Promise.all(
      budgets.map(async (b) => {
        const { start, end } = computeMonthWindowForNow(b.startDay || 1);

        // Build match
        const match = {
          user: userObjectId,
          date: { $gte: start, $lte: end },
        };

        // If budget has category -> match case-insensitive substring
        if (b.category && String(b.category).trim() !== "") {
          // substring, case-insensitive (so "Food" will match "Restaurant, Fast Food")
          const patt = new RegExp(escapeRegex(String(b.category).trim()), "i");
          match.category = { $regex: patt };
        }

        // income budgets count positive amounts, spending count negative
        match.amount = b.type === "income" ? { $gt: 0 } : { $lt: 0 };

        const agg = await Transaction.aggregate([
          { $match: match },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
              items: {
                $push: {
                  _id: "$_id",
                  category: "$category",
                  amount: "$amount",
                  method: "$method",
                  date: "$date",
                  createdAt: "$createdAt",
                },
              },
            },
          },
          { $project: { _id: 0, total: 1, items: { $slice: ["$items", 10] } } },
        ]);

        let spent = 0;
        let matchedTxns = [];
        if (agg.length) {
          const total = Number(agg[0].total) || 0;
          spent = b.type === "income" ? total : Math.abs(total);
          matchedTxns = (agg[0].items || []).map((i) => ({
            _id: i._id,
            category: i.category,
            amount: i.amount,
            method: i.method,
            date: i.date || i.createdAt,
          }));
        }

        return {
          ...b,
          spent,
          matchedTxns,
        };
      })
    );

    return res.json(results);
  } catch (err) {
    console.error("getBudgets error:", err);
    return res.status(500).json({ message: "Server error in getBudgets" });
  }
};

exports.createBudget = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    const { name, category = "", amount, startDay = 1, oneMonth = false, type = "spending" } = req.body;

    if (!name || typeof amount === "undefined" || Number.isNaN(Number(amount))) {
      return res.status(400).json({ message: "Missing or invalid name/amount" });
    }

    const newBudget = new Budget({
      user: mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId,
      name: String(name),
      category: String(category || "").trim(),
      amount: Number(amount),
      startDay: Number(startDay || 1),
      type: ["spending", "income", "saving"].includes(type) ? type : "spending",
      oneMonth: !!oneMonth,
      expiresAt: oneMonth ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : null,
    });

    const saved = await newBudget.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error("createBudget error:", err);
    return res.status(500).json({ message: "Server error in createBudget" });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const userId = req.userId;
    const id = req.params.id;
    if (!userId) return res.status(401).json({ message: "Not authenticated" });

    if (!id) return res.status(400).json({ message: "Missing id" });

    const deleted = await Budget.findOneAndDelete({ _id: id, user: userId });
    if (!deleted) return res.status(404).json({ message: "Budget not found or not authorized" });

    return res.json({ message: "Budget deleted", id });
  } catch (err) {
    console.error("deleteBudget error:", err);
    return res.status(500).json({ message: "Server error in deleteBudget" });
  }
};
