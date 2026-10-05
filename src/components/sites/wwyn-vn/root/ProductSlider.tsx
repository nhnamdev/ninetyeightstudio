"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

export interface ProductSliderItem {
  id: number;
  name: string;
  price: string;
  image: string;
  href: string;
  outOfStock?: boolean;
}

interface ProductSliderProps {
  initialProducts?: ProductSliderItem[];
}

export const ProductSlider: React.FC<ProductSliderProps> = ({ initialProducts }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [sliderProducts, setSliderProducts] = useState<ProductSliderItem[]>(initialProducts || []);
  const [loading, setLoading] = useState<boolean>(!initialProducts || initialProducts.length === 0);
  const [activeDot, setActiveDot] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Live fetch products from backend API
  useEffect(() => {
    let isMounted = true;
    async function fetchHomeProducts() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
        const res = await fetch(`${apiUrl}/products?limit=12`);
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0 && isMounted) {
          interface SliderApiItem {
            id: number;
            name: string;
            slug: string;
            min_price?: number | string;
            base_price?: number | string;
            cover_image: string;
            total_stock?: number;
          }
          const mapped: ProductSliderItem[] = (json.data as SliderApiItem[]).map((p) => ({
            id: p.id,
            name: p.name.toUpperCase(),
            price: new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(Number(p.min_price || p.base_price || 0)),
            image: p.cover_image,
            href: `/san-pham/${p.slug}`,
            outOfStock: Number(p.total_stock) <= 0,
          }));
          setSliderProducts(mapped);
        }
      } catch (err) {
        console.warn("Backend not available for slider:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    fetchHomeProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Check scroll position to update dots and arrow visibility
  const handleScroll = () => {
    if (!sliderRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      const progress = scrollLeft / maxScroll;
      setActiveDot(progress > 0.5 ? 1 : 0);
    }
  };

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener("scroll", handleScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const scrollAmount = container.clientWidth * 0.75;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const scrollToPage = (pageIndex: number) => {
    if (!sliderRef.current) return;
    const container = sliderRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    container.scrollTo({
      left: pageIndex === 0 ? 0 : maxScroll,
      behavior: "smooth",
    });
    setActiveDot(pageIndex);
  };

  return (
    <section className="py-10 bg-white select-none">
      <div className="wwyn-center">
        {/* Section Header */}
        <div className="flex items-center gap-4 mb-6">
          <h2 className="text-[17px] md:text-[19px] font-bold text-[#1a1a1a] tracking-wider uppercase m-0">
            ALL PRODUCTS
          </h2>
          <Link
            href="/cua-hang"
            className="text-[12px] md:text-[13px] text-[#555555] hover:text-black underline underline-offset-4 transition-colors"
          >
            View more
          </Link>
        </div>

        {/* Slider Wrapper */}
        <div className="relative group/slider">
          {/* Previous Arrow Button (Flickity Style) */}
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`flickity-button flickity-prev-next-button previous absolute left-0 top-[35%] -translate-y-1/2 -translate-x-2 md:-translate-x-3 z-20 w-9 h-9 md:w-10 md:h-10 bg-white/95 hover:bg-white text-neutral-800 rounded-full shadow-md flex items-center justify-center transition-all border border-neutral-200/80 ${
              !canScrollLeft
                ? "opacity-25 cursor-not-allowed hover:scale-100"
                : "opacity-85 hover:opacity-100 hover:scale-105 cursor-pointer"
            }`}
            aria-label="Previous"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 100 100">
              <path d="M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z" />
            </svg>
          </button>

          {/* Next Arrow Button (Flickity Style) */}
          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`flickity-button flickity-prev-next-button next absolute right-0 top-[35%] -translate-y-1/2 translate-x-2 md:translate-x-3 z-20 w-9 h-9 md:w-10 md:h-10 bg-white/95 hover:bg-white text-neutral-800 rounded-full shadow-md flex items-center justify-center transition-all border border-neutral-200/80 ${
              !canScrollRight
                ? "opacity-25 cursor-not-allowed hover:scale-100"
                : "opacity-85 hover:opacity-100 hover:scale-105 cursor-pointer"
            }`}
            aria-label="Next"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 100 100">
              <path
                d="M 10,50 L 60,100 L 70,90 L 30,50 L 70,10 L 60,0 Z"
                transform="translate(100, 100) rotate(180)"
              />
            </svg>
          </button>

          {/* Horizontal Product List - Hidden native scrollbar */}
          <div
            ref={sliderRef}
            className="flex overflow-x-auto gap-3 md:gap-4 no-scrollbar scroll-smooth snap-x snap-mandatory pb-3"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {loading && sliderProducts.length === 0 ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={`slider-skel-${idx}`}
                  className="shrink-0 snap-start w-[calc(50%-6px)] sm:w-[calc(33.333%-10px)] md:w-[calc(25%-12px)] lg:w-[calc(14.285%-14px)] animate-pulse"
                >
                  <div className="aspect-square w-full bg-neutral-100 rounded-sm" />
                  <div className="pt-2 space-y-1.5">
                    <div className="h-3 w-4/5 bg-neutral-100 rounded" />
                    <div className="h-3.5 w-1/2 bg-neutral-100 rounded" />
                  </div>
                </div>
              ))
            ) : (
              sliderProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="shrink-0 snap-start w-[calc(50%-6px)] sm:w-[calc(33.333%-10px)] md:w-[calc(25%-12px)] lg:w-[calc(14.285%-14px)] group cursor-pointer"
                >
                  <Link href={product.href} className="block text-inherit no-underline">
                    {/* Product Image Container */}
                    <div className="relative aspect-square w-full overflow-hidden bg-[#fafafa] rounded-sm flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        width={600}
                        height={600}
                        loading={index < 4 ? "eager" : "lazy"}
                        decoding="async"
                        fetchPriority={index < 2 ? "high" : "auto"}
                        className="w-full h-full object-contain p-2 transition-transform duration-500 ease-out group-hover:scale-105"
                      />

                      {/* Out of Stock Overlay */}
                      {product.outOfStock && (
                        <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="text-[12px] font-semibold text-[#111111] uppercase tracking-wider bg-white/95 px-3 py-1 rounded shadow-sm border border-neutral-200">
                            Hết hàng
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Text Info */}
                    <div className="pt-2 text-left">
                      <p className="text-[11.5px] md:text-[12px] font-normal text-[#212529] tracking-tight uppercase line-clamp-2 min-h-[32px] m-0 leading-snug group-hover:text-black">
                        {product.name}
                      </p>
                      <div className="text-[12px] md:text-[13px] font-bold text-[#111111] mt-1">
                        {product.price}
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Page Dots Indicator */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <button
            type="button"
            onClick={() => scrollToPage(0)}
            className={`w-2 h-2 rounded-full transition-all duration-300 border-0 p-0 cursor-pointer ${
              activeDot === 0
                ? "bg-black w-3 scale-110"
                : "bg-neutral-300 hover:bg-neutral-400"
            }`}
            aria-label="Trang 1"
          />
          <button
            type="button"
            onClick={() => scrollToPage(1)}
            className={`w-2 h-2 rounded-full transition-all duration-300 border-0 p-0 cursor-pointer ${
              activeDot === 1
                ? "bg-black w-3 scale-110"
                : "bg-neutral-300 hover:bg-neutral-400"
            }`}
            aria-label="Trang 2"
          />
        </div>
      </div>
    </section>
  );
};
