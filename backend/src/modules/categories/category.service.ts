import { Category } from "./category.model.js";

import { Product } from "../products/product.model.js";

import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.schema.js";

function generateSlug(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createCategory(data: CreateCategoryInput) {
  const slug = generateSlug(data.name);

  return Category.create({
    ...data,
    slug,
  });
}

export async function listCategories(
  page: number,
  limit: number,
  active?: boolean,
) {
  const filter = active === undefined ? {} : { active };

  const [categories, total] = await Promise.all([
    Category.find(filter)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),

    Category.countDocuments(filter),
  ]);

  return {
    data: categories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getCategoryById(id: string) {
  return Category.findById(id).lean();
}

export async function updateCategory(id: string, data: UpdateCategoryInput) {
  const update = {
    ...data,
    ...(data.name ? { slug: generateSlug(data.name) } : {}),
  };

  return Category.findByIdAndUpdate(id, update, {
    new: true,
    runValidators: true,
  });
}

export async function deleteCategory(id: string) {
  const category = await Category.findById(id);

  if (!category) {
    return null;
  }

  const hasProducts = await Product.exists({
    categoryId: id,
  });

  if (hasProducts) {
    throw new Error("CATEGORY_HAS_PRODUCTS");
  }

  await category.deleteOne();

  return category;
}
