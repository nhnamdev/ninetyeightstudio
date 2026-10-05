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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Users className="w-7 h-7 text-red-500" />
            Quản lý Khách hàng & Thành viên
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Danh sách thành viên Ninety Eight Club, lịch sử mua sắm và trạng thái tài khoản
          </p>
        </div>
        <button
          onClick={fetchUsers}
          disabled={loading}
          className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Làm mới danh sách</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#141720] border border-zinc-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchUsers()}
              placeholder="Tìm theo họ tên, email hoặc số điện thoại..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="py-2 px-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-red-500"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="customer">Khách hàng</option>
            <option value="staff">Nhân viên (Staff)</option>
            <option value="admin">Quản trị viên (Admin)</option>
          </select>
        </div>

        <button
          onClick={fetchUsers}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-white rounded-xl cursor-pointer"
        >
          Tìm kiếm
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-[#141720] border border-zinc-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-800/80 text-zinc-400 bg-zinc-900/40 text-[11px] uppercase tracking-wider">
                <th className="p-4 pl-6">Khách hàng</th>
                <th className="p-4">Liên hệ</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Tổng đơn</th>
                <th className="p-4">Chi tiêu</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 pr-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-red-500" />
                    <span>Đang tải danh sách người dùng...</span>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-400">
                    Không tìm thấy người dùng nào
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-white uppercase text-xs">
                          {user.full_name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{user.full_name}</div>
                          <div className="text-[11px] text-zinc-400">ID: #{user.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="text-zinc-200 text-xs flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="text-zinc-400 text-[11px] font-mono flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3.5 h-3.5 text-zinc-500" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      {user.role === "admin" ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-600/20 text-red-400 border border-red-500/30">
                          Quản trị
                        </span>
                      ) : user.role === "staff" ? (
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30">
                          Nhân viên
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-zinc-800 text-zinc-300">
                          Khách hàng
                        </span>
                      )}
                    </td>

                    <td className="p-4 font-mono font-bold text-white text-xs">
                      {user.total_orders || 0} đơn
                    </td>

                    <td className="p-4 font-mono font-bold text-emerald-400 text-xs">
                      {formatVND(user.total_spent || 0)}
                    </td>

                    <td className="p-4">
                      {user.is_active ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400">
                          <UserCheck className="w-3.5 h-3.5" />
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-red-400">
                          <UserX className="w-3.5 h-3.5" />
                          Tạm khóa
                        </span>
                      )}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => openUserDetail(user)}
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                          title="Xem lịch sử mua hàng & địa chỉ"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {user.role !== "admin" && (
                          <button
                            onClick={() => handleToggleUserStatus(user)}
                            className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                              user.is_active
                                ? "bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400"
                                : "bg-zinc-800 hover:bg-emerald-500/20 text-zinc-400 hover:text-emerald-400"
                            }`}
                            title={user.is_active ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                          >
                            {user.is_active ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#141720] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">
                    Thông tin khách hàng: {selectedUser.full_name}
                  </h2>
                  {detailLoading && <Loader2 className="w-3.5 h-3.5 animate-spin text-red-500" />}
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Ngày tham gia: {new Date(selectedUser.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {/* User Overview Stats */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-400">Tổng số đơn hàng:</span>
                  <div className="text-lg font-bold text-white mt-1 font-mono">
                    {selectedUser.orders?.length || 0} đơn
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                  <span className="text-zinc-400">Tổng chi tiêu:</span>
                  <div className="text-lg font-bold text-emerald-400 mt-1 font-mono">
                    {formatVND(selectedUser.total_spent || 0)}
                  </div>
                </div>
              </div>

              {/* Saved Addresses */}
              <div>
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  Sổ địa chỉ nhận hàng ({selectedUser.addresses?.length || 0})
                </h3>
                {selectedUser.addresses && selectedUser.addresses.length > 0 ? (
                  <div className="space-y-2">
                    {selectedUser.addresses.map((addr) => (
                      <div
                        key={addr.id}
                        className="p-3 rounded-xl bg-zinc-900/60 border border-zinc-800 text-xs flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-white">
                            {addr.recipient_name} - <span className="font-mono text-zinc-400">{addr.phone}</span>
                          </div>
                          <div className="text-zinc-400 mt-0.5">
                            {addr.street_address}, {addr.district}, {addr.province}
                          </div>
                        </div>
                        {addr.is_default ? (
                          <span className="text-[10px] font-bold text-red-400 px-2 py-0.5 rounded bg-red-600/10 border border-red-500/20">
                            Mặc định
                          </span>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">Khách chưa lưu địa chỉ</p>
                )}
              </div>

              {/* Order History */}
              <div>
                <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-blue-500" />
                  Lịch sử đặt hàng gần đây
                </h3>
                {selectedUser.orders && selectedUser.orders.length > 0 ? (
                  <div className="border border-zinc-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-zinc-900 text-zinc-400 border-b border-zinc-800 text-[11px]">
                          <th className="p-2.5">Mã đơn</th>
                          <th className="p-2.5">Ngày mua</th>
                          <th className="p-2.5">Tổng tiền</th>
                          <th className="p-2.5">Trạng thái</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {selectedUser.orders.map((ord) => (
                          <tr key={ord.id}>
                            <td className="p-2.5 font-mono font-bold text-white">{ord.order_code}</td>
                            <td className="p-2.5 text-zinc-400">
                              {new Date(ord.created_at).toLocaleDateString("vi-VN")}
                            </td>
                            <td className="p-2.5 font-mono font-bold">{formatVND(ord.total_amount)}</td>
                            <td className="p-2.5">
                              <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300">
                                {ord.order_status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-zinc-500 italic">Khách hàng chưa phát sinh đơn hàng nào</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800 flex justify-end">
              <button
                onClick={() => setSelectedUser(null)}
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
