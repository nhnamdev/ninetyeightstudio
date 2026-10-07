import React from "react";
import { notFound } from "next/navigation";
import {
  SHOP_PRODUCTS,
  ShopProduct,
  getProductBySlug,
  getRelatedProducts,
} from "@/data/shopProducts";
import { Navbar } from "@/components/sites/wwyn-vn/root/Navbar";
import { Footer } from "@/components/sites/wwyn-vn/root/Footer";
import { ShopBreadcrumbs } from "@/components/sites/wwyn-vn/shop/ShopBreadcrumbs";
import { ProductDetailView } from "@/components/sites/wwyn-vn/detail/ProductDetailView";
import { RelatedProducts } from "@/components/sites/wwyn-vn/detail/RelatedProducts";
import { MobileBottomBar } from "@/components/sites/wwyn-vn/detail/MobileBottomBar";
import { getCleanExcerpt } from "@/lib/utils";

import "@/components/sites/wwyn-vn/root/wwyn.css";
import "@/app/cua-hang/shop.css";
import "./detail.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

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

export async function generateStaticParams() {
  try {
    const apiUrl = getServerApiUrl();
    const res = await fetch(`${apiUrl}/products?limit=100`, {
      next: { revalidate: 10 },
      signal: AbortSignal.timeout(1500),
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        return json.data.map((p: { slug: string }) => ({ slug: p.slug }));
      }
    }
  } catch {
    // fallback
  }
  return SHOP_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

async function fetchLiveRelatedProducts(currentId: number): Promise<ShopProduct[]> {
  try {
    const apiUrl = getServerApiUrl();
    const res = await fetch(`${apiUrl}/products?limit=10`, {
      next: { revalidate: 10 },
      signal: AbortSignal.timeout(1500),
    });
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
      return (json.data as ProductApiRow[])
        .filter((p) => p.id !== currentId)
        .slice(0, 4)
        .map((p) => {
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
    console.warn("Error fetching live related products:", err);
  }
  return [];
}

async function fetchLiveProduct(slug: string): Promise<ShopProduct | undefined> {
  try {
    const apiUrl = getServerApiUrl();
    const res = await fetch(`${apiUrl}/products/${slug}`, {
      next: { revalidate: 10 },
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return undefined;
    const json = await res.json();
    if (json.success && json.data) {
      interface ProductVariantApiRow {
        id: number;
        color_name: string;
        color_code?: string;
        sku?: string;
        price?: number;
        original_price?: number | null;
        stock?: number;
        image?: string;
      }
      interface ProductDetailApiRow {
        id: number;
        name: string;
        slug: string;
        min_price?: number | string;
        base_price?: number | string;
        category_name?: "TOTE BAG" | "SHOULDER BAG" | "TRAVEL BAG" | "ACCESSORIES";
        cover_image: string;
        hover_image?: string;
        gallery_images?: string[];
        variants?: ProductVariantApiRow[];
        description?: string;
        highlights?: string[];
        dimensions?: string;
        material?: string;
        care_instructions?: string;
        shipping_policy?: string;
        total_stock?: number;
      }
      const p = json.data as ProductDetailApiRow;
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
        variants: (p.variants || []).map((v) => ({
          id: v.id,
          color_name: v.color_name,
          color_code: v.color_code || "#000000",
          sku: v.sku || "",
          price: Number(v.price || priceNum),
          original_price: v.original_price ? Number(v.original_price) : null,
          stock: Number(v.stock || 0),
          image: v.image || p.cover_image,
        })),
        description: p.description || "",
        highlights: p.highlights || [],
        dimensions: p.dimensions ? { size: p.dimensions, strapDrop: "", weight: "" } : undefined,
        material: p.material || "",
        careInstructions: p.care_instructions || "",
        shippingPolicy: p.shipping_policy || "",
        outOfStock: Number(p.total_stock) <= 0,
        page: 1,
      };
    }
  } catch {
    // fallback
  }
  return undefined;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const liveProduct = await fetchLiveProduct(slug);
  const product = liveProduct || getProductBySlug(slug);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại | Ninety Eight Studio",
    };
  }

  const excerpt =
    getCleanExcerpt(product.description, 160) ||
    `${product.name} chính hãng từ Ninety Eight Studio`;

  return {
    title: `${product.name} | Ninety Eight Studio`,
    description: excerpt,
    openGraph: {
      title: `${product.name} | Ninety Eight Studio`,
      description: excerpt,
      images: product.gallery && product.gallery.length > 0 ? [product.gallery[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const liveProduct = await fetchLiveProduct(slug);
  const product = liveProduct || getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const liveRelated = await fetchLiveRelatedProducts(product.id);
  const relatedProducts = liveRelated.length > 0 ? liveRelated : getRelatedProducts(product.id, 4);

  const breadcrumbs = [
    { label: "Trang chủ", href: "/" },
    { label: "Cửa hàng", href: "/cua-hang" },
    { label: product.category, href: "/cua-hang" },
    { label: product.name, active: true },
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
            <a className="u-url" href={`/san-pham/${product.slug}`}>
              {product.name}
            </a>
          </li>
        </ul>
        <h1>{product.name}</h1>
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* Breadcrumbs Navigation */}
      <ShopBreadcrumbs items={breadcrumbs} />

      {/* Product Detail Main Section (Stand Oil 2-Column Minimalist Layout) */}
      <section className="standoil-detail-container" aria-label="Chi tiết sản phẩm">
        <ProductDetailView product={product} />

        {/* Related Products Section */}
        <RelatedProducts products={relatedProducts} />
      </section>

      {/* Sticky Mobile Purchase Bar */}
      <MobileBottomBar product={product} />

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
