const pool = require("../config/db");

// GET /api/products
// Support query: ?search=...&category=...&is_active=...&limit=...&page=...
const getProducts = async (req, res) => {
  try {
    const { search, category, is_active, include_inactive, limit = 50, page = 1 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereConditions = ["1=1"];
    let params = [];

    if (search) {
      whereConditions.push("(p.name LIKE ? OR p.product_code LIKE ? OR p.slug LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    if (category) {
      whereConditions.push("(c.slug = ? OR c.id = ?)");
      params.push(category, category);
    }

    if (is_active !== undefined) {
      whereConditions.push("p.is_active = ?");
      params.push(Number(is_active));
    } else if (include_inactive !== "true" && req.headers["x-admin-request"] !== "true") {
      // By default for public storefront, only show active products
      whereConditions.push("p.is_active = 1");
    }

    const whereClause = whereConditions.join(" AND ");

    // Get total count
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    // Get products with category and aggregated variant info
    const [products] = await pool.query(
      `SELECT 
        p.*,
        c.name AS category_name,
        c.slug AS category_slug,
        COUNT(v.id) AS variant_count,
        COALESCE(SUM(v.stock), 0) AS total_stock,
        COALESCE(SUM(v.reserved_stock), 0) AS total_reserved_stock,
        COALESCE(MIN(v.price), p.base_price) AS min_price,
        COALESCE(MAX(v.price), p.base_price) AS max_price
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN product_variants v ON p.id = v.product_id AND v.is_active = 1
       WHERE ${whereClause}
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    // Fetch variants for each product if needed or send products directly
    // Let's attach full variants list so the frontend UI can display color swatches immediately!
    const productIds = products.map((p) => p.id);
    let variantsByProduct = {};

    if (productIds.length > 0) {
      const [allVariants] = await pool.query(
        `SELECT * FROM product_variants WHERE product_id IN (?) ORDER BY id ASC`,
        [productIds]
      );
      allVariants.forEach((v) => {
        if (!variantsByProduct[v.product_id]) {
          variantsByProduct[v.product_id] = [];
        }
        variantsByProduct[v.product_id].push(v);
      });
    }

    const formattedProducts = products.map((p) => ({
      ...p,
      gallery_images: typeof p.gallery_images === "string" ? JSON.parse(p.gallery_images || "[]") : (p.gallery_images || []),
      highlights: typeof p.highlights === "string" ? JSON.parse(p.highlights || "[]") : (p.highlights || []),
      variants: variantsByProduct[p.id] || [],
    }));

    return res.json({
      success: true,
      data: formattedProducts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ success: false, message: "Lỗi lấy danh sách sản phẩm", error: error.message });
  }
};

// GET /api/products/:idOrSlug
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const isNum = !isNaN(Number(id));
    const includeInactive = req.query.include_inactive === "true" || req.headers["x-admin-request"] === "true";

    let whereSql = isNum ? "p.id = ?" : "p.slug = ?";
    if (!includeInactive) {
      whereSql += " AND p.is_active = 1";
    }

    const [rows] = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug 
       FROM products p 
       LEFT JOIN categories c ON p.category_id = c.id 
       WHERE ${whereSql} LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy sản phẩm" });
    }

    const product = rows[0];
    const [variants] = await pool.query(
      "SELECT * FROM product_variants WHERE product_id = ? ORDER BY id ASC",
      [product.id]
    );

    product.gallery_images = typeof product.gallery_images === "string" ? JSON.parse(product.gallery_images || "[]") : (product.gallery_images || []);
    product.highlights = typeof product.highlights === "string" ? JSON.parse(product.highlights || "[]") : (product.highlights || []);
    product.variants = variants;

    return res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Get product detail error:", error);
    return res.status(500).json({ success: false, message: "Lỗi lấy chi tiết sản phẩm", error: error.message });
  }
};

// POST /api/products (Create product + Shopee-style variants)
const createProduct = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      name,
      slug,
      category_id,
      product_code,
      description,
      highlights,
      dimensions,
      material,
      care_instructions,
      shipping_policy,
      base_price,
      cover_image,
      hover_image,
      gallery_images,
      is_new_arrival = 0,
      is_best_seller = 0,
      is_active = 1,
      variants = [],
    } = req.body;

    if (!name || !category_id || !cover_image) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ Tên sản phẩm, Danh mục và Ảnh bìa" });
    }

    // Auto-generate slug if not provided
    const productSlug = slug || name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

    const [prodResult] = await connection.query(
      `INSERT INTO products 
        (category_id, name, slug, product_code, description, highlights, dimensions, material, 
         care_instructions, shipping_policy, base_price, cover_image, hover_image, gallery_images, 
         is_new_arrival, is_best_seller, is_active) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        category_id,
        name,
        productSlug,
        product_code || null,
        description || null,
        JSON.stringify(highlights || []),
        dimensions || null,
        material || null,
        care_instructions || null,
        shipping_policy || null,
        base_price || 0,
        cover_image,
        hover_image || null,
        JSON.stringify(gallery_images || []),
        is_new_arrival ? 1 : 0,
        is_best_seller ? 1 : 0,
        is_active ? 1 : 0,
      ]
    );

    const newProductId = prodResult.insertId;

    // Insert variants
    if (variants && variants.length > 0) {
      for (const v of variants) {
        const variantSku = v.sku || `${productSlug.toUpperCase()}-${(v.color_name || "DEF").substring(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
        await connection.query(
          `INSERT INTO product_variants 
            (product_id, color_name, color_code, sku, barcode, image, price, original_price, stock, reserved_stock, weight_gram, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, 1)`,
          [
            newProductId,
            v.color_name || "Tiêu chuẩn",
            v.color_code || "#000000",
            variantSku,
            v.barcode || null,
            v.image || cover_image,
            v.price || base_price || 0,
            v.original_price || null,
            Number(v.stock) || 0,
            Number(v.weight_gram) || 500,
          ]
        );
      }
    } else {
      // Create default variant if none provided
      await connection.query(
        `INSERT INTO product_variants 
          (product_id, color_name, color_code, sku, image, price, stock, is_active)
         VALUES (?, 'Mặc định', '#000000', ?, ?, ?, 10, 1)`,
        [newProductId, `${productSlug.toUpperCase()}-DEF`, cover_image, base_price || 0]
      );
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Thêm sản phẩm thành công",
      productId: newProductId,
    });
  } catch (error) {
    await connection.rollback();
    console.error("Create product error:", error);
    return res.status(500).json({ success: false, message: "Lỗi tạo sản phẩm", error: error.message });
  } finally {
    connection.release();
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;

    const {
      name,
      slug,
      category_id,
      product_code,
      description,
      highlights,
      dimensions,
      material,
      care_instructions,
      shipping_policy,
      base_price,
      cover_image,
      hover_image,
      gallery_images,
      is_new_arrival,
      is_best_seller,
      is_active,
      variants = [],
    } = req.body;

    await connection.query(
      `UPDATE products SET 
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        category_id = COALESCE(?, category_id),
        product_code = COALESCE(?, product_code),
        description = COALESCE(?, description),
        highlights = COALESCE(?, highlights),
        dimensions = COALESCE(?, dimensions),
        material = COALESCE(?, material),
        care_instructions = COALESCE(?, care_instructions),
        shipping_policy = COALESCE(?, shipping_policy),
        base_price = COALESCE(?, base_price),
        cover_image = COALESCE(?, cover_image),
        hover_image = COALESCE(?, hover_image),
        gallery_images = COALESCE(?, gallery_images),
        is_new_arrival = COALESCE(?, is_new_arrival),
        is_best_seller = COALESCE(?, is_best_seller),
        is_active = COALESCE(?, is_active)
       WHERE id = ?`,
      [
        name,
        slug,
        category_id,
        product_code,
        description,
        highlights ? JSON.stringify(highlights) : null,
        dimensions,
        material,
        care_instructions,
        shipping_policy,
        base_price,
        cover_image,
        hover_image,
        gallery_images ? JSON.stringify(gallery_images) : null,
        is_new_arrival !== undefined ? (is_new_arrival ? 1 : 0) : null,
        is_best_seller !== undefined ? (is_best_seller ? 1 : 0) : null,
        is_active !== undefined ? (is_active ? 1 : 0) : null,
        id,
      ]
    );

    // Sync variants: if provided, update existing or insert new
    if (variants && variants.length > 0) {
      for (const v of variants) {
        if (v.id) {
          // Update existing variant
          await connection.query(
            `UPDATE product_variants SET 
              color_name = ?, color_code = ?, sku = ?, image = ?, price = ?, 
              original_price = ?, stock = ?, is_active = ?
             WHERE id = ? AND product_id = ?`,
            [
              v.color_name,
              v.color_code || "#000000",
              v.sku,
              v.image,
              v.price,
              v.original_price || null,
              Number(v.stock),
              v.is_active !== undefined ? (v.is_active ? 1 : 0) : 1,
              v.id,
              id,
            ]
          );
        } else {
          // Insert new variant
          const sku = v.sku || `VAR-${id}-${(v.color_name || "C").toUpperCase()}-${Date.now().toString().slice(-4)}`;
          await connection.query(
            `INSERT INTO product_variants 
              (product_id, color_name, color_code, sku, image, price, original_price, stock, reserved_stock, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 1)`,
            [
              id,
              v.color_name,
              v.color_code || "#000000",
              sku,
              v.image || cover_image,
              v.price || base_price || 0,
              v.original_price || null,
              Number(v.stock) || 0,
            ]
          );
        }
      }
    }

    await connection.commit();
    return res.json({ success: true, message: "Cập nhật sản phẩm thành công" });
  } catch (error) {
    await connection.rollback();
    console.error("Update product error:", error);
    return res.status(500).json({ success: false, message: "Lỗi cập nhật sản phẩm", error: error.message });
  } finally {
    connection.release();
  }
};

// DELETE /api/products/:id (Deactivate or remove permanently)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if product has any orders in order_items
    const [orderCheck] = await pool.query(
      "SELECT id FROM order_items WHERE product_id = ? LIMIT 1",
      [id]
    );

    if (orderCheck.length > 0) {
      // Soft delete to protect financial and order history
      await pool.query("UPDATE products SET is_active = 0 WHERE id = ?", [id]);
      return res.json({
        success: true,
        message: "Sản phẩm đã có lịch sử đơn hàng nên được chuyển sang trạng thái ngừng kinh doanh (tạm ẩn)",
      });
    }

    // Hard delete when no orders exist (e.g., test products, typos)
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      // Delete any inventory logs for variants of this product
      await connection.query(
        "DELETE FROM inventory_logs WHERE variant_id IN (SELECT id FROM product_variants WHERE product_id = ?)",
        [id]
      );
      // Delete variants
      await connection.query("DELETE FROM product_variants WHERE product_id = ?", [id]);
      // Delete product
      await connection.query("DELETE FROM products WHERE id = ?", [id]);
      await connection.commit();
      return res.json({ success: true, message: "Đã xóa hoàn toàn sản phẩm khỏi hệ thống" });
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ success: false, message: "Lỗi xóa sản phẩm", error: error.message });
  }
};

// PATCH /api/products/variants/:variantId/stock
const updateVariantStock = async (req, res) => {
  try {
    const { variantId } = req.params;
    const { stock, note } = req.body;

    if (stock === undefined || Number(stock) < 0) {
      return res.status(400).json({ success: false, message: "Số lượng tồn kho không hợp lệ" });
    }

    const [rows] = await pool.query("SELECT * FROM product_variants WHERE id = ?", [variantId]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy biến thể" });
    }

    const variant = rows[0];
    const diff = Number(stock) - variant.stock;

    await pool.query("UPDATE product_variants SET stock = ? WHERE id = ?", [Number(stock), variantId]);

    // Record inventory log
    await pool.query(
      `INSERT INTO inventory_logs (variant_id, action, quantity_change, stock_after, reserved_after, note)
       VALUES (?, 'adjustment', ?, ?, ?, ?)`,
      [variantId, diff, Number(stock), variant.reserved_stock, note || "Admin điều chỉnh tồn kho trực tiếp"]
    );

    return res.json({ success: true, message: "Cập nhật tồn kho thành công", newStock: Number(stock) });
  } catch (error) {
    console.error("Update variant stock error:", error);
    return res.status(500).json({ success: false, message: "Lỗi cập nhật tồn kho", error: error.message });
  }
};

// GET /api/categories
const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY display_order ASC, name ASC");
    return res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Get categories error:", error);
    return res.status(500).json({ success: false, message: "Lỗi lấy danh mục", error: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateVariantStock,
  getCategories,
};
