# WWYN Behaviors Guide

## 1. Navbar & Header Behavior
- **Desktop Navbar (`#menu`)**:
  - Sticky at `top: 0`, `z-index: 9`.
  - Initial background: `rgba(26, 26, 26, 0.3)` over hero image, with smooth transition.
  - On scroll past 50px: background deepens to `rgba(20, 20, 20, 0.95)` with backdrop filter blur for readability.
  - Mega Menu: Hovering over `CỬA HÀNG` slides down / fades in `.menu-cuahang` full width (100% width, height 94px, white background, borders top/bottom `rgba(26,26,26,0.2)`).
  - Search trigger: Clicking the search icon opens the inline search box (`.search`), focusing the input. Clicking the close (x) button closes it.
  - Language selector: Hovering/clicking `.flag-menu` reveals `.flag-option` dropdown with `VN` and `EN`.

- **Mobile Navbar (`#menu-mobile`)**:
  - Visible on screens `< 1024px`.
  - Hamburger icon on left toggles off-canvas drawer.
  - Centered WWYN logo.
  - Right icons: Language, Search, User, Cart.
  - Mobile search button toggles dropdown search input.

## 2. Mobile Drawer Navigation (`#mmenu`)
- Slide-in from left with smooth cubic-bezier transition.
- Semi-transparent backdrop overlay.
- Two-level navigation:
  - Main panel: Trang chủ, Giới thiệu, Cửa hàng (>), Styling Tip, Bộ sưu tập, Liên hệ.
  - Cửa hàng subpanel: Back button (<) + T - SHIRT, SHIRT, JACKET, SHORTS, TROUSERS, ACCESSORIES.

## 3. Hero Slideshow
- Full-width hero banner image `hero-banner.webp`.
- Centered CTA button: "MUA NGAY" in white 2px border, uppercase, bold font.
- Hover effect: Inverts to white background with black text, smooth 0.3s transition.
- Swiper dot pagination at bottom center.

## 4. Newsletter Subscription Form
- Underlined minimal input field with placeholder "Nhập địa chỉ email*".
- Submit button with arrow icon.
- Hover state on submit button: slight scale/shift.
- Social icons (Facebook, Instagram, TikTok) with hover opacity/scale transitions.

## 5. Footer & Bottom Bar
- 5-column layout on desktop:
  - Column 1: Đăng ký nhận bản tin + form + policy disclaimer + social icons
  - Column 2: Chính sách (6 links)
  - Column 3: Hỗ trợ khách hàng (4 links)
  - Column 4: WWYN STU (Address, Hours)
  - Column 5: MENU (6 category links)
- Bottom bar:
  - Left: Copyright text.
  - Right: Store Location & Nationwide Delivery links with icons.
- Responsive Mobile:
  - Stacks into vertical accordion/column blocks.
  - Store Location & Nationwide Delivery split into a 2-column row above copyright.
