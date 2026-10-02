export interface ShopProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  category: string;
  image: string;
  hoverImage: string;
  gallery: string[];
  sizes: string[];
  colors: string[];
  description: string;
  careInstructions?: string;
  shippingPolicy?: string;
  sizeChartImage?: string;
  page: number;
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    "id": 1,
    "name": "Áo len 98 STUDIO KNIT ZIPPED SWEATER form fit Black / Grey / Baby BLue FALL  ‘25 collection \" New color\"",
    "slug": "ao-len-98-studio-knit-zipped-sweater-form-fit-black-grey-baby-blue-fall-25-collection-new-color",
    "price": "850.000đ",
    "category": "JACKET",
    "image": "/images/shop/product-1-1.webp",
    "hoverImage": "/images/shop/product-1-2.webp",
    "gallery": [
      "/images/products/knit-zipped-sweater/slide-1.webp",
      "/images/products/knit-zipped-sweater/slide-2.webp",
      "/images/products/knit-zipped-sweater/slide-3.webp",
      "/images/products/knit-zipped-sweater/slide-4.webp",
      "/images/products/knit-zipped-sweater/slide-5.webp",
      "/images/products/knit-zipped-sweater/slide-6.webp",
      "/images/products/knit-zipped-sweater/slide-7.webp",
      "/images/products/knit-zipped-sweater/slide-8.webp",
      "/images/products/knit-zipped-sweater/slide-9.webp",
      "/images/products/knit-zipped-sweater/slide-10.webp"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "colors": [
      "Black",
      "Grey",
      "Baby Blue",
      "Yellow"
    ],
    "description": "*CÁC BẠN NÊN ĐỌC MÔ TẢ ĐỂ CHỌN SIZE, MÀU CHO PHÙ HỢP NHÉ!\n98 STUDIO KNIT ZIPPED SWEATER\n+ Chất liệu: 50% viscose 28% nylon và 22% polyester\n+ Kiểu dáng: Form fit\n+ Kiểu dệt: jacquard cao cấp, đã qua xử lý co rút có thể giặt máy (khuyên dùng túi giặt để bảo quản tối ưu).\n+ Dây kéo: Khóa kéo YKK chính hãng mượt mà, bền bỉ.\n+ Bảng size: XS / S / M / L\n* Mẫu nam cao 1m83, 70kg mặc size M form fit tôn dáng chuẩn streetwear.\n\n* Thông tin người mẫu được cung cấp mang tính chất THAM KHẢO giúp bạn dễ dàng chọn size vừa vặn.\n* Toàn bộ sản phẩm được kiểm tra tỉ mỉ, gắn tem tag đầy đủ và đóng gói chỉn chu trong hộp Ninety Eight Studio trước khi gửi đi.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 2,
    "name": "Áo polo 98 STUDIO Striped Knit Polo form regular fit Mint / Red / Black summer ‘26 collection",
    "slug": "ao-polo-98-studio-striped-knit-polo-form-regular-fit-mint-red-black-summer-26-collection",
    "price": "690.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-2-1.webp",
    "hoverImage": "/images/shop/product-2-2.webp",
    "gallery": [
      "/images/shop/product-2-1.webp",
      "/images/shop/product-2-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo polo 98 STUDIO Striped Knit Polo form regular fit Mint / Red / Black summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 3,
    "name": "Áo thun 98 STUDIO PRIME TEE form regular cánh dơi Black / White / Sand / Faded summer ‘26 collection",
    "slug": "ao-thun-98-studio-prime-tee-form-regular-canh-doi-black-white-sand-faded-summer-26-collection",
    "price": "380.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-3-1.webp",
    "hoverImage": "/images/shop/product-3-2.webp",
    "gallery": [
      "/images/shop/product-3-1.webp",
      "/images/shop/product-3-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo thun 98 STUDIO PRIME TEE form regular cánh dơi Black / White / Sand / Faded summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 4,
    "name": "Quần Jeans 98 STUDIO CLOUD FADE Baggy denim 100% cotton 14.5oz SUMMER ‘25 collection",
    "slug": "quan-jeans-98-studio-cloud-fade-baggy-denim-100-cotton-145oz-summer-25-collection",
    "price": "890.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-4-1.webp",
    "hoverImage": "/images/shop/product-4-2.webp",
    "gallery": [
      "/images/shop/product-4-1.webp",
      "/images/shop/product-4-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần Jeans 98 STUDIO CLOUD FADE Baggy denim 100% cotton 14.5oz SUMMER ‘25 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 5,
    "name": "Áo thun 98 STUDIO CALIFORNIA SLUB TEE form regular Summer ‘26 collection",
    "slug": "ao-thun-98-studio-california-slub-tee-form-regular-summer-26-collection",
    "price": "380.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-5-1.webp",
    "hoverImage": "/images/shop/product-5-2.webp",
    "gallery": [
      "/images/shop/product-5-1.webp",
      "/images/shop/product-5-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo thun 98 STUDIO CALIFORNIA SLUB TEE form regular Summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 6,
    "name": "Quần Jeans 98 STUDIO MID BLUE Baggy denim 100% cotton 14.5oz SUMMER ‘25 collection",
    "slug": "quan-jeans-98-studio-mid-blue-baggy-denim-100-cotton-145oz-summer-25-collection",
    "price": "890.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-6-1.webp",
    "hoverImage": "/images/shop/product-6-2.webp",
    "gallery": [
      "/images/shop/product-6-1.webp",
      "/images/shop/product-6-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần Jeans 98 STUDIO MID BLUE Baggy denim 100% cotton 14.5oz SUMMER ‘25 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 7,
    "name": "Quần Jeans 98 STUDIO VINTAGE DISSTRED Baggy denim 100% cotton 14.5oz SUMMER ‘25 collection",
    "slug": "quan-jeans-98-studio-vintage-disstred-baggy-denim-100-cotton-145oz-summer-25-collection",
    "price": "1.190.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-7-1.webp",
    "hoverImage": "/images/shop/product-7-2.webp",
    "gallery": [
      "/images/shop/product-7-1.webp",
      "/images/shop/product-7-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần Jeans 98 STUDIO VINTAGE DISSTRED Baggy denim 100% cotton 14.5oz SUMMER ‘25 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 8,
    "name": "Quần Jeans 98 STUDIO LEATHER TAB Baggy denim 100% cotton màu trắng 14.5oz SUMMER ‘25 collection",
    "slug": "quan-jeans-98-studio-leather-tab-baggy-denim-100-cotton-mau-trang-145oz-summer-25-collection",
    "price": "890.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-8-1.webp",
    "hoverImage": "/images/shop/product-8-2.webp",
    "gallery": [
      "/images/shop/product-8-1.webp",
      "/images/shop/product-8-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần Jeans 98 STUDIO LEATHER TAB Baggy denim 100% cotton màu trắng 14.5oz SUMMER ‘25 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 9,
    "name": "Áo khoác knit 98 STUDIO SOFT RELAXED CARDIGAN grey / tiffany vải đã xử lý co rút SUMMER ‘25 collection",
    "slug": "ao-khoac-knit-98-studio-soft-relaxed-cardigan-grey-tiffany-vai-da-xu-lu-co-rut-summer-25-collection",
    "price": "890.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-9-1.webp",
    "hoverImage": "/images/shop/product-9-2.webp",
    "gallery": [
      "/images/shop/product-9-1.webp",
      "/images/shop/product-9-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo khoác knit 98 STUDIO SOFT RELAXED CARDIGAN grey / tiffany vải đã xử lý co rút SUMMER ‘25 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 10,
    "name": "Áo thun 98 STUDIO SOFT STRIPED TEE form regular fit vải slub Summer ‘26 collection",
    "slug": "ao-thun-98-studio-soft-striped-tee-form-regular-fit-vai-slub-summer-26-collection",
    "price": "480.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-10-1.webp",
    "hoverImage": "/images/shop/product-10-2.webp",
    "gallery": [
      "/images/shop/product-10-1.webp",
      "/images/shop/product-10-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo thun 98 STUDIO SOFT STRIPED TEE form regular fit vải slub Summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 11,
    "name": "Áo thun 98 STUDIO CONTINENTAL MOTOR SLUB TEE form regular Summer ‘26 collection",
    "slug": "ao-thun-98-studio-continental-motor-slub-tee-form-regular-summer-26-collection",
    "price": "420.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-11-1.webp",
    "hoverImage": "/images/shop/product-11-2.webp",
    "gallery": [
      "/images/shop/product-11-1.webp",
      "/images/shop/product-11-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo thun 98 STUDIO CONTINENTAL MOTOR SLUB TEE form regular Summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 12,
    "name": "Áo thun 98 STUDIO VINTAGE GOLF SLUB TEE form regular Summer ‘26 collection",
    "slug": "ao-thun-98-studio-vintage-golf-slub-tee-form-regular-summer-26-collection",
    "price": "420.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-12-1.webp",
    "hoverImage": "/images/shop/product-12-2.webp",
    "gallery": [
      "/images/shop/product-12-1.webp",
      "/images/shop/product-12-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo thun 98 STUDIO VINTAGE GOLF SLUB TEE form regular Summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 13,
    "name": "Áo khoác 98 STUDIO FUR JACKET form regular Black / BLUE chất liệu da lộn lót lông thỏ ''26 collection",
    "slug": "ao-khoac-98-studio-fur-jacket-form-regular-black-blue-chat-lieu-da-lon-lot-long-tho-26-collection",
    "price": "1.290.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-14-1.webp",
    "hoverImage": "/images/shop/product-14-2.webp",
    "gallery": [
      "/images/shop/product-13-1.webp",
      "/images/shop/product-13-1.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo khoác 98 STUDIO FUR JACKET form regular Black / BLUE chất liệu da lộn lót lông thỏ ''26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 14,
    "name": "Áo thun 98 STUDIO CONTRAST HENLY TEE  form regular cánh dơi summer ‘26 collection",
    "slug": "ao-thun-98-studio-contrast-henly-tee-form-regular-canh-doi-summer-26-collection",
    "price": "690.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-14-1.webp",
    "hoverImage": "/images/shop/product-14-2.webp",
    "gallery": [
      "/images/shop/product-14-1.webp",
      "/images/shop/product-14-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo thun 98 STUDIO CONTRAST HENLY TEE  form regular cánh dơi summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 15,
    "name": "Quần jeans 98 STUDIO INDIGO Baggy Denim chất liệu 100% cotton 13oz SUMMER ‘26 collection",
    "slug": "quan-jeans-98-studio-indigo-baggy-denim-chat-lieu-100-cotton-13oz-summer-26-collection",
    "price": "720.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-15-1.webp",
    "hoverImage": "/images/shop/product-15-2.webp",
    "gallery": [
      "/images/shop/product-15-1.webp",
      "/images/shop/product-15-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần jeans 98 STUDIO INDIGO Baggy Denim chất liệu 100% cotton 13oz SUMMER ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 16,
    "name": "Quần Jeans 98 STUDIO WHITE NOISE SHORT 100% cotton 12.5oz SUMMER ‘25 collection",
    "slug": "quan-jeans-98-studio-white-noise-short-100-cotton-125oz-summer-25-collection",
    "price": "550.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-16-1.webp",
    "hoverImage": "/images/shop/product-16-2.webp",
    "gallery": [
      "/images/shop/product-16-1.webp",
      "/images/shop/product-16-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần Jeans 98 STUDIO WHITE NOISE SHORT 100% cotton 12.5oz SUMMER ‘25 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 17,
    "name": "Quần short nữ 98 STUDIO SILK SHORT chất liệu lụa cao cấp dày dặn SUMMER ‘26 collection",
    "slug": "quan-short-nu-98-studio-silk-short-chat-lieu-lua-cao-cap-day-dan-summer-26-collection",
    "price": "480.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-17-1.webp",
    "hoverImage": "/images/shop/product-17-2.webp",
    "gallery": [
      "/images/shop/product-17-1.webp",
      "/images/shop/product-17-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần short nữ 98 STUDIO SILK SHORT chất liệu lụa cao cấp dày dặn SUMMER ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 18,
    "name": "Quần short 98 STUDIO Pleated Trousers short form trên gối summer ‘26 collection",
    "slug": "quan-short-98-studio-pleated-trousers-short-form-tren-goi-summer-26-collection",
    "price": "480.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-18-1.webp",
    "hoverImage": "/images/shop/product-18-2.webp",
    "gallery": [
      "/images/shop/product-18-1.webp",
      "/images/shop/product-18-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần short 98 STUDIO Pleated Trousers short form trên gối summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 19,
    "name": "Túi xách da PU khoá gài kim loại 98 STUDIO ARCHIVE BAG unisex đeo vai cầm tay",
    "slug": "tui-xach-da-pu-khoa-gai-kim-loai-98-studio-archive-bag-unisex-deo-vai-cam-tay",
    "price": "590.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-19-1.webp",
    "hoverImage": "/images/shop/product-19-1.webp",
    "gallery": [
      "/images/shop/product-19-1.webp",
      "/images/shop/product-19-1.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Túi xách da PU khoá gài kim loại 98 STUDIO ARCHIVE BAG unisex đeo vai cầm tay từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 20,
    "name": "Quần short 98 STUDIO BERMUDA SHORT form trên gối summer ‘26 collection",
    "slug": "quan-short-98-studio-bermuda-short-form-tren-goi-summer-26-collection",
    "price": "720.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-20-1.webp",
    "hoverImage": "/images/shop/product-20-2.webp",
    "gallery": [
      "/images/shop/product-20-1.webp",
      "/images/shop/product-20-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần short 98 STUDIO BERMUDA SHORT form trên gối summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 21,
    "name": "Áo khoác 98 STUDIO Sand Jacket form oversize chất liệu canvas 100% cotton SUMMER ‘26 collection",
    "slug": "ao-khoac-98-studio-sand-jacket-form-oversize-chat-lieu-canvas-100-cotton-summer-26-collection",
    "price": "840.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-21-1.webp",
    "hoverImage": "/images/shop/product-21-2.webp",
    "gallery": [
      "/images/shop/product-21-1.webp",
      "/images/shop/product-21-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo khoác 98 STUDIO Sand Jacket form oversize chất liệu canvas 100% cotton SUMMER ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 22,
    "name": "Quần dài 98 STUDIO STRIPED TROUSERS form suông summer ‘26 collection",
    "slug": "quan-dai-98-studio-striped-trousers-form-suong-summer-26-collection",
    "price": "550.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-22-1.webp",
    "hoverImage": "/images/shop/product-22-2.webp",
    "gallery": [
      "/images/shop/product-22-1.webp",
      "/images/shop/product-22-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần dài 98 STUDIO STRIPED TROUSERS form suông summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 23,
    "name": "Áo sơ mi tay dài 98 STUDIO Black Linen Shirt form regular summer ‘26 collection",
    "slug": "ao-so-mi-tay-dai-98-studio-black-linen-shirt-form-regular-summer-26-collection",
    "price": "550.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-23-1.webp",
    "hoverImage": "/images/shop/product-23-2.webp",
    "gallery": [
      "/images/shop/product-23-1.webp",
      "/images/shop/product-23-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo sơ mi tay dài 98 STUDIO Black Linen Shirt form regular summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 24,
    "name": "Áo sơ mi vintage 98 STUDIO Plaid Shirt form regular summer ‘26 collection",
    "slug": "ao-so-mi-vintage-98-studio-plaid-shirt-form-regular-summer-26-collection",
    "price": "620.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-24-1.webp",
    "hoverImage": "/images/shop/product-24-2.webp",
    "gallery": [
      "/images/shop/product-24-1.webp",
      "/images/shop/product-24-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo sơ mi vintage 98 STUDIO Plaid Shirt form regular summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 1
  },
  {
    "id": 25,
    "name": "Quần dài 98 STUDIO STRAIGHT TROUSERS form suông summer ‘26 collection",
    "slug": "quan-dai-98-studio-straight-trousers-form-suong-summer-26-collection",
    "price": "550.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-25-1.webp",
    "hoverImage": "/images/shop/product-25-2.webp",
    "gallery": [
      "/images/shop/product-25-1.webp",
      "/images/shop/product-25-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần dài 98 STUDIO STRAIGHT TROUSERS form suông summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 2
  },
  {
    "id": 26,
    "name": "Áo thun tay ngắn 98 STUDIO Striped T-Shirt form ôm THE INTERLUDE ‘26 collection",
    "slug": "ao-thun-tay-ngan-98-studio-striped-t-shirt-form-om-the-interlude-26-collection",
    "price": "380.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-26-1.webp",
    "hoverImage": "/images/shop/product-26-2.webp",
    "gallery": [
      "/images/shop/product-26-1.webp",
      "/images/shop/product-26-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo thun tay ngắn 98 STUDIO Striped T-Shirt form ôm THE INTERLUDE ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 2
  },
  {
    "id": 27,
    "name": "Áo thun tay dài 98 STUDIO SKY CLASSIC RAGLAN form regular Summer ‘26 collection",
    "slug": "ao-thun-tay-dai-98-studio-sky-classic-raglan-form-regular-summer-26-collection",
    "price": "380.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-27-1.webp",
    "hoverImage": "/images/shop/product-27-2.webp",
    "gallery": [
      "/images/shop/product-27-1.webp",
      "/images/shop/product-27-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo thun tay dài 98 STUDIO SKY CLASSIC RAGLAN form regular Summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 2
  },
  {
    "id": 28,
    "name": "Quần Jeans 98 STUDIO RAW STRAIGHT DENIM 100% cotton 14oz SUMMER ‘25 collection",
    "slug": "quan-jeans-98-studio-raw-straight-denim-100-cotton-14oz-summer-25-collection",
    "price": "890.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-28-1.webp",
    "hoverImage": "/images/shop/product-28-2.webp",
    "gallery": [
      "/images/shop/product-28-1.webp",
      "/images/shop/product-28-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần Jeans 98 STUDIO RAW STRAIGHT DENIM 100% cotton 14oz SUMMER ‘25 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 2
  },
  {
    "id": 29,
    "name": "Áo thun henley 98 STUDIO WAFFLE TEE form oversize Summer ‘26 collection",
    "slug": "ao-thun-henley-98-studio-waffle-tee-form-oversize-summer-26-collection",
    "price": "380.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-29-1.webp",
    "hoverImage": "/images/shop/product-29-1.webp",
    "gallery": [
      "/images/shop/product-29-1.webp",
      "/images/shop/product-29-1.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo thun henley 98 STUDIO WAFFLE TEE form oversize Summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 2
  },
  {
    "id": 30,
    "name": "Áo khoác 98 STUDIO Lable Jacket form crop Black / Olive chất liệu da lộn SUMMER ‘26 collection",
    "slug": "ao-khoac-98-studio-lable-jacket-form-crop-black-olive-chat-lieu-da-lon-summer-26-collection",
    "price": "750.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-30-1.webp",
    "hoverImage": "/images/shop/product-30-2.webp",
    "gallery": [
      "/images/shop/product-30-1.webp",
      "/images/shop/product-30-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo khoác 98 STUDIO Lable Jacket form crop Black / Olive chất liệu da lộn SUMMER ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 2
  },
  {
    "id": 31,
    "name": "Quần dài 98 STUDIO PLEATE TROUSERS  form suông chất liệu vải WOOL dày dặn đứng form FALL ‘25 collection",
    "slug": "quan-dai-98-studio-pleate-trousers-form-suong-chat-lieu-vai-wool-day-dan-dung-form-fall-25-collection",
    "price": "550.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-31-1.webp",
    "hoverImage": "/images/shop/product-31-1.webp",
    "gallery": [
      "/images/shop/product-31-1.webp",
      "/images/shop/product-31-1.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Quần dài 98 STUDIO PLEATE TROUSERS  form suông chất liệu vải WOOL dày dặn đứng form FALL ‘25 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 2
  },
  {
    "id": 32,
    "name": "Áo thun 98 STUDIO BLUE SHIRT form fit Black / White  summer ‘26 collection",
    "slug": "ao-thun-98-studio-blue-shirt-form-fit-black-white-summer-26-collection",
    "price": "380.000đ",
    "category": "CLOTHING",
    "image": "/images/shop/product-32-1.webp",
    "hoverImage": "/images/shop/product-32-2.webp",
    "gallery": [
      "/images/shop/product-32-1.webp",
      "/images/shop/product-32-2.webp"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "colors": [
      "Black",
      "White",
      "Grey"
    ],
    "description": "Sản phẩm Áo thun 98 STUDIO BLUE SHIRT form fit Black / White  summer ‘26 collection từ bộ sưu tập mới nhất của 98 STUDIO. Thiết kế tinh tế, chất liệu cao cấp mang phong cách streetwear năng động và cá tính.",
    "careInstructions": "HƯỚNG DẪN BẢO QUẢN\n- Giặt bằng nước lạnh hoặc nhiệt độ thường để giữ sợi vải len mềm mại.\n- Không sử dụng thuốc tẩy hoặc bột giặt có tính tẩy rửa mạnh.\n- Phơi sản phẩm trong bóng râm, tránh ánh nắng gắt trực tiếp làm phai màu.\n- Lộn trái sản phẩm trước khi giặt và nên sử dụng túi giặt chuyên dụng.",
    "shippingPolicy": "CHÍNH SÁCH GIAO HÀNG & ĐỔI TRẢ\n- Thời gian chuẩn bị đơn: 1 - 2 ngày làm việc.\n- Khu vực TP.HCM: Nhận hàng sau 1 - 2 ngày.\n- Các tỉnh thành khác: Nhận hàng sau 2 - 4 ngày.\n- Hỗ trợ đổi size trong vòng 7 ngày kể từ khi nhận hàng (sản phẩm còn nguyên tem mác, chưa qua sử dụng).\n- Đổi mới 100% nếu phát sinh lỗi từ nhà sản xuất.",
    "sizeChartImage": "/images/products/knit-zipped-sweater/size-chart.webp",
    "page": 2
  }
];

export function getProductBySlug(slug: string): ShopProduct | undefined {
  const decoded = decodeURIComponent(slug).toLowerCase();
  return SHOP_PRODUCTS.find((p) => p.slug === decoded || p.slug.includes(decoded) || decoded.includes(p.slug));
}

export function getRelatedProducts(currentId: number, limit: number = 4): ShopProduct[] {
  return SHOP_PRODUCTS.filter((p) => p.id !== currentId).slice(0, limit);
}
