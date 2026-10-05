const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// Client order placement (checkout)
router.post("/", orderController.createOrder);

// Admin order management
router.get("/", verifyToken, requireAdmin, orderController.getOrders);
router.get("/:id", verifyToken, requireAdmin, orderController.getOrderById);
router.put("/:id/status", verifyToken, requireAdmin, orderController.updateOrderStatus);
router.put("/:id/payment", verifyToken, requireAdmin, orderController.updatePaymentStatus);

module.exports = router;
