"use client";

import React from "react";
import Link from "next/link";

export interface CategoryItem {
  title: string;
  href: string;
}

export const HIGHLIGHT_CATEGORIES: CategoryItem[] = [
  { title: "NEW ARRIVAL", href: "/cua-hang?filter=new-arrival" },
  { title: "TẤT CẢ SẢN PHẨM", href: "/cua-hang" },
  { title: "BEST SELLER", href: "/cua-hang?filter=best-seller" },
];

export const PRODUCT_CATEGORIES: CategoryItem[] = [
  { title: "TÚI TO", href: "/cua-hang?category=TOTE+BAG" },
  { title: "TÚI VỪA", href: "/cua-hang?category=SHOULDER+BAG" },
  { title: "TÚI DU LỊCH", href: "/cua-hang?category=TRAVEL+BAG" },
  { title: "PHỤ KIỆN", href: "/cua-hang?category=ACCESSORIES" },
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
                src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/banners/mega-menu-bags-68fe3e75.webp"
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
