"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

export interface CartItem {
  id: string; // unique item id: slug or slug-color
  productId: number;
  name: string;
  slug: string;
  price: number; // numeric value (e.g. 2450000)
  priceFormatted: string; // "2.450.000₫"
  originalPrice?: string;
  image: string;
  color?: string;
  quantity: number;
}

export interface AddToCartInput {
  productId: number;
  name: string;
  slug: string;
  price: string | number;
  originalPrice?: string;
  image: string;
  color?: string;
  quantity?: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (input: AddToCartInput, openDrawer?: boolean) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  totalCount: number;
  subtotal: number;
  subtotalFormatted: string;
  isLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = "ninetyeight_cart_v1";

export function parsePrice(priceVal: string | number): number {
  if (typeof priceVal === "number") return priceVal;
  const digits = priceVal.replace(/[^\d]/g, "");
  return parseInt(digits, 10) || 0;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Lỗi khi đọc giỏ hàng từ localStorage:", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage when items change (after initial load)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error("Lỗi khi lưu giỏ hàng vào localStorage:", e);
    }
  }, [items, isLoaded]);

  const addToCart = (input: AddToCartInput, openDrawer: boolean = true) => {
    const numericPrice = parsePrice(input.price);
    const formattedPrice =
      typeof input.price === "string" ? input.price : formatPrice(input.price);
    const qtyToAdd = input.quantity && input.quantity > 0 ? input.quantity : 1;
    const cleanColor = input.color?.trim();
    const itemId = cleanColor ? `${input.slug}-${cleanColor}` : input.slug;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((it) => it.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qtyToAdd,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          id: itemId,
          productId: input.productId,
          name: input.name,
          slug: input.slug,
          price: numericPrice,
          priceFormatted: formattedPrice,
          originalPrice: input.originalPrice,
          image: input.image,
          color: cleanColor,
          quantity: qtyToAdd,
        };
        return [...prevItems, newItem];
      }
    });

    if (openDrawer) {
      setIsCartOpen(true);
    }
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const totalCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const subtotalFormatted = useMemo(() => {
    return formatPrice(subtotal);
  }, [subtotal]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        toggleCart,
        totalCount,
        subtotal,
        subtotalFormatted,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
