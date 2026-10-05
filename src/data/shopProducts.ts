export interface ProductColor {
  name: string;
  thumbnail: string;
  slug: string;
}

export interface ProductDimensions {
  size: string;
  strapDrop: string;
  strapLength?: string;
  weight: string;
}

export interface ShopProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  originalPrice?: string;
  category: "TOTE BAG" | "SHOULDER BAG" | "TRAVEL BAG" | "ACCESSORIES";
  image: string;
  hoverImage: string;
  gallery: string[];
  colors?: ProductColor[];
  description: string;
  highlights?: string[];
  dimensions?: ProductDimensions;
  material?: string;
  careInstructions?: string;
  shippingPolicy?: string;
  outOfStock?: boolean;
  page: number;
}

export const SHOP_PRODUCTS: ShopProduct[] = [
  {
    id: 1,
    name: "Zuni Bag / Black",
    slug: "zuni-bag-black",
    price: "2.450.000₫",
    originalPrice: "2.700.000₫",
    category: "SHOULDER BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/thumb-1-b6c013de.png",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/thumb-2-1aeeef94.jpg",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/thumb-1-b6c013de.png",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/thumb-2-1aeeef94.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-1-b27199c0.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-2-6b89f80c.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-3-13606a8d.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-4-5cd51e03.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-5-de32a296.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-6-8f0af7e1.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-7-c8f6f347.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-8-e0d055a6.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-9-dfbe935e.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/spec-detail-7549636c.jpg",
    ],
    colors: [
      { name: "Black", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/thumb-1-b6c013de.png", slug: "zuni-bag-black" },
      { name: "Gray", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-gray-1810aa75.png", slug: "zuni-bag-gray" },
      { name: "Mustard", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-mustard-fefe54b1.png", slug: "zuni-bag-mustard" },
      { name: "Olive", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-olive-57acebdc.png", slug: "zuni-bag-olive" },
    ],
    description: "Zuni Bag mang phong cách casual hiện đại với độ rủ tự nhiên cuốn hút và phom dáng mềm mại linh hoạt, là sự kết hợp hoàn hảo giữa tính thẩm mỹ thời thượng và công năng sử dụng hàng ngày.",
    highlights: [
      "Chất liệu da thuần chay (Faux leather) cao cấp với độ bóng tự nhiên, mềm mại và chống trầy xước nhẹ",
      "Phom túi Bowling cấu trúc mềm, thoải mái khi đeo vai hoặc cầm tay",
      "Chi tiết khóa gài kim loại bên hông cá tính tạo điểm nhấn độc đáo",
      "Dây cố định quai đeo (Handle holder) giữ hai quai luôn vào nếp gọn gàng trên vai",
      "Khóa kéo zip kim loại YKK trơn tru, bền bỉ",
      "Hệ thống ngăn tiện dụng: 1 ngăn kéo mặt ngoài, 2 ngăn phụ bên trong, 1 ngăn khóa zip an toàn",
    ],
    dimensions: {
      size: "34 × 17 × 13 cm",
      strapDrop: "26 cm",
      strapLength: "59 cm",
      weight: "570g",
    },
    material: "Thân túi: 55% Polyester, 45% Da PU cao cấp (Non-animal Vegan Leather). Lớp lót: 100% Polyester dệt mật độ cao.",
    careInstructions: "- Không giặt bằng máy giặt hoặc ngâm nước.\n- Khi bị bám bẩn hoặc dính nước, lau nhẹ bằng khăn mềm khô hoặc khăn ẩm vắt ráo.\n- Để khô tự nhiên ở nơi thoáng mát, trong bóng râm, tránh ánh nắng trực tiếp hoặc nguồn nhiệt mạnh làm hỏng bề mặt da.\n- Nhồi giấy hoặc túi khí giữ phom khi không sử dụng.",
    shippingPolicy: "- Đóng gói chỉn chu hộp cứng chống va đập Ninety Eight Studio kèm túi vải dustbag bảo vệ.\n- Giao hàng toàn quốc từ 1 - 3 ngày làm việc.\n- Hỗ trợ đổi sản phẩm trong vòng 7 ngày kể từ khi nhận hàng (còn nguyên tem tag, chưa qua sử dụng).\n- Bảo hành phụ kiện khóa kéo trong vòng 6 tháng.",
    page: 1,
  },
  {
    id: 2,
    name: "Zuni Bag / Gray",
    slug: "zuni-bag-gray",
    price: "2.450.000₫",
    originalPrice: "2.700.000₫",
    category: "SHOULDER BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-gray-1810aa75.png",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-3-13606a8d.jpg",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-gray-1810aa75.png",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-3-13606a8d.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-4-5cd51e03.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-5-de32a296.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/spec-detail-7549636c.jpg",
    ],
    colors: [
      { name: "Black", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/thumb-1-b6c013de.png", slug: "zuni-bag-black" },
      { name: "Gray", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-gray-1810aa75.png", slug: "zuni-bag-gray" },
      { name: "Mustard", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-mustard-fefe54b1.png", slug: "zuni-bag-mustard" },
      { name: "Olive", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-olive-57acebdc.png", slug: "zuni-bag-olive" },
    ],
    description: "Phiên bản Zuni Bag màu xám khói hiện đại, tôn vinh nét đẹp tối giản và tinh tế, dễ dàng phối hợp với mọi trang phục thường nhật hay công sở.",
    highlights: [
      "Gam màu xám khói trung tính sang trọng, bề mặt da mềm mịn tự nhiên",
      "Phom dáng Bowling mềm mại với đường xếp nếp rủ tự nhiên",
      "Khóa gài kim loại và khóa zip mạ bạc sáng bóng cao cấp",
      "Quai đeo êm ái chống tuột vai",
    ],
    dimensions: {
      size: "34 × 17 × 13 cm",
      strapDrop: "26 cm",
      strapLength: "59 cm",
      weight: "570g",
    },
    material: "Thân túi: 55% Polyester, 45% Da PU cao cấp (Vegan Leather). Lớp lót: 100% Polyester.",
    careInstructions: "- Không giặt bằng máy giặt hoặc ngâm nước.\n- Lau sạch vết bẩn bằng khăn ẩm mềm và phơi nơi khô thoáng.",
    shippingPolicy: "- Giao hàng từ 1 - 3 ngày làm việc.\n- Hỗ trợ đổi trả trong 7 ngày đối với sản phẩm còn nguyên tem mác.",
    page: 1,
  },
  {
    id: 3,
    name: "Zuni Bag / Mustard",
    slug: "zuni-bag-mustard",
    price: "2.450.000₫",
    originalPrice: "2.700.000₫",
    category: "SHOULDER BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-mustard-fefe54b1.png",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-6-8f0af7e1.jpg",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-mustard-fefe54b1.png",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-6-8f0af7e1.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-7-c8f6f347.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/spec-detail-7549636c.jpg",
    ],
    colors: [
      { name: "Black", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/thumb-1-b6c013de.png", slug: "zuni-bag-black" },
      { name: "Gray", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-gray-1810aa75.png", slug: "zuni-bag-gray" },
      { name: "Mustard", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-mustard-fefe54b1.png", slug: "zuni-bag-mustard" },
      { name: "Olive", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-olive-57acebdc.png", slug: "zuni-bag-olive" },
    ],
    description: "Sắc vàng mù tạt ấm áp, tạo điểm nhấn nổi bật đầy cá tính cho phong cách thời trang của bạn.",
    highlights: [
      "Tone màu Mustard nổi bật, bắt mắt",
      "Chất liệu da thuần chay cao cấp bóng nhẹ tự nhiên",
      "Cấu trúc túi mềm linh hoạt với quai đeo cố định gọn gàng",
    ],
    dimensions: {
      size: "34 × 17 × 13 cm",
      strapDrop: "26 cm",
      strapLength: "59 cm",
      weight: "570g",
    },
    material: "Thân túi: 55% Polyester, 45% Da PU cao cấp. Lớp lót: 100% Polyester.",
    careInstructions: "- Tránh ánh nắng gắt chiếu trực tiếp trong thời gian dài.\n- Lau nhẹ bằng khăn mềm khô.",
    shippingPolicy: "- Giao hàng toàn quốc 1 - 3 ngày làm việc.\n- Đổi trả trong vòng 7 ngày.",
    page: 1,
  },
  {
    id: 4,
    name: "Zuni Bag Stud / Olive",
    slug: "zuni-bag-olive",
    price: "2.550.000₫",
    originalPrice: "2.800.000₫",
    category: "SHOULDER BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-olive-57acebdc.png",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-8-e0d055a6.jpg",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-olive-57acebdc.png",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-8-e0d055a6.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/slide-9-dfbe935e.jpg",
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/spec-detail-7549636c.jpg",
    ],
    colors: [
      { name: "Black", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/thumb-1-b6c013de.png", slug: "zuni-bag-black" },
      { name: "Gray", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-gray-1810aa75.png", slug: "zuni-bag-gray" },
      { name: "Mustard", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-mustard-fefe54b1.png", slug: "zuni-bag-mustard" },
      { name: "Olive", thumbnail: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/swatch-olive-57acebdc.png", slug: "zuni-bag-olive" },
    ],
    description: "Phiên bản Zuni Bag Stud màu Olive đính đinh tán kim loại sành điệu, kết hợp hoàn hảo giữa nét cổ điển và phong cách streetwear cá tính.",
    highlights: [
      "Chi tiết đinh tán kim loại (Studs) được gia công tỉ mỉ, chống gỉ sét",
      "Tone xanh olive thời thượng, dễ phối cùng các trang phục phong cách Y2K hoặc Streetwear",
      "Phom túi mềm tự nhiên, sức chứa rộng rãi",
    ],
    dimensions: {
      size: "34 × 17 × 13 cm",
      strapDrop: "26 cm",
      strapLength: "59 cm",
      weight: "590g",
    },
    material: "Thân túi: Da PU cao cấp kết hợp chi tiết đinh tán hợp kim. Lớp lót: 100% Polyester.",
    careInstructions: "- Tránh để kim loại tiếp xúc hóa chất tẩy rửa mạnh.\n- Lau bằng khăn mềm khô khi vệ sinh.",
    shippingPolicy: "- Đóng gói hộp cao cấp Ninety Eight Studio.\n- Giao hàng 1 - 3 ngày làm việc.",
    page: 1,
  },
  {
    id: 5,
    name: "YACHT TOTE | CAMO",
    slug: "yacht-tote-camo",
    price: "950.000₫",
    category: "TOTE BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/yacht-tote-camo-187b8f33.webp",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/yacht-tote-camo-187b8f33.webp",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/yacht-tote-camo-187b8f33.webp",
    ],
    description: "Túi Yacht Tote với họa tiết Camo kinh điển từ Ninety Eight Studio. Thiết kế form lớn đa năng, phù hợp cho cả đi làm, đi học lẫn những chuyến du lịch cuối tuần.",
    highlights: [
      "Chất liệu vải Canvas dệt rằn ri (Camo) 16oz dày dặn đứng form",
      "Quai xách bằng sợi dù dệt chịu lực cao cấp, êm ái khi đeo vai",
      "Ngăn chứa siêu rộng, đựng vừa laptop 15.6 inch, tập sách và đồ dùng cá nhân",
      "Ngăn phụ tiện dụng bên trong có khóa kéo bảo mật",
    ],
    dimensions: {
      size: "42 × 36 × 14 cm",
      strapDrop: "28 cm",
      weight: "480g",
    },
    material: "100% Heavyweight Cotton Canvas 16oz. Quai dù quân đội chịu lực.",
    careInstructions: "- Giặt tay bằng nước lạnh và xà phòng pha loãng.\n- Không dùng thuốc tẩy hoặc vắt xoắn mạnh.\n- Phơi trong bóng râm, tránh nắng gắt trực tiếp.",
    shippingPolicy: "- Đóng gói túi chống sốc kèm tem mác Ninety Eight Studio.\n- Giao hàng toàn quốc từ 1 - 3 ngày làm việc.\n- Đổi trả trong vòng 7 ngày.",
    page: 1,
  },
  {
    id: 6,
    name: "SPORTY TRAVEL BAG | CAMO",
    slug: "sporty-travel-bag-camo",
    price: "1.170.000₫",
    category: "TRAVEL BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/sporty-travel-bag-camo-399bafcd.webp",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/sporty-travel-bag-camo-399bafcd.webp",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/sporty-travel-bag-camo-399bafcd.webp",
    ],
    description: "Túi du lịch thể thao Sporty Travel Bag Camo được thiết kế tối ưu hóa dung tích chứa, đi kèm quai xách tay và dây đeo chéo tháo rời tiện lợi.",
    highlights: [
      "Dung tích lớn thích hợp cho chuyến đi 2 - 4 ngày hoặc hoạt động thể thao/gym",
      "Vải Canvas dệt phủ tráng chống thấm nước nhẹ bề mặt",
      "Khóa kéo kim loại hai chiều trơn tru",
      "Kèm quai đeo chéo có đệm vai êm ái, có thể điều chỉnh độ dài",
    ],
    dimensions: {
      size: "50 × 28 × 25 cm",
      strapDrop: "Quai xách tay 20 cm, Dây đeo chéo tùy chỉnh 80 - 140 cm",
      weight: "720g",
    },
    material: "Heavyweight Canvas kết hợp đáy túi gia cố da PU chống mài mòn.",
    careInstructions: "- Lau bằng khăn ẩm mềm khi dính bẩn.\n- Không giặt bằng máy giặt công nghiệp.",
    shippingPolicy: "- Giao hàng toàn quốc 1 - 3 ngày làm việc.\n- Hỗ trợ đổi trả miễn phí nếu có lỗi kỹ thuật.",
    page: 1,
  },
  {
    id: 7,
    name: "GOOD BYE MY WORK TOTE BAG | RED",
    slug: "good-bye-my-work-tote-red",
    price: "200.000₫",
    category: "TOTE BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/good-bye-my-work-tote-red-698465a8.webp",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/good-bye-my-work-tote-red-698465a8.webp",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/good-bye-my-work-tote-red-698465a8.webp",
    ],
    description: "Túi tote vải Canvas đỏ cá tính với typography slogan 'GOOD BYE MY WORK' đặc trưng của Ninety Eight Studio, mang thông điệp thư giãn và tự do.",
    highlights: [
      "Vải canvas 10oz mộc tự nhiên, thân thiện với môi trường",
      "Họa tiết in lụa sắc nét, không bong tróc khi giặt",
      "Trọng lượng siêu nhẹ, có thể gấp gọn trong balo",
    ],
    dimensions: {
      size: "38 × 40 × 8 cm",
      strapDrop: "30 cm",
      weight: "220g",
    },
    material: "100% Eco Cotton Canvas.",
    careInstructions: "- Giặt tay bằng nước lạnh, lộn trái khi giặt để bảo vệ họa tiết in.",
    shippingPolicy: "- Giao hàng toàn quốc từ 1 - 3 ngày làm việc.",
    page: 1,
  },
  {
    id: 8,
    name: "GOOD BYE MY WORK TOTE BAG | BLUE",
    slug: "good-bye-my-work-tote-blue",
    price: "200.000₫",
    category: "TOTE BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/good-bye-my-work-tote-blue-4aa03f3e.webp",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/good-bye-my-work-tote-blue-4aa03f3e.webp",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/good-bye-my-work-tote-blue-4aa03f3e.webp",
    ],
    description: "Phiên bản màu xanh cobalt tươi mát của chiếc túi tote 'GOOD BYE MY WORK', thích hợp mang theo mỗi ngày.",
    highlights: [
      "Chất liệu vải canvas mềm mại, bền chắc",
      "Slogan in nổi bật mang tinh thần phóng khoáng",
      "Đựng vừa tập A4, ipad và vật dụng cá nhân",
    ],
    dimensions: {
      size: "38 × 40 × 8 cm",
      strapDrop: "30 cm",
      weight: "220g",
    },
    material: "100% Eco Cotton Canvas.",
    careInstructions: "- Giặt tay bằng nước thường, không sấy nhiệt độ cao.",
    shippingPolicy: "- Giao hàng toàn quốc từ 1 - 3 ngày làm việc.",
    page: 1,
  },
  {
    id: 9,
    name: "LEAGUE V2 TOTE BAG | SAND",
    slug: "league-v2-tote-sand",
    price: "790.000₫",
    category: "TOTE BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/league-v2-tote-sand-323c1b4a.webp",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/league-v2-tote-sand-323c1b4a.webp",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/league-v2-tote-sand-323c1b4a.webp",
    ],
    description: "Túi League V2 Tote Bag tông màu cát (Sand) phong cách Minimalist Nhật Bản, điểm xuyết các đường may tinh xảo cùng phom dáng hình học thanh thoát.",
    highlights: [
      "Gam màu Sand ấm áp nhẹ nhàng, dễ phối trang phục",
      "Chất vải dệt cao cấp chống xù lông và giữ phom tốt",
      "Có ngăn chống sốc chuyên dụng đựng vừa laptop 14 inch",
    ],
    dimensions: {
      size: "40 × 34 × 12 cm",
      strapDrop: "27 cm",
      weight: "420g",
    },
    material: "Premium Canvas kết hợp quai da PU cao cấp.",
    careInstructions: "- Vệ sinh bằng khăn ẩm và phơi khô râm mát.",
    shippingPolicy: "- Giao hàng 1 - 3 ngày. Đổi trả trong vòng 7 ngày.",
    page: 2,
  },
  {
    id: 10,
    name: "LEAGUE V2 TOTE BAG | DEEP BLUE",
    slug: "league-v2-tote-deep-blue",
    price: "790.000₫",
    category: "TOTE BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/league-v2-tote-deep-blue-7b2f0594.webp",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/league-v2-tote-deep-blue-7b2f0594.webp",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/league-v2-tote-deep-blue-7b2f0594.webp",
    ],
    description: "Sắc xanh thẳm Deep Blue trầm tĩnh mang lại vẻ ngoài lịch lãm và bí ẩn cho dòng túi League V2.",
    highlights: [
      "Màu sắc sâu lắng, bền màu theo thời gian",
      "Thiết kế quai xách công thái học giảm áp lực lên vai",
      "Đầy đủ ngăn phụ tiện dụng",
    ],
    dimensions: {
      size: "40 × 34 × 12 cm",
      strapDrop: "27 cm",
      weight: "420g",
    },
    material: "Premium Canvas dệt mật độ cao.",
    careInstructions: "- Giặt nhẹ bằng tay, tránh dùng hóa chất tẩy.",
    shippingPolicy: "- Giao hàng từ 1 - 3 ngày làm việc.",
    page: 2,
  },
  {
    id: 11,
    name: "LEAGUE V2 TOTE BAG | DUST BLACK",
    slug: "league-v2-tote-dust-black",
    price: "790.000₫",
    category: "TOTE BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/league-v2-tote-dust-black-e174e6e3.webp",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/league-v2-tote-dust-black-e174e6e3.webp",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/league-v2-tote-dust-black-e174e6e3.webp",
    ],
    outOfStock: true,
    description: "Màu Dust Black với hiệu ứng wash cổ điển, mang đậm tinh thần Grunge và Streetwear cá tính.",
    highlights: [
      "Hiệu ứng màu wash vintage cá tính",
      "Phom đứng chắc chắn, đường chỉ may đôi gia cường",
      "Ngăn chứa rộng rãi tối ưu",
    ],
    dimensions: {
      size: "40 × 34 × 12 cm",
      strapDrop: "27 cm",
      weight: "420g",
    },
    material: "Vintage Washed Cotton Canvas.",
    careInstructions: "- Lộn trái túi khi giặt để giữ hiệu ứng màu sắc.",
    shippingPolicy: "- Đổi trả trong 7 ngày đối với hàng lỗi sản xuất.",
    page: 2,
  },
  {
    id: 12,
    name: "LEAGUE V2 TOTE BAG | STONE BLUE",
    slug: "league-v2-tote-stone-blue",
    price: "790.000₫",
    category: "TOTE BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/league-v2-tote-stone-blue-2889bc1e.webp",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/league-v2-tote-stone-blue-2889bc1e.webp",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/league-v2-tote-stone-blue-2889bc1e.webp",
    ],
    description: "Sắc xanh đá Stone Blue độc đáo, điểm nhấn hoàn hảo cho những bạn trẻ yêu thích sự mới lạ và phong cách năng động.",
    highlights: [
      "Tông màu Stone Blue hiện đại, trẻ trung",
      "Quai xách êm ái, chống trượt khi đeo vai",
      "Cấu trúc các ngăn bố trí khoa học",
    ],
    dimensions: {
      size: "40 × 34 × 12 cm",
      strapDrop: "27 cm",
      weight: "420g",
    },
    material: "Premium High-density Canvas.",
    careInstructions: "- Phơi trong bóng râm, tránh phơi trực tiếp dưới ánh nắng gay gắt.",
    shippingPolicy: "- Đóng gói cẩn thận, giao hàng nhanh 1 - 3 ngày.",
    page: 2,
  },
  {
    id: 13,
    name: "ARCHIVE BAG | BLACK",
    slug: "archive-bag-black",
    price: "850.000₫",
    category: "SHOULDER BAG",
    image: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/product-19-1-530a3b5c.webp",
    hoverImage: "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/product-19-1-530a3b5c.webp",
    gallery: [
      "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/product-19-1-530a3b5c.webp",
    ],
    description: "Túi xách da PU unisex khóa gài kim loại Ninety Eight Archive Bag đeo vai hoặc cầm tay, phom dáng cổ điển kết hợp phong cách hiện đại.",
    highlights: [
      "Chất liệu da PU vân mịn cao cấp, bề mặt chống nước tốt",
      "Khóa gài kim loại mạ sáng bóng, đóng mở chắc chắn",
      "Form cứng cáp, tôn dáng khi phối cùng mọi trang phục",
    ],
    dimensions: {
      size: "32 × 20 × 9 cm",
      strapDrop: "25 cm",
      weight: "460g",
    },
    material: "Premium PU Leather. Khóa hợp kim kẽm mạ crom.",
    careInstructions: "- Lau bằng khăn mềm khô hoặc xi dưỡng chuyên dụng cho đồ da.",
    shippingPolicy: "- Bảo hành phụ kiện 6 tháng. Đổi trả 7 ngày.",
    page: 2,
  },
];

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(currentId: number, limit = 4): ShopProduct[] {
  return SHOP_PRODUCTS.filter((p) => p.id !== currentId).slice(0, limit);
}
