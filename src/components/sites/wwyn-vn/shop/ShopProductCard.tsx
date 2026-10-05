"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShopProduct } from "@/data/shopProducts";

interface ShopProductCardProps {
  product: ShopProduct;
  onAddToCart?: (product: ShopProduct) => void;
}

export const ShopProductCard: React.FC<ShopProductCardProps> = ({
  product,
  onAddToCart,
}) => {
  const [img1Error, setImg1Error] = useState(false);
  const [img2Error, setImg2Error] = useState(false);

  const fallbackImg = "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/yacht-tote-camo-187b8f33.webp";
  const primaryImg = img1Error || !product.image ? fallbackImg : product.image;
  const secondaryImg =
    img2Error || !product.hoverImage ? primaryImg : product.hoverImage;

  return (
    <div className="shop-product-card group">
      {/* Product Image Frame */}
      <div className="pic-product">
        <Link href={`/san-pham/${product.slug}`} title={product.name}>
          <img
            src={primaryImg}
            alt={product.name}
            className="images1"
            loading="lazy"
            onError={() => setImg1Error(true)}
          />
          <img
            src={secondaryImg}
            alt={product.name}
            className="images2"
            loading="lazy"
            onError={() => setImg2Error(true)}
          />
        </Link>

        {/* Quick Add To Cart Button */}
        <button
          type="button"
          className="box-product-cart-add"
          title="Thêm vào giỏ hàng"
          aria-label={`Thêm ${product.name} vào giỏ hàng`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onAddToCart) onAddToCart(product);
          }}
        >
          <img
            src="https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/branding/cart-2b55cbd4.png"
            alt="Giỏ hàng"
            width={22}
            height={22}
          />
        </button>
      </div>

      {/* Product Details */}
      <div className="content-product">
        <h3 className="name-product">
          <Link href={`/san-pham/${product.slug}`} title={product.name}>
            {product.name}
          </Link>
        </h3>
        <div className="price-product">
          <span className="price-new">{product.price}</span>
        </div>
      </div>
    </div>
  );
};
