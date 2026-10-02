"use client";

import React, { useState, useEffect } from "react";
import { X, Eye, EyeOff } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register";
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = "login",
}) => {
  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Login form state
  const [loginData, setLoginData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });


  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Đăng nhập thành công! Đang chuyển hướng...");
      setTimeout(() => {
        onClose();
        setSuccessMsg("");
      }, 1200);
    }, 800);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (registerData.password !== registerData.confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không trùng khớp!");
      return;
    }

    if (registerData.password.length < 6) {
      setErrorMsg("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg("Đăng ký thành viên thành công! Chào mừng bạn đến với Ninety Eight Studio.");
      setTimeout(() => {
        setMode("login");
        setSuccessMsg("");
      }, 1500);
    }, 800);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Box */}
      <div
        className="relative w-full max-w-[460px] bg-white rounded-none shadow-2xl overflow-hidden border border-black/10 transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-black/60 hover:text-black hover:bg-black/5 transition-colors cursor-pointer border-none bg-transparent"
          aria-label="Đóng hộp thoại"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab Headers */}
        <div className="flex border-b border-black/10 pt-4 px-6">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`pb-3 text-sm font-bold tracking-wider uppercase transition-colors relative cursor-pointer mr-8 border-none bg-transparent ${
              mode === "login"
                ? "text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black"
                : "text-black/40 hover:text-black/70"
            }`}
          >
            Đăng nhập
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg("");
              setSuccessMsg("");
            }}
            className={`pb-3 text-sm font-bold tracking-wider uppercase transition-colors relative cursor-pointer border-none bg-transparent ${
              mode === "register"
                ? "text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black"
                : "text-black/40 hover:text-black/70"
            }`}
          >
            Đăng ký
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 max-h-[85vh] overflow-y-auto">
          {/* Notification Messages */}
          {successMsg && (
            <div className="mb-5 p-3.5 bg-green-50 border border-green-200 text-green-800 text-xs font-medium leading-relaxed">
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed">
              {errorMsg}
            </div>
          )}

          {/* ================= LOGIN FORM ================= */}
          {mode === "login" ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  Email hoặc Số điện thoại *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nhập email hoặc số điện thoại"
                  value={loginData.identifier}
                  onChange={(e) =>
                    setLoginData({ ...loginData, identifier: e.target.value })
                  }
                  className="w-full h-11 px-3.5 text-sm bg-white border border-black/20 focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  Mật khẩu *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Nhập mật khẩu"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                    className="w-full h-11 px-3.5 pr-11 text-sm bg-white border border-black/20 focus:border-black focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 bottom-0 px-3 flex items-center text-black/40 hover:text-black transition-colors cursor-pointer border-none bg-transparent"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-black/70 hover:text-black">
                  <input
                    type="checkbox"
                    checked={loginData.rememberMe}
                    onChange={(e) =>
                      setLoginData({ ...loginData, rememberMe: e.target.checked })
                    }
                    className="rounded-none border-black/20 text-black focus:ring-0 cursor-pointer"
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>

                <button
                  type="button"
                  onClick={() => alert("Vui lòng liên hệ hotline 0378026461 để được hỗ trợ cấp lại mật khẩu.")}
                  className="text-xs text-black/60 hover:text-black underline cursor-pointer border-none bg-transparent p-0"
                >
                  Quên mật khẩu?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-50 border-none"
              >
                {loading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
              </button>

              {/* Switch to Register */}
              <div className="pt-3 text-center text-xs text-black/60">
                Chưa có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="font-bold text-black underline hover:text-black/80 cursor-pointer border-none bg-transparent p-0"
                >
                  Đăng ký ngay
                </button>
              </div>
            </form>
          ) : (
            /* ================= REGISTER FORM ================= */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Promotion Notice */}
              <div className="p-3 bg-neutral-100 border-l-2 border-black text-[12px] text-neutral-800 leading-snug">
                Đăng ký thành viên <strong>Ninety Eight Studio</strong> để nhận ưu đãi và <strong>Letter Charm</strong> cho đơn hàng đầu tiên.
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nguyễn Văn A"
                  value={registerData.fullName}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, fullName: e.target.value })
                  }
                  className="w-full h-11 px-3.5 text-sm bg-white border border-black/20 focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="0912 345 678"
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, phone: e.target.value })
                    }
                    className="w-full h-11 px-3.5 text-sm bg-white border border-black/20 focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                    className="w-full h-11 px-3.5 text-sm bg-white border border-black/20 focus:border-black focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  Mật khẩu *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Tối thiểu 6 ký tự"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, password: e.target.value })
                    }
                    className="w-full h-11 px-3.5 pr-11 text-sm bg-white border border-black/20 focus:border-black focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-0 bottom-0 px-3 flex items-center text-black/40 hover:text-black transition-colors cursor-pointer border-none bg-transparent"
                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1.5">
                  Xác nhận mật khẩu *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="Nhập lại mật khẩu"
                    value={registerData.confirmPassword}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full h-11 px-3.5 pr-11 text-sm bg-white border border-black/20 focus:border-black focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-0 top-0 bottom-0 px-3 flex items-center text-black/40 hover:text-black transition-colors cursor-pointer border-none bg-transparent"
                    aria-label={
                      showConfirmPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer disabled:opacity-50 border-none"
              >
                {loading ? "Đang xử lý..." : "ĐĂNG KÝ TÀI KHOẢN"}
              </button>

              {/* Switch to Login */}
              <div className="pt-3 text-center text-xs text-black/60">
                Đã có tài khoản?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMsg("");
                    setSuccessMsg("");
                  }}
                  className="font-bold text-black underline hover:text-black/80 cursor-pointer border-none bg-transparent p-0"
                >
                  Đăng nhập
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
