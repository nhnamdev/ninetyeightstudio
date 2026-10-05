"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ShopProduct, ProductVariantItem } from "@/data/shopProducts";
import { ProductAccordions } from "./ProductAccordions";
import { useCart } from "@/context/CartContext";

interface ProductDetailViewProps {
  product: ShopProduct;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ product }) => {
  const variants = useMemo(() => product.variants || [], [product.variants]);

  // Initial variant & color
  const initialVariant: ProductVariantItem | null = variants.length > 0 ? variants[0] : null;
  const initialColorName = initialVariant
    ? initialVariant.color_name
    : product.colors?.[0]?.name || "Mặc định";

  const [selectedVariant, setSelectedVariant] = useState<ProductVariantItem | null>(initialVariant);
  const [selectedColor, setSelectedColor] = useState<string>(initialColorName);
  const [activeImage, setActiveImage] = useState<string>(
    initialVariant?.image || product.image
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [selectedModalImage, setSelectedModalImage] = useState<string | null>(null);

  const { addToCart } = useCart();
  const router = useRouter();

  // Deduplicated list of all product images (cover + hover + gallery + variant images)
  const allImages = useMemo(() => {
    const list: string[] = [];
    if (product.image) list.push(product.image);
    if (product.hoverImage && product.hoverImage !== product.image) list.push(product.hoverImage);
    if (Array.isArray(product.gallery)) {
      product.gallery.forEach((img) => {
        if (img && !list.includes(img)) list.push(img);
      });
    }
    variants.forEach((v) => {
      if (v.image && !list.includes(v.image)) list.push(v.image);
    });
    return list.length > 0 ? list : [product.image];
  }, [product, variants]);

  // Color selection: updates active color, highlights button, and sets the main large photo
  const handleSelectColor = (colorName: string, colorImg?: string) => {
    setSelectedColor(colorName);
    const matched = variants.find((v) => v.color_name === colorName);
    if (matched) {
      setSelectedVariant(matched);
      if (matched.image) {
        setActiveImage(matched.image);
      }
    } else if (colorImg) {
      setActiveImage(colorImg);
    }
  };

  // Thumbnail click: updates the main large photo, and syncs color if matched
  const handleSelectThumbnail = (img: string) => {
    setActiveImage(img);
    const matched = variants.find((v) => v.image === img);
    if (matched) {
      setSelectedVariant(matched);
      setSelectedColor(matched.color_name);
    }
  };

  // Dynamic price formatted
  const currentPriceFormatted = useMemo(() => {
    if (selectedVariant && selectedVariant.price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(Number(selectedVariant.price));
    }
    return product.price;
  }, [selectedVariant, product.price]);

  // Dynamic original price formatted
  const currentOriginalPriceFormatted = useMemo(() => {
    if (selectedVariant && selectedVariant.original_price) {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(Number(selectedVariant.original_price));
    }
    return product.originalPrice;
  }, [selectedVariant, product.originalPrice]);

  // Stock status
  const isOutOfStock = useMemo(() => {
    if (selectedVariant) {
      return Number(selectedVariant.stock) <= 0;
    }
    return !!product.outOfStock;
  }, [selectedVariant, product.outOfStock]);

  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: currentPriceFormatted,
        originalPrice: currentOriginalPriceFormatted,
        image: activeImage || product.image,
        color: selectedColor,
        quantity: quantity,
      },
      true
    );
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    addToCart(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: currentPriceFormatted,
        originalPrice: currentOriginalPriceFormatted,
        image: activeImage || product.image,
        color: selectedColor,
        quantity: quantity,
      },
      false
    );
    router.push("/checkout");
  };

  return (
    <div className="standoil-detail-grid">
      {/* ========================================================================= */}
      {/* LEFT COLUMN: PRODUCT GALLERY WITH THUMBNAILS & MAIN LARGE PREVIEW         */}
      {/* ========================================================================= */}
      <div className="standoil-gallery-column">
        {/* DESKTOP GALLERY: Thumbnails on the left + Main Large Image on the right */}
        <div className="hidden md:flex gap-4 items-start sticky top-[100px]">
          {/* Thumbnails vertical stack (only if more than 1 image) */}
          {allImages.length > 1 && (
            <div className="flex flex-col gap-2.5 w-[76px] shrink-0 max-h-[640px] overflow-y-auto no-scrollbar py-0.5">
              {allImages.map((img, idx) => {
                const isActive = activeImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectThumbnail(img)}
                    className={`relative w-[72px] h-[92px] rounded-sm overflow-hidden border transition-all cursor-pointer bg-neutral-100 ${
                      isActive
                        ? "border-black ring-1 ring-black shadow-xs"
                        : "border-neutral-200 hover:border-neutral-400 opacity-75 hover:opacity-100"
                    }`}
                    aria-label={`Xem ảnh góc ${idx + 1}`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Main Large Image (Ảnh to bên phải) */}
          <div
            className="flex-1 relative aspect-[4/5] max-h-[680px] bg-[#fafafa] rounded-sm overflow-hidden border border-neutral-200/60 cursor-zoom-in group select-none flex items-center justify-center"
            onClick={() => setSelectedModalImage(activeImage)}
          >
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              loading="eager"
            />

            {/* Out of Stock Overlay */}
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-widest bg-white/95 px-4 py-1.5 rounded shadow border border-neutral-200">
                  Hết hàng
                </span>
              </div>
            )}

            {/* Hover Zoom Icon */}
            <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
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
        </div>

        {/* MOBILE GALLERY: Large Image + Horizontal Thumbnails below */}
        <div className="md:hidden space-y-3">
          <div
            className="relative w-full aspect-[4/5] bg-[#fafafa] rounded-sm overflow-hidden border border-neutral-200/60 flex items-center justify-center"
            onClick={() => setSelectedModalImage(activeImage)}
          >
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-contain p-2"
              loading="eager"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <span className="text-xs font-bold text-neutral-900 uppercase tracking-widest bg-white/95 px-4 py-1.5 rounded shadow border border-neutral-200">
                  Hết hàng
                </span>
              </div>
            )}
          </div>

          {/* Horizontal Thumbnails Bar on Mobile */}
          {allImages.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
              {allImages.map((img, idx) => {
                const isActive = activeImage === img;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectThumbnail(img)}
                    className={`relative w-14 h-16 shrink-0 rounded border overflow-hidden transition-all ${
                      isActive ? "border-black ring-1 ring-black" : "border-neutral-200 opacity-70"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: STICKY PRODUCT INFORMATION & ACTIONS                        */}
      {/* ========================================================================= */}
      <div className="standoil-info-column">
        <div className="standoil-sticky-box">
          <div className="standoil-product-info w-full flex flex-col">
            {/* Category Breadcrumb */}
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
                {currentPriceFormatted}
              </span>
              {currentOriginalPriceFormatted && (
                <s className="text-[15px] text-neutral-400 font-normal">
                  {currentOriginalPriceFormatted}
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

            {/* Color Selector */}
            {(variants.length > 0 || (product.colors && product.colors.length > 0)) && (
              <div className="mb-6">
                <div className="text-[12px] font-semibold text-neutral-800 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <span>Màu sắc:</span>
                  <span className="font-bold text-neutral-900 normal-case">{selectedColor}</span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {(variants.length > 0 ? variants : product.colors || []).map((item, idx) => {
                    const colorName = "color_name" in item ? item.color_name : item.name;
                    const colorImg = "image" in item ? (item.image || product.image) : ("thumbnail" in item ? (item as { thumbnail: string }).thumbnail : product.image);
                    const isSelected = selectedColor === colorName;
                    const isVariantOutOfStock = "stock" in item ? Number(item.stock) <= 0 : false;

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleSelectColor(colorName, colorImg)}
                        className={`group relative rounded border-2 transition-all p-0.5 cursor-pointer bg-white ${
                          isSelected
                            ? "border-black ring-2 ring-black/15 scale-105"
                            : "border-neutral-200 hover:border-neutral-400 opacity-80 hover:opacity-100"
                        }`}
                        title={`${colorName}${isVariantOutOfStock ? " (Hết hàng)" : ""}`}
                      >
                        <img
                          src={colorImg}
                          alt={colorName}
                          className="w-11 h-14 object-cover rounded-xs bg-neutral-100"
                          loading="lazy"
                        />
                        {isVariantOutOfStock && (
                          <div className="absolute inset-0 bg-white/75 backdrop-blur-[1px] flex items-center justify-center rounded-xs">
                            <span className="text-[9px] font-bold text-red-600 uppercase">Hết</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Stock Status text */}
                <div className="mt-2 text-xs">
                  {selectedVariant ? (
                    Number(selectedVariant.stock) > 0 ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                        Còn hàng ({selectedVariant.stock} sản phẩm)
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />
                        Màu này hiện đang tạm hết hàng
                      </span>
                    )
                  ) : null}
                </div>
              </div>
            )}

            {/* Quantity & Actions Bar */}
            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center border border-neutral-300 rounded-[3px] h-[46px] w-[120px] bg-white">
                  <button
                    type="button"
                    onClick={handleMinus}
                    disabled={isOutOfStock}
                    className="w-9 h-full flex items-center justify-center text-neutral-600 hover:text-black transition text-base font-medium select-none cursor-pointer disabled:opacity-40"
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
                    disabled={isOutOfStock}
                    className="w-9 h-full flex items-center justify-center text-neutral-600 hover:text-black transition text-base font-medium select-none cursor-pointer disabled:opacity-40"
                    aria-label="Tăng số lượng"
                  >
                    +
                  </button>
                </div>

                {/* Wishlist Button */}
                <button
                  type="button"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`h-[46px] w-[46px] rounded-[3px] border flex items-center justify-center transition-colors cursor-pointer ${
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

              {/* Action Buttons */}
              <div className="flex flex-row items-center gap-2.5 sm:gap-3 mt-1.5 w-full">
                {isOutOfStock ? (
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
                      className="flex-1 h-[48px] px-2 sm:px-4 border border-[#111111] bg-white text-[#111111] hover:bg-neutral-50 active:bg-neutral-100 text-[12px] sm:text-[13px] font-semibold tracking-wider uppercase transition-all duration-150 rounded-[3px] flex items-center justify-center text-center whitespace-nowrap cursor-pointer"
                    >
                      THÊM VÀO GIỎ
                    </button>
                    <button
                      type="button"
                      onClick={handleBuyNow}
                      className="flex-1 h-[48px] px-2 sm:px-4 bg-[#111111] text-white hover:bg-neutral-800 active:bg-black text-[12px] sm:text-[13px] font-semibold tracking-wider uppercase transition-all duration-150 rounded-[3px] flex items-center justify-center text-center whitespace-nowrap shadow-sm cursor-pointer"
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
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ZOOM MODAL (High-res view on image click)                                 */}
      {/* ========================================================================= */}
      {selectedModalImage && (
        <div
          className="fixed inset-0 z-[400] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-zoom-out animate-fade-in"
          onClick={() => setSelectedModalImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex items-center justify-center">
            <img
              src={selectedModalImage}
              alt={product.name}
              className="max-w-full max-h-[85vh] object-contain rounded-sm shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setSelectedModalImage(null)}
              className="absolute -top-10 right-0 text-white/80 hover:text-white p-2 transition-colors cursor-pointer text-sm font-medium flex items-center gap-1"
            >
              <span>Đóng</span> ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
