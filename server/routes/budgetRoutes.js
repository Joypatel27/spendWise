
// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authmiddleware");
// const budgetController = require("../controllers/budgetController");
// const {
//   getBudgets,
//   createBudget,
//   disableTemp,
//   enableNow,
//   deleteBudget,
// } = require("../controllers/budgetController");

// // All routes protected by auth
// router.use(auth);

// // Get all budgets with server-side aggregation + auto-rolling
// router.get("/", getBudgets);

// // Create new budget (supports oneMonth salary budget)
// router.post("/", createBudget);

// // Disable a budget temporarily for 1 month
// router.patch("/:id/disable-temp", disableTemp);

// // Re-enable budget immediately
// router.patch("/:id/enable", enableNow);

// // Delete budget
// router.delete("/:id", deleteBudget);

// module.exports = router;
// server/routes/budgetRoutes.js
// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authmiddleware");

// // import controller functions directly (avoid default object confusion)
// const {
//   getBudgets,
//   createBudget,
//   deleteBudget,
// } = require("../controllers/budgetController");

// // GET all budgets (for logged-in user)
// router.get("/", auth, getBudgets);

// // CREATE a budget
// router.post("/", auth, createBudget);

// // DELETE a budget
// router.delete("/:id", auth, deleteBudget);

// module.exports = router;



// server/routes/budgetRoutes.js
// const express = require("express");
// const router = express.Router();
// const auth = require("../middleware/authmiddleware");

// // require the exported functions from controller
// const budgetController = require("../controllers/budgetController");

// // define routes using functions from controller
// router.get("/", auth, budgetController.getBudgets);
// router.post("/", auth, budgetController.createBudget);
// router.delete("/:id", auth, budgetController.deleteBudget);

// module.exports = router;
// server/routes/budgetRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authmiddleware");
const budgetController = require("../controllers/budgetController");

router.get("/", auth, budgetController.getBudgets);
router.post("/", auth, budgetController.createBudget);
router.delete("/:id", auth, budgetController.deleteBudget);

module.exports = router;

