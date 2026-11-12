import type { FastifyInstance } from "fastify";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
  listCategoriesSchema,
} from "./category.schema.js";

import * as CategoryService from "./category.service.js";

import { requireAdmin } from "../../plugins/authentication.js";

export async function categoryRoutes(app: FastifyInstance) {
  app.post(
    "/",
    {
      preHandler: requireAdmin,
      schema: {
        body: createCategorySchema,
      },
    },
    async (request, reply) => {
      try {
        const category = await CategoryService.createCategory(
          request.body as never,
        );

        return reply.code(201).send(category);
      } catch (error: any) {
        if (error.code === 11000) {
          return reply.code(409).send({
            message: "Já existe uma categoria com esse nome.",
          });
        }

        throw error;
      }
    },
  );

  // Listar categorias
  app.get(
    "/",
    {
      schema: {
        querystring: listCategoriesSchema,
      },
    },
    async (request) => {
      const query = request.query as {
        page: number;
        limit: number;
        active?: string;
      };

      return CategoryService.listCategories(
        query.page,
        query.limit,
        query.active === undefined ? undefined : query.active === "true",
      );
    },
  );

  // Buscar categoria
  app.get(
    "/:id",
    {
      schema: {
        params: categoryIdSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      const category = await CategoryService.getCategoryById(id);

      if (!category) {
        return reply.code(404).send({
          message: "Categoria não encontrada.",
        });
      }

      return category;
    },
  );

  // Atualizar categoria
  app.patch(
    "/:id",
    {
      preHandler: requireAdmin,
      schema: {
        params: categoryIdSchema,
        body: updateCategorySchema,
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params as { id: string };

        const category = await CategoryService.updateCategory(
          id,
          request.body as never,
        );

        if (!category) {
          return reply.code(404).send({
            message: "Categoria não encontrada.",
          });
        }

        return category;
      } catch (error: any) {
        if (error.code === 11000) {
          return reply.code(409).send({
            message: "Já existe uma categoria com esse nome.",
          });
        }

        throw error;
      }
    },
  );

  app.delete(
    "/:id",
    {
      preHandler: requireAdmin,
      schema: {
        params: categoryIdSchema,
      },
    },
    async (request, reply) => {
      const { id } = request.params as { id: string };

      try {
        const category = await CategoryService.deleteCategory(id);

        if (!category) {
          return reply.code(404).send({
            message: "Categoria não encontrada.",
          });
        }

        return reply.code(204).send();
      } catch (error: any) {
        if (error.message === "CATEGORY_HAS_PRODUCTS") {
          return reply.code(409).send({
            message:
              "Não é possível excluir uma categoria que possui produtos.",
          });
        }

        throw error;
      }
    },
  );
}
