# WWYN Page Topology

## Overview
- Source URL: `https://wwyn.vn/`
- Destination route: `src/app/page.tsx`
- Layout: Sticky Header + Hero Banner + Footer + Modals/Drawers

## Section Hierarchy

```
App Container
├── Mobile Drawer Menu (#mmenu) [Fixed, Hidden by default, Slides in from left]
├── Header Section
│   ├── Desktop Header (#menu) [Sticky, Top 0, z-index 99]
│   │   ├── Center Container (max-width: 1440px / 1366px)
│   │   │   ├── Logo (wwyn.)
│   │   │   ├── Main Menu Links (Giới thiệu, Cửa hàng, Styling Tip, Bộ sưu tập, Liên hệ)
│   │   │   └── Utility Icons (Language VN/EN, Search, User, Cart)
│   │   └── Mega Menu (.menu-cuahang) [Dropdown for Cửa hàng, absolute, full width]
│   └── Mobile Header (#menu-mobile) [Sticky, Top 0, visible < 1024px]
│       ├── Hamburger Button
│       ├── Centered Logo
│       └── Mobile Utility Icons (Language, Search, User, Cart)
├── Hero Slideshow Section (.slideshow) [Relative, Full Width]
│   ├── Swiper Slide (.swiper-slide)
│   │   ├── Background Image (`hero-banner.webp`)
│   │   └── Overlay Content (.slideshow-ab)
│   │       └── CTA Button ("MUA NGAY")
│   └── Swiper Pagination (.pagination-slideshow)
├── Footer Section (#footer) [Relative, z-index 10]
│   ├── Footer Top (.footer-top) [Border top & bottom, padding 70px 0 / 30px 0]
│   │   ├── Col 1: Newsletter Form + Disclaimer + Social Media Links
│   │   ├── Col 2: Policy Links (Chính sách thanh toán, đặt hàng, kiểm hàng, bảo mật, đổi trả, bảo vệ thông tin)
│   │   ├── Col 3: Customer Care (Câu hỏi thường gặp, Tra cứu đơn hàng, Chính sách đổi hàng, Chính sách giao hàng)
│   │   ├── Col 4: Store Info (Wardrobe Arc address, Opening hours)
│   │   └── Col 5: Menu Categories (T - SHIRT, SHIRT, JACKET, SHORTS, TROUSERS, ACCESSORIES)
│   └── Footer Bottom (.footer-bottom) [Border top / bottom, height 58px / 106px mobile]
│       ├── Copyright Notice
│       └── Store Location & Nationwide Delivery Action Items
└── Overlay Modals
    ├── Search Box Overlay / Dropdown
    ├── Cart Drawer / Quick View Modal
    └── Toast Notification
```
