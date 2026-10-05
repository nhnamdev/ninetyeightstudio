"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchDropdown } from "./SearchDropdown";
import { CartModal } from "./CartModal";
import { AuthModal } from "./AuthModal";
import { TopBar } from "./TopBar";
import { useCart } from "@/context/CartContext";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const isCuahang = pathname?.startsWith("/cua-hang");
  const isGioithieu = pathname?.startsWith("/gioi-thieu");
  const isLienhe = pathname?.startsWith("/lien-he");
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { totalCount, setIsCartOpen } = useCart();
  const [megaMenuHover, setMegaMenuHover] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<"VN" | "EN">("VN");

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnterCuahang = () => {
    if (megaMenuTimeoutRef.current) clearTimeout(megaMenuTimeoutRef.current);
    setMegaMenuHover(true);
  };

  const handleMouseLeaveCuahang = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setMegaMenuHover(false);
    }, 150);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Top Announcement Bar */}
      <TopBar />

      {/* ================= DESKTOP HEADER ================= */}
      <header id="menu" className={isScrolled ? "fixing" : ""}>
        <div className="wwyn-center center-header">
          {/* Logo */}
          <div className="logo">
            <Link href="/" title="Ninety Eight Studio">
              <span className="logo-text">NINETY EIGHT STUDIOS</span>
            </Link>
          </div>

          {/* Main Navigation Links */}
          <ul className="main-menu">
            <li>
              <Link
                href="/gioi-thieu"
                title="Giới thiệu"
                className={`transition ${isGioithieu ? "active" : ""}`}
              >
                Giới thiệu
              </Link>
            </li>

            <li
              className="cuahang"
              onMouseEnter={handleMouseEnterCuahang}
              onMouseLeave={handleMouseLeaveCuahang}
            >
              <Link
                href="/cua-hang"
                title="Shop"
                className={`transition ${isCuahang ? "active" : ""}`}
              >
                <span>Shop</span>
                <img
                  src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/branding/iconhaschild-d09e3324.png"
                  alt="Has Child"
                  className="has-child-icon"
                />
              </Link>
            </li>

            <li>
              <Link
                href="#"
                title="Styling Tip"
                className="transition"
              >
                Styling Tip
              </Link>
            </li>

            <li className="bosuutap">
              <Link
                href="#"
                title="Bộ sưu tập"
                className="transition"
              >
                Bộ sưu tập
              </Link>
            </li>

            <li>
              <Link
                href="/lien-he"
                title="Liên hệ"
                className={`transition ${isLienhe ? "active" : ""}`}
              >
                Liên hệ
              </Link>
            </li>

            {/* Utility Icons Bar */}
            <li>
              <div className="menu-bar">
                {/* Language Switcher */}
                <div
                  className={`flag-menu ${langOpen ? "open" : ""}`}
                  onClick={() => setLangOpen(!langOpen)}
                >
                  <div className="flag-active">
                    <img
                      src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/ngonngu-073e666a.png"
                      alt="Ngôn ngữ"
                      className="menu-icon"
                    />
                    <div className="flag-text">{currentLang}</div>
                  </div>
                  <div className="flag-option">
                    <div
                      className="btn-lang_item cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentLang("VN");
                        setLangOpen(false);
                      }}
                    >
                      VN
                    </div>
                    <div
                      className="btn-lang_item cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentLang("EN");
                        setLangOpen(false);
                      }}
                    >
                      EN
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <div className="search-menu">
                  <div
                    className="search-btn"
                    onClick={() => setSearchOpen(!searchOpen)}
                    role="button"
                    tabIndex={0}
                    aria-label="Tìm kiếm"
                  >
                    <img
                      src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/timkiem-04be7d00.png"
                      alt="Tìm kiếm"
                      className="menu-icon"
                    />
                  </div>
                  <SearchDropdown
                    isOpen={searchOpen}
                    onClose={() => setSearchOpen(false)}
                  />
                </div>

                {/* User Account */}
                <div className="user-menu">
                  <Link
                    href="/my-account"
                    title="Tài khoản của tôi"
                    className="p-0 border-none bg-transparent cursor-pointer flex items-center justify-center"
                    aria-label="Tài khoản của tôi"
                  >
                    <img
                      src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/branding/user-dd07cbe3.png"
                      alt="Tài khoản"
                      className="menu-icon"
                    />
                  </Link>
                </div>

                {/* Cart Button */}
                <div className="cart-menu">
                  <div
                    className="cursor-pointer relative"
                    onClick={() => setIsCartOpen(true)}
                    role="button"
                    tabIndex={0}
                    aria-label="Giỏ hàng"
                  >
                    <img
                      src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/branding/cart-2b55cbd4.png"
                      alt="Giỏ hàng"
                      className="menu-icon"
                    />
                    {totalCount > 0 && (
                      <span className="absolute -top-1.5 -right-2 bg-neutral-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-sm">
                        {totalCount > 99 ? "99+" : totalCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>

        {/* Mega Menu Dropdown spanning 100% width of #menu */}
        <MegaMenu
          isOpen={megaMenuHover}
          onMouseEnter={handleMouseEnterCuahang}
          onMouseLeave={handleMouseLeaveCuahang}
        />
      </header>

      {/* ================= MOBILE HEADER ================= */}
      <header id="menu-mobile">
        <div className="menu-bar-res">
          {/* Hamburger Icon */}
          <div className="mmenu-ham">
            <div
              id="hamburger"
              className={mobileMenuOpen ? "open" : ""}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              role="button"
              tabIndex={0}
              aria-label="Menu"
            >
              <span></span>
            </div>
          </div>

          {/* Centered Logo */}
          <div className="logo">
            <Link href="/" title="Ninety Eight Studio">
              <span className="logo-text">NINETY EIGHT STUDIOS</span>
            </Link>
          </div>

          {/* Mobile Utility Icons */}
          <div className="menu-bar">
            {/* Language Switcher */}
            <div
              className={`flag-menu ${langOpen ? "open" : ""}`}
              onClick={() => setLangOpen(!langOpen)}
            >
              <div className="flag-active">
                <img
                  src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/ngonngu-073e666a.png"
                  alt="Ngôn ngữ"
                  className="menu-icon"
                />
                <div className="flag-text">{currentLang}</div>
              </div>
              <div className="flag-option">
                <div
                  className="btn-lang_item cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentLang("VN");
                    setLangOpen(false);
                  }}
                >
                  VN
                </div>
                <div
                  className="btn-lang_item cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentLang("EN");
                    setLangOpen(false);
                  }}
                >
                  EN
                </div>
              </div>
            </div>

            {/* Search Trigger */}
            <div className="search-menu">
              <div
                className="search-btn"
                onClick={() => setSearchOpen(!searchOpen)}
                role="button"
                tabIndex={0}
                aria-label="Tìm kiếm"
              >
                <img
                  src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/timkiem-04be7d00.png"
                  alt="Tìm kiếm"
                  className="menu-icon"
                />
              </div>
              <SearchDropdown
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)}
              />
            </div>

            {/* User */}
            <div className="user-menu">
              <Link
                href="/my-account"
                title="Tài khoản của tôi"
                className="p-0 border-none bg-transparent cursor-pointer flex items-center justify-center"
                aria-label="Tài khoản của tôi"
              >
                <img
                  src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/branding/user-dd07cbe3.png"
                  alt="Tài khoản"
                  className="menu-icon"
                />
              </Link>
            </div>

            {/* Cart */}
            <div className="cart-menu">
              <div
                className="cursor-pointer relative"
                onClick={() => setIsCartOpen(true)}
                role="button"
                tabIndex={0}
                aria-label="Giỏ hàng"
              >
                <img
                  src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/branding/cart-2b55cbd4.png"
                  alt="Giỏ hàng"
                  className="menu-icon"
                />
                {totalCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-neutral-900 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-sm">
                    {totalCount > 99 ? "99+" : totalCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Cart Modal */}
      <CartModal />

      {/* Auth Modal (Login / Register) */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
};
