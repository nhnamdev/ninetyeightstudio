const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// Admin user management
router.get("/", verifyToken, requireAdmin, userController.getUsers);
router.get("/:id", verifyToken, requireAdmin, userController.getUserById);
router.put("/:id/status", verifyToken, requireAdmin, userController.updateUserStatus);

module.exports = router;
