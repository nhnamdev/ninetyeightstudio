"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchDropdown } from "./SearchDropdown";
import { CartModal } from "./CartModal";
import { TopBar } from "./TopBar";

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
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
              <img
                src="/sites/wwyn-vn/root/images/logo_98.png"
                alt="Ninety Eight Studio"
                width={140}
                height={32}
                decoding="async"
                fetchPriority="high"
                className="logo-img"
              />
            </Link>
          </div>

          {/* Main Navigation Links */}
          <ul className="main-menu">
            <li>
              <Link
                href="#"
                title="Giới thiệu"
                className="transition"
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
                href="#"
                title="Cửa hàng"
                className="transition"
              >
                <span>Cửa hàng</span>
                <img
                  src="/sites/wwyn-vn/root/images/iconhaschild.png"
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
                href="#"
                title="Liên hệ"
                className="transition"
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
                      src="/sites/wwyn-vn/root/images/ngonngu.png"
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
                      src="/sites/wwyn-vn/root/images/timkiem.png"
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
                  <Link href="#" title="User">
                    <img
                      src="/sites/wwyn-vn/root/images/user.png"
                      alt="User"
                      className="menu-icon"
                    />
                  </Link>
                </div>

                {/* Cart Button */}
                <div className="cart-menu">
                  <div
                    className="cursor-pointer"
                    onClick={() => setCartOpen(true)}
                    role="button"
                    tabIndex={0}
                    aria-label="Giỏ hàng"
                  >
                    <img
                      src="/sites/wwyn-vn/root/images/cart.png"
                      alt="Giỏ hàng"
                      className="menu-icon"
                    />
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
              <img
                src="/sites/wwyn-vn/root/images/logo_98.png"
                alt="Ninety Eight Studio"
                width={120}
                height={28}
                decoding="async"
                fetchPriority="high"
              />
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
                  src="/sites/wwyn-vn/root/images/ngonngu.png"
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
                  src="/sites/wwyn-vn/root/images/timkiem.png"
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
              <Link href="#" title="User">
                <img
                  src="/sites/wwyn-vn/root/images/user.png"
                  alt="User"
                  className="menu-icon"
                />
              </Link>
            </div>

            {/* Cart */}
            <div className="cart-menu">
              <div
                className="cursor-pointer"
                onClick={() => setCartOpen(true)}
                role="button"
                tabIndex={0}
                aria-label="Giỏ hàng"
              >
                <img
                  src="/sites/wwyn-vn/root/images/cart.png"
                  alt="Giỏ hàng"
                  className="menu-icon"
                />
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
      <CartModal isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};
