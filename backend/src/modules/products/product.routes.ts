import type { FastifyInstance } from "fastify";

import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  listProductsSchema,
} from "./product.schema.js";

import * as ProductService from "./product.service.js";

import { requireAdmin } from "../../plugins/authentication.js";

export async function productRoutes(app: FastifyInstance) {
  // Criar produto
  app.post(
    "/",
    {
      preHandler: requireAdmin,
      schema: {
        body: createProductSchema,
      },
    },
    async (request, reply) => {
      try {
        const data = createProductSchema.parse(request.body);

        const product = await ProductService.createProduct(data);

        return reply.code(201).send(product);
      } catch (error: any) {
        if (error.code === 11000) {
          return reply.code(409).send({
            message: "Já existe um produto com esse nome.",
          });
        }

        if (error.message === "CATEGORY_NOT_FOUND") {
          return reply.code(400).send({
            message: "A categoria informada não existe ou está inativa.",
          });
        }

        throw error;
      }
    },
  );

  // Listar produtos
  app.get(
    "/",
    {
      schema: {
        querystring: listProductsSchema,
      },
    },
    async (request) => {
      const filters = listProductsSchema.parse(request.query);

      return ProductService.listProducts(filters);
    },
  );

  // Consultar produto
  app.get(
    "/:id",
    {
      schema: {
        params: productIdSchema,
      },
    },
    async (request, reply) => {
      const { id } = productIdSchema.parse(request.params);

      const product = await ProductService.getProductById(id);

      if (!product) {
        return reply.code(404).send({
          message: "Produto não encontrado.",
        });
      }

      return product;
    },
  );

  // Atualizar produto
  app.patch(
    "/:id",
    {
      preHandler: requireAdmin,
      schema: {
        params: productIdSchema,
        body: updateProductSchema,
      },
    },
    async (request, reply) => {
      try {
        const { id } = productIdSchema.parse(request.params);
        const data = updateProductSchema.parse(request.body);

        const product = await ProductService.updateProduct(id, data);

        if (!product) {
          return reply.code(404).send({
            message: "Produto não encontrado.",
          });
        }

        return product;
      } catch (error: any) {
        if (error.code === 11000) {
          return reply.code(409).send({
            message: "Já existe um produto com esse nome.",
          });
        }

        if (error.message === "CATEGORY_NOT_FOUND") {
          return reply.code(400).send({
            message: "A categoria informada não existe ou está inativa.",
          });
        }

        throw error;
      }
    },
  );

  // Excluir produto
  app.delete(
    "/:id",
    {
      preHandler: requireAdmin,
      schema: {
        params: productIdSchema,
      },
    },
    async (request, reply) => {
      const { id } = productIdSchema.parse(request.params);

      const product = await ProductService.deleteProduct(id);

      if (!product) {
        return reply.code(404).send({
          message: "Produto não encontrado.",
        });
      }

      return reply.code(204).send();
    },
  );
}
