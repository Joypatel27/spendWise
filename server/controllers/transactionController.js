// server/controllers/transactionController.js
const Transaction = require("../models/Transaction");
const Account = require("../models/Account");

// Get all transactions for logged-in user (populates account name)
exports.getTransactions = async (req, res) => {
  try {
    const txns = await Transaction.find({ user: req.userId })
      .populate("account", "name")
      .sort({ date: -1, createdAt: -1 });
    res.json(txns);
  } catch (err) {
    console.error("getTransactions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create a transaction and update linked account balance
exports.createTransaction = async (req, res) => {
  try {
    const { category, method, amount, currency, date, account } = req.body;

    if (typeof amount !== "number") {
      return res.status(400).json({ message: "Amount must be a number" });
    }

    const txn = await Transaction.create({
      user: req.userId,
      category,
      method,
      amount,
      currency,
      date,
      account: account || null,
    });

    // Update account balance if account provided and belongs to user
    if (account) {
      const acc = await Account.findOne({ _id: account, user: req.userId });
      if (acc) {
        acc.balance = Number(acc.balance || 0) + Number(amount || 0);
        await acc.save();
      }
    }

    const populated = await Transaction.findById(txn._id).populate("account", "name");
    res.status(201).json(populated);
  } catch (err) {
    console.error("createTransaction:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update transaction: revert old amount from old account, apply new to new account
exports.updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { category, method, amount, currency, date, account } = req.body;

    const old = await Transaction.findOne({ _id: id, user: req.userId });
    if (!old) return res.status(404).json({ message: "Transaction not found" });

    // Revert old amount from its account (if any)
    if (old.account) {
      const accOld = await Account.findOne({ _id: old.account, user: req.userId });
      if (accOld) {
        accOld.balance = Number(accOld.balance || 0) - Number(old.amount || 0); // revert
        await accOld.save();
      }
    }

    // Apply new values
    old.category = category ?? old.category;
    old.method = method ?? old.method;
    old.amount = typeof amount === "number" ? amount : old.amount;
    old.currency = currency ?? old.currency;
    old.date = date ?? old.date;
    old.account = account || null;

    await old.save();

    // Apply new amount to the new account (if provided)
    if (old.account) {
      const accNew = await Account.findOne({ _id: old.account, user: req.userId });
      if (accNew) {
        accNew.balance = Number(accNew.balance || 0) + Number(old.amount || 0);
        await accNew.save();
      }
    }

    const populated = await Transaction.findById(old._id).populate("account", "name");
    res.json(populated);
  } catch (err) {
    console.error("updateTransaction:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete transaction: revert its effect on account
exports.deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const txn = await Transaction.findOne({ _id: id, user: req.userId });
    if (!txn) return res.status(404).json({ message: "Transaction not found" });

    if (txn.account) {
      const acc = await Account.findOne({ _id: txn.account, user: req.userId });
      if (acc) {
        acc.balance = Number(acc.balance || 0) - Number(txn.amount || 0); // revert
        await acc.save();
      }
    }

    await txn.remove();
    res.json({ message: "Transaction deleted", id: txn._id });
  } catch (err) {
    console.error("deleteTransaction:", err);
    res.status(500).json({ message: "Server error" });
  }
};
