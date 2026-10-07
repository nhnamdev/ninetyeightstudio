const express = require("express");
const router = express.Router();
const kiotvietService = require("../services/kiotvietService");
const { syncProductsFromKiotViet } = require("../services/syncService");
const pool = require("../config/db");

/**
 * GET /api/kiotviet/status
 * Kiểm tra trạng thái kết nối tới KiotViet
 */
router.get("/status", async (req, res) => {
  try {
    const token = await kiotvietService.getAccessToken();
    const branches = await kiotvietService.getBranches();
    const [dbCount] = await pool.query("SELECT COUNT(*) AS total FROM products");
    const [variantCount] = await pool.query("SELECT COUNT(*) AS total FROM product_variants");

    return res.json({
      success: true,
      connected: true,
      retailer: kiotvietService.retailer,
      branch: branches.data && branches.data[0] ? branches.data[0] : null,
      tokenExpiresIn: Math.max(0, kiotvietService.tokenExpiresAt - Math.floor(Date.now() / 1000)),
      databaseStats: {
        totalProducts: dbCount[0].total,
        totalVariants: variantCount[0].total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      connected: false,
      message: "Không kết nối được tới KiotViet",
      error: error.message,
    });
  }
});

/**
 * POST /api/kiotviet/sync
 * Kích hoạt đồng bộ sản phẩm từ KiotViet về Website
 */
router.post("/sync", async (req, res) => {
  try {
    const { wipe = false } = req.body;
    console.log(`[KiotViet Route] Nhận yêu cầu đồng bộ (wipe = ${wipe})...`);
    const result = await syncProductsFromKiotViet({ wipeOldProducts: wipe });
    return res.json({
      success: true,
      message: `Đồng bộ thành công! Đã tạo ${result.createdProducts} sản phẩm và ${result.createdVariants} biến thể.`,
      result,
    });
  } catch (error) {
    console.error("[KiotViet Route] Lỗi đồng bộ:", error);
    return res.status(500).json({
      success: false,
      message: "Lỗi đồng bộ sản phẩm từ KiotViet",
      error: error.message,
    });
  }
});

/**
 * GET /api/kiotviet/webhooks
 * Lấy danh sách Webhook đã đăng ký trên KiotViet
 */
router.get("/webhooks", async (req, res) => {
  try {
    const webhooks = await kiotvietService.getWebhooks();
    return res.json({ success: true, data: webhooks });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/kiotviet/webhooks/register
 * Đăng ký webhook tự động với KiotViet
 */
router.post("/webhooks/register", async (req, res) => {
  try {
    const defaultUrl = process.env.KIOTVIET_WEBHOOK_URL || "https://98studio.mocmoc.vn/api/webhooks/kiotviet";
    const webhookUrl = req.body.url || defaultUrl;

    const stockRes = await kiotvietService.registerWebhook("stock.update", webhookUrl, "Tự động đồng bộ tồn kho 98studio");
    const prodRes = await kiotvietService.registerWebhook("product.update", webhookUrl, "Tự động đồng bộ thông tin sản phẩm 98studio");

    return res.json({
      success: true,
      message: "Đã đăng ký Webhooks thành công!",
      results: { stock: stockRes, product: prodRes },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
