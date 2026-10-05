import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/sites/wwyn-vn/root/Navbar";
import { Hero } from "@/components/sites/wwyn-vn/root/Hero";
import { ProductSlider, ProductSliderItem } from "@/components/sites/wwyn-vn/root/ProductSlider";
import { Footer } from "@/components/sites/wwyn-vn/root/Footer";
import "@/components/sites/wwyn-vn/root/wwyn.css";

export const metadata = {
  title: "Ninety Eight Studio",
  description:
    "Ninety Eight Studio là local brand thời trang Việt Nam, mang phong cách streetwear trẻ trung, cá tính. Thiết kế hiện đại, chất lượng cao, dành cho giới trẻ yêu thời trang.",
  openGraph: {
    title: "Ninety Eight Studio",
    description:
      "Ninety Eight Studio là local brand thời trang Việt Nam, mang phong cách streetwear trẻ trung, cá tính. Thiết kế hiện đại, chất lượng cao, dành cho giới trẻ yêu thời trang.",
    images: ["https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/banners/hero-banner-27b25b23.webp"],
  },
};

function getServerApiUrl(): string {
  if (process.env.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL.endsWith("/api")
      ? process.env.INTERNAL_API_URL
      : `${process.env.INTERNAL_API_URL}/api`;
  }
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith("http")) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "http://127.0.0.1:5000/api";
}

async function getLiveHomeProducts(): Promise<ProductSliderItem[]> {
  try {
    const apiUrl = getServerApiUrl();
    const res = await fetch(`${apiUrl}/products?limit=12`, {
      next: { revalidate: 10 },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return [];
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      interface LiveProductApi {
        id: number;
        name: string;
        slug: string;
        min_price?: number | string;
        base_price?: number | string;
        cover_image: string;
        total_stock?: number;
      }
      return (json.data as LiveProductApi[]).map((p) => ({
        id: p.id,
        name: p.name.toUpperCase(),
        price: new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(Number(p.min_price || p.base_price || 0)),
        image: p.cover_image,
        href: `/san-pham/${p.slug}`,
        outOfStock: Number(p.total_stock) <= 0,
      }));
    }
  } catch (err) {
    console.warn("Server failed to pre-fetch home products:", err);
  }
  return [];
}

export default async function Home() {
  const initialProducts = await getLiveHomeProducts();

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* Hidden SEO & h-card semantic data matching original site */}
      <div className="sr-only">
        <ul className="h-card">
          <li className="h-fn">Ninety Eight Studio</li>
          <li className="h-org">Ninety Eight Studio</li>
          <li className="h-tel">0378026461</li>
          <li>
            <Link className="u-url" href="/">
              Ninety Eight Studio
            </Link>
          </li>
        </ul>
        <h1>Ninety Eight Studio</h1>
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* Hero Banner Section */}
      <Hero />

      {/* All Products Slider Section */}
      <ProductSlider initialProducts={initialProducts} />

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
