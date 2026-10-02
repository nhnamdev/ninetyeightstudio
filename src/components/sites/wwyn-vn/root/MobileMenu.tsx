"use client";

import React, { useState } from "react";
import Link from "next/link";
import { HIGHLIGHT_CATEGORIES, PRODUCT_CATEGORIES } from "./MegaMenu";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [subpanelOpen, setSubpanelOpen] = useState(false);

  const handleClose = () => {
    setSubpanelOpen(false);
    onClose();
  };

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className={`mobile-drawer-overlay ${isOpen ? "open" : ""}`}
        onClick={handleClose}
      />

      {/* Drawer */}
      <div className={`mobile-drawer ${isOpen ? "open" : ""}`}>
        {/* Main Panel */}
        <div className="mobile-drawer-header">
          <span>Menu</span>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 text-black bg-transparent border-0 cursor-pointer"
            aria-label="Đóng menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="mobile-drawer-nav">
          <ul>
            <li>
              <Link href="/" onClick={handleClose}>
                Trang chủ
              </Link>
            </li>
            <li>
              <Link href="/gioi-thieu" onClick={handleClose}>
                Giới thiệu
              </Link>
            </li>
            <li>
              <button
                type="button"
                className="nav-btn"
                onClick={() => setSubpanelOpen(true)}
              >
                <span>Shop</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </li>
            <li>
              <Link href="#" onClick={handleClose}>
                Styling Tip
              </Link>
            </li>
            <li>
              <Link href="#" onClick={handleClose}>
                Bộ sưu tập
              </Link>
            </li>
            <li>
              <Link href="/lien-he" onClick={handleClose}>
                Liên hệ
              </Link>
            </li>
            <li>
              <Link href="/my-account" onClick={handleClose}>
                Tài khoản của tôi
              </Link>
            </li>
          </ul>
        </div>

        {/* Subpanel for Shop */}
        <div className={`mobile-subpanel ${subpanelOpen ? "open" : ""}`}>
          <div
            className="mobile-subpanel-header"
            onClick={() => setSubpanelOpen(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            <span>Shop</span>
          </div>
          <div className="mobile-drawer-nav">
            <div className="px-5 pt-3 pb-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Nổi bật
            </div>
            <ul>
              {HIGHLIGHT_CATEGORIES.map((cat, idx) => (
                <li key={`hl-${idx}`}>
                  <Link href={cat.href} onClick={handleClose}>
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="px-5 pt-4 pb-1 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Sản phẩm
            </div>
            <ul>
              {PRODUCT_CATEGORIES.map((cat, idx) => (
                <li key={`prod-${idx}`}>
                  <Link href={cat.href} onClick={handleClose}>
                    {cat.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
