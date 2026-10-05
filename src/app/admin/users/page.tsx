"use client";

import React, { useEffect, useState } from "react";
import {
  Users,
  Search,
  RefreshCw,
  UserCheck,
  UserX,
  Mail,
  Phone,
  ShoppingBag,
  Eye,
  X,
  Loader2,
  MapPin,
} from "lucide-react";
import { api } from "@/lib/api";

interface UserItem {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  role: "admin" | "staff" | "customer";
  is_active: number;
  created_at: string;
  total_orders: number;
  total_spent: number | string;
}

interface UserDetail extends UserItem {
  orders?: Array<{
    id: number;
    order_code: string;
    total_amount: number | string;
    order_status: string;
    created_at: string;
  }>;
  addresses?: Array<{
    id: number;
    recipient_name: string;
    phone: string;
    street_address: string;
    district: string;
    province: string;
    is_default: number;
  }>;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // User detail modal
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let endpoint = "/users";
      const params = new URLSearchParams();
      if (roleFilter !== "all") params.append("role", roleFilter);
      if (search) params.append("search", search);
      if (params.toString()) endpoint += `?${params.toString()}`;

      const res = await api.get<UserItem[]>(endpoint);
      if (res.data) setUsers(res.data);
    } catch (err) {
      console.error("Users error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const openUserDetail = async (user: UserItem) => {
    setDetailLoading(true);
    setSelectedUser(null);
    try {
      const res = await api.get<UserDetail>(`/users/${user.id}`);
      if (res.data) {
        setSelectedUser(res.data);
      }
    } catch (err) {
      console.error("User detail error:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleToggleUserStatus = async (user: UserItem) => {
    const newStatus = user.is_active ? 0 : 1;
    const confirmMsg = user.is_active
      ? `Bạn có chắc muốn tạm khóa tài khoản "${user.full_name}"?`
      : `Bạn có muốn mở khóa tài khoản "${user.full_name}"?`;

    if (!confirm(confirmMsg)) return;

    try {
      await api.put(`/users/${user.id}/status`, { is_active: newStatus });
      fetchUsers();
      if (selectedUser && selectedUser.id === user.id) {
        setSelectedUser({ ...selectedUser, is_active: newStatus });
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Lỗi cập nhật trạng thái người dùng");
    }
  };

  const formatVND = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(amount));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-zinc-800" />
            Quản lý Khách hàng & Thành viên
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Danh sách thành viên Ninety Eight Club, lịch sử mua sắm và trạng thái tài khoản
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-zinc-200/90 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between shadow-xs">
        <div className="flex flex-1 items-center gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
              placeholder="Tìm theo họ tên, email hoặc số điện thoại..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="py-1.5 px-2.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-700 focus:outline-none focus:border-zinc-900"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="customer">Khách hàng</option>
            <option value="staff">Nhân viên (Staff)</option>
            <option value="admin">Quản trị viên (Admin)</option>
          </select>
        </div>

        <button
          onClick={fetchUsers}
          className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-white rounded-lg cursor-pointer"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-zinc-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200/80 text-zinc-500 bg-zinc-50/70 text-[11px] uppercase tracking-wider">
                <th className="p-3 pl-5">Khách hàng</th>
                <th className="p-3">Liên hệ</th>
                <th className="p-3">Vai trò</th>
                <th className="p-3">Tổng đơn</th>
                <th className="p-3">Chi tiêu</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 pr-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-zinc-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-zinc-700" />
                    <span>Đang tải danh sách người dùng...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-zinc-400">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="p-3 pl-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center font-bold text-zinc-700 uppercase text-[11px]">
                          {user.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900">{user.full_name}</div>
                          <div className="text-[10px] text-zinc-400">ID: #{user.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="text-zinc-800 text-xs flex items-center gap-1.5">
                        <Mail className="w-3 h-3 text-zinc-400" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="text-zinc-500 text-[11px] font-mono flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-zinc-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      {user.role === "admin" ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-900 text-white">
                          Quản trị
                        </span>
                      ) : user.role === "staff" ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-800 border border-zinc-200">
                          Nhân viên
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-zinc-100 text-zinc-600">
                          Khách hàng
                        </span>
                      )}
                    </td>

                    <td className="p-3 font-mono font-semibold text-zinc-900">
                      {user.total_orders || 0} đơn
                    </td>

                    <td className="p-3 font-mono font-semibold text-zinc-900">
                      {formatVND(user.total_spent || 0)}
                    </td>

                    <td className="p-3">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700">
                          <UserCheck className="w-3.5 h-3.5" />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400">
                          <UserX className="w-3.5 h-3.5" />
                          Tạm khóa
                        </span>
                      )}
                    </td>

                    <td className="p-3 pr-5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => openUserDetail(user)}
                          className="p-1.5 rounded-md bg-white hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200 transition-colors cursor-pointer"
                          title="Xem lịch sử mua hàng & địa chỉ"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            className={`p-1.5 rounded-md text-xs transition-colors cursor-pointer border border-zinc-200 ${
                              user.is_active
                                ? "bg-white hover:bg-red-50 text-zinc-500 hover:text-red-700"
                                : "bg-white hover:bg-emerald-50 text-zinc-500 hover:text-emerald-700"
                            }`}
                            title={user.is_active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                          >
                            {user.is_active ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-xl overflow-hidden my-auto font-sans">
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-zinc-900">
                    Thông tin khách hàng: {selectedUser.full_name}
                  </h2>
                  {detailLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-500" />}
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Ngày tham gia: {new Date(selectedUser.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
              {/* User Overview Stats */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-zinc-500">Tổng số đơn hàng:</span>
                  <div className="text-base font-bold text-zinc-900 mt-0.5 font-mono">
                    {selectedUser.orders?.length || 0} đơn
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200">
                  <span className="text-zinc-500">Tổng chi tiêu:</span>
                  <div className="text-base font-bold text-zinc-900 mt-0.5 font-mono">
                    {formatVND(selectedUser.total_spent || 0)}
                  </div>
                </div>
              </div>

              {/* Saved Addresses */}
              <div>
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-zinc-600" />
                  Sổ địa chỉ nhận hàng ({selectedUser.addresses?.length || 0})
                </h3>
                {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedUser.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-zinc-900">
                            {addr.recipient_name} - <span className="font-mono text-zinc-600">{addr.phone}</span>
                          </div>
                          <div className="text-zinc-600 text-[11px] mt-0.5">
                            {addr.street_address}, {addr.district}, {addr.province}
                          </div>
                        </div>
                        {addr.is_default ? (
                          <span className="text-[10px] font-semibold text-zinc-800 px-1.5 py-0.5 rounded bg-zinc-200/80">
                            Mặc định
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">Khách chưa lưu địa chỉ</p>
                )}
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-zinc-600" />
                  Lịch sử đặt hàng gần đây
                </h3>
                {selectedUser.orders && selectedUser.orders.length > 0 ? (
                  <div className="border border-zinc-200 rounded-lg overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-zinc-50/70 text-zinc-500 border-b border-zinc-200 text-[11px]">
                          <th className="p-2 pl-3">Mã đơn</th>
                          <th className="p-2">Ngày mua</th>
                          <th className="p-2">Tổng tiền</th>
                          <th className="p-2 pr-3">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {selectedUser.orders.map((ord) => (
                          <tr key={ord.id}>
                            <td className="p-2 pl-3 font-mono font-semibold text-zinc-900">{ord.order_code}</td>
                            <td className="p-2 text-zinc-500">
                              {new Date(ord.created_at).toLocaleDateString("vi-VN")}
                            </td>
                            <td className="p-2 font-mono font-semibold">{formatVND(ord.total_amount)}</td>
                            <td className="p-2 pr-3">
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-100 text-zinc-700 border border-zinc-200">
                                {ord.order_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">Khách hàng chưa phát sinh đơn hàng nào</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-3.5 border-t border-zinc-100 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
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
