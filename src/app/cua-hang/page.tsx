import React, { Suspense } from "react";
import { Navbar } from "@/components/sites/wwyn-vn/root/Navbar";
import { Footer } from "@/components/sites/wwyn-vn/root/Footer";
import { ShopBreadcrumbs } from "@/components/sites/wwyn-vn/shop/ShopBreadcrumbs";
import { ShopProductGrid } from "@/components/sites/wwyn-vn/shop/ShopProductGrid";
import { ShopProduct } from "@/data/shopProducts";
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
    images: ["https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/banners/hero-banner-27b25b23.webp"],
  },
};

async function getLiveShopProducts(): Promise<ShopProduct[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
    const res = await fetch(`${apiUrl}/products?limit=100`, { next: { revalidate: 10 } });
    if (!res.ok) return [];
    const json = await res.json();
    if (json.success && Array.isArray(json.data)) {
      interface ProductVariantApi {
        id: number;
        color_name: string;
        image?: string;
      }
      interface ProductApiRow {
        id: number;
        name: string;
        slug: string;
        min_price?: number | string;
        base_price?: number | string;
        category_name?: "TOTE BAG" | "SHOULDER BAG" | "TRAVEL BAG" | "ACCESSORIES";
        cover_image: string;
        hover_image?: string;
        gallery_images?: string[];
        variants?: ProductVariantApi[];
        description?: string;
        highlights?: string[];
        dimensions?: string;
        material?: string;
        total_stock?: number;
      }
      return (json.data as ProductApiRow[]).map((p) => {
        const priceNum = Number(p.min_price || p.base_price || 0);
        const formattedPrice = new Intl.NumberFormat("vi-VN", {
          style: "currency",
          currency: "VND",
        }).format(priceNum);

        return {
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: formattedPrice,
          category: p.category_name || "TOTE BAG",
          image: p.cover_image,
          hoverImage: p.hover_image || p.cover_image,
          gallery: Array.isArray(p.gallery_images) && p.gallery_images.length > 0 ? p.gallery_images : [p.cover_image],
          colors: (p.variants || []).map((v) => ({
            name: v.color_name,
            thumbnail: v.image || p.cover_image,
            slug: p.slug,
          })),
          description: p.description || "",
          highlights: p.highlights || [],
          dimensions: p.dimensions ? { size: p.dimensions, strapDrop: "", weight: "" } : undefined,
          material: p.material || "",
          outOfStock: Number(p.total_stock) <= 0,
          page: 1,
        };
      });
    }
  } catch (err) {
    console.warn("Failed to fetch live shop products on server:", err);
  }
  return [];
}

export default async function ShopPage() {
  const initialProducts = await getLiveShopProducts();

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
          <ShopProductGrid initialPage={1} initialProducts={initialProducts} />
        </Suspense>
      </section>

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
