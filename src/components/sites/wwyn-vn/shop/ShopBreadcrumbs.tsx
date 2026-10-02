import React from "react";
import Link from "next/link";

interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

interface ShopBreadcrumbsProps {
  items?: BreadcrumbItem[];
}

export const ShopBreadcrumbs: React.FC<ShopBreadcrumbsProps> = ({
  items = [
    { label: "Trang chủ", href: "/" },
    { label: "Cửa hàng", active: true },
  ],
}) => {
  return (
    <div className="shop-breadcrumbs">
      <div className="wwyn-center">
        <nav aria-label="breadcrumb">
          <ol>
            {items.map((item, index) => (
              <li
                key={index}
                className={item.active ? "active" : ""}
                aria-current={item.active ? "page" : undefined}
              >
                {item.active || !item.href ? (
                  <span>{item.label}</span>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>
    </div>
  );
};
