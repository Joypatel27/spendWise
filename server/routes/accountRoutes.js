// server/routes/accountRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware"); // your existing middleware
const {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} = require("../controllers/accountController");

router.use(auth); // all routes require auth

router.get("/", getAccounts);
router.post("/", createAccount);
router.put("/:id", updateAccount);
router.delete("/:id", deleteAccount);

module.exports = router;
