"use client";

import React, { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Layers,
  CheckCircle2,
  XCircle,
  X,
  Loader2,
  RefreshCw,
  Box,
  Copy,
  Palette,
} from "lucide-react";
import { api } from "@/lib/api";

interface ProductVariant {
  id?: number;
  product_id?: number;
  color_name: string;
  color_code: string;
  sku: string;
  barcode?: string;
  image: string;
  price: number;
  original_price?: number | null;
  stock: number;
  reserved_stock?: number;
  weight_gram?: number;
  is_active?: number;
}

interface Product {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  slug: string;
  product_code?: string;
  description?: string;
  dimensions?: string;
  material?: string;
  base_price: number;
  cover_image: string;
  hover_image?: string;
  gallery_images: string[];
  is_new_arrival: number;
  is_best_seller: number;
  is_active: number;
  variant_count: number;
  total_stock: number;
  total_reserved_stock: number;
  min_price: number;
  max_price: number;
  variants: ProductVariant[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    category_id: 1,
    product_code: "",
    description: "",
    dimensions: "",
    material: "",
    base_price: 350000,
    cover_image: "/images/products/nes-bag.jpg",
    hover_image: "",
    is_new_arrival: false,
    is_best_seller: false,
    is_active: true,
  });

  // Shopee-style Variants Table State
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      color_name: "Đen (Black)",
      color_code: "#18181b",
      sku: "NES-BAG-BLK",
      price: 350000,
      original_price: 420000,
      stock: 50,
      image: "/images/products/nes-bag.jpg",
    },
  ]);

  // Bulk Apply state for Shopee-style experience
  const [bulkPrice, setBulkPrice] = useState("");
  const [bulkStock, setBulkStock] = useState("");

  // Stock Quick Edit Modal
  const [stockModalVariant, setStockModalVariant] = useState<ProductVariant | null>(null);
  const [newStockValue, setNewStockValue] = useState("");
  const [stockNote, setStockNote] = useState("");
  const [stockLoading, setStockLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      const res = await api.get<Category[]>("/products/categories");
      if (res.data) setCategories(res.data);
    } catch (err) {
      console.error("Categories error:", err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      let endpoint = "/products";
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory !== "all") params.append("category", selectedCategory);
      if (params.toString()) endpoint += `?${params.toString()}`;

      const res = await api.get<Product[]>(endpoint);
      if (res.data) setProducts(res.data);
    } catch (err) {
      console.error("Products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      category_id: categories[0]?.id || 1,
      product_code: "",
      description: "",
      dimensions: "30 x 22 x 10 cm",
      material: "Canvas cao cấp trượt nước",
      base_price: 350000,
      cover_image: "/images/products/nes-bag.jpg",
      hover_image: "",
      is_new_arrival: true,
      is_best_seller: false,
      is_active: true,
    });
    setVariants([
      {
        color_name: "Đen (Black)",
        color_code: "#18181b",
        sku: `NES-PROD-BLK-${Date.now().toString().slice(-4)}`,
        price: 350000,
        original_price: 420000,
        stock: 50,
        image: "/images/products/nes-bag.jpg",
      },
    ]);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setFormData({
      name: prod.name,
      slug: prod.slug,
      category_id: prod.category_id,
      product_code: prod.product_code || "",
      description: prod.description || "",
      dimensions: prod.dimensions || "",
      material: prod.material || "",
      base_price: Number(prod.base_price) || 0,
      cover_image: prod.cover_image,
      hover_image: prod.hover_image || "",
      is_new_arrival: !!prod.is_new_arrival,
      is_best_seller: !!prod.is_best_seller,
      is_active: !!prod.is_active,
    });
    setVariants(
      prod.variants.length > 0
        ? prod.variants.map((v) => ({
            ...v,
            price: Number(v.price),
            original_price: v.original_price ? Number(v.original_price) : null,
            stock: Number(v.stock),
          }))
        : [
            {
              color_name: "Đen",
              color_code: "#000000",
              sku: `${prod.slug.toUpperCase()}-BLK`,
              price: Number(prod.base_price),
              stock: 20,
              image: prod.cover_image,
            },
          ]
    );
    setModalError(null);
    setIsModalOpen(true);
  };

  // Add a new color row to variants table
  const handleAddVariantRow = () => {
    const defaultName = `Màu mới ${variants.length + 1}`;
    setVariants([
      ...variants,
      {
        color_name: defaultName,
        color_code: "#6b7280",
        sku: `NES-${formData.product_code || "SKU"}-${Date.now().toString().slice(-4)}`,
        price: formData.base_price || 350000,
        original_price: null,
        stock: 20,
        image: formData.cover_image,
      },
    ]);
  };

  const handleRemoveVariantRow = (index: number) => {
    if (variants.length <= 1) {
      alert("Sản phẩm cần ít nhất 1 phân loại màu sắc!");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: unknown) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  // Shopee Bulk Apply
  const handleApplyBulkPrice = () => {
    const priceNum = Number(bulkPrice);
    if (!priceNum || priceNum < 0) return;
    setVariants(variants.map((v) => ({ ...v, price: priceNum })));
    setBulkPrice("");
  };

  const handleApplyBulkStock = () => {
    const stockNum = Number(bulkStock);
    if (isNaN(stockNum) || stockNum < 0) return;
    setVariants(variants.map((v) => ({ ...v, stock: stockNum })));
    setBulkStock("");
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalError(null);
    setModalLoading(true);

    try {
      const payload = {
        ...formData,
        variants,
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: unknown) {
      const error = err as Error;
      setModalError(error.message || "Lỗi lưu sản phẩm");
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn ngừng kinh doanh sản phẩm này?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Lỗi xóa sản phẩm");
    }
  };

  const handleUpdateStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stockModalVariant || !stockModalVariant.id) return;

    setStockLoading(true);
    try {
      await api.patch(`/products/variants/${stockModalVariant.id}/stock`, {
        stock: Number(newStockValue),
        note: stockNote,
      });
      setStockModalVariant(null);
      fetchProducts();
    } catch (err: unknown) {
      const error = err as Error;
      alert(error.message || "Lỗi cập nhật tồn kho");
    } finally {
      setStockLoading(false);
    }
  };

  const formatVND = (amount: number | string) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(amount));
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Package className="w-7 h-7 text-red-500" />
            Quản lý Sản phẩm & Biến thể Shopee
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Quản lý kho hàng theo từng phân loại màu sắc, giá bán và SKU ma trận
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm mới</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-[#141720] border border-zinc-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
              placeholder="Tìm theo tên túi, mã dòng túi hoặc SKU..."
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
            }}
            className="py-2 px-3 bg-zinc-900 border border-zinc-700/80 rounded-xl text-xs text-zinc-300 focus:outline-none focus:border-red-500"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchProducts}
            disabled={loading}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Tìm kiếm / Làm mới</span>
          </button>
        </div>
      </div>

      {/* Product List Table */}
      <div className="bg-[#141720] border border-zinc-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-zinc-800/80 text-zinc-400 bg-zinc-900/40 text-[11px] uppercase tracking-wider">
                <th className="p-4 pl-6">Sản phẩm</th>
                <th className="p-4">Danh mục</th>
                <th className="p-4">Giá tham chiếu</th>
                <th className="p-4">Phân loại & Tồn kho Shopee</th>
                <th className="p-4">Tổng tồn</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 pr-6 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-red-500" />
                    <span>Đang kết nối VPS MySQL tải danh sách sản phẩm...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-400">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 overflow-hidden shrink-0">
                          <img
                            src={prod.cover_image || "/images/products/placeholder.jpg"}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{prod.name}</div>
                          <div className="text-[11px] text-zinc-400 font-mono">
                            {prod.product_code || `SLUG: ${prod.slug}`}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-xs">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                        {prod.category_name || "TOTE BAG"}
                      </span>
                    </td>

                    <td className="p-4 font-mono font-bold text-white text-xs">
                      {formatVND(prod.base_price)}
                    </td>

                    {/* Shopee-style Variant Badges */}
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5 max-w-xs">
                        {prod.variants && prod.variants.length > 0 ? (
                          prod.variants.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => {
                                setStockModalVariant(v);
                                setNewStockValue(String(v.stock));
                                setStockNote("");
                              }}
                              title="Bấm để chỉnh nhanh số lượng tồn kho màu này"
                              className="group inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-zinc-900 border border-zinc-700/80 hover:border-red-500 text-[11px] transition-all cursor-pointer"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/40"
                                style={{ backgroundColor: v.color_code || "#000" }}
                              />
                              <span className="text-zinc-200">{v.color_name}:</span>
                              <span
                                className={`font-mono font-bold ${
                                  v.stock <= 5 ? "text-red-400" : "text-emerald-400"
                                }`}
                              >
                                {v.stock}
                              </span>
                            </button>
                          ))
                        ) : (
                          <span className="text-xs text-zinc-400 italic">Chưa có màu</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="font-mono font-bold text-white text-xs">
                        {prod.total_stock || 0} cái
                      </div>
                      {Number(prod.total_reserved_stock) > 0 && (
                        <div className="text-[10px] text-amber-400">
                          (Giữ chỗ: {prod.total_reserved_stock})
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      {prod.is_active ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang bán
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-zinc-400 font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          Tạm ẩn
                        </span>
                      )}
                    </td>

                    <td className="p-4 pr-6 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          title="Sửa sản phẩm & phân loại màu"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          title="Ngừng kinh doanh"
                          className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shopee-style Product Form Modal (Add / Edit) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#141720] border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-500" />
                  {editingProduct ? `Chỉnh sửa: ${editingProduct.name}` : "Thêm mới sản phẩm chuẩn Shopee"}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Thiết lập thông tin túi và danh sách phân loại màu sắc với kho tồn độc lập
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitProduct} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
              {modalError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                  {modalError}
                </div>
              )}

              {/* Section 1: Basic Product Information */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                  <Box className="w-4 h-4" />
                  1. Thông tin chung về dòng túi
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Zuni Bag, Rimo Bag..."
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Danh mục *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-red-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Mã túi nội bộ (Product Code)
                    </label>
                    <input
                      type="text"
                      value={formData.product_code}
                      onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                      placeholder="VD: NES-ZUNI"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Giá niêm yết cơ bản (VND) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                      placeholder="VD: 350000"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Kích thước (Dimensions)
                    </label>
                    <input
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="VD: 30 x 22 x 10 cm"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Chất liệu (Material)
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      placeholder="VD: Da PU cao cấp, Canvas trượt nước"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      URL Ảnh bìa đại diện *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.cover_image}
                      onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
                      placeholder="/images/products/nes-bag.jpg"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      URL Ảnh hover chuột
                    </label>
                    <input
                      type="text"
                      value={formData.hover_image}
                      onChange={(e) => setFormData({ ...formData, hover_image: e.target.value })}
                      placeholder="/images/products/nes-bag-hover.jpg"
                      className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Giới thiệu về mẫu thiết kế, tính năng, phong cách..."
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* Section 2: Shopee-style Color Matrix & Inventory Table */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      2. Phân loại màu sắc & Tồn kho (Chuẩn Shopee)
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Mỗi dòng tương ứng với một màu có SKU riêng, giá bán riêng và số lượng tồn kho riêng
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white flex items-center gap-1.5 border border-zinc-700 transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-red-500" />
                    <span>+ Thêm màu mới</span>
                  </button>
                </div>

                {/* Shopee Bulk Actions Bar */}
                <div className="p-3 bg-zinc-950/60 border border-zinc-800 rounded-xl flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-zinc-400 font-medium flex items-center gap-1">
                    <Copy className="w-3.5 h-3.5" />
                    Áp dụng hàng loạt:
                  </span>
                  <div className="inline-flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="Giá chung (VND)"
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(e.target.value)}
                      className="w-28 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyBulkPrice}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs cursor-pointer"
                    >
                      Áp dụng giá
                    </button>
                  </div>

                  <div className="inline-flex items-center gap-1.5">
                    <input
                      type="number"
                      placeholder="Tồn kho chung"
                      value={bulkStock}
                      onChange={(e) => setBulkStock(e.target.value)}
                      className="w-24 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyBulkStock}
                      className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs cursor-pointer"
                    >
                      Áp dụng kho
                    </button>
                  </div>
                </div>

                {/* Variants Table */}
                <div className="border border-zinc-800 rounded-xl overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-900/60 text-zinc-400 border-b border-zinc-800 text-[11px] uppercase tracking-wider">
                        <th className="p-2.5 pl-3">Tên màu</th>
                        <th className="p-2.5">Mã Hex</th>
                        <th className="p-2.5">Mã SKU</th>
                        <th className="p-2.5">Giá bán (VND)</th>
                        <th className="p-2.5">Kho tồn</th>
                        <th className="p-2.5">Link ảnh màu</th>
                        <th className="p-2.5 pr-3 text-center">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80">
                      {variants.map((v, idx) => (
                        <tr key={idx} className="hover:bg-zinc-800/20">
                          <td className="p-2.5 pl-3">
                            <input
                              type="text"
                              required
                              value={v.color_name}
                              onChange={(e) => handleVariantChange(idx, "color_name", e.target.value)}
                              placeholder="VD: Black, Gray, Camo..."
                              className="w-28 px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                            />
                          </td>

                          <td className="p-2.5">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="color"
                                value={v.color_code || "#000000"}
                                onChange={(e) => handleVariantChange(idx, "color_code", e.target.value)}
                                className="w-7 h-7 rounded border border-zinc-700 cursor-pointer bg-transparent"
                              />
                              <input
                                type="text"
                                value={v.color_code || "#000000"}
                                onChange={(e) => handleVariantChange(idx, "color_code", e.target.value)}
                                className="w-18 px-1.5 py-1 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-zinc-300 font-mono"
                              />
                            </div>
                          </td>

                          <td className="p-2.5">
                            <input
                              type="text"
                              required
                              value={v.sku}
                              onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                              placeholder="NES-SKU"
                              className="w-28 px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white font-mono"
                            />
                          </td>

                          <td className="p-2.5">
                            <input
                              type="number"
                              required
                              value={v.price}
                              onChange={(e) => handleVariantChange(idx, "price", Number(e.target.value))}
                              placeholder="350000"
                              className="w-24 px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white font-mono"
                            />
                          </td>

                          <td className="p-2.5">
                            <input
                              type="number"
                              required
                              value={v.stock}
                              onChange={(e) => handleVariantChange(idx, "stock", Number(e.target.value))}
                              placeholder="50"
                              className="w-20 px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white font-mono"
                            />
                          </td>

                          <td className="p-2.5">
                            <input
                              type="text"
                              value={v.image}
                              onChange={(e) => handleVariantChange(idx, "image", e.target.value)}
                              placeholder="/images/color.jpg"
                              className="w-36 px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white font-mono"
                            />
                          </td>

                          <td className="p-2.5 pr-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariantRow(idx)}
                              className="p-1 rounded text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-300 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-red-600/20 transition-all cursor-pointer"
                >
                  {modalLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingProduct ? "Lưu thay đổi" : "Tạo sản phẩm & Kho hàng"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Stock Adjustment Modal */}
      {stockModalVariant && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141720] border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-red-500" />
                Điều chỉnh tồn kho biến thể
              </h3>
              <button
                onClick={() => setStockModalVariant(null)}
                className="text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 mb-4 text-xs space-y-1">
              <div className="text-zinc-400">
                Màu sắc: <span className="text-white font-semibold">{stockModalVariant.color_name}</span>
              </div>
              <div className="text-zinc-400">
                SKU: <span className="font-mono text-zinc-200">{stockModalVariant.sku}</span>
              </div>
              <div className="text-zinc-400">
                Tồn kho hiện tại: <span className="font-bold text-emerald-400">{stockModalVariant.stock} cái</span>
              </div>
            </div>

            <form onSubmit={handleUpdateStock} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Số lượng tồn kho mới thực tế *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Lý do điều chỉnh (Lưu vào nhật ký kho)
                </label>
                <input
                  type="text"
                  value={stockNote}
                  onChange={(e) => setStockNote(e.target.value)}
                  placeholder="VD: Kiểm kê định kỳ, nhập thêm từ xưởng..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setStockModalVariant(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={stockLoading}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-red-600/20 cursor-pointer"
                >
                  {stockLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Xác nhận cập nhật</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
