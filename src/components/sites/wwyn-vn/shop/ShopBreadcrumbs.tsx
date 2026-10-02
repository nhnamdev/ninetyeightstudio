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
    <div className="w-full bg-white border-b border-neutral-100 py-3 select-none">
      <div className="wwyn-center">
        <nav aria-label="Breadcrumb" className="w-full overflow-x-auto scrollbar-none">
          <ol className="flex items-center gap-1.5 sm:gap-2 text-[12px] font-medium tracking-wide whitespace-nowrap text-neutral-400">
            {items.map((item, index) => {
              const isLast = index === items.length - 1;
              const isActive = item.active || isLast;

              return (
                <li key={index} className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  {index > 0 && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-neutral-300 flex-shrink-0"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  )}

                  {isActive || !item.href ? (
                    <span
                      className="text-neutral-900 font-semibold truncate max-w-[200px] sm:max-w-[400px]"
                      aria-current="page"
                      title={item.label}
                    >
                      {item.label}
                    </span>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-neutral-400 hover:text-black transition-colors"
                      title={item.label}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
};
