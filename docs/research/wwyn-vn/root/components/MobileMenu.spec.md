# MobileMenu Specification

## Overview
- **Target file:** `src/components/sites/wwyn-vn/root/MobileMenu.tsx`
- **Screenshot:** `docs/design-references/wwyn-vn/root/mobile-viewport.png`
- **Interaction model:** Off-canvas slide-out menu with backdrop overlay and nested category panel.

## DOM Structure
- Backdrop: fixed inset-0, bg-black/60, z-index 100
- Panel: fixed top-0 bottom-0 left-0, width 300px, max-w-[85vw], bg-white, z-index 101
  - Panel Header: Title ("Menu"), Close button
  - Main Level:
    - Trang chủ
    - Giới thiệu
    - Cửa hàng (with arrow button to navigate to subpanel)
    - Styling Tip
    - Bộ sưu tập
    - Liên hệ
  - Subpanel:
    - Back button (< Quay lại)
    - T - SHIRT
    - SHIRT
    - JACKET
    - SHORTS
    - TROUSERS
    - ACCESSORIES
