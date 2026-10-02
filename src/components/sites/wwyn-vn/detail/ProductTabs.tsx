"use client";

import React, { useState } from "react";
import { ShopProduct } from "@/data/shopProducts";

interface ProductTabsProps {
  product: ShopProduct;
}

export const ProductTabs: React.FC<ProductTabsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<"info" | "care" | "shipping">("info");

  return (
    <div className="product-tabs-wrapper mt-8 border-t border-neutral-200 pt-6">
      {/* Tabs Header */}
      <div className="flex border-b border-neutral-200 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab("info")}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition relative ${
            activeTab === "info"
              ? "text-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black"
              : "text-neutral-500 hover:text-black"
          }`}
        >
          Thông tin sản phẩm
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("care")}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition relative ${
            activeTab === "care"
              ? "text-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black"
              : "text-neutral-500 hover:text-black"
          }`}
        >
          Hướng dẫn bảo quản
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("shipping")}
          className={`pb-3 text-xs sm:text-sm font-bold uppercase tracking-wider transition relative ${
            activeTab === "shipping"
              ? "text-black after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black"
              : "text-neutral-500 hover:text-black"
          }`}
        >
          Giao hàng & Đổi trả
        </button>
      </div>

      {/* Tabs Content */}
      <div className="py-5 text-sm text-neutral-700 leading-relaxed font-normal">
        {activeTab === "info" && (
          <div className="space-y-3 whitespace-pre-line animate-fade-in">
            {product.description}
          </div>
        )}

        {activeTab === "care" && (
          <div className="space-y-3 whitespace-pre-line animate-fade-in">
            {product.careInstructions || (
              <>
                <p>• Giặt máy ở chế độ nhẹ hoặc giặt tay với nước lạnh.</p>
                <p>• Phơi khô tự nhiên trong bóng râm, tránh ánh nắng mặt trời trực tiếp.</p>
                <p>• Không sử dụng hóa chất tẩy rửa mạnh.</p>
                <p>• Ủi (là) ở nhiệt độ thấp cho vải mỏng/len.</p>
              </>
            )}
          </div>
        )}

        {activeTab === "shipping" && (
          <div className="space-y-3 whitespace-pre-line animate-fade-in">
            {product.shippingPolicy || (
              <>
                <p>• Giao hàng toàn quốc từ 2 - 4 ngày làm việc.</p>
                <p>• Miễn phí đổi hàng trong vòng 7 ngày nếu lỗi từ nhà sản xuất.</p>
                <p>• Sản phẩm đổi phải còn nguyên tem tag, chưa qua sử dụng hoặc giặt tẩy.</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
