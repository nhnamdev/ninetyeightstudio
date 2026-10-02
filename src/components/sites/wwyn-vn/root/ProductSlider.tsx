"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  href: string;
  outOfStock?: boolean;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "YACHT TOTE | CAMO",
    price: "950.000 ₫",
    image: "/images/products/yacht-tote-camo.webp",
    href: "#",
  },
  {
    id: 2,
    name: "SPORTY TRAVEL BAG | CAMO",
    price: "1.170.000 ₫",
    image: "/images/products/sporty-travel-bag-camo.webp",
    href: "#",
  },
  {
    id: 3,
    name: "GOOD BYE MY WORK TOTE BAG | RED",
    price: "200.000 ₫",
    image: "/images/products/good-bye-my-work-tote-red.webp",
    href: "#",
  },
  {
    id: 4,
    name: "GOOD BYE MY WORK TOTE BAG | BLUE",
    price: "200.000 ₫",
    image: "/images/products/good-bye-my-work-tote-blue.webp",
    href: "#",
  },
  {
    id: 5,
    name: "LEAGUE V2 TOTE BAG | SAND",
    price: "790.000 ₫",
    image: "/images/products/league-v2-tote-sand.webp",
    href: "#",
  },
  {
    id: 6,
    name: "LEAGUE V2 TOTE BAG | DEEP BLUE",
    price: "790.000 ₫",
    image: "/images/products/league-v2-tote-deep-blue.webp",
    href: "#",
  },
  {
    id: 7,
    name: "LEAGUE V2 TOTE BAG | DUST BLACK",
    price: "790.000 ₫",
    image: "/images/products/league-v2-tote-dust-black.webp",
    href: "#",
    outOfStock: true,
  },
  {
    id: 8,
    name: "LEAGUE V2 TOTE BAG | STONE BLUE",
    price: "790.000 ₫",
    image: "/images/products/league-v2-tote-stone-blue.webp",
    href: "#",
  },
];

export const ProductSlider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeDot, setActiveDot] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
            href="#"
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
            {PRODUCTS.map((product, index) => (
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
            ))}
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
