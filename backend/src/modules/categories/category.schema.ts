import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(2, "O nome deve possuir pelo menos 2 caracteres")
    .max(100),

  description: z.string().max(500).optional(),
});

export const updateCategorySchema = createCategorySchema
  .partial()
  .extend({
    active: z.boolean().optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "Informe pelo menos um campo para atualização",
  );

export const categoryIdSchema = z.object({
  id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "Identificador de categoria inválido"),
});

export const listCategoriesSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  active: z.enum(["true", "false"]).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
