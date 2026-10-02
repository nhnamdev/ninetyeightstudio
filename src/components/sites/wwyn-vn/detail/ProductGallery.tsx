"use client";

import React, { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const validImages = images && images.length > 0 ? images : ["/images/products/yacht-tote-camo.webp"];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="product-gallery-wrapper">
      {/* Main Large Image Container */}
      <div className="product-gallery-main relative group overflow-hidden bg-neutral-50 rounded-sm">
        <img
          src={validImages[activeIndex]}
          alt={`${productName} - Góc ảnh ${activeIndex + 1}`}
          className="w-full h-auto object-cover aspect-[4/5] transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Previous Button */}
        {validImages.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Ảnh trước"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-neutral-800 hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
        )}

        {/* Next Button */}
        {validImages.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Ảnh sau"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-md flex items-center justify-center text-neutral-800 hover:bg-white hover:scale-105 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
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
        )}

        {/* Photo Index Indicator */}
        <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          {activeIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* Thumbnails Row */}
      {validImages.length > 1 && (
        <div className="product-gallery-thumbs flex gap-2.5 mt-3 overflow-x-auto pb-2 scrollbar-thin">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-sm overflow-hidden border-2 transition-all ${
                activeIndex === idx
                  ? "border-black shadow-sm"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`Xem ảnh ${idx + 1}`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
