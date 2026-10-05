export interface ProductColor {
  name: string;
  thumbnail: string;
  slug: string;
}

export interface ProductDimensions {
  size: string;
  strapDrop: string;
  strapLength?: string;
  weight: string;
}

export interface ProductVariantItem {
  id: number;
  color_name: string;
  color_code?: string;
  sku?: string;
  price: number;
  original_price?: number | null;
  stock: number;
  image?: string;
}

export interface ShopProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  originalPrice?: string;
  category: "TOTE BAG" | "SHOULDER BAG" | "TRAVEL BAG" | "ACCESSORIES";
  image: string;
  hoverImage: string;
  gallery: string[];
  colors?: ProductColor[];
  variants?: ProductVariantItem[];
  description: string;
  highlights?: string[];
  dimensions?: ProductDimensions;
  material?: string;
  careInstructions?: string;
  shippingPolicy?: string;
  outOfStock?: boolean;
  page: number;
}

// Live catalog is loaded directly from MySQL Database via REST API
export const SHOP_PRODUCTS: ShopProduct[] = [];

export function getProductBySlug(slug: string): ShopProduct | undefined {
  return SHOP_PRODUCTS.find((p) => p.slug === slug);
}

export function getRelatedProducts(currentId: number, limit = 4): ShopProduct[] {
  return SHOP_PRODUCTS.filter((p) => p.id !== currentId).slice(0, limit);
}
