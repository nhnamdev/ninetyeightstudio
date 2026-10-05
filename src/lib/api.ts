const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "/api" : "http://127.0.0.1:5000/api");

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  token?: string;
  user?: { id: number; full_name: string; email: string; role: string };
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("nes_admin_token");
}

export function setAdminToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("nes_admin_token", token);
  }
}

export function removeAdminToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("nes_admin_token");
    localStorage.removeItem("nes_admin_user");
  }
}

let cachedUserRaw: string | null = null;
let cachedUserObj: { id: number; full_name: string; email: string; role: string } | null = null;

export function getAdminUser(): { id: number; full_name: string; email: string; role: string } | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("nes_admin_user");
  if (!raw) {
    cachedUserRaw = null;
    cachedUserObj = null;
    return null;
  }
  if (raw === cachedUserRaw && cachedUserObj) {
    return cachedUserObj;
  }
  try {
    cachedUserRaw = raw;
    cachedUserObj = JSON.parse(raw);
    return cachedUserObj;
  } catch {
    cachedUserRaw = null;
    cachedUserObj = null;
    return null;
  }
}

export function setAdminUser(user: { id: number; full_name: string; email: string; role: string }): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("nes_admin_user", JSON.stringify(user));
  }
}

export function getCustomerToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("nes_customer_token");
}

export function setCustomerToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("nes_customer_token", token);
  }
}

export function removeCustomerToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("nes_customer_token");
    localStorage.removeItem("nes_customer_user");
  }
}

export interface CustomerUser {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  role: string;
  avatar_url?: string;
  gender?: string;
  birthday?: string;
}

export function getCustomerUser(): CustomerUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("nes_customer_user");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setCustomerUser(user: CustomerUser): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("nes_customer_user", JSON.stringify(user));
  }
}

async function request<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const isAdminRoute = typeof window !== "undefined" && window.location.pathname.startsWith("/admin");
  const token = isAdminRoute ? getAdminToken() : (getCustomerToken() || getAdminToken());
  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  try {
    const res = await fetch(url, {
      ...options,
      headers,
    });

    const data: ApiResponse<T> = await res.json();

    if (!res.ok) {
      if (res.status === 401 && typeof window !== "undefined") {
        if (isAdminRoute && !window.location.pathname.includes("/admin/login")) {
          removeAdminToken();
          // eslint-disable-next-line @next/next/no-location-assign-relative-destination
          window.location.href = "/admin/login?expired=1";
        } else if (!isAdminRoute) {
          removeCustomerToken();
        }
      }
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }

    return data;
  } catch (err: unknown) {
    const error = err as Error;
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

export const api = {
  get: <T = unknown>(endpoint: string) => request<T>(endpoint, { method: "GET" }),
  post: <T = unknown>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T = unknown>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T = unknown>(endpoint: string, body?: unknown) =>
    request<T>(endpoint, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T = unknown>(endpoint: string) => request<T>(endpoint, { method: "DELETE" }),
  upload: <T = unknown>(endpoint: string, formData: FormData) =>
    request<T>(endpoint, {
      method: "POST",
      body: formData,
    }),
};
