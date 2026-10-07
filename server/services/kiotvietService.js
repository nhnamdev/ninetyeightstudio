require("dotenv").config();
const https = require("https");
const qs = require("querystring");

class KiotVietService {
  constructor() {
    this.clientId = process.env.KIOTVIET_CLIENT_ID;
    this.clientSecret = process.env.KIOTVIET_CLIENT_SECRET;
    this.retailer = process.env.KIOTVIET_RETAILER;
    this.defaultBranchId = Number(process.env.KIOTVIET_BRANCH_ID);
    this.tokenUrl = "https://id.kiotviet.vn/connect/token";
    this.apiUrl = "https://public.kiotapi.com";

    // In-memory token cache
    this.cachedToken = null;
    this.tokenExpiresAt = 0;
  }

  /**
   * Lấy hoặc tái sử dụng Access Token (OAuth 2.0)
   */
  async getAccessToken() {
    const now = Math.floor(Date.now() / 1000);
    // Nếu token còn hạn hơn 5 phút (300 giây), tái sử dụng
    if (this.cachedToken && this.tokenExpiresAt > now + 300) {
      return this.cachedToken;
    }

    if (!this.clientId || !this.clientSecret || !this.retailer) {
      throw new Error("Thiếu cấu hình KiotViet trong .env (KIOTVIET_CLIENT_ID, KIOTVIET_CLIENT_SECRET, KIOTVIET_RETAILER)");
    }

    const postData = qs.stringify({
      scopes: "PublicApi.Access",
      grant_type: "client_credentials",
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await this._httpPost(this.tokenUrl, postData, {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    });

    if (!response.access_token) {
      throw new Error(`Không lấy được access token KiotViet: ${JSON.stringify(response)}`);
    }

    this.cachedToken = response.access_token;
    // expires_in thường là 86400 (24 giờ)
    this.tokenExpiresAt = now + (response.expires_in || 86400);
    console.log(`[KiotVietService] Đã làm mới Access Token thành công. Hết hạn sau: ${response.expires_in}s`);
    return this.cachedToken;
  }

  /**
   * Gọi API KiotViet chung
   */
  async request(endpoint, method = "GET", body = null, queryParams = null) {
    const token = await this.getAccessToken();

    let urlPath = endpoint;
    if (queryParams && Object.keys(queryParams).length > 0) {
      const q = qs.stringify(queryParams);
      urlPath += (urlPath.includes("?") ? "&" : "?") + q;
    }

    const fullUrl = `${this.apiUrl}${urlPath}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Retailer: this.retailer,
      "Content-Type": "application/json",
    };

    let postBody = null;
    if (body && (method === "POST" || method === "PUT")) {
      postBody = typeof body === "string" ? body : JSON.stringify(body);
      headers["Content-Length"] = Buffer.byteLength(postBody);
    }

    return await this._httpRequest(fullUrl, method, headers, postBody);
  }

  /**
   * Lấy danh mục (Categories)
   */
  async getCategories(hierarchical = true) {
    return await this.request("/categories", "GET", null, {
      hierachicalData: hierarchical ? "true" : "false",
      pageSize: 100,
    });
  }

  /**
   * Lấy danh sách sản phẩm theo trang
   */
  async getProducts(params = {}) {
    return await this.request("/products", "GET", null, {
      pageSize: params.pageSize || 100,
      currentItem: params.currentItem || 0,
      includeInventory: params.includeInventory !== false ? "true" : "false",
      ...params,
    });
  }

  /**
   * Lấy toàn bộ sản phẩm KiotViet (tự động phân trang)
   */
  async getAllProducts() {
    const allProducts = [];
    let currentItem = 0;
    const pageSize = 100;
    let total = 0;

    console.log("[KiotVietService] Đang tải toàn bộ sản phẩm từ KiotViet...");

    do {
      const res = await this.getProducts({
        pageSize,
        currentItem,
        includeInventory: true,
      });

      if (!res || !Array.isArray(res.data)) {
        break;
      }

      total = res.total || 0;
      allProducts.push(...res.data);
      currentItem += res.data.length;

      console.log(`[KiotVietService] Đã tải ${allProducts.length}/${total} sản phẩm...`);

      if (res.data.length < pageSize || currentItem >= total) {
        break;
      }
    } while (currentItem < total);

    return { total, data: allProducts };
  }

  /**
   * Lấy chi tiết 1 sản phẩm theo ID
   */
  async getProductDetail(productId) {
    return await this.request(`/products/${productId}`, "GET");
  }

  /**
   * Lấy danh sách chi nhánh
   */
  async getBranches() {
    return await this.request("/branches", "GET");
  }

  /**
   * Tạo đơn đặt hàng KiotViet từ đơn hàng Website
   */
  async createOrder(orderPayload) {
    const payload = {
      branchId: orderPayload.branchId || this.defaultBranchId,
      description: orderPayload.description || "Đơn hàng từ Website ninetyeightstudio",
      method: orderPayload.method || "COD",
      discount: orderPayload.discount || 0,
      totalPayment: orderPayload.totalPayment || 0,
      makeInvoice: false, // Để dạng đơn đặt hàng (phiếu tạm) để nhân viên duyệt gói
      customer: {
        name: orderPayload.customerName,
        contactNumber: orderPayload.customerPhone,
        address: orderPayload.customerAddress,
        email: orderPayload.customerEmail || "",
        comment: orderPayload.orderNotes || "",
      },
      orderDetails: orderPayload.orderDetails.map((item) => ({
        productId: item.productId,
        productCode: item.productCode || "",
        productName: item.productName,
        quantity: Number(item.quantity) || 1,
        price: Number(item.price),
        discount: 0,
        note: item.note || "",
        orderDetailTaxs: [
          {
            taxId: 1,
            detailTax: 0,
            isApplyTaxReduction: false,
          },
        ],
      })),
      orderDelivery: {
        receiver: orderPayload.customerName,
        contactNumber: orderPayload.customerPhone,
        address: orderPayload.customerAddress,
        price: orderPayload.shippingFee || 0,
        usingPriceCod: orderPayload.method === "COD",
        priceCodPayment: orderPayload.method === "COD" ? orderPayload.totalAmount : 0,
      },
    };

    return await this.request("/orders", "POST", payload);
  }

  /**
   * Lấy danh sách Webhook đã đăng ký
   */
  async getWebhooks() {
    return await this.request("/webhooks", "GET");
  }

  /**
   * Đăng ký Webhook mới
   */
  async registerWebhook(type, webhookUrl, description = "") {
    const body = {
      Webhook: {
        Type: type, // 'stock.update', 'product.update', 'order.update'
        Url: webhookUrl,
        IsActive: true,
        Description: description || `Đồng bộ ${type} cho 98studio`,
      },
    };
    return await this.request("/webhooks", "POST", body);
  }

  /**
   * Hủy Webhook theo ID
   */
  async deleteWebhook(webhookId) {
    return await this.request(`/webhooks/${webhookId}`, "DELETE");
  }

  // --- Internal Helper HTTP Methods ---
  _httpPost(urlStr, postData, headers) {
    return new Promise((resolve, reject) => {
      const url = new URL(urlStr);
      const req = https.request(
        {
          hostname: url.hostname,
          path: url.pathname + url.search,
          method: "POST",
          headers,
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              resolve(JSON.parse(data));
            } catch (e) {
              resolve({ raw: data, status: res.statusCode });
            }
          });
        }
      );
      req.on("error", reject);
      req.write(postData);
      req.end();
    });
  }

  _httpRequest(urlStr, method, headers, postBody = null) {
    return new Promise((resolve, reject) => {
      const url = new URL(urlStr);
      const req = https.request(
        {
          hostname: url.hostname,
          path: url.pathname + url.search,
          method,
          headers,
        },
        (res) => {
          let data = "";
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () => {
            try {
              const parsed = JSON.parse(data);
              resolve(parsed);
            } catch (e) {
              resolve({ raw: data, status: res.statusCode });
            }
          });
        }
      );
      req.on("error", reject);
      if (postBody) req.write(postBody);
      req.end();
    });
  }
}

module.exports = new KiotVietService();
