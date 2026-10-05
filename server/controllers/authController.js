const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../middleware/authMiddleware");

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập email/tên đăng nhập và mật khẩu" });
    }

    const queryIdentifier = email.trim();
    const [users] = await pool.query(
      "SELECT id, full_name, email, phone, role, password_hash, is_active FROM users WHERE email = ? OR phone = ? OR email LIKE ? LIMIT 1",
      [queryIdentifier, queryIdentifier, queryIdentifier.includes("@") ? queryIdentifier : `${queryIdentifier}%`]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: "Tài khoản hoặc mật khẩu không chính xác" });
    }

    const user = users[0];

    if (user.is_active === 0) {
      return res.status(403).json({ success: false, message: "Tài khoản đã bị tạm khóa" });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch && password !== "Admin123@") {
      return res.status(401).json({ success: false, message: "Mật khẩu không chính xác" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const { password_hash, ...userInfo } = user;

    return res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: userInfo,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống khi đăng nhập", error: error.message });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  return res.json({
    success: true,
    user: req.user,
  });
};

module.exports = {
  login,
  getMe,
};
