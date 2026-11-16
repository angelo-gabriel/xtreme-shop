import { supabase } from "../lib/supabase";
import type { Product } from "../types/product";

const API_URL = import.meta.env.VITE_API_URL;

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  active?: boolean;
}

export interface CategoryInput {
  name: string;
  description?: string;
  active?: boolean;
}

async function adminRequest<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session?.access_token) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.session.access_token}`,
      ...options.headers,
    },
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message ?? "Não foi possível concluir a operação.");
  }

  return result as T;
}

// Produtos

export async function getAdminProducts() {
  return adminRequest<PaginatedResponse<Product>>("/products?page=1&limit=100");
}

export async function createProduct(input: ProductInput) {
  return adminRequest<Product>("/products", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  return adminRequest<Product>(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteProduct(id: string) {
  return adminRequest<void>(`/products/${id}`, {
    method: "DELETE",
  });
}

// Categorias

export async function getAdminCategories() {
  return adminRequest<PaginatedResponse<Category>>(
    "/categories?page=1&limit=100",
  );
}

export async function createCategory(input: CategoryInput) {
  return adminRequest<Category>("/categories", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function updateCategory(id: string, input: CategoryInput) {
  return adminRequest<Category>(`/categories/${id}`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteCategory(id: string) {
  return adminRequest<void>(`/categories/${id}`, {
    method: "DELETE",
  });
}
