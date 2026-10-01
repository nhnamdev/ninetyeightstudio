# Navbar Specification

## Overview
- **Target file:** `src/components/sites/wwyn-vn/root/Navbar.tsx`
- **Screenshot:** `docs/design-references/wwyn-vn/root/desktop-viewport.png`
- **Interaction model:** Sticky on scroll, hover-driven dropdowns, click-driven search and mobile drawer.

## DOM Structure
- `#menu`: Desktop sticky header (`height: 54px`, `background: rgba(26,26,26,0.3)`)
  - `.center`: Max-width 1440px flex container, space-between
    - `.logo`: Left-aligned logo `logo.webp` (height ~38px)
    - `.main-menu`: Flex row, gap 60px
      - Menu items: Giới thiệu, Cửa hàng (with `iconhaschild.png`), Styling Tip, Bộ sưu tập, Liên hệ
      - `.menu-bar`: Utility container (Language VN/EN, Search icon, User icon, Cart icon)
    - `.menu-cuahang.mega-menu`: Full-width absolute dropdown under header (bg: white, border top/bottom)
- `#menu-mobile`: Mobile sticky header (visible < 1024px)
  - Hamburger icon on left
  - Centered logo
  - Utility icons on right

## Computed Styles
- Height: 54px
- Font size: 12px, font-weight: 500, uppercase
- Text color: rgb(255, 255, 255)
- Background: rgba(26, 26, 26, 0.3)
- Z-index: 99
- Transitions: all 0.3s ease

## Assets
- `/sites/wwyn-vn/root/images/logo.webp`
- `/sites/wwyn-vn/root/images/iconhaschild.png`
- `/sites/wwyn-vn/root/images/ngonngu.png`
- `/sites/wwyn-vn/root/images/timkiem.png`
- `/sites/wwyn-vn/root/images/user.png`
- `/sites/wwyn-vn/root/images/cart.png`
