"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingCart,
  Clock,
  Users,
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  RefreshCw,
  Plus,
} from "lucide-react";
import { api } from "@/lib/api";

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockItems: Array<{
    id: number;
    product_id: number;
    product_name: string;
    color_name: string;
    sku: string;
    stock: number;
    reserved_stock: number;
    available_stock: number;
    image: string;
  }>;
  recentOrders: Array<{
    id: number;
    order_code: string;
    customer_name: string;
    customer_phone: string;
    total_amount: string | number;
    payment_method: string;
    payment_status: string;
    order_status: string;
    created_at: string;
    item_count: number;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<DashboardStats>("/dashboard/stats");
      if (res.data) {
        setStats(res.data);
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Không thể tải thống kê bảng điều khiển");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const formatVND = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(amount));
  };

  const getOrderStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Chờ xử lý</span>;
      case "confirmed":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">Đã xác nhận</span>;
      case "shipping":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Đang giao</span>;
      case "completed":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Hoàn thành</span>;
      case "cancelled":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Đã hủy</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-zinc-800 text-zinc-300">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Bảng điều khiển kinh doanh
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Tổng quan hiệu suất bán hàng, tồn kho Shopee-style và đơn hàng thời gian thực
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-2 border border-zinc-700/60 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Làm mới</span>
          </button>
          <Link
            href="/admin/products"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-lg shadow-red-600/20 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm sản phẩm</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={fetchStats} className="underline text-xs">Thử lại</button>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Doanh thu */}
        <div className="bg-[#141720] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Doanh thu thực</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {stats ? formatVND(stats.totalRevenue) : "---"}
            </div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Đơn hàng đã thanh toán & xác nhận</span>
            </p>
          </div>
        </div>

        {/* Tổng đơn hàng */}
        <div className="bg-[#141720] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Tổng đơn hàng</span>
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {stats ? stats.totalOrders : "---"}
            </div>
            <p className="text-xs text-zinc-400 mt-1">Toàn bộ đơn trên hệ thống</p>
          </div>
        </div>

        {/* Đơn chờ xử lý */}
        <div className="bg-[#141720] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Đơn chờ xử lý</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-mono">
              {stats ? stats.pendingOrders : "---"}
            </div>
            <p className="text-xs text-zinc-400 mt-1">Cần xác nhận và xuất kho</p>
          </div>
        </div>

        {/* Khách hàng */}
        <div className="bg-[#141720] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Khách hàng</span>
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">
              {stats ? stats.totalCustomers : "---"}
            </div>
            <p className="text-xs text-zinc-400 mt-1">Thành viên Ninety Eight Club</p>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts + Quick Inventory Grid */}
      <div className="bg-[#141720] border border-zinc-800/80 rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Cảnh báo kho hàng Shopee (Biến thể màu sắp hết)
              </h2>
              <p className="text-xs text-zinc-400">
                Các phân loại màu có số lượng tồn khả dụng (Kho - Giữ chỗ) ≤ 10 sản phẩm
              </p>
            </div>
          </div>
          <Link
            href="/admin/products"
            className="text-xs text-red-400 hover:text-red-300 font-medium flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Quản lý kho toàn bộ</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats && stats.lowStockItems && stats.lowStockItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {stats.lowStockItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3.5 hover:border-zinc-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-zinc-800 overflow-hidden shrink-0 border border-zinc-700">
                  <img
                    src={item.image || "/images/products/placeholder.jpg"}
                    alt={item.color_name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-white truncate">{item.product_name}</p>
                  <p className="text-[11px] text-zinc-400">
                    Màu: <span className="text-zinc-200">{item.color_name}</span>
                  </p>
                  <div className="mt-1 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-400">SKU: {item.sku}</span>
                    <span
                      className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                        item.available_stock <= 3
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      Còn {item.available_stock}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-400 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Tất cả biến thể phân loại hiện tại đều có mức tồn kho an toàn!</span>
          </div>
        )}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-[#141720] border border-zinc-800/80 rounded-2xl overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-zinc-800/80 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white">Đơn hàng mới nhất</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Các đơn đặt hàng gần đây qua VietQR & COD</p>
          </div>
          <Link
            href="/admin/orders"
            className="text-xs text-zinc-300 hover:text-white font-medium flex items-center gap-1"
          >
            <span>Xem tất cả đơn hàng</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-800/80 text-zinc-400 bg-zinc-900/40 text-[11px] uppercase tracking-wider">
                <th className="p-4 pl-6">Mã đơn</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Thanh toán</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4 pr-6 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {stats && stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 pl-6 font-mono font-bold text-white">
                      {order.order_code}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-white">{order.customer_name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{order.customer_phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="inline-flex items-center gap-1.5">
                        <span className="uppercase text-[11px] font-bold text-zinc-300 px-1.5 py-0.5 rounded bg-zinc-800 border border-zinc-700">
                          {order.payment_method}
                        </span>
                        <span className={`text-[11px] ${order.payment_status === "paid" ? "text-emerald-400" : "text-zinc-400"}`}>
                          {order.payment_status === "paid" ? "Đã trả" : "Chưa trả"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-white">
                      {formatVND(order.total_amount)}
                    </td>
                    <td className="p-4">
                      {getOrderStatusBadge(order.order_status)}
                    </td>
                    <td className="p-4 text-xs text-zinc-400">
                      {new Date(order.created_at).toLocaleDateString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link
                        href={`/admin/orders?view=${order.id}`}
                        className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors inline-block"
                      >
                        Xem
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-400 text-xs">
                    Chưa có đơn hàng nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
