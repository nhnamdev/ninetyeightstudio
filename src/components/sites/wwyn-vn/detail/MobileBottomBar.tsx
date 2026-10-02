"use client";

import React, { useState, useEffect } from "react";
import { ShopProduct } from "@/data/shopProducts";

interface MobileBottomBarProps {
  product: ShopProduct;
}

export const MobileBottomBar: React.FC<MobileBottomBarProps> = ({ product }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled down past 400px
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleQuickAdd = () => {
    setToastMessage(`Đã thêm "${product.name}" vào giỏ hàng!`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <>
      {toastMessage && (
        <div className="fixed bottom-20 left-4 right-4 z-[350] bg-black text-white px-4 py-3 rounded text-center text-xs font-medium shadow-xl animate-fade-in border border-neutral-700">
          {toastMessage}
        </div>
      )}

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[250] bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-2.5 flex items-center justify-between gap-3 shadow-lg">
        {/* Product preview */}
        <div className="flex items-center gap-2.5 overflow-hidden min-w-0">
          <img
            src={product.image}
            alt=""
            className="w-10 h-12 object-cover rounded-sm bg-neutral-100 flex-shrink-0"
          />
          <div className="truncate">
            <div className="text-[12px] font-semibold text-neutral-900 truncate">
              {product.name}
            </div>
            <div className="text-[13px] font-bold text-neutral-900">
              {product.price}
            </div>
          </div>
        </div>

        {/* Action button */}
        {product.outOfStock ? (
          <button
            type="button"
            disabled
            className="px-4 py-2.5 bg-neutral-200 text-neutral-500 text-[11px] font-bold tracking-wider uppercase rounded flex-shrink-0"
          >
            HẾT HÀNG
          </button>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="px-4 py-2.5 bg-black text-white text-[11px] font-bold tracking-wider uppercase rounded flex-shrink-0 hover:bg-neutral-800 transition shadow-sm"
          >
            MUA NGAY
          </button>
        )}
      </div>
    </>
  );
};
