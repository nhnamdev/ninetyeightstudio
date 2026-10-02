"use client";

import React, { useState, useRef, useMemo } from "react";
import { SHOP_PRODUCTS, ShopProduct } from "@/data/shopProducts";
import { ShopProductCard } from "./ShopProductCard";

interface ShopProductGridProps {
  initialPage?: number;
}

const CATEGORIES = ["TẤT CẢ", "TOTE BAG", "SHOULDER BAG", "TRAVEL BAG"] as const;

export const ShopProductGrid: React.FC<ShopProductGridProps> = ({
  initialPage = 1,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("TẤT CẢ");
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const ITEMS_PER_PAGE = 8;

  // Filter products by category
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "TẤT CẢ") {
      return SHOP_PRODUCTS;
    }
    return SHOP_PRODUCTS.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  // Products for the current page
  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

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

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 pb-3 border-b border-neutral-100">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold tracking-wider rounded uppercase transition-all ${
                isActive
                  ? "bg-black text-white shadow-sm"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 hover:text-black"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

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

      {/* Pagination Bar (show if more than 1 page) */}
      {totalPages > 1 && (
        <div className="shop-pagination-wrap mt-10">
          <ul className="shop-pagination flex items-center justify-center gap-2">
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

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <li key={pageNum} className="shop-page-item">
                <button
                  type="button"
                  className={`shop-page-btn ${currentPage === pageNum ? "active" : ""}`}
                  onClick={() => handlePageChange(pageNum)}
                  aria-current={currentPage === pageNum ? "page" : undefined}
                >
                  {pageNum}
                </button>
              </li>
            ))}

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
          </ul>
        </div>
      )}
    </div>
  );
};
