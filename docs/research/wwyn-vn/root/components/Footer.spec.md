# Footer Specification

## Overview
- **Target file:** `src/components/sites/wwyn-vn/root/Footer.tsx`
- **Screenshot:** `docs/design-references/wwyn-vn/root/desktop-full.png`
- **Interaction model:** Interactive newsletter form, hover state on links, responsive stack for mobile.

## DOM Structure
- `#footer`:
  - `.footer-top`:
    - `.center.d-flex.flex-wrap.justify-content-between`:
      - `.footer-1`:
        - Heading: "ĐĂNG KÝ NHẬN BẢN TIN"
        - Form: Input + submit button (`dknticon.png`)
        - Slogan / disclaimer text
        - Social icons: Facebook, Instagram, TikTok
      - `.footer-2`: "CHÍNH SÁCH" + 6 links
      - `.footer-3`: "HỖ TRỢ KHÁCH HÀNG" + 4 links
      - `.footer-4`: "WWYN STU" + Address & Hours
      - `.footer-5`: "MENU" + 6 category links
  - `.footer-bottom`:
    - Left: Copyright text
    - Right: `.footer-bottom_right` with `STORE LOCATION` and `NATIONWIDE DELIVERY`

## Computed Styles
- `.footer-top`: padding 70px 0 (desktop) / 30px 0 (mobile), border-top & bottom 1px solid rgba(26,26,26,0.2)
- `.footer-tit`: font-size 13px, font-weight 700, uppercase, margin-bottom 30px
- `.form-dknt`: border-bottom 1px solid black, height 42px, display flex
- `.footer-list li a`: font-size 13px, color: rgb(33, 37, 41), hover: underline or darker
- `.copyright`: font-size 12px
- `.footer-bottom`: height 58px (desktop), height 106px (mobile)

## Assets
- `/sites/wwyn-vn/root/images/dknticon.png`
- `/sites/wwyn-vn/root/images/facebook.webp`
- `/sites/wwyn-vn/root/images/instagram.webp`
- `/sites/wwyn-vn/root/images/tiktok.webp`
- `/sites/wwyn-vn/root/images/location.png`
- `/sites/wwyn-vn/root/images/global.png`
