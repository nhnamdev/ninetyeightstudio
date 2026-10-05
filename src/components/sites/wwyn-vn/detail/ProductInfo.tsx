"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShopProduct } from "@/data/shopProducts";
import { ProductAccordions } from "./ProductAccordions";
import { useCart } from "@/context/CartContext";

interface ProductInfoProps {
  product: ShopProduct;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [selectedColorSlug, setSelectedColorSlug] = useState<string>(product.slug);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    const currentColor = product.colors?.find(
      (c) => c.slug === selectedColorSlug
    )?.name;

    addToCart(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        color: currentColor,
        quantity: quantity,
      },
      true // Mở slide drawer xem ngay
    );
  };

  const handleBuyNow = () => {
    const currentColor = product.colors?.find(
      (c) => c.slug === selectedColorSlug
    )?.name;

    addToCart(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        image: product.image,
        color: currentColor,
        quantity: quantity,
      },
      false
    );
    router.push("/checkout");
  };

  return (
    <div className="standoil-product-info w-full flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[300] bg-black text-white px-5 py-3.5 rounded shadow-2xl text-sm font-medium flex items-center gap-3 animate-fade-in border border-neutral-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-emerald-400 flex-shrink-0"
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

      {/* Brand & Category Label */}
      <div className="flex items-center gap-2 text-[11px] font-semibold tracking-wider text-neutral-400 uppercase mb-2">
        <span>NINETY EIGHT STUDIO</span>
        <span>•</span>
        <span>{product.category}</span>
      </div>

      {/* Product Title */}
      <h1 className="text-[22px] md:text-[25px] font-medium text-neutral-900 tracking-tight leading-snug mb-3">
        {product.name}
      </h1>

      {/* Price Container */}
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-[20px] md:text-[22px] font-bold text-neutral-900 tracking-tight">
          {product.price}
        </span>
        {product.originalPrice && (
          <s className="text-[15px] text-neutral-400 font-normal">
            {product.originalPrice}
          </s>
        )}
      </div>

      <p className="text-[12px] text-neutral-400 mb-6">Đã bao gồm thuế GTGT.</p>

      {/* Description & Highlight Bullets */}
      <div className="text-[13.5px] leading-relaxed text-neutral-700 space-y-3 mb-6">
        <p className="font-medium text-neutral-900">{product.description}</p>

        {product.highlights && product.highlights.length > 0 && (
          <ul className="space-y-1.5 pt-1 text-neutral-600">
            {product.highlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-neutral-400 select-none">-</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Copyright Notice */}
      <p className="text-[11px] text-neutral-400 italic mb-6 leading-normal">
        ※ Toàn bộ hình ảnh, thiết kế và bản quyền sản phẩm thuộc về Ninety Eight Studio. Mọi hành vi sao chép không được phép sẽ bị xử lý theo pháp luật.
      </p>

      {/* Color Swatches (Stand Oil similar-product-list) */}
      {product.colors && product.colors.length > 0 && (
        <div className="mb-6">
          <div className="text-[12px] font-semibold text-neutral-800 uppercase tracking-wider mb-2.5">
            Màu sắc / Colors
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {product.colors.map((color) => {
              const isActive = color.slug === product.slug;
              return (
                <Link
                  key={color.name}
                  href={`/san-pham/${color.slug}`}
                  className={`group relative rounded border transition-all p-0.5 ${
                    isActive
                      ? "border-black ring-1 ring-black"
                      : "border-neutral-200 hover:border-neutral-400"
                  }`}
                  title={color.name}
                >
                  <img
                    src={color.thumbnail}
                    alt={color.name}
                    className="w-11 h-14 object-cover rounded-sm bg-neutral-100"
                    loading="lazy"
                  />
                  <span className="sr-only">{color.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Quantity & Actions Bar */}
      <div className="flex flex-col gap-3 pt-2">
        {/* Row 1: Quantity selector & Wishlist heart */}
        <div className="flex items-center gap-3">
          {/* Quantity Selector (- 1 +) */}
          <div className="flex items-center border border-neutral-300 rounded-[3px] h-[46px] w-[120px] bg-white">
            <button
              type="button"
              onClick={handleMinus}
              className="w-9 h-full flex items-center justify-center text-neutral-600 hover:text-black transition text-base font-medium select-none"
              aria-label="Giảm số lượng"
            >
              −
            </button>
            <span className="flex-1 text-center text-sm font-semibold text-neutral-900 select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handlePlus}
              className="w-9 h-full flex items-center justify-center text-neutral-600 hover:text-black transition text-base font-medium select-none"
              aria-label="Tăng số lượng"
            >
              +
            </button>
          </div>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`h-[46px] w-[46px] rounded-[3px] border flex items-center justify-center transition-colors ${
              isWishlisted
                ? "border-rose-500 bg-rose-50 text-rose-500"
                : "border-neutral-300 hover:border-black text-neutral-600"
            }`}
            title="Thêm vào danh sách yêu thích"
            aria-label="Yêu thích"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill={isWishlisted ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        {/* Row 2: Add to cart & Buy now buttons (Option 1: Side-by-side on Mobile & Desktop) */}
        <div className="flex flex-row items-center gap-2.5 sm:gap-3 mt-1.5 w-full">
          {product.outOfStock ? (
            <button
              type="button"
              disabled
              className="w-full h-[48px] bg-neutral-200 text-neutral-500 text-[12px] sm:text-[13px] font-bold tracking-widest uppercase cursor-not-allowed rounded-[3px]"
            >
              TẠM HẾT HÀNG / SOLD OUT
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex-1 h-[48px] px-2 sm:px-4 border border-[#111111] bg-white text-[#111111] hover:bg-neutral-50 active:bg-neutral-100 text-[12px] sm:text-[13px] font-semibold tracking-wider uppercase transition-all duration-150 rounded-[3px] flex items-center justify-center text-center whitespace-nowrap"
              >
                THÊM VÀO GIỎ
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                className="flex-1 h-[48px] px-2 sm:px-4 bg-[#111111] text-white hover:bg-neutral-800 active:bg-black text-[12px] sm:text-[13px] font-semibold tracking-wider uppercase transition-all duration-150 rounded-[3px] flex items-center justify-center text-center whitespace-nowrap shadow-sm"
              >
                MUA NGAY
              </button>
            </>
          )}
        </div>
      </div>

      {/* Accordions */}
      <ProductAccordions product={product} />
    </div>
  );
};
