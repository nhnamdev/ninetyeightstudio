import React, { Suspense } from "react";
import { Navbar } from "@/components/sites/wwyn-vn/root/Navbar";
import { Footer } from "@/components/sites/wwyn-vn/root/Footer";
import { ShopBreadcrumbs } from "@/components/sites/wwyn-vn/shop/ShopBreadcrumbs";
import { ShopProductGrid } from "@/components/sites/wwyn-vn/shop/ShopProductGrid";
import "@/components/sites/wwyn-vn/root/wwyn.css";
import "./shop.css";

export const metadata = {
  title: "Cửa hàng | Ninety Eight Studio",
  description:
    "Khám phá các sản phẩm túi xách, tote bag, shoulder bag, travel bag cá tính tại Ninety Eight Studio.",
  openGraph: {
    title: "Cửa hàng | Ninety Eight Studio",
    description:
      "Khám phá các sản phẩm túi xách, tote bag, shoulder bag, travel bag cá tính tại Ninety Eight Studio.",
    images: ["/sites/wwyn-vn/root/images/hero-banner.webp"],
  },
};

export default function ShopPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Hidden SEO & h-card semantic data matching site standard */}
      <div className="sr-only">
        <ul className="h-card">
          <li className="h-fn">Ninety Eight Studio</li>
          <li className="h-org">Ninety Eight Studio</li>
          <li className="h-tel">0378026461</li>
          <li>
            <a className="u-url" href="/cua-hang">
              Cửa hàng Ninety Eight Studio
            </a>
          </li>
        </ul>
        <h1>Cửa hàng Ninety Eight Studio</h1>
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* Breadcrumb Bar */}
      <ShopBreadcrumbs />

      {/* Main Catalog Content */}
      <section className="shop-container" aria-label="Danh sách sản phẩm cửa hàng">
        <div className="shop-title-main">
          <h1>Cửa hàng</h1>
        </div>

        {/* Product Grid with Pagination */}
        <Suspense
          fallback={
            <div className="py-20 text-center text-xs text-neutral-400">
              Đang tải danh sách sản phẩm...
            </div>
          }
        >
          <ShopProductGrid initialPage={1} />
        </Suspense>
      </section>

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
