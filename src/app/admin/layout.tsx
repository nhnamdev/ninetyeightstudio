"use client";

import React, { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  ExternalLink,
  LogOut,
  Menu,
  X,
  Database,
  UserCheck,
} from "lucide-react";
import { getAdminToken, getAdminUser, removeAdminToken } from "@/lib/api";

const subscribe = () => () => {};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const adminUser = useSyncExternalStore(subscribe, () => getAdminUser(), () => null);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    const token = getAdminToken();
    if (!token) {
      router.push("/admin/login");
    }
  }, [pathname, router]);

  // If on login page, render without admin chrome
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  // Prevent flash of unauthenticated content
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0d0e12] flex items-center justify-center text-zinc-400">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Đang tải trung tâm quản trị...</span>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    removeAdminToken();
    router.push("/admin/login");
  };

  const navItems = [
    {
      label: "Bảng điều khiển",
      href: "/admin",
      icon: LayoutDashboard,
      active: pathname === "/admin",
    },
    {
      label: "Quản lý Sản phẩm",
      href: "/admin/products",
      icon: Package,
      active: pathname.startsWith("/admin/products"),
    },
    {
      label: "Quản lý Đơn hàng",
      href: "/admin/orders",
      icon: ShoppingCart,
      active: pathname.startsWith("/admin/orders"),
    },
    {
      label: "Quản lý Khách hàng",
      href: "/admin/users",
      icon: Users,
      active: pathname.startsWith("/admin/users"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d0e12] text-zinc-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-72 bg-[#12141a] border-r border-zinc-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="p-6 border-b border-zinc-800/80 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="text-2xl font-black tracking-widest text-white uppercase font-mono">
                98STUDIO
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-600/20 text-red-400 border border-red-500/30">
                CMS
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="px-3 py-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Danh mục quản lý
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    item.active
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/20"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-4 px-3 py-2 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Liên kết nhanh
            </div>
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 transition-all"
            >
              <span className="flex items-center gap-3">
                <ExternalLink className="w-4 h-4" />
                <span>Xem Website</span>
              </span>
              <span className="text-[10px] text-zinc-400 bg-zinc-800 px-1.5 py-0.5 rounded">Mở tab</span>
            </Link>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-zinc-800/80 space-y-3">
          {/* Database status */}
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900/80 border border-zinc-800 text-xs text-zinc-400">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>VPS: 36.50.27.243</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          {/* Admin User Card */}
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4 text-zinc-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                  {adminUser?.full_name || "Administrator"}
                </p>
                <p className="text-[11px] text-zinc-400 truncate">
                  {adminUser?.email || "admin@ninetyeight.vn"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-1.5 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-[#12141a]/80 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-zinc-400 hover:text-white md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400">
              <span>Ninety Eight Studio</span>
              <span>/</span>
              <span className="text-white font-medium">
                {pathname === "/admin"
                  ? "Bảng điều khiển"
                  : pathname.startsWith("/admin/products")
                  ? "Quản lý Sản phẩm"
                  : pathname.startsWith("/admin/orders")
                  ? "Quản lý Đơn hàng"
                  : pathname.startsWith("/admin/users")
                  ? "Quản lý Khách hàng"
                  : "Quản trị"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              API Online (Port 5000)
            </div>
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-xs font-medium text-zinc-200 transition-colors flex items-center gap-1.5"
            >
              <span>Trang chủ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
