

// tuesday
const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");
const Account = require("../models/Account");
const auth = require("../middleware/authmiddleware");

// Helper to safely parse amount
const toNumber = (v) => {
  const n = Number(v);
  return Number.isNaN(n) ? 0 : n;
};

/**
 * GET /api/transactions
 * Get all transactions for logged-in user (populated with account name)
 */
router.get("/", auth, async (req, res) => {
  try {
    const txns = await Transaction.find({ user: req.userId })
      .populate("account", "name")
      .sort({ date: -1, createdAt: -1 });
    res.json(txns);
  } catch (err) {
    console.error("getTransactions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /api/transactions
 * Create a transaction for logged-in user and update linked account balance
 * Body: { category, method, amount, currency, date, notes, account }
 */
router.post("/", auth, async (req, res) => {
  try {
    const { category, method, amount, currency, date, notes, account } = req.body;

    if (!category || !method || typeof amount === "undefined") {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const amtNum = toNumber(amount);

    const txn = new Transaction({
      user: req.userId,
      account: account || null,
      category,
      method,
      amount: amtNum,
      currency: currency || "₹",
      date: date ? new Date(date) : new Date(),
      notes,
    });

    const saved = await txn.save();

    // If an account was provided - ensure it belongs to the user and update balance
    if (account) {
      const acc = await Account.findOne({ _id: account, user: req.userId });
      if (acc) {
        acc.balance = toNumber(acc.balance) + amtNum;
        await acc.save();
      } else {
        // If account doesn't exist / not owned, optionally ignore or return warning.
        // We'll ignore silently to avoid breaking but log it.
        console.warn(`Account ${account} not found or not owned by user ${req.userId}`);
      }
    }

    const populated = await Transaction.findById(saved._id).populate("account", "name");
    res.status(201).json(populated);
  } catch (err) {
    console.error("createTransaction:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * PUT /api/transactions/:id
 * Update transaction: revert old amount from old account, apply new amount to new account
 * Body: { category, method, amount, currency, date, notes, account }
 */
router.put("/:id", auth, async (req, res) => {
  try {
    const txnId = req.params.id;
    const { category, method, amount, currency, date, notes, account } = req.body;

    // Find existing transaction owned by user
    const oldTxn = await Transaction.findOne({ _id: txnId, user: req.userId });
    if (!oldTxn) return res.status(404).json({ message: "Transaction not found" });

    const oldAmount = toNumber(oldTxn.amount);
    const newAmount = typeof amount !== "undefined" ? toNumber(amount) : oldAmount;
    const oldAccountId = oldTxn.account ? String(oldTxn.account) : null;
    const newAccountId = account ? String(account) : null;

    // If old transaction had an account -> revert its effect
    if (oldAccountId) {
      const accOld = await Account.findOne({ _id: oldAccountId, user: req.userId });
      if (accOld) {
        accOld.balance = toNumber(accOld.balance) - oldAmount; // remove old txn effect
        await accOld.save();
      } else {
        console.warn(`Old account ${oldAccountId} not found or not owned by user ${req.userId}`);
      }
    }

    // Update transaction fields
    oldTxn.category = category ?? oldTxn.category;
    oldTxn.method = method ?? oldTxn.method;
    oldTxn.amount = newAmount;
    oldTxn.currency = currency ?? oldTxn.currency;
    oldTxn.date = date ? new Date(date) : oldTxn.date;
    oldTxn.notes = notes ?? oldTxn.notes;
    oldTxn.account = newAccountId || null;

    await oldTxn.save();

    // Apply new transaction amount to new account (if provided)
    if (newAccountId) {
      const accNew = await Account.findOne({ _id: newAccountId, user: req.userId });
      if (accNew) {
        accNew.balance = toNumber(accNew.balance) + newAmount;
        await accNew.save();
      } else {
        console.warn(`New account ${newAccountId} not found or not owned by user ${req.userId}`);
      }
    }

    const populated = await Transaction.findById(oldTxn._id).populate("account", "name");
    res.json(populated);
  } catch (err) {
    console.error("updateTransaction:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * DELETE /api/transactions/:id
 * Delete transaction (only if owned by user). Revert its effect on linked account balance.
 */
router.delete("/:id", auth, async (req, res) => {
  try {
    const txnId = req.params.id;

    // Find the transaction that belongs to the user
    const txn = await Transaction.findOne({ _id: txnId, user: req.userId });
    if (!txn) {
      return res.status(404).json({ message: "Transaction not found or not authorized" });
    }

    const amt = toNumber(txn.amount);
    const accountId = txn.account ? String(txn.account) : null;

    // Revert effect on account if present
    if (accountId) {
      const acc = await Account.findOne({ _id: accountId, user: req.userId });
      if (acc) {
        acc.balance = toNumber(acc.balance) - amt;
        await acc.save();
      } else {
        console.warn(`Account ${accountId} not found or not owned by user ${req.userId}`);
      }
    }

    // delete the transaction
    await Transaction.deleteOne({ _id: txnId, user: req.userId });

    res.json({ message: "Transaction deleted", id: txnId });
  } catch (err) {
    console.error("deleteTransaction:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
