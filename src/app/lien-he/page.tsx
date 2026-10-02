import React from "react";
import { Navbar } from "@/components/sites/wwyn-vn/root/Navbar";
import { Footer } from "@/components/sites/wwyn-vn/root/Footer";
import { ShopBreadcrumbs } from "@/components/sites/wwyn-vn/shop/ShopBreadcrumbs";
import { ContactForm } from "@/components/sites/wwyn-vn/contact/ContactForm";

import "@/components/sites/wwyn-vn/root/wwyn.css";
import "./contact.css";

export const metadata = {
  title: "Liên hệ | Ninety Eight Studio",
  description:
    "Liên hệ Ninety Eight Studio để được tư vấn kích thước, sản phẩm và chính sách mua hàng nhanh chóng. Địa chỉ: 351/44 Lê Văn Sỹ, Quận 3, TP.HCM.",
  openGraph: {
    title: "Liên hệ | Ninety Eight Studio",
    description:
      "Liên hệ Ninety Eight Studio để được tư vấn kích thước, sản phẩm và chính sách mua hàng nhanh chóng. Hotline: 0378026461.",
    images: ["/sites/wwyn-vn/root/images/hero-banner.webp"],
  },
};

export default function ContactPage() {
  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Liên hệ", active: true },
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
            <a className="u-url" href="/lien-he">
              Liên hệ Ninety Eight Studio
            </a>
          </li>
        </ul>
        <h1>Liên hệ Ninety Eight Studio</h1>
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* Breadcrumbs Navigation */}
      <ShopBreadcrumbs items={breadcrumbs} />

      {/* Main Contact Section */}
      <section className="contact-container" aria-label="Thông tin liên hệ Ninety Eight Studio">
        {/* Title */}
        <div className="contact-title-main">
          <h1>Liên hệ</h1>
        </div>

        {/* Contact Form */}
        <ContactForm />

        {/* 3 Contact Info Cards */}
        <div className="address-contact-grid">
          {/* Address */}
          <div className="item-address-contact">
            <div className="img-address-contact">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div className="text-address-contact">
              <span>Địa chỉ</span>
              <p>WARDROBE ARC, 351/44 Lê Văn Sỹ, Phường Nhiêu Lộc, Quận 3, TP.HCM</p>
            </div>
          </div>

          {/* Phone */}
          <div className="item-address-contact">
            <div className="img-address-contact">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div className="text-address-contact">
              <span>Gọi chúng tôi</span>
              <p>
                <a href="tel:0378026461">0378026461</a>
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="item-address-contact">
            <div className="img-address-contact">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
            </div>
            <div className="text-address-contact">
              <span>Email</span>
              <p>
                <a href="mailto:ninetyeightstudio@gmail.com">ninetyeightstudio@gmail.com</a>
              </p>
            </div>
          </div>
        </div>

        {/* Embedded Google Map */}
        <div className="bottom-contact-map">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.324899138207!2d106.67655099999999!3d10.786408999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f0011444853%3A0x8a9ecb00bdefb1f!2sWARDROBE%20ARC!5e0!3m2!1svi!2s!4v1775289959203!5m2!1svi!2s"
            title="Bản đồ chỉ dẫn Ninety Eight Studio"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </section>

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
