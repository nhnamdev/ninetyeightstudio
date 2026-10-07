const express = require("express");
const router = express.Router();
const { updateStockFromWebhook } = require("../services/syncService");
const pool = require("../config/db");

/**
 * POST /api/webhooks/kiotviet
 * Webhook receiver do KiotViet bắn sang khi có sự kiện
 */
router.post("/kiotviet", async (req, res) => {
  try {
    const payload = req.body;
    console.log(`[Webhook KiotViet] Nhận sự kiện lúc ${new Date().toISOString()}:`, JSON.stringify(payload).substring(0, 300));

    // KiotViet gửi danh sách thông báo trong Notifications
    const notifications = payload.Notifications || [];

    for (const notif of notifications) {
      const action = (notif.Action || "").toLowerCase();
      const dataList = notif.Data || [];

      // 1. Cập nhật tồn kho (stock.update)
      if (action.includes("stock") || action.includes("inventory")) {
        for (const item of dataList) {
          const sku = item.Code || item.code;
          const onHand = item.OnHand !== undefined ? item.OnHand : (item.TotalOnHand !== undefined ? item.TotalOnHand : item.onHand);
          const reserved = item.Reserved !== undefined ? item.Reserved : (item.reserved || 0);

          if (sku !== undefined && onHand !== undefined) {
            await updateStockFromWebhook(sku, onHand, reserved);
          }
        }
      }

      // 2. Cập nhật sản phẩm (product.update)
      if (action.includes("product.update") || action.includes("product")) {
        for (const item of dataList) {
          const sku = item.Code || item.code;
          const basePrice = item.BasePrice || item.basePrice;
          const allowsSale = item.AllowsSale !== undefined ? item.AllowsSale : item.allowsSale;

          if (sku) {
            const updates = [];
            const params = [];
            if (basePrice !== undefined) {
              updates.push("price = ?, original_price = ?");
              params.push(basePrice, basePrice);
            }
            if (allowsSale !== undefined) {
              updates.push("is_active = ?");
              params.push(allowsSale ? 1 : 0);
            }

            if (updates.length > 0) {
              params.push(sku, sku);
              await pool.query(
                `UPDATE product_variants SET ${updates.join(", ")}, updated_at = NOW() WHERE sku = ? OR kiotviet_code = ?`,
                params
              );
              console.log(`[Webhook KiotViet] Cập nhật giá/trạng thái cho SKU ${sku}`);
            }
          }
        }
      }
    }

    // KiotViet yêu cầu trả về status 200 nhanh chóng
    return res.status(200).json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.error("[Webhook KiotViet] Lỗi xử lý webhook:", error);
    // Vẫn trả về 200 để KiotViet không gửi lại liên tục nếu là lỗi logic nội bộ
    return res.status(200).json({ success: false, error: error.message });
  }
});

module.exports = router;
