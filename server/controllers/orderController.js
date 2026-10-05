const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/authMiddleware");

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const { status, payment_status, search, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereConditions = ["1=1"];
    let params = [];

    if (status && status !== "all") {
      whereConditions.push("o.order_status = ?");
      params.push(status);
    }

    if (payment_status && payment_status !== "all") {
      whereConditions.push("o.payment_status = ?");
      params.push(payment_status);
    }

    if (search) {
      whereConditions.push("(o.order_code LIKE ? OR o.customer_name LIKE ? OR o.customer_phone LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    const whereClause = whereConditions.join(" AND ");

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM orders o WHERE ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const [orders] = await pool.query(
      `SELECT o.*,
              (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count,
              (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', oi.id,
                  'product_name', oi.product_name,
                  'color_name', oi.color_name,
                  'quantity', oi.quantity,
                  'unit_price', oi.unit_price,
                  'image', oi.image
                )
              ) FROM order_items oi WHERE oi.order_id = o.id) AS items
       FROM orders o
       WHERE ${whereClause}
       ORDER BY o.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    return res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get orders error:", error);
    return res.status(500).json({ success: false, message: "Lỗi lấy danh sách đơn hàng", error: error.message });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const isNum = !isNaN(Number(id));

    const [rows] = await pool.query(
      `SELECT * FROM orders WHERE ${isNum ? "id = ?" : "order_code = ?"} LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    const order = rows[0];

    const [items] = await pool.query(
      `SELECT oi.*, p.slug as product_slug 
       FROM order_items oi 
       LEFT JOIN products p ON oi.product_id = p.id 
       WHERE oi.order_id = ?`,
      [order.id]
    );

    order.items = items;

    return res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("Get order detail error:", error);
    return res.status(500).json({ success: false, message: "Lỗi lấy chi tiết đơn hàng", error: error.message });
  }
};

// PUT /api/orders/:id/status
const updateOrderStatus = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { id } = req.params;
    const { order_status, cancel_reason } = req.body;

    const allowed = ["pending", "confirmed", "processing", "shipping", "completed", "cancelled"];
    if (!allowed.includes(order_status)) {
      return res.status(400).json({ success: false, message: "Trạng thái đơn hàng không hợp lệ" });
    }

    // Get current order
    const [orders] = await connection.query("SELECT * FROM orders WHERE id = ?", [id]);
    if (orders.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }
    const order = orders[0];

    // If changing to cancelled and was not cancelled before, release reserved stock
    if (order_status === "cancelled" && order.order_status !== "cancelled") {
      const [items] = await connection.query("SELECT variant_id, quantity FROM order_items WHERE order_id = ?", [id]);
      for (const item of items) {
        await connection.query(
          "UPDATE product_variants SET reserved_stock = GREATEST(0, reserved_stock - ?) WHERE id = ?",
          [item.quantity, item.variant_id]
        );
      }
      await connection.query(
        "UPDATE orders SET order_status = ?, cancelled_at = NOW(), cancel_reason = ? WHERE id = ?",
        [order_status, cancel_reason || "Hủy bởi quản trị viên", id]
      );
    } else if (order_status === "completed" && order.order_status !== "completed") {
      // Fulfill: deduct actual stock and release reserved stock
      const [items] = await connection.query("SELECT variant_id, quantity FROM order_items WHERE order_id = ?", [id]);
      for (const item of items) {
        await connection.query(
          "UPDATE product_variants SET stock = GREATEST(0, stock - ?), reserved_stock = GREATEST(0, reserved_stock - ?) WHERE id = ?",
          [item.quantity, item.quantity, item.variant_id]
        );
      }
      await connection.query(
        "UPDATE orders SET order_status = ?, payment_status = 'paid', paid_at = COALESCE(paid_at, NOW()) WHERE id = ?",
        [order_status, id]
      );
    } else {
      await connection.query("UPDATE orders SET order_status = ? WHERE id = ?", [order_status, id]);
    }

    await connection.commit();
    return res.json({ success: true, message: "Cập nhật trạng thái đơn hàng thành công", order_status });
  } catch (error) {
    await connection.rollback();
    console.error("Update order status error:", error);
    return res.status(500).json({ success: false, message: "Lỗi cập nhật đơn hàng", error: error.message });
  } finally {
    connection.release();
  }
};

