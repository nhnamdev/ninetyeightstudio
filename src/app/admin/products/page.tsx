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
  Upload,
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
    cover_image: "",
    hover_image: "",
    is_new_arrival: false,
    is_best_seller: false,
    is_active: true,
  });

  // Variants Table State
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      color_name: "Đen (Black)",
      color_code: "#18181b",
      sku: "NES-BAG-BLK",
      price: 350000,
      original_price: 420000,
      stock: 50,
      image: "",
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
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingHover, setUploadingHover] = useState(false);

  const handleFileUpload = async (file: File, target: "cover" | "hover") => {
    const isCover = target === "cover";
    if (isCover) setUploadingCover(true);
    else setUploadingHover(true);

    try {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("folder", "products");

      const res = await api.upload<{ url: string }>("/upload", uploadData);
      if (res.data?.url) {
        if (isCover) {
          setFormData((prev) => ({ ...prev, cover_image: res.data!.url }));
        } else {
          setFormData((prev) => ({ ...prev, hover_image: res.data!.url }));
        }
      }
    } catch (err: unknown) {
      const error = err as Error;
      alert("Không thể tải ảnh lên, vui lòng thử lại: " + (error.message || "Lỗi không xác định"));
    } finally {
      if (isCover) setUploadingCover(false);
      else setUploadingHover(false);
    }
  };

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
      cover_image: "",
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
        image: "",
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

  const handleAddVariantRow = () => {
    const defaultName = `Màu mới ${variants.length + 1}`;
    setVariants([
      ...variants,
      {
        color_name: defaultName,
        color_code: "#71717a",
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

    if (!formData.cover_image) {
      setModalError("Vui lòng tải lên ảnh bìa đại diện cho sản phẩm");
      return;
    }

    setModalLoading(true);

    try {
      const payload = {
        ...formData,
        variants: variants.map((v) => ({
          ...v,
          image: v.image || formData.cover_image,
        })),
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
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-zinc-800" />
            Quản lý Sản phẩm & Biến thể Shopee
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
            Quản lý kho hàng theo từng phân loại màu sắc, giá bán và SKU ma trận
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Thêm sản phẩm mới</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white border border-zinc-200/90 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row gap-2.5 items-stretch md:items-center justify-between shadow-xs">
        <div className="flex flex-1 items-center gap-2.5">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
              placeholder="Tìm theo tên túi, mã dòng túi hoặc SKU..."
              className="w-full pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-1.5 px-2.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-700 focus:outline-none focus:border-zinc-900"
          >
            <option value="all">Tất cả danh mục</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={fetchProducts}
          disabled={loading}
          className="px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-xs font-medium text-zinc-700 flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Tìm kiếm</span>
        </button>
      </div>

      {/* Product List Table */}
      <div className="bg-white border border-zinc-200/90 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-zinc-200/80 text-zinc-500 bg-zinc-50/70 text-[11px] uppercase tracking-wider">
                <th className="p-3 pl-5">Sản phẩm</th>
                <th className="p-3">Danh mục</th>
                <th className="p-3">Giá tham chiếu</th>
                <th className="p-3">Phân loại màu & Tồn kho Shopee</th>
                <th className="p-3">Tổng tồn</th>
                <th className="p-3">Trạng thái</th>
                <th className="p-3 pr-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-zinc-400">
                    <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2 text-zinc-700" />
                    <span>Đang tải danh sách sản phẩm...</span>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-zinc-400">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              ) : (
                products.map((prod) => (
                  <tr key={prod.id} className="hover:bg-zinc-50/80 transition-colors">
                    <td className="p-3 pl-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                          <img
                            src={prod.cover_image || "https://pub-f3a573691f48412ebbb07d135eeee4cb.r2.dev/products/thumb-1-b6c013de.png"}
                            alt={prod.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-zinc-900 text-xs sm:text-sm">{prod.name}</div>
                          <div className="text-[10px] text-zinc-500 font-mono">
                            {prod.product_code || prod.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-700 font-medium text-[11px] border border-zinc-200/60">
                        {prod.category_name || "TOTE BAG"}
                      </span>
                    </td>

                    <td className="p-3 font-mono font-semibold text-zinc-900">
                      {formatVND(prod.base_price)}
                    </td>

                    {/* Shopee-style Variant Badges */}
                    <td className="p-3">
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
                              className="group inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white border border-zinc-200 hover:border-zinc-400 text-[11px] transition-colors cursor-pointer"
                            >
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/20"
                                style={{ backgroundColor: v.color_code || "#000" }}
                              />
                              <span className="text-zinc-700">{v.color_name}:</span>
                              <span
                                className={`font-mono font-bold ${
                                  v.stock <= 5 ? "text-amber-700" : "text-zinc-900"
                                }`}
                              >
                                {v.stock}
                              </span>
                            </button>
                          ))
                        ) : (
                          <span className="text-[11px] text-zinc-400 italic">Chưa có màu</span>
                        )}
                      </div>
                    </td>

                    <td className="p-3">
                      <div className="font-mono font-semibold text-zinc-900">
                        {prod.total_stock || 0} cái
                      </div>
                      {Number(prod.total_reserved_stock) > 0 && (
                        <div className="text-[10px] text-amber-700">
                          (Giữ chỗ: {prod.total_reserved_stock})
                        </div>
                      )}
                    </td>

                    <td className="p-3">
                      {prod.is_active ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Đang bán
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500 font-medium">
                          <XCircle className="w-3.5 h-3.5" />
                          Tạm ẩn
                        </span>
                      )}
                    </td>

                    <td className="p-3 pr-5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(prod)}
                          title="Sửa sản phẩm & phân loại màu"
                          className="p-1.5 rounded-md bg-white hover:bg-zinc-100 text-zinc-600 hover:text-zinc-900 border border-zinc-200 transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod.id)}
                          title="Ngừng kinh doanh"
                          className="p-1.5 rounded-md bg-white hover:bg-red-50 text-zinc-500 hover:text-red-700 border border-zinc-200 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white border border-zinc-200 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-xl overflow-hidden my-auto font-sans">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-zinc-700" />
                  {editingProduct ? `Chỉnh sửa: ${editingProduct.name}` : "Thêm mới sản phẩm"}
                </h2>
                <p className="text-xs text-zinc-500 mt-0.5">
                  Thiết lập thông tin túi và danh sách phân loại màu sắc với kho tồn độc lập
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmitProduct} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {modalError && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
                  {modalError}
                </div>
              )}

              {/* Section 1: Basic Product Information */}
              <div className="space-y-3.5">
                <div className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-zinc-600" />
                  1. Thông tin chung về dòng túi
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Tên sản phẩm *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="VD: Zuni Bag, Rimo Bag..."
                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Danh mục *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: Number(e.target.value) })}
                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-800 focus:outline-none focus:border-zinc-900"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Mã túi nội bộ (Product Code)
                    </label>
                    <input
                      type="text"
                      value={formData.product_code}
                      onChange={(e) => setFormData({ ...formData, product_code: e.target.value })}
                      placeholder="VD: NES-ZUNI"
                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Giá niêm yết cơ bản (VND) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.base_price}
                      onChange={(e) => setFormData({ ...formData, base_price: Number(e.target.value) })}
                      placeholder="VD: 350000"
                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Kích thước (Dimensions)
                    </label>
                    <input
                      type="text"
                      value={formData.dimensions}
                      onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                      placeholder="VD: 30 x 22 x 10 cm"
                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1">
                      Chất liệu (Material)
                    </label>
                    <input
                      type="text"
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      placeholder="VD: Da PU cao cấp, Canvas trượt nước"
                      className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Ảnh bìa chính */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                      Ảnh bìa đại diện <span className="text-red-500">*</span>
                    </label>

                    {formData.cover_image ? (
                      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3.5">
                        <div className="w-16 h-20 rounded-lg bg-white border border-zinc-200 overflow-hidden shrink-0 shadow-2xs">
                          <img
                            src={formData.cover_image}
                            alt="Ảnh bìa"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Đã chọn ảnh bìa</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                            Hiển thị làm ảnh chính sản phẩm
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <label className="px-2.5 py-1 rounded-md bg-white hover:bg-zinc-100 border border-zinc-200 text-[11px] font-medium text-zinc-800 cursor-pointer flex items-center gap-1 transition-colors shadow-2xs">
                              {uploadingCover ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Upload className="w-3 h-3" />
                              )}
                              <span>{uploadingCover ? "Đang tải ảnh..." : "Đổi ảnh khác"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingCover}
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(file, "cover");
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, cover_image: "" })}
                              className="px-2 py-1 rounded-md text-[11px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-zinc-200 hover:border-zinc-400 bg-zinc-50/60 hover:bg-zinc-50 rounded-xl cursor-pointer transition-colors group text-center min-h-[104px]">
                        {uploadingCover ? (
                          <div className="flex flex-col items-center py-2">
                            <Loader2 className="w-5 h-5 animate-spin text-zinc-800 mb-1" />
                            <span className="text-xs font-medium text-zinc-700">Đang tải ảnh lên...</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 mb-1.5 group-hover:text-zinc-900 group-hover:border-zinc-300 shadow-2xs transition-colors">
                              <Upload className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold text-zinc-800 group-hover:text-zinc-950">
                              Tải ảnh lên
                            </span>
                            <span className="text-[11px] text-zinc-400 mt-0.5">
                              Bấm để chọn tệp ảnh từ thiết bị
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingCover}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, "cover");
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Ảnh hover chuột */}
                  <div>
                    <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                      Ảnh phụ (khi rê chuột)
                    </label>

                    {formData.hover_image ? (
                      <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center gap-3.5">
                        <div className="w-16 h-20 rounded-lg bg-white border border-zinc-200 overflow-hidden shrink-0 shadow-2xs">
                          <img
                            src={formData.hover_image}
                            alt="Ảnh phụ khi rê chuột"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Đã chọn ảnh phụ</span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                            Hiệu ứng đổi góc nhìn khi rê chuột
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <label className="px-2.5 py-1 rounded-md bg-white hover:bg-zinc-100 border border-zinc-200 text-[11px] font-medium text-zinc-800 cursor-pointer flex items-center gap-1 transition-colors shadow-2xs">
                              {uploadingHover ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Upload className="w-3 h-3" />
                              )}
                              <span>{uploadingHover ? "Đang tải ảnh..." : "Đổi ảnh khác"}</span>
                              <input
                                type="file"
                                accept="image/*"
                                disabled={uploadingHover}
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleFileUpload(file, "hover");
                                }}
                              />
                            </label>
                            <button
                              type="button"
                              onClick={() => setFormData({ ...formData, hover_image: "" })}
                              className="px-2 py-1 rounded-md text-[11px] font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-zinc-200 hover:border-zinc-400 bg-zinc-50/60 hover:bg-zinc-50 rounded-xl cursor-pointer transition-colors group text-center min-h-[104px]">
                        {uploadingHover ? (
                          <div className="flex flex-col items-center py-2">
                            <Loader2 className="w-5 h-5 animate-spin text-zinc-800 mb-1" />
                            <span className="text-xs font-medium text-zinc-700">Đang tải ảnh lên...</span>
                          </div>
                        ) : (
                          <>
                            <div className="w-8 h-8 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 mb-1.5 group-hover:text-zinc-900 group-hover:border-zinc-300 shadow-2xs transition-colors">
                              <Upload className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold text-zinc-800 group-hover:text-zinc-950">
                              Tải ảnh lên
                            </span>
                            <span className="text-[11px] text-zinc-400 mt-0.5">
                              Tùy chọn ảnh góc nhìn thứ 2
                            </span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploadingHover}
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(file, "hover");
                          }}
                        />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1">
                    Mô tả sản phẩm
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Giới thiệu về mẫu thiết kế, tính năng, phong cách..."
                    className="w-full px-3 py-1.5 bg-white border border-zinc-200 rounded-lg text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                  />
                </div>
              </div>

              {/* Section 2: Shopee-style Color Matrix & Inventory Table */}
              <div className="space-y-3.5 pt-4 border-t border-zinc-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div>
                    <div className="text-xs font-bold text-zinc-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5 text-zinc-600" />
                      2. Phân loại màu sắc & Tồn kho
                    </div>
                    <p className="text-[11px] text-zinc-500 mt-0.5">
                      Mỗi dòng tương ứng với một màu có mã phân loại, giá bán và số lượng tồn kho riêng
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="px-2.5 py-1 rounded-md bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-800 flex items-center gap-1 border border-zinc-200 transition-colors self-start sm:self-auto cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Thêm màu mới</span>
                  </button>
                </div>

                {/* Bulk Actions Bar */}
                <div className="p-2.5 bg-zinc-50 border border-zinc-200 rounded-lg flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="text-zinc-600 font-medium flex items-center gap-1">
                    <Copy className="w-3.5 h-3.5" />
                    Áp dụng hàng loạt:
                  </span>
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="Giá chung"
                      value={bulkPrice}
                      onChange={(e) => setBulkPrice(e.target.value)}
                      className="w-24 px-2 py-1 bg-white border border-zinc-200 rounded-md text-xs text-zinc-900 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyBulkPrice}
                      className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-xs cursor-pointer"
                    >
                      Áp dụng giá
                    </button>
                  </div>

                  <div className="inline-flex items-center gap-1">
                    <input
                      type="number"
                      placeholder="Tồn kho"
                      value={bulkStock}
                      onChange={(e) => setBulkStock(e.target.value)}
                      className="w-20 px-2 py-1 bg-white border border-zinc-200 rounded-md text-xs text-zinc-900 font-mono"
                    />
                    <button
                      type="button"
                      onClick={handleApplyBulkStock}
                      className="px-2 py-1 bg-zinc-900 hover:bg-zinc-800 text-white rounded-md text-xs cursor-pointer"
                    >
                      Áp dụng kho
                    </button>
                  </div>
                </div>

                {/* Variants Table */}
                <div className="border border-zinc-200 rounded-lg overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-zinc-50/70 text-zinc-500 border-b border-zinc-200 text-[11px] uppercase tracking-wider">
                        <th className="p-2.5 pl-3">Tên màu</th>
                        <th className="p-2.5">Mã màu</th>
                        <th className="p-2.5">Mã phân loại</th>
                        <th className="p-2.5">Giá bán (VND)</th>
                        <th className="p-2.5">Kho tồn</th>
                        <th className="p-2.5 pr-3 text-center">Xóa</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {variants.map((v, idx) => (
                        <tr key={idx} className="hover:bg-zinc-50/50">
                          <td className="p-2 pl-3">
                            <input
                              type="text"
                              required
                              value={v.color_name}
                              onChange={(e) => handleVariantChange(idx, "color_name", e.target.value)}
                              placeholder="VD: Black, Gray..."
                              className="w-24 px-2 py-1 bg-white border border-zinc-200 rounded-md text-xs text-zinc-900"
                            />
                          </td>

                          <td className="p-2">
                            <div className="flex items-center gap-1">
                              <input
                                type="color"
                                value={v.color_code || "#000000"}
                                onChange={(e) => handleVariantChange(idx, "color_code", e.target.value)}
                                className="w-6 h-6 rounded border border-zinc-200 cursor-pointer bg-transparent"
                              />
                              <input
                                type="text"
                                value={v.color_code || "#000000"}
                                onChange={(e) => handleVariantChange(idx, "color_code", e.target.value)}
                                className="w-16 px-1.5 py-1 bg-white border border-zinc-200 rounded-md text-[11px] text-zinc-700 font-mono"
                              />
                            </div>
                          </td>

                          <td className="p-2">
                            <input
                              type="text"
                              required
                              value={v.sku}
                              onChange={(e) => handleVariantChange(idx, "sku", e.target.value)}
                              placeholder="NES-SKU"
                              className="w-24 px-2 py-1 bg-white border border-zinc-200 rounded-md text-xs text-zinc-900 font-mono"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="number"
                              required
                              value={v.price}
                              onChange={(e) => handleVariantChange(idx, "price", Number(e.target.value))}
                              placeholder="350000"
                              className="w-24 px-2 py-1 bg-white border border-zinc-200 rounded-md text-xs text-zinc-900 font-mono"
                            />
                          </td>

                          <td className="p-2">
                            <input
                              type="number"
                              required
                              value={v.stock}
                              onChange={(e) => handleVariantChange(idx, "stock", Number(e.target.value))}
                              placeholder="50"
                              className="w-18 px-2 py-1 bg-white border border-zinc-200 rounded-md text-xs text-zinc-900 font-mono"
                            />
                          </td>

                          <td className="p-2 pr-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveVariantRow(idx)}
                              className="p-1 rounded text-zinc-400 hover:text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-3 border-t border-zinc-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg bg-white border border-zinc-200 hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-xl w-full max-w-sm p-5 shadow-xl font-sans">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-zinc-700" />
                Điều chỉnh tồn kho biến thể
              </h3>
              <button
                onClick={() => setStockModalVariant(null)}
                className="text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-2.5 rounded-lg bg-zinc-50 border border-zinc-200 mb-3.5 text-xs space-y-1">
              <div className="text-zinc-600">
                Màu sắc: <span className="text-zinc-900 font-semibold">{stockModalVariant.color_name}</span>
              </div>
              <div className="text-zinc-600">
                SKU: <span className="font-mono text-zinc-800">{stockModalVariant.sku}</span>
              </div>
              <div className="text-zinc-600">
                Tồn kho hiện tại: <span className="font-bold text-zinc-900">{stockModalVariant.stock} cái</span>
              </div>
            </div>

            <form onSubmit={handleUpdateStock} className="space-y-3.5">
              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Số lượng tồn kho mới thực tế *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={newStockValue}
                  onChange={(e) => setNewStockValue(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-md text-xs text-zinc-900 focus:outline-none focus:border-zinc-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 mb-1">
                  Lý do điều chỉnh (Nhật ký kho)
                </label>
                <input
                  type="text"
                  value={stockNote}
                  onChange={(e) => setStockNote(e.target.value)}
                  placeholder="VD: Kiểm kê, nhập thêm xưởng..."
                  className="w-full px-2.5 py-1.5 bg-white border border-zinc-200 rounded-md text-xs text-zinc-900 focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setStockModalVariant(null)}
                  className="px-3 py-1.5 rounded-md bg-white border border-zinc-200 hover:bg-zinc-50 text-xs text-zinc-700 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  disabled={stockLoading}
                  className="px-3.5 py-1.5 rounded-md bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  {stockLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Xác nhận</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
