"use client";

import React from "react";
import Link from "next/link";

export interface CategoryItem {
  title: string;
  href: string;
}

export const HIGHLIGHT_CATEGORIES: CategoryItem[] = [
  { title: "NEW ARRIVAL", href: "/cua-hang" },
  { title: "TẤT CẢ SẢN PHẨM", href: "/cua-hang" },
  { title: "BEST SELLER", href: "/cua-hang" },
];

export const PRODUCT_CATEGORIES: CategoryItem[] = [
  { title: "TÚI TO", href: "/cua-hang" },
  { title: "TÚI VỪA", href: "/cua-hang" },
  { title: "TÚI NHỎ", href: "/cua-hang" },
  { title: "PHỤ KIỆN", href: "/cua-hang" },
];

// For backward compatibility
export const CATEGORIES: CategoryItem[] = [
  ...HIGHLIGHT_CATEGORIES,
  ...PRODUCT_CATEGORIES,
];

interface MegaMenuProps {
  isOpen?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onMouseEnter,
  onMouseLeave,
}) => {
  return (
    <div
      className={`menu-cuahang mega-menu ${isOpen ? "active" : ""}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="wwyn-center mega-menu-container">
        <div className="mega-menu-grid">
          {/* Column 1: NỔI BẬT */}
          <div className="mega-menu-col">
            <h3 className="mega-col-title">NỔI BẬT</h3>
            <div className="mega-col-links">
              {HIGHLIGHT_CATEGORIES.map((item, index) => (
                <div key={index} className="mega-item-wrap">
                  <Link
                    href={item.href}
                    className="mega-link"
                    title={item.title}
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: SẢN PHẨM */}
          <div className="mega-menu-col">
            <h3 className="mega-col-title">SẢN PHẨM</h3>
            <div className="mega-col-links">
              {PRODUCT_CATEGORIES.map((item, index) => (
                <div key={index} className="mega-item-wrap">
                  <Link
                    href={item.href}
                    className="mega-link"
                    title={item.title}
                  >
                    {item.title}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Banner túi bên phải */}
          <div className="mega-menu-banner">
            <Link
              href="/cua-hang"
              title="Bộ sưu tập túi Ninety Eight Studio"
              className="mega-banner-link"
            >
              <img
                src="/sites/wwyn-vn/root/images/mega-menu-bags.webp"
                alt="Bộ sưu tập túi Ninety Eight Studio"
                width={550}
                height={420}
                className="mega-banner-img"
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
