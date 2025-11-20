// server/controllers/accountController.js
const Account = require("../models/Account");

// GET /api/accounts  -> get accounts for logged-in user
exports.getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(accounts);
  } catch (err) {
    console.error("getAccounts:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// POST /api/accounts  -> create account
exports.createAccount = async (req, res) => {
  try {
    const { name, type, balance, currency } = req.body;
    if (!name) return res.status(400).json({ message: "Account name required" });

    const acc = await Account.create({
      user: req.userId,
      name,
      type: type || "Bank",
      balance: Number(balance) || 0,
      currency: currency || "INR ₹",
    });

    res.status(201).json(acc);
  } catch (err) {
    console.error("createAccount:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/accounts/:id  -> update account
exports.updateAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, balance, currency } = req.body;

    const account = await Account.findOne({ _id: id, user: req.userId });
    if (!account) return res.status(404).json({ message: "Account not found" });

    account.name = name ?? account.name;
    account.type = type ?? account.type;
    account.balance = balance !== undefined ? Number(balance) : account.balance;
    account.currency = currency ?? account.currency;

    await account.save();
    res.json(account);
  } catch (err) {
    console.error("updateAccount:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE /api/accounts/:id  -> delete account
exports.deleteAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findOneAndDelete({ _id: id, user: req.userId });
    if (!account) return res.status(404).json({ message: "Account not found" });
    res.json({ message: "Account deleted", id: account._id });
  } catch (err) {
    console.error("deleteAccount:", err);
    res.status(500).json({ message: "Server error" });
  }
};
