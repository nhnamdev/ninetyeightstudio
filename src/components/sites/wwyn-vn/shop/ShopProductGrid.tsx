"use client";

import React, { useState, useRef } from "react";
import { SHOP_PRODUCTS, ShopProduct } from "@/data/shopProducts";
import { ShopProductCard } from "./ShopProductCard";

interface ShopProductGridProps {
  initialPage?: number;
}

export const ShopProductGrid: React.FC<ShopProductGridProps> = ({
  initialPage = 1,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = 2;

  // Filter products by page
  const displayedProducts = SHOP_PRODUCTS.filter(
    (product) => product.page === currentPage
  );

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleAddToCart = (product: ShopProduct) => {
    setToastMessage(`Đã thêm "${product.name}" vào giỏ hàng!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div ref={containerRef} className="w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[300] bg-black text-white px-5 py-3 rounded-md shadow-2xl text-sm font-medium flex items-center gap-3 animate-fade-in border border-neutral-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Grid of Product Cards */}
      <div className="shop-product-grid">
        {displayedProducts.map((product) => (
          <ShopProductCard
            key={product.id}
            product={product}
            onAddToCart={handleAddToCart}
          />
        ))}
      </div>

      {/* Pagination Bar */}
      <div className="shop-pagination-wrap">
        <ul className="shop-pagination">
          {/* First Page Button */}
          <li className="shop-page-item">
            <button
              type="button"
              className="shop-page-btn"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              aria-label="Trang đầu"
              title="Trang đầu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="11 17 6 12 11 7"></polyline>
                <polyline points="18 17 13 12 18 7"></polyline>
              </svg>
            </button>
          </li>

          {/* Prev Page Button */}
          <li className="shop-page-item">
            <button
              type="button"
              className="shop-page-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Trang trước"
              title="Trang trước"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
          </li>

          {/* Page Number 1 */}
          <li className="shop-page-item">
            <button
              type="button"
              className={`shop-page-btn ${currentPage === 1 ? "active" : ""}`}
              onClick={() => handlePageChange(1)}
              aria-current={currentPage === 1 ? "page" : undefined}
            >
              1
            </button>
          </li>

          {/* Page Number 2 */}
          <li className="shop-page-item">
            <button
              type="button"
              className={`shop-page-btn ${currentPage === 2 ? "active" : ""}`}
              onClick={() => handlePageChange(2)}
              aria-current={currentPage === 2 ? "page" : undefined}
            >
              2
            </button>
          </li>

          {/* Next Page Button */}
          <li className="shop-page-item">
            <button
              type="button"
              className="shop-page-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Trang sau"
              title="Trang sau"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
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

          {/* Last Page Button */}
          <li className="shop-page-item">
            <button
              type="button"
              className="shop-page-btn"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Trang cuối"
              title="Trang cuối"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="13 17 18 12 13 7"></polyline>
                <polyline points="6 17 11 12 6 7"></polyline>
              </svg>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
