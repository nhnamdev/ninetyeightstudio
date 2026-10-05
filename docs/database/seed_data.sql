-- ==============================================================================
-- NINETY EIGHT STUDIO - SEED DATA (DỮ LIỆU MẪU CHUẨN)
-- Import ngay vào MySQL để test Cửa hàng, Biến thể Màu sắc & Kho tồn
-- ==============================================================================

USE `ninetyeight_studio`;

-- Tắt kiểm tra khóa ngoại tạm thời để nạp dữ liệu sạch sẽ
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `inventory_logs`;
TRUNCATE TABLE `order_items`;
TRUNCATE TABLE `orders`;
TRUNCATE TABLE `coupons`;
TRUNCATE TABLE `user_addresses`;
TRUNCATE TABLE `users`;
TRUNCATE TABLE `product_variants`;
TRUNCATE TABLE `products`;
TRUNCATE TABLE `categories`;
SET FOREIGN_KEY_CHECKS = 1;

-- ------------------------------------------------------------------------------
-- 1. NẠP DANH MỤC SẢN PHẨM
-- ------------------------------------------------------------------------------
INSERT INTO `categories` (`id`, `name`, `slug`, `description`, `display_order`) VALUES
(1, 'TOTE BAG', 'tote-bag', 'Các mẫu túi Tote tiện dụng, sức chứa lớn cho công việc và dạo phố', 1),
(2, 'SHOULDER BAG', 'shoulder-bag', 'Túi đeo vai thanh lịch, kiểu dáng công thái học hiện đại', 2),
(3, 'TRAVEL BAG', 'travel-bag', 'Túi du lịch thể thao, phong cách cá tính với chất liệu bền bỉ', 3),
(4, 'ACCESSORIES', 'accessories', 'Phụ kiện charm, quai đeo và ví cầm tay', 4);

