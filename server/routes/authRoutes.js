
const express = require("express");
const router = express.Router();
const { register, login, getLoggedInUser } = require("../controllers/authController");
const auth = require("../middleware/authmiddleware");

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, getLoggedInUser); // GET /api/auth/me

module.exports = router;
