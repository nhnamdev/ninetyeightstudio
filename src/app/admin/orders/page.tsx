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
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-zinc-800" />
            Quản lý Đơn hàng
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Theo dõi, xử lý vận chuyển và cập nhật trạng thái đơn hàng VietQR / COD
          </p>
        </div>
        <button
          onClick={fetchOrders}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới đơn</span>
        </button>
      </div>

      {/* Tabs & Search Toolbar */}
      <div className="space-y-3">
        {/* Status Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-zinc-200/80">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                statusTab === tab.id
                  ? "bg-zinc-900 text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="bg-white border border-zinc-200/90 rounded-xl p-3 sm:p-4 flex items-center gap-2.5 shadow-xs">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchOrders()}
              placeholder="Tìm theo mã đơn (#NES-xxxxx), tên khách hoặc số điện thoại..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
            />
          </div>
          <button
            onClick={fetchOrders}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-white rounded-lg cursor-pointer"
          >
            Tìm
          </button>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white border border-zinc-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200/80 text-zinc-500 bg-zinc-50/70 text-[11px] uppercase tracking-wider">
                <th className="p-3 pl-5">Mã đơn & Thời gian</th>
                <th className="p-3">Khách hàng</th>
                <th className="p-3">Địa chỉ giao</th>
                <th className="p-3">Thanh toán</th>
                <th className="p-3">Tổng tiền</th>
                <th className="p-3">Trạng thái xử lý</th>
                <th className="p-3 pr-5 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                [1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="p-3 pl-5">
                      <div className="h-4 w-20 bg-zinc-200/80 rounded mb-1" />
                      <div className="h-3 w-16 bg-zinc-200/60 rounded" />
                    </td>
                    <td className="p-3">
                      <div className="h-3.5 w-28 bg-zinc-200/80 rounded mb-1" />
                      <div className="h-2.5 w-20 bg-zinc-200/60 rounded" />
                    </td>
                    <td className="p-3">
                      <div className="h-3.5 w-32 bg-zinc-200/70 rounded" />
                    </td>
                    <td className="p-3">
                      <div className="h-4 w-20 bg-zinc-200/80 rounded" />
                    </td>
                    <td className="p-3">
                      <div className="h-4 w-24 bg-zinc-200/80 rounded" />
                    </td>
                    <td className="p-3">
                      <div className="h-5 w-24 bg-zinc-200/80 rounded-full" />
                    </td>
                    <td className="p-3 pr-5 text-right">
                      <div className="h-6 w-16 bg-zinc-200/80 rounded ml-auto" />
                    </td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-zinc-400">
                    Không có đơn hàng nào trong mục này
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="p-3 pl-5">
                      <div className="font-mono font-semibold text-zinc-900">
                        {order.order_code}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        {new Date(order.created_at).toLocaleDateString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                        })}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-medium text-zinc-900">{order.customer_name}</div>
                      <div className="text-[10px] text-zinc-500 font-mono">{order.customer_phone}</div>
                    </td>

                    <td className="p-3 max-w-xs">
                      <div className="text-zinc-600 line-clamp-1">
                        {order.shipping_address}, {order.shipping_district}, {order.shipping_province}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="space-y-0.5">
                        <span className="uppercase text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-200 text-zinc-700 inline-block">
                          {order.payment_method === "vietqr" ? "VietQR" : "COD"}
                        </span>
                        <div>
                          {order.payment_status === "paid" ? (
                            <span className="text-[11px] text-emerald-700 font-medium">✓ Đã thanh toán</span>
                          ) : (
                            <button
                              onClick={() => handleUpdatePaymentStatus(order.id, "paid")}
                              title="Bấm để đánh dấu đã nhận tiền"
                              className="text-[11px] text-amber-700 hover:underline cursor-pointer"
                            >
                              ⏳ Chưa trả (Đánh dấu)
                            </button>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="p-3 font-mono font-semibold text-zinc-900">
                      {formatVND(order.total_amount)}
                    </td>

                    {/* Quick status dropdown */}
                    <td className="p-3">
                      <select
                        value={order.order_status}
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className={`text-[11px] font-medium px-2 py-1 rounded-md border focus:outline-none cursor-pointer ${
                          order.order_status === "pending"
                            ? "bg-amber-50 text-amber-800 border-amber-200"
                            : order.order_status === "confirmed"
                            ? "bg-blue-50 text-blue-800 border-blue-200"
                            : order.order_status === "shipping"
                            ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                            : order.order_status === "completed"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-zinc-100 text-zinc-700 border-zinc-200"
                        }`}
                      >
                        <option value="pending">Chờ xử lý</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="shipping">Đang giao</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="cancelled">Hủy đơn</option>
                      </select>
                    </td>

                    <td className="p-3 pr-5 text-right">
                      <button
                        onClick={() => openOrderDetail(order)}
                        className="p-1.5 rounded-md bg-white hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200 transition-colors cursor-pointer"
                        title="Xem chi tiết đơn hàng"
                      >
                        <Eye className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden my-auto font-sans">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-zinc-900 font-mono">
                    Đơn hàng {selectedOrder.order_code}
                  </h2>
                  {detailLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />}
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-mono border border-zinc-200">
                    ID #{selectedOrder.id}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Ngày đặt: {new Date(selectedOrder.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* Customer & Delivery Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs">
                  <div className="font-bold text-zinc-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-600" />
                    Người nhận hàng
                  </div>
                  <div>
                    Họ tên: <span className="font-semibold text-zinc-900">{selectedOrder.customer_name}</span>
                  </div>
                  <div>
                    SĐT: <span className="font-mono text-zinc-800">{selectedOrder.customer_phone}</span>
                  </div>
                  {selectedOrder.customer_email && (
                    <div>
                      Email: <span className="text-zinc-600">{selectedOrder.customer_email}</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs">
                  <div className="font-bold text-zinc-900 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                    Địa chỉ giao hàng
                  </div>
                  <div className="text-zinc-700">
                    {selectedOrder.shipping_address}, {selectedOrder.shipping_district}, {selectedOrder.shipping_province}
                  </div>
                  {selectedOrder.order_notes && (
                    <div className="text-amber-800 pt-1 border-t border-zinc-200">
                      Ghi chú: {selectedOrder.order_notes}
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Table */}
              <div>
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2.5">
                  Danh sách sản phẩm trong đơn ({selectedOrder.items?.length || 0} món)
                </h3>
                <div className="border border-zinc-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-zinc-50/70 text-zinc-500 border-b border-zinc-200 text-[11px]">
                        <th className="p-2.5 pl-3">Sản phẩm</th>
                        <th className="p-2.5">Màu</th>
                        <th className="p-2.5">Mã SKU</th>
                        <th className="p-2.5">Đơn giá</th>
                        <th className="p-2.5">Số lượng</th>
                        <th className="p-2.5 pr-3 text-right">Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {selectedOrder.items && selectedOrder.items.length > 0 ? (
                        selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td className="p-2.5 pl-3">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-md bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                                  <img
                                    src={item.image || "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/thumb-1-b6c013de.png"}
                                    alt={item.product_name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="font-medium text-zinc-900">{item.product_name}</span>
                              </div>
                            </td>
                            <td className="p-2.5 font-medium text-zinc-700">{item.color_name}</td>
                            <td className="p-2.5 font-mono text-zinc-500">{item.sku}</td>
                            <td className="p-2.5 font-mono text-zinc-700">{formatVND(item.unit_price)}</td>
                            <td className="p-2.5 font-mono font-bold text-zinc-900">x{item.quantity}</td>
                            <td className="p-2.5 pr-3 font-mono font-bold text-zinc-900 text-right">
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
              <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Tiền hàng tạm tính:</span>
                  <span className="font-mono">{formatVND(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-mono">{formatVND(selectedOrder.shipping_fee)}</span>
                </div>
                {Number(selectedOrder.discount_amount) > 0 && (
                  <div className="flex justify-between text-red-700">
                    <span>Mã giảm giá ({selectedOrder.coupon_code || "VOUCHER"}):</span>
                    <span className="font-mono">-{formatVND(selectedOrder.discount_amount)}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-zinc-200 flex justify-between items-center text-xs font-bold text-zinc-900">
                  <span>Tổng tiền thanh toán:</span>
                  <span className="text-sm font-mono text-zinc-900">
                    {formatVND(selectedOrder.total_amount)}
                  </span>
                </div>
              </div>

              {/* Status Action Buttons */}
              <div className="p-3.5 rounded-xl bg-white border border-zinc-200 space-y-2.5">
                <div className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
                  Cập nhật tiến trình đơn
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, "confirmed")}
                    disabled={actionLoading || selectedOrder.order_status === "confirmed"}
                    className="px-3 py-1 rounded-md bg-white border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 text-zinc-800 text-xs font-medium cursor-pointer"
                  >
                    1. Xác nhận đơn
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, "shipping")}
                    disabled={actionLoading || selectedOrder.order_status === "shipping"}
                    className="px-3 py-1 rounded-md bg-white border border-zinc-200 hover:bg-zinc-50 disabled:opacity-40 text-zinc-800 text-xs font-medium cursor-pointer"
                  >
                    2. Giao hàng
                  </button>
                  <button
                    onClick={() => handleUpdateOrderStatus(selectedOrder.id, "completed")}
                    disabled={actionLoading || selectedOrder.order_status === "completed"}
                    className="px-3 py-1 rounded-md bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white text-xs font-medium cursor-pointer"
                  >
                    3. Hoàn thành
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Hủy đơn hàng này sẽ hoàn trả số lượng đã giữ về kho tồn. Bạn có chắc không?")) {
                        handleUpdateOrderStatus(selectedOrder.id, "cancelled");
                      }
                    }}
                    disabled={actionLoading || selectedOrder.order_status === "cancelled"}
                    className="px-3 py-1 rounded-md bg-white hover:bg-red-50 text-zinc-600 hover:text-red-700 border border-zinc-200 disabled:opacity-40 text-xs font-medium cursor-pointer"
                  >
                    Hủy đơn
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-xs font-medium text-zinc-700 cursor-pointer"
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
        <div className="p-10 text-center text-zinc-400 text-xs">
          Đang tải dữ liệu đơn hàng...
        </div>
      }
    >
      <OrdersContent />
    </Suspense>
  );
}
