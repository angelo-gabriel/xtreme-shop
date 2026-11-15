import { api } from "../lib/api";
import { getVisitorId } from "../lib/visitor";

import type {
  Product,
  ProductFilters,
  ProductListResponse,
} from "../types/product";

export async function getProducts(
  filters: ProductFilters = {},
): Promise<ProductListResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  return api<ProductListResponse>(`/products?${params.toString()}`);
}

export async function getProductById(id: string): Promise<Product> {
  return api<Product>(`/products/${id}`, {
    headers: {
      "x-visitor-id": getVisitorId(),
    },
  });
}

export async function getRecentlyViewedProducts(): Promise<Product[]> {
  return api<Product[]>("/products/recently-viewed", {
    headers: {
      "x-visitor-id": getVisitorId(),
    },
  });
}
