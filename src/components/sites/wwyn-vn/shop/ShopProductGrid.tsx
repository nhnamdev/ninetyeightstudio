"use client";

import React, { useState, useRef, useMemo } from "react";
import { SHOP_PRODUCTS, ShopProduct } from "@/data/shopProducts";
import { ShopProductCard } from "./ShopProductCard";
import { useCart } from "@/context/CartContext";

interface ShopProductGridProps {
  initialPage?: number;
}

const CATEGORIES = ["TẤT CẢ", "TOTE BAG", "SHOULDER BAG", "TRAVEL BAG"] as const;

export const ShopProductGrid: React.FC<ShopProductGridProps> = ({
  initialPage = 1,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("TẤT CẢ");
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

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
    addToCart(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        quantity: 1,
      },
      true
    );
  };

  return (
    <div ref={containerRef} className="w-full">
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
