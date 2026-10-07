# KiotViet Public API Reference — ninetyeightstudio (`98stu`)

Tài liệu kỹ thuật tổng hợp cấu trúc Request / Response và dữ liệu mẫu thực tế được kiểm thử trực tiếp từ gian hàng KiotViet của **ninetyeightstudio**.

---

## 1. Thông Tin Cấu Hình & Xác Thực (Authentication)

- **Môi trường:** Production KiotViet Public API
- **Client ID:** `<KIOTVIET_CLIENT_ID>` (được lưu an toàn trong file `.env`)
- **Mã bảo mật (Client Secret):** `<KIOTVIET_CLIENT_SECRET>` (được lưu an toàn trong file `.env`)
- **Mã gian hàng (Retailer Code):** `98stu`
- **Retailer ID:** `501073570`
- **Chi nhánh mặc định:** `Chi nhánh trung tâm` (Branch ID: `233443`)
- **Cơ chế xác thực:** OAuth 2.0 (Client Credentials Grant)
- **Thời hạn Token:** 86,400 giây (24 giờ)

### Headers bắt buộc cho mọi API nghiệp vụ:
```http
Authorization: Bearer <access_token>
Retailer: 98stu
Content-Type: application/json
```

---

## 2. Danh Sách Endpoint & Chi Tiết Kỹ Thuật

### 2.1. Xác thực lấy Access Token
- **Mục đích:** Cấp phát Bearer Token để gọi các API dữ liệu.
- **Method & URL:** `POST https://id.kiotviet.vn/connect/token`
- **Content-Type:** `application/x-www-form-urlencoded`

#### Request Body (form-urlencoded):
| Tham số | Kiểu dữ liệu | Bắt buộc | Giá trị |
| :--- | :--- | :--- | :--- |
| `scopes` | string | Có | `PublicApi.Access` |
| `grant_type` | string | Có | `client_credentials` |
| `client_id` | string | Có | `<KIOTVIET_CLIENT_ID>` |
| `client_secret` | string | Có | `<KIOTVIET_CLIENT_SECRET>` |

#### cURL mẫu:
```bash
curl -X POST "https://id.kiotviet.vn/connect/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "scopes=PublicApi.Access&grant_type=client_credentials&client_id=<KIOTVIET_CLIENT_ID>&client_secret=<KIOTVIET_CLIENT_SECRET>"
```

#### Response thực tế (HTTP 200):
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6ImF0K2p3dCJ9...",
  "expires_in": 86400,
  "token_type": "Bearer",
  "scope": "PublicApi.Access"
}
```

---

### 2.2. Danh mục nhóm hàng (Categories)
- **Mục đích:** Lấy danh sách thể loại sản phẩm để hiển thị cây danh mục trên web.
- **Method & URL:** `GET https://public.kiotapi.com/categories`

#### Query Parameters:
| Tham số | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `pageSize` | int | Số bản ghi / trang (mặc định 20, tối đa 100) |
| `currentItem` | int | Vị trí offset bắt đầu lấy (mặc định 0) |
| `hierachicalData` | boolean | `true` để lấy theo cấu trúc cây phân cấp (cha/con) |
| `lastModifiedFrom` | datetime | Lọc danh mục sửa đổi sau thời điểm này |

#### cURL mẫu:
```bash
curl -X GET "https://public.kiotapi.com/categories?pageSize=20&hierachicalData=true" \
  -H "Authorization: Bearer <access_token>" \
  -H "Retailer: 98stu"
```

#### Response thực tế từ gian hàng `98stu` (HTTP 200):
```json
{
  "total": 1,
  "pageSize": 20,
  "data": [
    {
      "categoryId": 1601068,
      "categoryName": "Khác",
      "retailerId": 501073570,
      "hasChild": false,
      "createdDate": "2026-04-09T13:50:26.6370000",
      "rank": 0
    }
  ],
  "timestamp": "2026-10-07T14:39:09.4969693+07:00"
}
```

---

### 2.3. Danh sách hàng hóa (Products List)
- **Mục đích:** Lấy danh sách sản phẩm hiển thị trên trang cửa hàng (`/cua-hang`), bộ lọc, phân trang.
- **Method & URL:** `GET https://public.kiotapi.com/products`

#### Query Parameters thông dụng:
| Tham số | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `pageSize` | int | Số sản phẩm trên 1 trang (tối đa 100) |
| `currentItem` | int | Bản ghi bắt đầu |
| `includeInventory` | boolean | `true` để kèm thông tin số lượng tồn kho từng chi nhánh |
| `includePricebook` | boolean | `true` để kèm bảng giá đặc biệt nếu có |
| `orderBy` | string | Cột sắp xếp (ví dụ: `name`, `basePrice`, `modifiedDate`) |
| `orderDirection` | string | Chiều sắp xếp: `Asc` hoặc `Desc` |
| `categoryId` | int | Lọc theo ID danh mục |

