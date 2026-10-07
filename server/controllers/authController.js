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
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Mật khẩu không chính xác" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "365d" }
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

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ success: false, message: "Vui lòng nhập đầy đủ họ tên, email và mật khẩu" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone ? phone.trim() : "";

    // Check duplicate email or phone
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ? OR (phone != '' AND phone = ?) LIMIT 1",
      [cleanEmail, cleanPhone]
    );

    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: "Email hoặc số điện thoại này đã được sử dụng" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      "INSERT INTO users (full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, 'customer')",
      [full_name.trim(), cleanEmail, cleanPhone, password_hash]
    );

    const newUserId = result.insertId;
    const token = jwt.sign(
      { id: newUserId, email: cleanEmail, role: "customer" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      success: true,
      message: "Đăng ký tài khoản thành công!",
      token,
      user: {
        id: newUserId,
        full_name: full_name.trim(),
        email: cleanEmail,
        phone: cleanPhone,
        role: "customer",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Lỗi hệ thống khi đăng ký", error: error.message });
  }
};

// GET /api/auth/profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const [users] = await pool.query(
      "SELECT id, full_name, email, phone, role, avatar_url, gender, birthday, created_at FROM users WHERE id = ? LIMIT 1",
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy thông tin tài khoản" });
    }

    const user = users[0];

    // Get default address
    const [addresses] = await pool.query(
      "SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC LIMIT 1",
      [userId]
    );

    return res.json({
      success: true,
      data: {
        ...user,
        address: addresses.length > 0 ? addresses[0] : null,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ success: false, message: "Lỗi lấy thông tin hồ sơ", error: error.message });
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      full_name,
      phone,
      gender,
      birthday,
      street_address,
      province,
      district,
      ward,
    } = req.body;

    if (!full_name) {
      return res.status(400).json({ success: false, message: "Họ và tên không được để trống" });
    }

    // Format birthday to YYYY-MM-DD or null
    let validBirthday = null;
    if (birthday && !isNaN(new Date(birthday).getTime())) {
      validBirthday = new Date(birthday).toISOString().slice(0, 10);
    }

    await pool.query(
      "UPDATE users SET full_name = ?, phone = ?, gender = ?, birthday = ? WHERE id = ?",
      [full_name.trim(), phone || null, gender || null, validBirthday, userId]
    );

    // Update or insert default address if provided
    if (street_address || province || district) {
      const [existingAddr] = await pool.query(
        "SELECT id FROM user_addresses WHERE user_id = ? LIMIT 1",
        [userId]
      );

      if (existingAddr.length > 0) {
        await pool.query(
          `UPDATE user_addresses 
           SET recipient_name = ?, phone = ?, province = ?, district = ?, ward = ?, street_address = ?, is_default = 1 
           WHERE id = ?`,
          [
            full_name.trim(),
            phone || "",
            province || "",
            district || "",
            ward || "",
            street_address || "",
            existingAddr[0].id,
          ]
        );
      } else {
        await pool.query(
          `INSERT INTO user_addresses 
            (user_id, recipient_name, phone, province, district, ward, street_address, is_default) 
           VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            userId,
            full_name.trim(),
            phone || "",
            province || "",
            district || "",
            ward || "",
            street_address || "",
          ]
        );
      }
    }

    return res.json({
      success: true,
      message: "Cập nhật thông tin tài khoản thành công!",
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ success: false, message: "Lỗi cập nhật hồ sơ", error: error.message });
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
  register,
  getProfile,
  updateProfile,
  getMe,
};
