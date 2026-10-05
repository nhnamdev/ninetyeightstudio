const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// Admin metrics route
router.get("/stats", verifyToken, requireAdmin, dashboardController.getStats);

module.exports = router;
