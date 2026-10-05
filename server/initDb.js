const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function initDatabase() {
  console.log("Starting database initialization on VPS MySQL...");

  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  const connection = await pool.getConnection();

  try {
    console.log("Disabling foreign key checks...");
    await connection.query("SET FOREIGN_KEY_CHECKS = 0;");

    // 1. Categories
    console.log("Creating categories table...");
    await connection.query(`
      DROP TABLE IF EXISTS categories;
      CREATE TABLE categories (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        slug VARCHAR(100) NOT NULL UNIQUE,
        description TEXT NULL,
        display_order INT NOT NULL DEFAULT 0,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_categories_slug (slug),
        INDEX idx_categories_active (is_active, display_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Products
    console.log("Creating products table...");
    await connection.query(`
      DROP TABLE IF EXISTS products;
      CREATE TABLE products (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        category_id INT UNSIGNED NOT NULL,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        product_code VARCHAR(50) NULL,
        description TEXT NULL,
        highlights JSON NULL,
        dimensions VARCHAR(255) NULL,
        material VARCHAR(150) NULL,
        care_instructions TEXT NULL,
        shipping_policy TEXT NULL,
        base_price DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        cover_image VARCHAR(255) NOT NULL,
        hover_image VARCHAR(255) NULL,
        gallery_images JSON NULL,
        is_new_arrival TINYINT(1) NOT NULL DEFAULT 0,
        is_best_seller TINYINT(1) NOT NULL DEFAULT 0,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON UPDATE CASCADE,
        INDEX idx_products_slug (slug),
        INDEX idx_products_category (category_id),
        INDEX idx_products_status (is_active, is_new_arrival, is_best_seller)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Product Variants (Shopee style SKU & Stock)
    console.log("Creating product_variants table...");
    await connection.query(`
      DROP TABLE IF EXISTS product_variants;
      CREATE TABLE product_variants (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        product_id BIGINT UNSIGNED NOT NULL,
        color_name VARCHAR(100) NOT NULL,
        color_code VARCHAR(20) NULL,
        sku VARCHAR(100) NOT NULL UNIQUE,
        barcode VARCHAR(100) NULL,
        image VARCHAR(255) NOT NULL,
        price DECIMAL(15,2) NOT NULL,
        original_price DECIMAL(15,2) NULL,
        stock INT NOT NULL DEFAULT 0,
        reserved_stock INT NOT NULL DEFAULT 0,
        weight_gram INT UNSIGNED NOT NULL DEFAULT 500,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
        INDEX idx_variants_product (product_id),
        INDEX idx_variants_sku (sku),
        INDEX idx_variants_stock (stock, reserved_stock),
        CONSTRAINT chk_variants_stock_valid CHECK (stock >= 0 AND reserved_stock >= 0)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Users
    console.log("Creating users table...");
    await connection.query(`
      DROP TABLE IF EXISTS users;
      CREATE TABLE users (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(150) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        phone VARCHAR(30) NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('customer', 'admin', 'staff') NOT NULL DEFAULT 'customer',
        avatar_url VARCHAR(255) NULL,
        gender ENUM('Nam', 'Nữ', 'Khác') NULL,
        birthday DATE NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_users_email (email),
        INDEX idx_users_phone (phone)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. User Addresses
    console.log("Creating user_addresses table...");
    await connection.query(`
      DROP TABLE IF EXISTS user_addresses;
      CREATE TABLE user_addresses (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_id BIGINT UNSIGNED NOT NULL,
        recipient_name VARCHAR(150) NOT NULL,
        phone VARCHAR(30) NOT NULL,
        province VARCHAR(100) NOT NULL,
        district VARCHAR(100) NOT NULL,
        ward VARCHAR(100) NULL,
        street_address VARCHAR(255) NOT NULL,
        is_default TINYINT(1) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Coupons
    console.log("Creating coupons table...");
    await connection.query(`
      DROP TABLE IF EXISTS coupons;
      CREATE TABLE coupons (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255) NULL,
        type ENUM('percent', 'fixed_amount', 'freeship') NOT NULL DEFAULT 'percent',
        value DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        min_order_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        max_discount_amount DECIMAL(15,2) NULL,
        usage_limit INT UNSIGNED NULL,
        used_count INT UNSIGNED NOT NULL DEFAULT 0,
        start_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        end_date DATETIME NULL,
        is_active TINYINT(1) NOT NULL DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_coupons_code (code, is_active)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Orders
    console.log("Creating orders table...");
    await connection.query(`
      DROP TABLE IF EXISTS orders;
      CREATE TABLE orders (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_code VARCHAR(50) NOT NULL UNIQUE,
        user_id BIGINT UNSIGNED NULL,
        customer_name VARCHAR(150) NOT NULL,
        customer_phone VARCHAR(30) NOT NULL,
        customer_email VARCHAR(150) NOT NULL,
        shipping_province VARCHAR(100) NOT NULL,
        shipping_district VARCHAR(100) NOT NULL,
        shipping_ward VARCHAR(100) NULL,
        shipping_address VARCHAR(255) NOT NULL,
        order_notes TEXT NULL,
        subtotal DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        shipping_fee DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        total_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        coupon_code VARCHAR(50) NULL,
        shipping_method ENUM('standard', 'express') NOT NULL DEFAULT 'standard',
        payment_method ENUM('vietqr', 'cod', 'card') NOT NULL DEFAULT 'vietqr',
        payment_status ENUM('unpaid', 'paid', 'partially_refunded', 'refunded') NOT NULL DEFAULT 'unpaid',
        order_status ENUM('pending', 'confirmed', 'processing', 'shipping', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        paid_at DATETIME NULL,
        cancelled_at DATETIME NULL,
        cancel_reason VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
        INDEX idx_orders_code (order_code),
        INDEX idx_orders_user (user_id),
        INDEX idx_orders_phone (customer_phone),
        INDEX idx_orders_status (order_status, payment_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 8. Order Items
    console.log("Creating order_items table...");
    await connection.query(`
      DROP TABLE IF EXISTS order_items;
      CREATE TABLE order_items (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        order_id BIGINT UNSIGNED NOT NULL,
        product_id BIGINT UNSIGNED NOT NULL,
        variant_id BIGINT UNSIGNED NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        color_name VARCHAR(100) NOT NULL,
        sku VARCHAR(100) NOT NULL,
        image VARCHAR(255) NOT NULL,
        unit_price DECIMAL(15,2) NOT NULL,
        quantity INT UNSIGNED NOT NULL DEFAULT 1,
        total_price DECIMAL(15,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id),
        FOREIGN KEY (variant_id) REFERENCES product_variants(id),
        INDEX idx_order_items_order (order_id),
        INDEX idx_order_items_variant (variant_id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 9. Inventory Logs
    console.log("Creating inventory_logs table...");
    await connection.query(`
      DROP TABLE IF EXISTS inventory_logs;
      CREATE TABLE inventory_logs (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        variant_id BIGINT UNSIGNED NOT NULL,
        action ENUM('import', 'export', 'order_reserve', 'order_fulfill', 'order_cancel', 'adjustment') NOT NULL,
        quantity_change INT NOT NULL,
        stock_after INT NOT NULL,
        reserved_after INT NOT NULL,
        reference_code VARCHAR(50) NULL,
        note VARCHAR(255) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
        INDEX idx_inv_logs_variant (variant_id),
        INDEX idx_inv_logs_action (action)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 10. View
    console.log("Creating view v_available_variants...");
    await connection.query(`
      CREATE OR REPLACE VIEW v_available_variants AS
      SELECT 
        v.id AS variant_id,
        v.product_id,
        p.name AS product_name,
        p.slug AS product_slug,
        v.color_name,
        v.color_code,
        v.sku,
        v.image,
        v.price,
        v.original_price,
        v.stock,
        v.reserved_stock,
        (v.stock - v.reserved_stock) AS available_stock,
        CASE WHEN (v.stock - v.reserved_stock) > 0 THEN 1 ELSE 0 END AS is_in_stock
      FROM product_variants v
      JOIN products p ON v.product_id = p.id
      WHERE v.is_active = 1 AND p.is_active = 1;
    `);

    await connection.query("SET FOREIGN_KEY_CHECKS = 1;");

    // ================= SEED DATA =================
    console.log("Inserting seed categories...");
    await connection.query(`
      INSERT INTO categories (id, name, slug, description, display_order) VALUES
      (1, 'TOTE BAG', 'tote-bag', 'Các mẫu túi Tote tiện dụng, sức chứa lớn cho công việc và dạo phố', 1),
      (2, 'SHOULDER BAG', 'shoulder-bag', 'Túi đeo vai thanh lịch, kiểu dáng công thái học hiện đại', 2),
      (3, 'TRAVEL BAG', 'travel-bag', 'Túi du lịch thể thao, phong cách cá tính với chất liệu bền bỉ', 3),
      (4, 'ACCESSORIES', 'accessories', 'Phụ kiện charm, quai đeo và ví cầm tay', 4);
    `);

    console.log("Inserting seed products...");
    await connection.query(`
      INSERT INTO products (
        id, category_id, name, slug, product_code, description, 
        dimensions, material, base_price, cover_image, hover_image, 
        is_new_arrival, is_best_seller, highlights
      ) VALUES
      (
        1, 2, 'Zuni Bag', 'zuni-bag', 'NES-ZUNI',
        'Mẫu túi đeo vai biểu tượng với thiết kế hình thang thanh lịch, điểm nhấn khóa kim loại sáng bóng và quai đeo công thái học tạo cảm giác êm ái.',
        'Size: 31 x 21 x 8 cm | Quai đeo: 28 cm | Trọng lượng: 450g',
        'Da PU thuần chay cao cấp bóng mờ, lót nhung chống trầy',
        2450000.00,
        '/images/products/zuni-bag/thumb-1.png',
        '/images/products/zuni-bag/thumb-2.jpg',
        1, 1,
        '["Thiết kế hình thang công thái học", "Khóa kéo trượt êm ái", "Ngăn phụ tiện lợi đựng điện thoại", "Chống thấm nước nhẹ"]'
      ),
      (
        2, 1, 'Yacht Tote', 'yacht-tote', 'NES-YACHT',
        'Túi Tote dáng chữ nhật với họa tiết Camo độc quyền, sức chứa khủng có thể để vừa laptop 15 inch và nhiều đồ dùng cá nhân.',
        'Size: 38 x 30 x 12 cm | Quai xách: 30 cm | Trọng lượng: 520g',
        'Vải Canvas dệt mật độ cao kết hợp da tổng hợp viền đáy',
        950000.00,
        '/images/products/yacht-tote-camo.webp',
        '/images/products/yacht-tote-camo.webp',
        0, 1,
        '["Đựng vừa laptop 15.6 inch", "Đáy gia cố da chịu lực", "Họa tiết Camo phủ nano chống bám bụi"]'
      ),
      (
        3, 3, 'Sporty Travel Bag', 'sporty-travel-bag', 'NES-TRAVEL',
        'Túi du lịch ngắn ngày phong cách streetwear thể thao, có ngăn riêng biệt đựng giày và quần áo bẩn.',
        'Size: 45 x 26 x 22 cm | Dung tích: 28 Lít | Trọng lượng: 680g',
        'Polyester 900D Oxford kháng nước tuyệt đối',
        1170000.00,
        '/images/products/sporty-travel-bag-camo.webp',
        '/images/products/sporty-travel-bag-camo.webp',
        0, 1,
        '["Ngăn để giày thông gió riêng biệt", "Dây đeo vai có đệm mút tổ ong", "Có đai gắn vào cần kéo vali"]'
      ),
      (
        4, 1, 'League V2 Tote Bag', 'league-v2-tote', 'NES-LEAGUE',
        'Phiên bản nâng cấp V2 với bảng màu trung tính thời thượng, tối giản mọi chi tiết thừa để tôn lên vóc dáng người mang.',
        'Size: 35 x 28 x 10 cm | Trọng lượng: 390g',
        'Vải Kaki dệt trơn dẻo dai',
        790000.00,
        '/images/products/league-v2-tote-sand.webp',
        '/images/products/league-v2-tote-sand.webp',
        1, 0,
        '["Trọng lượng siêu nhẹ", "Miệng túi gắn cúc bấm nam châm", "Có ngăn zip nhỏ an toàn bên trong"]'
      ),
      (
        5, 1, 'Goodbye My Work Tote Bag', 'good-bye-my-work-tote', 'NES-GBMW',
        'Chiếc túi canvas thông điệp dí dỏm giải phóng tinh thần sau giờ làm việc, thích hợp mang đi chơi cuối tuần và cà phê cùng bạn bè.',
        'Size: 36 x 34 cm | Trọng lượng: 200g',
        'Canvas mộc tự nhiên thân thiện môi trường',
        200000.00,
        '/images/products/good-bye-my-work-tote-red.webp',
        '/images/products/good-bye-my-work-tote-blue.webp',
        0, 0,
        '["Chất vải canvas mộc mạc", "Hình in sắc nét không bong tróc", "Dễ dàng giặt ủi và gấp gọn"]'
      );
    `);

    console.log("Inserting seed product variants (Shopee style)...");
    await connection.query(`
      INSERT INTO product_variants (
        id, product_id, color_name, color_code, sku, image, 
        price, original_price, stock, reserved_stock
      ) VALUES
      (1, 1, 'Black', '#000000', 'NES-ZUNI-BLK', '/images/products/zuni-bag/thumb-1.png', 2450000.00, 2700000.00, 25, 0),
      (2, 1, 'Gray', '#808080', 'NES-ZUNI-GRY', '/images/products/zuni-bag/swatch-gray.png', 2450000.00, 2700000.00, 18, 1),
      (3, 1, 'Mustard', '#E1AD01', 'NES-ZUNI-MUS', '/images/products/zuni-bag/swatch-mustard.png', 2450000.00, 2700000.00, 12, 0),
      (4, 1, 'Olive', '#556B2F', 'NES-ZUNI-OLV', '/images/products/zuni-bag/swatch-olive.png', 2550000.00, 2800000.00, 8, 0),
      (5, 2, 'Camo', '#78866B', 'NES-YACHT-CAMO', '/images/products/yacht-tote-camo.webp', 950000.00, NULL, 30, 0),
      (6, 3, 'Camo', '#78866B', 'NES-TRAVEL-CAMO', '/images/products/sporty-travel-bag-camo.webp', 1170000.00, 1350000.00, 15, 0),
      (7, 4, 'Sand', '#C2B280', 'NES-LEAGUE-SND', '/images/products/league-v2-tote-sand.webp', 790000.00, NULL, 20, 0),
      (8, 4, 'Deep Blue', '#002366', 'NES-LEAGUE-BLU', '/images/products/league-v2-tote-deep-blue.webp', 790000.00, NULL, 14, 0),
      (9, 4, 'Stone Blue', '#597D9A', 'NES-LEAGUE-STN', '/images/products/league-v2-tote-stone-blue.webp', 790000.00, NULL, 9, 0),
      (10, 4, 'Dust Black', '#1C1C1C', 'NES-LEAGUE-BLK', '/images/products/league-v2-tote-dust-black.webp', 790000.00, NULL, 0, 0),
      (11, 5, 'Red', '#C8102E', 'NES-GBMW-RED', '/images/products/good-bye-my-work-tote-red.webp', 200000.00, NULL, 40, 0),
      (12, 5, 'Blue', '#0047AB', 'NES-GBMW-BLU', '/images/products/good-bye-my-work-tote-blue.webp', 200000.00, NULL, 35, 0);
    `);

    // Create Admin with password Admin123@
    console.log("Creating Admin user with password Admin123@...");
    const adminPasswordHash = bcrypt.hashSync("Admin123@", 10);
    await connection.query(`
      INSERT INTO users (id, full_name, email, phone, password_hash, role) VALUES
      (1, 'Administrator', 'admin@ninetyeight.vn', '0378026461', ?, 'admin'),
      (2, 'Nguyễn Văn Nam', 'nam.nguyen@ninetyeight.vn', '0378026461', ?, 'customer')
      ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role);
    `, [adminPasswordHash, adminPasswordHash]);

    console.log("Inserting coupons and demo orders...");
    await connection.query(`
      INSERT INTO coupons (id, code, description, type, value, min_order_amount, usage_limit, used_count) VALUES
      (1, 'NINETYEIGHT10', 'Giảm 10% tổng giá trị đơn hàng', 'percent', 10.00, 0.00, 1000, 15),
      (2, 'FREESHIP', 'Miễn phí 100% cước phí vận chuyển toàn quốc', 'freeship', 0.00, 0.00, 500, 28);

      INSERT INTO orders (
        id, order_code, user_id, customer_name, customer_phone, customer_email,
        shipping_province, shipping_district, shipping_ward, shipping_address,
        subtotal, shipping_fee, discount_amount, total_amount,
        shipping_method, payment_method, payment_status, order_status
      ) VALUES
      (
        1, '#NES-9042', 2, 'Nguyễn Văn Nam', '0378 026 461', 'nam.nguyen@ninetyeight.vn',
        'TP. Hồ Chí Minh', 'Quận 1', 'Phường Bến Nghé', 'Số 98 Đường Nguyễn Huệ',
        2450000.00, 0.00, 0.00, 2450000.00,
        'standard', 'vietqr', 'paid', 'processing'
      ),
      (
        2, '#NES-8815', 2, 'Nguyễn Văn Nam', '0378 026 461', 'nam.nguyen@ninetyeight.vn',
        'TP. Hồ Chí Minh', 'Quận 3', 'Phường Nhiêu Lộc', '351/44 Lê Văn Sỹ',
        950000.00, 30000.00, 0.00, 980000.00,
        'standard', 'cod', 'unpaid', 'shipping'
      );

      INSERT INTO order_items (
        id, order_id, product_id, variant_id, 
        product_name, color_name, sku, image, unit_price, quantity, total_price
      ) VALUES
      (1, 1, 1, 1, 'Zuni Bag', 'Black', 'NES-ZUNI-BLK', '/images/products/zuni-bag/thumb-1.png', 2450000.00, 1, 2450000.00),
      (2, 2, 2, 5, 'Yacht Tote', 'Camo', 'NES-YACHT-CAMO', '/images/products/yacht-tote-camo.webp', 950000.00, 1, 950000.00);
    `);

    console.log("Database initialized successfully with schema and seed data!");
  } catch (error) {
    console.error("Initialization error:", error);
  } finally {
    connection.release();
    await pool.end();
  }
}

initDatabase();
