# NINETY EIGHT STUDIO - HỆ THỐNG CƠ SỞ DỮ LIỆU MYSQL (CHUẨN SHOPEE)

Hệ thống cơ sở dữ liệu được thiết kế theo tư duy **Shopee Seller Center**:
- **Sản phẩm gốc (`products`)**: Chứa thông tin cơ bản của dòng túi (Tên, Danh mục, Mô tả, Kích thước, Ảnh bìa chung).
- **Phân loại hàng (`product_variants`)**: Ma trận biến thể màu sắc, mỗi màu là 1 SKU riêng có ảnh riêng, giá riêng và quản lý **Kho hàng (`stock`) - Giữ chỗ (`reserved_stock`)** riêng biệt.

---

## 1. Cấu trúc thư mục

```
docs/database/
├── schema.sql      # Khởi tạo toàn bộ bảng, ràng buộc khóa ngoại, chỉ mục (Index) và View
├── seed_data.sql   # Dữ liệu mẫu thực tế của Ninety Eight Studio (Zuni Bag, Yacht, League V2...)
└── README.md       # Tài liệu hướng dẫn sử dụng & câu lệnh mẫu
```

---

## 2. Hướng dẫn Import vào MySQL

### Cách 1: Sử dụng MySQL CLI (Terminal / Command Prompt)

```bash
# Đăng nhập vào MySQL và chạy lần lượt:
mysql -u root -p < docs/database/schema.sql
mysql -u root -p < docs/database/seed_data.sql
```

### Cách 2: Sử dụng phpMyAdmin hoặc DBeaver / Navicat
1. Mở phpMyAdmin / DBeaver.
2. Chọn menu **Import** (hoặc mở SQL Editor).
3. Chạy file `schema.sql` trước để tạo bảng.
4. Chạy tiếp file `seed_data.sql` để nạp dữ liệu mẫu.

---

## 3. Các câu lệnh truy vấn thực tế thường dùng

### Câu 1: Lấy danh sách sản phẩm hiển thị trên trang Cửa hàng (`/cua-hang`)
Lấy thông tin sản phẩm kèm số lượng màu hiện có và kiểm tra còn hàng hay không:

```sql
SELECT 
  p.id,
  p.name,
  p.slug,
  p.base_price,
  p.cover_image,
  p.hover_image,
  c.name AS category_name,
  COUNT(v.id) AS total_colors,
  SUM(v.stock - v.reserved_stock) AS total_available_stock,
  CASE 
    WHEN SUM(v.stock - v.reserved_stock) > 0 THEN 0 
    ELSE 1 
  END AS out_of_stock
FROM products p
JOIN categories c ON p.category_id = c.id
LEFT JOIN product_variants v ON p.id = v.product_id AND v.is_active = 1
WHERE p.is_active = 1
GROUP BY p.id
ORDER BY p.id DESC;
```

---

### Câu 2: Lấy trang chi tiết sản phẩm kèm danh sách các màu sắc (Color Swatches)
Hiển thị đầy đủ thông tin túi và các ô chọn màu (kèm mã màu hex, ảnh riêng, tồn kho từng màu):

```sql
-- Lấy thông tin chung của sản phẩm
SELECT * FROM products WHERE slug = 'zuni-bag' AND is_active = 1;

-- Lấy danh sách tất cả các màu của sản phẩm đó để render dải chọn màu
SELECT 
  id AS variant_id,
  color_name,
  color_code,
  sku,
  image AS color_thumbnail,
  price,
  original_price,
  stock,
  (stock - reserved_stock) AS available_stock,
  CASE 
    WHEN (stock - reserved_stock) <= 0 THEN 1 
    ELSE 0 
  END AS is_sold_out
FROM product_variants
WHERE product_id = 1 AND is_active = 1
ORDER BY id ASC;
```

---

### Câu 3: Thêm một màu mới cho dòng túi đã có (Cực kỳ dễ dàng)
Ví dụ dòng túi **Zuni Bag** (`product_id = 1`) chuẩn bị ra mắt thêm màu **Nâu Chocolate** (`#4A2C11`) với số lượng 20 cái:

```sql
INSERT INTO product_variants (
  product_id, color_name, color_code, sku, image, price, original_price, stock
) VALUES (
  1, 
  'Chocolate Brown', 
  '#4A2C11', 
  'NES-ZUNI-BRN', 
  '/images/products/zuni-bag/swatch-brown.png', 
  2450000.00, 
  2700000.00, 
  20
);
```
*Ngay lập tức, màu Chocolate Brown sẽ xuất hiện trên giao diện website mà không cần phải can thiệp cấu trúc bảng.*

---

### Câu 4: Xử lý Đặt hàng & Trừ kho an toàn (Chống bán âm / Race Condition)

Khi khách bấm **"Đặt hàng"** tại `/checkout`, sử dụng câu lệnh Atomic Update để khóa giữ chỗ hàng trong kho:

```sql
-- Bước 1: Giữ chỗ 1 sản phẩm (chỉ giữ nếu tồn khả dụng > 0)
UPDATE product_variants 
SET reserved_stock = reserved_stock + 1 
WHERE id = 1 AND (stock - reserved_stock) >= 1;

-- Nếu câu lệnh trên trả về 0 rows affected -> Tức là đã hết hàng trong tích tắc, báo lỗi cho khách!

-- Bước 2: Ghi nhận lịch sử vào inventory_logs
INSERT INTO inventory_logs (variant_id, action, quantity_change, stock_after, reserved_after, reference_code, note)
VALUES (1, 'order_reserve', 0, 25, 1, '#NES-9042', 'Khách đặt đơn hàng mới');
```

---

### Câu 5: Khi đơn hàng giao thành công (Trừ kho vĩnh viễn)

```sql
-- Trừ kho thật và xóa số lượng giữ chỗ
UPDATE product_variants 
SET stock = stock - 1, reserved_stock = reserved_stock - 1 
WHERE id = 1;

INSERT INTO inventory_logs (variant_id, action, quantity_change, stock_after, reserved_after, reference_code, note)
VALUES (1, 'order_fulfill', -1, 24, 0, '#NES-9042', 'Đơn hàng giao thành công');
```

---

### Câu 6: Khi khách hủy đơn hàng (Nhả kho)

```sql
-- Nhả lại số lượng giữ chỗ
UPDATE product_variants 
SET reserved_stock = reserved_stock - 1 
WHERE id = 1 AND reserved_stock >= 1;

INSERT INTO inventory_logs (variant_id, action, quantity_change, stock_after, reserved_after, reference_code, note)
VALUES (1, 'order_cancel', 0, 25, 0, '#NES-9042', 'Khách hủy đơn hàng');
```
