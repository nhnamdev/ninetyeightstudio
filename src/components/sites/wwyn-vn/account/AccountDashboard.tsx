"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Package,
  User,
  LogOut,
  MapPin,
  Clock,
  CheckCircle2,
  RotateCcw,
  ChevronRight,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

interface OrderItem {
  id: number;
  name: string;
  slug: string;
  image: string;
  price: string;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  total: string;
  paymentMethod: string;
  items: OrderItem[];
}

const SAMPLE_ORDERS: Order[] = [
  {
    id: "#98S-9042",
    date: "28/09/2026",
    total: "2.450.000₫",
    paymentMethod: "Chuyển khoản VietQR",
    items: [
      {
        id: 1,
        name: "Zuni Bag / Black",
        slug: "zuni-bag-black",
        image: "/images/products/zuni-bag/thumb-1.png",
        price: "2.450.000₫",
        quantity: 1,
      },
    ],
  },
  {
    id: "#98S-8815",
    date: "15/09/2026",
    total: "950.000₫",
    paymentMethod: "Thanh toán khi nhận hàng (COD)",
    items: [
      {
        id: 2,
        name: "YACHT TOTE | CAMO",
        slug: "yacht-tote-camo",
        image: "/images/products/yacht-tote-camo.webp",
        price: "950.000₫",
        quantity: 1,
      },
    ],
  },
  {
    id: "#98S-7620",
    date: "02/08/2026",
    total: "1.370.000₫",
    paymentMethod: "Thẻ ATM / Visa Online",
    items: [
      {
        id: 3,
        name: "SPORTY TRAVEL BAG | CAMO",
        slug: "sporty-travel-bag-camo",
        image: "/images/products/sporty-travel-bag-camo.webp",
        price: "1.170.000₫",
        quantity: 1,
      },
      {
        id: 4,
        name: "GOOD BYE MY WORK TOTE BAG | RED",
        slug: "good-bye-my-work-tote-red",
        image: "/images/products/good-bye-my-work-tote-red.webp",
        price: "200.000₫",
        quantity: 1,
      },
    ],
  },
];

interface StoredOrderItem {
  id: string | number;
  name: string;
  slug: string;
  image: string;
  price: number | string;
  priceFormatted?: string;
  quantity: number;
}

interface StoredOrder {
  orderId: string;
  date?: string;
  total: number;
  paymentMethod: "vietqr" | "cod" | string;
  items: StoredOrderItem[];
}

