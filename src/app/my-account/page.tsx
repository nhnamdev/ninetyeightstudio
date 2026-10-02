import React from "react";
import { Navbar } from "@/components/sites/wwyn-vn/root/Navbar";
import { Footer } from "@/components/sites/wwyn-vn/root/Footer";
import { ShopBreadcrumbs } from "@/components/sites/wwyn-vn/shop/ShopBreadcrumbs";
import { AccountDashboard } from "@/components/sites/wwyn-vn/account/AccountDashboard";

import "@/components/sites/wwyn-vn/root/wwyn.css";
import "./account.css";

export const metadata = {
  title: "Tài khoản của tôi | Ninety Eight Studio",
  description:
    "Quản lý thông tin tài khoản, lịch sử mua hàng và địa chỉ giao hàng tại Ninety Eight Studio.",
  openGraph: {
    title: "Tài khoản của tôi | Ninety Eight Studio",
    description:
      "Quản lý thông tin tài khoản, lịch sử mua hàng và địa chỉ giao hàng tại Ninety Eight Studio.",
    images: ["/sites/wwyn-vn/root/images/hero-banner.webp"],
  },
};

export default function MyAccountPage() {
  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Tài khoản của tôi", active: true },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Hidden SEO Schema */}
      <div className="sr-only">
        <ul className="h-card">
          <li className="h-fn">Ninety Eight Studio</li>
          <li className="h-org">Ninety Eight Studio</li>
          <li className="h-tel">0378026461</li>
          <li>
            <a className="u-url" href="/my-account">
              Tài khoản Ninety Eight Studio
            </a>
          </li>
        </ul>
        <h1>Tài khoản Ninety Eight Studio</h1>
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* Breadcrumbs Navigation */}
      <ShopBreadcrumbs items={breadcrumbs} />

      {/* Main Account Dashboard Section */}
      <section
        className="account-page-container"
        aria-label="Quản lý tài khoản cá nhân"
      >
        <AccountDashboard />
      </section>

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
