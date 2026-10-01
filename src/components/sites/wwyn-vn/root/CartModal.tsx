"use client";

import React from "react";
import Link from "next/link";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-base font-bold uppercase tracking-wider">
            Giỏ hàng của bạn
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black cursor-pointer p-1"
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

        <div className="py-8 text-center text-gray-500">
          <p className="mb-4">Hiện chưa có sản phẩm nào trong giỏ hàng.</p>
          <Link
            href="#"
            className="inline-block px-6 py-2 bg-black text-white text-xs uppercase font-bold tracking-wider hover:bg-neutral-800 transition"
            onClick={onClose}
          >
            Tiếp tục mua hàng
          </Link>
        </div>
      </div>
    </div>
  );
};