-- ------------------------------------------------------------------------------
-- 2. NẠP SẢN PHẨM GỐC (Products - Kiểu Shopee)
-- ------------------------------------------------------------------------------
INSERT INTO `products` (
  `id`, `category_id`, `name`, `slug`, `product_code`, `description`, 
  `dimensions`, `material`, `base_price`, `cover_image`, `hover_image`, 
  `is_new_arrival`, `is_best_seller`, `highlights`
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

-- ------------------------------------------------------------------------------
-- 3. NẠP PHÂN LOẠI HÀNG (Product Variants / Bảng ma trận Shopee)
-- Thiết lập cụ thể từng MÀU SẮC, GIÁ BÁN và KHO TỒN
-- ------------------------------------------------------------------------------
INSERT INTO `product_variants` (
  `id`, `product_id`, `color_name`, `color_code`, `sku`, `image`, 
  `price`, `original_price`, `stock`, `reserved_stock`
) VALUES
-- Dòng Zuni Bag (Có 4 màu)
(1, 1, 'Black', '#000000', 'NES-ZUNI-BLK', '/images/products/zuni-bag/thumb-1.png', 2450000.00, 2700000.00, 25, 0),
(2, 1, 'Gray', '#808080', 'NES-ZUNI-GRY', '/images/products/zuni-bag/swatch-gray.png', 2450000.00, 2700000.00, 18, 1),
(3, 1, 'Mustard', '#E1AD01', 'NES-ZUNI-MUS', '/images/products/zuni-bag/swatch-mustard.png', 2450000.00, 2700000.00, 12, 0),
(4, 1, 'Olive', '#556B2F', 'NES-ZUNI-OLV', '/images/products/zuni-bag/swatch-olive.png', 2550000.00, 2800000.00, 8, 0),

-- Dòng Yacht Tote (1 màu Camo)
(5, 2, 'Camo', '#78866B', 'NES-YACHT-CAMO', '/images/products/yacht-tote-camo.webp', 950000.00, NULL, 30, 0),

-- Dòng Sporty Travel Bag (1 màu Camo)
(6, 3, 'Camo', '#78866B', 'NES-TRAVEL-CAMO', '/images/products/sporty-travel-bag-camo.webp', 1170000.00, 1350000.00, 15, 0),

-- Dòng League V2 Tote Bag (4 màu - Trong đó Dust Black hết hàng)
(7, 4, 'Sand', '#C2B280', 'NES-LEAGUE-SND', '/images/products/league-v2-tote-sand.webp', 790000.00, NULL, 20, 0),
(8, 4, 'Deep Blue', '#002366', 'NES-LEAGUE-BLU', '/images/products/league-v2-tote-deep-blue.webp', 790000.00, NULL, 14, 0),
(9, 4, 'Stone Blue', '#597D9A', 'NES-LEAGUE-STN', '/images/products/league-v2-tote-stone-blue.webp', 790000.00, NULL, 9, 0),
(10, 4, 'Dust Black', '#1C1C1C', 'NES-LEAGUE-BLK', '/images/products/league-v2-tote-dust-black.webp', 790000.00, NULL, 0, 0), -- Tồn kho = 0 (Báo SOLD OUT trên web)

-- Dòng Goodbye My Work (2 màu Red và Blue)
(11, 5, 'Red', '#C8102E', 'NES-GBMW-RED', '/images/products/good-bye-my-work-tote-red.webp', 200000.00, NULL, 40, 0),
(12, 5, 'Blue', '#0047AB', 'NES-GBMW-BLU', '/images/products/good-bye-my-work-tote-blue.webp', 200000.00, NULL, 35, 0);

-- ------------------------------------------------------------------------------
-- 4. NẠP MÃ GIẢM GIÁ (Coupons)
-- ------------------------------------------------------------------------------
INSERT INTO `coupons` (`id`, `code`, `description`, `type`, `value`, `min_order_amount`, `usage_limit`, `used_count`) VALUES
(1, 'NINETYEIGHT10', 'Giảm 10% tổng giá trị đơn hàng', 'percent', 10.00, 0.00, 1000, 15),
(2, 'FREESHIP', 'Miễn phí 100% cước phí vận chuyển toàn quốc', 'freeship', 0.00, 0.00, 500, 28);

-- ------------------------------------------------------------------------------
-- 5. NẠP TÀI KHOẢN NGƯỜI DÙNG
-- ------------------------------------------------------------------------------
INSERT INTO `users` (`id`, `full_name`, `email`, `phone`, `password_hash`, `role`) VALUES
(1, 'Admin Ninety Eight', 'admin@ninetyeight.vn', '0378026461', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'admin'),
(2, 'Nguyễn Văn Nam', 'nam.nguyen@ninetyeight.vn', '0378026461', '$2b$10$abcdefghijklmnopqrstuvwxyz123456', 'customer');

INSERT INTO `user_addresses` (`id`, `user_id`, `recipient_name`, `phone`, `province`, `district`, `ward`, `street_address`, `is_default`) VALUES
(1, 2, 'Nguyễn Văn Nam', '0378 026 461', 'TP. Hồ Chí Minh', 'Quận 1', 'Phường Bến Nghé', 'Số 98 Đường Nguyễn Huệ, Tòa nhà Arc', 1);

-- ------------------------------------------------------------------------------
-- 6. NẠP ĐƠN HÀNG MẪU (Orders & Order Items)
-- ------------------------------------------------------------------------------
INSERT INTO `orders` (
  `id`, `order_code`, `user_id`, `customer_name`, `customer_phone`, `customer_email`,
  `shipping_province`, `shipping_district`, `shipping_ward`, `shipping_address`,
  `subtotal`, `shipping_fee`, `discount_amount`, `total_amount`,
  `shipping_method`, `payment_method`, `payment_status`, `order_status`
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

INSERT INTO `order_items` (
  `id`, `order_id`, `product_id`, `variant_id`, 
  `product_name`, `color_name`, `sku`, `image`, `unit_price`, `quantity`, `total_price`
) VALUES
(1, 1, 1, 1, 'Zuni Bag', 'Black', 'NES-ZUNI-BLK', '/images/products/zuni-bag/thumb-1.png', 2450000.00, 1, 2450000.00),
(2, 2, 2, 5, 'Yacht Tote', 'Camo', 'NES-YACHT-CAMO', '/images/products/yacht-tote-camo.webp', 950000.00, 1, 950000.00);

-- Ghi nhận 1 log kho giữ chỗ mẫu cho đơn #NES-9042
INSERT INTO `inventory_logs` (`variant_id`, `action`, `quantity_change`, `stock_after`, `reserved_after`, `reference_code`, `note`) VALUES
(1, 'order_reserve', 0, 25, 1, '#NES-9042', 'Giữ hàng đơn Chuyển khoản VietQR');
