import React from "react";
import { Navbar } from "@/components/sites/wwyn-vn/root/Navbar";
import { Hero } from "@/components/sites/wwyn-vn/root/Hero";
import { Footer } from "@/components/sites/wwyn-vn/root/Footer";
import "@/components/sites/wwyn-vn/root/wwyn.css";

export const metadata = {
  title: "WWYN – WEAR WHAT YOU NEED",
  description:
    "WWYN là local brand thời trang Việt Nam, mang phong cách streetwear trẻ trung, cá tính. Thiết kế hiện đại, chất lượng cao, dành cho giới trẻ yêu thời trang.",
  openGraph: {
    title: "WWYN – WEAR WHAT YOU NEED",
    description:
      "WWYN là local brand thời trang Việt Nam, mang phong cách streetwear trẻ trung, cá tính. Thiết kế hiện đại, chất lượng cao, dành cho giới trẻ yêu thời trang.",
    images: ["/sites/wwyn-vn/root/images/hero-banner.webp"],
  },
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Hidden SEO & h-card semantic data matching original site */}
      <div className="sr-only">
        <ul className="h-card">
          <li className="h-fn">WWYN</li>
          <li className="h-org">WWYN</li>
          <li className="h-tel">0378026461</li>
          <li>
            <a className="u-url" href="https://wwyn.vn/">
              https://wwyn.vn/
            </a>
          </li>
        </ul>
        <h1>WWYN – WEAR WHAT YOU NEED</h1>
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* Hero Banner Section */}
      <Hero />

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