#### cURL mẫu:
```bash
curl -X GET "https://public.kiotapi.com/products?pageSize=10&includeInventory=true" \
  -H "Authorization: Bearer <access_token>" \
  -H "Retailer: 98stu"
```

#### Response thực tế từ gian hàng `98stu` (HTTP 200):
```json
{
  "total": 246,
  "pageSize": 2,
  "data": [
    {
      "createdDate": "2026-08-12T10:57:25.5930000",
      "taxType": "truc_tiep",
      "taxRateDirect": 1,
      "id": 51567210,
      "retailerId": 501073570,
      "code": "SPO1731840875933238957",
      "name": "[ Deal Đặc Biệt ] Túi saigon size S 98stu - Màu Socola",
      "fullName": "[ Deal Đặc Biệt ] Túi saigon size S 98stu - Màu Socola - Socola size S [ đặc biệt ]",
      "categoryId": 1601068,
      "categoryName": "Khác",
      "allowsSale": true,
      "type": 2,
      "hasVariants": true,
      "basePrice": 149000.0,
      "weight": 2000,
      "conversionValue": 1,
      "description": "<p>Túi tote saigon 98stu size S da pu cao cấp kèm charm tặng kèm dây đeo</p>",
      "modifiedDate": "2026-08-12T10:57:26.0730000",
      "isActive": true,
      "isRewardPoint": false,
      "attributes": [
        {
          "productId": 51567210,
          "attributeName": "Màu sắc",
          "attributeValue": "Socola size S [ đặc biệt ]"
        }
      ],
      "inventories": [
        {
          "productId": 51567210,
          "branchId": 233443,
          "branchName": "Chi nhánh trung tâm",
          "cost": 0,
          "onHand": 12,
          "reserved": 0,
          "actualReserved": 0,
          "minQuantity": 0,
          "maxQuantity": 0,
          "isActive": true,
          "onOrder": 0
        }
      ],
      "images": [
        "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/03538874801b4b4aa8b16a03d4a5386d~tplv-o3syd03w52-origin-jpeg.jpeg"
      ]
    }
  ],
  "timestamp": "2026-10-07T14:39:10.0000000+07:00"
}
```

---

### 2.4. Chi tiết hàng hóa (Product Detail)
- **Mục đích:** Hiển thị chi tiết trang sản phẩm đơn lẻ (`/san-pham/[slug]` hoặc `/san-pham/[id]`).
- **Method & URL:** `GET https://public.kiotapi.com/products/{id}`

#### cURL mẫu:
```bash
curl -X GET "https://public.kiotapi.com/products/51567210" \
  -H "Authorization: Bearer <access_token>" \
  -H "Retailer: 98stu"
```

#### Các trường quan trọng trả về:
- `id` (int): ID định danh sản phẩm trên KiotViet.
- `code` (string): Mã SKU sản phẩm (ví dụ: `SPO1731840875933238957`).
- `name` (string): Tên sản phẩm chính.
- `fullName` (string): Tên đầy đủ bao gồm thuộc tính phiên bản.
- `basePrice` (decimal): Giá bán lẻ niêm yết.
- `images` (array string): Danh sách link ảnh sản phẩm.
- `description` (html string): Bài viết giới thiệu sản phẩm (kèm ảnh và text định dạng).
- `attributes` (array): Các biến thể màu sắc, size, quy cách.
- `inventories` (array): Số lượng tồn thực tế (`onHand`) theo từng chi nhánh.
- `allowsSale` (boolean): Có đang được phép mở bán hay không.

---

### 2.5. Tạo đơn đặt hàng từ Website sang KiotViet (Create Order)
- **Mục đích:** Khi khách hàng đặt hàng xong trên website, backend gửi request tạo đơn hàng sang KiotViet để lưu trữ, trừ tồn kho và chuẩn bị đóng hàng.
- **Method & URL:** `POST https://public.kiotapi.com/orders`

