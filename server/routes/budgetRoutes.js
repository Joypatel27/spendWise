
// server/routes/budgetRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const budgetController = require("../controllers/budgetController");

router.get("/", auth, budgetController.getBudgets);
router.post("/", auth, budgetController.createBudget);
router.delete("/:id", auth, budgetController.deleteBudget);

module.exports = router;

