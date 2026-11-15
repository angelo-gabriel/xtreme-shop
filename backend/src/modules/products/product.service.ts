import { redis } from "../../infra/redis.js";

import { Product } from "./product.model.js";
import { Category } from "../categories/category.model.js";

import type {
  CreateProductInput,
  UpdateProductInput,
  ListProductsInput,
} from "./product.schema.js";

const RECENTLY_VIEWED_LIMIT = 10;
const RECENTLY_VIEWED_TTL = 60 * 60 * 24 * 30;

function getRecentlyViewedKey(visitorId: string): string {
  return `products:recently-viewed:${visitorId}`;
}

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

  const query: Record<string, any> = {
    active: true,
  };

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
  // if (active !== undefined) {
  //   query.active = active === "true";
  // }

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

export async function getProductById(id: string, visitorId?: string) {
  const product = await Product.findOne({
    _id: id,
    active: true,
  })
    .populate("categoryId", "name slug")
    .lean();

  if (!product) {
    return null;
  }

  if (visitorId) {
    const key = getRecentlyViewedKey(visitorId);

    try {
      // Remove a ocorrência anterior para evitar duplicação.
      await redis.lrem(key, 0, id);

      // Adiciona o produto ao início da lista.
      await redis.lpush(key, id);

      // Mantém somente os 10 produtos mais recentes.
      await redis.ltrim(key, 0, RECENTLY_VIEWED_LIMIT - 1);

      // Expira o histórico após 30 dias de inatividade.
      await redis.expire(key, RECENTLY_VIEWED_TTL);
    } catch (error) {
      // Uma falha no histórico não deve impedir a consulta do produto.
      console.error("Erro ao registrar produto visualizado:", error);
    }
  }

  return product;
}

export async function getRecentlyViewedProducts(visitorId: string) {
  const key = getRecentlyViewedKey(visitorId);

  const productIds = await redis.lrange(key, 0, RECENTLY_VIEWED_LIMIT - 1);

  if (productIds.length === 0) {
    return [];
  }

  const products = await Product.find({
    _id: { $in: productIds },
    active: true,
  })
    .populate("categoryId", "name slug")
    .lean();

  // MongoDB não garante a ordem de retorno de $in.
  // Recuperamos a ordem original armazenada no Redis.
  const productsById = new Map(
    products.map((product) => [product._id.toString(), product]),
  );

  return productIds
    .map((id) => productsById.get(id))
    .filter((product) => product !== undefined);
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
