const pool = require("../config/db");

// GET /api/dashboard/stats
const getStats = async (req, res) => {
  try {
    // 1. Revenue
    const [revRows] = await pool.query(
      "SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders WHERE order_status != 'cancelled'"
    );
    const totalRevenue = Number(revRows[0].total_revenue || 0);

    // 2. Total orders
    const [ordersCountRows] = await pool.query("SELECT COUNT(*) AS total_orders FROM orders");
    const totalOrders = ordersCountRows[0].total_orders;

    // 3. Pending orders
    const [pendingRows] = await pool.query(
      "SELECT COUNT(*) AS pending_orders FROM orders WHERE order_status = 'pending'"
    );
    const pendingOrders = pendingRows[0].pending_orders;

    // 4. Total Customers
    const [userRows] = await pool.query(
      "SELECT COUNT(*) AS total_customers FROM users WHERE role = 'customer'"
    );
    const totalCustomers = userRows[0].total_customers;

    // 5. Total Products & Variants
    const [prodRows] = await pool.query("SELECT COUNT(*) AS total_products FROM products WHERE is_active = 1");
    const totalProducts = prodRows[0].total_products;

    // 6. Low stock items (stock <= 5)
    const [lowStockRows] = await pool.query(
      `SELECT v.id, v.product_id, p.name AS product_name, v.color_name, v.sku, v.stock, v.reserved_stock, 
              (v.stock - v.reserved_stock) AS available_stock, v.image
       FROM product_variants v
       JOIN products p ON v.product_id = p.id
       WHERE (v.stock - v.reserved_stock) <= 10 AND v.is_active = 1
       ORDER BY available_stock ASC
       LIMIT 8`
    );

    // 7. Recent orders (latest 7)
    const [recentOrders] = await pool.query(
      `SELECT o.id, o.order_code, o.customer_name, o.customer_phone, o.total_amount, 
              o.payment_method, o.payment_status, o.order_status, o.created_at,
              (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS item_count
       FROM orders o
       ORDER BY o.created_at DESC
       LIMIT 7`
    );

    // 8. Order status distribution
    const [statusDistribution] = await pool.query(
      `SELECT order_status, COUNT(*) as count 
       FROM orders 
       GROUP BY order_status`
    );

    return res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        totalCustomers,
        totalProducts,
        lowStockItems: lowStockRows,
        recentOrders,
        statusDistribution,
      },
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({ success: false, message: "Lỗi lấy thống kê dashboard", error: error.message });
  }
};

module.exports = {
  getStats,
};
