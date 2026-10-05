"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Loader2 } from "lucide-react";
import { api, setAdminToken, setAdminUser } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@ninetyeight.vn");
  const [password, setPassword] = useState("Admin123@");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      if (res.token && res.user) {
        setAdminToken(res.token);
        setAdminUser(res.user);
        router.push("/admin");
      } else {
        setError("Đăng nhập không thành công, vui lòng thử lại");
      }
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Email hoặc mật khẩu không chính xác");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 flex flex-col justify-center items-center px-4 font-sans antialiased">
      {/* Main card */}
      <div className="w-full max-w-sm">
        {/* Brand header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <span className="text-3xl font-black tracking-widest text-zinc-950 uppercase font-mono">
              98STUDIO
            </span>
          </Link>
          <div className="flex items-center justify-center gap-1.5 text-xs text-zinc-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-zinc-700" />
            <span>Cổng Quản Trị Hệ Thống (CMS)</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-xs">
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-1.5">
                Tài khoản / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ninetyeight.vn hoặc admin"
                  className="w-full pl-9 pr-3.5 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider">
                  Mật khẩu
                </label>
                <span className="text-[11px] text-zinc-400 font-mono">Mặc định: Admin123@</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu"
                  className="w-full pl-9 pr-9 py-2 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-colors font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-white font-medium rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                <>
                  Đăng nhập
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick preset filler */}
          <div className="mt-6 pt-5 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <button
              type="button"
              onClick={() => {
                setEmail("admin@ninetyeight.vn");
                setPassword("Admin123@");
              }}
              className="text-zinc-600 hover:text-zinc-900 underline underline-offset-4 cursor-pointer"
            >
              Điền tài khoản mẫu
            </button>
            <Link href="/" className="hover:text-zinc-900 transition-colors">
              ← Về trang chủ
            </Link>
          </div>
        </div>

        {/* Server & DB connectivity badge */}
        <div className="mt-6 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Kết nối MySQL VPS: 36.50.27.243 (Port 5000)</span>
        </div>
      </div>
    </div>
  );
}
