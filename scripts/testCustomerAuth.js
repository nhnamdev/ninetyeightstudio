require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('../server/routes/authRoutes');
const orderRoutes = require('../server/routes/orderRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);

const TEST_PORT = 5001;
const server = app.listen(TEST_PORT, async () => {
  const API_BASE = `http://localhost:${TEST_PORT}/api`;
  console.log('--- BẮT ĐẦU KIỂM TRA TOÀN DIỆN API KHÁCH HÀNG & VPS MYSQL TRÊN PORT 5001 ---');

  try {
    // 1. Test Login with demo account
    console.log('1. Kiểm tra POST /api/auth/login...');
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nam.nguyen@ninetyeight.vn',
        password: 'Admin123@',
      }),
    });
    const loginJson = await loginRes.json();
    if (!loginJson.success || !loginJson.token) {
      throw new Error(`Đăng nhập thất bại: ${JSON.stringify(loginJson)}`);
    }
    console.log('✓ Đăng nhập thành công! Khách hàng:', loginJson.user.full_name, '| ID:', loginJson.user.id);
    const token = loginJson.token;

    // 2. Test Get Profile
    console.log('2. Kiểm tra GET /api/auth/profile...');
    const profileRes = await fetch(`${API_BASE}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const profileJson = await profileRes.json();
    if (!profileJson.success || !profileJson.data) {
      throw new Error(`Lấy hồ sơ thất bại: ${JSON.stringify(profileJson)}`);
    }
    console.log('✓ Lấy thông tin hồ sơ thành công:', profileJson.data.full_name, '| Email:', profileJson.data.email, '| SĐT:', profileJson.data.phone);

    // 3. Test Update Profile
    console.log('3. Kiểm tra PUT /api/auth/profile...');
    const updateRes = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        full_name: 'Nguyễn Văn Nam',
        phone: '0378026461',
        gender: 'Nam',
        birthday: '1998-09-08',
        street_address: 'Số 98 Đường Nguyễn Huệ',
        province: 'TP. Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé',
      }),
    });
    const updateJson = await updateRes.json();
    if (!updateJson.success) {
      throw new Error(`Cập nhật hồ sơ thất bại: ${JSON.stringify(updateJson)}`);
    }
    console.log('✓ Cập nhật hồ sơ thành công vào CSDL VPS MySQL:', updateJson.message);

    // 4. Test Customer Orders
    console.log('4. Kiểm tra GET /api/orders/my-orders...');
    const myOrdersRes = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const myOrdersJson = await myOrdersRes.json();
    if (!myOrdersJson.success) {
      throw new Error(`Lấy danh sách đơn hàng thất bại: ${JSON.stringify(myOrdersJson)}`);
    }
    console.log(`✓ Lấy danh sách đơn hàng thành công từ bảng orders VPS: ${myOrdersJson.data.length} đơn hàng.`);

    // 5. Test Register
    console.log('5. Kiểm tra POST /api/auth/register...');
    const testEmail = `testuser_${Date.now()}@ninetyeight.vn`;
    const registerRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: 'Khách Hàng Thử Nghiệm',
        email: testEmail,
        phone: '09' + Math.floor(10000000 + Math.random() * 90000000),
        password: 'Password123@',
      }),
    });
    const registerJson = await registerRes.json();
    if (!registerJson.success || !registerJson.token) {
      throw new Error(`Đăng ký thất bại: ${JSON.stringify(registerJson)}`);
    }
    console.log('✓ Đăng ký tài khoản mới thành công! User ID:', registerJson.user.id, '| Email:', registerJson.user.email);

    const pool = require('../server/config/db');
    await pool.query('DELETE FROM users WHERE email LIKE "testuser_%"');

    console.log('\n=================================================');
    console.log('🎉 TẤT CẢ 5 API KHÁCH HÀNG ĐÃ HOẠT ĐỘNG CHUẨN XÁC 100%!');
    console.log('=================================================');
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('Lỗi kiểm tra:', err.message);
    server.close();
    process.exit(1);
  }
});
