const pool = require("../config/db");

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 50 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);

    let whereConditions = ["1=1"];
    let params = [];

    if (role && role !== "all") {
      whereConditions.push("u.role = ?");
      params.push(role);
    }

    if (search) {
      whereConditions.push("(u.full_name LIKE ? OR u.email LIKE ? OR u.phone LIKE ?)");
      const term = `%${search}%`;
      params.push(term, term, term);
    }

    const whereClause = whereConditions.join(" AND ");

    const [countRows] = await pool.query(
      `SELECT COUNT(*) as total FROM users u WHERE ${whereClause}`,
      params
    );
    const total = countRows[0].total;

    const [users] = await pool.query(
      `SELECT u.id, u.full_name, u.email, u.phone, u.role, u.is_active, u.created_at,
              COUNT(o.id) AS total_orders,
              COALESCE(SUM(CASE WHEN o.order_status != 'cancelled' THEN o.total_amount ELSE 0 END), 0) AS total_spent
       FROM users u
       LEFT JOIN orders o ON o.user_id = u.id
       WHERE ${whereClause}
       GROUP BY u.id
       ORDER BY u.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, Number(limit), offset]
    );

    return res.json({
      success: true,
      data: users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    return res.status(500).json({ success: false, message: "Lỗi lấy danh sách khách hàng", error: error.message });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const [users] = await pool.query(
      "SELECT id, full_name, email, phone, role, is_active, created_at FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy người dùng" });
    }

    const user = users[0];

    // Fetch user's orders
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC",
      [user.id]
    );

    // Fetch user's addresses
    const [addresses] = await pool.query(
      "SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC",
      [user.id]
    );

    user.orders = orders;
    user.addresses = addresses;

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get user detail error:", error);
    return res.status(500).json({ success: false, message: "Lỗi lấy chi tiết người dùng", error: error.message });
  }
};

// PUT /api/users/:id/status
const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active, role } = req.body;

    const updates = [];
    const params = [];

    if (is_active !== undefined) {
      updates.push("is_active = ?");
      params.push(is_active ? 1 : 0);
    }

    if (role && ["customer", "staff", "admin"].includes(role)) {
      updates.push("role = ?");
      params.push(role);
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "Không có thông tin cần cập nhật" });
    }

    params.push(id);
    await pool.query(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);

    return res.json({ success: true, message: "Cập nhật trạng thái người dùng thành công" });
  } catch (error) {
    console.error("Update user status error:", error);
    return res.status(500).json({ success: false, message: "Lỗi cập nhật người dùng", error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  updateUserStatus,
};
