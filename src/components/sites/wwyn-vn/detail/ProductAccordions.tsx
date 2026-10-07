"use client";

import React, { useState } from "react";
import { ShopProduct } from "@/data/shopProducts";
import { formatProductDescription } from "@/lib/utils";

interface ProductAccordionsProps {
  product: ShopProduct;
}

export const ProductAccordions: React.FC<ProductAccordionsProps> = ({
  product,
}) => {
  const [openSection, setOpenSection] = useState<string | null>("details");

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const dim = product.dimensions;

  return (
    <div className="standoil-accordions w-full border-t border-neutral-200 mt-6 pt-1">
      {/* 1. Product details */}
      <div className="border-b border-neutral-200">
        <button
          type="button"
          onClick={() => toggleSection("details")}
          className="w-full py-4 flex items-center justify-between text-left text-[14px] font-medium text-neutral-900 hover:text-black transition-colors"
        >
          <span>Chi tiết sản phẩm (Product details)</span>
          <span
            className={`transition-transform duration-200 transform ${
              openSection === "details" ? "rotate-180" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="#333333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
        {openSection === "details" && (
          <div className="pb-5 text-[13px] leading-relaxed text-neutral-600 animate-fade-in space-y-2.5">
            {dim && (
              <div className="space-y-1 pb-2 border-b border-neutral-100">
                <p>
                  <strong>Kích thước (Size):</strong> {dim.size}
                </p>
                <p>
                  <strong>Độ dài quai xách (Strap Drop):</strong> {dim.strapDrop}
                </p>
                {dim.strapLength && (
                  <p>
                    <strong>Chiều dài quai (Strap Length):</strong> {dim.strapLength}
                  </p>
                )}
                <p>
                  <strong>Trọng lượng (Weight):</strong> {dim.weight}
                </p>
                <p className="text-[11px] text-neutral-400 italic">
                  (*Số đo thực tế có thể chênh lệch 1-2cm tùy theo phương pháp đo thủ công.)
                </p>
              </div>
            )}

            {product.material && (
              <div className="pt-1">
                <p>
                  <strong>Chất liệu (Material):</strong> {product.material}
                </p>
              </div>
            )}

            <div className="pt-2 text-[12px] text-neutral-500">
              <p>• Sản xuất bởi: Ninety Eight Studio</p>
              <p>
                • Toàn bộ sản phẩm được kiểm tra tỉ mỉ và đóng gói chỉn chu trong hộp chống sốc trước khi gửi đến bạn.
              </p>
            </div>

            {/* Rich HTML / Plain Text Description from KiotViet */}
            {product.description && (
              <div className="pt-3 border-t border-neutral-100">
                <div
                  className="text-neutral-700 leading-relaxed text-[13px] space-y-2.5 [&_img]:max-w-full [&_img]:h-auto [&_img]:rounded-md [&_img]:my-3 [&_img]:mx-auto [&_img]:block [&_img]:shadow-xs [&_p]:my-1.5 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 overflow-hidden"
                  dangerouslySetInnerHTML={{
                    __html: formatProductDescription(product.description),
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Care Guide */}
      <div className="border-b border-neutral-200">
        <button
          type="button"
          onClick={() => toggleSection("care")}
          className="w-full py-4 flex items-center justify-between text-left text-[14px] font-medium text-neutral-900 hover:text-black transition-colors"
        >
          <span>Hướng dẫn bảo quản (Care Guide)</span>
          <span
            className={`transition-transform duration-200 transform ${
              openSection === "care" ? "rotate-180" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="#333333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
        {openSection === "care" && (
          <div className="pb-5 text-[13px] leading-relaxed text-neutral-600 animate-fade-in space-y-2">
            <p className="whitespace-pre-line">
              {product.careInstructions ||
                "- Không giặt máy, không ngâm trong nước hoặc xà phòng có độ tẩy cao.\n- Khi bị bám bụi bẩn, lau nhẹ nhàng bằng khăn mềm hoặc khăn ẩm vắt ráo.\n- Để túi khô tự nhiên nơi thoáng mát, râm ráo; tránh ánh nắng gắt chiếu trực tiếp làm nứt hỏng bề mặt da.\n- Nhồi giấy mềm giữ phom dáng khi cất trữ trong túi vải dustbag."}
            </p>
          </div>
        )}
      </div>

      {/* 3. Shipping & Returns */}
      <div className="border-b border-neutral-200">
        <button
          type="button"
          onClick={() => toggleSection("shipping")}
          className="w-full py-4 flex items-center justify-between text-left text-[14px] font-medium text-neutral-900 hover:text-black transition-colors"
        >
          <span>Vận chuyển & Đổi trả (Shipping & Returns)</span>
          <span
            className={`transition-transform duration-200 transform ${
              openSection === "shipping" ? "rotate-180" : ""
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="7"
              viewBox="0 0 12 7"
              fill="none"
            >
              <path
                d="M1 1L6 6L11 1"
                stroke="#333333"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </button>
        {openSection === "shipping" && (
          <div className="pb-5 text-[13px] leading-relaxed text-neutral-600 animate-fade-in space-y-2">
            <p className="whitespace-pre-line">
              {product.shippingPolicy ||
                "- Giao hàng nhanh toàn quốc từ 1 - 3 ngày làm việc.\n- Hỗ trợ đổi sản phẩm trong vòng 7 ngày kể từ khi nhận hàng nếu sản phẩm còn nguyên tem mác, hộp và chưa qua sử dụng.\n- Bảo hành phụ kiện khóa kéo và đường chỉ trong vòng 6 tháng kể từ ngày mua."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
