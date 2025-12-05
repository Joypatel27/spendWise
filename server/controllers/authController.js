
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");


// // Updated register function with username
// exports.register = async (req, res) => {
//   try {
//     const { name, username, email, password, contactNumber } = req.body;
//     if (!name || !username || !email || !password) {
//       return res.status(400).json({ message: "Please fill all required fields" });
//     }

//     const usernameExists = await User.findOne({ username });
//     if (usernameExists) {
//       return res.status(400).json({ message: "Username is already taken" });
//     }
//     const emailExists = await User.findOne({ email });
//     if (emailExists) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashed = await bcrypt.hash(password, salt);

//     const user = await User.create({ name, username, email, password: hashed, contactNumber });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     res.status(201).json({
//       user: { id: user._id, name: user.name, username: user.username, email: user.email, contactNumber: user.contactNumber },
//       token,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // Updated login function to return username
// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     if (!email || !password) return res.status(400).json({ message: "Please fill all fields" });

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

//     res.json({
//       user: { id: user._id, name: user.name, username: user.username, email: user.email },
//       token,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // New function to get the logged-in user's data
// exports.getLoggedInUser = async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select("-password");
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.json(user);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// server/controllers/authController.js
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/**
 * Register
 */
exports.register = async (req, res) => {
  try {
    const { name, username, email, password, contactNumber } = req.body;
    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ name, username, email, password: hashed, contactNumber });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      user: { id: user._id, name: user.name, username: user.username, email: user.email, contactNumber: user.contactNumber },
      token,
    });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Please fill all fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      user: { id: user._id, name: user.name, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Get logged-in user
 */
exports.getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("getLoggedInUser error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Forgot password (development/demo flow)
 * - Generates a short-lived JWT reset token (15m)
 * - Returns a frontend reset link in the response (so the frontend can show it)
 *
 * NOTE: returning the link to the browser is insecure for production.
 */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal whether the email exists; return a neutral message
      return res.json({ message: "If the email exists, a reset link will be provided." });
    }

    const resetToken = jwt.sign(
      { id: user._id },
      process.env.RESET_JWT_SECRET || process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const FRONTEND_BASE = process.env.FRONTEND_BASE || "http://localhost:5173";
    const resetLink = `${FRONTEND_BASE}/reset-password?token=${encodeURIComponent(resetToken)}&email=${encodeURIComponent(email)}`;

    // Return link for development/demo purposes
    return res.json({
      message: "Reset link generated (development use).",
      resetLink,
    });
  } catch (err) {
    console.error("forgotPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * Reset password
 * Body: { resetToken, newPassword }
 */
exports.resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) return res.status(400).json({ message: "Token and new password required" });

    let payload;
    try {
      payload = jwt.verify(resetToken, process.env.RESET_JWT_SECRET || process.env.JWT_SECRET);
    } catch (err) {
      console.warn("resetPassword: invalid/expired token", err);
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(payload.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Hash and save the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Save and return success
    await user.save();
    return res.json({ message: "Password updated" });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