export const AccountDashboard: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [orders, setOrders] = useState<Order[]>(SAMPLE_ORDERS);

  // Load real orders from localStorage if available
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const saved = localStorage.getItem("ninetyeight_orders_v1");
        if (saved) {
          const parsed: StoredOrder[] = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const formattedOrders: Order[] = parsed.map((o) => ({
              id: `#NES-${o.orderId}`,
              date: o.date || new Date().toLocaleDateString("vi-VN"),
              total: new Intl.NumberFormat("vi-VN").format(o.total) + "₫",
              paymentMethod:
                o.paymentMethod === "vietqr"
                  ? "Chuyển khoản VietQR"
                  : "Thanh toán khi nhận hàng (COD)",
              items: o.items.map((it, idx) => ({
                id: typeof it.id === "number" ? it.id : idx + 1000,
                name: it.name,
                slug: it.slug,
                image: it.image,
                price:
                  it.priceFormatted ||
                  new Intl.NumberFormat("vi-VN").format(Number(it.price) || 0) + "₫",
                quantity: it.quantity,
              })),
            }));
            setOrders([...formattedOrders, ...SAMPLE_ORDERS]);
          }
        }
      } catch (e) {
        console.error("Lỗi đọc đơn hàng từ localStorage:", e);
      }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Profile Form State
  const [profileData, setProfileData] = useState({
    fullName: "Nguyễn Văn Nam",
    email: "nam.nguyen@ninetyeight.vn",
    phone: "0378 026 461",
    gender: "Nam",
    birthday: "1998-09-08",
    address: "Số 98 Đường Nguyễn Huệ, Phường Bến Nghé",
    city: "Quận 1, TP. Hồ Chí Minh",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    showToast("Cập nhật thông tin tài khoản thành công!");
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    showToast("Đã đăng xuất tài khoản thành công!");
    setTimeout(() => {
      router.push("/");
    }, 1000);
  };

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[300] bg-black text-white px-5 py-3.5 rounded-[3px] shadow-2xl text-sm font-medium flex items-center gap-3 animate-fade-in border border-neutral-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="account-layout">
        {/* ================= SIDEBAR ================= */}
        <aside className="account-sidebar">
          {/* User Profile Card */}
          <div className="bg-neutral-50 border border-neutral-200 rounded-[3px] p-5 mb-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-base select-none">
                N
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-bold text-neutral-900 truncate">
                  {profileData.fullName}
                </div>
                <div className="text-[12px] text-neutral-500 truncate">
                  {profileData.email}
                </div>
                <div className="text-[11px] font-semibold text-neutral-400 mt-0.5 tracking-wider uppercase">
                  Thành viên Gold
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="bg-white border border-neutral-200 rounded-[3px] overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`w-full px-4 py-3.5 flex items-center justify-between text-left text-[13.5px] transition-colors border-b border-neutral-100 ${
                activeTab === "orders"
                  ? "bg-neutral-900 text-white font-semibold"
                  : "text-neutral-700 hover:bg-neutral-50 font-medium"
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Đơn hàng của tôi</span>
              </div>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  activeTab === "orders"
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {SAMPLE_ORDERS.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full px-4 py-3.5 flex items-center justify-between text-left text-[13.5px] transition-colors border-b border-neutral-100 ${
                activeTab === "profile"
                  ? "bg-neutral-900 text-white font-semibold"
                  : "text-neutral-700 hover:bg-neutral-50 font-medium"
              }`}
            >
              <div className="flex items-center gap-3">
                <User className="w-4 h-4" />
                <span>Thông tin tài khoản</span>
              </div>
              <ChevronRight className="w-4 h-4 opacity-50" />
            </button>

            <button
              type="button"
              onClick={() => setShowLogoutModal(true)}
              className="w-full px-4 py-3.5 flex items-center justify-between text-left text-[13.5px] text-rose-600 hover:bg-rose-50 transition-colors font-medium"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </div>
            </button>
          </nav>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className="account-main-content">
          {/* TAB 1: ORDER HISTORY */}
          {activeTab === "orders" && (
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <div>
                  <h2 className="text-[18px] sm:text-[20px] font-bold text-neutral-900 uppercase tracking-wide">
                    Đơn hàng của tôi
                  </h2>
                  <p className="text-[12.5px] text-neutral-500 mt-0.5">
                    Quản lý và theo dõi tiến độ các đơn hàng bạn đã mua
                  </p>
                </div>
                <Link
                  href="/cua-hang"
                  className="hidden sm:inline-flex items-center text-[12px] font-semibold text-black underline underline-offset-4 hover:opacity-80 transition"
                >
                  Mua sắm thêm
                </Link>
              </div>

              {/* Order Cards List */}
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border border-neutral-200 rounded-[3px] bg-white overflow-hidden shadow-sm hover:border-neutral-300 transition-colors"
                  >
                    {/* Order Card Header */}
                    <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200 flex items-center justify-between text-[12.5px]">
                      <span className="font-bold text-neutral-900 tracking-wider">
                        {order.id}
                      </span>
                      <span className="text-neutral-500 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-neutral-400" />
                        {order.date}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="p-4 divide-y divide-neutral-100">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-16 object-cover rounded-[2px] bg-neutral-100 border border-neutral-200 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <Link
                                href={`/san-pham/${item.slug}`}
                                className="text-[13px] sm:text-[14px] font-semibold text-neutral-900 hover:underline block truncate"
                              >
                                {item.name}
                              </Link>
                              <div className="text-[12px] text-neutral-500 mt-0.5">
                                Số lượng: {item.quantity}
                              </div>
                              <div className="text-[13px] font-bold text-neutral-900 sm:hidden mt-1">
                                {item.price}
                              </div>
                            </div>
                          </div>

                          <div className="hidden sm:block text-right flex-shrink-0">
                            <div className="text-[13.5px] font-bold text-neutral-900">
                              {item.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Card Footer */}
                    <div className="bg-neutral-50/70 px-4 py-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-[12.5px]">
                      <div className="text-neutral-500 flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                        <span>Phương thức: {order.paymentMethod}</span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-neutral-500 text-xs mr-2">Tổng tiền:</span>
                          <span className="text-[15px] font-bold text-neutral-900">
                            {order.total}
                          </span>
                        </div>

                        <Link
                          href={`/san-pham/${order.items[0]?.slug}`}
                          className="px-3.5 py-1.5 border border-neutral-300 bg-white text-neutral-800 hover:border-black text-xs font-semibold rounded-[3px] flex items-center gap-1.5 transition"
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>Mua lại</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: PROFILE & ADDRESS */}
          {activeTab === "profile" && (
            <div className="space-y-6 animate-fade-in">
              <div className="pb-3 border-b border-neutral-200">
                <h2 className="text-[18px] sm:text-[20px] font-bold text-neutral-900 uppercase tracking-wide">
                  Thông tin tài khoản
                </h2>
                <p className="text-[12.5px] text-neutral-500 mt-0.5">
                  Cập nhật thông tin cá nhân và địa chỉ nhận hàng của bạn
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                {/* Section 1: Personal Info */}
                <div className="border border-neutral-200 rounded-[3px] p-5 bg-white space-y-4">
                  <div className="flex items-center gap-2 text-[14px] font-bold text-neutral-900 pb-2 border-b border-neutral-100">
                    <User className="w-4 h-4" />
                    <span>Hồ sơ cá nhân</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-700 uppercase mb-1.5">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={profileData.fullName}
                        onChange={(e) =>
                          setProfileData({ ...profileData, fullName: e.target.value })
                        }
                        required
                        className="w-full h-10 px-3.5 border border-neutral-300 rounded-[3px] text-sm focus:border-black focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-700 uppercase mb-1.5">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                        required
                        className="w-full h-10 px-3.5 border border-neutral-300 rounded-[3px] text-sm focus:border-black focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-700 uppercase mb-1.5">
                        Địa chỉ Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData({ ...profileData, email: e.target.value })
                        }
                        required
                        className="w-full h-10 px-3.5 border border-neutral-300 rounded-[3px] text-sm focus:border-black focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-700 uppercase mb-1.5">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={profileData.birthday}
                        onChange={(e) =>
                          setProfileData({ ...profileData, birthday: e.target.value })
                        }
                        className="w-full h-10 px-3.5 border border-neutral-300 rounded-[3px] text-sm focus:border-black focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Shipping Address */}
                <div className="border border-neutral-200 rounded-[3px] p-5 bg-white space-y-4">
                  <div className="flex items-center gap-2 text-[14px] font-bold text-neutral-900 pb-2 border-b border-neutral-100">
                    <MapPin className="w-4 h-4" />
                    <span>Địa chỉ giao hàng mặc định</span>
                  </div>

                  <div className="space-y-4 text-sm">
                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-700 uppercase mb-1.5">
                        Địa chỉ chi tiết (Số nhà, Tên đường)
                      </label>
                      <input
                        type="text"
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({ ...profileData, address: e.target.value })
                        }
                        required
                        className="w-full h-10 px-3.5 border border-neutral-300 rounded-[3px] text-sm focus:border-black focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[12px] font-semibold text-neutral-700 uppercase mb-1.5">
                        Quận / Huyện, Tỉnh / Thành phố
                      </label>
                      <input
                        type="text"
                        value={profileData.city}
                        onChange={(e) =>
                          setProfileData({ ...profileData, city: e.target.value })
                        }
                        required
                        className="w-full h-10 px-3.5 border border-neutral-300 rounded-[3px] text-sm focus:border-black focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                {/* Section 3: Password Change Note */}
                <div className="border border-neutral-200 rounded-[3px] p-5 bg-white flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-neutral-700" />
                      <span>Bảo mật & Mật khẩu</span>
                    </div>
                    <div className="text-[12.5px] text-neutral-500 mt-1">
                      Mật khẩu lần cuối được cập nhật cách đây 30 ngày
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => showToast("Đã gửi liên kết đổi mật khẩu về email của bạn!")}
                    className="px-3.5 py-2 border border-neutral-300 text-xs font-semibold rounded-[3px] hover:border-black transition"
                  >
                    Đổi mật khẩu
                  </button>
                </div>

                {/* Action Submit Button */}
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-6 h-11 bg-black text-white text-xs font-bold tracking-widest uppercase rounded-[3px] hover:bg-neutral-800 transition shadow-sm"
                  >
                    LƯU THAY ĐỔI
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-[3px] border border-neutral-200 p-6 max-w-sm w-full shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <LogOut className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-center text-neutral-900 mb-2">
              Xác nhận đăng xuất
            </h3>
            <p className="text-xs text-center text-neutral-500 mb-6 leading-relaxed">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản Ninety Eight Studio?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 h-10 border border-neutral-300 text-xs font-semibold rounded-[3px] hover:bg-neutral-50 transition"
              >
                HỦY
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 h-10 bg-rose-600 text-white text-xs font-bold rounded-[3px] hover:bg-rose-700 transition"
              >
                ĐĂNG XUẤT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
