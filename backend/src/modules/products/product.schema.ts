import { z } from "zod";

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Identificador inválido");

export const createProductSchema = z.object({
  name: z.string().min(2).max(150),

  description: z.string().min(5).max(2000),

  price: z.number().finite().positive(),

  stock: z.number().int().min(0),

  categoryId: objectIdSchema,

  images: z.array(z.string().url()).max(10).default([]),
});

export const updateProductSchema = createProductSchema
  .partial()
  .extend({
    active: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Informe pelo menos um campo para atualização",
  );

export const productIdSchema = z.object({
  id: objectIdSchema,
});

export const listProductsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  search: z.string().max(100).optional(),

  categoryId: objectIdSchema.optional(),

  minPrice: z.coerce.number().min(0).optional(),

  maxPrice: z.coerce.number().min(0).optional(),

  active: z.enum(["true", "false"]).optional(),

  sort: z
    .enum(["newest", "oldest", "price_asc", "price_desc", "name_asc"])
    .default("newest"),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export type ListProductsInput = z.infer<typeof listProductsSchema>;
