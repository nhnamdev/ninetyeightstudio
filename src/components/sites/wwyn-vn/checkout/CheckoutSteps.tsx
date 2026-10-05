"use client";

import React from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

interface CheckoutStepsProps {
  currentStep: "cart" | "checkout" | "success";
}

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
  const { openCart } = useCart();

  return (
    <div className="w-full bg-[#fcfcfc] border-b border-neutral-200 py-4 select-none">
      <div className="max-w-[1200px] mx-auto px-4">
        <nav aria-label="Tiến trình thanh toán" className="flex items-center justify-center">
          <ol className="flex items-center gap-3 sm:gap-6 text-xs sm:text-[13px] tracking-wider uppercase font-semibold">
            {/* Step 1: Giỏ hàng */}
            <li className="flex items-center gap-2">
              <button
                type="button"
                onClick={openCart}
                className="text-neutral-400 hover:text-black transition cursor-pointer flex items-center gap-1.5"
              >
                <span className="w-5 h-5 rounded-full bg-neutral-200 text-neutral-600 flex items-center justify-center text-[10px] font-bold">
                  1
                </span>
                <span>Giỏ hàng</span>
              </button>
            </li>

            <li className="text-neutral-300">
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
            </li>

            {/* Step 2: Thanh toán */}
            <li className="flex items-center gap-1.5">
              <div
                className={`flex items-center gap-1.5 ${
                  currentStep === "checkout"
                    ? "text-neutral-900 font-bold"
                    : currentStep === "success"
                    ? "text-neutral-400"
                    : "text-neutral-400"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    currentStep === "checkout"
                      ? "bg-black text-white"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  2
                </span>
                <span className={currentStep === "checkout" ? "border-b-2 border-black pb-0.5" : ""}>
                  Thanh toán
                </span>
              </div>
            </li>

            <li className="text-neutral-300">
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
            </li>

            {/* Step 3: Hoàn tất đơn hàng */}
            <li className="flex items-center gap-1.5">
              <div
                className={`flex items-center gap-1.5 ${
                  currentStep === "success"
                    ? "text-neutral-900 font-bold"
                    : "text-neutral-400"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    currentStep === "success"
                      ? "bg-black text-white"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  3
                </span>
                <span className={currentStep === "success" ? "border-b-2 border-black pb-0.5" : ""}>
                  Hoàn tất
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
    </div>
  );
};
