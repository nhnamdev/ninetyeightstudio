"use client";

import React, { useEffect, useState, useSyncExternalStore, useMemo } from "react";
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
import { getAdminToken, removeAdminToken } from "@/lib/api";

const subscribe = () => () => {};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const rawUser = useSyncExternalStore(
    subscribe,
    () => (typeof window !== "undefined" ? localStorage.getItem("nes_admin_user") : null),
    () => null
  );

  const adminUser = useMemo<{ full_name: string; email: string; role: string } | null>(() => {
    if (!rawUser) return null;
    try {
      return JSON.parse(rawUser);
    } catch {
      return null;
    }
  }, [rawUser]);

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
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center text-zinc-500">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-zinc-900 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Đang tải trung tâm quản trị...</span>
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
    <div className="min-h-screen bg-zinc-50/70 text-zinc-900 flex flex-col md:flex-row antialiased font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar (Clean White shadcn/ui style) */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-zinc-200/80 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          {/* Logo & Brand */}
          <div className="h-16 px-6 border-b border-zinc-100 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-wider text-zinc-950 uppercase font-mono">
                98STUDIO
              </span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-700 border border-zinc-200">
                CMS
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 text-zinc-400 hover:text-zinc-900 md:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <div className="px-3 pt-3 pb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Quản trị hệ thống
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    item.active
                      ? "bg-zinc-900 text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="px-3 pt-5 pb-1 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
              Khác
            </div>
            <Link
              href="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4" />
                <span>Xem Website</span>
              </span>
              <span className="text-[10px] text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">
                Tab mới
              </span>
            </Link>
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-3 border-t border-zinc-100 space-y-2">
          {/* Database status */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-zinc-50 border border-zinc-200/80 text-[11px] text-zinc-600">
            <div className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-zinc-500" />
              <span>VPS: 36.50.27.243</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>

          {/* Admin User Card */}
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 transition-colors">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center shrink-0 text-zinc-700">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-zinc-900 truncate">
                  {adminUser?.full_name || "Administrator"}
                </p>
                <p className="text-[10px] text-zinc-500 truncate">
                  {adminUser?.email || "admin@ninetyeight.vn"}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Đăng xuất"
              className="p-1.5 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/90 backdrop-blur-md border-b border-zinc-200/80 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1.5 -ml-1.5 text-zinc-600 hover:text-zinc-950 md:hidden cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500">
              <span>98STUDIO</span>
              <span>/</span>
              <span className="text-zinc-900 font-semibold">
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

          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs text-zinc-700 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              API: 5000 Online
            </div>
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-xs font-medium text-zinc-800 transition-colors flex items-center gap-1.5 border border-zinc-200"
            >
              <span>Xem Web</span>
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
