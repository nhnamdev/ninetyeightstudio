const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");

// Public & Admin product routes
router.get("/categories", productController.getCategories);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);

// Admin-only management routes
router.post("/", verifyToken, requireAdmin, productController.createProduct);
router.put("/:id", verifyToken, requireAdmin, productController.updateProduct);
router.delete("/:id", verifyToken, requireAdmin, productController.deleteProduct);
router.patch("/variants/:variantId/stock", verifyToken, requireAdmin, productController.updateVariantStock);

module.exports = router;
