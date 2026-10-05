"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SHOP_PRODUCTS, ShopProduct } from "@/data/shopProducts";
import { ShopProductCard } from "./ShopProductCard";
import { useCart } from "@/context/CartContext";

interface ShopProductGridProps {
  initialPage?: number;
}

const CATEGORIES = [
  "TẤT CẢ",
  "TOTE BAG",
  "SHOULDER BAG",
  "TRAVEL BAG",
  "ACCESSORIES",
] as const;

export const ShopProductGrid: React.FC<ShopProductGridProps> = ({
  initialPage = 1,
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const urlCategory = searchParams.get("category");
  const urlFilter = searchParams.get("filter");
  const urlQuery = searchParams.get("q") || "";

  // Derive category from URL if present
  const derivedCategory = useMemo(() => {
    if (urlCategory) {
      const match = CATEGORIES.find(
        (c) => c.toLowerCase() === urlCategory.toLowerCase()
      );
      if (match) return match;
    }
    return "TẤT CẢ";
  }, [urlCategory]);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const selectedCategory = activeCategory ?? derivedCategory;
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [productsList, setProductsList] = useState<ShopProduct[]>(SHOP_PRODUCTS);

  const ITEMS_PER_PAGE = 8;

  // Live fetch from backend API
  useEffect(() => {
    let isMounted = true;
    async function loadLiveProducts() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/products?limit=100`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          interface ProductVariantApi {
            id: number;
            color_name: string;
            image?: string;
          }
          interface ProductApiRow {
            id: number;
            name: string;
            slug: string;
            min_price?: number | string;
            base_price?: number | string;
            category_name?: "TOTE BAG" | "SHOULDER BAG" | "TRAVEL BAG" | "ACCESSORIES";
            cover_image: string;
            hover_image?: string;
            gallery_images?: string[];
            variants?: ProductVariantApi[];
            description?: string;
            highlights?: string[];
            dimensions?: string;
            material?: string;
            total_stock?: number;
          }
          const mapped: ShopProduct[] = (json.data as ProductApiRow[]).map((p) => {
            const priceNum = Number(p.min_price || p.base_price || 0);
            const formattedPrice = new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(priceNum);

            return {
              id: p.id,
              name: p.name,
              slug: p.slug,
              price: formattedPrice,
              category: p.category_name || "TOTE BAG",
              image: p.cover_image,
              hoverImage: p.hover_image || p.cover_image,
              gallery: Array.isArray(p.gallery_images) && p.gallery_images.length > 0 ? p.gallery_images : [p.cover_image],
              colors: (p.variants || []).map((v) => ({
                name: v.color_name,
                thumbnail: v.image || p.cover_image,
                slug: p.slug,
              })),
              description: p.description || "",
              highlights: p.highlights || [],
              dimensions: p.dimensions ? { size: p.dimensions, strapDrop: "", weight: "" } : undefined,
              material: p.material || "",
              outOfStock: Number(p.total_stock) <= 0,
              page: 1,
            };
          });
          setProductsList(mapped);
        }
      } catch (e) {
        console.warn("Backend not reachable, displaying local catalog:", e);
      }
    }
    loadLiveProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products by category, filter, and search query
  const filteredProducts = useMemo(() => {
    let result = [...productsList];

    // 1. Filter by category
    if (selectedCategory !== "TẤT CẢ") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // 2. Filter by special highlights
    if (urlFilter === "new-arrival") {
      // Sort newest (descending ID)
      result = [...result].sort((a, b) => b.id - a.id);
    } else if (urlFilter === "best-seller") {
      // Best seller bags first
      result = [...result].filter(
        (p) =>
          p.slug.includes("zuni") ||
          p.slug.includes("yacht") ||
          p.slug.includes("sporty") ||
          p.slug.includes("league")
      );
    }

    // 3. Filter by search query
    if (urlQuery.trim()) {
      const q = urlQuery.trim().toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q)
      );
    }

    return result;
  }, [selectedCategory, urlFilter, urlQuery, productsList]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;

  // Products for the current page
  const displayedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
    if (urlFilter || urlCategory) {
      router.push(category === "TẤT CẢ" ? "/cua-hang" : `/cua-hang?category=${encodeURIComponent(category)}`);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleClearSearch = () => {
    router.push("/cua-hang");
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
      {/* Search / Filter Notification Banner */}
      {(urlQuery || urlFilter) && (
        <div className="mb-6 p-3.5 bg-neutral-50 border border-neutral-200 rounded flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-neutral-500">Đang lọc theo:</span>
            {urlQuery && (
              <span className="font-semibold text-neutral-900 bg-white px-2 py-1 rounded border border-neutral-200">
                Từ khóa: &ldquo;{urlQuery}&rdquo;
              </span>
            )}
            {urlFilter === "new-arrival" && (
              <span className="font-semibold text-neutral-900 bg-white px-2 py-1 rounded border border-neutral-200">
                Sản phẩm mới (New Arrival)
              </span>
            )}
            {urlFilter === "best-seller" && (
              <span className="font-semibold text-neutral-900 bg-white px-2 py-1 rounded border border-neutral-200">
                Bán chạy nhất (Best Seller)
              </span>
            )}
            <span className="text-neutral-500">({filteredProducts.length} sản phẩm)</span>
          </div>

          <button
            type="button"
            onClick={handleClearSearch}
            className="text-neutral-700 hover:text-black font-semibold underline cursor-pointer"
          >
            Xóa bộ lọc
          </button>
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
              className={`px-4 py-2 text-xs sm:text-sm font-semibold tracking-wider rounded uppercase transition-all cursor-pointer ${
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

      {/* Empty State */}
      {filteredProducts.length === 0 ? (
        <div className="py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <h3 className="text-base font-bold text-neutral-900 mb-1">
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-6">
            Rất tiếc, không có sản phẩm nào khớp với tìm kiếm của bạn. Hãy thử từ khóa khác hoặc xem toàn bộ danh mục.
          </p>
          <button
            type="button"
            onClick={handleClearSearch}
            className="px-6 py-2.5 bg-black text-white text-xs uppercase font-bold tracking-wider hover:bg-neutral-800 transition rounded-sm cursor-pointer"
          >
            Xem tất cả sản phẩm
          </button>
        </div>
      ) : (
        /* Grid of Product Cards */
        <div className="shop-product-grid">
          {displayedProducts.map((product) => (
            <ShopProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      )}

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

            {/* Page Number Buttons */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <li key={pageNum} className="shop-page-item">
                <button
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`shop-page-btn ${
                    currentPage === pageNum ? "active" : ""
                  }`}
                  aria-label={`Trang ${pageNum}`}
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
                aria-label="Trang kế tiếp"
                title="Trang kế tiếp"
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
