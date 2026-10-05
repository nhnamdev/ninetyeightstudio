"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  ShoppingCart,
  Search,
  RefreshCw,
  Eye,
  X,
  MapPin,
  User,
  Loader2,
  Calendar,
} from "lucide-react";
import { api } from "@/lib/api";

interface OrderItem {
  id: number;
  product_id: number;
  variant_id: number;
  product_name: string;
  color_name: string;
  sku: string;
  image: string;
  unit_price: number | string;
  quantity: number;
  total_price: number | string;
}

interface Order {
  id: number;
  order_code: string;
  user_id?: number | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_province: string;
  shipping_district: string;
  shipping_ward?: string;
  shipping_address: string;
  order_notes?: string;
  subtotal: number | string;
  shipping_fee: number | string;
  discount_amount: number | string;
  total_amount: number | string;
  coupon_code?: string;
  shipping_method: string;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
  paid_at?: string;
  cancelled_at?: string;
  cancel_reason?: string;
  items?: OrderItem[];
  item_count?: number;
}

function OrdersContent() {
  const searchParams = useSearchParams();
  const initialViewId = searchParams.get("view");

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState("all");
  const [search, setSearch] = useState("");

  // Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let endpoint = "/orders";
      const params = new URLSearchParams();
      if (statusTab !== "all") params.append("status", statusTab);
      if (search) params.append("search", search);
      if (params.toString()) endpoint += `?${params.toString()}`;

      const res = await api.get<Order[]>(endpoint);
      if (res.data) {
        setOrders(res.data);
      }
    } catch (err) {
      console.error("Orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const openOrderDetail = async (idOrOrder: number | Order) => {
    const id = typeof idOrOrder === "number" ? idOrOrder : idOrOrder.id;
    setDetailLoading(true);
    try {
      const res = await api.get<Order>(`/orders/${id}`);
      if (res.data) {
        setSelectedOrder(res.data);
      }
    } catch (err) {
      console.error("Order detail error:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusTab]);

  useEffect(() => {
    if (initialViewId) {
      openOrderDetail(Number(initialViewId));
    }
  }, [initialViewId]);

  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    setActionLoading(true);
    try {
      await api.put(`/orders/${orderId}/status`, { order_status: newStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, order_status: newStatus });
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Lỗi cập nhật trạng thái đơn hàng");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: number, newPaymentStatus: string) => {
    setActionLoading(true);
    try {
      await api.put(`/orders/${orderId}/payment`, { payment_status: newPaymentStatus });
      fetchOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, payment_status: newPaymentStatus });
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Lỗi cập nhật trạng thái thanh toán");
    } finally {
      setActionLoading(false);
    }
  };

  const formatVND = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(amount));
  };

  const tabs = [
    { id: "all", label: "Tất cả" },
    { id: "pending", label: "Chờ xử lý" },
    { id: "confirmed", label: "Đã xác nhận" },
    { id: "shipping", label: "Đang giao" },
    { id: "completed", label: "Hoàn thành" },
    { id: "cancelled", label: "Đã hủy" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <ShoppingCart className="w-7 h-7 text-red-500" />
            Quản lý Đơn hàng (Orders)
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Theo dõi, xử lý vận chuyển và cập nhật trạng thái đơn hàng VietQR / COD
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới đơn</span>
        </button>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-zinc-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                statusTab === tab.id
                  ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-[#141720] border border-zinc-800/80 rounded-2xl p-3 sm:p-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
              placeholder="Tìm theo mã đơn (#NES-xxxxx), tên khách hoặc số điện thoại..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>
          <button
            onClick={fetchOrders}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white rounded-xl cursor-pointer"
          >
            Tìm
          </button>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-[#141720] border border-zinc-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-800/80 text-zinc-400 bg-zinc-900/40 text-[11px] uppercase tracking-wider">
                <th className="p-4 pl-6">Mã đơn & Thời gian</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Địa chỉ giao</th>
                <th className="p-4">Thanh toán</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">Trạng thái xử lý</th>
                <th className="p-4 pr-6 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-red-500" />
                    <span>Đang tải danh sách đơn hàng...</span>
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-400">
                    Không có đơn hàng nào trong mục này
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="font-mono font-bold text-white text-xs sm:text-sm">
                        {order.order_code}
                      </div>
                      <div className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-500" />
                        {new Date(order.created_at).toLocaleDateString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-white">{order.customer_name}</div>
                      <div className="text-[11px] text-zinc-400 font-mono">{order.customer_phone}</div>
                    </td>

                    <td className="p-4 max-w-xs">
                      <div className="text-xs text-zinc-300 line-clamp-2">
                        {order.shipping_address}, {order.shipping_district}, {order.shipping_province}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="uppercase text-[11px] font-bold px-2 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-300 inline-block">
                          {order.payment_method === "vietqr" ? "VietQR Chuyển khoản" : "COD Tiền mặt"}
                        </span>
                        <div>
                          {order.payment_status === "paid" ? (
                            <span className="text-[11px] text-emerald-400 font-medium">✓ Đã thanh toán</span>
                          ) : (
                            <button
                              onClick={() => handleUpdatePaymentStatus(order.id, "paid")}
                              title="Bấm để đánh dấu đã nhận tiền"
                              className="text-[11px] text-amber-400 hover:underline cursor-pointer"
                            >
                              ⏳ Chưa trả (Đánh dấu đã thu)
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-4 font-mono font-bold text-white text-xs sm:text-sm">
                      {formatVND(order.total_amount)}
                    </td>

                    {/* Quick status dropdown */}
                    <td className="p-4">
                      <select
                        value={order.order_status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg border focus:outline-none cursor-pointer ${
                          order.order_status === "pending"
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                            : order.order_status === "confirmed"
                            ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                            : order.order_status === "shipping"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/30"
                            : order.order_status === "completed"
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                        }`}
                      >
                        <option value="pending" className="bg-zinc-900 text-zinc-200">Chờ xử lý</option>
                        <option value="confirmed" className="bg-zinc-900 text-zinc-200">Đã xác nhận</option>
                        <option value="shipping" className="bg-zinc-900 text-zinc-200">Đang giao hàng</option>
                        <option value="completed" className="bg-zinc-900 text-zinc-200">Hoàn thành</option>
                        <option value="cancelled" className="bg-zinc-900 text-zinc-200">Hủy đơn</option>
                      </select>
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <button
                        onClick={() => openOrderDetail(order)}
                        className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        title="Xem chi tiết đơn hàng"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#141720] border border-zinc-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white font-mono">
                    Đơn hàng {selectedOrder.order_code}
                  </h2>
                  {detailLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />}
                  <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                    ID #{selectedOrder.id}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Ngày đặt: {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* Customer & Delivery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
                  <div className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5 text-red-400">
                    <User className="w-3.5 h-3.5" />
                    Người nhận hàng
                  </div>
                  <div>
                    Họ tên: <span className="font-semibold text-white">{selectedOrder.customer_name}</span>
                  </div>
                  <div>
                    SĐT: <span className="font-mono text-zinc-200">{selectedOrder.customer_phone}</span>
                  </div>
                  {selectedOrder.customer_email && (
                    <div>
                      Email: <span className="text-zinc-300">{selectedOrder.customer_email}</span>
                    </div>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 space-y-2 text-xs">
                  <div className="font-bold text-white uppercase text-[11px] tracking-wider flex items-center gap-1.5 text-blue-400">
                    <MapPin className="w-3.5 h-3.5" />
                    Địa chỉ giao hàng
                  </div>
                  <div className="text-zinc-300">
                    {selectedOrder.shipping_address}, {selectedOrder.shipping_district}, {selectedOrder.shipping_province}
                  </div>
                  {selectedOrder.order_notes && (
                    <div className="text-amber-400/90 pt-1 border-t border-zinc-800">
                      Ghi chú: {selectedOrder.order_notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-3">
                  Danh sách sản phẩm trong đơn ({selectedOrder.items?.length || 0} món)
                </h3>
                <div className="border border-zinc-800 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[11px]">
                        <th className="p-3">Sản phẩm</th>
                        <th className="p-3">Màu sắc</th>
                        <th className="p-3">Mã SKU</th>
                        <th className="p-3">Đơn giá</th>
                        <th className="p-3">Số lượng</th>
                        <th className="p-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0">
                                  <img
                                    src={item.image || "/images/products/placeholder.jpg"}
                                    alt={item.product_name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-medium text-white">{item.product_name}</span>
                              </div>
                            </td>
                            <td className="p-3 font-semibold text-zinc-200">{item.color_name}</td>
                            <td className="p-3 font-mono text-zinc-400">{item.sku}</td>
                            <td className="p-3 font-mono">{formatVND(item.unit_price)}</td>
                            <td className="p-3 font-mono font-bold text-white">x{item.quantity}</td>
                            <td className="p-3 font-mono font-bold text-white text-right">
                              {formatVND(Number(item.unit_price) * item.quantity)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-zinc-400">
                            Không có sản phẩm nào
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Payment Summary */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Tiền hàng tạm tính:</span>
                  <span className="font-mono">{formatVND(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Phí vận chuyển:</span>
                  <span className="font-mono">{formatVND(selectedOrder.shipping_fee)}</span>
                </div>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-red-400">
                    <span>Mã giảm giá ({selectedOrder.coupon_code || "VOUCHER"}):</span>
                    <span className="font-mono">-{formatVND(selectedOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-zinc-800 flex justify-between items-center text-sm font-bold text-white">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-base text-red-500 font-mono">
                    {formatVND(selectedOrder.total_amount)}
                  </span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="p-4 rounded-xl bg-[#181a24] border border-zinc-800 space-y-3">
                <div className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Cập nhật tiến trình xử lý đơn hàng
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, "confirmed")}
                    disabled={actionLoading || selectedOrder.order_status === "confirmed"}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs font-medium cursor-pointer"
                  >
                    1. Xác nhận đơn
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, "shipping")}
                    disabled={actionLoading || selectedOrder.order_status === "shipping"}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-medium cursor-pointer"
                  >
                    2. Giao hàng cho shipper
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, "completed")}
                    disabled={actionLoading || selectedOrder.order_status === "completed"}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-medium cursor-pointer"
                  >
                    3. Hoàn thành đơn hàng
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Hủy đơn hàng này sẽ hoàn trả số lượng đã giữ về kho tồn. Bạn có chắc không?")) {
                        handleUpdateOrderStatus(selectedOrder.id, "cancelled");
                      }
                    }}
                    disabled={actionLoading || selectedOrder.order_status === "cancelled"}
                    className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 disabled:opacity-40 text-xs font-medium cursor-pointer"
                  >
                    Hủy đơn hàng
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200 cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminOrdersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-zinc-400 text-xs">
          Đang tải dữ liệu đơn hàng...
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