#### Request Body Structure (JSON):
```json
{
  "purchaseDate": "2026-10-07T14:40:00",
  "branchId": 233443,
  "description": "Đơn đặt hàng từ Website 98studio - Mã web: WEB-10023",
  "method": "COD",
  "discount": 0,
  "totalPayment": 0,
  "makeInvoice": false,
  "customer": {
    "name": "Nguyễn Văn A",
    "contactNumber": "0987654321",
    "address": "Số 123 Đường ABC, Phường 1, Quận 1",
    "email": "customer@example.com",
    "comment": "Giao giờ hành chính"
  },
  "orderDetails": [
    {
      "productId": 51567210,
      "productCode": "SPO1731840875933238957",
      "productName": "[ Deal Đặc Biệt ] Túi saigon size S 98stu - Màu Socola",
      "quantity": 1,
      "price": 149000,
      "discount": 0,
      "note": "Size S - Socola"
    }
  ],
  "orderDelivery": {
    "receiver": "Nguyễn Văn A",
    "contactNumber": "0987654321",
    "address": "Số 123 Đường ABC, Phường 1, Quận 1, TP.HCM",
    "price": 30000,
    "usingPriceCod": true,
    "priceCodPayment": 179000
  }
}
```

#### cURL mẫu:
```bash
curl -X POST "https://public.kiotapi.com/orders" \
  -H "Authorization: Bearer <access_token>" \
  -H "Retailer: 98stu" \
  -H "Content-Type: application/json" \
  -d '{
    "purchaseDate": "2026-10-07T14:40:00",
    "branchId": 233443,
    "description": "Test tạo đơn từ Web 98studio",
    "method": "COD",
    "customer": {
      "name": "Khách Test",
      "contactNumber": "0900000000",
      "address": "TP.HCM"
    },
    "orderDetails": [
      {
        "productId": 51567210,
        "quantity": 1,
        "price": 149000
      }
    ]
  }'
```

#### Response thành công (HTTP 201 Created / 200 OK):
Trả về object Order đã được tạo với mã đơn KiotViet (ví dụ `DH000123`).

---

### 2.6. Danh sách đơn đặt hàng (Orders List)
- **Mục đích:** Theo dõi trạng thái đơn hàng trên KiotViet (Đã duyệt, Đang giao, Hoàn thành, Đã hủy).
- **Method & URL:** `GET https://public.kiotapi.com/orders`

#### Query Parameters:
| Tham số | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `status` | int[] | Trạng thái: `1` (Phiếu tạm), `2` (Đang xử lý), `3` (Hoàn thành), `4` (Đã hủy) |
| `customerCode` | string | Lọc theo mã khách |
| `pageSize` | int | Số đơn / trang |

#### Response thực tế từ gian hàng `98stu` (HTTP 200):
```json
{
  "total": 28313,
  "pageSize": 1,
  "data": [
    {
      "id": 18947766,
      "code": "DHSPE_2603010SCUQWWD",
      "purchaseDate": "2026-03-01T08:21:36.0000000",
      "branchId": 233443,
      "branchName": "Chi nhánh trung tâm",
      "soldByName": "Hoàng Thái",
      "customerId": 37286339,
      "customerCode": "KHSPE17506872",
      "customerName": "Đ******h",
      "total": 335000,
      "totalPayment": 0,
      "status": 3,
      "statusValue": "Hoàn thành",
      "usingCod": true,
      "orderDetails": [
        {
          "productId": 48873415,
          "productCode": "SPO79458331523",
          "productName": "Túi tote saigon 98stu size L da pu cao cấp",
          "quantity": 1,
          "price": 400000,
          "discount": 65000
        }
      ]
    }
  ]
}
```

---

### 2.7. Danh sách hóa đơn (Invoices List)
- **Mục đích:** Lấy lịch sử mua hàng, đối soát doanh thu thực tế khi đơn hàng đã chuyển thành hóa đơn thanh toán.
- **Method & URL:** `GET https://public.kiotapi.com/invoices`

#### cURL mẫu:
```bash
curl -X GET "https://public.kiotapi.com/invoices?pageSize=5" \
  -H "Authorization: Bearer <access_token>" \
  -H "Retailer: 98stu"
```

#### Response thực tế từ gian hàng `98stu` (HTTP 200):
```json
{
  "total": 23587,
  "pageSize": 1,
  "data": [
    {
      "id": 251996687,
      "code": "HDSPE_2610071NCT0GEY",
      "purchaseDate": "2026-10-07T14:38:12.5730000",
      "branchId": 233443,
      "branchName": "Chi nhánh trung tâm",
      "customerId": 42518443,
      "customerCode": "KHSPE19522858",
      "total": 210000,
      "totalPayment": 210000,
      "status": 1,
      "statusValue": "Hoàn thành"
    }
  ]
}
```

---

### 2.8. Khách hàng (Customers)
- **Mục đích:** Đồng bộ hoặc tra cứu thông tin khách hàng, tích điểm, địa chỉ giao hàng.
- **Method & URL:**
  - `GET https://public.kiotapi.com/customers?pageSize=10` (Lấy danh sách)
  - `POST https://public.kiotapi.com/customers` (Thêm mới khách hàng)

