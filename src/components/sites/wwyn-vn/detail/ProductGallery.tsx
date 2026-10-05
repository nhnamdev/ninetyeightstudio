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
  const [mobileActiveIndex, setMobileActiveIndex] = useState(0);
  const [selectedModalImage, setSelectedModalImage] = useState<string | null>(null);

  const validImages = images && images.length > 0 ? images : ["https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/yacht-tote-camo-187b8f33.webp"];

  return (
    <div className="standoil-gallery-wrapper w-full">
      {/* ================= DESKTOP LAYOUT (Vertical Stack) ================= */}
      <div className="hidden md:flex flex-col gap-3 lg:gap-4">
        {validImages.map((img, idx) => (
          <div
            key={idx}
            className="standoil-media-item relative overflow-hidden bg-[#fafafa] cursor-zoom-in group"
            onClick={() => setSelectedModalImage(img)}
          >
            <img
              src={img}
              alt={`${productName} - Ảnh chi tiết ${idx + 1}`}
              className="w-full h-auto object-cover aspect-[4/5] block transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              loading={idx < 2 ? "eager" : "lazy"}
            />
            {/* Subtle Zoom Icon on Hover */}
            <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                <line x1="11" y1="8" x2="11" y2="14"></line>
                <line x1="8" y1="11" x2="14" y2="11"></line>
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MOBILE LAYOUT (Swipe Carousel) ================= */}
      <div className="md:hidden relative w-full overflow-hidden bg-[#fafafa]">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${mobileActiveIndex * 100}%)` }}
        >
          {validImages.map((img, idx) => (
            <div
              key={idx}
              className="w-full flex-shrink-0 aspect-[4/5] relative"
              onClick={() => setSelectedModalImage(img)}
            >
              <img
                src={img}
                alt={`${productName} - Góc ảnh ${idx + 1}`}
                className="w-full h-full object-cover"
                loading={idx === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* Carousel Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={() =>
                setMobileActiveIndex((prev) =>
                  prev === 0 ? validImages.length - 1 : prev - 1
                )
              }
              aria-label="Ảnh trước"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-neutral-700 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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

            <button
              type="button"
              onClick={() =>
                setMobileActiveIndex((prev) =>
                  prev === validImages.length - 1 ? 0 : prev + 1
                )
              }
              aria-label="Ảnh sau"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-neutral-700 shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
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
          </>
        )}

        {/* Page Pill Indicator */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-full tracking-wider">
          {mobileActiveIndex + 1} / {validImages.length}
        </div>
      </div>

      {/* Mobile Thumbnail Row */}
      {validImages.length > 1 && (
        <div className="md:hidden flex gap-2 overflow-x-auto py-2.5 px-1 scrollbar-none">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setMobileActiveIndex(idx)}
              className={`flex-shrink-0 w-14 h-18 rounded-sm overflow-hidden border transition-all ${
                mobileActiveIndex === idx
                  ? "border-black ring-1 ring-black"
                  : "border-neutral-200 opacity-60"
              }`}
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

      {/* Fullscreen Lightbox Modal */}
      {selectedModalImage && (
        <div
          className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setSelectedModalImage(null)}
        >
          <button
            type="button"
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2"
            onClick={() => setSelectedModalImage(null)}
            aria-label="Đóng ảnh"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <img
            src={selectedModalImage}
            alt={productName}
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-sm shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};
