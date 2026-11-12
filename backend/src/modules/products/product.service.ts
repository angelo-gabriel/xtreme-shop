import { Product } from "./product.model.js";
import { Category } from "../categories/category.model.js";

import type {
  CreateProductInput,
  UpdateProductInput,
  ListProductsInput,
} from "./product.schema.js";

function generateSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createProduct(data: CreateProductInput) {
  const category = await Category.findOne({
    _id: data.categoryId,
    active: true,
  });

  if (!category) {
    throw new Error("CATEGORY_NOT_FOUND");
  }

  return Product.create({
    ...data,
    slug: generateSlug(data.name),
  });
}

export async function listProducts(filters: ListProductsInput) {
  const { page, limit, search, categoryId, minPrice, maxPrice, active, sort } =
    filters;

  const query: Record<string, any> = {};

  // Pesquisa por nome ou descrição
  if (search) {
    query.$text = {
      $search: search,
    };
  }

  // Filtro por categoria
  if (categoryId) {
    query.categoryId = categoryId;
  }

  // Filtro por disponibilidade
  if (active !== undefined) {
    query.active = active === "true";
  }

  // Filtro de preço
  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};

    if (minPrice !== undefined) {
      query.price.$gte = minPrice;
    }

    if (maxPrice !== undefined) {
      query.price.$lte = maxPrice;
    }
  }

  // Ordenação
  const sortOptions: Record<string, any> = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    name_asc: { name: 1 },
  };

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("categoryId", "name slug")
      .sort(sortOptions[sort])
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Product.countDocuments(query),
  ]);

  return {
    data: products,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProductById(id: string) {
  return Product.findById(id).populate("categoryId", "name slug").lean();
}

export async function updateProduct(id: string, data: UpdateProductInput) {
  if (data.categoryId) {
    const category = await Category.findOne({
      _id: data.categoryId,
      active: true,
    });

    if (!category) {
      throw new Error("CATEGORY_NOT_FOUND");
    }
  }

  const update = {
    ...data,

    ...(data.name ? { slug: generateSlug(data.name) } : {}),
  };

  return Product.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
}

export async function deleteProduct(id: string) {
  return Product.findByIdAndDelete(id);
}