#### Response thực tế `GET /customers` từ `98stu` (HTTP 200):
```json
{
  "total": 31949,
  "pageSize": 1,
  "data": [
    {
      "id": 37285077,
      "code": "KHSPE618415998",
      "name": "Q******o",
      "address": "491 Nguyễn Đình Chiểu, Phường 3, Tân An, Long An",
      "retailerId": 501073570,
      "branchId": 233443,
      "createdDate": "2026-04-09T14:13:52.1670000",
      "totalInvoiced": 500000
    }
  ]
}
```

---

### 2.9. Chi nhánh cửa hàng (Branches)
- **Mục đích:** Lấy thông tin các chi nhánh để gán vào `branchId` khi tạo đơn hàng hoặc kiểm tra tồn kho theo từng kho hàng.
- **Method & URL:** `GET https://public.kiotapi.com/branches`

#### Response thực tế từ gian hàng `98stu` (HTTP 200):
```json
{
  "total": 1,
  "pageSize": 20,
  "data": [
    {
      "id": 233443,
      "branchName": "Chi nhánh trung tâm",
      "address": "",
      "contactNumber": "+84868462942",
      "retailerId": 501073570,
      "createdDate": "2026-02-28T10:57:15.6070000"
    }
  ]
}
```

---

### 2.10. Webhook (Đồng bộ thời gian thực Realtime)
- **Mục đích:** KiotViet tự động gửi thông báo (POST webhook) đến server website của bạn ngay khi có thay đổi trên KiotViet (ví dụ: nhân viên đổi giá bán, kho cập nhật số lượng, đơn hàng đổi trạng thái). Website không cần phải polling liên tục.
- **Method & URL:**
  - `GET https://public.kiotapi.com/webhooks` (Xem danh sách webhook đã đăng ký)
  - `POST https://public.kiotapi.com/webhooks` (Đăng ký webhook mới)
  - `DELETE https://public.kiotapi.com/webhooks/{id}` (Hủy webhook)

#### Các sự kiện hỗ trợ Webhook:
1. `stock.update` — Cập nhật tồn kho hàng hóa.
2. `product.update` — Cập nhật thông tin/giá sản phẩm.
3. `product.delete` — Xóa sản phẩm.
4. `order.update` — Cập nhật đơn đặt hàng (thay đổi trạng thái giao/hủy).
5. `customer.update` — Cập nhật thông tin khách hàng.

#### Request mẫu đăng ký Webhook:
```json
{
  "Webhook": {
    "Type": "stock.update",
    "Url": "https://yourdomain.com/api/webhooks/kiotviet",
    "IsActive": true,
    "Description": "Cập nhật tồn kho tự động về website ninetyeightstudio"
  }
}
```

---

## 3. Bảng Mapping Dữ Liệu KiotViet và Website (`ninetyeightstudio`)

| Dữ liệu Website | Trường tương ứng KiotViet | Ghi chú xử lý |
| :--- | :--- | :--- |
| **Mã sản phẩm (SKU)** | `code` | Dùng làm khóa duy nhất để đồng bộ |
| **Tên sản phẩm** | `name` / `fullName` | `name` là tên gốc, `fullName` gồm tên phân loại biến thể |
| **Giá bán** | `basePrice` | Giá niêm yết bán lẻ (VNĐ) |
| **Ảnh đại diện & Gallery** | `images` (mảng URLs) | Mảng link CDN ảnh của sản phẩm |
| **Mô tả chi tiết** | `description` | Nội dung mô tả chuẩn HTML kèm ảnh |
| **Màu sắc / Kích cỡ** | `attributes` | Mảng object `{ attributeName, attributeValue }` |
| **Số lượng tồn kho** | `inventories[0].onHand` | Số lượng hàng thực tế còn trong kho tại `branchId: 233443` |
| **Danh mục** | `categoryId` / `categoryName` | Nhóm phân loại |
| **Chi nhánh tạo đơn** | `branchId` | Mặc định sử dụng `233443` (Chi nhánh trung tâm) |

---

## 4. Giới Hạn Tần Suất (Rate Limiting) & Lưu Ý Vận Hành

1. **Giới hạn Request:** KiotViet giới hạn tối đa **5.000 requests/giờ** cho các API `GET`.
2. **Chiến lược Token:** Access Token có hạn **24 giờ**. Không được gọi API `/connect/token` mỗi lần gửi request; cần lưu token vào bộ nhớ tạm (Cache/Memory/DB) và chỉ xin token mới khi token cũ gần hết hạn.
3. **Cơ chế cập nhật kho & giá tốt nhất:** Nên kết hợp **Đồng bộ ban đầu theo lịch trình (Cron job)** + **Webhook realtime** khi có biến động kho/giá để không chạm trần giới hạn 5.000 req/h.
