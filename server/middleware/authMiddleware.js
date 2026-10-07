const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.warn("[Security] CẢNH BÁO: JWT_SECRET chưa được cấu hình trong .env!");
}

const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Yêu cầu đăng nhập để truy cập" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const [rows] = await pool.query(
      "SELECT id, full_name, email, phone, role, is_active FROM users WHERE id = ? LIMIT 1",
      [decoded.id]
    );

    if (rows.length === 0 || rows[0].is_active === 0) {
      return res.status(401).json({ success: false, message: "Tài khoản không tồn tại hoặc đã bị khóa" });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn" });
  }
};

const requireAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "staff")) {
    return res.status(403).json({ success: false, message: "Bạn không có quyền truy cập khu vực quản trị" });
  }
  next();
};

module.exports = {
  verifyToken,
  requireAdmin,
  JWT_SECRET,
};
