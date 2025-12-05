
// const express = require("express");
// const router = express.Router();
// const { register, login, getLoggedInUser } = require("../controllers/authController");
// const auth = require("../middleware/authmiddleware");

// router.post("/register", register);
// router.post("/login", login);
// router.get("/me", auth, getLoggedInUser); // GET /api/auth/me


// module.exports = router;
const express = require("express");
const router = express.Router();

const {
  register,
  login,
  getLoggedInUser,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const auth = require("../middleware/authmiddleware");

// AUTH
router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getLoggedInUser);

// PASSWORD RESET (no OTP)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
