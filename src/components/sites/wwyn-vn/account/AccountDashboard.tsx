"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Lock,
  Mail,
  Phone,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  api,
  getCustomerToken,
  setCustomerToken,
  removeCustomerToken,
  getCustomerUser,
  setCustomerUser,
  CustomerUser,
} from "@/lib/api";

interface OrderItem {
  id: number;
  product_name: string;
  color_name: string;
  quantity: number;
  unit_price: number | string;
  image: string;
}

interface Order {
  id: number;
  order_code: string;
  created_at: string;
  total_amount: number | string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  items: OrderItem[];
}

export const AccountDashboard: React.FC = () => {
  // Auth State
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUserState] = useState<CustomerUser | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  // Login / Register Form State
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authFullName, setAuthFullName] = useState("");
  const [authPhone, setAuthPhone] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Dashboard Tabs
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Profile Form State
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "Nam",
    birthday: "",
    address: "",
    province: "",
    district: "",
    ward: "",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Initial check on client mount
  useEffect(() => {
    const savedToken = getCustomerToken();
    const savedUser = getCustomerUser();
    if (savedToken) {
      setTokenState(savedToken);
      setUserState(savedUser);
    }
    setAuthChecking(false);
  }, []);

  // Fetch data whenever user is logged in
  useEffect(() => {
    if (!token) return;

    // Fetch Profile
    const fetchProfile = async () => {
      setProfileLoading(true);
      try {
        const res = await api.get<{
          id: number;
          full_name: string;
          email: string;
          phone?: string;
          gender?: string;
          birthday?: string;
          address?: {
            street_address?: string;
            province?: string;
            district?: string;
            ward?: string;
          };
        }>("/auth/profile");

        if (res.data) {
          const d = res.data;
          setProfileData({
            fullName: d.full_name || "",
            email: d.email || "",
            phone: d.phone || "",
            gender: d.gender || "Nam",
            birthday: d.birthday ? d.birthday.slice(0, 10) : "",
            address: d.address?.street_address || "",
            province: d.address?.province || "",
            district: d.address?.district || "",
            ward: d.address?.ward || "",
          });
          setUserState((prev) => ({
            id: d.id,
            full_name: d.full_name,
            email: d.email,
            phone: d.phone,
            role: prev?.role || "customer",
          }));
        }
      } catch (err) {
        console.error("Lỗi nạp thông tin cá nhân:", err);
      } finally {
        setProfileLoading(false);
      }
    };

    // Fetch My Orders
    const fetchOrders = async () => {
      setOrdersLoading(true);
      try {
        const res = await api.get<Order[]>("/orders/my-orders");
        if (res.data && Array.isArray(res.data)) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error("Lỗi nạp danh sách đơn hàng:", err);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchProfile();
    fetchOrders();
  }, [token]);

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await api.post<{
        token: string;
        user: CustomerUser;
      }>("/auth/login", {
        email: authEmail.trim(),
        password: authPassword,
      });

      if (res.token && res.user) {
        setCustomerToken(res.token);
        setCustomerUser(res.user);
        setTokenState(res.token);
        setUserState(res.user);
        showToast(`Xin chào mừng, ${res.user.full_name}!`);
      } else {
        throw new Error(res.message || "Đăng nhập thất bại");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setAuthError(error.message || "Email hoặc mật khẩu không chính xác");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);

    try {
      const res = await api.post<{
        token: string;
        user: CustomerUser;
      }>("/auth/register", {
        full_name: authFullName.trim(),
        email: authEmail.trim(),
        phone: authPhone.trim(),
        password: authPassword,
      });

      if (res.token && res.user) {
        setCustomerToken(res.token);
        setCustomerUser(res.user);
        setTokenState(res.token);
        setUserState(res.user);
        showToast("Đăng ký tài khoản thành công!");
      } else {
        throw new Error(res.message || "Đăng ký thất bại");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setAuthError(error.message || "Lỗi đăng ký tài khoản");
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Update Profile
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSaving(true);

    try {
      await api.put("/auth/profile", {
        full_name: profileData.fullName,
        phone: profileData.phone,
        gender: profileData.gender,
        birthday: profileData.birthday || null,
        street_address: profileData.address,
        province: profileData.province,
        district: profileData.district,
        ward: profileData.ward,
      });

      setUserState((prev) =>
        prev
          ? {
              ...prev,
              full_name: profileData.fullName,
              phone: profileData.phone,
            }
          : null
      );

      showToast("Cập nhật thông tin tài khoản thành công!");
    } catch (err: unknown) {
      const error = err as Error;
      alert("Lỗi cập nhật hồ sơ: " + error.message);
    } finally {
      setProfileSaving(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    removeCustomerToken();
    setTokenState(null);
    setUserState(null);
    setShowLogoutModal(false);
    showToast("Đã đăng xuất tài khoản thành công!");
  };

  // Helper formatters
  const formatVND = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount) || 0);
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">Chờ xác nhận</span>;
      case "confirmed":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">Đã xác nhận</span>;
      case "processing":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">Đang chuẩn bị</span>;
      case "shipping":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">Đang giao hàng</span>;
      case "completed":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Đã hoàn thành</span>;
      case "cancelled":
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600 border border-zinc-200">Đã hủy</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 text-zinc-600">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    if (status === "paid") {
      return <span className="text-[11px] font-medium text-emerald-600">Đã thanh toán</span>;
    }
    return <span className="text-[11px] font-medium text-amber-600">Chưa thanh toán</span>;
  };

  if (authChecking) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-zinc-500">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-800 mb-3" />
        <span className="text-xs">Đang kiểm tra phiên đăng nhập...</span>
      </div>
    );
  }

  // ================= VIEW 1: NOT LOGGED IN -> AUTH CARD =================
  if (!token) {
    return (
      <div className="w-full max-w-md mx-auto py-8 px-4">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[300] bg-black text-white px-5 py-3.5 rounded-[3px] shadow-2xl text-sm font-medium flex items-center gap-3 border border-neutral-700">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="border border-neutral-200 bg-white rounded-[3px] shadow-sm p-6 sm:p-8">
          <div className="text-center mb-6">
            <h1 className="text-lg sm:text-xl font-bold tracking-wider uppercase text-neutral-900">
              Tài khoản Ninety Eight
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Đăng nhập để theo dõi đơn hàng và quản lý thông tin nhận hàng
            </p>
          </div>

          {/* Switch Tab: Login / Register */}
          <div className="grid grid-cols-2 p-1 bg-neutral-100 rounded-[3px] mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode("login");
                setAuthError(null);
              }}
              className={`py-2 text-xs font-bold tracking-wider uppercase transition-all rounded-[2px] cursor-pointer ${
                authMode === "login"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              Đăng nhập
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("register");
                setAuthError(null);
              }}
              className={`py-2 text-xs font-bold tracking-wider uppercase transition-all rounded-[2px] cursor-pointer ${
                authMode === "register"
                  ? "bg-white text-black shadow-sm"
                  : "text-neutral-500 hover:text-black"
              }`}
            >
              Đăng ký
            </button>
          </div>

          {/* Error Message Alert */}
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[3px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* LOGIN FORM */}
          {authMode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Email hoặc Số điện thoại *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full h-10 pl-9 pr-3 text-xs border border-neutral-300 rounded-[3px] focus:outline-none focus:border-black text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Mật khẩu *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-10 pl-9 pr-3 text-xs border border-neutral-300 rounded-[3px] focus:outline-none focus:border-black text-neutral-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-11 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-[3px] hover:bg-neutral-800 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng nhập</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* REGISTER FORM */}
          {authMode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Họ và tên *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    placeholder="Nguyễn Văn Nam"
                    className="w-full h-10 pl-9 pr-3 text-xs border border-neutral-300 rounded-[3px] focus:outline-none focus:border-black text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Địa chỉ Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full h-10 pl-9 pr-3 text-xs border border-neutral-300 rounded-[3px] focus:outline-none focus:border-black text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Số điện thoại
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={authPhone}
                    onChange={(e) => setAuthPhone(e.target.value)}
                    placeholder="0912 345 678"
                    className="w-full h-10 pl-9 pr-3 text-xs border border-neutral-300 rounded-[3px] focus:outline-none focus:border-black text-neutral-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Mật khẩu tạo mới *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full h-10 pl-9 pr-3 text-xs border border-neutral-300 rounded-[3px] focus:outline-none focus:border-black text-neutral-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full h-11 bg-black text-white text-xs font-bold uppercase tracking-widest rounded-[3px] hover:bg-neutral-800 transition flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Đang tạo tài khoản...</span>
                  </>
                ) : (
                  <>
                    <span>Tạo tài khoản</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ================= VIEW 2: LOGGED IN DASHBOARD =================
  const userInitials = (profileData.fullName || user?.full_name || "N")
    .split(" ")
    .pop()
    ?.charAt(0)
    .toUpperCase() || "N";

  return (
    <div className="w-full">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[300] bg-black text-white px-5 py-3.5 rounded-[3px] shadow-2xl text-sm font-medium flex items-center gap-3 border border-neutral-700">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
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
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-base select-none shrink-0">
                {userInitials}
              </div>
              <div className="min-w-0">
                <div className="text-[14px] font-bold text-neutral-900 truncate">
                  {profileData.fullName || user?.full_name || "Khách hàng"}
                </div>
                <div className="text-[12px] text-neutral-500 truncate">
                  {profileData.email || user?.email}
                </div>
                <div className="text-[11px] font-semibold text-neutral-400 mt-0.5 tracking-wider uppercase">
                  Khách hàng thân thiết
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="bg-white border border-neutral-200 rounded-[3px] overflow-hidden">
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`w-full px-4 py-3.5 flex items-center justify-between text-left text-[13.5px] transition-colors border-b border-neutral-100 cursor-pointer ${
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
                {orders.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`w-full px-4 py-3.5 flex items-center justify-between text-left text-[13.5px] transition-colors border-b border-neutral-100 cursor-pointer ${
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
              className="w-full px-4 py-3.5 flex items-center justify-between text-left text-[13.5px] text-rose-600 hover:bg-rose-50 transition-colors font-medium cursor-pointer"
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
                    Quản lý và theo dõi tiến độ các đơn hàng thực tế từ hệ thống
                  </p>
                </div>
                <Link
                  href="/cua-hang"
                  className="hidden sm:inline-flex items-center text-[12px] font-semibold text-black underline underline-offset-4 hover:opacity-80 transition"
                >
                  Mua sắm thêm
                </Link>
              </div>

              {ordersLoading ? (
                <div className="p-12 text-center text-zinc-400 bg-white border border-neutral-200 rounded-[3px]">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-zinc-800" />
                  <span className="text-xs">Đang tải lịch sử đơn hàng từ máy chủ...</span>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center text-zinc-500 bg-white border border-neutral-200 rounded-[3px]">
                  <Package className="w-10 h-10 mx-auto text-zinc-300 mb-3" />
                  <div className="font-semibold text-sm text-neutral-900">Chưa có đơn hàng nào</div>
                  <p className="text-xs text-neutral-500 mt-1 mb-5">
                    Bạn chưa thực hiện đơn đặt hàng nào tại Ninety Eight Studio.
                  </p>
                  <Link
                    href="/cua-hang"
                    className="px-5 py-2.5 bg-black text-white text-xs font-bold tracking-wider uppercase rounded-[3px] hover:bg-neutral-800 transition"
                  >
                    Khám phá sản phẩm ngay
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const rawItems = Array.isArray(order.items)
                      ? order.items
                      : typeof order.items === "string"
                      ? JSON.parse(order.items || "[]")
                      : [];

                    const orderDate = order.created_at
                      ? new Date(order.created_at).toLocaleDateString("vi-VN")
                      : "Gần đây";

                    return (
                      <div
                        key={order.id}
                        className="border border-neutral-200 rounded-[3px] bg-white overflow-hidden shadow-sm hover:border-neutral-300 transition-colors"
                      >
                        {/* Order Header */}
                        <div className="bg-neutral-50 px-4 py-3 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900 tracking-wider">
                              {order.order_code}
                            </span>
                            {getOrderStatusBadge(order.order_status)}
                          </div>
                          <span className="text-neutral-500 flex items-center gap-1.5 text-xs">
                            <Clock className="w-3.5 h-3.5 text-neutral-400" />
                            {orderDate}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="p-4 divide-y divide-neutral-100">
                          {rawItems.length === 0 ? (
                            <div className="text-xs text-neutral-400 py-2">Chi tiết sản phẩm đang được cập nhật</div>
                          ) : (
                            rawItems.map((item: OrderItem, idx: number) => (
                              <div
                                key={item.id || idx}
                                className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <img
                                    src={item.image || "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/thumb-1-b6c013de.png"}
                                    alt={item.product_name}
                                    className="w-14 h-16 object-cover rounded-[2px] bg-neutral-100 border border-neutral-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="text-[13px] sm:text-[14px] font-semibold text-neutral-900 block truncate">
                                      {item.product_name}
                                    </div>
                                    <div className="text-[11.5px] text-neutral-500 mt-0.5">
                                      Màu: <span className="font-medium text-neutral-700">{item.color_name || "Mặc định"}</span> • SL: {item.quantity}
                                    </div>
                                    <div className="text-[13px] font-bold text-neutral-900 sm:hidden mt-1">
                                      {formatVND(item.unit_price)}
                                    </div>
                                  </div>
                                </div>

                                <div className="hidden sm:block text-right shrink-0">
                                  <div className="text-[13.5px] font-bold text-neutral-900">
                                    {formatVND(item.unit_price)}
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Order Footer */}
                        <div className="bg-neutral-50/70 px-4 py-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-[12.5px]">
                          <div className="text-neutral-500 flex items-center gap-2">
                            <CreditCard className="w-3.5 h-3.5 text-neutral-400" />
                            <span>
                              {order.payment_method === "vietqr"
                                ? "Chuyển khoản VietQR"
                                : order.payment_method === "cod"
                                ? "Thanh toán khi nhận hàng (COD)"
                                : "Thẻ ngân hàng"}
                            </span>
                            <span>•</span>
                            {getPaymentStatusBadge(order.payment_status)}
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-neutral-500 text-xs mr-2">Tổng tiền:</span>
                              <span className="text-[15px] font-bold text-neutral-900">
                                {formatVND(order.total_amount)}
                              </span>
                            </div>

                            <Link
                              href="/cua-hang"
                              className="px-3 py-1.5 border border-neutral-300 bg-white text-neutral-800 hover:border-black text-xs font-semibold rounded-[3px] flex items-center gap-1.5 transition"
                            >
                              <RotateCcw className="w-3 h-3" />
                              <span>Mua thêm</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
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
                  Dữ liệu được lưu trữ và đồng bộ bảo mật trực tiếp trên máy chủ
                </p>
              </div>

              {profileLoading ? (
                <div className="p-12 text-center text-zinc-400 bg-white border border-neutral-200 rounded-[3px]">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-zinc-800" />
                  <span className="text-xs">Đang nạp hồ sơ cá nhân...</span>
                </div>
              ) : (
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
                          Họ và tên *
                        </label>
                        <input
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) =>
                            setProfileData({ ...profileData, fullName: e.target.value })
                          }
                          required
                          className="w-full h-10 px-3.5 border border-neutral-300 rounded-[3px] text-xs sm:text-sm focus:border-black focus:outline-none transition"
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
                          className="w-full h-10 px-3.5 border border-neutral-300 rounded-[3px] text-xs sm:text-sm focus:border-black focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-semibold text-neutral-700 uppercase mb-1.5">
                          Địa chỉ Email (Cố định)
                        </label>
                        <input
                          type="email"
                          disabled
                          value={profileData.email}
                          className="w-full h-10 px-3.5 border border-neutral-200 rounded-[3px] text-xs sm:text-sm bg-neutral-50 text-neutral-500 cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block text-[12px] font-semibold text-neutral-700 uppercase mb-1.5">
                          Giới tính
                        </label>
                        <select
                          value={profileData.gender}
                          onChange={(e) => setProfileData({ ...profileData, gender: e.target.value })}
                          className="w-full h-10 px-3.5 border border-neutral-300 rounded-[3px] text-xs sm:text-sm focus:border-black focus:outline-none transition bg-white"
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
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
                          className="w-full h-10 px-3.5 border border-neutral-300 rounded-[3px] text-xs sm:text-sm focus:border-black focus:outline-none transition"
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
                          placeholder="Số 98 Đường Nguyễn Huệ"
                          className="w-full h-10 px-3.5 border border-neutral-300 rounded-[3px] text-xs sm:text-sm focus:border-black focus:outline-none transition"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
                            Tỉnh / Thành phố
                          </label>
                          <input
                            type="text"
                            value={profileData.province}
                            onChange={(e) => setProfileData({ ...profileData, province: e.target.value })}
                            placeholder="TP. Hồ Chí Minh"
                            className="w-full h-10 px-3 border border-neutral-300 rounded-[3px] text-xs focus:border-black focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
                            Quận / Huyện
                          </label>
                          <input
                            type="text"
                            value={profileData.district}
                            onChange={(e) => setProfileData({ ...profileData, district: e.target.value })}
                            placeholder="Quận 1"
                            className="w-full h-10 px-3 border border-neutral-300 rounded-[3px] text-xs focus:border-black focus:outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-neutral-700 uppercase mb-1">
                            Phường / Xã
                          </label>
                          <input
                            type="text"
                            value={profileData.ward}
                            onChange={(e) => setProfileData({ ...profileData, ward: e.target.value })}
                            placeholder="Phường Bến Nghé"
                            className="w-full h-10 px-3 border border-neutral-300 rounded-[3px] text-xs focus:border-black focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section 3: Security & Password */}
                  <div className="border border-neutral-200 rounded-[3px] p-5 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="text-[14px] font-bold text-neutral-900 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-neutral-700" />
                        <span>Bảo mật tài khoản</span>
                      </div>
                      <div className="text-[12px] text-neutral-500 mt-1">
                        Mật khẩu và thông tin đăng nhập của bạn được mã hóa an toàn trên hệ thống
                      </div>
                    </div>
                  </div>

                  {/* Action Submit Button */}
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="px-8 h-11 bg-black text-white text-xs font-bold tracking-widest uppercase rounded-[3px] hover:bg-neutral-800 transition shadow-sm flex items-center gap-2 cursor-pointer"
                    >
                      {profileSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Đang lưu...</span>
                        </>
                      ) : (
                        <span>LƯU THAY ĐỔI</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
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
                className="flex-1 h-10 border border-neutral-300 text-xs font-semibold rounded-[3px] hover:bg-neutral-50 transition cursor-pointer"
              >
                HỦY
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 h-10 bg-rose-600 text-white text-xs font-bold rounded-[3px] hover:bg-rose-700 transition cursor-pointer"
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
