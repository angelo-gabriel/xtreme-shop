import Fastify from "fastify";

import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";

import {
  validatorCompiler,
  serializerCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

import { env } from "./config/env.js";

import { productRoutes } from "./modules/products/product.routes.js";

import { categoryRoutes } from "./modules/categories/category.routes.js";

export async function buildApp() {
  const app = Fastify({
    logger: {
      level: env.NODE_ENV === "production" ? "info" : "debug",
      ...(env.NODE_ENV !== "production" && {
        transport: {
          target: "pino-pretty",
        },
      }),
    },
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  // CORS
  await app.register(cors, {
    origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
  });

  // Segurança HTTP
  await app.register(helmet);

  // Rate Limiting
  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // Swagger
  await app.register(swagger, {
    openapi: {
      info: {
        title: "Xtreme Shop",
        description: "API REST do projeto acadêmico de e-commerce",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(swaggerUI, {
    routePrefix: "/docs",
  });

  // Health check
  app.get("/health", async () => {
    return {
      status: "ok",
      message: "API funcionando corretamente!",
    };
  });

  await app.register(categoryRoutes, {
    prefix: "/categories",
  });

  await app.register(productRoutes, {
    prefix: "/products",
  });

  return app;
}
