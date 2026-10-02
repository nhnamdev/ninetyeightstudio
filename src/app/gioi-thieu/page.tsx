import React from "react";
import { Navbar } from "@/components/sites/wwyn-vn/root/Navbar";
import { Footer } from "@/components/sites/wwyn-vn/root/Footer";
import { ShopBreadcrumbs } from "@/components/sites/wwyn-vn/shop/ShopBreadcrumbs";

import "@/components/sites/wwyn-vn/root/wwyn.css";
import "./about.css";

export const metadata = {
  title: "Giới thiệu | Ninety Eight Studio",
  description:
    "Với 98 STUDIO phong cách không phải là nỗ lực để nổi bật mà là sự tự tin khi biết rõ đâu là bản sắc của chính mình. Thiết kế tối giản, thanh lịch và cá tính.",
  openGraph: {
    title: "Giới thiệu | Ninety Eight Studio",
    description:
      "Với 98 STUDIO phong cách không phải là nỗ lực để nổi bật mà là sự tự tin khi biết rõ đâu là bản sắc của chính mình. Thiết kế tối giản, thanh lịch và cá tính.",
    images: ["/images/about-us.jpg"],
  },
};

export default function AboutPage() {
  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Giới thiệu", active: true },
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
            <a className="u-url" href="/gioi-thieu">
              Giới thiệu Ninety Eight Studio
            </a>
          </li>
        </ul>
        <h1>Giới thiệu Ninety Eight Studio</h1>
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* Breadcrumbs Navigation */}
      <ShopBreadcrumbs items={breadcrumbs} />

      {/* Main About Us Content */}
      <section className="about-container" aria-label="Giới thiệu thương hiệu Ninety Eight Studio">
        <div className="about-center900">
          {/* Page Title */}
          <div className="about-title-main">
            <h1>ABOUT US</h1>
          </div>

          {/* Editorial Content */}
          <div className="about-content">
            {/* Vietnamese Section */}
            <span className="about-lang-tag">/ VIET /</span>
            <p className="about-text-vi">
              Với <strong>98 STUDIO</strong> phong cách không phải là nỗ lực để nổi bật mà là sự tự tin khi biết rõ đâu là bản sắc của chính mình. Bằng việc chú trọng vào chất liệu cao cấp và cấu trúc thiết kế tối ưu trong từng sản phẩm, 98 STUDIO có thể là một phần trong mảnh ghép hoàn hảo để bạn định hình vẻ ngoài đơn giản, thanh lịch nhưng đầy sức hút.
            </p>

            {/* English Section */}
            <span className="about-lang-tag">/ ENG /</span>
            <p className="about-text-en">
              At <strong>98 STUDIO</strong>, style is not about trying to stand out — it’s about the confidence that comes from knowing your true identity. Through a commitment to premium fabrics and structured silhouettes, each 98 STUDIO piece becomes part of a refined wardrobe that shapes a look that is minimal, elevated, and effortlessly compelling.
            </p>

            {/* Lookbook Editorial Poster Image */}
            <div className="about-poster-wrapper">
              <img
                src="/images/about-us.jpg"
                alt="Ninety Eight Studio Editorial Lookbook"
                className="about-poster-img"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
