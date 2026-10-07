const pool = require("../config/db");
const kiotvietService = require("./kiotvietService");

/**
 * Chuyển đổi tên tiếng Việt có dấu thành URL slug thân thiện
 */
function toSlug(str) {
  if (!str) return "san-pham-" + Date.now();
  let s = str.toLowerCase();
  // Xóa ký tự trong ngoặc vuông như [ Deal Đặc Biệt ]
  s = s.replace(/\[[^\]]*\]/g, "");
  // Chuyển ký tự có dấu
  s = s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  s = s.replace(/[đĐ]/g, "d");
  s = s.replace(/[^a-z0-9\s-]/g, "");
  s = s.trim().replace(/\s+/g, "-");
  s = s.replace(/-+/g, "-");
  return s || "san-pham-" + Date.now();
}

/**
 * Tự động phân loại category_id dựa trên tên sản phẩm
 */
function detectCategoryId(productName, existingCategories) {
  const lower = (productName || "").toLowerCase();
  
  if (lower.includes("tote")) {
    const found = existingCategories.find((c) => c.slug === "tote-bag");
    if (found) return found.id;
  }
  if (lower.includes("đeo chéo") || lower.includes("shoulder") || lower.includes("pillow") || lower.includes("belt")) {
    const found = existingCategories.find((c) => c.slug === "shoulder-bag");
    if (found) return found.id;
  }
  if (lower.includes("du lịch") || lower.includes("travel") || lower.includes("balo") || lower.includes("backpack")) {
    const found = existingCategories.find((c) => c.slug === "travel-bag");
    if (found) return found.id;
  }
  if (lower.includes("charm") || lower.includes("dây") || lower.includes("tag") || lower.includes("ví") || lower.includes("wallet")) {
    const found = existingCategories.find((c) => c.slug === "accessories");
    if (found) return found.id;
  }

  // Mặc định trả về category đầu tiên nếu không khớp
  return existingCategories[0] ? existingCategories[0].id : 1;
}

/**
 * Trích xuất tên phân loại / màu sắc từ KiotViet
 */
function extractVariantColor(item, masterName) {
  if (item.attributes && item.attributes.length > 0) {
    const attr = item.attributes[0];
    if (attr.attributeValue && attr.attributeValue.trim()) {
      return attr.attributeValue.trim();
    }
  }

  // Nếu không có attributes, thử tách từ fullName
  if (item.fullName && item.fullName.includes(" - ")) {
    const parts = item.fullName.split(" - ");
    const candidate = parts[parts.length - 1].trim();
    if (candidate) return candidate;
  }

  return "Tiêu chuẩn";
}

/**
 * Đồng bộ toàn bộ sản phẩm từ KiotViet vào cơ sở dữ liệu website
 */
