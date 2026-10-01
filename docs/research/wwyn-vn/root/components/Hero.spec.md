# Hero Specification

## Overview
- **Target file:** `src/components/sites/wwyn-vn/root/Hero.tsx`
- **Screenshot:** `docs/design-references/wwyn-vn/root/desktop-viewport.png`
- **Interaction model:** Interactive CTA button with hover inverse transition, responsive full-width banner.

## DOM Structure
- `.slideshow`: Relative container, full width
  - `.swiper-slide`: Contains:
    - Background banner image (`hero-banner.webp`, 1920x1080 scaled to viewport)
    - `.slideshow-ab`: Absolute positioned overlay
      - `.center`: Inner alignment container
        - `.slideshow-btn`: Button wrapper
          - `.btn-slideshow`: Border 2px solid #ffffff, width 200px, height 48px, text "MUA NGAY"
  - `.pagination-slideshow`: Centered pagination bullet

## Computed Styles
- `.btn-slideshow`:
  - border: 2px solid rgb(255, 255, 255)
  - width: 200px, height: 48px
  - color: rgb(255, 255, 255)
  - font-size: 16px, font-weight: 700, text-transform: uppercase
  - transition: all 0.3s ease
  - hover: background-color: #ffffff, color: #000000

## Assets
- `/sites/wwyn-vn/root/images/hero-banner.webp`
