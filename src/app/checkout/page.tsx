import React from "react";
import { Metadata } from "next";
import { Navbar } from "@/components/sites/wwyn-vn/root/Navbar";
import { Footer } from "@/components/sites/wwyn-vn/root/Footer";
import { CheckoutPageContent } from "@/components/sites/wwyn-vn/checkout/CheckoutPageContent";

import "@/components/sites/wwyn-vn/root/wwyn.css";

export const metadata: Metadata = {
  title: "Thanh toán đơn hàng | Ninety Eight Studio",
  description:
    "Tiến hành đặt hàng và thanh toán nhanh chóng, an toàn tại Ninety Eight Studio.",
  openGraph: {
    title: "Thanh toán đơn hàng | Ninety Eight Studio",
    description:
      "Tiến hành đặt hàng và thanh toán nhanh chóng, an toàn tại Ninety Eight Studio.",
  },
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Navbar />

      {/* Main Content Area */}
      <div className="flex-1">
        <CheckoutPageContent />
      </div>

      {/* Footer */}
      <Footer />
    </main>
  );
}
