"use client";

import React from "react";
import { ShopProduct } from "@/data/shopProducts";
import { ShopProductCard } from "../shop/ShopProductCard";

interface RelatedProductsProps {
  products: ShopProduct[];
}

export const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="related-products-section mt-16 pt-12 border-t border-neutral-200">
      <div className="title-main mb-8 text-center">
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-widest text-black">
          Sản phẩm cùng loại
        </h2>
      </div>

      <div className="shop-product-grid">
        {products.map((product) => (
          <ShopProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
