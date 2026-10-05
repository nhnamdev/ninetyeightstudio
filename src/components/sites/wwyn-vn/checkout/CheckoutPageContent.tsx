"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useCart, formatPrice } from "@/context/CartContext";
import { CheckoutSteps } from "./CheckoutSteps";

interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  notes: string;
}

interface CompletedOrder {
  orderId: string;
  date: string;
  customer: OrderCustomerInfo;
  items: Array<{
    id: string;
    name: string;
    price: number;
    priceFormatted: string;
    image: string;
    color?: string;
    quantity: number;
  }>;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  shippingMethod: "standard" | "express";
  paymentMethod: "vietqr" | "cod";
}

const PROVINCES = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Bình Dương",
  "Đồng Nai",
  "Hải Phòng",
  "Cần Thơ",
  "Bà Rịa - Vũng Tàu",
  "Quảng Ninh",
  "Lâm Đồng",
  "Khánh Hòa",
  "Thừa Thiên Huế",
  "Bắc Ninh",
  "Thanh Hóa",
  "Nghệ An",
  "Hải Dương",
  "Kiên Giang",
  "An Giang",
  "Tiền Giang",
  "Bình Định",
  "Tỉnh/Thành khác...",
];

export const CheckoutPageContent: React.FC = () => {
  const { items, subtotal, clearCart, isLoaded } = useCart();

  // Form states
  const [formData, setFormData] = useState<OrderCustomerInfo>({
    fullName: "",
    phone: "",
    email: "",
    province: "TP. Hồ Chí Minh",
    district: "",
    ward: "",
    address: "",
    notes: "",
  });

  const [shippingMethod, setShippingMethod] = useState<"standard" | "express">(
    "standard"
  );
  const [paymentMethod, setPaymentMethod] = useState<"vietqr" | "cod">("vietqr");

  // Coupon states
  const [couponCode, setCouponCode] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "percent" | "freeship";
    value: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);

  // Errors & Loading
  const [errors, setErrors] = useState<Partial<Record<keyof OrderCustomerInfo, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Shipping calculation (Freeship standard if subtotal >= 1.000.000₫ or coupon freeship)
  const isFreeStandard = subtotal >= 1000000 || appliedCoupon?.type === "freeship";
  const standardShippingCost = isFreeStandard ? 0 : 30000;
  const expressShippingCost = appliedCoupon?.type === "freeship" ? 20000 : 50000;

  const currentShippingFee =
    shippingMethod === "standard" ? standardShippingCost : expressShippingCost;

  // Discount calculation
  const discountAmount = useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percent") {
      return Math.round((subtotal * appliedCoupon.value) / 100);
    }
    return 0;
  }, [appliedCoupon, subtotal]);

  const finalTotal = Math.max(0, subtotal + currentShippingFee - discountAmount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError(null);
    setCouponSuccess(null);

    const clean = couponCode.trim().toUpperCase();
    if (!clean) {
      setCouponError("Vui lòng nhập mã giảm giá.");
      return;
    }

    if (clean === "NINETYEIGHT10" || clean === "SPOILED10") {
      setAppliedCoupon({ code: clean, type: "percent", value: 10 });
      setCouponSuccess("Áp dụng thành công mã giảm 10% tổng đơn hàng!");
    } else if (clean === "FREESHIP") {
      setAppliedCoupon({ code: clean, type: "freeship", value: 0 });
      setCouponSuccess("Áp dụng thành công mã Miễn phí vận chuyển!");
    } else {
      setCouponError("Mã giảm giá không tồn tại hoặc đã hết hạn.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponSuccess(null);
    setCouponError(null);
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof OrderCustomerInfo, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên của bạn.";
    }

    const phoneRegex = /^[0-9+() -]{9,15}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại nhận hàng.";
    } else if (!phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email nhận thông báo.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = "Email không hợp lệ.";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ cụ thể (số nhà, tên đường).";
    }

    if (!formData.district.trim()) {
      newErrors.district = "Vui lòng nhập quận/huyện.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to first error
      window.scrollTo({ top: 180, behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const generatedOrderId = Math.floor(10000 + Math.random() * 90000).toString();
      const order: CompletedOrder = {
        orderId: generatedOrderId,
        date: new Date().toLocaleDateString("vi-VN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
        customer: { ...formData },
        items: [...items],
        subtotal,
        shippingFee: currentShippingFee,
        discount: discountAmount,
        total: finalTotal,
        shippingMethod,
        paymentMethod,
      };

      setCompletedOrder(order);

      // Sync order to Backend Express MySQL VPS
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
      fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.fullName,
          customer_phone: formData.phone,
          customer_email: formData.email,
          shipping_province: formData.province,
          shipping_district: formData.district,
          shipping_ward: formData.ward,
          shipping_address: formData.address,
          order_notes: formData.notes,
          items: items.map((i) => ({
            product_id: 1,
            variant_id: 1,
            name: i.name,
            color_name: i.color || "Mặc định",
            sku: `NES-${i.id}`,
            image: i.image,
            price: i.price,
            quantity: i.quantity,
          })),
          shipping_method: shippingMethod,
          payment_method: paymentMethod,
          shipping_fee: currentShippingFee,
          discount_amount: discountAmount,
          coupon_code: appliedCoupon?.code,
        }),
      }).catch((apiErr) => {
        console.warn("Backend API sync notice:", apiErr);
      });

      // Persist order to localStorage for /my-account and order tracking
      try {
        const existingOrdersStr = localStorage.getItem("ninetyeight_orders_v1");
        const existingOrders = existingOrdersStr ? JSON.parse(existingOrdersStr) : [];
        localStorage.setItem(
          "ninetyeight_orders_v1",
          JSON.stringify([order, ...existingOrders])
        );
      } catch (err) {
        console.error("Lỗi khi lưu đơn hàng vào localStorage:", err);
      }

      clearCart();
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 1200);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ================= VIEW: ĐẶT HÀNG THÀNH CÔNG =================
  if (completedOrder) {
    const vietQrUrl = `https://img.vietqr.io/image/MB-0989898989-compact2.png?amount=${completedOrder.total}&addInfo=NES${completedOrder.orderId}&accountName=NINETY%20EIGHT%20STUDIO`;

    return (
      <div className="w-full bg-[#fcfcfc] pb-20">
        <CheckoutSteps currentStep="success" />

        <div className="max-w-[960px] mx-auto px-4 pt-8">
          {/* Header Message */}
          <div className="bg-white border border-neutral-200 rounded-sm p-6 sm:p-8 text-center shadow-xs mb-8">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900 mb-2">
              Cảm ơn bạn đã đặt hàng!
            </h1>
            <p className="text-neutral-600 text-sm max-w-lg mx-auto mb-4">
              Đơn hàng của bạn đã được ghi nhận vào hệ thống của Ninety Eight Studio.
              Thông báo chi tiết đã được gửi tới email{" "}
              <strong className="text-neutral-900">{completedOrder.customer.email}</strong>.
            </p>

            <div className="inline-flex items-center gap-3 bg-neutral-100 px-4 py-2 rounded-sm text-xs font-mono font-medium text-neutral-800">
              <span>MÃ ĐƠN HÀNG:</span>
              <strong className="text-sm font-bold text-black">
                #NES-{completedOrder.orderId}
              </strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Payment instructions */}
            <div className="bg-white border border-neutral-200 rounded-sm p-6 shadow-xs flex flex-col">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 mb-4 flex items-center justify-between">
                <span>Phương thức thanh toán</span>
                <span className="text-xs font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-0.5 rounded">
                  {completedOrder.paymentMethod === "vietqr"
                    ? "Chuyển khoản VietQR"
                    : "Thanh toán khi nhận hàng (COD)"}
                </span>
              </h2>

              {completedOrder.paymentMethod === "vietqr" ? (
                <div className="space-y-4">
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Vui lòng mở ứng dụng Ngân hàng bất kỳ và quét mã VietQR bên dưới
                    hoặc chuyển khoản với đúng nội dung để đơn hàng được tự động kích hoạt
                    giao ngay.
                  </p>

                  {/* QR Code Container */}
                  <div className="flex flex-col items-center justify-center p-4 bg-neutral-50 border border-neutral-200 rounded-sm">
                    <img
                      src={vietQrUrl}
                      alt="VietQR Chuyển khoản"
                      className="w-56 h-auto rounded border border-neutral-300 shadow-xs mb-3 bg-white"
                      loading="eager"
                    />
                    <p className="text-[11px] text-neutral-500 font-medium">
                      Quét mã tự động điền Số tiền & Nội dung
                    </p>
                  </div>

                  {/* Account details copy fields */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Ngân hàng:</span>
                        <strong className="text-neutral-900">MB Bank (Quân Đội)</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Số tài khoản:</span>
                        <strong className="text-neutral-900 font-mono text-sm">0989898989</strong>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy("0989898989", "stk")}
                        className="px-2.5 py-1 bg-black text-white text-[11px] font-medium rounded hover:bg-neutral-800 transition"
                      >
                        {copiedField === "stk" ? "Đã chép ✓" : "Sao chép"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Chủ tài khoản:</span>
                        <strong className="text-neutral-900 uppercase">NINETY EIGHT STUDIO</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-neutral-50 rounded border border-neutral-200">
                      <div>
                        <span className="text-neutral-500 block text-[11px]">Số tiền:</span>
                        <strong className="text-neutral-900 font-bold text-sm">
                          {formatPrice(completedOrder.total)}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(completedOrder.total.toString(), "amount")
                        }
                        className="px-2.5 py-1 bg-black text-white text-[11px] font-medium rounded hover:bg-neutral-800 transition"
                      >
                        {copiedField === "amount" ? "Đã chép ✓" : "Sao chép"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded border border-amber-200">
                      <div>
                        <span className="text-amber-800 block text-[11px] font-semibold">
                          Nội dung chuyển khoản (bắt buộc):
                        </span>
                        <strong className="text-neutral-900 font-mono text-sm">
                          NES{completedOrder.orderId}
                        </strong>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          handleCopy(`NES${completedOrder.orderId}`, "content")
                        }
                        className="px-2.5 py-1 bg-neutral-900 text-white text-[11px] font-medium rounded hover:bg-neutral-800 transition"
                      >
                        {copiedField === "content" ? "Đã chép ✓" : "Sao chép"}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-sm">
                    <p className="text-xs text-neutral-700 leading-relaxed mb-2 font-medium">
                      Đơn hàng đã được xác nhận ở hình thức <strong>Thanh toán khi nhận hàng (COD)</strong>.
                    </p>
                    <p className="text-xs text-neutral-500">
                      Nhân viên chăm sóc khách hàng của Ninety Eight Studio sẽ liên hệ
                      qua số điện thoại <strong>{completedOrder.customer.phone}</strong> để
                      xác nhận đơn trước khi đóng gói gửi đi.
                    </p>
                  </div>
                  <div className="p-3 bg-neutral-100 rounded text-xs text-neutral-600">
                    Số tiền cần thanh toán cho shipper khi nhận hàng:{" "}
                    <strong className="text-black font-bold text-sm block mt-1">
                      {formatPrice(completedOrder.total)}
                    </strong>
                  </div>
                </div>
              )}
            </div>

            {/* Delivery address & items summary */}
            <div className="space-y-6">
              {/* Customer info card */}
              <div className="bg-white border border-neutral-200 rounded-sm p-6 shadow-xs">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 mb-3">
                  Địa chỉ nhận hàng
                </h2>
                <div className="text-xs text-neutral-700 space-y-1.5 leading-relaxed">
                  <p>
                    <strong className="text-neutral-900">{completedOrder.customer.fullName}</strong>
                  </p>
                  <p>Điện thoại: {completedOrder.customer.phone}</p>
                  <p>Email: {completedOrder.customer.email}</p>
                  <p>
                    Địa chỉ: {completedOrder.customer.address},{" "}
                    {completedOrder.customer.ward ? `${completedOrder.customer.ward}, ` : ""}
                    {completedOrder.customer.district}, {completedOrder.customer.province}
                  </p>
                  {completedOrder.customer.notes && (
                    <p className="pt-2 text-neutral-500 italic border-t border-neutral-100">
                      Ghi chú: &ldquo;{completedOrder.customer.notes}&rdquo;
                    </p>
                  )}
                </div>
              </div>

              {/* Items Summary card */}
              <div className="bg-white border border-neutral-200 rounded-sm p-6 shadow-xs">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 mb-3">
                  Sản phẩm đã đặt ({completedOrder.items.length})
                </h2>
                <div className="divide-y divide-neutral-100 max-h-[220px] overflow-y-auto mb-4">
                  {completedOrder.items.map((it) => (
                    <div key={it.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={it.image}
                          alt={it.name}
                          className="w-10 h-12 object-cover rounded-xs border border-neutral-200"
                        />
                        <div>
                          <p className="font-semibold text-neutral-900 line-clamp-1">{it.name}</p>
                          {it.color && <p className="text-[11px] text-neutral-500">Màu: {it.color}</p>}
                          <p className="text-neutral-500">Số lượng: x{it.quantity}</p>
                        </div>
                      </div>
                      <div className="font-semibold text-neutral-900">
                        {formatPrice(it.price * it.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-neutral-200 pt-3 space-y-1.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span>{formatPrice(completedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {completedOrder.shippingFee === 0
                        ? "Miễn phí"
                        : formatPrice(completedOrder.shippingFee)}
                    </span>
                  </div>
                  {completedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Giảm giá:</span>
                      <span>-{formatPrice(completedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-neutral-900 pt-2 border-t border-neutral-200">
                    <span>Tổng thanh toán:</span>
                    <span>{formatPrice(completedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cua-hang"
              className="w-full sm:w-auto px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition text-center rounded-[2px]"
            >
              Tiếp tục mua hàng
            </Link>
            <Link
              href="/my-account"
              className="w-full sm:w-auto px-8 py-3.5 bg-white border border-neutral-300 text-neutral-800 text-xs font-semibold uppercase tracking-wider hover:border-black transition text-center rounded-[2px]"
            >
              Xem trong tài khoản
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ================= VIEW: GIỎ HÀNG TRỐNG =================
  if (items.length === 0) {
    return (
      <div className="w-full bg-[#fcfcfc] pb-24">
        <CheckoutSteps currentStep="cart" />

        <div className="max-w-[600px] mx-auto px-4 py-16 text-center">
          <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-5 text-neutral-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
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

          <h2 className="text-xl font-bold uppercase tracking-wide text-neutral-900 mb-2">
            Giỏ hàng của bạn đang trống
          </h2>
          <p className="text-neutral-500 text-sm mb-6 max-w-sm mx-auto">
            Chưa có sản phẩm nào để tiến hành thanh toán. Hãy dạo qua cửa hàng để chọn
            mẫu túi yêu thích nhé!
          </p>

          <Link
            href="/cua-hang"
            className="inline-block px-8 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition rounded-[2px]"
          >
            Quay lại cửa hàng
          </Link>
        </div>
      </div>
    );
  }

  // ================= VIEW: FORM CHECKOUT 2 CỘT =================
  return (
    <div className="w-full bg-[#fcfcfc] pb-24">
      <CheckoutSteps currentStep="checkout" />

      <div className="max-w-[1200px] mx-auto px-4 pt-6 sm:pt-8">
        <form onSubmit={handleSubmitOrder} noValidate>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            {/* ================= CỘT TRÁI: THÔNG TIN GIAO HÀNG & PHƯƠNG THỨC (7/12) ================= */}
            <div className="lg:col-span-7 space-y-8">
              {/* 1. THÔNG TIN KHÁCH HÀNG */}
              <div className="bg-white border border-neutral-200 rounded-sm p-6 sm:p-7 shadow-2xs">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-5">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                      1
                    </span>
                    Thông tin giao hàng
                  </h2>
                  <Link
                    href="/my-account"
                    className="text-[11px] text-neutral-500 hover:text-black hover:underline"
                  >
                    Đã có tài khoản? Đăng nhập
                  </Link>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Họ và tên */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Họ và tên người nhận <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Nguyễn Văn A"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className={`w-full px-3.5 py-2.5 border rounded-[2px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition ${
                        errors.fullName
                          ? "border-rose-500 ring-1 ring-rose-500"
                          : "border-neutral-300 focus:border-black"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-rose-500 text-[11px] mt-1">{errors.fullName}</p>
                    )}
                  </div>

                  {/* SĐT & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Số điện thoại <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="0912 345 678"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className={`w-full px-3.5 py-2.5 border rounded-[2px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition ${
                          errors.phone
                            ? "border-rose-500 ring-1 ring-rose-500"
                            : "border-neutral-300 focus:border-black"
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-rose-500 text-[11px] mt-1">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Địa chỉ Email <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className={`w-full px-3.5 py-2.5 border rounded-[2px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition ${
                          errors.email
                            ? "border-rose-500 ring-1 ring-rose-500"
                            : "border-neutral-300 focus:border-black"
                        }`}
                      />
                      {errors.email && (
                        <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  {/* Tỉnh / Thành & Quận / Huyện */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Tỉnh / Thành phố <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={formData.province}
                        onChange={(e) =>
                          setFormData({ ...formData, province: e.target.value })
                        }
                        className="w-full px-3 py-2.5 border border-neutral-300 rounded-[2px] bg-white text-neutral-900 focus:outline-none focus:border-black transition"
                      >
                        {PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                        Quận / Huyện <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Quận 1, Cầu Giấy..."
                        value={formData.district}
                        onChange={(e) =>
                          setFormData({ ...formData, district: e.target.value })
                        }
                        className={`w-full px-3.5 py-2.5 border rounded-[2px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition ${
                          errors.district
                            ? "border-rose-500 ring-1 ring-rose-500"
                            : "border-neutral-300 focus:border-black"
                        }`}
                      />
                      {errors.district && (
                        <p className="text-rose-500 text-[11px] mt-1">{errors.district}</p>
                      )}
                    </div>
                  </div>

                  {/* Phường / Xã */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Phường / Xã
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Phường Bến Nghé, Xã An Khánh..."
                      value={formData.ward}
                      onChange={(e) =>
                        setFormData({ ...formData, ward: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 border border-neutral-300 rounded-[2px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition"
                    />
                  </div>

                  {/* Địa chỉ chi tiết */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Địa chỉ cụ thể (Số nhà, tên đường, tòa nhà) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 123 Nguyễn Thị Minh Khai, Tòa A, Phòng 402"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className={`w-full px-3.5 py-2.5 border rounded-[2px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition ${
                        errors.address
                          ? "border-rose-500 ring-1 ring-rose-500"
                          : "border-neutral-300 focus:border-black"
                      }`}
                    />
                    {errors.address && (
                      <p className="text-rose-500 text-[11px] mt-1">{errors.address}</p>
                    )}
                  </div>

                  {/* Ghi chú */}
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Ghi chú đơn hàng (tuỳ chọn)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ghi chú về thời gian giao hàng, lời dặn cho shipper..."
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      className="w-full px-3.5 py-2 border border-neutral-300 rounded-[2px] bg-white text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition"
                    />
                  </div>
                </div>
              </div>

              {/* 2. PHƯƠNG THỨC VẬN CHUYỂN */}
              <div className="bg-white border border-neutral-200 rounded-sm p-6 sm:p-7 shadow-2xs">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                    2
                  </span>
                  Phương thức vận chuyển
                </h2>

                <div className="space-y-3">
                  {/* Standard */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-[2px] border cursor-pointer transition ${
                      shippingMethod === "standard"
                        ? "border-black bg-neutral-50/50 ring-1 ring-black"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="standard"
                        checked={shippingMethod === "standard"}
                        onChange={() => setShippingMethod("standard")}
                        className="accent-black w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-bold text-neutral-900">
                          Giao hàng tiêu chuẩn (Toàn quốc)
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Thời gian dự kiến: 2 - 4 ngày làm việc
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-neutral-900">
                      {isFreeStandard ? (
                        <span className="text-emerald-600 uppercase tracking-wide">
                          Miễn phí
                        </span>
                      ) : (
                        formatPrice(30000)
                      )}
                    </div>
                  </label>

                  {/* Express */}
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-[2px] border cursor-pointer transition ${
                      shippingMethod === "express"
                        ? "border-black bg-neutral-50/50 ring-1 ring-black"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shippingMethod"
                        value="express"
                        checked={shippingMethod === "express"}
                        onChange={() => setShippingMethod("express")}
                        className="accent-black w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <div className="text-xs font-bold text-neutral-900">
                          Giao hàng hỏa tốc (Nội thành)
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          Giao nhanh trong 4 - 8 giờ trong ngày
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-bold text-neutral-900">
                      {formatPrice(expressShippingCost)}
                    </div>
                  </label>
                </div>
              </div>

              {/* 3. PHƯƠNG THỨC THANH TOÁN */}
              <div className="bg-white border border-neutral-200 rounded-sm p-6 sm:p-7 shadow-2xs">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-100 pb-3 mb-4 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">
                    3
                  </span>
                  Phương thức thanh toán
                </h2>

                <div className="space-y-3">
                  {/* VietQR */}
                  <label
                    className={`block p-3.5 rounded-[2px] border cursor-pointer transition ${
                      paymentMethod === "vietqr"
                        ? "border-black bg-neutral-50/40 ring-1 ring-black"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="vietqr"
                        checked={paymentMethod === "vietqr"}
                        onChange={() => setPaymentMethod("vietqr")}
                        className="accent-black w-4 h-4 cursor-pointer"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <span className="text-xs font-bold text-neutral-900">
                          Chuyển khoản ngân hàng qua VietQR
                        </span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                          Khuyên dùng
                        </span>
                      </div>
                    </div>
                    {paymentMethod === "vietqr" && (
                      <div className="mt-3 pl-7 text-[11px] text-neutral-600 leading-relaxed border-t border-neutral-100 pt-2.5">
                        Mã QR thanh toán tự động (đã bao gồm Số tài khoản, Tên người nhận và Nội dung đơn hàng)
                        sẽ hiển thị ngay sau khi bấm <strong>Đặt hàng</strong>. Bạn chỉ cần mở ứng dụng ngân hàng và quét mã để thanh toán.
                      </div>
                    )}
                  </label>

                  {/* COD */}
                  <label
                    className={`block p-3.5 rounded-[2px] border cursor-pointer transition ${
                      paymentMethod === "cod"
                        ? "border-black bg-neutral-50/40 ring-1 ring-black"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={() => setPaymentMethod("cod")}
                        className="accent-black w-4 h-4 cursor-pointer"
                      />
                      <div className="text-xs font-bold text-neutral-900">
                        Thanh toán khi nhận hàng (COD)
                      </div>
                    </div>
                    {paymentMethod === "cod" && (
                      <div className="mt-3 pl-7 text-[11px] text-neutral-600 leading-relaxed border-t border-neutral-100 pt-2.5">
                        Bạn sẽ thanh toán tiền mặt trực tiếp cho nhân viên giao hàng khi nhận được gói hàng.
                      </div>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* ================= CỘT PHẢI: TÓM TẮT ĐƠN HÀNG (5/12 - STICKY) ================= */}
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5">
              <div className="bg-white border border-neutral-200 rounded-sm p-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                    Đơn hàng của bạn ({items.length})
                  </h2>
                  <Link
                    href="/cua-hang"
                    className="text-[11px] text-neutral-500 hover:text-black underline"
                  >
                    Sửa giỏ hàng
                  </Link>
                </div>

                {/* Items preview */}
                <div className="divide-y divide-neutral-100 max-h-[300px] overflow-y-auto pr-1 mb-5">
                  {items.map((item) => (
                    <div key={item.id} className="py-3 flex gap-3.5">
                      <div className="relative w-14 h-16 bg-neutral-100 rounded-xs overflow-hidden flex-shrink-0 border border-neutral-200">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xs font-semibold text-neutral-900 line-clamp-1">
                          {item.name}
                        </h3>
                        {item.color && (
                          <p className="text-[11px] text-neutral-500">Màu: {item.color}</p>
                        )}
                        <p className="text-[11px] text-neutral-400">
                          {item.quantity} x {item.priceFormatted}
                        </p>
                      </div>
                      <div className="text-xs font-bold text-neutral-900 whitespace-nowrap">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Voucher code input */}
                <div className="border-t border-neutral-100 pt-4 mb-4">
                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-[2px] text-xs">
                      <div>
                        <span className="text-emerald-800 font-bold block">
                          MÃ: {appliedCoupon.code}
                        </span>
                        <span className="text-emerald-700 text-[11px]">
                          {appliedCoupon.type === "percent"
                            ? "Giảm 10% đơn hàng"
                            : "Miễn phí vận chuyển"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-emerald-700 hover:text-rose-600 font-medium text-[11px] underline"
                      >
                        Bỏ mã
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Mã ưu đãi (VD: NINETYEIGHT10)"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="flex-1 px-3 py-2 border border-neutral-300 rounded-[2px] text-xs uppercase placeholder:normal-case focus:outline-none focus:border-black"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          className="px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-semibold uppercase tracking-wider rounded-[2px] transition"
                        >
                          Áp dụng
                        </button>
                      </div>
                      {couponError && (
                        <p className="text-rose-500 text-[11px] mt-1.5">{couponError}</p>
                      )}
                      {couponSuccess && (
                        <p className="text-emerald-600 text-[11px] mt-1.5">{couponSuccess}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Subtotals & Total */}
                <div className="border-t border-neutral-200 pt-4 space-y-2.5 text-xs">
                  <div className="flex justify-between text-neutral-600">
                    <span>Tạm tính</span>
                    <span className="font-semibold text-neutral-900">
                      {formatPrice(subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-neutral-600">
                    <span>Phí vận chuyển</span>
                    <span className="font-semibold text-neutral-900">
                      {currentShippingFee === 0 ? (
                        <span className="text-emerald-600 font-bold uppercase text-[11px]">
                          Miễn phí
                        </span>
                      ) : (
                        formatPrice(currentShippingFee)
                      )}
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Giảm giá</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-baseline text-sm font-bold text-neutral-900 border-t border-neutral-200 pt-3">
                    <span>Tổng thanh toán</span>
                    <span className="text-lg text-black">
                      {formatPrice(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Order button */}
                <div className="mt-6 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-black hover:bg-neutral-800 active:bg-neutral-900 disabled:bg-neutral-400 text-white text-xs font-bold uppercase tracking-widest transition rounded-[2px] cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Đang xử lý đơn hàng...</span>
                      </>
                    ) : (
                      <span>Đặt hàng ngay</span>
                    )}
                  </button>

                  <p className="text-[11px] text-neutral-400 text-center leading-normal">
                    Bằng việc bấm Đặt hàng, bạn đồng ý với các{" "}
                    <Link href="#" className="underline hover:text-black">
                      Điều khoản dịch vụ
                    </Link>{" "}
                    và{" "}
                    <Link href="#" className="underline hover:text-black">
                      Chính sách bảo mật
                    </Link>{" "}
                    của Ninety Eight Studio.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
