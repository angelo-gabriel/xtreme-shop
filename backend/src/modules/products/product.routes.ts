import type { FastifyInstance } from "fastify";

import {
  createProductSchema,
  updateProductSchema,
  productIdSchema,
  listProductsSchema,
} from "./product.schema.js";

import * as ProductService from "./product.service.js";

import { requireAdmin } from "../../plugins/authentication.js";

function getVisitorId(value: string | undefined): string | null {
  if (!value) {
    return null;
  }

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return uuidRegex.test(value) ? value : null;
}

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

  app.get("/recently-viewed", async (request, reply) => {
    const visitorHeader = request.headers["x-visitor-id"];
    const visitorId = getVisitorId(
      Array.isArray(visitorHeader) ? visitorHeader[0] : visitorHeader,
    );

    if (!visitorId) {
      return reply.code(400).send({
        message: "Identificador de visitante inválido ou não informado.",
      });
    }

    return ProductService.getRecentlyViewedProducts(visitorId);
  });

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

      const visitorHeader = request.headers["x-visitor-id"];
      const visitorId = getVisitorId(
        Array.isArray(visitorHeader) ? visitorHeader[0] : visitorHeader,
      );

      const product = await ProductService.getProductById(
        id,
        visitorId ?? undefined,
      );

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
