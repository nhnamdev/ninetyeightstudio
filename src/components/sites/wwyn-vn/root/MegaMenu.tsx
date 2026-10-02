"use client";

import React from "react";
import Link from "next/link";

export interface CategoryItem {
  title: string;
  href: string;
}

export const CATEGORIES: CategoryItem[] = [
  { title: "T - SHIRT", href: "/cua-hang" },
  { title: "SHIRT", href: "/cua-hang" },
  { title: "JACKET", href: "/cua-hang" },
  { title: "SHORTS", href: "/cua-hang" },
  { title: "TROUSERS", href: "/cua-hang" },
  { title: "ACCESSORIES", href: "/cua-hang" },
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
      <div className="wwyn-center1366">
        <ul>
          {CATEGORIES.map((item, index) => (
            <li key={index}>
              <Link
                href={item.href}
                className="mega-title transition"
                title={item.title}
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
