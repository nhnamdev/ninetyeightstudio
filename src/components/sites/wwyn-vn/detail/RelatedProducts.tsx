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
    <section className="related-products-section mt-20 pt-14 border-t border-neutral-200">
      <div className="mb-10 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-neutral-400 block mb-1">
          NINETY EIGHT STUDIO
        </span>
        <h2 className="text-[18px] sm:text-[20px] font-bold uppercase tracking-widest text-neutral-900">
          YOU MAY ALSO LIKE
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
