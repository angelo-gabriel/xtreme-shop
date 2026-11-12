import { omit } from "zod/mini";
import { env } from "./config/env.js";

import { connectMongo } from "./infra/mongodb.js";
import { connectRedis, redis } from "./infra/redis.js";

import mongoose from "mongoose";

import { buildApp } from "./app.js";

async function start() {
  try {
    await connectMongo();
    await connectRedis();

    // Inicialização do Fastify
    const app = await buildApp();

    app.addHook("onClose", async () => {
      await redis.quit();
      await mongoose.disconnect();
    });

    await app.listen({
      port: env.PORT,
      host: "0.0.0.0",
    });

    console.log(`Servidor iniciado na porta ${env.PORT}`);
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);

    await redis.quit().catch(() => {});
    await mongoose.disconnect().catch(() => {});

    process.exit(1);
  }
}

start();
