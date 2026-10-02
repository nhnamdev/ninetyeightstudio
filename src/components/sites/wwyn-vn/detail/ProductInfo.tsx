"use client";

import React, { useState } from "react";
import { ShopProduct } from "@/data/shopProducts";

interface ProductInfoProps {
  product: ShopProduct;
}

export const ProductInfo: React.FC<ProductInfoProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : "M"
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0] : "Black"
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [showSizeChart, setShowSizeChart] = useState<boolean>(false);
  const [sizeDropdownOpen, setSizeDropdownOpen] = useState<boolean>(false);
  const [colorDropdownOpen, setColorDropdownOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleMinus = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handlePlus = () => {
    setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    setToastMessage(
      `Đã thêm ${quantity} x "${product.name}" (${selectedColor} - Size ${selectedSize}) vào giỏ hàng!`
    );
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  return (
    <div className="product-info-wrapper w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[300] bg-black text-white px-5 py-3.5 rounded-md shadow-2xl text-sm font-medium flex items-center gap-3 animate-fade-in border border-neutral-700">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-400 flex-shrink-0"
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

      {/* Product Title */}
      <h1 className="title-pro-detail">{product.name}</h1>

      {/* Product Price */}
      <div className="attr-content-pro-detail attr-price-pro-detail my-3">
        <span className="price-new-pro-detail">{product.price}</span>
      </div>

      {/* Select Size, Color and Size Chart Bar */}
      <div className="custom-size-detail my-4 flex flex-wrap items-center gap-3">
        {/* Size Selector */}
        <div className="relative flex-1 min-w-[140px]">
          <div
            className="size-pro-detail flex items-center justify-between px-3.5 py-2.5 border border-neutral-300 rounded cursor-pointer bg-white hover:border-black transition"
            onClick={() => {
              setSizeDropdownOpen(!sizeDropdownOpen);
              setColorDropdownOpen(false);
            }}
          >
            <span className="text-sm font-medium text-neutral-800">
              Size: <strong className="text-black">{selectedSize}</strong>
            </span>
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
              className={`transition-transform ${sizeDropdownOpen ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {sizeDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-20 py-1">
              {product.sizes.map((s) => (
                <div
                  key={s}
                  onClick={() => {
                    setSelectedSize(s);
                    setSizeDropdownOpen(false);
                  }}
                  className={`px-3.5 py-2 text-sm cursor-pointer hover:bg-neutral-100 transition ${
                    selectedSize === s ? "font-bold bg-neutral-50 text-black" : "text-neutral-700"
                  }`}
                >
                  Size {s}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Color Selector */}
        <div className="relative flex-1 min-w-[140px]">
          <div
            className="color-pro-detail flex items-center justify-between px-3.5 py-2.5 border border-neutral-300 rounded cursor-pointer bg-white hover:border-black transition"
            onClick={() => {
              setColorDropdownOpen(!colorDropdownOpen);
              setSizeDropdownOpen(false);
            }}
          >
            <span className="text-sm font-medium text-neutral-800">
              Màu: <strong className="text-black">{selectedColor}</strong>
            </span>
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
              className={`transition-transform ${colorDropdownOpen ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {colorDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-neutral-200 rounded shadow-lg z-20 py-1">
              {product.colors.map((c) => (
                <div
                  key={c}
                  onClick={() => {
                    setSelectedColor(c);
                    setColorDropdownOpen(false);
                  }}
                  className={`px-3.5 py-2 text-sm cursor-pointer hover:bg-neutral-100 transition ${
                    selectedColor === c ? "font-bold bg-neutral-50 text-black" : "text-neutral-700"
                  }`}
                >
                  {c}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Size Chart Button */}
        <button
          type="button"
          onClick={() => setShowSizeChart(true)}
          className="size-chart px-4 py-2.5 border border-neutral-300 rounded text-xs font-semibold uppercase tracking-wider hover:border-black hover:bg-black hover:text-white transition whitespace-nowrap"
        >
          Size Chart
        </button>
      </div>

      {/* Quantity & Add to Cart Action */}
      <div className="attr-label-pro-detail-cart flex items-center gap-3 my-5">
        {/* Quantity Counter */}
        <div className="quantity-pro-detail flex items-center border border-black rounded h-11 px-2 bg-white">
          <button
            type="button"
            onClick={handleMinus}
            className="w-8 h-full flex items-center justify-center text-lg text-neutral-600 hover:text-black"
            aria-label="Giảm số lượng"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            readOnly
            className="w-10 text-center font-semibold text-sm outline-none bg-transparent"
            aria-label="Số lượng"
          />
          <button
            type="button"
            onClick={handlePlus}
            className="w-8 h-full flex items-center justify-center text-lg text-neutral-600 hover:text-black"
            aria-label="Tăng số lượng"
          >
            +
          </button>
        </div>

        {/* Add to Cart Button */}
        <div className="cart-pro-detail flex-1">
          <button
            type="button"
            onClick={handleAddToCart}
            className="w-full h-11 bg-black text-white hover:bg-neutral-800 active:scale-[0.99] transition rounded uppercase text-sm font-bold tracking-wider flex items-center justify-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <span>Thêm vào giỏ hàng</span>
          </button>
        </div>
      </div>

      {/* Size Chart Modal */}
      {showSizeChart && (
        <div
          className="fixed inset-0 z-[250] flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowSizeChart(false)}
        >
          <div
            className="relative bg-white rounded-lg shadow-2xl max-w-2xl w-full p-6 text-black"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b pb-3 mb-4">
              <h3 className="text-base font-bold uppercase tracking-wider">
                Bảng thông số kích thước (Size Chart)
              </h3>
              <button
                type="button"
                onClick={() => setShowSizeChart(false)}
                className="p-1 text-gray-500 hover:text-black transition"
                aria-label="Đóng"
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
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="max-h-[75vh] overflow-y-auto">
              {product.sizeChartImage ? (
                <img
                  src={product.sizeChartImage}
                  alt="Bảng size chuẩn 98 STUDIO"
                  className="w-full h-auto rounded"
                />
              ) : (
                <div className="py-6 text-center text-sm text-neutral-600">
                  Thông số đang được cập nhật. Vui lòng liên hệ hỗ trợ viên để được tư vấn size chuẩn xác!
                </div>
              )}

              {/* Quick Guidance */}
              <div className="mt-4 p-3 bg-neutral-50 rounded text-xs text-neutral-600 leading-relaxed border border-neutral-100">
                <p className="font-semibold text-black mb-1">Gợi ý chọn size:</p>
                <p>• Size XS: Dưới 1m65, dưới 55kg</p>
                <p>• Size S: 1m65 - 1m72, 55kg - 63kg</p>
                <p>• Size M: 1m73 - 1m80, 64kg - 72kg (Mẫu nam 1m83, 70kg mang size M)</p>
                <p>• Size L: 1m80 trở lên hoặc trên 73kg</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
