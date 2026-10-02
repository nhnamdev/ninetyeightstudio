import React from "react";
import { notFound } from "next/navigation";
import {
  SHOP_PRODUCTS,
  getProductBySlug,
  getRelatedProducts,
} from "@/data/shopProducts";
import { Navbar } from "@/components/sites/wwyn-vn/root/Navbar";
import { Footer } from "@/components/sites/wwyn-vn/root/Footer";
import { ShopBreadcrumbs } from "@/components/sites/wwyn-vn/shop/ShopBreadcrumbs";
import { ProductGallery } from "@/components/sites/wwyn-vn/detail/ProductGallery";
import { ProductInfo } from "@/components/sites/wwyn-vn/detail/ProductInfo";
import { ProductTabs } from "@/components/sites/wwyn-vn/detail/ProductTabs";
import { RelatedProducts } from "@/components/sites/wwyn-vn/detail/RelatedProducts";

import "@/components/sites/wwyn-vn/root/wwyn.css";
import "@/app/cua-hang/shop.css";
import "./detail.css";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SHOP_PRODUCTS.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại | Ninety Eight Studio",
    };
  }

  return {
    title: `${product.name} | Ninety Eight Studio`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} | Ninety Eight Studio`,
      description: product.description.slice(0, 160),
      images: product.gallery && product.gallery.length > 0 ? [product.gallery[0]] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product.id, 4);

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

      {/* Product Detail Main Section */}
      <section className="detail-container">
        <div className="grid-pro-detail-wrapper">
          {/* Left Column: Gallery */}
          <div className="left-pro-detail">
            <ProductGallery
              images={product.gallery}
              productName={product.name}
            />
          </div>

          {/* Right Column: Information, Selectors & Tabs */}
          <div className="right-pro-detail">
            <ProductInfo product={product} />
            <ProductTabs product={product} />
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </section>

      {/* Footer Section */}
      <Footer />
    </main>
  );
}