// PUT /api/orders/:id/payment
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    const allowed = ["unpaid", "paid", "partially_refunded", "refunded"];
    if (!allowed.includes(payment_status)) {
      return res.status(400).json({ success: false, message: "Trạng thái thanh toán không hợp lệ" });
    }

    const paidAt = payment_status === "paid" ? "NOW()" : "NULL";
    await pool.query(
      `UPDATE orders SET payment_status = ?, paid_at = ${payment_status === "paid" ? "NOW()" : "paid_at"} WHERE id = ?`,
      [payment_status, id]
    );

    return res.json({ success: true, message: "Cập nhật thanh toán thành công", payment_status });
  } catch (error) {
    console.error("Update payment status error:", error);
    return res.status(500).json({ success: false, message: "Lỗi cập nhật thanh toán", error: error.message });
  }
};

// POST /api/orders (Create order from client / checkout)
const createOrder = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const {
      customer_name,
      customer_phone,
      customer_email,
      shipping_province,
      shipping_district,
      shipping_ward,
      shipping_address,
      order_notes,
      items = [],
      shipping_method = "standard",
      payment_method = "vietqr",
      shipping_fee = 0,
      discount_amount = 0,
      coupon_code,
    } = req.body;

    if (!customer_name || !customer_phone || !shipping_address || !items || items.length === 0) {
      return res.status(400).json({ success: false, message: "Thiếu thông tin người nhận hoặc giỏ hàng trống" });
    }

    // Check user_id from body or authorization header
    let user_id = req.body.user_id || null;
    if (!user_id && req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(" ")[1];
        if (token) {
          const decoded = jwt.verify(token, JWT_SECRET);
          user_id = decoded.id;
        }
      } catch (e) {
        // guest order
      }
    }

    // Generate readable order code #NES-xxxxx
    const order_code = `#NES-${Math.floor(10000 + Math.random() * 90000)}`;

    let subtotal = 0;
    for (const item of items) {
      subtotal += (Number(item.price) || 0) * (Number(item.quantity) || 1);
    }
    const total_amount = Math.max(0, subtotal + Number(shipping_fee) - Number(discount_amount));

    const [orderResult] = await connection.query(
      `INSERT INTO orders 
        (order_code, user_id, customer_name, customer_phone, customer_email, 
         shipping_province, shipping_district, shipping_ward, shipping_address, 
         order_notes, subtotal, shipping_fee, discount_amount, total_amount, 
         coupon_code, shipping_method, payment_method, payment_status, order_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'unpaid', 'pending')`,
      [
        order_code,
        user_id,
        customer_name,
        customer_phone,
        customer_email || "",
        shipping_province || "",
        shipping_district || "",
        shipping_ward || "",
        shipping_address,
        order_notes || null,
        subtotal,
        shipping_fee,
        discount_amount,
        total_amount,
        coupon_code || null,
        shipping_method,
        payment_method,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items and reserve stock
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items 
          (order_id, product_id, variant_id, product_name, color_name, sku, image, unit_price, quantity, total_price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          orderId,
          item.product_id || 1,
          item.variant_id || 1,
          item.name || item.product_name,
          item.color_name || "Mặc định",
          item.sku || "SKU-DEFAULT",
          item.image || "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/thumb-1-b6c013de.png",
          item.price,
          item.quantity,
          Number(item.price) * Number(item.quantity),
        ]
      );

      // Reserve stock in variant
      if (item.variant_id) {
        await connection.query(
          "UPDATE product_variants SET reserved_stock = reserved_stock + ? WHERE id = ?",
          [item.quantity, item.variant_id]
        );
      }
    }

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: "Đặt hàng thành công",
      order: {
        id: orderId,
        order_code,
        total_amount,
        payment_method,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error("Create order error:", error);
    return res.status(500).json({ success: false, message: "Lỗi tạo đơn hàng", error: error.message });
  } finally {
    connection.release();
  }
};

// GET /api/orders/my-orders (Customer orders)
const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await pool.query(
      `SELECT o.*,
              (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count,
              (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', oi.id,
                  'product_name', oi.product_name,
                  'color_name', oi.color_name,
                  'quantity', oi.quantity,
                  'unit_price', oi.unit_price,
                  'image', oi.image
                )
              ) FROM order_items oi WHERE oi.order_id = o.id) AS items
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [userId]
    );

    return res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);
    return res.status(500).json({ success: false, message: "Lỗi lấy danh sách đơn hàng của bạn", error: error.message });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  createOrder,
  getMyOrders,
};