async function syncProductsFromKiotViet({ wipeOldProducts = true } = {}) {
  const connection = await pool.getConnection();
  try {
    console.log("[SyncService] Bắt đầu quá trình đồng bộ sản phẩm từ KiotViet...");

    // 1. Tải toàn bộ sản phẩm KiotViet
    const { total, data: kvItems } = await kiotvietService.getAllProducts();
    console.log(`[SyncService] Đã nhận được ${kvItems.length} SKUs từ KiotViet.`);

    if (!kvItems || kvItems.length === 0) {
      return { success: false, message: "Không tìm thấy sản phẩm nào trên KiotViet" };
    }

    // 2. Lấy danh sách categories hiện tại trong DB
    const [categories] = await connection.query("SELECT * FROM categories WHERE is_active = 1");

    // 3. Gom nhóm 246 SKUs theo Tên sản phẩm chính (p.name)
    const productGroups = new Map();
    for (const item of kvItems) {
      const groupName = (item.name || item.fullName || "Sản phẩm 98studio").trim();
      if (!productGroups.has(groupName)) {
        productGroups.set(groupName, []);
      }
      productGroups.get(groupName).push(item);
    }

    console.log(`[SyncService] Phân nhóm thành ${productGroups.size} dòng sản phẩm chính.`);

    await connection.beginTransaction();

    // 4. Nếu wipeOldProducts = true: Xóa sản phẩm cũ theo yêu cầu
    if (wipeOldProducts) {
      console.log("[SyncService] Đang xóa dữ liệu sản phẩm demo cũ...");
      await connection.query("SET FOREIGN_KEY_CHECKS = 0;");
      await connection.query("DELETE FROM order_items;");
      await connection.query("DELETE FROM inventory_logs;");
      await connection.query("DELETE FROM product_variants;");
      await connection.query("DELETE FROM products;");
      await connection.query("SET FOREIGN_KEY_CHECKS = 1;");
      console.log("[SyncService] Đã dọn sạch sản phẩm cũ.");
    }

    let createdProducts = 0;
    let createdVariants = 0;
    const usedSlugs = new Set();

    // 5. Lưu từng sản phẩm cha và các biến thể vào Database
    for (const [prodName, variants] of productGroups.entries()) {
      // Xác định category
      const categoryId = detectCategoryId(prodName, categories);

      // Tạo slug duy nhất
      let baseSlug = toSlug(prodName);
      let slug = baseSlug;
      let counter = 1;
      while (usedSlugs.has(slug)) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      usedSlugs.add(slug);

      // Thu thập toàn bộ link ảnh từ các biến thể
      const allImages = [];
      for (const v of variants) {
        if (v.images && Array.isArray(v.images)) {
          for (const img of v.images) {
            if (img && !allImages.includes(img)) allImages.push(img);
          }
        }
      }

      const fallbackImage =
        "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/fallback.jpg";
      const coverImage = allImages[0] || fallbackImage;
      const hoverImage = allImages[1] || coverImage;

      // Tìm giá thấp nhất trong các biến thể làm base_price
      let minPrice = Infinity;
      for (const v of variants) {
        const p = Number(v.basePrice) || 0;
        if (p > 0 && p < minPrice) minPrice = p;
      }
      if (minPrice === Infinity) minPrice = Number(variants[0].basePrice) || 0;

      // Mô tả HTML lấy từ biến thể đầu tiên có mô tả
      let description = "";
      for (const v of variants) {
        if (v.description && v.description.trim()) {
          description = v.description.trim();
          break;
        }
      }
      if (!description) {
        description = `<p>${prodName} - Sản phẩm chính hãng Local Brand ninetyeightstudio.</p>`;
      }

      // Đại diện KiotViet ID
      const masterKvId = variants[0].id;
      const masterKvCode = variants[0].masterCode || variants[0].code;

      // Thêm sản phẩm cha vào bảng products
      const [prodInsert] = await connection.query(
        `INSERT INTO products 
         (category_id, name, slug, product_code, description, base_price, cover_image, hover_image, gallery_images, is_new_arrival, is_best_seller, is_active, kiotviet_id, kiotviet_code) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 1, ?, ?)`,
        [
          categoryId,
          prodName,
          slug,
          masterKvCode,
          description,
          minPrice,
          coverImage,
          hoverImage,
          JSON.stringify(allImages),
          masterKvId,
          masterKvCode,
        ]
      );

      const productId = prodInsert.insertId;
      createdProducts++;

      // Thêm các biến thể (variants) vào bảng product_variants
      for (const v of variants) {
        const colorName = extractVariantColor(v, prodName);
        const sku = v.code || `SKU-${v.id}`;
        const vPrice = Number(v.basePrice) || minPrice;
        const vImage = v.images && v.images[0] ? v.images[0] : coverImage;

        // Lấy số lượng tồn kho thực tế từ branch trung tâm
        let stockOnHand = 0;
        let reservedStock = 0;
        if (v.inventories && Array.isArray(v.inventories) && v.inventories.length > 0) {
          stockOnHand = Math.max(0, Math.floor(v.inventories[0].onHand || 0));
          reservedStock = Math.max(0, Math.floor(v.inventories[0].reserved || 0));
        }

        const weightGram = Number(v.weight) || 500;
        const isAllowSale = v.allowsSale !== false ? 1 : 0;

        await connection.query(
          `INSERT INTO product_variants 
           (product_id, color_name, sku, barcode, image, price, original_price, stock, reserved_stock, weight_gram, is_active, kiotviet_id, kiotviet_code) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            productId,
            colorName,
            sku,
            v.barcode || null,
            vImage,
            vPrice,
            vPrice,
            stockOnHand,
            reservedStock,
            weightGram,
            isAllowSale,
            v.id,
            v.code,
          ]
        );

        createdVariants++;
      }
    }

    await connection.commit();
    console.log(
      `[SyncService] Đồng bộ thành công! Tạo mới ${createdProducts} sản phẩm chính, ${createdVariants} biến thể.`
    );

    return {
      success: true,
      totalKiotvietItems: kvItems.length,
      createdProducts,
      createdVariants,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    await connection.rollback();
    console.error("[SyncService] Lỗi đồng bộ KiotViet:", error);
    throw error;
  } finally {
    connection.release();
  }
}

/**
 * Cập nhật tồn kho cho 1 SKU khi nhận Webhook stock.update
 */
async function updateStockFromWebhook(sku, onHand, reserved = 0) {
  try {
    const [res] = await pool.query(
      `UPDATE product_variants 
       SET stock = ?, reserved_stock = ?, updated_at = NOW() 
       WHERE sku = ? OR kiotviet_code = ?`,
      [Math.max(0, onHand), Math.max(0, reserved), sku, sku]
    );
    console.log(`[SyncService] Webhook: Cập nhật kho SKU ${sku} -> Tồn kho: ${onHand} (Rows: ${res.affectedRows})`);
    return res.affectedRows > 0;
  } catch (error) {
    console.error(`[SyncService] Lỗi cập nhật kho webhook SKU ${sku}:`, error);
    return false;
  }
}

module.exports = {
  syncProductsFromKiotViet,
  updateStockFromWebhook,
};
