-- ==============================================================================
-- NINETY EIGHT STUDIO - MYSQL DATABASE SCHEMA (CHUẨN SHOPEE)
-- Thiết kế tinh gọn, chuẩn UTF-8 Tiếng Việt, tối ưu Biến thể & Kho tồn
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `ninetyeight_studio`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `ninetyeight_studio`;

-- Tắt kiểm tra khóa ngoại tạm thời khi tạo bảng
SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------------------------
-- 1. BẢNG DANH MỤC SẢN PHẨM (Categories)
-- Phân loại: TOTE BAG, SHOULDER BAG, TRAVEL BAG, ACCESSORIES...
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL COMMENT 'Tên danh mục: TOTE BAG, SHOULDER BAG...',
  `slug` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Đường dẫn SEO: tote-bag, shoulder-bag...',
  `description` TEXT NULL COMMENT 'Mô tả danh mục',
  `display_order` INT NOT NULL DEFAULT 0 COMMENT 'Thứ tự hiển thị trên menu',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1: Hoạt động, 0: Tạm ẩn',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_categories_slug` (`slug`),
  INDEX `idx_categories_active` (`is_active`, `display_order`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Danh mục sản phẩm';

-- ------------------------------------------------------------------------------
-- 2. BẢNG SẢN PHẨM GỐC (Products - Thông tin cơ bản kiểu Shopee)
-- Chứa thông tin chung: Tên túi, mô tả, kích thước, ảnh bìa, chất liệu
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT UNSIGNED NOT NULL COMMENT 'Danh mục thuộc về',
  `name` VARCHAR(255) NOT NULL COMMENT 'Tên sản phẩm gốc, VD: Zuni Bag',
  `slug` VARCHAR(255) NOT NULL UNIQUE COMMENT 'Đường dẫn SEO, VD: zuni-bag',
  `product_code` VARCHAR(50) NULL COMMENT 'Mã dòng túi nội bộ, VD: NES-ZUNI',
  `description` TEXT NULL COMMENT 'Mô tả chung của sản phẩm',
  `highlights` JSON NULL COMMENT 'Các điểm nổi bật dạng danh sách JSON: ["Dây đeo tùy chỉnh", "Khóa kéo kim loại"]',
  `dimensions` VARCHAR(255) NULL COMMENT 'Kích thước: 30 x 20 x 8 cm, trọng lượng...',
  `material` VARCHAR(150) NULL COMMENT 'Chất liệu: Da PU cao cấp, Canvas, Vải dù chống nước...',
  `care_instructions` TEXT NULL COMMENT 'Hướng dẫn bảo quản',
  `shipping_policy` TEXT NULL COMMENT 'Chính sách vận chuyển & bảo hành',
  `base_price` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Giá gốc tham khảo hiển thị',
  `cover_image` VARCHAR(255) NOT NULL COMMENT 'Ảnh bìa đại diện sản phẩm',
  `hover_image` VARCHAR(255) NULL COMMENT 'Ảnh hiển thị khi hover chuột',
  `gallery_images` JSON NULL COMMENT 'Mảng JSON chứa link ảnh slide: ["/img1.jpg", "/img2.jpg"]',
  `is_new_arrival` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1: Đánh dấu Sản phẩm mới',
  `is_best_seller` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1: Đánh dấu Bán chạy nhất',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1: Đang bán, 0: Tạm ẩn',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `categories`(`id`) ON UPDATE CASCADE,
  INDEX `idx_products_slug` (`slug`),
  INDEX `idx_products_category` (`category_id`),
  INDEX `idx_products_status` (`is_active`, `is_new_arrival`, `is_best_seller`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sản phẩm gốc (Thông tin chung)';

-- ------------------------------------------------------------------------------
-- 3. BẢNG PHÂN LOẠI HÀNG (Product Variants - Chuẩn bảng Ma trận SKU của Shopee)
-- Mỗi dòng là một MÀU SẮC cụ thể: Có Giá bán riêng, Kho tồn riêng, SKU riêng
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `product_variants`;
CREATE TABLE `product_variants` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT 'Sản phẩm gốc sở hữu',
  `color_name` VARCHAR(100) NOT NULL COMMENT 'Tên màu sắc: Black, Gray, Mustard, Camo...',
  `color_code` VARCHAR(20) NULL COMMENT 'Mã màu Hex: #000000, #808080 (để render chấm màu trên UI)',
  `sku` VARCHAR(100) NOT NULL UNIQUE COMMENT 'Mã định danh SKU phân loại: NES-ZUNI-BLK',
  `barcode` VARCHAR(100) NULL COMMENT 'Mã vạch (nếu có)',
  `image` VARCHAR(255) NOT NULL COMMENT 'Ảnh thumbnail swatch đại diện riêng cho màu này',
  `price` DECIMAL(15,2) NOT NULL COMMENT 'Giá bán lẻ của màu này',
  `original_price` DECIMAL(15,2) NULL COMMENT 'Giá gốc trước giảm (để gạch ngang giá cũ)',
  `stock` INT NOT NULL DEFAULT 0 COMMENT 'Kho hàng: Số lượng tồn thực tế đang có',
  `reserved_stock` INT NOT NULL DEFAULT 0 COMMENT 'Số lượng đang giữ chỗ cho các đơn hàng chưa hoàn tất',
  `weight_gram` INT UNSIGNED NOT NULL DEFAULT 500 COMMENT 'Khối lượng tính phí vận chuyển (gram)',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '1: Đang kinh doanh màu này, 0: Ngừng kinh doanh',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_variants_product` (`product_id`),
  INDEX `idx_variants_sku` (`sku`),
  INDEX `idx_variants_stock` (`stock`, `reserved_stock`),
  -- Ràng buộc: Kho hàng và hàng giữ chỗ không được là số âm
  CONSTRAINT `chk_variants_stock_valid` CHECK (`stock` >= 0 AND `reserved_stock` >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Phân loại hàng / Biến thể màu sắc & Kho tồn';

-- ------------------------------------------------------------------------------
-- 4. BẢNG NGƯỜI DÙNG & TÀI KHOẢN (Users)
-- Khách hàng, thành viên Ninety Eight Club, quản trị viên
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `full_name` VARCHAR(150) NOT NULL COMMENT 'Họ và tên',
  `email` VARCHAR(150) NOT NULL UNIQUE COMMENT 'Email đăng nhập',
  `phone` VARCHAR(30) NULL COMMENT 'Số điện thoại',
  `password_hash` VARCHAR(255) NOT NULL COMMENT 'Mật khẩu mã hóa bcrypt',
  `role` ENUM('customer', 'admin', 'staff') NOT NULL DEFAULT 'customer' COMMENT 'Vai trò người dùng',
  `avatar_url` VARCHAR(255) NULL COMMENT 'Ảnh đại diện',
  `gender` ENUM('Nam', 'Nữ', 'Khác') NULL,
  `birthday` DATE NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_users_email` (`email`),
  INDEX `idx_users_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Người dùng và khách hàng';

-- ------------------------------------------------------------------------------
-- 5. BẢNG SỔ ĐỊA CHỈ (User Addresses)
-- Lưu nhiều địa chỉ nhận hàng của khách
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `user_addresses`;
CREATE TABLE `user_addresses` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` BIGINT UNSIGNED NOT NULL,
  `recipient_name` VARCHAR(150) NOT NULL COMMENT 'Tên người nhận',
  `phone` VARCHAR(30) NOT NULL COMMENT 'SĐT người nhận',
  `province` VARCHAR(100) NOT NULL COMMENT 'Tỉnh / Thành phố',
  `district` VARCHAR(100) NOT NULL COMMENT 'Quận / Huyện',
  `ward` VARCHAR(100) NULL COMMENT 'Phường / Xã',
  `street_address` VARCHAR(255) NOT NULL COMMENT 'Số nhà, tên đường, tòa nhà',
  `is_default` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '1: Địa chỉ mặc định',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Sổ địa chỉ người nhận';

-- ------------------------------------------------------------------------------
-- 6. BẢNG MÃ GIẢM GIÁ (Coupons / Vouchers)
-- Mã NINETYEIGHT10, FREESHIP...
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã giảm giá viết hoa: NINETYEIGHT10, FREESHIP',
  `description` VARCHAR(255) NULL,
  `type` ENUM('percent', 'fixed_amount', 'freeship') NOT NULL DEFAULT 'percent' COMMENT 'Loại giảm giá',
  `value` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Giá trị: 10 (%) hoặc 50000 (VND)',
  `min_order_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Giá trị đơn tối thiểu để áp dụng',
  `max_discount_amount` DECIMAL(15,2) NULL COMMENT 'Mức giảm tối đa (nếu giảm theo %)',
  `usage_limit` INT UNSIGNED NULL COMMENT 'Số lần tối đa được dùng (NULL: không giới hạn)',
  `used_count` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'Số lần đã được dùng',
  `start_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_date` DATETIME NULL COMMENT 'Ngày hết hạn',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_coupons_code` (`code`, `is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Mã ưu đãi / Voucher';

-- ------------------------------------------------------------------------------
-- 7. BẢNG ĐƠN HÀNG (Orders - Khớp 100% UI Checkout vừa làm)
-- Quản lý đơn hàng, thông tin giao nhận, VietQR / COD
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_code` VARCHAR(50) NOT NULL UNIQUE COMMENT 'Mã đơn dạng #NES-88291',
  `user_id` BIGINT UNSIGNED NULL COMMENT 'Khách đã đăng nhập (NULL nếu mua dạng vãng lai)',
  `customer_name` VARCHAR(150) NOT NULL COMMENT 'Họ tên người nhận',
  `customer_phone` VARCHAR(30) NOT NULL COMMENT 'SĐT người nhận',
  `customer_email` VARCHAR(150) NOT NULL COMMENT 'Email nhận thông báo',
  `shipping_province` VARCHAR(100) NOT NULL COMMENT 'Tỉnh/Thành',
  `shipping_district` VARCHAR(100) NOT NULL COMMENT 'Quận/Huyện',
  `shipping_ward` VARCHAR(100) NULL COMMENT 'Phường/Xã',
  `shipping_address` VARCHAR(255) NOT NULL COMMENT 'Số nhà, tên đường',
  `order_notes` TEXT NULL COMMENT 'Ghi chú cho shipper',
  `subtotal` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Tiền hàng tạm tính',
  `shipping_fee` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Phí giao hàng',
  `discount_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Số tiền giảm giá',
  `total_amount` DECIMAL(15,2) NOT NULL DEFAULT 0.00 COMMENT 'Tổng thanh toán cuối cùng',
  `coupon_code` VARCHAR(50) NULL COMMENT 'Mã voucher đã áp dụng',
  `shipping_method` ENUM('standard', 'express') NOT NULL DEFAULT 'standard' COMMENT 'standard (Tiêu chuẩn), express (Hỏa tốc)',
  `payment_method` ENUM('vietqr', 'cod', 'card') NOT NULL DEFAULT 'vietqr' COMMENT 'vietqr (Chuyển khoản QR), cod (Thu tiền tận nơi)',
  `payment_status` ENUM('unpaid', 'paid', 'partially_refunded', 'refunded') NOT NULL DEFAULT 'unpaid' COMMENT 'Trạng thái thanh toán',
  `order_status` ENUM('pending', 'confirmed', 'processing', 'shipping', 'completed', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT 'Trạng thái xử lý đơn hàng',
  `paid_at` DATETIME NULL COMMENT 'Thời gian thanh toán thành công',
  `cancelled_at` DATETIME NULL COMMENT 'Thời gian hủy đơn',
  `cancel_reason` VARCHAR(255) NULL COMMENT 'Lý do hủy đơn',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
  INDEX `idx_orders_code` (`order_code`),
  INDEX `idx_orders_user` (`user_id`),
  INDEX `idx_orders_phone` (`customer_phone`),
  INDEX `idx_orders_status` (`order_status`, `payment_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Đơn đặt hàng';

-- ------------------------------------------------------------------------------
-- 8. BẢNG CHI TIẾT ĐƠN HÀNG (Order Items)
-- Lưu snapshot tên túi, màu sắc, đơn giá tại thời điểm mua (không sợ sau này đổi giá)
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `order_id` BIGINT UNSIGNED NOT NULL,
  `product_id` BIGINT UNSIGNED NOT NULL,
  `variant_id` BIGINT UNSIGNED NOT NULL,
  `product_name` VARCHAR(255) NOT NULL COMMENT 'Tên túi snapshot: Zuni Bag',
  `color_name` VARCHAR(100) NOT NULL COMMENT 'Tên màu sắc: Black, Gray...',
  `sku` VARCHAR(100) NOT NULL COMMENT 'Mã SKU phân loại snapshot: NES-ZUNI-BLK',
  `image` VARCHAR(255) NOT NULL COMMENT 'Ảnh thumbnail sản phẩm lúc mua',
  `unit_price` DECIMAL(15,2) NOT NULL COMMENT 'Đơn giá tại thời điểm đặt hàng',
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT 'Số lượng đặt mua',
  `total_price` DECIMAL(15,2) NOT NULL COMMENT 'Thành tiền = unit_price * quantity',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`product_id`) REFERENCES `products`(`id`),
  FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`),
  INDEX `idx_order_items_order` (`order_id`),
  INDEX `idx_order_items_variant` (`variant_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Chi tiết từng món trong đơn hàng';

-- ------------------------------------------------------------------------------
-- 9. BẢNG NHẬT KÝ BIẾN ĐỘNG KHO (Inventory Logs)
-- Theo dõi vết: Ai nhập kho, đơn hàng nào giữ kho, hoàn kho
-- ------------------------------------------------------------------------------
DROP TABLE IF EXISTS `inventory_logs`;
CREATE TABLE `inventory_logs` (
  `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `variant_id` BIGINT UNSIGNED NOT NULL,
  `action` ENUM('import', 'export', 'order_reserve', 'order_fulfill', 'order_cancel', 'adjustment') NOT NULL COMMENT 'Hành động kho',
  `quantity_change` INT NOT NULL COMMENT 'Số lượng biến động: Dương (+) hoặc Âm (-)',
  `stock_after` INT NOT NULL COMMENT 'Tồn thực tế sau khi đổi',
  `reserved_after` INT NOT NULL COMMENT 'Hàng giữ chỗ sau khi đổi',
  `reference_code` VARCHAR(50) NULL COMMENT 'Mã đơn hàng liên quan (VD: #NES-88291)',
  `note` VARCHAR(255) NULL COMMENT 'Ghi chú lý do',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`variant_id`) REFERENCES `product_variants`(`id`) ON DELETE CASCADE,
  INDEX `idx_inv_logs_variant` (`variant_id`),
  INDEX `idx_inv_logs_action` (`action`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Nhật ký lịch sử biến động kho';

-- ------------------------------------------------------------------------------
-- 10. VIEW TIỆN ÍCH: TÍNH TỒN KHO KHẢ DỤNG CHO BÁN HÀNG
-- (Tồn khả dụng = Kho hàng - Hàng đang giữ)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW `v_available_variants` AS
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
  CASE 
    WHEN (v.stock - v.reserved_stock) > 0 THEN 1 
    ELSE 0 
  END AS is_in_stock
FROM `product_variants` v
JOIN `products` p ON v.product_id = p.id
WHERE v.is_active = 1 AND p.is_active = 1;

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;
