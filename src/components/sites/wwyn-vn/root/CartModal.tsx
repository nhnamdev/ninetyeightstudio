"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart, formatPrice } from "@/context/CartContext";

const FREESHIP_THRESHOLD = 1000000; // 1.000.000₫ freeship toàn quốc

export const CartModal: React.FC = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    totalCount,
    subtotal,
    subtotalFormatted,
  } = useCart();

  const router = useRouter();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartOpen) {
        closeCart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const percentToFreeship = Math.min(
    100,
    Math.round((subtotal / FREESHIP_THRESHOLD) * 100)
  );
  const remainingForFreeship = Math.max(0, FREESHIP_THRESHOLD - subtotal);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-[300] flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* Slide Drawer */}
      <div
        className="relative w-full max-w-[420px] bg-white h-full z-[310] flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-900">
              Giỏ hàng của bạn
            </h3>
            {totalCount > 0 && (
              <span className="text-xs bg-neutral-900 text-white font-semibold px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
            aria-label="Đóng giỏ hàng"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Freeship notification bar */}
        {items.length > 0 && (
          <div className="px-5 py-3 bg-neutral-50 border-b border-neutral-200">
            <div className="text-[12px] text-neutral-700 mb-1.5 font-medium">
              {remainingForFreeship === 0 ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Đơn hàng của bạn đủ điều kiện MIỄN PHÍ VẬN CHUYỂN!
                </span>
              ) : (
                <span>
                  Mua thêm{" "}
                  <strong className="text-neutral-900">
                    {formatPrice(remainingForFreeship)}
                  </strong>{" "}
                  để được <span className="font-semibold underline">Freeship toàn quốc</span>
                </span>
              )}
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  remainingForFreeship === 0 ? "bg-emerald-600" : "bg-neutral-900"
                }`}
                style={{ width: `${percentToFreeship}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-neutral-100">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
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
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
              </div>
              <p className="text-sm font-semibold text-neutral-800 mb-1">
                Giỏ hàng của bạn đang trống
              </p>
              <p className="text-xs text-neutral-500 max-w-[240px] mb-6">
                Hãy khám phá các thiết kế túi xách mới nhất của Ninety Eight Studio.
              </p>
              <Link
                href="/cua-hang"
                onClick={closeCart}
                className="px-6 py-2.5 bg-neutral-900 text-white text-xs uppercase font-bold tracking-wider hover:bg-neutral-800 transition rounded-sm"
              >
                Khám phá cửa hàng
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-3.5 group">
                {/* Product thumbnail */}
                <Link
                  href={`/san-pham/${item.slug}`}
                  onClick={closeCart}
                  className="w-20 h-24 bg-neutral-100 rounded-sm overflow-hidden flex-shrink-0 border border-neutral-200"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/san-pham/${item.slug}`}
                        onClick={closeCart}
                        className="text-xs font-semibold text-neutral-900 hover:text-neutral-600 transition line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-rose-600 transition p-0.5 cursor-pointer"
                        title="Xóa sản phẩm"
                        aria-label="Xóa sản phẩm"
                      >
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
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </div>

                    {item.color && (
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        Màu sắc: {item.color}
                      </p>
                    )}

                    <div className="text-xs font-bold text-neutral-900 mt-1">
                      {item.priceFormatted}
                    </div>
                  </div>

                  {/* Quantity selector & total per item */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center border border-neutral-300 rounded-[2px] h-[30px] bg-white">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-full flex items-center justify-center text-neutral-600 hover:text-black transition text-sm select-none"
                        aria-label="Giảm số lượng"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-neutral-900 select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-full flex items-center justify-center text-neutral-600 hover:text-black transition text-sm select-none"
                        aria-label="Tăng số lượng"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-xs font-semibold text-neutral-900">
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-neutral-200 bg-neutral-50 flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-600">
                Tạm tính
              </span>
              <span className="text-base font-bold text-neutral-900">
                {subtotalFormatted}
              </span>
            </div>

            <p className="text-[11px] text-neutral-500 leading-tight">
              Phí vận chuyển và mã khuyến mãi sẽ được áp dụng ở bước Thanh toán.
            </p>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-widest transition rounded-[2px] cursor-pointer shadow-md text-center"
            >
              Tiến hành thanh toán
            </button>

            <button
              type="button"
              onClick={closeCart}
              className="w-full py-2.5 bg-transparent hover:bg-neutral-200/60 text-neutral-800 text-xs font-semibold uppercase tracking-wider transition rounded-[2px] text-center"
            >
              Tiếp tục mua hàng
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
